'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageCard } from './ImageCard'
import { mockImages } from '@/mocks/images'
import { MoveVertical } from 'lucide-react'

const CARD_OFFSET = 18
const SCALE_FACTOR = 0.06
const MAX_VISIBLE = 4

export const ImageGallery = () => {
  const [cards, setCards] = useState(mockImages)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    try {
      const seen =
        typeof window !== 'undefined' &&
        localStorage.getItem('gallery_hint_seen')
      if (!seen) {
        setShowHint(true)
        const t = setTimeout(() => setShowHint(false), 2200)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [])

  const visibleCards = useMemo(() => cards.slice(0, MAX_VISIBLE), [cards])

  const nextCard = () => setCards((prev) => [...prev.slice(1), prev[0]])
  const prevCard = () =>
    setCards((prev) => [
      prev[prev.length - 1],
      ...prev.slice(0, prev.length - 1),
    ])

  const handleDragEnd = (_event: unknown, info: { offset: { y: number } }) => {
    if (showHint) {
      setShowHint(false)
      try {
        localStorage.setItem('gallery_hint_seen', '1')
      } catch {}
    }
    if (info.offset.y > 100) {
      nextCard()
    } else if (info.offset.y < -60) {
      prevCard()
    }
  }

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center will-change-transform [transform:translateZ(0)]">
      <AnimatePresence initial={false}>
        {visibleCards.map((card, index) => {
          const isTopCard = index === 0

          return (
            <motion.div
              key={`${card.id}-${index}`}
              className="absolute w-[calc(100%-64px)] max-w-sm h-full"
              style={{
                transformOrigin: 'top center',
                zIndex: visibleCards.length - index,
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              initial={false}
              animate={{
                y: index * CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR,
                opacity: 1,
                rotate: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 28,
                mass: 0.9,
              }}
              drag={isTopCard ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.12}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              exit={{
                y: 220,
                opacity: 0,
                transition: { type: 'spring', stiffness: 260, damping: 30 },
              }}
            >
              <ImageCard data={card} isTop={isTopCard} />
            </motion.div>
          )
        })}
      </AnimatePresence>

      <AnimatePresence>
        {showHint && (
          <motion.div
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 ring-1 ring-white/15 text-white text-sm backdrop-blur-md shadow-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onAnimationComplete={() => {
              try {
                localStorage.setItem('gallery_hint_seen', '1')
              } catch {}
            }}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <MoveVertical className="h-4 w-4" />
            </span>
            Проведите вниз — откроется новое. Вверх — вернётся прошлое.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
