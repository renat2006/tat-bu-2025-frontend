'use client'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  )
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const installed =
      window.matchMedia('(display-mode: standalone)').matches ||
      localStorage.getItem('pwa-installed') === '1'
    if (installed) return
    const dismissed = localStorage.getItem('pwa-install-dismissed') === '1'
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      if (!dismissed) setVisible(true)
    }
    const onInstalled = () => {
      localStorage.setItem('pwa-installed', '1')
      setVisible(false)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    const choice = await deferred.userChoice
    setDeferred(null)
    if (choice && choice.outcome === 'accepted') {
      localStorage.setItem('pwa-installed', '1')
      setVisible(false)
    }
  }, [deferred])

  const close = useCallback(() => {
    localStorage.setItem('pwa-install-dismissed', '1')
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded-2xl bg-white p-4 shadow-xl dark:bg-neutral-900">
        <div className="mb-3 flex items-center gap-3">
          <Image src="/logo.svg" alt="App" width={40} height={40} />
          <div className="text-base font-semibold">Установить VibeTel</div>
        </div>
        <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">
          Добавьте VibeTel на главный экран для быстрого доступа.
        </div>
        <div className="flex gap-2">
          <button
            onClick={close}
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700"
          >
            Позже
          </button>
          <button
            onClick={install}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
          >
            Установить
          </button>
        </div>
      </div>
    </div>
  )
}
