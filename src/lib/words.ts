export type WordPair = { ru: string; tt: string }

export function loadRecentRuWords(max: number = 100): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem('explore-selected-all')
    const arr = raw ? (JSON.parse(raw) as unknown) : []
    const list = Array.isArray(arr) ? (arr as string[]) : []
    return list.slice(-max)
  } catch {
    return []
  }
}

export function loadRuToTtMap(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem('explore-ru-tt')
    const map = raw ? (JSON.parse(raw) as unknown) : {}
    return map && typeof map === 'object' ? (map as Record<string, string>) : {}
  } catch {
    return {}
  }
}

export function buildWordPairs(max: number = 12): WordPair[] {
  const ruList = loadRecentRuWords(200)
  const ruToTt = loadRuToTtMap()
  const pairs: WordPair[] = []
  for (let i = ruList.length - 1; i >= 0 && pairs.length < max; i--) {
    const ru = ruList[i]
    const tt = ruToTt[ru]
    if (!ru || !tt) continue
    if (!pairs.find((p) => p.ru === ru)) pairs.push({ ru, tt })
  }
  return pairs
}
