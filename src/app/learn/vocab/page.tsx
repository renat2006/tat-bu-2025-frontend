'use client'

import { useEffect, useMemo, useState } from 'react'
import BackToLearn from '@/components/ui/BackToLearn'
import { markAchievement } from '@/lib/records'
import { BookOpen, Sparkles, Shuffle, X, Loader2, Check } from 'lucide-react'
import Tile from '@/components/ui/Tile'
import { Volume2, Copy, Star, StarOff } from 'lucide-react'

export default function VocabPage() {
  const [ruWords, setRuWords] = useState<string[]>([])
  const [ruToTt, setRuToTt] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState('')
  const [onlyFavs, setOnlyFavs] = useState(false)
  const [favs, setFavs] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [sentenceTT, setSentenceTT] = useState('')
  const [sentenceRU, setSentenceRU] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('explore-selected-all')
      const arr = raw ? (JSON.parse(raw) as unknown) : []
      const list = Array.isArray(arr) ? (arr as string[]) : []
      setRuWords(Array.from(new Set(list)).reverse())
      const src = new URLSearchParams(window.location.search).get('src')
      if (src === 'continue') {
        try {
          window.localStorage.setItem(
            'game-records-vocab',
            JSON.stringify([{ ts: Date.now(), data: { count: 10 } }]),
          )
        } catch {}
        try {
          markAchievement('first-vocab')
        } catch {}
        setTimeout(() => {
          setToast(true)
          setTimeout(() => setToast(false), 4600)
        }, 1600)
      }
    } catch {
      setRuWords([])
    }
  }, [])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('explore-ru-tt')
      const map = raw ? (JSON.parse(raw) as Record<string, string>) : {}
      setRuToTt(map && typeof map === 'object' ? map : {})
    } catch {
      setRuToTt({})
    }
    try {
      const favRaw = window.localStorage.getItem('vocab-favs')
      const favArr = favRaw ? (JSON.parse(favRaw) as string[]) : []
      setFavs(new Set(Array.isArray(favArr) ? favArr : []))
    } catch {}
  }, [])

  useEffect(() => {
    let cancelled = false
    const fetchMissing = async (ru: string) => {
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
              window.localStorage.setItem('explore-ru-tt', JSON.stringify(next))
            } catch {}
            return next
          })
        }
      } catch {}
    }
    ruWords.slice(0, 50).forEach((ru) => {
      if (!ruToTt[ru]) fetchMissing(ru)
    })
    return () => {
      cancelled = true
    }
  }, [ruWords, ruToTt])

  const toggleFav = (ru: string) => {
    setFavs((s) => {
      const next = new Set(s)
      if (next.has(ru)) next.delete(ru)
      else next.add(ru)
      try {
        window.localStorage.setItem(
          'vocab-favs',
          JSON.stringify(Array.from(next)),
        )
      } catch {}
      return next
    })
  }

  const speak = async (text: string) => {
    try {
      if (!text || isSpeaking) return
      setIsSpeaking(true)
      const r = await fetch('https://vibe-tel.ddns.net/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!r.ok) {
        setIsSpeaking(false)
        return
      }
      const { audio_base64 } = (await r.json()) as { audio_base64: string }
      const audio = new Audio(`data:audio/mp3;base64,${audio_base64}`)
      audio.addEventListener('ended', () => setIsSpeaking(false))
      audio.addEventListener('error', () => setIsSpeaking(false))
      await audio.play()
    } catch {}
  }

  const toggleSelected = (ru: string) => {
    setSelected((prev) =>
      prev.includes(ru) ? prev.filter((w) => w !== ru) : [...prev, ru],
    )
  }

  const shuffleSelected = () => {
    setSelected((prev) => [...prev].sort(() => Math.random() - 0.5))
  }

  const clearSelected = () => {
    setSelected([])
  }

  const generate = async () => {
    if (!selected.length || isGenerating) return
    try {
      setIsGenerating(true)
      const r = await fetch(
        'https://vibe-tel.ddns.net/generate-sentence-bilingual',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ objects: selected, previous_sentences: [] }),
        },
      )
      if (!r.ok) throw new Error('API error')
      const j = (await r.json()) as {
        sentence_ru: string
        sentence_tt: string
      }
      setSentenceTT(j.sentence_tt || '')
      setSentenceRU(j.sentence_ru || '')
    } catch {
    } finally {
      setIsGenerating(false)
    }
  }

  const words = useMemo(() => {
    const q = filter.trim().toLowerCase()
    let list = ruWords
    if (onlyFavs) list = list.filter((ru) => favs.has(ru))
    if (q) list = list.filter((w) => w.toLowerCase().includes(q))
    return list
  }, [ruWords, filter, onlyFavs, favs])

  return (
    <main className="min-h-screen pb-24 pt-4 px-4">
      <style>{`header, nav { display:none !important }`}</style>
      <div className="mb-3 flex items-center justify-between gap-2">
        <BackToLearn />
        <div className="inline-flex items-center gap-2">
          <div className="inline-flex rounded-full bg-white/10 p-1">
            <button
              onClick={() => setOnlyFavs(false)}
              className={`h-9 px-4 rounded-full text-sm ${!onlyFavs ? 'bg-white/20 text-white' : 'text-white/70'}`}
            >
              Все
            </button>
            <button
              onClick={() => setOnlyFavs(true)}
              className={`h-9 px-4 rounded-full text-sm ${onlyFavs ? 'bg-white/20 text-white' : 'text-white/70'}`}
            >
              Избранные
            </button>
          </div>
          <div className="text-white/80 text-sm hidden sm:block">
            Всего: {ruWords.length}
          </div>
        </div>
      </div>
      {/* Composer */}
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 mb-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto no-scrollbar pr-2 min-h-[40px]">
              {selected.length ? (
                selected.map((ru) => (
                  <button
                    key={ru}
                    onClick={() => toggleSelected(ru)}
                    className="px-3 py-1 rounded-full bg-white/12 text-white text-sm inline-flex items-center gap-2"
                    title="Убрать"
                  >
                    <span className="truncate max-w-[40vw]">
                      {ruToTt[ru] || ru}
                    </span>
                    <X className="w-3.5 h-3.5 text-white/70" />
                  </button>
                ))
              ) : (
                <span className="text-white/60 text-sm">
                  Выберите слова ниже
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 flex items-center justify-end">
            <button
              onClick={generate}
              disabled={!selected.length || isGenerating}
              className="h-10 px-4 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/20 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Генерируем…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Составить
                </>
              )}
            </button>
          </div>
        </div>

        {(sentenceTT || sentenceRU) && (
          <div className="mt-3 rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            <p className="text-white font-semibold leading-snug">
              {sentenceTT}
            </p>
            <p className="text-white/80 text-xs mt-1">{sentenceRU}</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => speak(sentenceTT)}
                disabled={!sentenceTT || isSpeaking}
                className="h-9 w-9 rounded-full bg-white/10 ring-1 ring-white/10 flex items-center justify-center disabled:opacity-50"
                aria-label="Произнести"
              >
                {isSpeaking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `${sentenceTT} — ${sentenceRU}`,
                  )
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1200)
                }}
                className={`h-9 px-3 rounded-full text-white text-xs ring-1 ring-white/12 transition-colors ${copied ? 'bg-green-500/20' : 'bg-white/10 hover:bg-white/15'}`}
              >
                <span className="inline-flex items-center gap-1">
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? 'Скопировано' : 'Копировать'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mb-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Поиск по словам"
          className="w-full h-12 rounded-2xl px-4 bg-white/10 text-white ring-1 ring-white/10 outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {words.length ? (
          words.map((ru, i) => {
            const tt = ruToTt[ru] || ru
            const fav = favs.has(ru)
            return (
              <Tile
                key={ru + i}
                size="rect"
                variant={'glass'}
                className={`h-[96px] ${selected.includes(ru) ? 'ring-2 ring-brand-green/40' : ''}`}
              >
                <div
                  className="flex items-center gap-3"
                  onClick={() => toggleSelected(ru)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-extrabold text-base truncate">
                      {tt}
                    </p>
                    <p className="text-white/70 text-xs truncate">{ru}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <button
                      onClick={() => speak(tt)}
                      className="w-9 h-9 rounded-xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center"
                      aria-label="Произнести"
                    >
                      <Volume2 className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(`${tt} — ${ru}`)
                      }}
                      className="w-9 h-9 rounded-xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center"
                      aria-label="Копировать"
                    >
                      <Copy className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => toggleFav(ru)}
                      className="w-9 h-9 rounded-xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center"
                      aria-label={fav ? 'Убрать из избранного' : 'В избранное'}
                    >
                      {fav ? (
                        <StarOff className="w-4 h-4 text-white" />
                      ) : (
                        <Star className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </Tile>
            )
          })
        ) : (
          <Tile size="rect" variant="glass" className="col-span-2">
            <p className="text-white/70">
              Список пуст. Выберите слова в разделе «Исследовать».
            </p>
          </Tile>
        )}
      </div>
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 top-6 z-50 w-[94%] max-w-lg">
          <div className="rounded-[28px] px-5 py-4 bg-[linear-gradient(180deg,rgba(26,27,32,0.9),rgba(26,27,32,0.96))] ring-1 ring-white/10 text-white shadow-[0_16px_40px_rgba(0,0,0,0.5)] [backdrop-filter:saturate(160%)_blur(12px)] flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10">
              <BookOpen className="w-7 h-7" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] text-white/70 leading-none">
                Новое достижение
              </p>
              <p className="text-base font-bold leading-tight truncate">
                Первые слова
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
