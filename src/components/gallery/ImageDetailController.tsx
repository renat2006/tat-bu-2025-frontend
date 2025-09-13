'use client'

import { AnimatePresence } from 'framer-motion'
import { useImageDetailStore } from '@/stores/imageDetailStore'
import { ImageDetail } from './ImageDetail'
import { mockAlbums } from '@/mocks/albums'

export const ImageDetailController = () => {
  const { selectedAlbum, selectAlbum } = useImageDetailStore()

  return (
    <AnimatePresence>
      {selectedAlbum && (
        <ImageDetail
          key={selectedAlbum.id}
          data={selectedAlbum}
          onClose={() => selectAlbum(null)}
        />
      )}
    </AnimatePresence>
  )
}
