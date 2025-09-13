'use client'

import { Card } from '@/components/ui'

export default function NotificationsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Уведомления</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-lg">
          <span>Push-уведомления</span>
          <input type="checkbox" className="toggle-switch" defaultChecked />
        </div>
        <div className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-lg">
          <span>Email-уведомления</span>
          <input type="checkbox" className="toggle-switch" />
        </div>
      </div>
    </div>
  )
}
