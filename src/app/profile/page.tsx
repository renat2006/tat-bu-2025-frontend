'use client'

import Image from 'next/image'
import { useUserStore } from '@/stores/userStore'
import { ChangeEvent, FormEvent, useState } from 'react'

export default function ProfilePage() {
  const { user, setUser } = useUserStore()
  const [formData, setFormData] = useState({
    name: user.name,
    surname: user.surname,
    email: user.email,
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setUser(formData)
  }

  return (
    <div className="text-white">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24">
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={96}
            height={96}
            className="rounded-full"
          />
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-black hover:bg-brand-green/80 transition-colors duration-200">
            +
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{`${user.name} ${user.surname}`}</h2>
          <p className="text-white/60">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-xs md:text-sm font-medium text-white/80 mb-2"
            >
              Исем
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-white/5 rounded-lg px-4 py-3 ring-1 ring-white/10 focus:ring-brand-green focus:outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="surname"
              className="block text-xs md:text-sm font-medium text-white/80 mb-2"
            >
              Фамилия
            </label>
            <input
              type="text"
              id="surname"
              value={formData.surname}
              onChange={handleInputChange}
              className="w-full bg-white/5 rounded-lg px-4 py-3 ring-1 ring-white/10 focus:ring-brand-green focus:outline-none transition-all duration-200"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="email"
              className="block text-xs md:text-sm font-medium text-white/80 mb-2"
            >
              Электрон почта
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-white/5 rounded-lg px-4 py-3 ring-1 ring-white/10 focus:ring-brand-green focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        <div className="mt-6 md:mt-8 flex justify-end">
          <button
            type="submit"
            className="h-11 px-5 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/20 hover:opacity-90 transition-all"
          >
            Саклау
          </button>
        </div>
      </form>
    </div>
  )
}
