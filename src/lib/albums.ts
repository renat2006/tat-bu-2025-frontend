const CATEGORIES: Array<{ title: string; keywords: string[] }> = [
  {
    title: 'Еда',
    keywords: [
      'еда',
      'яблоко',
      'хлеб',
      'овощ',
      'фрукт',
      'чай',
      'вода',
      'тарелка',
      'ложка',
    ],
  },
  {
    title: 'Город',
    keywords: [
      'улица',
      'площадь',
      'здание',
      'дорога',
      'мост',
      'парк',
      'фонарь',
      'машина',
      'авто',
      'трамвай',
    ],
  },
  {
    title: 'Природа',
    keywords: [
      'гора',
      'река',
      'лес',
      'озеро',
      'поле',
      'небо',
      'трава',
      'цветок',
    ],
  },
  {
    title: 'Дом',
    keywords: [
      'дом',
      'кухня',
      'комната',
      'кровать',
      'стол',
      'стул',
      'окно',
      'дверь',
    ],
  },
  {
    title: 'Люди',
    keywords: ['человек', 'женщина', 'мужчина', 'ребёнок', 'друг', 'семья'],
  },
  {
    title: 'Техника',
    keywords: ['телефон', 'камера', 'компьютер', 'ноутбук', 'экран'],
  },
]

export function categorizeByWords(ruWords: string[]): string {
  const lower = ruWords.map((w) => w.toLowerCase())
  const score: Record<string, number> = {}
  CATEGORIES.forEach((c) => {
    score[c.title] = c.keywords.reduce(
      (acc, k) => (lower.some((w) => w.includes(k)) ? acc + 1 : acc),
      0,
    )
  })
  let best: string | null = null
  let bestScore = 0
  Object.entries(score).forEach(([title, s]) => {
    if (s > bestScore) {
      bestScore = s
      best = title
    }
  })
  return bestScore > 0 && best ? best : 'Кадры'
}

export function categorizeByDate(ts: number = Date.now()): string {
  const d = new Date(ts)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}
