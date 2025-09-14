'use client'

import { useEffect, useState } from 'react'
import Tile from '@/components/ui/Tile'

export function RecentWords() {
  const [words, setWords] = useState<string[]>([])
  const [ruToTt, setRuToTt] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = () => {
      try {
        const raw = window.localStorage.getItem('explore-selected-all')
        const arr = raw ? (JSON.parse(raw) as unknown) : []
        const list = Array.isArray(arr) ? (arr as string[]) : []
        setWords(list.slice(-4).reverse())
      } catch {
        setWords([])
      }
    }
    load()
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('explore-ru-tt')
      const map = raw ? (JSON.parse(raw) as Record<string, string>) : {}
      setRuToTt(map && typeof map === 'object' ? map : {})
    } catch {
      setRuToTt({})
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const fetchMissing = async () => {
      const missing = words.filter((ru) => !ruToTt[ru]).slice(0, 8)
      for (const ru of missing) {
        try {
          const r = await fetch('https://vibe-tel.ddns.net/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: ru,
              source_language: 'ru',
              target_language: 'tt',
            }),
          })
          const j = (await r.json()) as { translated_text?: string }
          if (!cancelled && j.translated_text) {
            setRuToTt((m) => {
              const next = { ...m, [ru]: j.translated_text as string }
              try {
                window.localStorage.setItem(
                  'explore-ru-tt',
                  JSON.stringify(next),
                )
              } catch {}
              return next
            })
          }
        } catch {}
      }
    }
    if (words.length) fetchMissing()
    return () => {
      cancelled = true
    }
  }, [words, ruToTt])

  return (
    <div className="col-span-2">
      <h2 className="text-xl font-bold text-white mb-4 px-1">
        Последние слова
      </h2>
      {words.length ? (
        <div className="grid grid-cols-2 gap-2">
          {words.map((ru, i) => {
            const tt = ruToTt[ru] || ru
            return (
              <Tile
                key={ru + i}
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
                    {tt}
                  </p>
                  <p className={i % 3 === 0 ? 'text-ink/70' : 'text-white/70'}>
                    {ru}
                  </p>
                </div>
              </Tile>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Tile variant="glass" size="square">
            <div>
              <p className="text-lg font-semibold text-white">Пусто</p>
              <p className="text-white/70">Выбирайте слова в разделе Сканер</p>
            </div>
          </Tile>
        </div>
      )}
    </div>
  )
}
