'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, LogOut } from 'lucide-react'
import { useUserStore } from '@/stores/userStore'

const navItems = [{ href: '/profile', label: 'Профиль', icon: User }]

export const ProfileNav = () => {
  const pathname = usePathname()
  const { logout } = useUserStore()

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </Link>
        )
      })}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200 mt-4"
      >
        <LogOut size={20} />
        <span className="font-medium">Чыгу</span>
      </button>
    </nav>
  )
}
