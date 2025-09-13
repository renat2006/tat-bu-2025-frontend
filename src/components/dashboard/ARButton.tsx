'use client'

import { ChevronsRight, Plus } from 'lucide-react'
import { useState, useRef, useEffect, useMemo } from 'react'

export function ARButton() {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isActivated, setIsActivated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const KNOB = 68
  const PADDING = 12

  const getMaxOffset = () => {
    const w = containerRef.current?.clientWidth ?? 0
    return Math.max(0, w - KNOB - PADDING)
  }

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const max = getMaxOffset()
    const x = e.clientX - rect.left - KNOB / 2
    setDragOffset(Math.max(0, Math.min(x, max)))
  }
  const onMouseUp = () => {
    if (!isDragging) return
    finishDrag()
  }

  // Touch handlers
  const onTouchStart = () => setIsDragging(true)
  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const max = getMaxOffset()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left - KNOB / 2
    setDragOffset(Math.max(0, Math.min(x, max)))
  }
  const onTouchEnd = () => {
    if (!isDragging) return
    finishDrag()
  }

  const finishDrag = () => {
    setIsDragging(false)
    const max = getMaxOffset()
    const threshold = max * 0.75
    if (dragOffset >= threshold) {
      setIsActivated(true)
      setDragOffset(max)
      // TODO: trigger AR action here
      setTimeout(() => {
        setIsActivated(false)
        setDragOffset(0)
      }, 1200)
    } else {
      setDragOffset(0)
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragOffset])

  const knobLeft = useMemo(() => dragOffset + PADDING / 2, [dragOffset])
  const textOpacity = useMemo(() => {
    const max = getMaxOffset() || 1
    const ratio = dragOffset / max
    return Math.max(0, 1 - Math.max(0, ratio - 0.25) / 0.5) // fade after 25%
  }, [dragOffset])

  return (
    <div className="col-span-2 md:col-span-4">
      <div
        ref={containerRef}
        className="relative w-full h-[80px] rounded-full overflow-hidden touch-none select-none"
        style={{
          background: 'linear-gradient(90deg, #BCFB6C 0%, #A9E85E 100%)',
        }}
        onTouchStart={onTouchStart}
      >
        {/* centered text with paddings so the knob/chevrons have their own zones */}
        <div
          className="absolute inset-0 flex items-center justify-center px-[96px] pointer-events-none"
          style={{ opacity: textOpacity }}
        >
          <span className="text-ink font-semibold text-xl">
            Сканировать окружение
          </span>
        </div>

        {/* right chevrons (hint) */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronsRight className="w-8 h-8 text-ink/50" />
        </div>

        {/* draggable knob */}
        <div
          onMouseDown={onMouseDown}
          className="absolute top-1/2 -translate-y-1/2 w-[68px] h-[68px] bg-ink rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
          style={{
            left: knobLeft,
            transition: isDragging ? ('none' as const) : 'left 200ms ease',
          }}
        >
          <Plus className="w-8 h-8 text-brandGreen" />
        </div>

        {/* success overlay */}
        {isActivated && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-ink font-semibold text-xl">Начинаем!</span>
          </div>
        )}
      </div>
    </div>
  )
}
