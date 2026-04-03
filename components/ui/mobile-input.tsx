import { forwardRef } from 'react'
import { Input, type InputProps } from './input'
import { cn } from '@/lib/utils'
import { useMobile } from '@/hooks/use-mobile'

interface MobileInputProps extends InputProps {
  mobileSize?: 'sm' | 'md' | 'lg'
  desktopSize?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-9 text-xs',
  md: 'h-10 text-sm',
  lg: 'h-11 text-base',
}

const mobileSizeMap = {
  sm: 'h-10 text-xs min-h-[40px]',
  md: 'h-11 text-sm min-h-[44px]',
  lg: 'h-12 text-base min-h-[48px]',
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, mobileSize = 'md', desktopSize = 'md', ...props }, ref) => {
    const { isMobile } = useMobile()

    const baseSize = isMobile ? mobileSizeMap[mobileSize] : sizeMap[desktopSize]

    return (
      <Input
        ref={ref}
        className={cn(
          baseSize,
          'touch-manipulation',
          'text-base', // 16px minimum on mobile to prevent zoom
          className
        )}
        {...props}
      />
    )
  }
)

MobileInput.displayName = 'MobileInput'
