'use client'

import { Card } from '@/components/ui'

export default function AppearancePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Внешний вид</h1>
      <div className="space-y-4">
        <div className="p-4 bg-neutral-900/50 rounded-lg">
          <label className="block mb-2">Тема</label>
          <select className="w-full p-2 bg-neutral-800 rounded">
            <option>Авто</option>
            <option>Светлая</option>
            <option>Темная</option>
          </select>
        </div>
      </div>
    </div>
  )
}
