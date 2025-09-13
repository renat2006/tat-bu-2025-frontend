'use client'

import { Card } from '@/components/ui'

export default function SecurityPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Безопасность</h1>
      <div className="space-y-4">
        <button className="w-full text-left p-4 bg-neutral-900/50 rounded-lg">
          Изменить пароль
        </button>
        <button className="w-full text-left p-4 bg-neutral-900/50 rounded-lg">
          Двухфакторная аутентификация
        </button>
      </div>
    </div>
  )
}
