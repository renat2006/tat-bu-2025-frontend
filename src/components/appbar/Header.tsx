'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Bell } from 'lucide-react'
import clsx from 'clsx'

export default function Header() {
  return (
    <header className={clsx('z-10')}>
      <div className="mx-auto max-w-6xl px-2 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={56} height={56} priority />
        </Link>
        <div className="flex items-center">
          <button
            aria-label="Notifications"
            className="relative inline-flex h-13 w-13 items-center justify-center rounded-full bg-white/10 hover:bg-white/10 transition-colors"
          >
            <Bell className="h-6 w-6 text-white/80" />
          </button>
          <button className="-ml-3 inline-flex h-15 w-15 overflow-hidden rounded-full ring-1 ring-white/10">
            <Image
              src="/avatars/man-avatar-3.png"
              alt="User"
              width={56}
              height={56}
            />
          </button>
        </div>
      </div>
    </header>
  )
}
