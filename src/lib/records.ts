export type RecordEntry<T> = { ts: number; data: T }

export function pushRecord<T>(gameId: string, data: T, limit: number = 100) {
  if (typeof window === 'undefined') return
  try {
    const key = `game-records-${gameId}`
    const raw = window.localStorage.getItem(key)
    const arr = raw ? (JSON.parse(raw) as RecordEntry<T>[]) : []
    arr.unshift({ ts: Date.now(), data })
    window.localStorage.setItem(key, JSON.stringify(arr.slice(0, limit)))
  } catch {}
}

export function getRecords<T>(gameId: string): RecordEntry<T>[] {
  if (typeof window === 'undefined') return []
  try {
    const key = `game-records-${gameId}`
    const raw = window.localStorage.getItem(key)
    const arr = raw ? (JSON.parse(raw) as RecordEntry<T>[]) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function isSameDay(aTs: number, bTs: number) {
  const a = new Date(aTs)
  const b = new Date(bTs)
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function withinLastDays(ts: number, days: number) {
  const now = Date.now()
  const ms = days * 24 * 60 * 60 * 1000
  return now - ts <= ms
}

export type Achievement = {
  id: string
  title: string
  desc: string
  achieved: boolean
  icon: string
}

function getSavedAchievements(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem('achievements_completed')
    const arr = raw ? (JSON.parse(raw) as string[]) : []
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

export function markAchievement(id: string) {
  if (typeof window === 'undefined') return
  try {
    const set = getSavedAchievements()
    set.add(id)
    window.localStorage.setItem(
      'achievements_completed',
      JSON.stringify(Array.from(set)),
    )
  } catch {}
}

export function computeAchievements() {
  const match = getRecords<{ moves: number; seconds: number }>('match')
  const spell = getRecords<{ score: number; seconds: number }>('spell')
  const vocab = getRecords<{ count: number }>('vocab')
  const sessions = [...match, ...spell, ...vocab].sort((a, b) => b.ts - a.ts)
  const saved = getSavedAchievements()

  const totalSessions = sessions.length
  const fastMatcher = match.some((r) => r.data.seconds <= 30)
  const perfectSpeller = spell.some((r) => r.data.score >= 10)
  // «Первые слова» теперь только по сохранённому флагу
  const vocabStarter = saved.has('first-vocab')
  const weekWarrior =
    sessions.filter((r) => withinLastDays(r.ts, 7)).length >= 7
  const streakDays = (() => {
    const unique = new Set(
      sessions.map((r) => {
        const d = new Date(r.ts)
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      }),
    )
    let s = 0
    const dayMs = 24 * 60 * 60 * 1000
    for (let i = 0; i < 365; i++) {
      const d = new Date(Date.now() - i * dayMs)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      if (unique.has(key)) s++
      else break
    }
    return s
  })()

  const medals: Achievement[] = [
    {
      id: 'first-vocab',
      title: 'Первые слова',
      desc: 'Отметьте 10 слов',
      achieved: vocabStarter,
      icon: 'book',
    },
    {
      id: 'fast-match',
      title: 'Спринтер',
      desc: 'Соберите пары за 30с',
      achieved: fastMatcher || saved.has('fast-match'),
      icon: 'zap',
    },
    {
      id: 'spell-10',
      title: 'Меткий набор',
      desc: '10 правильных ответов',
      achieved: perfectSpeller || saved.has('spell-10'),
      icon: 'target',
    },
    {
      id: 'week-7',
      title: 'Неделя в строю',
      desc: 'Занимайтесь 7 дней',
      achieved: weekWarrior || saved.has('week-7'),
      icon: 'calendar',
    },
    {
      id: 'streak-3',
      title: 'Серия 3',
      desc: 'Серия 3 дня',
      achieved: streakDays >= 3 || saved.has('streak-3'),
      icon: 'medal',
    },
  ]

  const achievedCount = medals.filter((m) => m.achieved).length

  return { medals, achievedCount, totalSessions, streakDays }
}
