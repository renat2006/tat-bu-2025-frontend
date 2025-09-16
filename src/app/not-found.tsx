import type { Viewport } from 'next'
import Link from 'next/link'

export const viewport: Viewport = {
  themeColor: '#0B1220',
}

export default function NotFound() {
  return (
    <main
      className="min-h-[80vh] flex items-center justify-center px-4"
      style={{
        paddingTop: 'calc(24px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="max-w-md w-full text-center text-white">
        <h1 className="text-3xl font-extrabold">Страница не найдена</h1>
        <p className="text-white/70 mt-2">
          Кажется, такой страницы нет. Проверьте адрес или вернитесь на главную.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/"
            className="h-11 px-5 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/20"
          >
            На главную
          </Link>
        </div>
      </div>
    </main>
  )
}
