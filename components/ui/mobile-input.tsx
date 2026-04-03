import { forwardRef } from 'react'
import { Input, type InputProps } from './input'
import { cn } from '@/lib/utils'

/**
 * Input with mobile-friendly touch targets (min 44px) and 16px font to prevent iOS zoom.
 * Uses Tailwind responsive classes instead of JS-based mobile detection.
 */
export const MobileInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn(
        'h-11 min-h-[44px] text-base sm:h-10 sm:min-h-0 sm:text-sm',
        'touch-manipulation',
        className
      )}
      {...props}
    />
  )
)

MobileInput.displayName = 'MobileInput'
