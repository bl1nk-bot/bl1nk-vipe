import { forwardRef } from 'react'
import { Button, type ButtonProps } from './button'
import { cn } from '@/lib/utils'
import { useMobile } from '@/hooks/use-mobile'

interface MobileButtonProps extends ButtonProps {
  mobileSize?: 'sm' | 'md' | 'lg'
  desktopSize?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-10 px-2 text-xs',
  md: 'h-11 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const mobileSizeMap = {
  sm: 'h-10 px-2.5 text-xs min-h-[40px] min-w-[40px]',
  md: 'h-11 px-3 text-sm min-h-[44px]',
  lg: 'h-12 px-4 text-base min-h-[48px]',
}

export const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ className, mobileSize = 'md', desktopSize = 'md', children, ...props }, ref) => {
    const { isMobile } = useMobile()

    const baseSize = isMobile ? mobileSizeMap[mobileSize] : sizeMap[desktopSize]

    return (
      <Button ref={ref} className={cn(baseSize, 'touch-manipulation', className)} {...props}>
        {children}
      </Button>
    )
  }
)

MobileButton.displayName = 'MobileButton'
