import Tile from '@/components/ui/Tile'
import {
  BookOpen,
  Brain,
  Languages,
  Target,
  Play,
  Repeat2,
  TimerReset,
} from 'lucide-react'

export default function LearnPage() {
  const categories = [
    {
      title: 'Словарь',
      icon: <Languages className="w-7 h-7" />,
      desc: 'Новые слова и повторение',
      href: '/learn/vocab',
      variant: 'brand' as const,
    },
    {
      title: 'Грамматика',
      icon: <BookOpen className="w-7 h-7" />,
      desc: 'Правила и задания',
      href: '/learn/grammar',
      variant: 'glass' as const,
    },
    {
      title: 'Практика',
      icon: <Brain className="w-7 h-7" />,
      desc: 'Диалоги и аудио',
      href: '/learn/practice',
      variant: 'brand' as const,
    },
    {
      title: 'Цели',
      icon: <Target className="w-7 h-7" />,
      desc: 'Ежедневные челленджи',
      href: '/learn/goals',
      variant: 'glass' as const,
    },
  ]

  const quick = [
    {
      title: 'Быстрое повторение',
      icon: <Repeat2 className="w-6 h-6" />,
      href: '/learn/review',
      variant: 'glass' as const,
    },
    {
      title: '10 минут фокуса',
      icon: <TimerReset className="w-6 h-6" />,
      href: '/learn/focus10',
      variant: 'glass' as const,
    },
    {
      title: 'Продолжить урок',
      icon: <Play className="w-6 h-6" />,
      href: '/learn/continue',
      variant: 'brand' as const,
    },
  ]

  const progress = 62
  const circumference = 2 * Math.PI * 28
  const dash = `${(progress / 100) * circumference} ${circumference}`

  return (
    <main className="min-h-screen pb-24 pt-4 px-4">
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
                Серия 4 дня • Прогресс {progress}%
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

        {categories.map((c) => (
          <Tile
            key={c.title}
            size="rect"
            variant={c.variant}
            right={
              <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center">
                {c.icon}
              </div>
            }
            href={c.href}
          >
            <div>
              <p
                className={
                  c.variant === 'brand'
                    ? 'text-lg font-extrabold text-ink'
                    : 'text-lg font-semibold text-white'
                }
              >
                {c.title}
              </p>
              <p
                className={
                  c.variant === 'brand'
                    ? 'text-ink/70 text-sm'
                    : 'text-white/70 text-sm'
                }
              >
                {c.desc}
              </p>
            </div>
          </Tile>
        ))}
      </div>
    </main>
  )
}
