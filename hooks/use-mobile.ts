'use client'

import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 640
const TABLET_BREAKPOINT = 1024

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(true)
  const [isTablet, setIsTablet] = useState<boolean>(false)
  const [screenWidth, setScreenWidth] = useState<number>(375)
  const [isHydrated, setIsHydrated] = useState<boolean>(false)

  useEffect(() => {
    setIsHydrated(true)

    const checkScreen = () => {
      const width = window.innerWidth
      setScreenWidth(width)
      setIsMobile(width < MOBILE_BREAKPOINT)
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    }

    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  // Return sensible defaults during SSR/hydration, actual values after mount
  return {
    isMobile,
    isTablet,
    screenWidth,
    isHydrated,
  }
}
