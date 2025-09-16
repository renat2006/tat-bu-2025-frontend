'use client'

import Image from 'next/image'
import {
  ArrowLeft,
  Languages,
  Sparkles,
  Volume2,
  MoreHorizontal,
  ChevronUp,
  Plus,
  Loader2,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { Album } from '@/types/gallery'
import { useIsAndroid } from '@/hooks/useIsAndroid'
import { loadRuToTtMap } from '@/lib/words'

interface ImageDetailProps {
  data: Album
  onClose: () => void
}

const cardColors = [
  'bg-brand-green/10 text-brand-green ring-brand-green/20',
  'bg-white/10 text-white ring-white/20',
]

export const ImageDetail = ({ data, onClose }: ImageDetailProps) => {
  const [[page, direction], setPage] = useState([0, 0])
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const isAndroid = useIsAndroid()
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [dragOffset, setDragOffset] = useState(0)
  const [genLoading, setGenLoading] = useState(false)
  const [sentenceTT, setSentenceTT] = useState('')
  const [sentenceRU, setSentenceRU] = useState('')
  const [genError, setGenError] = useState<string | null>(null)
  const [usedObjects, setUsedObjects] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [isOverflow, setIsOverflow] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [selected, setSelected] = useState<{
    word: string
    lang: 'ru' | 'tt'
    translation: string
  } | null>(null)
  const [isAddingToVocab, setIsAddingToVocab] = useState(false)
  const [addedToVocab, setAddedToVocab] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selected) {
        const target = e.target as HTMLElement
        const clickedAnchor = target.closest('[data-tooltip-id]')
        const clickedTooltip = target.closest('[role="tooltip"]')
        if (!clickedAnchor && !clickedTooltip) setSelected(null)
      }
    }

    if (selected) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [selected])

  useEffect(() => {
    // Trigger fade-in animation
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // Wait for animation to finish before calling parent onClose
    setTimeout(onClose, 300)
  }

  const paginate = (newDirection: number) => {
    setIsLoading(true)
    setPage([page + newDirection, newDirection])
  }

  const changeImage = (index: number) => {
    if (index === currentIndex) return
    setIsLoading(true)
    const newDirection = index > page ? 1 : -1
    setPage([index, newDirection])
  }

  const currentIndex =
    ((page % data.images.length) + data.images.length) % data.images.length

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStart({ x: clientX, y: 0 }) // y is not used but kept for consistency
    setDragOffset(0)
  }

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragStart) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const offsetX = clientX - dragStart.x
    setDragOffset(offsetX)
  }

  const handleDragEnd = () => {
    if (!dragStart) return

    const threshold = 50
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset < -threshold) paginate(1)
      else if (dragOffset > threshold) paginate(-1)
    }

    setDragStart(null)
    setDragOffset(0)
  }

  const allWordsTT = Array.from(
    new Set(
      (data.images || []).flatMap((img) =>
        (img.words || []).map((w) => w.text),
      ),
    ),
  ).slice(0, 16)

  const allWordsRU = useMemo(() => {
    try {
      const ruToTt = loadRuToTtMap()
      const ttToRu: Record<string, string> = {}
      Object.keys(ruToTt).forEach((ru) => {
        const tt = ruToTt[ru]
        if (tt && !ttToRu[tt]) ttToRu[tt] = ru
      })
      return Array.from(
        new Set(
          allWordsTT.map((tt) => ttToRu[tt]).filter((v): v is string => !!v),
        ),
      ).slice(0, 16)
    } catch {
      return []
    }
  }, [allWordsTT])

  const maps = useMemo(() => {
    const ruToTt = loadRuToTtMap()
    const ttToRu: Record<string, string> = {}
    Object.keys(ruToTt).forEach((ru) => {
      const tt = ruToTt[ru]
      if (tt && !ttToRu[tt]) ttToRu[tt] = ru
    })
    return { ruToTt, ttToRu }
  }, [])

  const generateSentence = async () => {
    const baseObjects = allWordsRU.length
      ? allWordsRU
      : allWordsTT.map((tt) => maps.ttToRu[tt] || tt)
    const objects = baseObjects.slice(0, 16)
    if (!objects.length) return
    try {
      setGenLoading(true)
      setGenError(null)
      const r = await fetch('https://vibe-tel.ddns.net/generate-album-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objects, album_theme: data.title }),
      })
      if (!r.ok) throw new Error('API error')
      const j = (await r.json()) as {
        memory_ru: string
        memory_tt: string
        used_objects?: string[]
      }
      setSentenceTT(j.memory_tt || '')
      setSentenceRU(j.memory_ru || '')
      setUsedObjects(Array.isArray(j.used_objects) ? j.used_objects : [])
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Ошибка генерации')
    } finally {
      setGenLoading(false)
    }
  }

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const check = () => {
      setIsOverflow(el.scrollHeight > el.clientHeight + 2)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [sentenceRU, sentenceTT, expanded])

  const speak = async (text: string) => {
    if (!text || isSpeaking) return
    try {
      setIsSpeaking(true)
      const r = await fetch('https://vibe-tel.ddns.net/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!r.ok) throw new Error('Audio error')
      const { audio_base64 } = (await r.json()) as { audio_base64: string }
      const audio = new Audio(`data:audio/mp3;base64,${audio_base64}`)
      audio.addEventListener('ended', () => setIsSpeaking(false))
      audio.addEventListener('error', () => setIsSpeaking(false))
      await audio.play()
    } catch {
      setIsSpeaking(false)
    }
  }

  const handleWordClick = async (
    lang: 'ru' | 'tt',
    token: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    try {
      ;(e.currentTarget as HTMLButtonElement)?.focus()
    } catch {}
    e.stopPropagation()
    const trimmed = token.trim()
    if (!trimmed) return
    let translation = ''
    if (lang === 'ru') translation = maps.ruToTt[trimmed] || ''
    else translation = maps.ttToRu[trimmed] || ''
    if (!translation) {
      try {
        const r = await fetch('https://vibe-tel.ddns.net/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: trimmed,
            source_language: lang,
            target_language: lang === 'ru' ? 'tt' : 'ru',
          }),
        })
        const j = (await r.json()) as { translated_text?: string }
        translation = j.translated_text || ''
      } catch {}
    }
    setSelected({ word: trimmed, lang, translation })
  }

  const addToVocab = async () => {
    if (!selected || isAddingToVocab) return

    setIsAddingToVocab(true)

    try {
      const ru =
        selected.lang === 'ru' ? selected.word : selected.translation || ''
      const tt =
        selected.lang === 'tt' ? selected.word : selected.translation || ''
      if (!ru) return

      const raw = window.localStorage.getItem('explore-selected-all')
      const arr = raw ? (JSON.parse(raw) as unknown) : []
      const list = Array.isArray(arr) ? (arr as string[]) : []
      if (!list.includes(ru)) list.push(ru)
      window.localStorage.setItem('explore-selected-all', JSON.stringify(list))

      const mapRaw = window.localStorage.getItem('explore-ru-tt')
      const map = mapRaw ? (JSON.parse(mapRaw) as Record<string, string>) : {}
      if (tt) map[ru] = tt
      window.localStorage.setItem('explore-ru-tt', JSON.stringify(map))

      setAddedToVocab(true)

      // Показываем успешное добавление 1.5 секунды, затем закрываем tooltip
      setTimeout(() => {
        setSelected(null)
        setAddedToVocab(false)
        setIsAddingToVocab(false)
      }, 1500)
    } catch (error) {
      setIsAddingToVocab(false)
    }
  }

  const renderText = (text: string, lang: 'ru' | 'tt') => {
    const tokens = text.split(/(\s+)/)
    return tokens.map((t, i) => {
      const isSpace = /\s+/.test(t)
      const isWord = /[A-Za-zА-Яа-яЁё\u0400-\u04FF]/.test(t)
      if (isSpace || !isWord) return <span key={i}>{t}</span>
      const isSel = !!selected && selected.word === t.trim()
      return (
        <button
          key={i}
          data-tooltip-id="word-tooltip"
          onClick={(e) => handleWordClick(lang, t, e)}
          className={
            'inline px-0.5 rounded-md transition ' +
            (isSel ? 'bg-white/20 ring-1 ring-white/30' : 'hover:bg-white/10')
          }
        >
          {t}
        </button>
      )
    })
  }

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-2xl overflow-y-auto transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <header className="fixed top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between text-white z-30">
        <button
          onClick={handleClose}
          className="relative w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center ring-1 ring-white/10 hover:bg-white/20 transition-all duration-200"
        >
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="relative w-full h-[52vh] md:h-[58vh]">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute h-full w-full"
            style={{
              transform: `translateX(${dragOffset}px)`,
              transition: dragOffset === 0 ? 'transform 0.3s ease-out' : 'none',
            }}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <Image
              src={data.images[currentIndex].src}
              alt={data.title}
              fill
              sizes="100vw"
              priority
              loading="eager"
              decoding="async"
              className={`object-cover transition-opacity duration-300 ease-out ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ backgroundColor: 'black' }}
              draggable={false}
              unoptimized={isMobile || isAndroid}
              quality={isMobile ? 75 : 85}
              onLoadingComplete={() => setIsLoading(false)}
            />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/0 pointer-events-none z-10" />

        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end pointer-events-none z-20">
          <div className="text-white pr-8">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight break-words">
              {data.title}
            </h1>
            <p className="text-white/80 mt-1 text-sm md:text-base">
              Рәсем {currentIndex + 1} / {data.images.length}
            </p>
          </div>
        </div>
      </div>

      {data.images.length > 1 && (
        <div className="px-4 md:px-6 pt-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 md:-mx-6 px-4 md:px-6">
            {data.images.map((image, index) => (
              <button
                key={index}
                onClick={() => changeImage(index)}
                className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200"
              >
                <Image
                  src={image.src}
                  alt={`thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  sizes="80px"
                  loading="lazy"
                  decoding="async"
                  className={`object-cover w-full h-full transition-all duration-200 ease-out ${
                    currentIndex === index
                      ? 'ring-2 ring-white scale-105'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                  unoptimized={isMobile || isAndroid}
                  quality={isMobile ? 60 : 70}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative z-10 p-4 md:p-6">
        <div className="text-white">
          <div className="relative rounded-3xl bg-white/10 ring-1 ring-white/10 p-4 pb-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm text-white/80">История альбома</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={generateSentence}
                  disabled={genLoading || !allWordsTT.length}
                  className="h-10 px-4 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/20 disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {genLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Создаём…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Создать
                    </>
                  )}
                </button>
                <button
                  onClick={() => speak(sentenceTT || allWordsTT.join(', '))}
                  className="h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/10 inline-flex items-center justify-center disabled:opacity-60"
                  aria-label="Озвучить"
                  disabled={isSpeaking}
                >
                  {isSpeaking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                {/* убрал иконку сворачивания в хедере */}
              </div>
            </div>
            {genError && (
              <p className="text-xs text-red-300 mb-2">{genError}</p>
            )}
            <div
              ref={contentRef}
              className={
                expanded
                  ? 'space-y-2 relative'
                  : 'space-y-2 max-h-32 md:max-h-48 overflow-hidden relative'
              }
            >
              <p className="text-lg md:text-xl font-bold leading-snug whitespace-pre-wrap">
                {renderText(sentenceTT || '—', 'tt')}
              </p>
              <p className="text-white/80 text-sm whitespace-pre-wrap">
                {renderText(sentenceRU || '—', 'ru')}
              </p>
            </div>
            {!sentenceTT && (
              <p className="mt-2 text-white/60 text-xs">
                Слова:{' '}
                {(usedObjects.length
                  ? usedObjects
                  : allWordsRU.length
                    ? allWordsRU
                    : allWordsTT.map((tt) => maps.ttToRu[tt] || tt)
                ).join(', ')}
              </p>
            )}
            {/* убрал затемнение и плавающую кнопку */}
            <div className="mt-3 flex justify-start">
              {!expanded && isOverflow && (
                <button
                  onClick={() => setExpanded(true)}
                  className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  Читать далее
                </button>
              )}
              {expanded && (
                <button
                  onClick={() => setExpanded(false)}
                  className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
                >
                  <ChevronUp className="h-4 w-4" />
                  Свернуть
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-3 mb-2 text-white">
            <Languages size={20} />
            <h3 className="text-lg font-semibold">Бу истәлектән сүзлек</h3>
          </div>
          <div className="flex flex-wrap gap-3 max-h-36 md:max-h-48 overflow-y-auto pr-2">
            {data.images[currentIndex].words.length > 0 ? (
              data.images[currentIndex].words.map((word, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-full ring-1 transition-all duration-200 hover:scale-105 ${
                    cardColors[index % cardColors.length]
                  }`}
                >
                  <p className="text-base font-medium">{word.text}</p>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-sm">
                Бу рәсемдә сүзләр табылмады.
              </p>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <Tooltip
          id="word-tooltip"
          place="top"
          style={{
            zIndex: 10000,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-brandGreen"></div>
            <div className="text-xs text-white/60 font-medium">
              {selected.lang === 'tt' ? 'Татарский' : 'Русский'}
            </div>
          </div>
          <div className="text-sm text-white font-semibold mb-2">
            {selected.word}
          </div>
          <div className="text-xs text-white/60 mb-1">Перевод</div>
          <div className="text-sm text-white/90 break-words mb-3 leading-relaxed">
            {selected.translation || '—'}
          </div>
          <div className="flex justify-end">
            <button
              onClick={addToVocab}
              disabled={isAddingToVocab}
              className={`h-8 px-3 rounded-lg text-white font-semibold inline-flex items-center gap-1.5 text-xs transition-all duration-300 ${
                addedToVocab
                  ? 'bg-green-500 text-white scale-110'
                  : isAddingToVocab
                    ? 'bg-brandGreen/70 text-ink/70 cursor-not-allowed'
                    : 'bg-brandGreen text-ink hover:bg-brandGreen/90 hover:scale-105 active:scale-95'
              }`}
            >
              {addedToVocab ? (
                <>
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Добавлено!
                </>
              ) : isAddingToVocab ? (
                <>
                  <div className="h-3 w-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                  Добавляем...
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3" />В словарь
                </>
              )}
            </button>
          </div>
        </Tooltip>
      )}
    </div>
  )
}
