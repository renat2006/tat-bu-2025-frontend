'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import Tile from '@/components/ui/Tile'
import { Loader2, Volume2, Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useExploreStore } from '@/stores/exploreStore'

type Detection = {
  bbox?: [number, number, number, number]
  class_ru?: string
  [k: string]: unknown
}

type ProcessImageResponse = {
  objects_ru: string[]
  objects_tt: string[]
  sentence_ru: string
  sentence_tt: string
  target_word_ru: string
  target_word_tt: string
  detections: Detection[]
}

type Tracked = {
  id: string
  x: number
  y: number
  w: number
  h: number
  tt: string
  ru: string
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.hypot(dx, dy)
}

function toBox(b: [number, number, number, number]) {
  const [x1, y1, x2, y2] = b
  const w = Math.max(0, x2 - x1)
  const h = Math.max(0, y2 - y1)
  return { x: x1, y: y1, w, h }
}

function track(prev: Tracked[], rsp: ProcessImageResponse | null): Tracked[] {
  const detections = rsp?.detections ?? []
  const next: Tracked[] = []
  const usedPrev = new Set<number>()
  const usedDet = new Set<number>()
  const centers = detections.map((d, i) => {
    const b = (d as any).bbox as [number, number, number, number] | undefined
    if (!b) return { x: 0, y: 0, w: 0, h: 0, valid: false }
    const { x, y, w, h } = toBox(b)
    return { x: x + w / 2, y: y, w, h, valid: true }
  })
  centers.forEach((c, ci) => {
    if (!c.valid || usedDet.has(ci)) return
    const det = detections[ci] as any
    const ruName = (det?.class_ru as string) || (rsp?.objects_ru?.[ci] ?? '')
    const tt = ruName // используем RU как подпись
    const ru = ruName
    next.push({
      id: `${Date.now()}_${ci}`,
      x: c.x,
      y: c.y,
      w: c.w,
      h: c.h,
      tt,
      ru,
    })
  })
  return next
}

function Bubble({
  x,
  y,
  tt,
  ru,
  selected,
  onClick,
}: {
  x: number
  y: number
  tt: string
  ru: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`absolute px-3 py-1 rounded-full text-white text-xs ring-1 transition-all duration-200 ease-out cursor-pointer select-none z-30 ${
        selected
          ? 'bg-[rgba(17,18,23,0.95)] ring-white/20 shadow-[0_0_16px_rgba(188,251,108,0.35)]'
          : 'bg-[rgba(17,18,23,0.8)] ring-white/10'
      }`}
      style={{ left: x, top: y, transform: 'translate(-50%, -120%)' }}
    >
      <span className="font-bold">{tt}</span>
      <span className="opacity-70 ml-1">({ru})</span>
    </div>
  )
}

