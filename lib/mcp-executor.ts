/**
 * MCP Executor - High-level interface for executing MCP requests
 * Handles client lifecycle, request/response logging, and error handling
 */

import { MCPClient } from './mcp-client'
import { useMCPStore, type MCPRequest, type MCPResponse } from './mcp-store'

let clientInstance: MCPClient | null = null
let currentServerUrl: string | null = null

export async function getMCPClient(serverUrl: string): Promise<MCPClient> {
  // Disconnect from previous server if different
  if (currentServerUrl && currentServerUrl !== serverUrl && clientInstance) {
    console.log('[v0] Switching to different MCP server')
    clientInstance.disconnect()
    clientInstance = null
  }

  // Reuse existing connection if same server
  if (clientInstance && currentServerUrl === serverUrl && clientInstance.isConnected()) {
    return clientInstance
  }

  // Create new client and connect
  clientInstance = new MCPClient(serverUrl)
  currentServerUrl = serverUrl

  try {
    await clientInstance.connect()
  } catch (err) {
    console.error('[v0] Failed to connect MCPClient:', err)
    throw err
  }

  return clientInstance
}

export async function executeMMCRequest(
  serverUrl: string,
  method: string,
  params: Record<string, unknown> = {}
): Promise<{
  success: boolean
  data?: unknown
  error?: string
}> {
  const store = useMCPStore.getState()
  const startTime = Date.now()

  // Create request object for logging
  const request: MCPRequest = {
    timestamp: startTime,
    method,
    params,
  }

  try {
    store.setLoading(true)
    store.setConnectionStatus('connecting')

    console.log('[v0] Executing MCP request:', method, params)
    const client = await getMCPClient(serverUrl)

    const result = await client.executeRequest(method, params)
    const duration = Date.now() - startTime

    // Create response object
    const response: MCPResponse = {
      timestamp: Date.now(),
      data: result as Record<string, unknown>,
    }

    // Log to history
    store.addToHistory(request, response)
    store.setConnectionStatus('connected')
    store.setConnectionError(null)

    console.log('[v0] MCP request succeeded in', duration, 'ms:', result)

    return {
      success: true,
      data: result,
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    const duration = Date.now() - startTime

    // Create error response
    const response: MCPResponse = {
      timestamp: Date.now(),
      data: {},
      error: errorMsg,
    }

    // Log to history
    store.addToHistory(request, response)
    store.setConnectionStatus('error')
    store.setConnectionError(errorMsg)

    console.error('[v0] MCP request failed after', duration, 'ms:', errorMsg)

    return {
      success: false,
      error: errorMsg,
    }
  } finally {
    store.setLoading(false)
  }
}

export async function disconnectMCP(): Promise<void> {
  if (clientInstance) {
    console.log('[v0] Disconnecting MCP client')
    clientInstance.disconnect()
    clientInstance = null
    currentServerUrl = null

    const store = useMCPStore.getState()
    store.setConnectionStatus('disconnected')
    store.setConnectionError(null)
  }
}

export function resetMCPStore(): void {
  const store = useMCPStore.getState()
  store.clearHistory()
  store.setSelectedServer(null)
  store.setConnectionStatus('disconnected')
  store.setConnectionError(null)
}
