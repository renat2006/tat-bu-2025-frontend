'use client'

import { useEffect, useState } from 'react'

export function useIsAndroid() {
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    try {
      const ua = navigator.userAgent || navigator.vendor || ''
      setIsAndroid(/android/i.test(ua))
    } catch {
      setIsAndroid(false)
    }
  }, [])

  return isAndroid
}
