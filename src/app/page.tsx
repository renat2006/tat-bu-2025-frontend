import { Greeting } from '@/components/dashboard/Greeting'
import { Stats } from '@/components/dashboard/Stats'
import { RecentWords } from '@/components/dashboard/RecentWords'
import { ARButton } from '@/components/dashboard/ARButton'
import { RecommendedLessons } from '@/components/dashboard/RecommendedLessons'
import AchievementsGrid from '@/components/dashboard/AchievementsGrid'

export default function Home() {
  return (
    <main className="min-h-screen pb-24 pt-2 px-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="col-span-2 md:col-span-4">
          <Greeting />
        </div>
        <ARButton />
        <Stats />
        <RecentWords />
        <AchievementsGrid />
        <RecommendedLessons />
      </div>
    </main>
  )
}
