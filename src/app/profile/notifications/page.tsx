const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-md mx-auto px-4">
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
    </div>
  )
}

export default NotificationsPage
