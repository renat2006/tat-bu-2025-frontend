'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'

export const GlobalPreloader = () => {
  const [updateToast, setUpdateToast] = useState(false)

  useEffect(() => {
    const onShowUpdate = () => setUpdateToast(true)
    window.addEventListener('pwa-show-update-toast' as any, onShowUpdate)
    return () =>
      window.removeEventListener('pwa-show-update-toast' as any, onShowUpdate)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="preloader-logo">
          <Image
            src="/logo_wbg.svg"
            alt="App Logo"
            width={120}
            height={120}
            priority
          />
        </div>
        <Loader className="w-6 h-6 text-white/70 animate-spin" />
      </div>

      {updateToast && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-md">
          <div className="rounded-2xl bg-[linear-gradient(180deg,rgba(26,27,32,0.9),rgba(26,27,32,0.96))] ring-1 ring-white/10 text-white shadow-[0_16px_40px_rgba(0,0,0,0.5)] [backdrop-filter:saturate(160%)_blur(12px)] px-4 py-3 flex items-center justify-between gap-3">
            <div className="text-sm">Доступно обновление</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUpdateToast(false)}
                className="h-9 px-3 rounded-full bg-white/10 ring-1 ring-white/10 text-white text-xs"
              >
                Позже
              </button>
              <button
                onClick={() => {
                  try {
                    const w: ServiceWorker | undefined = (window as any)
                      .__pwaWaitingSW
                    if (w) w.postMessage({ type: 'SKIP_WAITING' })
                    else window.location.reload()
                  } catch {
                    window.location.reload()
                  }
                }}
                className="h-9 px-3 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/20 text-xs"
              >
                Обновить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
