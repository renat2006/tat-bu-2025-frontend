import Tile from '@/components/ui/Tile'

const recentWords = [
  { tatar: 'Алма', translation: 'Яблоко', learned: '2 дня назад' },
  { tatar: 'Китап', translation: 'Книга', learned: '3 дня назад' },
  { tatar: 'Мәче', translation: 'Кошка', learned: '5 дней назад' },
  { tatar: 'Эт', translation: 'Собака', learned: '5 дней назад' },
]

export function RecentWords() {
  return (
    <div className="col-span-2">
      <h2 className="text-xl font-bold text-white mb-4 px-1">
        Последние слова
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {recentWords.map((w, i) => (
          <Tile
            key={w.tatar + i}
            variant={i % 3 === 0 ? 'brand' : 'glass'}
            size="square"
          >
            <div>
              <p
                className={
                  i % 3 === 0
                    ? 'text-lg font-extrabold text-ink'
                    : 'text-lg font-semibold text-white'
                }
              >
                {w.tatar}
              </p>
              <p className={i % 3 === 0 ? 'text-ink/70' : 'text-white/70'}>
                {w.translation}
              </p>
              <p
                className={
                  i % 3 === 0
                    ? 'text-xs text-ink/60 mt-2'
                    : 'text-xs text-white/60 mt-2'
                }
              >
                {w.learned}
              </p>
            </div>
          </Tile>
        ))}
      </div>
    </div>
  )
}
