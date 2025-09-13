import { BookOpen, Building, UtensilsCrossed } from 'lucide-react'
import Tile from '@/components/ui/Tile'

const lessons = [
  {
    title: 'Урок 1: Основы татарского',
    description: 'Познакомьтесь с алфавитом и основными фразами.',
    progress: 75,
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    title: 'Задание: Еда',
    description: 'Назовите 10 видов еды на татарском.',
    progress: 40,
    icon: <UtensilsCrossed className="w-6 h-6" />,
  },
  {
    title: 'Урок 2: В городе',
    description: 'Научитесь спрашивать дорогу и ориентироваться в городе.',
    progress: 10,
    icon: <Building className="w-6 h-6" />,
  },
]

export function RecommendedLessons() {
  return (
    <div className="col-span-2">
      <h2 className="text-xl font-bold text-white mb-4 px-1">
        Рекомендуемые уроки
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {lessons.map((l, i) => (
          <Tile
            key={l.title}
            variant={i % 2 === 0 ? 'brand' : 'glass'}
            size="rect"
            right={
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-black/10">
                  {l.icon}
                </div>
              </div>
            }
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="min-w-0 flex-1">
                <p
                  className={
                    i % 2 === 0
                      ? 'font-bold leading-tight truncate text-ink'
                      : 'font-semibold leading-tight truncate text-white'
                  }
                >
                  {l.title}
                </p>
                <p
                  className={
                    i % 2 === 0
                      ? 'text-sm text-ink/70 truncate'
                      : 'text-sm text-white/70 truncate'
                  }
                >
                  {l.description}
                </p>
                <div className="h-2 w-full rounded-full bg-black/20 mt-3 overflow-hidden">
                  <div
                    className={
                      i % 2 === 0 ? 'h-full bg-ink/60' : 'h-full bg-white/70'
                    }
                    style={{ width: `${l.progress}%` }}
                  />
                </div>
              </div>
              <div className="w-12 text-right shrink-0">
                <p
                  className={
                    i % 2 === 0
                      ? 'text-sm font-semibold text-ink'
                      : 'text-sm font-semibold text-white'
                  }
                >
                  {l.progress}%
                </p>
              </div>
            </div>
          </Tile>
        ))}
      </div>
    </div>
  )
}
