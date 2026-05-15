import { forwardRef } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export type MobileButtonProps = React.ComponentProps<typeof Button>

/**
 * Button with mobile-friendly touch targets (min 44px).
 * Uses Tailwind responsive classes instead of JS-based mobile detection.
 */
export const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
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
