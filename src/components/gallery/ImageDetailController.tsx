'use client'

import { AnimatePresence } from 'framer-motion'
import { useImageDetailStore } from '@/stores/imageDetailStore'
import { ImageDetail } from './ImageDetail'
import { mockAlbums } from '@/mocks/albums'
import { useIsMounted } from '@/hooks/useIsMounted'

export const ImageDetailController = () => {
  const { selectedAlbum, selectAlbum } = useImageDetailStore()
  const mounted = useIsMounted()

  return (
    <AnimatePresence>
      {mounted && selectedAlbum && (
        <ImageDetail
          key={selectedAlbum.id}
          data={selectedAlbum}
          onClose={() => selectAlbum(null)}
        />
      )}
    </AnimatePresence>
  )
}
