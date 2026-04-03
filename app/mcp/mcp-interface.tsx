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
    <main className="flex-1 overflow-hidden h-screen flex flex-col bg-gradient-to-br from-background via-background to-background/95">
      {/* Header - Modern Card Design */}
      <div className={`border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 ${isMobile ? 'p-3' : 'p-6'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <div>
                <h1 className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>MCP Console</h1>
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>Model Context Protocol</p>
              </div>
            </div>
            <Link
              href="/"
              className={`
                px-4 py-2 rounded-lg border border-input bg-card hover:bg-accent transition-all duration-200
                ${isMobile ? 'text-xs h-9' : 'text-sm h-10'}
                flex items-center justify-center touch-manipulation active:scale-95
              `}
            >
              ← Back
            </Link>
          </div>
          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Connect to MCP servers, build requests, and monitor responses in real-time
          </p>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-2.5' : 'p-6'}`}>
        <div className="max-w-7xl mx-auto">
          {isMobile ? (
            /* Mobile: Single Column Layout - Optimized for touch */
            <div className="flex flex-col gap-3">
              {/* Server Manager */}
              <section className="border border-border/50 rounded-xl p-4 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                <ServerManager />
              </section>

              {/* Connection Monitor */}
              <section className="border border-border/50 rounded-xl p-4 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                <ConnectionMonitor />
              </section>

              {/* Request Builder */}
              <section className="border border-border/50 rounded-xl p-4 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                <RequestBuilder />
              </section>

              {/* Response Display */}
              <section className="border border-border/50 rounded-xl p-4 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all max-h-96">
                <ResponseDisplay />
              </section>
            </div>
          ) : (
            /* Desktop: Two-Column Layout */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
              {/* Left Column - Server & Connection (1/3) */}
              <div className="flex flex-col gap-6">
                {/* Server Manager */}
                <section className="border border-border/50 rounded-xl p-6 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <ServerManager />
                </section>

                {/* Connection Monitor */}
                <section className="border border-border/50 rounded-xl p-6 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <ConnectionMonitor />
                </section>
              </div>

              {/* Right Column - Request & Response (2/3) */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Request Builder */}
                <section className="border border-border/50 rounded-xl p-6 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <RequestBuilder />
                </section>

                {/* Response Display */}
                <section className="border border-border/50 rounded-xl p-6 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all min-h-96 max-h-[600px] overflow-y-auto">
                  <ResponseDisplay />
                </section>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info - Mobile Safe Area */}
      <footer
        className={`
          border-t border-border/50 bg-card/50 backdrop-blur-sm text-muted-foreground text-center
          transition-all
          ${isMobile ? 'text-xs p-2.5' : 'text-sm p-4'}
          pb-[max(1rem,env(safe-area-inset-bottom))]
        `}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span>MCP Console • Secure • Mobile-First • Real-time</span>
        </div>
      </footer>
    </main>
  )
}
