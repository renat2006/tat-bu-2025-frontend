import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Smartphone } from 'lucide-react'
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
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://tat-bu-2025-frontend.vercel.app'
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
          {/* Mobile-only app content */}
          <div className="block lg:hidden">
            <ClientLayout>
              <ServiceWorkerRegister />
              <PwaInstallPrompt />
              <Header />
              {children}
              <BottomNav />
            </ClientLayout>
          </div>

          {/* Desktop blocker */}
          <div className="hidden lg:flex fixed inset-0 z-[9999] items-center justify-center p-6 bg-[#0b0c10] bg-[radial-gradient(1000px_600px_at_50%_-20%,rgba(188,251,108,0.08),transparent)]">
            <div className="max-w-md w-full rounded-3xl bg-white/10 ring-1 ring-white/15 backdrop-blur-xl p-6 text-center text-white shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
              <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-brandGreen/20 text-brandGreen flex items-center justify-center ring-1 ring-brandGreen/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Приложение для телефона
              </h2>
              <p className="text-white/80 mt-2">
                Этот интерфейс оптимизирован под смартфоны. Пожалуйста, откройте
                сайт на мобильном устройстве для лучшего опыта.
              </p>
              <div className="mt-4 rounded-2xl bg-black/30 ring-1 ring-white/10 p-4">
                <div className="text-xs text-white/60 mb-2">Быстрый доступ</div>
                <div className="flex items-center justify-center">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                      siteUrl,
                    )}`}
                    alt="QR-код для открытия на телефоне"
                    width={160}
                    height={160}
                    className="rounded-md ring-1 ring-white/10"
                    priority={false}
                  />
                </div>
                <div className="mt-3 text-xs text-white/60 select-all break-all">
                  {siteUrl}
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
