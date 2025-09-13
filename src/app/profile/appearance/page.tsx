export default function AppearancePage() {
  return (
    <div className="bg-white/5 rounded-xl p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Тышкы кыяфәт</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Тема</h3>
          <div className="flex gap-4">
            <button className="px-5 py-3 rounded-lg bg-white/10 ring-1 ring-brand-green">
              Якты
            </button>
            <button className="px-5 py-3 rounded-lg bg-white/5">Караңгы</button>
            <button className="px-5 py-3 rounded-lg bg-white/5">Система</button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-3">Тел</h3>
          <p className="text-white/60">Хәзерге вакытта Татар теле генә бар.</p>
        </div>
      </div>
    </div>
  )
}
