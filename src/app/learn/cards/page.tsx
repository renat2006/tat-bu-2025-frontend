'use client'

import { useEffect, useMemo, useState } from 'react'
import BackToLearn from '@/components/ui/BackToLearn'
import { Volume2, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react'

type Card = { ru: string; tt: string }

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [idx, setIdx] = useState(0)
  const [showTT, setShowTT] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [dragOffsetX, setDragOffsetX] = useState(0)

  useEffect(() => {
    try {
      const rawAll = localStorage.getItem('explore-selected-all')
      const rawMap = localStorage.getItem('explore-ru-tt')
      const list = rawAll ? (JSON.parse(rawAll) as string[]) : []
      const map = rawMap ? (JSON.parse(rawMap) as Record<string, string>) : {}
      const c = list.slice(0, 100).map((ru) => ({ ru, tt: map[ru] || ru }))
      setCards(c)
    } catch {}
  }, [])

  const card = cards[idx]

  const speak = async (text: string) => {
    if (!text || isSpeaking) return
    try {
      setIsSpeaking(true)
      const r = await fetch('https://vibe-tel.ddns.net/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const j = (await r.json()) as { audio_base64?: string }
      const a = new Audio(`data:audio/mp3;base64,${j.audio_base64}`)
      a.addEventListener('ended', () => setIsSpeaking(false))
      a.addEventListener('error', () => setIsSpeaking(false))
      await a.play()
    } catch {
      setIsSpeaking(false)
    }
  }

  const next = () => {
    setShowTT(false)
    setIdx((i) => (i + 1) % Math.max(1, cards.length))
  }
  const prev = () => {
    setShowTT(false)
    setIdx(
      (i) => (i - 1 + Math.max(1, cards.length)) % Math.max(1, cards.length),
    )
  }
  const shuffleAll = () => {
    setShowTT(false)
    setCards((arr) => [...arr].sort(() => Math.random() - 0.5))
    setIdx(0)
  }

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as any).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as any).clientY
    setDragStart({ x: clientX, y: clientY })
    setDragOffsetX(0)
  }
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragStart) return
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as any).clientX
    const offsetX = clientX - dragStart.x
    setDragOffsetX(offsetX)
  }
  const handleTouchEnd = () => {
    if (!dragStart) return
    const threshold = 40
    if (dragOffsetX > threshold) prev()
    else if (dragOffsetX < -threshold) next()
    setDragStart(null)
    setDragOffsetX(0)
  }

  return (
    <main className="min-h-screen pb-24 pt-4 px-4">
      <style>{`header, nav { display:none !important }`}</style>
      <div className="mb-3 flex items-center justify-between gap-2">
        <BackToLearn />
        <div className="inline-flex items-center gap-2">
          <button
            onClick={shuffleAll}
            className="h-9 px-3 rounded-full bg-white/10 text-white text-xs ring-1 ring-white/12 hover:bg-white/15"
          >
            Перемешать
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[420px] px-2">
        <div className="rounded-[28px] bg-white/5 ring-1 ring-white/10 p-4 text-white select-none shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
          {/* progress */}
          <div className="relative h-1 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-brand-green"
              style={{
                width: `${cards.length ? ((idx + 1) / cards.length) * 100 : 0}%`,
              }}
            />
          </div>

          {/* card */}
          <div
            className="relative mt-4 h-[280px] md:h-[300px] perspective-[1200px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
          >
            <div
              className={`absolute inset-0 rounded-[24px] bg-[linear-gradient(180deg,rgba(26,27,32,0.9),rgba(26,27,32,0.96))] ring-1 ring-white/10 [backface-visibility:hidden] grid place-items-center px-6 text-center transition-transform duration-400 ease-out`}
              style={{
                transform: `rotateY(${showTT ? 180 : 0}deg) translateX(${dragOffsetX * 0.1}px)`,
              }}
              onClick={() => setShowTT((v) => !v)}
            >
              <div>
                <p className="text-[28px] font-extrabold leading-snug break-words">
                  {card?.ru || '—'}
                </p>
                <p className="text-white/60 text-xs mt-2">
                  Нажмите, чтобы перевернуть
                </p>
              </div>
            </div>
            <div
              className={`absolute inset-0 rounded-[24px] bg-[linear-gradient(180deg,rgba(10,11,14,0.9),rgba(10,11,14,0.96))] ring-1 ring-white/10 [backface-visibility:hidden] grid place-items-center px-6 text-center transition-transform duration-400 ease-out`}
              style={{
                transform: `rotateY(${showTT ? 0 : -180}deg) translateX(${dragOffsetX * 0.1}px)`,
              }}
              onClick={() => setShowTT((v) => !v)}
            >
              <div>
                <p className="text-[28px] font-extrabold leading-snug break-words">
                  {card?.tt || '—'}
                </p>
                <p className="text-white/60 text-xs mt-2">
                  Татарский • Нажмите, чтобы перевернуть
                </p>
              </div>
            </div>

            {/* nav arrows */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={prev}
                className="ml-1 h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/10 grid place-items-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={next}
                className="mr-1 h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/10 grid place-items-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* controls */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              onClick={shuffleAll}
              className="h-10 px-3 rounded-full bg-white/10 ring-1 ring-white/10 text-sm inline-flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Перемешать
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => speak((showTT ? card?.tt : card?.ru) || '')}
                className="h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/10 flex items-center justify-center disabled:opacity-60"
                disabled={!card || isSpeaking}
                aria-label="Озвучить"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowTT((v) => !v)}
                className="h-10 px-4 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/20"
              >
                {showTT ? 'RU' : 'TT'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
