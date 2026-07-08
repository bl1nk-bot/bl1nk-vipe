'use client'
import { useMobile } from '@/hooks/use-mobile'

import type { TextUIPart } from 'ai'
import { Streamdown } from 'streamdown'
import { useState } from 'react'

export function Text({ part }: { part: TextUIPart }) {
  const { isMobile } = useMobile()
  return (
    <div
      className="
        prose dark:prose-invert
        border bg-secondary/90 text-secondary-foreground border-gray-300 rounded-md
        prose-sm max-w-sm text-xs px-2.5 py-2
        sm:prose-base sm:max-w-2xl sm:text-sm sm:px-3.5 sm:py-3
        break-words overflow-x-auto
      "
    >
      <Streamdown className="overflow-x-auto text-xs sm:text-sm">
        {part.text}
      </Streamdown>
    </div>
  )
}
