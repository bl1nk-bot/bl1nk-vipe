# MCP Interface API Documentation

## Overview

The MCP (Model Context Protocol) Interface provides a comprehensive interface for connecting to and communicating with MCP servers. The implementation includes client-side state management, request/response handling, and real-time connection monitoring.

---

## Store API (useMCPStore)

### Usage

```typescript
import { useMCPStore } from '@/lib/mcp-store'

const store = useMCPStore()
```

### State Properties

#### `selectedServer: string | null`
Currently selected MCP server ID.

```typescript
const serverId = store.selectedServer
store.setSelectedServer('stdio-1')
```

#### `connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'`
Current connection state.

```typescript
if (store.connectionStatus === 'connected') {
  // Safe to send requests
}
```

#### `connectionError: string | null`
Latest connection error message.

```typescript
if (store.connectionError) {
  console.error('Connection failed:', store.connectionError)
}
```

#### `lastRequest: MCPRequest | null`
Most recent request sent.

```typescript
type MCPRequest = {
  timestamp: number
  method: string
  params: Record<string, unknown>
}
```

#### `lastResponse: MCPResponse | null`
Most recent response received.

```typescript
type MCPResponse = {
  timestamp: number
  data: Record<string, unknown>
  error?: string
}
```

#### `responseHistory: MCPHistoryEntry[]`
Array of last 50 requests/responses.

```typescript
type MCPHistoryEntry = {
  id: string
  request: MCPRequest
  response: MCPResponse
}

// Iterate through history
store.responseHistory.forEach(entry => {
  console.log(entry.request.method, entry.response.data)
})
```

#### `isLoading: boolean`
Request in progress.

```typescript
{store.isLoading && <LoadingSpinner />}
```

#### `availableServers: Array<{id, name, url, description}>`
List of preconfigured MCP servers.

```typescript
store.availableServers.map(server => (
  <ServerOption key={server.id} server={server} />
))
```

---

### State Mutations

#### `setSelectedServer(server: string)`
Select an MCP server.

```typescript
store.setSelectedServer('sse-1')
```

#### `setConnectionStatus(status)`
Update connection status (internal use).

```typescript
store.setConnectionStatus('connecting')
```

#### `setConnectionError(error: string | null)`
Set connection error message.

```typescript
store.setConnectionError('WebSocket connection failed')
```

#### `addToHistory(request, response)`
Add request/response to history. Automatically called by executeMCPRequest.

```typescript
store.addToHistory(request, response)
```

#### `clearHistory()`
Clear all request history.

```typescript
store.clearHistory()
```

#### `setLoading(loading: boolean)`
Update loading state (internal use).

```typescript
store.setLoading(true)
```

---

## Client API (MCPClient)

### Usage

```typescript
import { MCPClient } from '@/lib/mcp-client'

const client = new MCPClient('http://localhost:3000')
await client.connect()
const result = await client.executeRequest('list_tools')
```

### Methods

#### `constructor(serverUrl: string)`
Create a new MCP client.

```typescript
const client = new MCPClient('http://mcp-server:8000')
```

#### `connect(): Promise<void>`
Connect to the MCP server. Implements exponential backoff reconnection (max 5 attempts).

```typescript
try {
  await client.connect()
  console.log('Connected!')
} catch (err) {
  console.error('Failed to connect:', err)
}
```

#### `executeRequest(method: string, params?: Record): Promise<unknown>`
Send a request to the MCP server. 30-second timeout per request.

```typescript
const result = await client.executeRequest('tools/list', {})

const toolResult = await client.executeRequest('tools/call', {
  name: 'tool_name',
  arguments: { arg1: 'value' }
})
```

#### `subscribe(handler: MessageHandler): () => void`
Subscribe to all messages from server.

```typescript
const unsubscribe = client.subscribe(message => {
  console.log('Received:', message)
})

// Unsubscribe when done
unsubscribe()
```

#### `onError(handler: ErrorHandler): () => void`
Subscribe to connection errors.

```typescript
client.onError(error => {
  console.error('Connection error:', error.message)
})
```

#### `disconnect(): void`
Close connection and cleanup.

```typescript
client.disconnect()
```

#### `isConnected(): boolean`
Check if connected.

```typescript
if (client.isConnected()) {
  // Can send requests
}
```

#### `getConnectionStatus(): 'connected' | 'connecting' | 'disconnected'`
Get detailed connection status.

```typescript
const status = client.getConnectionStatus()
```

---

## Executor API (lib/mcp-executor.ts)

High-level API for MCP operations with automatic state management.

### `getMCPClient(serverUrl: string): Promise<MCPClient>`
Get or create MCP client for a server. Handles connection switching.

```typescript
const client = await getMCPClient('http://localhost:3000')
```

### `executeMCPRequest(serverUrl, method, params): Promise<{success, data?, error?}>`
Execute an MCP request with automatic state management.

```typescript
const result = await executeMCPRequest(
  'http://localhost:3000',
  'list_resources',
  {}
)

if (result.success) {
  console.log('Resources:', result.data)
} else {
  console.error('Error:', result.error)
}
```

**Features:**
- Automatic state update
- Error handling
- History logging
- Connection status management

### `disconnectMCP(): Promise<void>`
Disconnect from MCP server and reset state.

```typescript
await disconnectMCP()
```

### `resetMCPStore(): void`
Clear all MCP store state.

```typescript
resetMCPStore()
```

---

## Component Usage Examples

### ServerManager Component

```typescript
import { ServerManager } from '@/app/mcp/components/server-manager'

function MyPage() {
  return (
    <div>
      <ServerManager />
    </div>
  )
}
```

