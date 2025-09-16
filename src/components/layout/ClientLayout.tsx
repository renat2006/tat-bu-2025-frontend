'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    const handleLoad = () => {
      document.body.classList.remove('loading')
    }

    if (isInitialLoad.current) {
      // For the very first load, we just remove the loading class.
      isInitialLoad.current = false
      handleLoad()
    } else {
      // For subsequent navigations, we show the preloader and then hide it.
      document.body.classList.add('loading')
      const timer = setTimeout(handleLoad, 500) // Show preloader for 500ms
      return () => clearTimeout(timer)
    }
  }, [pathname])

  useEffect(() => {
    const onUpdate = () => {
      try {
        const el = document.getElementById('notif-badge')
        if (el) el.classList.remove('hidden')
      } catch {}
      // показать PWA-toast, если есть
      try {
        window.dispatchEvent(new CustomEvent('pwa-show-update-toast'))
      } catch {}
    }
    const onOpen = () => {
      try {
        const el = document.getElementById('notif-badge')
        if (el) el.classList.add('hidden')
      } catch {}
      // TODO: открыть ваш popup уведомлений
    }
    window.addEventListener('pwa-update-available' as any, onUpdate)
    window.addEventListener('pwa-open-notifications' as any, onOpen)
    return () => {
      window.removeEventListener('pwa-update-available' as any, onUpdate)
      window.removeEventListener('pwa-open-notifications' as any, onOpen)
    }
  }, [])

  return <>{children}</>
}
