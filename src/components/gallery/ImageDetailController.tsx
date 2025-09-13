'use client'

import { useImageDetailStore } from '@/stores/imageDetailStore'
import { ImageDetail } from './ImageDetail'
import { useIsMounted } from '@/hooks/useIsMounted'

export const ImageDetailController = () => {
  const { selectedAlbum, selectAlbum } = useImageDetailStore()
  const mounted = useIsMounted()

  if (!mounted || !selectedAlbum) return null

  return (
    <ImageDetail
      key={selectedAlbum.id}
      data={selectedAlbum}
      onClose={() => selectAlbum(null)}
    />
  )
}
