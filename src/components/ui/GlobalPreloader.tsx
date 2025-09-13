'use client'

import Image from 'next/image'

export const GlobalPreloader = () => {
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
      </div>
    </div>
  )
}
