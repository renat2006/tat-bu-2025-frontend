'use client'

import { useEffect, useState } from 'react'
import { Award, BookOpen, Flame } from 'lucide-react'
import Card from '@/components/ui/Card'
import { computeAchievements } from '@/lib/records'

export function Stats() {
  const [learnedCount, setLearnedCount] = useState(0)
  const [achCount, setAchCount] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const load = () => {
      try {
        const raw = window.localStorage.getItem('explore-selected-all')
        const arr = raw ? (JSON.parse(raw) as unknown) : []
        setLearnedCount(Array.isArray(arr) ? arr.length : 0)
        const a = computeAchievements()
        setAchCount(a.achievedCount)
        setStreak(a.streakDays)
      } catch {
        setLearnedCount(0)
        setAchCount(0)
        setStreak(0)
      }
    }
    load()
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const stats = [
    {
      icon: <BookOpen className="h-8 w-8 text-white" />,
      value: String(learnedCount),
      label: 'Слов изучено',
    },
    {
      icon: <Award className="h-8 w-8 text-white" />,
      value: String(achCount),
      label: 'Достижений',
    },
    {
      icon: <Flame className="h-8 w-8 text-white" />,
      value: String(streak),
      label: 'Серия дней',
    },
  ]

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.label} size="square" color="glassDark">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4">{stat.icon}</div>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </div>
        </Card>
      ))}
    </>
  )
}
