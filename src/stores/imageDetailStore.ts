'use client'

import { create } from 'zustand'

interface ImageDetailState {
  selectedId: number | null
  selectId: (id: number | null) => void
}

export const useImageDetailStore = create<ImageDetailState>((set) => ({
  selectedId: null,
  selectId: (id) => set({ selectedId: id }),
}))
