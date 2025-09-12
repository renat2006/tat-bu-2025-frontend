'use client'
import { Home, Images, Camera, BookOpen, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
  { id: 'home', href: '/', icon: Home },
  { id: 'albums', href: '/gallery', icon: Images },
  { id: 'search', href: '#', icon: Camera, emphasized: true },
  { id: 'learn', href: '#', icon: BookOpen },
  { id: 'profile', href: '#', icon: User },
]

export default function AppBar() {
  const pathname = usePathname() || '/'

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 md:hidden">
      <div className="relative mx-auto w-[calc(100%-16px)] max-w-[1100px] px-0">
        <div
          className="h-20 rounded-[40px] ring-1 ring-white/10 [backdrop-filter:saturate(160%)_blur(24px)]"
          style={{
            backgroundColor: 'rgba(18,18,22,0.5)',
            maskImage: `url("data:image/svg+xml,%3csvg width='350' height='80' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M40 0L105 0C131 0 131 52 175 52C219 52 219 0 245 0L310 0A40 40 0 01350 40A40 40 0 01310 80L40 80A40 40 0 010 40A40 40 0 0140 0Z' fill='white'/%3e%3c/svg%3e")`,
            WebkitMaskImage: `url("data:image/svg+xml,%3csvg width='350' height='80' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M40 0L105 0C131 0 131 52 175 52C219 52 219 0 245 0L310 0A40 40 0 01350 40A40 40 0 01310 80L40 80A40 40 0 010 40A40 40 0 0140 0Z' fill='white'/%3e%3c/svg%3e")`,
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center justify-between w-full px-4">
            {navItems.map((item) => {
              const isActive =
                (item.href === '/' && pathname === '/') ||
                (item.href !== '/' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={clsx(
                    'flex items-center justify-center rounded-full',
                    item.emphasized
                      ? 'h-18 w-18 -mt-18 ring-1 ring-white/20 bg-white'
                      : 'h-12 w-12',
                  )}
                >
                  <item.icon
                    className={clsx(
                      item.emphasized
                        ? 'h-[30px] w-[30px]'
                        : 'h-[26px] w-[26px]',
                      isActive
                        ? '[color:var(--color-brand-green)]'
                        : item.emphasized
                          ? 'text-black/80'
                          : 'text-white/80',
                    )}
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
