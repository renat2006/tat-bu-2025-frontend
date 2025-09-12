'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageCard } from './ImageCard'
import { mockImages } from '@/mocks/images'
import { MoveVertical } from 'lucide-react'

const CARD_OFFSET = 20
const SCALE_FACTOR = 0.07
const MAX_VISIBLE = 4

export const ImageGallery = () => {
  const [cards, setCards] = useState(mockImages)
  const [showHint, setShowHint] = useState(false)
  const [visibleCount, setVisibleCount] = useState(2)

  useEffect(() => {
    try {
      const seen =
        typeof window !== 'undefined' &&
        localStorage.getItem('gallery_hint_seen')
      if (!seen) {
        setShowHint(true)
        const t = setTimeout(() => setShowHint(false), 3500)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [])

  const visibleCards = useMemo(
    () => cards.slice(0, Math.min(visibleCount, MAX_VISIBLE)),
    [cards, visibleCount],
  )

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
    if (info.offset.y > 90) {
      nextCard()
    } else if (info.offset.y < -70) {
      prevCard()
    }
  }

  const handleCardLoaded = (index: number) => {
    if (index >= visibleCount - 1 && visibleCount < MAX_VISIBLE) {
      setVisibleCount((c) => Math.min(c + 1, MAX_VISIBLE))
    }
  }

  return (
    <div className="relative w-full h-[560px] flex items-center justify-center will-change-transform [transform:translateZ(0)] overflow-hidden">
      <AnimatePresence initial={false}>
        {visibleCards.map((card, index) => {
          const isTopCard = index === 0

          return (
            <motion.div
              key={`${card.id}-${index}`}
              className="absolute w-[min(680px,calc(100%-24px))] h-full"
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
                opacity: 1 - index * 0.06,
                rotate: index === 0 ? 0 : index % 2 === 0 ? -0.6 : 0.6,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 26,
                mass: 0.9,
              }}
              whileDrag={{ scale: isTopCard ? 0.98 : undefined }}
              drag={isTopCard ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.14}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              exit={{
                y: 240,
                opacity: 0,
                rotate: 1.5,
                transition: { type: 'spring', stiffness: 260, damping: 28 },
              }}
            >
              <ImageCard
                data={card}
                isTop={isTopCard}
                onLoaded={() => handleCardLoaded(index)}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>

      <AnimatePresence>
        {showHint && (
          <motion.div
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-white/10 ring-1 ring-white/15 text-white text-sm md:text-base backdrop-blur-xl shadow-xl flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onAnimationComplete={() => {
              try {
                localStorage.setItem('gallery_hint_seen', '1')
              } catch {}
            }}
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <MoveVertical className="h-4 w-4" />
            </span>
            Проведите вниз — дальше, вверх — назад.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
