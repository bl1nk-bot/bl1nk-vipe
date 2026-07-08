'use client'
import { useMobile } from '@/hooks/use-mobile'

import { useMCPStore } from '@/lib/mcp-store'

const statusConfig = {
  connected: { label: 'Connected', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-200 dark:border-green-800', dot: 'bg-green-500' },
  connecting: { label: 'Connecting', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-500 animate-pulse' },
  error: { label: 'Error', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-500' },
  disconnected: { label: 'Disconnected', color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border', dot: 'bg-gray-500' },
} as const

export function ConnectionMonitor() {
  const { isMobile } = useMobile()
  const store = useMCPStore()
  const status = statusConfig[store.connectionStatus]
  const selectedServerInfo = store.availableServers.find(s => s.id === store.selectedServer)
  const successCount = store.responseHistory.filter(r => !r.response.error).length
  const lastEntry = store.responseHistory.at(-1)

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <h3 className="font-semibold text-base sm:text-lg">Connection Status</h3>

      <div className={`border rounded-lg p-4 ${status.bg} ${status.border}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className={`h-3 w-3 rounded-full shrink-0 ${status.dot}`} aria-hidden="true" />
          <div className="min-w-0">
            <div className={`font-semibold ${status.color}`}>{status.label}</div>
            {selectedServerInfo && (
              <div className="text-xs sm:text-sm text-muted-foreground truncate">{selectedServerInfo.name}</div>
            )}
          </div>
        </div>

        {selectedServerInfo && (
          <dl className="space-y-1.5 text-xs sm:text-sm">
            <div>
              <dt className="font-medium inline">URL: </dt>
              <dd className="inline break-all text-muted-foreground">{selectedServerInfo.url}</dd>
            </div>
            <div>
              <dt className="font-medium inline">Requests: </dt>
              <dd className="inline text-muted-foreground">{store.responseHistory.length}</dd>
            </div>
            {lastEntry && (
              <div>
                <dt className="font-medium inline">Last: </dt>
                <dd className="inline text-muted-foreground">{lastEntry.request.method}</dd>
              </div>
            )}
          </dl>
        )}

        {store.connectionError && (
          <div className="mt-3 p-2.5 bg-red-100 dark:bg-red-900/50 rounded border border-red-300 dark:border-red-700 text-xs sm:text-sm text-red-800 dark:text-red-200 break-words" role="alert">
            {store.connectionError}
          </div>
        )}

        {store.isLoading && (
          <div className="mt-3 p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded border border-blue-300 dark:border-blue-700 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
            Processing request...
          </div>
        )}
      </div>

      {store.responseHistory.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="p-3 bg-secondary rounded-lg border">
            <div className="text-muted-foreground text-xs sm:text-sm">Total</div>
            <div className="font-bold text-lg sm:text-2xl">{store.responseHistory.length}</div>
          </div>
          <div className="p-3 bg-secondary rounded-lg border">
            <div className="text-muted-foreground text-xs sm:text-sm">Success</div>
            <div className="font-bold text-green-600 dark:text-green-400 text-lg sm:text-2xl">{successCount}</div>
          </div>
        </div>
      )}
    </div>
  )
}
