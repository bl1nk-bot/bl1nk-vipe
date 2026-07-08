import { forwardRef } from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

export type MobileInputProps = React.ComponentProps<typeof Input>

/**
 * Input with mobile-friendly touch targets and non-zooming font (16px).
 * Uses Tailwind responsive classes.
 */
export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, type, ...props }, ref) => (
    <Input
      ref={ref}
      type={type}
      className={cn(
        'h-10 min-h-[44px] text-base sm:h-10 sm:min-h-0 sm:text-sm',
        'touch-manipulation',
        className
      )}
      {...props}
    />
  )
)

MobileInput.displayName = 'MobileInput'
