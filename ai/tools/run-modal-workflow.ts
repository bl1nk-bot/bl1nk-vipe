import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { getRichError } from './get-rich-error'
import { tool } from 'ai'
import description from './run-modal-workflow.md'
import z from 'zod/v3'

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export const runModalWorkflow = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      workflowType: z
        .enum(['issue', 'pr', 'notebook'])
        .describe('ประเภทของ Heavy Compute workflow ที่ต้องการนำไปรันบน Modal Container'),
      repo: z
        .string()
        .optional()
        .describe('ชื่อ GitHub repository (เช่น owner/repo) จำเป็นสำหรับ workflow แบบ issue และ pr'),
      issueNumber: z
        .number()
        .optional()
        .describe('หมายเลข GitHub issue จำเป็นสำหรับ workflow แบบ issue'),
      prNumber: z
        .number()
        .optional()
        .describe('หมายเลข GitHub PR จำเป็นสำหรับ workflow แบบ pr'),
      notebookPath: z
        .string()
        .optional()
        .describe('พาร์ทของไฟล์ Jupyter notebook จำเป็นสำหรับ workflow แบบ notebook'),
      parameters: z
        .record(z.any())
        .optional()
        .describe('พารามิเตอร์เพิ่มเติมสำหรับการรัน Data Science Notebook'),
    }),
    execute: async (
      { workflowType, repo, issueNumber, prNumber, notebookPath, parameters },
      { toolCallId }
    ) => {
      // แจ้ง UI ว่ากำลังเริ่มส่งงานไปที่ Modal (คุณอาจจะต้องเพิ่มไทป์ data-run-modal ลงใน data-parts.ts)
      writer.write({
        id: toolCallId,
        type: 'data-run-command', // ใช้ data-run-command ชั่วคราวเพื่อให้ UI เดิมรองรับได้เลย
        data: { 
          sandboxId: 'modal-heavy-compute', 
          command: `[Modal ${workflowType.toUpperCase()}]`, 
          args: [repo || notebookPath || ''], 
          status: 'executing' 
        },
      })

      // ดึง URL และ Secret ของ Modal Built-in MCP จาก Environment
      const modalUrl = process.env.MODAL_MCP_URL
      const secretKey = process.env.INTERNAL_MCP_SECRET_KEY

      if (!modalUrl || !secretKey) {
        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId: 'modal-heavy-compute',
            command: '[Modal Error]',
            args: [],
            error: { message: 'MODAL_MCP_URL or INTERNAL_MCP_SECRET_KEY is not configured' },
            status: 'error',
          },
        })
        return "System Error: MODAL_MCP_URL or INTERNAL_MCP_SECRET_KEY is not configured in .env"
      }

      try {
        // ยิง request ไปหา Python FastAPI บน Modal พร้อม Auth Token
        const response = await fetch(`${modalUrl}/api/workflows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secretKey}` // MCP Auth Handshake
          },
          body: JSON.stringify({
            workflow_type: workflowType,
            repo,
            issue_number: issueNumber,
            pr_number: prNumber,
            notebook_path: notebookPath,
            parameters
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Modal API Error (${response.status}): ${errorText}`)
        }

        const result = await response.json()

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId: 'modal-heavy-compute',
            commandId: result.workflow_id,
            command: `[Modal ${workflowType.toUpperCase()}]`,
            args: [],
            exitCode: 0,
            status: 'done',
          },
        })

        // คืนค่าผลลัพธ์กลับให้ AI Agent รับรู้
        return (
          `Workflow \`${workflowType}\` has been successfully executed on Modal Built-in MCP.\n` +
          `Execution Time: ${result.duration_seconds}s\n` +
          `Result Summary:\n` +
          `\`\`\`json\n${JSON.stringify(result.result, null, 2)}\n\`\`\``
        )

      } catch (error) {
        const richError = getRichError({
          action: 'execute workflow on Modal Built-in MCP',
          args: { workflowType, repo },
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId: 'modal-heavy-compute',
            command: `[Modal Error]`,
            args: [],
            error: richError.error,
            status: 'error',
          },
        })

        return richError.message
      }
    },
  })