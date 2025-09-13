import { Award, BookOpen, Star } from 'lucide-react'
import Card from '@/components/ui/Card'

const stats = [
  {
    icon: <BookOpen className="h-8 w-8 text-white" />,
    value: '124',
    label: 'Слов изучено',
  },
  {
    icon: <Award className="h-8 w-8 text-white" />,
    value: '3',
    label: 'Достижений',
  },
  {
    icon: <Star className="h-8 w-8 text-white" />,
    value: '4.8',
    label: 'Средний балл',
  },
]

export function Stats() {
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
