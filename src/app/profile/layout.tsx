import { ReactNode } from 'react'
import { ProfileNav } from '@/components/profile/ProfileNav'

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-28">
        <h1 className="text-4xl font-bold text-white mb-8">Көйләүләр</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <ProfileNav />
          </aside>
          <div className="md:col-span-3">{children}</div>
        </div>
      </div>
    </main>
  )
}
