import { ReactNode } from 'react'
import { ProfileNav } from '@/components/profile/ProfileNav'

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <main
      className="min-h-screen"
      style={{
        paddingTop: 'calc(24px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 md:mb-8">
          Көйләүләр
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
          <aside className="md:col-span-1">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 md:p-4 backdrop-blur-md">
              <ProfileNav />
            </div>
          </aside>
          <div className="md:col-span-3">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 md:p-6 backdrop-blur-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
