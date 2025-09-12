'use client'

import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ImageDetail } from './ImageDetail'
import { useImageDetailStore } from '@/stores/imageDetailStore'
import { mockImages } from '@/mocks/images'

export const ImageDetailController = () => {
  const { selectedId, selectId } = useImageDetailStore()
  const items = useMemo(() => mockImages, [])

  const selectedCardData = useMemo(() => {
    return selectedId !== null
      ? items.find((item) => item.id === selectedId)
      : null
  }, [selectedId, items])

  return (
    <AnimatePresence>
      {selectedCardData && (
        <ImageDetail data={selectedCardData} onClose={() => selectId(null)} />
      )}
    </AnimatePresence>
  )
}
