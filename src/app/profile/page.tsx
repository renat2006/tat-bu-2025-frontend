import { ChevronRight, Bell, Palette, Lock, LogOut } from 'lucide-react'
import Image from 'next/image'

const ProfilePage = () => {
  const menuItems = [
    {
      title: 'Уведомления',
      icon: Bell,
      href: '/profile/notifications',
    },
    {
      title: 'Внешний вид',
      icon: Palette,
      href: '/profile/appearance',
    },
    {
      title: 'Безопасность',
      icon: Lock,
      href: '/profile/security',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-md mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-neutral-800 mb-4 relative overflow-hidden">
            <Image
              src="/avatars/man-avatar-2.png"
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold">Имя Фамилия</h1>
          <p className="text-white/60">tat-bu-2025@email.com</p>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-6 h-6" />
                <span>{item.title}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/50" />
            </a>
          ))}
        </div>

        <div className="mt-8">
          <button className="w-full flex items-center justify-center gap-3 p-4 text-red-500 bg-neutral-900/50 rounded-lg">
            <LogOut className="w-6 h-6" />
            <span>Выйти</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
