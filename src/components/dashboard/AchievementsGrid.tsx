'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Zap, Target, CalendarCheck, Medal } from 'lucide-react'
import { computeAchievements } from '@/lib/records'

export default function AchievementsGrid() {
  const base = useMemo(
    () => [
      {
        id: 'first-vocab',
        title: 'Первые слова',
        desc: 'Отметьте 10 слов',
        icon: 'book' as const,
      },
      {
        id: 'fast-match',
        title: 'Спринтер',
        desc: 'Соберите пары за 30с',
        icon: 'zap' as const,
      },
      {
        id: 'spell-10',
        title: 'Меткий набор',
        desc: '10 правильных ответов',
        icon: 'target' as const,
      },
      {
        id: 'week-7',
        title: 'Неделя в строю',
        desc: 'Занимайтесь 7 дней',
        icon: 'calendar' as const,
      },
      {
        id: 'streak-3',
        title: 'Серия 3',
        desc: 'Серия 3 дня',
        icon: 'medal' as const,
      },
    ],
    [],
  )
  const [achieved, setAchieved] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<{
    title: string
    icon: (typeof base)[number]['icon']
  } | null>(null)
  useEffect(() => {
    try {
      const { medals } = computeAchievements()
      const ok = medals.filter((m) => m.achieved).map((m) => m.id)
      setAchieved(new Set(ok))
      const seenRaw = window.localStorage.getItem('achievements_seen')
      const seen = seenRaw ? (JSON.parse(seenRaw) as string[]) : []
      const firstNew = medals.find((m) => m.achieved && !seen.includes(m.id))
      if (firstNew) {
        const meta = base.find((b) => b.id === firstNew.id)
        if (meta) {
          setTimeout(() => {
            setToast({ title: firstNew.title, icon: meta.icon })
            setTimeout(() => setToast(null), 3000)
          }, 700)
        }
        const merged = Array.from(new Set([...seen, ...ok]))
        window.localStorage.setItem('achievements_seen', JSON.stringify(merged))
      }
    } catch {}
  }, [base])

  return (
    <div className="col-span-2">
      <h2 className="text-white text-xl font-bold mb-3 px-1">Достижения</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {base.map((m) => {
          const ok = achieved.has(m.id)
          return (
            <div
              key={m.id}
              className={
                ok
                  ? 'aspect-square rounded-[28px] bg-[linear-gradient(135deg,#BCFB6C,#A9E85E)] text-ink p-3'
                  : 'aspect-square rounded-[28px] bg-white/6 ring-1 ring-white/10 text-white/70 p-3'
              }
            >
              <div className="h-full w-full flex flex-col items-center justify-center text-center gap-2">
                <div
                  className={
                    ok
                      ? 'w-14 h-14 rounded-2xl bg-ink/5 flex items-center justify-center'
                      : 'w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center'
                  }
                >
                  {m.icon === 'book' && <BookOpen className="w-8 h-8" />}
                  {m.icon === 'zap' && <Zap className="w-8 h-8" />}
                  {m.icon === 'target' && <Target className="w-8 h-8" />}
                  {m.icon === 'calendar' && (
                    <CalendarCheck className="w-8 h-8" />
                  )}
                  {m.icon === 'medal' && <Medal className="w-8 h-8" />}
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-sm md:text-base font-extrabold truncate">
                    {m.title}
                  </p>
                  <p className="text-xs md:text-sm mt-0.5 truncate">{m.desc}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 top-4 z-50 w-[92%] max-w-md">
          <div className="rounded-3xl px-4 py-3 bg-[linear-gradient(180deg,rgba(26,27,32,0.9),rgba(26,27,32,0.96))] ring-1 ring-white/10 text-white shadow-[0_12px_32px_rgba(0,0,0,0.45)] [backdrop-filter:saturate(160%)_blur(10px)] flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10">
              {toast.icon === 'book' && <BookOpen className="w-6 h-6" />}
              {toast.icon === 'zap' && <Zap className="w-6 h-6" />}
              {toast.icon === 'target' && <Target className="w-6 h-6" />}
              {toast.icon === 'calendar' && (
                <CalendarCheck className="w-6 h-6" />
              )}
              {toast.icon === 'medal' && <Medal className="w-6 h-6" />}
            </span>
            <div className="min-w-0">
              <p className="text-xs text-white/70 leading-none">
                Новое достижение
              </p>
              <p className="text-sm font-bold leading-tight truncate">
                {toast.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