**Features:**
- Display available servers
- Handle server selection
- Show connection status
- Display connection errors

### RequestBuilder Component

```typescript
import { RequestBuilder } from '@/app/mcp/components/request-builder'

function MyPage() {
  return (
    <div>
      <RequestBuilder />
    </div>
  )
}
```

**Features:**
- Method selection dropdown
- Custom method name input
- JSON parameter editor
- Request validation
- Submit button with loading state

### ResponseDisplay Component

```typescript
import { ResponseDisplay } from '@/app/mcp/components/response-display'

function MyPage() {
  return (
    <div>
      <ResponseDisplay />
    </div>
  )
}
```

**Features:**
- Expandable response entries
- Request/response display
- Copy to clipboard
- Clear history
- Empty state message

### ConnectionMonitor Component

```typescript
import { ConnectionMonitor } from '@/app/mcp/components/connection-monitor'

function MyPage() {
  return (
    <div>
      <ConnectionMonitor />
    </div>
  )
}
```

**Features:**
- Connection status indicator
- Server details
- Request statistics
- Error details
- Loading state

---

## Complete Integration Example

```typescript
'use client'

import { useMCPStore } from '@/lib/mcp-store'
import { executeMCPRequest, disconnectMCP } from '@/lib/mcp-executor'
import { useState } from 'react'

export function MyMCPComponent() {
  const store = useMCPStore()
  const [method, setMethod] = useState('')

  const handleConnect = async (serverId: string) => {
    const server = store.availableServers.find(s => s.id === serverId)
    if (!server) return

    store.setSelectedServer(serverId)
    store.setConnectionStatus('connecting')

    try {
      const result = await executeMCPRequest(server.url, 'server/info')
      if (result.success) {
        store.setConnectionStatus('connected')
      }
    } catch (err) {
      store.setConnectionError('Failed to connect')
    }
  }

  const handleRequest = async () => {
    if (!store.selectedServer || !method) return

    const server = store.availableServers.find(s => s.id === store.selectedServer)
    if (!server) return

    const result = await executeMCPRequest(server.url, method)
    console.log('Response:', result)
  }

  const handleDisconnect = async () => {
    await disconnectMCP()
  }

  return (
    <div>
      <select onChange={e => handleConnect(e.target.value)}>
        {store.availableServers.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      {store.connectionStatus === 'connected' && (
        <>
          <input
            value={method}
            onChange={e => setMethod(e.target.value)}
            placeholder="Method name"
          />
          <button onClick={handleRequest} disabled={store.isLoading}>
            {store.isLoading ? 'Sending...' : 'Send'}
          </button>
          <button onClick={handleDisconnect}>Disconnect</button>

          <pre>{JSON.stringify(store.lastResponse, null, 2)}</pre>
        </>
      )}
    </div>
  )
}
```

---

## Error Handling

### Connection Errors

```typescript
if (store.connectionError) {
  return (
    <div className="error">
      <h3>Connection Failed</h3>
      <p>{store.connectionError}</p>
      <button onClick={() => store.setConnectionError(null)}>
        Dismiss
      </button>
    </div>
  )
}
```

### Request Errors

```typescript
const result = await executeMCPRequest(url, method, params)

if (!result.success) {
  console.error('Request failed:', result.error)
  // Handle error appropriately
}
```

### Timeout Handling

Requests timeout after 30 seconds. Handle with:

```typescript
try {
  const result = await executeMCPRequest(url, method)
} catch (err) {
  if (err.message.includes('timeout')) {
    // Handle timeout
  }
}
```

---

## Mobile Considerations

### Using useMobile Hook

```typescript
import { useMobile } from '@/hooks/use-mobile'

function MyComponent() {
  const { isMobile, isTablet, screenWidth } = useMobile()

  return (
    <div className={isMobile ? 'gap-2' : 'gap-4'}>
      {isMobile && <CompactLayout />}
      {!isMobile && <ExpandedLayout />}
    </div>
  )
}
```

### Touch Target Sizing

```typescript
<button
  className={`
    ${isMobile ? 'h-11 px-4' : 'h-10 px-3'}
    min-h-[44px]
    touch-manipulation
  `}
>
  Action
</button>
```

---

## Testing

### Unit Tests

```typescript
import { renderHook, act } from '@testing-library/react'
import { useMCPStore } from '@/lib/mcp-store'

test('should set selected server', () => {
  const { result } = renderHook(() => useMCPStore())

  act(() => {
    result.current.setSelectedServer('stdio-1')
  })

  expect(result.current.selectedServer).toBe('stdio-1')
})
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test('should connect to MCP server', async ({ page }) => {
  await page.goto('/mcp')

  const serverItem = page.locator('[data-testid="server-item"]').first()
  await serverItem.click()

  const status = page.locator('[data-testid="connection-status"]')
  await expect(status).toHaveAttribute('data-status', 'connecting')
})
```

---

## Debugging

Enable debug logs in development:

```typescript
// In browser console
localStorage.setItem('debug', '*')

// Check store state
const store = window.__mcp_store
console.log(store.getState())
```

All MCP operations log with `[v0]` prefix for easy filtering in console.

---

## Performance Notes

- Requests timeout after 30 seconds
- History limited to last 50 requests
- Automatic reconnection with exponential backoff
- Messages cached in memory (not persisted)
- Connection reused across multiple requests

---

## Security Notes

- Never store tokens in localStorage
- Always validate server URLs
- Sanitize user input in requests
- Use HTTPS in production
- Implement rate limiting
- Validate responses from server
