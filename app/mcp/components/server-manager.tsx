'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMCPStore } from '@/lib/mcp-store'
import { executeMCPRequest, disconnectMCP } from '@/lib/mcp-executor'

export function ServerManager() {
  const store = useMCPStore()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleServerSelect = async (serverId: string) => {
    const server = store.availableServers.find(s => s.id === serverId)
    if (!server) return

    try {
      setIsConnecting(true)
      store.setSelectedServer(serverId)
      store.setConnectionStatus('connecting')
      const result = await executeMCPRequest(server.url, 'tools/list')
      if (result.success) {
        store.setConnectionStatus('connected')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect'
      store.setConnectionError(errorMsg)
      store.setConnectionStatus('error')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    await disconnectMCP()
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div>
        <h3 className="font-semibold text-base sm:text-lg mb-1">MCP Servers</h3>
        <p className="text-muted-foreground text-xs sm:text-sm">Select a server to connect</p>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3" data-testid="server-list">
        {store.availableServers.map(server => (
          <button
            key={server.id}
            data-testid="server-item"
            onClick={() => handleServerSelect(server.id)}
            disabled={isConnecting}
            type="button"
            className={`
              p-3 rounded-lg border transition-colors text-left
              touch-manipulation min-h-[44px]
              text-sm sm:text-base
              ${store.selectedServer === server.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:bg-accent'}
              ${isConnecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="font-medium">{server.name}</div>
            <div className="text-xs sm:text-sm text-muted-foreground truncate">{server.url}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{server.description}</div>
          </button>
        ))}
      </div>

      {store.selectedServer && (
        <div className="flex flex-col gap-2 mt-1">
          <div
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm
              ${store.connectionStatus === 'connected' ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                : store.connectionStatus === 'connecting' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                : store.connectionStatus === 'error' ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                : 'bg-muted text-muted-foreground'}
            `}
            data-testid="connection-status"
            data-status={store.connectionStatus}
          >
            <span
              className={`h-2 w-2 rounded-full shrink-0
                ${store.connectionStatus === 'connected' ? 'bg-green-500'
                  : store.connectionStatus === 'connecting' ? 'bg-blue-500 animate-pulse'
                  : store.connectionStatus === 'error' ? 'bg-red-500'
                  : 'bg-gray-500'}
              `}
              aria-hidden="true"
            />
            <span className="capitalize">
              {store.connectionStatus === 'connecting' ? 'Connecting...' : store.connectionStatus}
            </span>
          </div>

          {store.connectionError && (
            <div
              className="bg-red-500/10 text-red-700 dark:text-red-400 p-3 rounded-md border border-red-200 dark:border-red-800 text-xs sm:text-sm break-words"
              data-testid="error-message"
              role="alert"
            >
              {store.connectionError}
            </div>
          )}

          <Button
            onClick={handleDisconnect}
            disabled={isConnecting}
            variant="outline"
            className="h-10 sm:h-11 touch-manipulation"
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  )
}
