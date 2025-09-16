'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { ImageCard } from './ImageCard'
import { mockAlbums } from '@/mocks/albums'
import { ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react'
import { useImageDetailStore } from '@/stores/imageDetailStore'
import { Hint } from './Hint'

const CARD_OFFSET = 20
const SCALE_FACTOR = 0.07
const MAX_VISIBLE = 5

type TutorialPhase = 'strict' | 'hints' | 'done'

const NOTCH_MASK = `url("data:image/svg+xml,%3csvg width='350' height='480' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M36 0L116 0C136 0 146 18 175 18C204 18 214 0 234 0L314 0A36 36 0 01350 36L350 444A36 36 0 01314 480L36 480A36 36 0 010 444L0 36A36 36 0 0136 0Z' fill='white'/%3e%3c/svg%3e")`

export const ImageGallery = () => {
  const { selectAlbum } = useImageDetailStore()
  const [items, setItems] = useState<any[]>(mockAlbums)
  // избежать гидрации: читаем localStorage после маунта
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user-albums')
      const user = raw ? (JSON.parse(raw) as any[]) : []
      if (Array.isArray(user) && user.length) setItems([...user, ...mockAlbums])
    } catch {}
  }, [])
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
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      // Prevent pull-to-refresh on mobile when dragging a card
      if (dragStart) {
        e.preventDefault()
      }
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [dragStart])

  useEffect(() => {
    try {
      const savedPhase = localStorage.getItem('gallery_tutorial_phase')
      if (savedPhase) setTutorialPhase(JSON.parse(savedPhase))
      const savedCompletion = localStorage.getItem('gallery_hint_completion')
      if (savedCompletion) setHintCompletion(JSON.parse(savedCompletion))
    } catch {}
  }, [])

  const saveState = useCallback(
    (
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
    },
    [],
  )

  const windowItems = useMemo(() => {
    const result: Array<{ id: number; idx: number }> = []
    const total = items.length
    for (let pos = 0; pos < total; pos += 1) {
      const idx = (current + pos) % total
      result.push({ id: items[idx].id as number, idx })
    }
    return result
  }, [items, current])

  const nextCard = useCallback(
    () => setCurrent((c) => (c + 1) % items.length),
    [items.length],
  )
  const prevCard = useCallback(
    () => setCurrent((c) => (c - 1 + items.length) % items.length),
    [items.length],
  )

  const handleDragStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      setDragStart({ x: clientX, y: clientY })
      setDragOffset({ x: 0, y: 0 })
    },
    [],
  )

  const handleDragMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!dragStart) return

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const offsetX = clientX - dragStart.x
      const offsetY = clientY - dragStart.y
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setDragOffset({ x: offsetX, y: offsetY })
      })

      const isVerticalDrag = Math.abs(offsetY) > Math.abs(offsetX)
      const isLeftSwipe = !isVerticalDrag && offsetX < -20
      const isRightSwipe = !isVerticalDrag && offsetX > 20
      const isDownSwipe = isVerticalDrag && offsetY > 20

      if (tutorialPhase === 'strict') {
        if (strictStep === 0 && isLeftSwipe) setHintDirection('left')
        else if (strictStep === 1 && isRightSwipe) setHintDirection('right')
        else if (strictStep === 2 && isDownSwipe) setHintDirection('down')
        else setHintDirection(null)
      } else if (tutorialPhase === 'hints') {
        if (isLeftSwipe) setHintDirection('left')
        else if (isRightSwipe) setHintDirection('right')
        else if (isDownSwipe) setHintDirection('down')
        else setHintDirection(null)
      }
    },
    [dragStart, tutorialPhase, strictStep],
  )

  const handleDragEnd = useCallback(() => {
    if (!dragStart) return

    setHintDirection(null)
    setDragStart(null)
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    const threshold = 50
    const isVerticalDrag = Math.abs(dragOffset.y) > Math.abs(dragOffset.x)
    const isLeftSwipe = !isVerticalDrag && dragOffset.x < -threshold
    const isRightSwipe = !isVerticalDrag && dragOffset.x > threshold
    const isDownSwipe = isVerticalDrag && dragOffset.y > threshold

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
      setDragOffset({ x: 0, y: 0 })
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
      if (isLeftSwipe) nextCard()
      else if (isRightSwipe) prevCard()
      else if (isDownSwipe) selectAlbum(items[current])
    }

    if (newCompletion.left && newCompletion.right && newCompletion.down)
      phase = 'done'

    setHintCompletion(newCompletion)
    setTutorialPhase(phase)
    saveState(phase, newCompletion)
    setDragOffset({ x: 0, y: 0 })
  }, [
    dragStart,
    dragOffset,
    items,
    current,
    hintCompletion,
    nextCard,
    prevCard,
    saveState,
    selectAlbum,
    strictStep,
    tutorialPhase,
  ])

  const handleCardLoaded = useCallback(() => {
    if (!hasLoaded) {
      setHasLoaded(true)
    }
  }, [hasLoaded])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="relative w-[min(740px,calc(100%-16px))] flex items-center justify-center overflow-hidden"
        style={{
          perspective: '1000px',
          height: 'clamp(400px, calc(100svh - 160px), 640px)',
        }}
      >
        <div
          className="pointer-events-none absolute h-full w-full z-10"
          style={{
            maskImage: NOTCH_MASK as unknown as string,
            WebkitMaskImage: NOTCH_MASK as unknown as string,
            maskSize: '100% 100%',
          }}
        >
          <div
            className={`absolute inset-y-0 left-0 w-1/2 transition-opacity duration-300 ${
              (tutorialPhase === 'strict' && strictStep === 0) ||
              (tutorialPhase === 'hints' &&
                !hintCompletion.left &&
                hintDirection === 'left')
                ? 'opacity-100'
                : 'opacity-0'
            }`}
            style={{
              background:
                'linear-gradient(to right, rgba(188,251,108,0.14), transparent 75%)',
              backdropFilter: 'blur(2px)',
            }}
          />
          <div
            className={`absolute inset-y-0 right-0 w-1/2 transition-opacity duration-300 ${
              (tutorialPhase === 'strict' && strictStep === 1) ||
              (tutorialPhase === 'hints' &&
                !hintCompletion.right &&
                hintDirection === 'right')
                ? 'opacity-100'
                : 'opacity-0'
            }`}
            style={{
              background:
                'linear-gradient(to left, rgba(188,251,108,0.14), transparent 75%)',
              backdropFilter: 'blur(2px)',
            }}
          />
        </div>

        <Hint
          position="top"
          text="Потяните вниз"
          icon={ArrowDown}
          visible={
            (tutorialPhase === 'strict' && strictStep === 2) ||
            (tutorialPhase === 'hints' &&
              !hintCompletion.down &&
              hintDirection === 'down')
          }
        />
        <Hint
          position="left"
          text="Свайп влево"
          icon={ArrowLeft}
          visible={
            (tutorialPhase === 'strict' && strictStep === 0) ||
            (tutorialPhase === 'hints' &&
              !hintCompletion.left &&
              hintDirection === 'left')
          }
        />
        <Hint
          position="right"
          text="Свайп вправо"
          icon={ArrowRight}
          visible={
            (tutorialPhase === 'strict' && strictStep === 1) ||
            (tutorialPhase === 'hints' &&
              !hintCompletion.right &&
              hintDirection === 'right')
          }
        />

        <div className="relative w-full h-full">
          {windowItems.slice(0, MAX_VISIBLE).map((it, pos) => {
            const card = items[it.idx]
            const isTopCard = pos === 0

            return (
              <div
                key={card.id}
                className={`absolute inset-0 w-full h-full ${
                  isTopCard
                    ? 'cursor-grab active:cursor-grabbing'
                    : 'pointer-events-none'
                }`}
                style={{
                  transformOrigin: 'top center',
                  zIndex: windowItems.length - pos,
                  transform:
                    isTopCard && (dragOffset.x !== 0 || dragOffset.y !== 0)
                      ? `translate3d(${dragOffset.x}px, ${pos * CARD_OFFSET + dragOffset.y * 0.1}px, 0) scale(${1 - pos * SCALE_FACTOR}) rotate(${pos > 0 ? (pos % 2 === 0 ? -0.6 : 0.6) : 0}deg)`
                      : `translate3d(0, ${pos * CARD_OFFSET}px, 0) scale(${1 - pos * SCALE_FACTOR}) rotate(${pos > 0 ? (pos % 2 === 0 ? -0.6 : 0.6) : 0}deg)`,
                  opacity: 1 - pos * 0.06,
                  transition:
                    isTopCard && dragOffset.x === 0 && dragOffset.y === 0
                      ? 'transform 0.3s ease-out'
                      : 'none',
                  willChange: 'transform',
                }}
                onTouchStart={isTopCard ? handleDragStart : undefined}
                onTouchMove={isTopCard ? handleDragMove : undefined}
                onTouchEnd={isTopCard ? handleDragEnd : undefined}
                onMouseDown={isTopCard ? handleDragStart : undefined}
                onMouseMove={isTopCard ? handleDragMove : undefined}
                onMouseUp={isTopCard ? handleDragEnd : undefined}
                onMouseLeave={isTopCard ? handleDragEnd : undefined}
              >
                <ImageCard
                  data={card}
                  isTop={isTopCard}
                  preload
                  onLoaded={handleCardLoaded}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
