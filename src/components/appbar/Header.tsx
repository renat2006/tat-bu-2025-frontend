'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Bell } from 'lucide-react'
import clsx from 'clsx'
import { useUserStore } from '@/stores/userStore'

export default function Header() {
  const { user } = useUserStore()

  return (
    <header className={clsx('z-10')}>
      <div className="mx-auto max-w-6xl px-2 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={70} height={70} priority />
        </Link>
        <div className="flex items-center">
          <button
            aria-label="Notifications"
            className="relative inline-flex h-13 w-13 items-center justify-center rounded-full bg-white/10 hover:bg-white/10 transition-colors"
          >
            <Bell className="h-6 w-6 text-white/80" />
          </button>
          <Link
            href="/profile"
            className="-ml-3 z-2 inline-flex h-13 w-13 overflow-hidden rounded-full ring-1 ring-white/10 hover:ring-white/20 transition-all"
          >
            <Image src={user.avatar} alt="User" width={56} height={56} />
          </Link>
        </div>
      </div>
    </header>
  )
}
