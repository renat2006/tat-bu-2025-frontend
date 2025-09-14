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
  let ruList = loadRecentRuWords(200)
  try {
    const sessionRaw = window.localStorage.getItem('game-session-words')
    const session = sessionRaw ? (JSON.parse(sessionRaw) as unknown) : []
    const list = Array.isArray(session) ? (session as string[]) : []
    if (list.length) ruList = list
  } catch {}
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

export function saveFrameToAlbum(
  dataUrl: string,
  wordsRU: string[],
  albumTitle?: string,
) {
  if (typeof window === 'undefined') return
  try {
    const key = 'user-albums'
    const raw = window.localStorage.getItem(key)
    const albums = raw ? (JSON.parse(raw) as any[]) : []
    const ruToTt = loadRuToTtMap()
    const { categorizeByDate } = require('./albums') as {
      categorizeByDate: (ts?: number) => string
    }
    const wordsTT = wordsRU.map((w) => ruToTt[w] || w)
    const title = albumTitle || categorizeByDate(Date.now())
    const newImage = {
      src: dataUrl,
      words: wordsTT.map((w) => ({ text: w, position: { x: 50, y: 50 } })),
    }
    const idx = albums.findIndex((a) => a?.title === title)
    if (idx >= 0) {
      const a = albums[idx]
      a.images = [newImage, ...(a.images || [])].slice(0, 50)
      // move album to top
      albums.splice(idx, 1)
      albums.unshift(a)
      window.localStorage.setItem('user-albums-last', String(a.id))
    } else {
      const id = Date.now()
      const album = { id, title, images: [newImage] }
      albums.unshift(album)
      window.localStorage.setItem('user-albums-last', String(id))
    }
    window.localStorage.setItem(key, JSON.stringify(albums.slice(0, 20)))
  } catch {}
}

export function setGameSessionWords(ruWords: string[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      'game-session-words',
      JSON.stringify(Array.from(new Set(ruWords)).slice(-32)),
    )
  } catch {}
}
