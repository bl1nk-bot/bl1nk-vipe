import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileContainerProps {
  children: ReactNode
  className?: string
  mobileSpacing?: 'xs' | 'sm' | 'md' | 'lg'
  desktopSpacing?: 'xs' | 'sm' | 'md' | 'lg'
}

const spacingMap = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const mobileSpacingMap = {
  xs: 'p-2',
  sm: 'p-2.5',
  md: 'p-3',
  lg: 'p-4',
}

/**
 * Mobile-responsive container with automatic spacing adjustment
 * Optimizes padding and layout for different screen sizes
 */
export function MobileContainer({
  children,
  className,
  mobileSpacing = 'md',
  desktopSpacing = 'lg',
}: MobileContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        'max-w-7xl mx-auto',
        'md:' + spacingMap[desktopSpacing],
        mobileSpacingMap[mobileSpacing],
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Mobile-optimized gap utility for flex/grid layouts
 */
export function getMobileGap(mobileGap: string, desktopGap: string): string {
  return `${mobileGap} md:${desktopGap}`
}

/**
 * Mobile-optimized text size utility
 */
export function getMobileTextSize(mobileSize: string, desktopSize: string): string {
  return `${mobileSize} md:${desktopSize}`
}
