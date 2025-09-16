'use client'

import Tile from '@/components/ui/Tile'
import {
  Play,
  BookOpen,
  Shuffle,
  Keyboard,
  Trophy,
  Zap,
  Target,
  CalendarCheck,
  Medal,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getRecords, isSameDay, computeAchievements } from '@/lib/records'

export default function LearnPage() {
  const [progress, setProgress] = useState(0)
  const [streak, setStreak] = useState(0)
  const [todayCount, setTodayCount] = useState(0)

  const quick = [
    {
      title: 'Словарь',
      icon: <BookOpen className="w-6 h-6" />,
      href: '/learn/vocab',
      variant: 'brand' as const,
    },
    {
      title: 'Парные карточки',
      icon: <Shuffle className="w-6 h-6" />,
      href: '/learn/match',
      variant: 'glass' as const,
    },
    {
      title: 'Напиши перевод',
      icon: <Keyboard className="w-6 h-6" />,
      href: '/learn/spell',
      variant: 'glass' as const,
    },
    {
      title: 'Продолжить урок',
      icon: <Play className="w-6 h-6" />,
      href: '/learn/continue',
      variant: 'glass' as const,
    },
  ]
  useEffect(() => {
    try {
      const match = getRecords<{ moves: number; seconds: number }>('match')
      const spell = getRecords<{ score: number; seconds: number }>('spell')
      const all = [...match, ...spell]
      const today = all.filter((r) => isSameDay(r.ts, Date.now()))
      const target = 3
      const pct = Math.min(100, Math.round((today.length / target) * 100))
      setTodayCount(today.length)
      const uniqueDays = new Set(
        all.map((r) => {
          const d = new Date(r.ts)
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        }),
      )
      let s = 0
      const dayMs = 24 * 60 * 60 * 1000
      for (let i = 0; i < 30; i++) {
        const d = new Date(Date.now() - i * dayMs)
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        if (uniqueDays.has(key)) s++
        else break
      }
      setStreak(s)
      setProgress(pct)
    } catch {
      setStreak(0)
      setProgress(0)
    }
  }, [])
  const circumference = 2 * Math.PI * 28
  const dash = `${(progress / 100) * circumference} ${circumference}`

  const { medals } = useMemo(() => computeAchievements(), [])
  const [toastQueue, setToastQueue] = useState<typeof medals>([])
  const [activeToast, setActiveToast] = useState<
    (typeof medals)[number] | null
  >(null)

  useEffect(() => {
    try {
      const seenRaw = window.localStorage.getItem('achievements_seen')
      const seen = seenRaw ? (JSON.parse(seenRaw) as string[]) : []
      const newly = medals.filter((m) => m.achieved && !seen.includes(m.id))
      if (newly.length) {
        setToastQueue(newly)
        const merged = Array.from(new Set([...seen, ...newly.map((n) => n.id)]))
        window.localStorage.setItem('achievements_seen', JSON.stringify(merged))
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activeToast || toastQueue.length === 0) return
    const next = toastQueue[0]
    setActiveToast(next)
    const t = setTimeout(() => {
      setActiveToast(null)
      setToastQueue((q) => q.slice(1))
    }, 2500)
    return () => clearTimeout(t)
  }, [activeToast, toastQueue])

  return (
    <main
      className="min-h-screen pb-24 pt-4 px-4"
      style={{
        paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'calc(16px + env(safe-area-inset-left, 0px))',
        paddingRight: 'calc(16px + env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="grid grid-cols-2 gap-2">
        {/* Hero banner simplified */}
        <Tile
          size="rect"
          variant="brand"
          className="!p-6 h-[120px] col-span-2"
          href="/learn/continue"
        >
          <div className="flex w-full items-center justify-between gap-4 flex-nowrap">
            <div className="min-w-0">
              <h1 className="text-[28px] font-extrabold leading-tight truncate">
                Учимся сегодня
              </h1>
              <p className="text-ink/70 text-sm mt-1 truncate">
                Серия {streak}{' '}
                {streak % 10 === 1 && streak % 100 !== 11
                  ? 'день'
                  : streak % 10 >= 2 &&
                      streak % 10 <= 4 &&
                      (streak % 100 < 10 || streak % 100 >= 20)
                    ? 'дня'
                    : 'дней'}{' '}
                • Сегодня {todayCount}/3
              </p>
            </div>
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="text-ink/20"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="text-ink"
                  strokeWidth="8"
                  strokeDasharray={dash}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-ink font-bold">{progress}%</span>
              </div>
            </div>
          </div>
        </Tile>

        {quick.map((q) => (
          <Tile
            key={q.title}
            size="rect"
            variant={q.variant}
            right={
              <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center">
                {q.icon}
              </div>
            }
            href={q.href}
          >
            <p
              className={
                q.variant === 'brand'
                  ? 'font-extrabold text-ink'
                  : 'font-semibold text-white'
              }
            >
              {q.title}
            </p>
          </Tile>
        ))}

        {/* достижения перенесены на главную */}
      </div>
    </main>
  )
}
