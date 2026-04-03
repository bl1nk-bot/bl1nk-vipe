'use client'

import type { TextUIPart } from 'ai'
import { Streamdown } from 'streamdown'
import { useMobile } from '@/hooks/use-mobile'
import { useState } from 'react'

export function Text({ part }: { part: TextUIPart }) {
  const { isMobile } = useMobile()
  const [copied, setCopied] = useState(false)

  return (
    <div
      className={`
        prose dark:prose-invert
        border bg-secondary/90 text-secondary-foreground border-gray-300 rounded-md
        ${isMobile ? 'prose-sm max-w-sm text-xs px-2.5 py-2' : 'prose-base max-w-2xl text-sm px-3.5 py-3'}
        break-words overflow-x-auto
      `}
    >
      <Streamdown
        className={isMobile ? 'overflow-x-auto text-xs' : 'overflow-x-auto text-sm'}
        onCodeBlock={(lang, code) => (
          <CodeBlockMobile
            lang={lang}
            code={code}
            isMobile={isMobile}
            copied={copied}
            setCopied={setCopied}
          />
        )}
      >
        {part.text}
      </Streamdown>
    </div>
  )
}

function CodeBlockMobile({
  lang,
  code,
  isMobile,
  copied,
  setCopied,
}: {
  lang: string
  code: string
  isMobile: boolean
  copied: boolean
  setCopied: (v: boolean) => void
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`relative bg-slate-900 rounded-md overflow-x-auto ${isMobile ? 'text-xs' : 'text-sm'}`}>
      <button
        onClick={handleCopy}
        className={`
          absolute top-2 right-2 bg-slate-700 rounded hover:bg-slate-600 text-white
          ${isMobile ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'}
          transition-colors duration-200
        `}
        aria-label="Copy code"
        type="button"
      >
        {copied ? '✓' : '⎘'}
      </button>
      <pre className={`overflow-x-auto ${isMobile ? 'p-2.5' : 'p-4'}`}>
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
  )
}
