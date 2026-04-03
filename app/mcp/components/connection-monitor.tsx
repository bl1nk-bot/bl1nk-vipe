'use client'

import { useMCPStore } from '@/lib/mcp-store'
import { useMobile } from '@/hooks/use-mobile'

export function ConnectionMonitor() {
  const { isMobile } = useMobile()
  const store = useMCPStore()

  const statusDetails = {
    connected: {
      label: 'Connected',
      color: 'text-green-700 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      icon: '●',
    },
    connecting: {
      label: 'Connecting',
      color: 'text-blue-700 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      icon: '◐',
    },
    error: {
      label: 'Connection Error',
      color: 'text-red-700 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      icon: '✕',
    },
    disconnected: {
      label: 'Disconnected',
      color: 'text-gray-700 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      borderColor: 'border-gray-200 dark:border-gray-800',
      icon: '○',
    },
  }

  const status = statusDetails[store.connectionStatus]

  return (
    <div className={`flex flex-col ${isMobile ? 'gap-3' : 'gap-4'}`}>
      <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>Connection Status</h3>

      <div className={`border rounded-lg p-4 ${status.bgColor} ${status.borderColor}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-2xl ${status.color} ${store.connectionStatus === 'connecting' ? 'animate-spin' : ''}`}>
            {status.icon}
          </span>
          <div>
            <div className={`font-semibold ${status.color}`}>{status.label}</div>
            {store.selectedServer && (
              <div className={`text-sm ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                {store.availableServers.find(s => s.id === store.selectedServer)?.name}
              </div>
            )}
          </div>
        </div>

        {/* Server Details */}
        {store.selectedServer && (
          <div className={`space-y-2 text-sm ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <div>
              <span className="font-medium">Server URL:</span>
              <div className="break-all text-muted-foreground">
                {store.availableServers.find(s => s.id === store.selectedServer)?.url}
              </div>
            </div>

            <div>
              <span className="font-medium">Request Count:</span>
              <span className="text-muted-foreground ml-2">{store.responseHistory.length}</span>
            </div>

            {store.responseHistory.length > 0 && (
              <>
                <div>
                  <span className="font-medium">Last Request:</span>
                  <div className="text-muted-foreground">
                    {store.responseHistory[store.responseHistory.length - 1].request.method}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Last Response Time:</span>
                  <div className="text-muted-foreground">
                    {new Date(
                      store.responseHistory[store.responseHistory.length - 1].response.timestamp
                    ).toLocaleTimeString()}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Error Details */}
        {store.connectionError && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 rounded border border-red-300 dark:border-red-700">
            <div className={`font-medium text-red-900 dark:text-red-100 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Error Details
            </div>
            <div className={`text-red-800 dark:text-red-200 mt-1 break-words ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {store.connectionError}
            </div>
          </div>
        )}

        {/* Loading State */}
        {store.isLoading && (
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded border border-blue-300 dark:border-blue-700">
            <div className={`text-blue-900 dark:text-blue-100 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Processing request...
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      {store.responseHistory.length > 0 && (
        <div className={`grid grid-cols-2 gap-2 ${isMobile ? '' : 'gap-3'}`}>
          <div className="p-3 bg-secondary rounded border">
            <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Total Requests</div>
            <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>{store.responseHistory.length}</div>
          </div>
          <div className="p-3 bg-secondary rounded border">
            <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Successful</div>
            <div className={`font-bold text-green-600 dark:text-green-400 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {store.responseHistory.filter(r => !r.response.error).length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
