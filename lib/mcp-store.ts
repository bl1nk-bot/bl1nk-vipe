import { create } from 'zustand'

export interface MCPRequest {
  timestamp: number
  method: string
  params: Record<string, unknown>
}

export interface MCPResponse {
  timestamp: number
  data: Record<string, unknown>
  error?: string
}

export interface MCPHistoryEntry {
  id: string
  timestamp: number
  request: MCPRequest
  response: MCPResponse
}

interface MCPState {
  // Connection state
  selectedServer: string | null
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
  connectionError: string | null

  // Request/Response state
  lastRequest: MCPRequest | null
  lastResponse: MCPResponse | null
  responseHistory: MCPHistoryEntry[]
  isLoading: boolean

  // Available servers (mock data for demo)
  availableServers: Array<{
    id: string
    name: string
    url: string
    description: string
  }>

  // Actions
  setSelectedServer: (server: string) => void
  setConnectionStatus: (status: MCPState['connectionStatus']) => void
  setConnectionError: (error: string | null) => void
  addToHistory: (request: MCPRequest, response: MCPResponse) => void
  clearHistory: () => void
  setLoading: (loading: boolean) => void
  setLastRequest: (request: MCPRequest) => void
  setLastResponse: (response: MCPResponse) => void
}

export const useMCPStore = create<MCPState>(set => ({
  selectedServer: null,
  connectionStatus: 'disconnected',
  connectionError: null,
  lastRequest: null,
  lastResponse: null,
  responseHistory: [],
  isLoading: false,
  availableServers: [
    {
      id: 'stdio-1',
      name: 'Local Stdio Server',
      url: 'stdio://localhost:9000',
      description: 'Local MCP server via stdio transport',
    },
    {
      id: 'sse-1',
      name: 'SSE Server',
      url: 'http://localhost:3001',
      description: 'Server-sent events based MCP server',
    },
    {
      id: 'demo-1',
      name: 'Demo Server',
      url: 'http://demo-mcp.localhost:8000',
      description: 'Demo MCP server for testing',
    },
  ],

  setSelectedServer: server => set({ selectedServer: server }),
  setConnectionStatus: status => set({ connectionStatus: status }),
  setConnectionError: error => set({ connectionError: error }),
  addToHistory: (request, response) =>
    set(state => ({
      responseHistory: [
        ...state.responseHistory,
        {
          id: `${Date.now()}-${Math.random()}`,
          request,
          response,
        },
      ].slice(-50), // Keep last 50 requests
      lastRequest: request,
      lastResponse: response,
    })),
  clearHistory: () => set({ responseHistory: [], lastRequest: null, lastResponse: null }),
  setLoading: loading => set({ isLoading: loading }),
  setLastRequest: request => set({ lastRequest: request }),
  setLastResponse: response => set({ lastResponse: response }),
}))
