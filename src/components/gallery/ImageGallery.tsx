'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageCard } from './ImageCard'
import { mockImages } from '@/mocks/images'
import { MoveVertical } from 'lucide-react'
import { useImageDetailStore } from '@/stores/imageDetailStore'

const CARD_OFFSET = 20
const SCALE_FACTOR = 0.07
const MAX_VISIBLE = 5

// Reusable SVG mask for the card notch to keep shape during animations
const MASK_SVG = `url("data:image/svg+xml,%3csvg width='350' height='480' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M48 0L121 0C141 0 141 24 175 24C209 24 209 0 229 0L302 0A48 48 0 01350 48L350 432A48 48 0 01302 480L48 480A48 48 0 010 432L0 48A48 48 0 0148 0Z' fill='white'/%3e%3c/svg%3e")`

export const ImageGallery = () => {
  const { selectId } = useImageDetailStore()
  const items = useMemo(() => mockImages, [])
  const [current, setCurrent] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [visibleCount, setVisibleCount] = useState(3)

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

  const windowItems = useMemo(() => {
    const result: Array<{ id: number; idx: number }> = []
    const total = items.length
    for (let pos = 0; pos < total; pos += 1) {
      const idx = (current + pos) % total
      result.push({ id: items[idx].id as number, idx })
    }
    return result
  }, [items, current])

  const nextCard = () => setCurrent((c) => (c + 1) % items.length)
  const prevCard = () =>
    setCurrent((c) => (c - 1 + items.length) % items.length)

  const handleDragEnd = (
    _event: unknown,
    info: { offset: { x: number; y: number } },
  ) => {
    if (showHint) {
      setShowHint(false)
      try {
        localStorage.setItem('gallery_hint_seen', '1')
      } catch {}
    }

    if (Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
      if (info.offset.y > 60) {
        selectId(items[current].id)
      }
    } else {
      if (info.offset.x < -60) {
        nextCard()
      } else if (info.offset.x > 60) {
        prevCard()
      }
    }
  }

  const handleCardLoaded = (pos: number) => {
    if (pos >= visibleCount - 1 && visibleCount < MAX_VISIBLE) {
      setVisibleCount((c) => Math.min(c + 1, MAX_VISIBLE))
    }
  }

  return (
    <div className="relative w-full h-[600px] md:h-[640px] flex items-center justify-center will-change-transform [transform:translateZ(0)] overflow-hidden">
      <AnimatePresence>
        {windowItems.map((it, pos) => {
          const card = items[it.idx]
          const isTopCard = pos === 0

          return (
            <motion.div
              key={card.id}
              className={`absolute w-[min(740px,calc(100%-16px))] h-full will-change-transform [transform:translateZ(0)] ${isTopCard ? '' : 'pointer-events-none'}`}
              style={{
                transformOrigin: 'top center',
                zIndex: windowItems.length - pos,
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                maskImage: MASK_SVG as unknown as string,
                WebkitMaskImage: MASK_SVG as unknown as string,
                maskSize: '100% 100%',
              }}
              initial={false}
              animate={{
                y: pos * CARD_OFFSET,
                scale: 1 - pos * SCALE_FACTOR,
                opacity: 1 - pos * 0.06,
                rotate: pos > 0 ? (pos % 2 === 0 ? -0.6 : 0.6) : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 28,
                mass: 1,
              }}
              drag={isTopCard}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.14}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              exit={{
                x: pos === 0 ? (it.idx > current ? -300 : 300) : 0,
                opacity: 0,
                scale: 0.9,
                transition: { type: 'spring', stiffness: 260, damping: 28 },
              }}
            >
              <ImageCard data={card} isTop={isTopCard} preload />
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
