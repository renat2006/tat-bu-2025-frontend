'use client'

import dynamic from 'next/dynamic'

// This component dynamically imports the AppShell with SSR disabled.
// This is the recommended way to achieve a fully client-rendered app in Next.js.
const AppShell = dynamic(() => import('@/components/layout/AppShell'), {
  ssr: false,
})

export default function ClientOnly({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
