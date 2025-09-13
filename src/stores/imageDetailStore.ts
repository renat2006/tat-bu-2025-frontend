'use client'

import { create } from 'zustand'
import { Album } from '@/types/gallery'

interface ImageDetailState {
  selectedAlbum: Album | null
  selectAlbum: (album: Album | null) => void
}

export const useImageDetailStore = create<ImageDetailState>((set) => ({
  selectedAlbum: null,
  selectAlbum: (album) => set({ selectedAlbum: album }),
}))
