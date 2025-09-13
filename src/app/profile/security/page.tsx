export default function SecurityPage() {
  return (
    <div className="bg-white/5 rounded-xl p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Иминлек</h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="current-password"
            className="block text-sm font-medium text-white/80 mb-2"
          >
            Хәзерге серсүз
          </label>
          <input
            type="password"
            id="current-password"
            className="w-full bg-white/5 rounded-lg px-4 py-3 ring-1 ring-white/10 focus:ring-brand-green focus:outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-white/80 mb-2"
          >
            Яңа серсүз
          </label>
          <input
            type="password"
            id="new-password"
            className="w-full bg-white/5 rounded-lg px-4 py-3 ring-1 ring-white/10 focus:ring-brand-green focus:outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-white/80 mb-2"
          >
            Яңа серсүзне раслагыз
          </label>
          <input
            type="password"
            id="confirm-password"
            className="w-full bg-white/5 rounded-lg px-4 py-3 ring-1 ring-white/10 focus:ring-brand-green focus:outline-none transition-all duration-200"
          />
        </div>
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-brand-green text-black font-semibold rounded-lg hover:bg-brand-green/80 transition-colors duration-200">
            Серсүзне яңарту
          </button>
        </div>
      </div>
      <div className="border-t border-white/10 my-8"></div>
      <div>
        <h3 className="text-lg font-medium">Ике факторлы аутентификация</h3>
        <p className="text-white/60 text-sm mb-4">
          Аккаунтыгызга өстәмә куркынычсызлык катламы өстәгез.
        </p>
        <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors duration-200">
          Көйләү
        </button>
      </div>
    </div>
  )
}
