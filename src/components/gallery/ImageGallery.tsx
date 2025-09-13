'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, PanInfo, useMotionValue } from 'framer-motion'
import { ImageCard } from './ImageCard'
import { mockAlbums } from '@/mocks/albums'
import { ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react'
import { useImageDetailStore } from '@/stores/imageDetailStore'
import { Hint } from './Hint'

const CARD_OFFSET = 20
const SCALE_FACTOR = 0.07
const MAX_VISIBLE = 5

type TutorialPhase = 'strict' | 'hints' | 'done'

const NOTCH_MASK = `url("data:image/svg+xml,%3csvg width='350' height='480' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M48 0L121 0C141 0 141 24 175 24C209 24 209 0 229 0L302 0A48 48 0 01350 48L350 432A48 48 0 01302 480L48 480A48 48 0 010 432L0 48A48 48 0 0148 0Z' fill='white'/%3e%3c/svg%3e")`

export const ImageGallery = () => {
  const { selectAlbum } = useImageDetailStore()
  const items = useMemo(() => mockAlbums, [])
  const [current, setCurrent] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const [hintDirection, setHintDirection] = useState<
    'left' | 'right' | 'down' | null
  >(null)
  const [tutorialPhase, setTutorialPhase] = useState<TutorialPhase>('strict')
  const [strictStep, setStrictStep] = useState(0)
  const [hintCompletion, setHintCompletion] = useState({
    left: false,
    right: false,
    down: false,
  })
  const [loadedCount, setLoadedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const x = useMotionValue(0)

  useEffect(() => {
    try {
      const savedPhase = localStorage.getItem('gallery_tutorial_phase')
      if (savedPhase) setTutorialPhase(JSON.parse(savedPhase))
      const savedCompletion = localStorage.getItem('gallery_hint_completion')
      if (savedCompletion) setHintCompletion(JSON.parse(savedCompletion))
    } catch {}
  }, [])

  useEffect(() => {
    if (loadedCount >= visibleCount) setIsLoading(false)
  }, [loadedCount, visibleCount])

  const saveState = (
    phase: TutorialPhase,
    completion: { left: boolean; right: boolean; down: boolean },
  ) => {
    try {
      localStorage.setItem('gallery_tutorial_phase', JSON.stringify(phase))
      localStorage.setItem(
        'gallery_hint_completion',
        JSON.stringify(completion),
      )
    } catch {}
  }

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

  const handleDrag = (_event: unknown, info: PanInfo) => {
    if (isLoading) return
    if (tutorialPhase === 'strict') {
      const isVerticalDrag = Math.abs(info.offset.y) > Math.abs(info.offset.x)
      const isLeftSwipe = !isVerticalDrag && info.offset.x < -20
      const isRightSwipe = !isVerticalDrag && info.offset.x > 20
      const isDownSwipe = isVerticalDrag && info.offset.y > 20

      if (strictStep === 0 && isLeftSwipe) setHintDirection('left')
      else if (strictStep === 1 && isRightSwipe) setHintDirection('right')
      else if (strictStep === 2 && isDownSwipe) setHintDirection('down')
      else setHintDirection(null)
      return
    }

    if (tutorialPhase !== 'hints') return

    if (Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
      if (info.offset.y > 20) setHintDirection('down')
      else setHintDirection(null)
    } else {
      if (info.offset.x < -20) setHintDirection('left')
      else if (info.offset.x > 20) setHintDirection('right')
      else setHintDirection(null)
    }
  }

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    setHintDirection(null)

    const dx = info.offset.x
    const dy = info.offset.y
    const vx = info.velocity.x || 0
    const vy = info.velocity.y || 0

    const horizontal = Math.abs(dx) >= Math.abs(dy)
    const isLeftSwipe = horizontal && (dx < -40 || vx < -600)
    const isRightSwipe = horizontal && (dx > 40 || vx > 600)
    const isDownSwipe = !horizontal && (dy > 50 || vy > 800)

    if (tutorialPhase === 'strict') {
      if (strictStep === 0 && isLeftSwipe) {
        nextCard()
        setStrictStep(1)
      } else if (strictStep === 1 && isRightSwipe) {
        prevCard()
        setStrictStep(2)
      } else if (strictStep === 2 && isDownSwipe) {
        selectAlbum(items[current])
        setTutorialPhase('hints')
        saveState('hints', hintCompletion)
      }
      return
    }

    let newCompletion = { ...hintCompletion }
    let phase = tutorialPhase

    if (isDownSwipe && !hintCompletion.down) {
      selectAlbum(items[current])
      newCompletion.down = true
    } else if (isLeftSwipe && !hintCompletion.left) {
      nextCard()
      newCompletion.left = true
    } else if (isRightSwipe && !hintCompletion.right) {
      prevCard()
      newCompletion.right = true
    } else {
      // Allow free navigation even after hints are done
      if (isLeftSwipe) nextCard()
      else if (isRightSwipe) prevCard()
      else if (isDownSwipe) selectAlbum(items[current])
    }

    if (newCompletion.left && newCompletion.right && newCompletion.down)
      phase = 'done'

    setHintCompletion(newCompletion)
    setTutorialPhase(phase)
    saveState(phase, newCompletion)
  }

  const handleCardLoaded = (pos: number) => {
    setLoadedCount((c) => c + 1)
    if (pos >= visibleCount - 1 && visibleCount < MAX_VISIBLE)
      setVisibleCount((c) => Math.min(c + 1, MAX_VISIBLE))
  }

  return (
    <div className="relative w-full h-[600px] md:h-[640px] flex items-center justify-center will-change-transform [transform:translateZ(0)] overflow-hidden">
      <motion.div
        className="pointer-events-none absolute h-full w-[min(740px,calc(100%-16px))] z-10"
        style={{
          maskImage: NOTCH_MASK as unknown as string,
          WebkitMaskImage: NOTCH_MASK as unknown as string,
          maskSize: '100% 100%',
          x,
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2"
          style={{
            background:
              'linear-gradient(to right, rgba(255, 0, 0, 0.5), transparent 80%)',
            filter: 'blur(24px)',
            willChange: 'opacity',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              !isLoading &&
              ((tutorialPhase === 'strict' && strictStep === 0) ||
                (tutorialPhase === 'hints' &&
                  !hintCompletion.left &&
                  hintDirection === 'left'))
                ? 1
                : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2"
          style={{
            background:
              'linear-gradient(to left, rgba(0, 255, 255, 0.5), transparent 80%)',
            filter: 'blur(24px)',
            willChange: 'opacity',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              !isLoading &&
              ((tutorialPhase === 'strict' && strictStep === 1) ||
                (tutorialPhase === 'hints' &&
                  !hintCompletion.right &&
                  hintDirection === 'right'))
                ? 1
                : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </motion.div>

      <Hint
        position="top"
        text="Альбомны ачу өчен аска тартыгыз"
        icon={ArrowDown}
        visible={
          !isLoading &&
          ((tutorialPhase === 'strict' && strictStep === 2) ||
            (tutorialPhase === 'hints' &&
              !hintCompletion.down &&
              hintDirection === 'down'))
        }
      />
      <Hint
        position="left"
        text="Киләсе рәсемгә күчү өчен сулга шудырыгыз"
        icon={ArrowLeft}
        visible={
          !isLoading &&
          ((tutorialPhase === 'strict' && strictStep === 0) ||
            (tutorialPhase === 'hints' &&
              !hintCompletion.left &&
              hintDirection === 'left'))
        }
      />
      <Hint
        position="right"
        text="Алдагы рәсемгә кайту өчен уңга шудырыгыз"
        icon={ArrowRight}
        visible={
          !isLoading &&
          ((tutorialPhase === 'strict' && strictStep === 1) ||
            (tutorialPhase === 'hints' &&
              !hintCompletion.right &&
              hintDirection === 'right'))
        }
      />
      <AnimatePresence>
        {windowItems.slice(0, visibleCount).map((it, pos) => {
          const card = items[it.idx]
          const isTopCard = pos === 0

          return (
            <motion.div
              key={card.id}
              className={`absolute w-[min(740px,calc(100%-16px))] h-full will-change-transform [transform:translateZ(0)] ${
                isTopCard ? '' : 'pointer-events-none'
              }`}
              style={{
                transformOrigin: 'top center',
                zIndex: windowItems.length - pos,
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                x: isTopCard ? x : undefined,
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
              drag={isTopCard && !isLoading}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.14}
              dragMomentum={false}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              exit={{
                x: pos === 0 ? (it.idx > current ? -300 : 300) : 0,
                opacity: 0,
                scale: 0.9,
                transition: { type: 'spring', stiffness: 260, damping: 28 },
              }}
            >
              <ImageCard
                data={card}
                isTop={isTopCard}
                preload
                onLoaded={() => handleCardLoaded(pos)}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
      {isLoading && (
        <div className="absolute inset-0 z-[60] pointer-events-auto cursor-wait">
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-2 md:inset-4 rounded-[48px] bg-neutral-900 animate-pulse" />
        </div>
      )}
    </div>
  )
}
