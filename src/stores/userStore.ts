import { create } from 'zustand'

interface User {
  name: string
  surname: string
  email: string
  avatar: string
}

interface UserState {
  user: User
  setUser: (user: Partial<User>) => void
  logout: () => void
}

const defaultUser: User = {
  name: 'Максим',
  surname: 'Сотников',
  email: 'tatar_malay@tatar.ru',
  avatar: '/avatars/man-avatar.png',
}

export const useUserStore = create<UserState>((set) => ({
  user: defaultUser,
  setUser: (newUser) =>
    set((state) => ({ user: { ...state.user, ...newUser } })),
  logout: () => set({ user: defaultUser }),
}))
