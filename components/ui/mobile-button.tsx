import { forwardRef } from 'react'
import { Button, type ButtonProps } from './button'
import { cn } from '@/lib/utils'

/**
 * Button with mobile-friendly touch targets (min 44px).
 * Uses Tailwind responsive classes instead of JS-based mobile detection.
 */
export const MobileButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        'h-10 min-h-[44px] px-3 text-sm sm:h-10 sm:min-h-0 sm:px-4 sm:text-sm',
        'touch-manipulation',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
)

MobileButton.displayName = 'MobileButton'
