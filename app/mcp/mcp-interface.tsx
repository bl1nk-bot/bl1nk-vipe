'use client'

import { useMobile } from '@/hooks/use-mobile'
import { ServerManager } from './components/server-manager'
import { RequestBuilder } from './components/request-builder'
import { ResponseDisplay } from './components/response-display'
import { ConnectionMonitor } from './components/connection-monitor'
import { useEffect } from 'react'
import Link from 'next/link'

export function MCPInterface() {
  const { isMobile } = useMobile()

  useEffect(() => {
    console.log('[v0] MCP Interface loaded')
  }, [])

  return (
    <main className="flex-1 overflow-hidden h-screen flex flex-col bg-background">
      {/* Header */}
      <div className={`border-b bg-card ${isMobile ? 'p-3' : 'p-6'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-3xl'}`}>MCP Interface</h1>
            <Link
              href="/"
              className={`
                px-3 py-2 rounded-md border border-input hover:bg-accent transition-colors
                ${isMobile ? 'text-xs h-8' : 'text-sm h-10'}
                flex items-center justify-center touch-manipulation
              `}
            >
              Back
            </Link>
          </div>
          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Model Context Protocol (MCP) server communication interface
          </p>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-6'}`}>
        <div className="max-w-7xl mx-auto">
          {isMobile ? (
            /* Mobile: Single Column Layout */
            <div className="flex flex-col gap-4">
              {/* Server Manager */}
              <div className="border rounded-lg p-4 bg-card">
                <ServerManager />
              </div>

              {/* Connection Monitor */}
              <div className="border rounded-lg p-4 bg-card">
                <ConnectionMonitor />
              </div>

              {/* Request Builder */}
              <div className="border rounded-lg p-4 bg-card">
                <RequestBuilder />
              </div>

              {/* Response Display */}
              <div className="border rounded-lg p-4 bg-card">
                <ResponseDisplay />
              </div>
            </div>
          ) : (
            /* Desktop: Two-Column Layout */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Server & Connection (1/3) */}
              <div className="flex flex-col gap-6">
                {/* Server Manager */}
                <div className="border rounded-lg p-6 bg-card">
                  <ServerManager />
                </div>

                {/* Connection Monitor */}
                <div className="border rounded-lg p-6 bg-card">
                  <ConnectionMonitor />
                </div>
              </div>

              {/* Right Column - Request & Response (2/3) */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Request Builder */}
                <div className="border rounded-lg p-6 bg-card">
                  <RequestBuilder />
                </div>

                {/* Response Display */}
                <div className="border rounded-lg p-6 bg-card max-h-[500px] overflow-y-auto">
                  <ResponseDisplay />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info - Mobile Safe Area */}
      <div
        className={`
          border-t bg-card text-muted-foreground text-center
          ${isMobile ? 'text-xs p-2' : 'text-sm p-4'}
          pb-[max(1rem,env(safe-area-inset-bottom))]
        `}
      >
        MCP Interface • Secure • Mobile-First • Real-time
      </div>
    </main>
  )
}
