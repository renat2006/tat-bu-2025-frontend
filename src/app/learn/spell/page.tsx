'use client'

import { useEffect, useMemo, useState } from 'react'
import Tile from '@/components/ui/Tile'
import BackToLearn from '@/components/ui/BackToLearn'
import { Info } from 'lucide-react'
import GameRulesSheet from '@/components/ui/GameRulesSheet'
import { buildWordPairs } from '@/lib/words'
import {
  getRecords,
  isSameDay,
  withinLastDays,
  pushRecord,
} from '@/lib/records'

type Round = { ru: string; tt: string }

export default function SpellGamePage() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'medium',
  )
  const pool = useMemo(
    () =>
      buildWordPairs(
        difficulty === 'easy' ? 12 : difficulty === 'hard' ? 24 : 16,
      ),
    [difficulty],
  )
  const [rounds, setRounds] = useState<Round[]>([])
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [startTs] = useState<number>(() => Date.now())
  const [, forceTick] = useState(0)
  const [shake, setShake] = useState(false)
  const [todayBest, setTodayBest] = useState<number | null>(null)
  const [weekBest, setWeekBest] = useState<number | null>(null)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [showAnswerPreview, setShowAnswerPreview] = useState(false)
  const [flash, setFlash] = useState<null | 'ok' | 'bad'>(null)

  useEffect(() => {
    const shuffled = [...pool]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setRounds(shuffled.slice(0, 10))
  }, [pool])

  const current = rounds[idx]
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
    try {
      const k = 'game-rules-shown'
      if (!window.localStorage.getItem(k)) {
        setShowHint(true)
        window.localStorage.setItem(k, '1')
      }
    } catch {}
  }, [])

  useEffect(() => {
    const rec = getRecords<{ score: number; seconds: number; diff?: string }>(
      'spell',
    )
    const today = rec.filter((r) => isSameDay(r.ts, Date.now()))
    const week = rec.filter((r) => withinLastDays(r.ts, 7))
    setTodayBest(
      today.length ? Math.max(...today.map((r) => r.data.score)) : null,
    )
    setWeekBest(week.length ? Math.max(...week.map((r) => r.data.score)) : null)
  }, [finished])

  useEffect(() => {
    if (!finished) return
    const seconds = Math.max(0, Math.round((Date.now() - startTs) / 1000))
    pushRecord('spell', { score, seconds, diff: difficulty })
  }, [finished, score, startTs, difficulty])

  const submit = () => {
    if (!current) return
    const ok = input.trim().toLowerCase() === current.ru.trim().toLowerCase()
    if (ok) setScore((s) => s + 1)
    try {
      navigator.vibrate?.(ok ? 40 : [20, 40, 20])
    } catch {}
    if (!ok) {
      setShake(true)
      setTimeout(() => setShake(false), 300)
    }
    setFlash(ok ? 'ok' : 'bad')
    setTimeout(() => setFlash(null), 350)
    const next = idx + 1
    if (next >= rounds.length) setFinished(true)
    else setIdx(next)
    setInput('')
    setShowAnswerPreview(false)
  }

  return (
    <main className="min-h-screen pb-24 pt-4 px-4">
      <style>{`header, nav { display:none !important }`}</style>
      <div className="mb-3 flex items-center justify-between">
        <BackToLearn />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRulesOpen(true)}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 ring-1 ring-white/10 text-white"
            aria-label="Правила"
          >
            <Info className="w-5 h-5" />
          </button>
          <div className="text-white/80 text-sm">
            Счёт: {score}/{rounds.length || 10} •{' '}
            {Math.max(0, Math.round((Date.now() - startTs) / 1000))} с
          </div>
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
      {current ? (
        <div className="grid grid-cols-2 gap-2">
          <Tile
            size="rect"
            variant="brand"
            className={`col-span-2 ${flash === 'ok' ? 'ring-2 ring-[rgba(188,251,108,0.8)]' : ''}`}
          >
            <p
              className={`text-ink font-extrabold text-2xl text-center ${flash === 'bad' ? 'text-red-500' : ''}`}
            >
              {current.tt}
            </p>
          </Tile>
          <div className="col-span-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Введите перевод на русском"
              className={
                'w-full h-14 rounded-2xl px-4 bg-white/10 text-white ring-1 ring-white/10 outline-none ' +
                (shake ? 'animate-[shake_0.3s_linear]' : '')
              }
              autoFocus
            />
            {showAnswerPreview && (
              <div className="mt-2 rounded-2xl bg-white/8 p-3 ring-1 ring-white/10 text-white">
                <p className="text-xs text-white/70">Показать ответ</p>
                <p className="text-sm font-semibold mt-1">{current.ru}</p>
              </div>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={submit}
                className="h-12 rounded-2xl bg-ink text-brandGreen font-bold"
              >
                Проверить
              </button>
              <button
                onClick={() => {
                  if (!showAnswerPreview) setShowAnswerPreview(true)
                  else setInput(current.ru)
                }}
                className="h-12 rounded-2xl bg-white/10 text-white font-semibold ring-1 ring-white/10"
              >
                {showAnswerPreview ? 'Вставить ответ' : 'Показать ответ'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white/70">Загрузка…</p>
      )}

      {finished && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-[28px] p-6 bg-[linear-gradient(180deg,rgba(26,27,32,0.86),rgba(26,27,32,0.96))] ring-1 ring-white/10 text-center mx-6 w-full max-w-sm">
            <h2 className="text-white text-2xl font-extrabold">Итоги</h2>
            <p className="text-white/80 mt-2 text-sm">
              Счёт: {score}/{rounds.length}
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
          'Смотри слово на татарском, вводи перевод на русском.',
          'Кнопка «Показать ответ» показывает перевод, повторное нажатие — вставляет.',
          'Верный ответ подсвечивается, при ошибке будет лёгкая вибрация.',
          'Сложность влияет на количество раундов.',
        ]}
      />

      {rulesOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="mx-6 w-full max-w-md rounded-3xl p-5 bg-[rgba(26,27,32,0.95)] ring-1 ring-white/10 text-white">
            <h3 className="text-xl font-extrabold">Правила</h3>
            <ul className="text-sm text-white/85 mt-2 space-y-2 list-disc pl-5">
              <li>Смотри слово на татарском, вводи перевод на русском.</li>
              <li>
                Подсказка сначала показывает ответ, второе нажатие вставляет
                его.
              </li>
              <li>
                Верный ответ подсвечивается, ошибка сопровождается лёгкой
                вибрацией.
              </li>
              <li>Выбирай сложность: Лёгко, Норм, Сложно.</li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setRulesOpen(false)}
                className="h-11 px-4 rounded-2xl bg-ink text-brandGreen font-bold"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
