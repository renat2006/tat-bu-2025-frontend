'use client'
import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js')
        // listen for updates
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing
          if (!installing) return
          installing.addEventListener('statechange', () => {
            if (
              installing.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              try {
                // store waiting sw for soft update
                const waiting = reg.waiting || installing
                ;(window as any).__pwaWaitingSW = waiting
                if (Notification && Notification.permission === 'granted') {
                  new Notification('Доступно обновление', {
                    body: 'Нажмите, чтобы обновить приложение',
                  }).onclick = () => window.location.reload()
                }
              } catch {}
              try {
                window.dispatchEvent(
                  new CustomEvent('pwa-update-available', {
                    detail: { hasWaiting: !!(window as any).__pwaWaitingSW },
                  } as any),
                )
              } catch {}
            }
          })
        })
        // auto reload after skip waiting
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          try {
            window.location.reload()
          } catch {}
        })
      } catch {}
    }
    register()
  }, [])
  return null
}
