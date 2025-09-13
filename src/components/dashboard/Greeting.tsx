'use client'

import { useUserStore } from '@/stores/userStore'
import Tile from '@/components/ui/Tile'
import Link from 'next/link'
import { ChevronsRight } from 'lucide-react'

export function Greeting() {
  const user = useUserStore((state) => state.user)

  return (
    <Tile size="wide" variant="brand" className="!p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
        <div className="min-w-0">
          <h1 className="text-[30px] leading-none font-extrabold truncate">
            Привет, {user.name}!
          </h1>
          <p className="text-ink/70 mt-2 truncate">
            Готов продолжить обучение сегодня?
          </p>
        </div>
        <div className="md:ml-4">
          <Link
            href="/learn/continue"
            className="inline-flex w-full md:w-auto text-white items-center justify-center gap-2 h-12 px-6 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/10 shadow-sm"
          >
            <span>Продолжить</span>
            <ChevronsRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </Tile>
  )
}
