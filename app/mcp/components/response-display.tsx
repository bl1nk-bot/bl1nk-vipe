'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMCPStore, type MCPHistoryEntry } from '@/lib/mcp-store'

export function ResponseDisplay() {
  const store = useMCPStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatJSON = (obj: unknown) => JSON.stringify(obj, null, 2)

  if (store.responseHistory.length === 0 && !store.lastRequest) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
        <p className="text-muted-foreground text-sm sm:text-base">
          No requests sent yet. Send a request to see responses here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base sm:text-lg">Response History</h3>
        {store.responseHistory.length > 0 && (
          <Button onClick={() => store.clearHistory()} variant="ghost" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:gap-3" data-testid="response-display">
        {store.responseHistory.map((entry: MCPHistoryEntry) => (
          <div key={entry.id} className="border rounded-lg overflow-hidden" data-testid={`response-item-${entry.id}`}>
            {/* Header */}
            <button
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              type="button"
              className="w-full p-3 flex items-start justify-between cursor-pointer hover:bg-accent transition-colors bg-card text-sm sm:text-base text-left min-h-[44px] touch-manipulation"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{entry.request.method}</div>
                <div className="text-muted-foreground text-xs sm:text-sm">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ml-2 ${
                  entry.response.error
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                }`}
              >
                {entry.response.error ? 'Error' : 'OK'}
              </span>
            </button>

            {/* Expanded Content */}
            {expandedId === entry.id && (
              <div className="border-t p-3 bg-secondary/50 flex flex-col gap-2 sm:gap-3">
                <div>
                  <h4 className="font-medium mb-1 text-xs sm:text-sm">Request</h4>
                  <pre className="bg-background border rounded p-2 font-mono overflow-x-auto text-xs sm:text-sm whitespace-pre-wrap break-all">
                    {formatJSON(entry.request.params)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-xs sm:text-sm">Response</h4>
                  <pre
                    className={`bg-background border rounded p-2 font-mono overflow-x-auto text-xs sm:text-sm whitespace-pre-wrap break-all ${
                      entry.response.error ? 'text-red-600 dark:text-red-400' : ''
                    }`}
                  >
                    {formatJSON(entry.response.data || entry.response.error)}
                  </pre>
                </div>
                <Button
                  onClick={() => handleCopy(entry.id, formatJSON(entry.response.data || entry.response.error))}
                  variant="outline"
                  size="sm"
                  className="h-8 sm:h-9 text-xs sm:text-sm self-start touch-manipulation"
                >
                  {copied === entry.id ? 'Copied!' : 'Copy Response'}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
