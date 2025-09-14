import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/appbar/Header'
import BottomNav from '@/components/appbar/BottomNav'
import ClientLayout from '@/components/layout/ClientLayout'
import Image from 'next/image'
import ServiceWorkerRegister from '../components/layout/ServiceWorkerRegister'
import PwaInstallPrompt from '../components/ui/PwaInstallPrompt'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      'https://tat-bu-2025-frontend.vercel.app',
  ),
  title: 'VibeTel — вайбовое изучение языка',
  description: 'Учите татарский в кайф: AR‑сканер, "Пары" и "Напиши перевод".',
  applicationName: 'VibeTel',
  manifest: '/manifest.webmanifest',
  themeColor: '#0B1220',
  icons: {
    icon: [
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: ['/icons/favicon-32.png'],
  },
  openGraph: {
    title: 'VibeTel — вайбовое изучение языка',
    description: 'Учите татарский через AR‑сканер и мини‑игры.',
    url: '/',
    siteName: 'VibeTel',
    images: [{ url: '/logo_wbg.svg' }],
    type: 'website',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeTel — вайбовое изучение языка',
    description: 'Учите татарский через AR‑сканер и мини‑игры.',
    images: ['/logo_wbg.svg'],
  },
  appleWebApp: {
    capable: true,
    title: 'VibeTel',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} loading`}>
        <div id="initial-preloader">
          <Image
            src="/logo_wbg.svg"
            alt="App Logo"
            width={120}
            height={120}
            priority
          />
        </div>
        <div id="page-content">
          <ClientLayout>
            <ServiceWorkerRegister />
            <PwaInstallPrompt />
            <Header />
            {children}
            <BottomNav />
          </ClientLayout>
        </div>
      </body>
    </html>
  )
}
