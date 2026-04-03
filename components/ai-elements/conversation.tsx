'use client'

import { Button } from '@/components/ui/button'
import { ArrowDownIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { useCallback } from 'react'
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import { cn } from '@/lib/utils'
import { useMobile } from '@/hooks/use-mobile'

export type ConversationProps = ComponentProps<typeof StickToBottom>

export const Conversation = ({ className, ...props }: ConversationProps) => {
  const { isMobile } = useMobile()
  return (
    <StickToBottom
      className={cn('relative flex-1 overflow-y-auto', className)}
      initial="smooth"
      resize="smooth"
      role="log"
      {...props}
    />
  )
}

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
> & {
  compactMode?: boolean
  messageSpacing?: 'compact' | 'default'
}

export const ConversationContent = ({
  className,
  compactMode,
  messageSpacing = 'default',
  ...props
}: ConversationContentProps) => {
  const { isMobile } = useMobile()
  const spacing = isMobile && compactMode ? 'gap-2 p-2' : messageSpacing === 'compact' ? 'gap-2 p-3' : 'gap-4 p-4'

  return (
    <StickToBottom.Content
      className={cn(`flex flex-col ${spacing}`, className)}
      {...props}
    />
  )
}

export type ConversationScrollButtonProps = ComponentProps<typeof Button> & {
  showOnMobile?: boolean
}

export const ConversationScrollButton = ({
  className,
  showOnMobile = true,
  ...props
}: ConversationScrollButtonProps) => {
  const { isMobile } = useMobile()
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom()
  }, [scrollToBottom])

  if (!showOnMobile && isMobile) return null

  return (
    !isAtBottom && (
      <Button
        className={cn(
          isMobile
            ? 'absolute bottom-16 left-[50%] translate-x-[-50%] rounded-full h-10 w-10'
            : 'absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full',
          className
        )}
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...props}
      >
        <ArrowDownIcon className={isMobile ? 'size-4' : 'size-4'} />
      </Button>
    )
  )
}
