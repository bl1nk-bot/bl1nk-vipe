import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { getRichError } from './get-rich-error'
import { tool } from 'ai'
import description from './run-modal-workflow.md'
import { z } from 'zod'

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export const runModalWorkflow = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: z.discriminatedUnion('workflowType', [
      z.object({
        workflowType: z.literal('issue'),
        repo: z.string().describe('GitHub repository (e.g., owner/repo)'),
        issueNumber: z.number().describe('GitHub issue number'),
        parameters: z.record(z.any()).optional().describe('Additional parameters for the workflow'),
      }),
      z.object({
        workflowType: z.literal('pr'),
        repo: z.string().describe('GitHub repository (e.g., owner/repo)'),
        prNumber: z.number().describe('GitHub PR number'),
        parameters: z.record(z.any()).optional().describe('Additional parameters for the workflow'),
      }),
      z.object({
        workflowType: z.literal('notebook'),
        notebookPath: z.string().describe('Path to Jupyter notebook file'),
        parameters: z.record(z.any()).optional().describe('Additional parameters for Data Science Notebook'),
      }),
    ]),
    execute: async (input, { toolCallId }) => {
      const params = input as {
        workflowType: 'issue' | 'pr' | 'notebook'
        repo?: string
        issueNumber?: number
        prNumber?: number
        notebookPath?: string
        parameters?: Record<string, any>
      }
      const { workflowType, repo, issueNumber, prNumber, notebookPath, parameters } = params
      writer.write({
        id: toolCallId,
        type: 'data-run-command',
        data: {
          sandboxId: 'modal-heavy-compute',
          commandId: toolCallId,
          command: `[Modal ${workflowType.toUpperCase()}]`,
          args: workflowType === 'notebook' ? [notebookPath || ''] : [repo || ''],
          status: 'executing',
        },
      })

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
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 300_000) // 5 min timeout

        const response = await fetch(`${modalUrl}/api/workflows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secretKey}`,
          },
          body: JSON.stringify({
            workflow_type: workflowType,
            repo,
            issue_number: issueNumber,
            pr_number: prNumber,
            notebook_path: notebookPath,
            parameters,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Modal API Error (${response.status}): ${errorText}`)
        }

        const rawResult = await response.json()
        const result = z.object({
          workflow_id: z.string(),
          duration_seconds: z.number(),
          result: z.unknown(),
        }).parse(rawResult)

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

        return (
          `Workflow \`${workflowType}\` has been successfully executed on Modal Built-in MCP.\n` +
          `Execution Time: ${result.duration_seconds}s\n` +
          `Result Summary:\n` +
          `\`\`\`json\n${JSON.stringify(result.result, null, 2)}\n\`\`\``
        )
      } catch (error) {
        const richError = getRichError({
          action: 'execute workflow on Modal Built-in MCP',
          args: { workflowType, repo, issueNumber, prNumber, notebookPath },
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId: 'modal-heavy-compute',
            command: `[Modal Error]`,
            args: [],
            error: { message: richError.error.message },
            status: 'error',
          },
        })

        return `Failed to execute workflow: ${richError.error.message}`
      }
    },
  })