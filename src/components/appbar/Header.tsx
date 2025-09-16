'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Bell } from 'lucide-react'
import clsx from 'clsx'
import { useUserStore } from '@/stores/userStore'

export default function Header() {
  const { user } = useUserStore()

  return (
    <header className={clsx('z-10 w-full')}>
      <div
        className="mx-auto max-w-6xl flex items-center justify-between"
        style={{
          paddingLeft: 'calc(16px + env(safe-area-inset-left, 0px))',
          paddingRight: 'calc(16px + env(safe-area-inset-right, 0px))',
          paddingTop: 'calc(10px + env(safe-area-inset-top, 0px))',
          paddingBottom: '10px',
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={56} height={56} priority />
        </Link>
        <div className="flex items-center gap-2">
          <button
            aria-label="Notifications"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/10 ring-1 ring-white/10 transition-colors"
            onClick={() => {
              try {
                window.dispatchEvent(new CustomEvent('pwa-open-notifications'))
              } catch {}
            }}
          >
            <Bell className="h-6 w-6 text-white/80" />
            <span
              className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-brand-green text-ink text-[10px] font-bold hidden"
              id="notif-badge"
            ></span>
          </button>
          <Link
            href="/profile"
            className="inline-flex h-11 w-11 overflow-hidden rounded-full ring-1 ring-white/10 hover:ring-white/20 transition-all"
          >
            <Image src={user.avatar} alt="User" width={44} height={44} />
          </Link>
        </div>
      </div>
    </header>
  )
}
