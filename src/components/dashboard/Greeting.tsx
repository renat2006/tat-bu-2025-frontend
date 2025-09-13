'use client'

import { useUserStore } from '@/stores/userStore'
import Tile from '@/components/ui/Tile'
import Link from 'next/link'
import { ChevronsRight } from 'lucide-react'

export function Greeting() {
  const user = useUserStore((state) => state.user)

  return (
    <Tile size="wide" variant="brand" className="!p-6">
      <div className="w-full">
        <h1 className="text-[30px] leading-none font-extrabold">
          Привет, {user.name}!
        </h1>
        <p className="text-ink/70 mt-2">Готов продолжить обучение сегодня?</p>
        <div className="mt-4">
          <Link
            href="/learn/continue"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-ink text-brandGreen font-bold"
          >
            <span>Продолжить</span>
            <ChevronsRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </Tile>
  )
}
