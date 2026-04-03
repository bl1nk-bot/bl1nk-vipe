'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMCPStore } from '@/lib/mcp-store'
import { executeMMCRequest, disconnectMCP } from '@/lib/mcp-executor'
import { useMobile } from '@/hooks/use-mobile'

export function ServerManager() {
  const { isMobile } = useMobile()
  const store = useMCPStore()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleServerSelect = async (serverId: string) => {
    const server = store.availableServers.find(s => s.id === serverId)
    if (!server) return

    try {
      setIsConnecting(true)
      store.setSelectedServer(serverId)
      store.setConnectionStatus('connecting')

      console.log('[v0] Connecting to MCP server:', server.url)

      // Execute a simple request to verify connection
      const result = await executeMMCRequest(server.url, 'tools/list')

      if (result.success) {
        console.log('[v0] MCP server connected successfully')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect'
      store.setConnectionError(errorMsg)
      console.error('[v0] Failed to connect to MCP server:', err)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    await disconnectMCP()
  }

  return (
    <div className={`flex flex-col ${isMobile ? 'gap-3' : 'gap-4'}`}>
      <div>
        <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'} mb-2`}>MCP Servers</h3>
        <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Select a server to connect</p>
      </div>

      <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-3'}`} data-testid="server-list">
        {store.availableServers.map(server => (
          <button
            key={server.id}
            data-testid="server-item"
            onClick={() => handleServerSelect(server.id)}
            disabled={isConnecting}
            className={`
              p-3 rounded-lg border transition-all
              ${
                store.selectedServer === server.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:bg-accent'
              }
              ${isConnecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              text-left
              ${isMobile ? 'text-sm' : 'text-base'}
              touch-manipulation h-auto min-h-[44px]
            `}
          >
            <div className="font-medium">{server.name}</div>
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>{server.url}</div>
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>{server.description}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {store.selectedServer && (
          <>
            <div
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md
                ${
                  store.connectionStatus === 'connected'
                    ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                    : store.connectionStatus === 'connecting'
                      ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      : store.connectionStatus === 'error'
                        ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                        : 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
                }
              `}
              data-testid="connection-status"
              data-status={store.connectionStatus}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  store.connectionStatus === 'connected'
                    ? 'bg-green-500'
                    : store.connectionStatus === 'connecting'
                      ? 'bg-blue-500 animate-pulse'
                      : store.connectionStatus === 'error'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                }`}
              />
              <span className={isMobile ? 'text-xs' : 'text-sm'} style={{ textTransform: 'capitalize' }}>
                {store.connectionStatus === 'connecting' && 'Connecting...'}
                {store.connectionStatus === 'connected' && 'Connected'}
                {store.connectionStatus === 'error' && 'Connection Error'}
                {store.connectionStatus === 'disconnected' && 'Disconnected'}
              </span>
            </div>

            {store.connectionError && (
              <div
                className={`
                  bg-red-500/10 text-red-700 dark:text-red-400
                  p-3 rounded-md border border-red-200 dark:border-red-800
                  ${isMobile ? 'text-xs' : 'text-sm'}
                `}
                data-testid="error-message"
              >
                {store.connectionError}
              </div>
            )}

            <Button
              onClick={handleDisconnect}
              disabled={isConnecting}
              variant="outline"
              className={isMobile ? 'h-10 text-sm' : 'h-11'}
            >
              Disconnect
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
