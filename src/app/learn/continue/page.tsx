'use client'

import Tile from '@/components/ui/Tile'
import {
  BookOpen,
  Keyboard,
  Shuffle,
  Play,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { getRecords, isSameDay, pushRecord } from '@/lib/records'

type Task = {
  id: 'vocab' | 'match' | 'spell'
  title: string
  desc: string
  href: string
  icon: React.ReactNode
  done: boolean
}

export default function ContinueLessonPage() {
  const [todayDone, setTodayDone] = useState<{
    vocab: boolean
    match: boolean
    spell: boolean
  }>({ vocab: false, match: false, spell: false })

  useEffect(() => {
    const match = getRecords<{ moves: number; seconds: number }>('match')
    const spell = getRecords<{ score: number; seconds: number }>('spell')
    const vocab = getRecords<{ count: number }>('vocab')
    const isToday = (ts: number) => isSameDay(ts, Date.now())
    setTodayDone({
      vocab: vocab.some((r) => isToday(r.ts)),
      match: match.some((r) => isToday(r.ts)),
      spell: spell.some((r) => isToday(r.ts)),
    })
  }, [])

  const tasks: Task[] = useMemo(
    () => [
      {
        id: 'vocab',
        title: 'Слова дня',
        desc: 'Повторите 10 слов',
        href: '/learn/vocab?src=continue',
        icon: <BookOpen className="w-6 h-6" />,
        done: todayDone.vocab,
      },
      {
        id: 'match',
        title: 'Парные карточки',
        desc: 'Сопоставьте пары',
        href: '/learn/match?d=medium',
        icon: <Shuffle className="w-6 h-6" />,
        done: todayDone.match,
      },
      {
        id: 'spell',
        title: 'Напиши перевод',
        desc: 'Введите переводы',
        href: '/learn/spell?d=medium',
        icon: <Keyboard className="w-6 h-6" />,
        done: todayDone.spell,
      },
    ],
    [todayDone],
  )

  const completed = tasks.filter((t) => t.done).length
  const progress = Math.round((completed / tasks.length) * 100)
  const circumference = 2 * Math.PI * 28
  const dash = `${(progress / 100) * circumference} ${circumference}`

  const nextHref = tasks.find((t) => !t.done)?.href || tasks[0].href

  const tips = useMemo(
    () => [
      'Короткие сессии каждый день эффективнее длинных редких.',
      'Повторяйте новые слова через 10–20 минут после изучения.',
      'Произносите вслух — так лучше закрепляется произношение и память.',
      'Связывайте слова с образами и ситуациями из жизни.',
      'Учите 10–15 слов, но возвращайтесь к ним в течение дня.',
      'Перемешивайте старые и новые слова для долговременной памяти.',
      'Не бойтесь ошибок — это сигнал мозгу, что идёт обучение.',
      'Меняйте режимы: карточки, набор перевода, словарь.',
      'Используйте избранное, чтобы собрать мини‑набор для дня.',
      'Делайте паузы 2–3 минуты между мини‑играми.',
      'Сразу применяйте слово в короткой фразе.',
      'Возвращайтесь к словам у краёв экрана — мозг лучше запоминает крайние позиции.',
      'Учите в одно и то же время — формируйте привычку.',
      'Слушайте озвучку и повторяйте — аудиоканал усиливает запоминание.',
      'Ставьте реалистичную цель: 3 мини‑задачи в день.',
    ],
    [],
  )
  const [dayTip, setDayTip] = useState<string>('')
  useEffect(() => {
    setDayTip(tips[Math.floor(Math.random() * tips.length)])
  }, [tips])

  return (
    <main className="min-h-screen pb-24 pt-4 px-4">
      <div className="grid grid-cols-2 gap-2">
        <Tile size="rect" variant="brand" className="!p-6 h-[140px] col-span-2">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="min-w-0">
              <h1 className="text-[20px] font-extrabold leading-tight truncate">
                Ежедневный план
              </h1>
              <p className="text-ink/70 text-sm mt-1 truncate">
                Выполнено: {completed}/{tasks.length}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={nextHref}
                  className="inline-flex text-white items-center gap-2 h-11 px-5 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/10"
                >
                  <Play className="w-5 h-5" />
                  <span>Продолжить</span>
                </Link>
              </div>
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

        {tasks.map((t) => (
          <Tile
            key={t.id}
            size="rect"
            variant="glass"
            right={
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                {t.done ? (
                  <CheckCircle2 className="w-6 h-6 text-brandGreen" />
                ) : (
                  t.icon
                )}
              </div>
            }
            href={t.href}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white truncate">{t.title}</p>
                <p className="text-sm text-white/70 truncate">{t.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60" />
            </div>
          </Tile>
        ))}

        <Tile size="rect" variant="glass" className="col-span-2">
          <div className="flex items-center justify-between w-full">
            <p className="text-white">Совет дня: {dayTip}</p>
          </div>
        </Tile>
      </div>
    </main>
  )
}
