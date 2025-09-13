'use client'

import Header from '@/components/appbar/Header'
import BottomNav from '@/components/appbar/BottomNav'
import ClientLayout from '@/components/layout/ClientLayout'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-content">
      <ClientLayout>
        <Header />
        {children}
        <BottomNav />
      </ClientLayout>
    </div>
  )
}
