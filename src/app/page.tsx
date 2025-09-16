import { Greeting } from '@/components/dashboard/Greeting'
import { Stats } from '@/components/dashboard/Stats'
import { RecentWords } from '@/components/dashboard/RecentWords'
import { ARButton } from '@/components/dashboard/ARButton'
import { RecommendedLessons } from '@/components/dashboard/RecommendedLessons'
import AchievementsGrid from '@/components/dashboard/AchievementsGrid'

export default function Home() {
  return (
    <main
      className="min-h-screen pb-24 pt-2 px-2"
      style={{
        paddingTop: 'calc(8px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'calc(8px + env(safe-area-inset-left, 0px))',
        paddingRight: 'calc(8px + env(safe-area-inset-right, 0px))',
      }}
    >
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
