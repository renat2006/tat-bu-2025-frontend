'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ImageCard } from './ImageCard'
import { mockAlbums } from '@/mocks/albums'
import { ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react'
import { useImageDetailStore } from '@/stores/imageDetailStore'
import { Hint } from './Hint'
import { useIsAndroid } from '@/hooks/useIsAndroid'
import { useDrag } from '@use-gesture/react'

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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const topCardRef = useRef<HTMLDivElement | null>(null)
  const nextCardRef = useRef<HTMLDivElement | null>(null)
  const prevCardRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const dragActiveRef = useRef(false)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const dxRef = useRef(0)
  const dyRef = useRef(0)
  const isAndroid = useIsAndroid()

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
  const updateHint = (dx: number, dy: number) => {
    if (tutorialPhase === 'strict') {
      const isVerticalDrag = Math.abs(dy) > Math.abs(dx)
      const isLeftSwipe = !isVerticalDrag && dx < -20
      const isRightSwipe = !isVerticalDrag && dx > 20
      const isDownSwipe = isVerticalDrag && dy > 20
      if (strictStep === 0 && isLeftSwipe) setHintDirection('left')
      else if (strictStep === 1 && isRightSwipe) setHintDirection('right')
      else if (strictStep === 2 && isDownSwipe) setHintDirection('down')
      else setHintDirection(null)
      return
    }
    if (tutorialPhase !== 'hints') return
    if (Math.abs(dy) > Math.abs(dx)) {
      if (dy > 20) setHintDirection('down')
      else setHintDirection(null)
    } else {
      if (dx < -20) setHintDirection('left')
      else if (dx > 20) setHintDirection('right')
      else setHintDirection(null)
    }
  }

  const applyTopCardTransform = (dx: number, dy: number) => {
    const el = topCardRef.current
    if (!el) return
    const translateY = Math.max(0, dy * 0.2)
    const rotate = Math.max(-8, Math.min(8, dx * 0.04))
    el.style.transition = 'none'
    el.style.transform = `translate3d(${dx}px, ${translateY}px, 0) rotate(${rotate}deg)`

    // neighbor cards preview
    const nextEl = nextCardRef.current
    const prevEl = prevCardRef.current
    const tLeft = Math.max(0, Math.min(1, -dx / 140))
    const tRight = Math.max(0, Math.min(1, dx / 140))
    // base for neighbor layers
    const baseY = CARD_OFFSET
    const baseScale = 1 - SCALE_FACTOR
    const baseOpacity = 1 - 0.06
    if (nextEl) {
      nextEl.style.transition = 'none'
      const y = baseY * (1 - tLeft)
      const s = baseScale + tLeft * (1 - baseScale)
      const o = baseOpacity + tLeft * (1 - baseOpacity)
      const r = -0.6 // keep slight rotation
      nextEl.style.transform = `translate3d(0, ${y}px, 0) scale(${s}) rotate(${r}deg)`
      nextEl.style.opacity = String(o)
    }
    if (prevEl) {
      prevEl.style.transition = 'none'
      const y = baseY * (1 - tRight)
      const s = baseScale + tRight * (1 - baseScale)
      const o = baseOpacity + tRight * (1 - baseOpacity)
      const r = 0.6
      prevEl.style.transform = `translate3d(0, ${y}px, 0) scale(${s}) rotate(${r}deg)`
      prevEl.style.opacity = String(o)
    }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLoading) return
    dragActiveRef.current = true
    startXRef.current = e.clientX
    startYRef.current = e.clientY
    dxRef.current = 0
    dyRef.current = 0
    e.currentTarget.setPointerCapture(e.pointerId)
    // prepare neighbor transitions
    if (nextCardRef.current) nextCardRef.current.style.transition = 'none'
    if (prevCardRef.current) prevCardRef.current.style.transition = 'none'
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragActiveRef.current) return
    dxRef.current = e.clientX - startXRef.current
    dyRef.current = e.clientY - startYRef.current
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      applyTopCardTransform(dxRef.current, dyRef.current)
      updateHint(dxRef.current, dyRef.current)
    })
  }

  const settleTo = (transform: string, callback?: () => void) => {
    const el = topCardRef.current
    if (!el) {
      callback?.()
      return
    }
    const done = () => {
      callback?.()
    }
    const handle = () => {
      el.removeEventListener('transitionend', handle)
      done()
    }
    el.addEventListener('transitionend', handle)
    // set transition first, force reflow, then set transform to ensure transition fires
    el.style.transition =
      'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease'
    // force reflow
    void el.offsetHeight
    requestAnimationFrame(() => {
      el.style.transform = transform
    })
    // safety fallback in case transitionend doesn't fire
    window.setTimeout(() => {
      try {
        el.removeEventListener('transitionend', handle)
      } catch {}
      done()
    }, 450)
  }

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragActiveRef.current) return
    dragActiveRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}
    const dx = dxRef.current
    const dy = dyRef.current
    setHintDirection(null)

    const horizontal = Math.abs(dx) >= Math.abs(dy)
    const isLeftSwipe = horizontal && dx < -40
    const isRightSwipe = horizontal && dx > 40
    const isDownSwipe = !horizontal && dy > 60

    const width = containerRef.current?.clientWidth || 400

    const nextEl = nextCardRef.current
    const prevEl = prevCardRef.current
    const animateNeighborToTop = (neighbor: HTMLDivElement | null) => {
      if (!neighbor) return
      neighbor.style.transition =
        'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease'
      // force reflow
      void neighbor.offsetHeight
      neighbor.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)'
      neighbor.style.opacity = '1'
    }

    if (tutorialPhase === 'strict') {
      if (strictStep === 0 && isLeftSwipe) {
        animateNeighborToTop(nextEl)
        settleTo(`translate3d(${-width}px, 0, 0) rotate(-12deg)`, () => {
          nextCard()
          setStrictStep(1)
        })
        return
      }
      if (strictStep === 1 && isRightSwipe) {
        animateNeighborToTop(prevEl)
        settleTo(`translate3d(${width}px, 0, 0) rotate(12deg)`, () => {
          prevCard()
          setStrictStep(2)
        })
        return
      }
      if (strictStep === 2 && isDownSwipe) {
        settleTo('translate3d(0, 120px, 0) rotate(0deg)', () => {
          selectAlbum(items[current])
          setTutorialPhase('hints')
          saveState('hints', hintCompletion)
        })
        return
      }
      // revert
      if (nextEl || prevEl) {
        const resetNeighbor = (el: HTMLDivElement | null, rot: number) => {
          if (!el) return
          el.style.transition = 'transform 200ms ease, opacity 200ms ease'
          void el.offsetHeight
          el.style.transform = `translate3d(0, ${CARD_OFFSET}px, 0) scale(${1 - SCALE_FACTOR}) rotate(${rot}deg)`
          el.style.opacity = String(1 - 0.06)
        }
        resetNeighbor(nextEl, -0.6)
        resetNeighbor(prevEl, 0.6)
      }
      settleTo('translate3d(0, 0, 0) rotate(0deg)')
      return
    }

    let newCompletion = { ...hintCompletion }
    let phase = tutorialPhase

    if (isDownSwipe && !hintCompletion.down) {
      settleTo('translate3d(0, 120px, 0) rotate(0deg)', () => {
        selectAlbum(items[current])
      })
      newCompletion.down = true
    } else if (isLeftSwipe && !hintCompletion.left) {
      animateNeighborToTop(nextEl)
      settleTo(`translate3d(${-width}px, 0, 0) rotate(-12deg)`, () => {
        nextCard()
      })
      newCompletion.left = true
    } else if (isRightSwipe && !hintCompletion.right) {
      animateNeighborToTop(prevEl)
      settleTo(`translate3d(${width}px, 0, 0) rotate(12deg)`, () => {
        prevCard()
      })
      newCompletion.right = true
    } else {
      // free navigation after done
      if (isLeftSwipe) {
        animateNeighborToTop(nextEl)
        settleTo(`translate3d(${-width}px, 0, 0) rotate(-12deg)`, nextCard)
      } else if (isRightSwipe) {
        animateNeighborToTop(prevEl)
        settleTo(`translate3d(${width}px, 0, 0) rotate(12deg)`, prevCard)
      } else if (isDownSwipe)
        settleTo('translate3d(0, 120px, 0) rotate(0deg)', () =>
          selectAlbum(items[current]),
        )
      else settleTo('translate3d(0, 0, 0) rotate(0deg)')
    }

    if (newCompletion.left && newCompletion.right && newCompletion.down)
      phase = 'done'
    setHintCompletion(newCompletion)
    setTutorialPhase(phase)
    saveState(phase, newCompletion)
  }

  // Gesture handler via use-gesture for robust cross-device swipes
  const bindTop = useDrag(
    ({ first, last, down, movement: [mx, my] }) => {
      if (isLoading) return
      if (first) {
        dragActiveRef.current = true
        dxRef.current = 0
        dyRef.current = 0
        if (nextCardRef.current) nextCardRef.current.style.transition = 'none'
        if (prevCardRef.current) prevCardRef.current.style.transition = 'none'
      }
      dxRef.current = mx
      dyRef.current = my
      if (down) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
          applyTopCardTransform(dxRef.current, dyRef.current)
          updateHint(dxRef.current, dyRef.current)
        })
      }
      if (last) {
        // synthesize end
        dragActiveRef.current = false
        const dx = dxRef.current
        const dy = dyRef.current
        setHintDirection(null)

        const horizontal = Math.abs(dx) >= Math.abs(dy)
        const isLeftSwipe = horizontal && dx < -40
        const isRightSwipe = horizontal && dx > 40
        const isDownSwipe = !horizontal && dy > 60

        const width = containerRef.current?.clientWidth || 400

        const nextEl = nextCardRef.current
        const prevEl = prevCardRef.current
        const animateNeighborToTop = (neighbor: HTMLDivElement | null) => {
          if (!neighbor) return
          neighbor.style.transition =
            'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease'
          void neighbor.offsetHeight
          neighbor.style.transform =
            'translate3d(0, 0, 0) scale(1) rotate(0deg)'
          neighbor.style.opacity = '1'
        }

        if (tutorialPhase === 'strict') {
          if (strictStep === 0 && isLeftSwipe) {
            animateNeighborToTop(nextEl)
            settleTo(`translate3d(${-width}px, 0, 0) rotate(-12deg)`, () => {
              nextCard()
              setStrictStep(1)
            })
            return
          }
          if (strictStep === 1 && isRightSwipe) {
            animateNeighborToTop(prevEl)
            settleTo(`translate3d(${width}px, 0, 0) rotate(12deg)`, () => {
              prevCard()
              setStrictStep(2)
            })
            return
          }
          if (strictStep === 2 && isDownSwipe) {
            settleTo('translate3d(0, 120px, 0) rotate(0deg)', () => {
              selectAlbum(items[current])
              setTutorialPhase('hints')
              saveState('hints', hintCompletion)
            })
            return
          }
          if (nextEl || prevEl) {
            const resetNeighbor = (el: HTMLDivElement | null, rot: number) => {
              if (!el) return
              el.style.transition = 'transform 200ms ease, opacity 200ms ease'
              void el.offsetHeight
              el.style.transform = `translate3d(0, ${CARD_OFFSET}px, 0) scale(${1 - SCALE_FACTOR}) rotate(${rot}deg)`
              el.style.opacity = String(1 - 0.06)
            }
            resetNeighbor(nextEl, -0.6)
            resetNeighbor(prevEl, 0.6)
          }
          settleTo('translate3d(0, 0, 0) rotate(0deg)')
          return
        }

        let newCompletion = { ...hintCompletion }
        let phase = tutorialPhase

        if (isDownSwipe && !hintCompletion.down) {
          settleTo('translate3d(0, 120px, 0) rotate(0deg)', () => {
            selectAlbum(items[current])
          })
          newCompletion.down = true
        } else if (isLeftSwipe && !hintCompletion.left) {
          animateNeighborToTop(nextEl)
          settleTo(`translate3d(${-width}px, 0, 0) rotate(-12deg)`, () => {
            nextCard()
          })
          newCompletion.left = true
        } else if (isRightSwipe && !hintCompletion.right) {
          animateNeighborToTop(prevEl)
          settleTo(`translate3d(${width}px, 0, 0) rotate(12deg)`, () => {
            prevCard()
          })
          newCompletion.right = true
        } else {
          if (isLeftSwipe) {
            animateNeighborToTop(nextEl)
            settleTo(`translate3d(${-width}px, 0, 0) rotate(-12deg)`, nextCard)
          } else if (isRightSwipe) {
            animateNeighborToTop(prevEl)
            settleTo(`translate3d(${width}px, 0, 0) rotate(12deg)`, prevCard)
          } else if (isDownSwipe) {
            settleTo('translate3d(0, 120px, 0) rotate(0deg)', () =>
              selectAlbum(items[current]),
            )
          } else {
            settleTo('translate3d(0, 0, 0) rotate(0deg)')
          }
        }

        if (newCompletion.left && newCompletion.right && newCompletion.down)
          phase = 'done'
        setHintCompletion(newCompletion)
        setTutorialPhase(phase)
        saveState(phase, newCompletion)
      }
    },
    {
      filterTaps: true,
      threshold: 6,
      eventOptions: { passive: false },
    },
  )

  const handleCardLoaded = (pos: number) => {
    if (pos === 0) setIsLoading(false)
    setLoadedCount((c) => c + 1)
    if (pos >= visibleCount - 1 && visibleCount < MAX_VISIBLE)
      setVisibleCount((c) => Math.min(c + 1, MAX_VISIBLE))
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] md:h-[640px] flex items-center justify-center overflow-hidden"
    >
      <div
        className="pointer-events-none absolute h-full w-[min(740px,calc(100%-16px))] z-10"
        style={
          isAndroid
            ? undefined
            : {
                maskImage: NOTCH_MASK as unknown as string,
                WebkitMaskImage: NOTCH_MASK as unknown as string,
                maskSize: '100% 100%',
              }
        }
      >
        <div
          className="absolute inset-y-0 left-0 w-1/2"
          style={
            isAndroid
              ? {
                  opacity:
                    !isLoading &&
                    ((tutorialPhase === 'strict' && strictStep === 0) ||
                      (tutorialPhase === 'hints' &&
                        !hintCompletion.left &&
                        hintDirection === 'left'))
                      ? 1
                      : 0,
                  transition: 'opacity 200ms ease',
                }
              : {
                  background:
                    'linear-gradient(to right, rgba(255, 0, 0, 0.35), transparent 80%)',
                  filter: 'blur(18px)',
                  opacity:
                    !isLoading &&
                    ((tutorialPhase === 'strict' && strictStep === 0) ||
                      (tutorialPhase === 'hints' &&
                        !hintCompletion.left &&
                        hintDirection === 'left'))
                      ? 1
                      : 0,
                  transition: 'opacity 200ms ease',
                }
          }
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2"
          style={
            isAndroid
              ? {
                  opacity:
                    !isLoading &&
                    ((tutorialPhase === 'strict' && strictStep === 1) ||
                      (tutorialPhase === 'hints' &&
                        !hintCompletion.right &&
                        hintDirection === 'right'))
                      ? 1
                      : 0,
                  transition: 'opacity 200ms ease',
                }
              : {
                  background:
                    'linear-gradient(to left, rgba(0, 255, 255, 0.35), transparent 80%)',
                  filter: 'blur(18px)',
                  opacity:
                    !isLoading &&
                    ((tutorialPhase === 'strict' && strictStep === 1) ||
                      (tutorialPhase === 'hints' &&
                        !hintCompletion.right &&
                        hintDirection === 'right'))
                      ? 1
                      : 0,
                  transition: 'opacity 200ms ease',
                }
          }
        />
      </div>

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
      {/* render previous card under the top for right-swipe preview */}
      {items.length > 1 &&
        (() => {
          const prevIdx = (current - 1 + items.length) % items.length
          const card = items[prevIdx]
          const baseY = CARD_OFFSET
          const baseScale = 1 - SCALE_FACTOR
          const baseOpacity = 1 - 0.06
          return (
            <div
              key={`prev-${card.id}`}
              ref={prevCardRef}
              className="absolute w-[min(740px,calc(100%-16px))] h-full pointer-events-none"
              style={{
                transformOrigin: 'top center',
                zIndex: windowItems.length - 1,
                transform: `translate3d(0, ${baseY}px, 0) scale(${baseScale}) rotate(0.6deg)`,
                opacity: baseOpacity,
                willChange: isAndroid ? 'opacity' : 'transform, opacity',
                backfaceVisibility: isAndroid ? undefined : 'hidden',
                WebkitBackfaceVisibility: isAndroid ? undefined : 'hidden',
              }}
            >
              <ImageCard data={card} preload />
            </div>
          )
        })()}

      {windowItems
        .slice(0, Math.min(MAX_VISIBLE, windowItems.length))
        .map((it, pos) => {
          const card = items[it.idx]
          const isTopCard = pos === 0
          const baseY = pos * CARD_OFFSET
          const baseScale = 1 - pos * SCALE_FACTOR
          const baseOpacity = 1 - pos * 0.06
          return (
            <div
              key={card.id}
              ref={isTopCard ? topCardRef : pos === 1 ? nextCardRef : undefined}
              className={`absolute w-[min(740px,calc(100%-16px))] h-full ${
                isTopCard ? '' : 'pointer-events-none'
              }`}
              style={{
                transformOrigin: 'top center',
                zIndex: windowItems.length - pos,
                transform: `translate3d(0, ${baseY}px, 0) scale(${baseScale}) rotate(${pos > 0 ? (pos % 2 === 0 ? -0.6 : 0.6) : 0}deg)`,
                opacity: baseOpacity,
                willChange: isAndroid ? 'opacity' : 'transform, opacity',
                backfaceVisibility: isAndroid ? undefined : 'hidden',
                WebkitBackfaceVisibility: isAndroid ? undefined : 'hidden',
                touchAction: isTopCard ? 'none' : undefined,
              }}
              {...(isTopCard ? (bindTop() as unknown as object) : {})}
            >
              <ImageCard
                data={card}
                isTop={isTopCard}
                preload
                onLoaded={() => handleCardLoaded(pos)}
              />
            </div>
          )
        })}
    </div>
  )
}
