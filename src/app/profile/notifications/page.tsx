export default function NotificationsPage() {
  return (
    <div className="bg-white/5 rounded-xl p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Белдерүләр</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Электрон почта белдерүләре</h3>
            <p className="text-white/60 text-sm">
              Яңалыклар, вакыйгалар һәм тәкъдимнәр турында хәбәрләр алыгыз.
            </p>
          </div>
          <button className="w-12 h-7 rounded-full bg-brand-green p-1 flex items-center">
            <span className="w-5 h-5 rounded-full bg-black block"></span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Пуш-белдерүләр</h3>
            <p className="text-white/60 text-sm">
              Яңа белдерүләр турында шунда ук хәбәрләр алыгыз.
            </p>
          </div>
          <button className="w-12 h-7 rounded-full bg-white/10 p-1 flex items-center justify-end">
            <span className="w-5 h-5 rounded-full bg-white/40 block"></span>
          </button>
        </div>
      </div>
    </div>
  )
}
