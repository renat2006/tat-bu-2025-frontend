'use client'
import { Home, BedDouble, Compass, Trees } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import clsx from 'clsx'

const navItems = [
  { id: 'home', href: '#', icon: Home },
  { id: 'rooms', href: '#', icon: BedDouble },
  { id: 'explore', href: '#', icon: Compass },
  { id: 'tours', href: '#', icon: Trees },
]

export default function AppBar() {
  const [active, setActive] = useState('home')

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 md:hidden">
      <div className="relative mx-auto w-[calc(100%-16px)] max-w-[1100px] px-0">
        <div
          className="h-20 rounded-[40px] ring-1 ring-white/10 [backdrop-filter:saturate(160%)_blur(24px)]"
          style={{ backgroundColor: 'rgba(18,18,22,0.5)' }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center justify-between w-full px-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActive(item.id)}
                className="flex h-12 w-12 items-center justify-center rounded-full"
              >
                <item.icon
                  className={clsx(
                    'h-[26px] w-[26px]',
                    active === item.id
                      ? '[color:var(--color-brand-green)]'
                      : 'text-white/80',
                  )}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
