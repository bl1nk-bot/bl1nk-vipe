import { Metadata } from 'next'
import { MCPInterface } from './mcp-interface'

export const metadata: Metadata = {
  title: 'MCP Interface - Vibe Coding Platform',
  description: 'Model Context Protocol (MCP) interface for server communication',
}

export default function MCPPage() {
  return <MCPInterface />
}
