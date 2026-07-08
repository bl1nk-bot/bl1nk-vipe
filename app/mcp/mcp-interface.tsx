'use client'

import { ServerManager } from './components/server-manager'
import { RequestBuilder } from './components/request-builder'
import { ResponseDisplay } from './components/response-display'
import { ConnectionMonitor } from './components/connection-monitor'
import Link from 'next/link'

export function MCPInterface() {
  return (
    <main className="flex-1 overflow-hidden h-dvh flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-bold text-sm sm:text-base">M</span>
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-lg sm:text-2xl leading-tight truncate">MCP Console</h1>
                <p className="text-muted-foreground text-xs leading-tight">Model Context Protocol</p>
              </div>
            </div>
            <Link
              href="/"
              className="
                px-3 py-2 rounded-lg border border-input bg-card hover:bg-accent
                transition-colors text-xs sm:text-sm h-9 sm:h-10 shrink-0
                flex items-center justify-center touch-manipulation active:scale-95
              "
            >
              Back
            </Link>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">
            Connect to MCP servers, build requests, and monitor responses in real-time
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-max">
          {/* Left Column */}
          <div className="flex flex-col gap-3 sm:gap-6">
            <section className="border border-border/50 rounded-xl p-4 sm:p-6 bg-card shadow-sm">
              <ServerManager />
            </section>
            <section className="border border-border/50 rounded-xl p-4 sm:p-6 bg-card shadow-sm">
              <ConnectionMonitor />
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-6">
            <section className="border border-border/50 rounded-xl p-4 sm:p-6 bg-card shadow-sm">
              <RequestBuilder />
            </section>
            <section className="border border-border/50 rounded-xl p-4 sm:p-6 bg-card shadow-sm max-h-[500px] sm:max-h-[600px] overflow-y-auto">
              <ResponseDisplay />
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 text-muted-foreground text-center text-xs sm:text-sm p-2.5 sm:p-4 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
          <span>MCP Console</span>
        </div>
      </footer>
    </main>
  )
}
