'use client'

import { useEffect, useMemo, useState } from 'react'
import Tile from '@/components/ui/Tile'
import BackToLearn from '@/components/ui/BackToLearn'
import { Info } from 'lucide-react'
import GameRulesSheet from '@/components/ui/GameRulesSheet'
import { buildWordPairs } from '@/lib/words'
import {
  pushRecord,
  getRecords,
  isSameDay,
  withinLastDays,
} from '@/lib/records'

type Card = {
  id: string
  kind: 'ru' | 'tt'
  text: string
  pairKey: string
}

export default function MatchGamePage() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'medium',
  )
  const pairs = useMemo(
    () =>
      buildWordPairs(
        difficulty === 'easy' ? 6 : difficulty === 'hard' ? 12 : 8,
      ),
    [difficulty],
  )
  const [cards, setCards] = useState<Card[]>([])
  const [opened, setOpened] = useState<string[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const [startTs] = useState<number>(() => Date.now())
  const [, forceTick] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [pulse, setPulse] = useState<string | null>(null)
  const [todayBest, setTodayBest] = useState<number | null>(null)
  const [weekBest, setWeekBest] = useState<number | null>(null)
  const [rulesOpen, setRulesOpen] = useState(false)

  useEffect(() => {
    const base: Card[] = []
    pairs.forEach((p, idx) => {
      const key = `${idx}:${p.ru}`
      base.push({ id: key + ':ru', kind: 'ru', text: p.ru, pairKey: key })
      base.push({ id: key + ':tt', kind: 'tt', text: p.tt, pairKey: key })
    })
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[base[i], base[j]] = [base[j], base[i]]
    }
    setCards(base)
  }, [pairs])

  useEffect(() => {
    if (matched.size && matched.size * 2 === cards.length) setFinished(true)
  }, [matched, cards.length])

  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const d = params.get('d') as 'easy' | 'medium' | 'hard' | null
      if (d && d !== difficulty) setDifficulty(d)
    } catch {}
  }, [difficulty])

  useEffect(() => {
    const rec = getRecords<{ moves: number; seconds: number; diff?: string }>(
      'match',
    )
    const today = rec.filter((r) => isSameDay(r.ts, Date.now()))
    const week = rec.filter((r) => withinLastDays(r.ts, 7))
    setTodayBest(
      today.length ? Math.min(...today.map((r) => r.data.moves)) : null,
    )
    setWeekBest(week.length ? Math.min(...week.map((r) => r.data.moves)) : null)
  }, [finished])

  useEffect(() => {
    if (!finished) return
    const seconds = Math.max(0, Math.round((Date.now() - startTs) / 1000))
    pushRecord('match', { moves, seconds, diff: difficulty })
  }, [finished, moves, startTs, difficulty])

  useEffect(() => {
    try {
      const k = 'game-rules-shown'
      if (!window.localStorage.getItem(k)) {
        setShowHint(true)
        window.localStorage.setItem(k, '1')
      }
    } catch {}
  }, [])

  const onCard = (id: string) => {
    if (finished) return
    if (opened.includes(id)) return
    const card = cards.find((c) => c.id === id)
    if (!card) return
    if (matched.has(card.pairKey)) return
    const next = [...opened, id]
    setOpened(next)
    if (next.length === 2) {
      setMoves((m) => m + 1)
      const [aId, bId] = next
      const a = cards.find((c) => c.id === aId)!
      const b = cards.find((c) => c.id === bId)!
      const isPair = a.pairKey === b.pairKey && a.kind !== b.kind
      if (isPair) {
        setMatched((s) => new Set(s).add(a.pairKey))
        setOpened([])
        setPulse(a.pairKey)
        try {
          navigator.vibrate?.(40)
        } catch {}
        setTimeout(() => setPulse(null), 500)
      } else {
        try {
          navigator.vibrate?.([20, 40, 20])
        } catch {}
        setTimeout(() => setOpened([]), 600)
      }
    }
  }

  const elapsedSec = Math.max(0, Math.round((Date.now() - startTs) / 1000))

  return (
    <main className="min-h-screen pb-24 pt-4 px-4">
      <style>{`header, nav { display:none !important }`}</style>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackToLearn />
          <button
            onClick={() => setRulesOpen(true)}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 ring-1 ring-white/10 text-white"
            aria-label="Правила"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        <div className="text-white/80 text-sm">
          Ходы: {moves} • {elapsedSec} с
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="inline-flex rounded-full bg-white/10 p-1">
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`h-9 px-4 rounded-full text-sm transition-colors ${difficulty === d ? 'bg-white/20 text-white' : 'text-white/70'}`}
            >
              {d === 'easy' ? 'Лёгко' : d === 'hard' ? 'Сложно' : 'Норм'}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((c) => {
          const isOpen = opened.includes(c.id) || matched.has(c.pairKey)
          const variant = matched.has(c.pairKey)
            ? 'brand'
            : isOpen
              ? 'brand'
              : 'glass'
          const glow = pulse === c.pairKey && matched.has(c.pairKey)
          return (
            <button
              key={c.id}
              onClick={() => onCard(c.id)}
              className="text-left"
            >
              <Tile
                size="rect"
                variant={variant as any}
                className={
                  glow ? 'shadow-[0_0_0_3px_rgba(188,251,108,0.7)_inset]' : ''
                }
              >
                <div
                  className={
                    isOpen
                      ? 'scale-100 opacity-100 transition-all duration-200'
                      : 'scale-95 opacity-80 transition-all duration-200'
                  }
                >
                  <p
                    className={
                      variant === 'brand'
                        ? 'text-ink font-extrabold text-lg text-center'
                        : 'text-white font-semibold text-lg text-center'
                    }
                  >
                    {isOpen ? c.text : 'Нажми'}
                  </p>
                </div>
              </Tile>
            </button>
          )
        })}
      </div>
      {finished && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-[28px] p-6 bg-[linear-gradient(180deg,rgba(26,27,32,0.86),rgba(26,27,32,0.96))] ring-1 ring-white/10 text-center mx-6 w-full max-w-sm">
            <h2 className="text-white text-2xl font-extrabold">Отлично!</h2>
            <p className="text-white/80 mt-2 text-sm">
              Ходы: {moves} • Время: {elapsedSec} с
            </p>
            <p className="text-white/60 mt-2 text-xs">
              Лучшее сегодня: {todayBest ?? '—'} • За неделю: {weekBest ?? '—'}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => location.reload()}
                className="h-12 rounded-2xl bg-ink text-brandGreen font-bold"
              >
                Ещё раз
              </button>
              <a
                href="/learn"
                className="h-12 rounded-2xl bg-white/10 text-white font-semibold flex items-center justify-center ring-1 ring-white/10"
              >
                К разделу
              </a>
            </div>
          </div>
        </div>
      )}

      <GameRulesSheet
        open={rulesOpen || showHint}
        onClose={() => {
          setRulesOpen(false)
          setShowHint(false)
        }}
        title="Как играть"
        items={[
          'Найдите пары: слово на татарском и его перевод на русском.',
          'Открывайте по две карточки, если совпали — остаются.',
          'Выбирайте сложность выше — больше пар.',
        ]}
      />
    </main>
  )
}
