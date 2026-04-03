'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMCPStore } from '@/lib/mcp-store'
import { executeMMCRequest } from '@/lib/mcp-executor'
import { useMobile } from '@/hooks/use-mobile'

const commonMethods = [
  { name: 'list_resources', description: 'List available resources' },
  { name: 'list_tools', description: 'List available tools' },
  { name: 'call_tool', description: 'Call a specific tool' },
  { name: 'read_resource', description: 'Read a resource' },
  { name: 'get_server_info', description: 'Get server information' },
]

export function RequestBuilder() {
  const { isMobile } = useMobile()
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
        } catch (err) {
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
      console.error('[v0] Request builder error:', err)
    } finally {
      store.setLoading(false)
    }
  }

  return (
    <div
      className={`flex flex-col ${isMobile ? 'gap-3' : 'gap-4'}`}
      data-testid="request-builder"
    >
      <div>
        <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'} mb-2`}>Build Request</h3>
      </div>

      <div className="flex flex-col gap-2">
        <label className={isMobile ? 'text-sm' : 'text-base'} htmlFor="method-select">
          Method (Quick Select)
        </label>
        <select
          id="method-select"
          className={`
            w-full px-3 py-2 rounded-md border border-input bg-background
            ${isMobile ? 'text-sm h-10' : 'text-base h-11'}
            touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary
          `}
          onChange={e => {
            setMethod(e.target.value)
            setError('')
          }}
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

      <div className="flex flex-col gap-2">
        <label className={isMobile ? 'text-sm' : 'text-base'} htmlFor="method-input">
          Method Name (Custom)
        </label>
        <input
          id="method-input"
          type="text"
          placeholder="e.g., tools/list, resources/read"
          value={method}
          onChange={e => {
            setMethod(e.target.value)
            setError('')
          }}
          className={`
            w-full px-3 py-2 rounded-md border border-input bg-background
            ${isMobile ? 'text-sm h-10' : 'text-base h-11'}
            touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary
          `}
          data-testid="request-method"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={isMobile ? 'text-sm' : 'text-base'} htmlFor="params-input">
          Parameters (JSON)
        </label>
        <textarea
          id="params-input"
          placeholder={'{\n  "key": "value"\n}'}
          value={params}
          onChange={e => {
            setParams(e.target.value)
            setError('')
          }}
          className={`
            w-full px-3 py-2 rounded-md border border-input bg-background font-mono
            ${isMobile ? 'text-xs h-24 min-h-[100px]' : 'text-sm h-32 min-h-[128px]'}
            touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary
          `}
        />
      </div>

      {error && (
        <div
          className={`
            bg-red-500/10 text-red-700 dark:text-red-400
            p-3 rounded-md border border-red-200 dark:border-red-800
            ${isMobile ? 'text-xs' : 'text-sm'}
          `}
          role="alert"
        >
          {error}
        </div>
      )}

      <Button
        onClick={handleSendRequest}
        disabled={store.isLoading || !store.selectedServer}
        className={isMobile ? 'h-10 text-sm' : 'h-11'}
        data-testid="send-request-btn"
      >
        {store.isLoading ? 'Sending...' : 'Send Request'}
      </Button>
    </div>
  )
}
