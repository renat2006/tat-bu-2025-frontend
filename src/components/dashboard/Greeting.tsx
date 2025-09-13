'use client'

import { useUserStore } from '@/stores/userStore'
import Tile from '@/components/ui/Tile'
import Image from 'next/image'

export function Greeting() {
  const user = useUserStore((state) => state.user)

  return (
    <Tile size="wide" variant="brand" className="!p-5">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-[28px] leading-none font-extrabold">
            Привет, {user.name}!
          </h1>
          <p className="text-ink/70 mt-2">Готов продолжить обучение сегодня?</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-black/10">
            <Image
              src={user.avatar}
              alt={user.name}
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Tile>
  )
}
