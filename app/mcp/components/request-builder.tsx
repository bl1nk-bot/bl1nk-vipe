'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMCPStore } from '@/lib/mcp-store'
import { executeMMCRequest } from '@/lib/mcp-executor'

const commonMethods = [
  { name: 'list_resources', description: 'List available resources' },
  { name: 'list_tools', description: 'List available tools' },
  { name: 'call_tool', description: 'Call a specific tool' },
  { name: 'read_resource', description: 'Read a resource' },
  { name: 'get_server_info', description: 'Get server information' },
]

export function RequestBuilder() {
  const store = useMCPStore()
  const [method, setMethod] = useState('')
  const [params, setParams] = useState('')
  const [error, setError] = useState('')

  const handleSendRequest = async () => {
    if (!store.selectedServer) {
      setError('Please select a server first')
      return
    }
    if (!method.trim()) {
      setError('Please enter a method name')
      return
    }

    try {
      setError('')
      let parsedParams: Record<string, unknown> = {}

      if (params.trim()) {
        try {
          parsedParams = JSON.parse(params)
        } catch {
          setError('Invalid JSON in parameters')
          return
        }
      }

      const selectedServer = store.availableServers.find(s => s.id === store.selectedServer)
      if (!selectedServer) {
        setError('Invalid server selection')
        return
      }

      store.setLoading(true)
      const result = await executeMMCRequest(selectedServer.url, method, parsedParams)
      if (!result.success) {
        setError(result.error || 'Request failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      store.setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4" data-testid="request-builder">
      <h3 className="font-semibold text-base sm:text-lg">Build Request</h3>

      {/* Quick method selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm sm:text-base font-medium" htmlFor="method-select">
          Method (Quick Select)
        </label>
        <select
          id="method-select"
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm sm:text-base h-10 sm:h-11 touch-manipulation focus:outline-none focus:ring-2 focus:ring-ring"
          onChange={e => { setMethod(e.target.value); setError('') }}
          value={method}
        >
          <option value="">Select a method...</option>
          {commonMethods.map(m => (
            <option key={m.name} value={m.name}>
              {m.name} - {m.description}
            </option>
          ))}
        </select>
      </div>

      {/* Custom method input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm sm:text-base font-medium" htmlFor="method-input">
          Method Name (Custom)
        </label>
        <input
          id="method-input"
          type="text"
          placeholder="e.g., tools/list, resources/read"
          value={method}
          onChange={e => { setMethod(e.target.value); setError('') }}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm sm:text-base h-10 sm:h-11 touch-manipulation focus:outline-none focus:ring-2 focus:ring-ring"
          data-testid="request-method"
        />
      </div>

      {/* JSON params */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm sm:text-base font-medium" htmlFor="params-input">
          Parameters (JSON)
        </label>
        <textarea
          id="params-input"
          placeholder={'{\n  "key": "value"\n}'}
          value={params}
          onChange={e => { setParams(e.target.value); setError('') }}
          className="w-full px-3 py-2 rounded-md border border-input bg-background font-mono text-xs sm:text-sm h-24 sm:h-32 min-h-[96px] sm:min-h-[128px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />
      </div>

      {error && (
        <div
          className="bg-destructive/10 text-destructive p-3 rounded-md border border-destructive/20 text-xs sm:text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      <Button
        onClick={handleSendRequest}
        disabled={store.isLoading || !store.selectedServer}
        className="h-10 sm:h-11 touch-manipulation"
        data-testid="send-request-btn"
      >
        {store.isLoading ? 'Sending...' : 'Send Request'}
      </Button>
    </div>
  )
}
