const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-md mx-auto px-4">
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
    </div>
  )
}

export default SecurityPage
