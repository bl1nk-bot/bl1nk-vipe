/**
 * MCP Client - Handles connection and communication with MCP servers
 * Implements exponential backoff reconnection strategy
 */

type MessageHandler = (message: Record<string, unknown>) => void
type ErrorHandler = (error: Error) => void

export class MCPClient {
  private serverUrl: string
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageHandlers: Set<MessageHandler> = new Set()
  private errorHandlers: Set<ErrorHandler> = new Set()
  private requestId = 0
  private pendingRequests: Map<number, { resolve: Function; reject: Function; timeout: NodeJS.Timeout }> =
    new Map()

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl
    console.log('[v0] MCPClient initialized for server:', serverUrl)
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('[v0] Attempting to connect to MCP server:', this.serverUrl)
        this.ws = new WebSocket(this.serverUrl)

        this.ws.onopen = () => {
          console.log('[v0] WebSocket connected to:', this.serverUrl)
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = event => {
          try {
            const message = JSON.parse(event.data)
            console.log('[v0] Received message from server:', message)

            // Check if this is a response to a pending request
            if (message.id && this.pendingRequests.has(message.id)) {
              const pending = this.pendingRequests.get(message.id)
              if (pending) {
                clearTimeout(pending.timeout)
                if (message.error) {
                  pending.reject(new Error(message.error))
                } else {
                  pending.resolve(message.result)
                }
                this.pendingRequests.delete(message.id)
              }
            }

            // Notify all message handlers
            this.messageHandlers.forEach(handler => {
              try {
                handler(message)
              } catch (err) {
                console.error('[v0] Error in message handler:', err)
              }
            })
          } catch (err) {
            console.error('[v0] Error parsing message:', err)
          }
        }

        this.ws.onerror = event => {
          const error = new Error('WebSocket error: ' + event)
          console.error('[v0] WebSocket error:', error)
          this.errorHandlers.forEach(handler => handler(error))
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('[v0] WebSocket closed')
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect()
          }
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    console.log('[v0] Scheduling reconnect in', delay, 'ms (attempt', this.reconnectAttempts, ')')

    setTimeout(() => {
      this.connect().catch(err => {
        console.error('[v0] Reconnection failed:', err)
      })
    }, delay)
  }

  async executeRequest(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('MCP client not connected')
    }

    return new Promise((resolve, reject) => {
      const id = ++this.requestId
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params,
      }

      // Set a 30-second timeout for the request
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id)
        reject(new Error(`Request ${method} timed out after 30 seconds`))
      }, 30000)

      this.pendingRequests.set(id, { resolve, reject, timeout })

      try {
        this.ws!.send(JSON.stringify(request))
        console.log('[v0] Sent MCP request:', request)
      } catch (err) {
        this.pendingRequests.delete(id)
        clearTimeout(timeout)
        reject(err)
      }
    })
  }

  subscribe(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler)
    return () => this.errorHandlers.delete(handler)
  }

  disconnect(): void {
    if (this.ws) {
      console.log('[v0] Closing WebSocket connection')
      this.ws.close()
      this.ws = null
    }

    // Clear pending requests
    this.pendingRequests.forEach(({ timeout }) => clearTimeout(timeout))
    this.pendingRequests.clear()

    this.messageHandlers.clear()
    this.errorHandlers.clear()
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    if (!this.ws) return 'disconnected'
    if (this.ws.readyState === WebSocket.OPEN) return 'connected'
    if (this.ws.readyState === WebSocket.CONNECTING) return 'connecting'
    return 'disconnected'
  }
}
