import Tile from '@/components/ui/Tile'
import { BookOpen, Brain, Languages, Play, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ContinueLessonPage() {
  const progress = 62
  const circumference = 2 * Math.PI * 28
  const dash = `${(progress / 100) * circumference} ${circumference}`

  const steps = [
    {
      title: 'Слова дня',
      desc: '10 новых слов',
      href: '/learn/vocab',
      icon: <Languages className="w-6 h-6" />,
    },
    {
      title: 'Грамматика',
      desc: 'Упражнения на падежи',
      href: '/learn/grammar',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: 'Практика',
      desc: 'Короткий диалог',
      href: '/learn/practice',
      icon: <Brain className="w-6 h-6" />,
    },
  ]

  return (
    <main className="min-h-screen pb-24 pt-4 px-4">
      <div className="grid grid-cols-2 gap-2">
        <Tile size="rect" variant="brand" className="!p-6 h-[140px] col-span-2">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="min-w-0">
              <h1 className="text-[20px] font-medium leading-tight truncate">
                Продолжить урок
              </h1>
              <p className="text-ink/70 text-sm mt-1 truncate">
                Прогресс {progress}% · Осталось ~8 мин
              </p>
              <div className="mt-4">
                <Link
                  href="/learn/practice"
                  className="inline-flex text-white items-center gap-2 h-11 px-5 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/10"
                >
                  <Play className="w-5 h-5" />
                  <span>Начать</span>
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

        {steps.map((s) => (
          <Tile
            key={s.title}
            size="rect"
            variant="glass"
            right={
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                {s.icon}
              </div>
            }
            href={s.href}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white truncate">{s.title}</p>
                <p className="text-sm text-white/70 truncate">{s.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60" />
            </div>
          </Tile>
        ))}

        <Tile size="rect" variant="glass" className="col-span-2">
          <div className="flex items-center justify-between w-full">
            <p className="text-white">
              Совет дня: короткие сессии каждый день эффективнее длинных редких
              занятий.
            </p>
          </div>
        </Tile>
      </div>
    </main>
  )
}