export default function ExplorePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rsp, setRsp] = useState<ProcessImageResponse | null>(null)
  const [bubbles, setBubbles] = useState<Tracked[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const selectedFromStore = useExploreStore((s) => s.selected)
  const addWord = useExploreStore((s) => s.addWord)
  const removeWord = useExploreStore((s) => s.removeWord)
  const clearSelectedStore = useExploreStore((s) => s.clearSelected)
  const addSentenceHistory = useExploreStore((s) => s.addSentence)
  const lastTapRef = useRef<Record<string, number>>({})
  const [ttMap, setTtMap] = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState(false)
  const [vh, setVh] = useState<number>(0)
  const history = useExploreStore((s) => s.history)
  const [activeTab, setActiveTab] = useState<'words' | 'history'>('words')
  const dragRef = useRef<{ startY: number; moved: boolean }>({
    startY: 0,
    moved: false,
  })

  useEffect(() => {
    const set = () => setVh(window.innerHeight)
    set()
    window.addEventListener('resize', set)
    window.addEventListener('orientationchange', set)
    return () => {
      window.removeEventListener('resize', set)
      window.removeEventListener('orientationchange', set)
    }
  }, [])

  const collapsedH = 250
  const panelH = expanded ? Math.max(260, Math.round(vh * 0.65)) : collapsedH
  const videoH = vh ? Math.max(0, vh - panelH) : undefined

  useEffect(() => {
    document.body.classList.add('hide-chrome')
    return () => document.body.classList.remove('hide-chrome')
  }, [])

  // При сворачивании возвращаем вкладку в «Слова»
  useEffect(() => {
    if (!expanded) setActiveTab('words')
  }, [expanded])

  // Когда пользователь добавляет новые RU-слова, заранее переводим их на татарский для подписи пузырей
  useEffect(() => {
    let aborted = false
    const fetchTT = async (ru: string) => {
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
        if (!aborted && j.translated_text) {
          setTtMap((m) => (m[ru] ? m : { ...m, [ru]: j.translated_text! }))
        }
      } catch {}
    }
    selectedFromStore.forEach((ru) => {
      if (!ttMap[ru]) fetchTT(ru)
    })
    return () => {
      aborted = true
    }
  }, [selectedFromStore, ttMap])

  const onChipTouch = (word: string) => {
    const now = Date.now()
    const last = lastTapRef.current[word] || 0
    if (now - last < 300) {
      removeWord(word)
    }
    lastTapRef.current[word] = now
  }

  const camRef = useRef<Webcam>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const speak = useCallback(async (text: string) => {
    try {
      const r = await fetch('https://vibe-tel.ddns.net/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!r.ok) throw new Error('Audio error')
      const { audio_base64 } = (await r.json()) as { audio_base64: string }
      const audio = new Audio(`data:audio/mp3;base64,${audio_base64}`)
      audio.play()
    } catch {}
  }, [])

  const mapDetections = useCallback((json: ProcessImageResponse) => {
    const video = camRef.current?.video as HTMLVideoElement | undefined
    const wrap = overlayRef.current
    if (!video || !wrap) return [] as Tracked[]
    const vw = video.videoWidth || 1
    const vh = video.videoHeight || 1
    const cw = wrap.clientWidth || 1
    const ch = wrap.clientHeight || 1
    // object-cover: видео масштабируется с сохранением пропорций и центрируется
    const scale = Math.max(cw / vw, ch / vh)
    const dw = vw * scale
    const dh = vh * scale
    const offX = (cw - dw) / 2
    const offY = (ch - dh) / 2

    const dets = json.detections || []
    return dets
      .map((d, i) => {
        const b = (d as any).bbox as
          | [number, number, number, number]
          | undefined
        if (!b) return null
        const box = toBox(b)
        return {
          id: `${Date.now()}_${i}`,
          x: box.x * scale + (box.w * scale) / 2 + offX,
          y: box.y * scale + offY,
          w: box.w * scale,
          h: box.h * scale,
          tt: ((d as any).class_ru as string) || json.objects_ru?.[i] || '',
          ru: ((d as any).class_ru as string) || json.objects_ru?.[i] || '',
        } as Tracked
      })
      .filter(Boolean) as Tracked[]
  }, [])

  // Пересчёт позиций при изменении размеров/ориентации/после загрузки размеров видео
  useEffect(() => {
    const remap = () => {
      if (rsp) setBubbles(mapDetections(rsp))
    }
    const ro = new ResizeObserver(remap)
    if (overlayRef.current) ro.observe(overlayRef.current)
    window.addEventListener('orientationchange', remap)
    window.addEventListener('resize', remap)
    const v = camRef.current?.video as HTMLVideoElement | undefined
    if (v) v.addEventListener('loadedmetadata', remap)
    return () => {
      ro.disconnect()
      window.removeEventListener('orientationchange', remap)
      window.removeEventListener('resize', remap)
      if (v) v.removeEventListener('loadedmetadata', remap)
    }
  }, [rsp, mapDetections])

  const unifiedProcess = useCallback(
    async (file: File) => {
      try {
        setLoading(true)
        setError('')
        const form = new FormData()
        form.append('file', file)
        const r = await fetch('https://vibe-tel.ddns.net/extract-objects', {
          method: 'POST',
          body: form,
        })
        if (!r.ok) throw new Error(`API ${r.status}`)
        const json: any = await r.json()
        // Пытаемся учесть оба варианта ответа: только objects или objects + detections
        const next = {
          objects_ru:
            (json.objects as string[]) || (json.objects_ru as string[]) || [],
          objects_tt: [],
          detections: (json.detections as Detection[]) || [],
        }
        setRsp((prev) => ({
          objects_ru: next.objects_ru.length
            ? next.objects_ru
            : prev?.objects_ru || [],
          objects_tt: next.objects_tt.length
            ? next.objects_tt
            : prev?.objects_tt || [],
          sentence_tt: prev?.sentence_tt || '',
          sentence_ru: prev?.sentence_ru || '',
          target_word_tt: prev?.target_word_tt || '',
          target_word_ru: prev?.target_word_ru || '',
          detections: next.detections,
        }))
        if (next.detections?.length)
          setBubbles(
            mapDetections({
              ...(rsp || {}),
              detections: next.detections,
            } as any),
          )
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Ошибка')
      } finally {
        setLoading(false)
      }
    },
    [mapDetections, rsp],
  )

  const captureLive = useCallback(async () => {
    if (!camRef.current) return
    const src = camRef.current.getScreenshot()
    if (!src) return
    const res = await fetch(src)
    const blob = await res.blob()
    const file = new File([blob], 'frame.jpg', { type: blob.type })
    await unifiedProcess(file)
  }, [unifiedProcess])

  useEffect(() => {
    const id = setInterval(() => {
      if (!loading) captureLive()
    }, 4500)
    return () => clearInterval(id)
  }, [loading, captureLive])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
    const word = bubbles.find((b) => b.id === id)?.tt
    if (!word) return
    if (selectedFromStore.includes(word)) removeWord(word)
    else addWord(word)
  }

  const selectedWords = useMemo(() => {
    return Array.from(new Set(selectedFromStore))
  }, [selectedFromStore])

  const generateSentence = useCallback(async () => {
    if (!selectedWords.length) return
    try {
      setLoading(true)
      // 1-запрос: билингвальная генерация (RU + TT)
      const r = await fetch(
        'https://vibe-tel.ddns.net/generate-sentence-bilingual',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            objects: selectedWords,
            previous_sentences: [],
          }),
        },
      )
      if (!r.ok) throw new Error('API error')
      const j = (await r.json()) as {
        sentence_ru: string
        sentence_tt: string
        target_word_ru?: string
        target_word_tt?: string
      }
      const sentence_ru = j.sentence_ru
      const sentence_tt = j.sentence_tt
      setRsp((prev) => ({
        objects_ru: prev?.objects_ru || [],
        objects_tt: prev?.objects_tt || [],
        sentence_tt, // показываем татарский крупным
        sentence_ru,
        target_word_tt: j.target_word_tt || prev?.target_word_tt || '',
        target_word_ru: j.target_word_ru || prev?.target_word_ru || '',
        detections: prev?.detections || [],
      }))
      addSentenceHistory({
        sentence_ru,
        sentence_tt,
        target_word_ru: j.target_word_ru,
        target_word_tt: j.target_word_tt,
      })
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [selectedWords, addSentenceHistory])

  const renderHighlighted = (text?: string, word?: string) => {
    if (!text) return null
    if (!word) return <>{text}</>
    try {
      const parts = text.split(new RegExp(`(${word})`, 'ig'))
      return (
        <>
          {parts.map((p, i) =>
            p.toLowerCase() === word.toLowerCase() ? (
              <span
                key={i}
                className="font-extrabold [color:var(--color-brand-green)]"
              >
                {p}
              </span>
            ) : (
              <span key={i}>{p}</span>
            ),
          )}
        </>
      )
    } catch {
      return <>{text}</>
    }
  }

  return (
    <main className="min-h-screen h-[100svh] pb-0 pt-0 overflow-hidden">
      {/* скрыть хедер/навигацию на AR-странице */}
      <style>{`body { overscroll-behavior: none; }`}</style>

      {/* размеры: высота нижней панели 170px */}
      <div
        ref={overlayRef}
        className="relative rounded-[24px] overflow-hidden ring-0 w-full"
        style={{
          height: videoH ? `${videoH}px` : `calc(100svh - ${collapsedH}px)`,
        }}
      >
        <Link
          href="/"
          className="absolute top-3 left-3 z-40 h-11 w-11 rounded-full bg-[rgba(17,18,23,0.6)] text-white flex items-center justify-center ring-1 ring-white/10"
          aria-label="Назад"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        {/* compact status pill */}
        <div className="absolute top-3 right-3 z-40">
          <div className="h-10 px-3 rounded-full bg-[rgba(17,18,23,0.55)] text-white ring-1 ring-white/12 flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Обработка…</span>
              </>
            ) : rsp ? (
              <span className="text-sm">
                {rsp.objects_tt?.length || rsp.objects_ru?.length || 0} • готово
              </span>
            ) : (
              <span className="text-sm">Готово</span>
            )}
          </div>
        </div>
        <Webcam
          ref={camRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'environment' }}
          className="w-full h-full object-cover"
        />

        {/* bbox highlight */}
        {bubbles.map((b) => (
          <div
            key={b.id + '_bbox'}
            className="absolute rounded-2xl ring-2 ring-[rgba(188,251,108,0.6)] shadow-[0_0_24px_rgba(188,251,108,0.25)] transition-all duration-200 z-10"
            style={{ left: b.x - b.w / 2, top: b.y, width: b.w, height: b.h }}
          />
        ))}

        {/* connecting line + bubbles */}
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="absolute z-30"
            style={{ left: b.x, top: b.y }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-full w-[2px] h-6 bg-[rgba(188,251,108,0.6)]" />
            <Bubble
              x={b.x}
              y={b.y}
              tt={ttMap[b.ru] || b.tt || b.ru}
              ru={b.ru}
              selected={selectedFromStore.includes(b.ru)}
              onClick={() => {
                toggleSelect(b.id)
                setFocusedId(b.id)
              }}
            />
          </div>
        ))}
      </div>

      {/* Bottom docked info panel (full width) */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="w-full pb-[env(safe-area-inset-bottom)]">
          <div
            className="relative w-full rounded-t-[32px] bg-[linear-gradient(180deg,rgba(26,27,32,0.64),rgba(26,27,32,0.88))] [backdrop-filter:saturate(180%)_blur(20px)] shadow-[0_-16px_36px_rgba(0,0,0,0.45)] px-5 py-3"
            style={{ height: `${panelH}px` }}
          >
            {/* grabber */}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="absolute left-1/2 -translate-x-1/2 top-2 h-2 w-14 rounded-full bg-white/25 z-50"
              aria-label="Развернуть панель"
              onTouchStart={(e) => {
                dragRef.current.startY = e.touches[0].clientY
                dragRef.current.moved = false
              }}
              onTouchMove={(e) => {
                const dy = e.touches[0].clientY - dragRef.current.startY
                if (Math.abs(dy) > 10) dragRef.current.moved = true
              }}
              onTouchEnd={(e) => {
                const dy = e.changedTouches[0].clientY - dragRef.current.startY
                if (!dragRef.current.moved) return
                if (dy < -40) setExpanded(true)
                else if (dy > 40) setExpanded(false)
              }}
            />
            {/* chips row */}
            <div className="min-w-0 pt-4">
              {expanded && (
                <div className="mb-2 inline-flex rounded-full bg-white/10">
                  <button
                    className={`h-9 px-4 rounded-full text-sm ${activeTab === 'words' ? 'bg-white/20 text-white' : 'text-white/70'}`}
                    onClick={() => setActiveTab('words')}
                  >
                    Слова
                  </button>
                  <button
                    className={`h-9 px-4 rounded-full text-sm ${activeTab === 'history' ? 'bg-white/20 text-white' : 'text-white/70'}`}
                    onClick={() => setActiveTab('history')}
                  >
                    История
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2 overflow-y-auto no-scrollbar py-1 pr-16 max-h-16">
                {selectedFromStore.length ? (
                  selectedFromStore.map((word) => (
                    <button
                      key={word}
                      onDoubleClick={() => removeWord(word)}
                      onTouchEnd={() => onChipTouch(word)}
                      className="px-3 py-1 rounded-full bg-white/12 text-white text-sm"
                      aria-label={`Удалить ${word}`}
                    >
                      {word}
                    </button>
                  ))
                ) : (
                  <span className="text-white/60 text-sm">
                    Тапните по облачку, чтобы выбрать
                  </span>
                )}
              </div>
              {/* sentence block full width */}
              {activeTab === 'words' ? (
                <div className="mt-2 rounded-[18px] bg-white/8 px-4 py-3 pb-12">
                  <p className="text-white font-semibold leading-snug">
                    {rsp?.sentence_tt ||
                      'Предложение на татарском появится здесь'}
                  </p>
                  <p className="text-white/85 text-xs mt-1">
                    {renderHighlighted(rsp?.sentence_ru, rsp?.target_word_ru)}
                  </p>
                </div>
              ) : (
                <div
                  className="mt-2 rounded-[18px] bg-white/6 px-2 py-1 overflow-y-auto"
                  style={{ maxHeight: expanded ? panelH - 90 : 80 }}
                >
                  {history.length ? (
                    <ul className="divide-y divide-white/10">
                      {history.map((h) => (
                        <li key={h.id} className="py-2 px-2">
                          <div className="flex items-center justify-between gap-3">
                            <p
                              className="text-white font-semibold leading-snug truncate"
                              title={h.sentence_tt}
                            >
                              {h.sentence_tt}
                            </p>
                            {(h.target_word_tt || h.target_word_ru) && (
                              <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/8 text-white/80 text-[11px]">
                                {h.target_word_tt || h.target_word_ru}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-white/70 text-xs mt-1 truncate"
                            title={h.sentence_ru}
                          >
                            {h.sentence_ru}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/60 text-sm">История пуста</p>
                  )}
                </div>
              )}
            </div>

            {/* corner actions */}
            <button
              onClick={generateSentence}
              disabled={!selectedFromStore.length || loading}
              className="absolute right-3 h-11 px-5 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/20 disabled:opacity-50 flex items-center gap-2"
              style={{ bottom: expanded ? 16 : 12 }}
            >
              <Sparkles className="w-5 h-5" /> Составить
            </button>
            <button
              onClick={() => speak(rsp?.sentence_tt || '')}
              className="absolute h-11 w-11 rounded-full bg-white/14 ring-1 ring-white/12 flex items-center justify-center"
              style={{ bottom: expanded ? 16 : 12, left: 12 }}
              aria-label="Произнести"
            >
              <Volume2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

// utility class
// tailwind no-scrollbar
// .no-scrollbar::-webkit-scrollbar { display: none; }
