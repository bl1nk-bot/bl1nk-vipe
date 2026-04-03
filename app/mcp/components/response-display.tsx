'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMCPStore, type MCPHistoryEntry } from '@/lib/mcp-store'
import { useMobile } from '@/hooks/use-mobile'

export function ResponseDisplay() {
  const { isMobile } = useMobile()
  const store = useMCPStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatJSON = (obj: unknown) => {
    return JSON.stringify(obj, null, 2)
  }

  const truncateJSON = (json: string, maxLength: number = 200) => {
    if (json.length > maxLength) {
      return json.substring(0, maxLength) + '...'
    }
    return json
  }

  if (store.responseHistory.length === 0 && !store.lastRequest) {
    return (
      <div className={`flex flex-col items-center justify-center ${isMobile ? 'p-4' : 'p-8'} text-center`}>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
          No requests sent yet. Send a request to see responses here.
        </p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-4'}`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>Response History</h3>
        {store.responseHistory.length > 0 && (
          <Button
            onClick={() => store.clearHistory()}
            variant="ghost"
            size="sm"
            className={isMobile ? 'h-8 text-xs' : 'h-9 text-sm'}
          >
            Clear
          </Button>
        )}
      </div>

      <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-3'}`} data-testid="response-display">
        {store.responseHistory.map((entry: MCPHistoryEntry) => (
          <div
            key={entry.id}
            className="border rounded-lg overflow-hidden"
            data-testid={`response-item-${entry.id}`}
          >
            {/* Header */}
            <button
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              className={`
                w-full p-3 flex items-start justify-between cursor-pointer
                hover:bg-accent transition-colors bg-card
                ${isMobile ? 'text-sm' : 'text-base'}
              `}
            >
              <div className="flex-1 text-left">
                <div className="font-medium">{entry.request.method}</div>
                <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div
                className={`
                  text-sm font-medium px-2 py-1 rounded
                  ${entry.response.error ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'}
                `}
              >
                {entry.response.error ? 'Error' : 'Success'}
              </div>
            </button>

            {/* Expanded Content */}
            {expandedId === entry.id && (
              <div className={`border-t p-3 bg-secondary/50 flex flex-col ${isMobile ? 'gap-2' : 'gap-3'}`}>
                {/* Request */}
                <div>
                  <h4 className={`font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>Request</h4>
                  <div
                    className={`
                      bg-background border rounded p-2 font-mono overflow-x-auto
                      ${isMobile ? 'text-xs' : 'text-sm'}
                    `}
                  >
                    <pre>{formatJSON(entry.request.params)}</pre>
                  </div>
                </div>

                {/* Response */}
                <div>
                  <h4 className={`font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>Response</h4>
                  <div
                    className={`
                      bg-background border rounded p-2 font-mono overflow-x-auto
                      ${isMobile ? 'text-xs' : 'text-sm'}
                      ${entry.response.error ? 'text-red-600 dark:text-red-400' : ''}
                    `}
                  >
                    <pre>{formatJSON(entry.response.data || entry.response.error)}</pre>
                  </div>
                </div>

                {/* Copy Button */}
                <Button
                  onClick={() => handleCopy(entry.id, formatJSON(entry.response.data || entry.response.error))}
                  variant="outline"
                  size="sm"
                  className={isMobile ? 'h-8 text-xs' : 'h-9 text-sm'}
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
