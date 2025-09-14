'use client'

import Image from 'next/image'
import { ArrowLeft, Languages, Sparkles, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Album } from '@/types/gallery'
import { useIsAndroid } from '@/hooks/useIsAndroid'

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const generateSentence = async () => {
    if (!allWordsTT.length) return
    try {
      setGenLoading(true)
      setGenError(null)
      const r = await fetch(
        'https://vibe-tel.ddns.net/generate-sentence-bilingual',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            objects: allWordsTT,
            previous_sentences: [],
            context: {
              album_title: data.title,
              images: (data.images || []).map((i) => i.src).slice(0, 8),
            },
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
      setSentenceTT(j.sentence_tt || '')
      setSentenceRU(j.sentence_ru || '')
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Ошибка генерации')
    } finally {
      setGenLoading(false)
    }
  }

  const speak = async (text: string) => {
    if (!text) return
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

      <div className="relative w-full h-[48vh] md:h-[58vh]">
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end pointer-events-none z-20">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {data.title}
            </h1>
            <p className="text-white/80 mt-1">
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
          <div className="rounded-3xl bg-white/10 ring-1 ring-white/10 p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm text-white/80">Җөмлә генерациясе</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={generateSentence}
                  disabled={genLoading || !allWordsTT.length}
                  className="h-10 px-4 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/20 disabled:opacity-60 inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Создать
                </button>
                <button
                  onClick={() => speak(sentenceTT || allWordsTT.join(', '))}
                  className="h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/10 inline-flex items-center justify-center"
                  aria-label="Озвучить"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {genError && (
              <p className="text-xs text-red-300 mb-2">{genError}</p>
            )}
            <div className="space-y-1">
              <p className="text-lg md:text-xl font-bold leading-snug">
                {sentenceTT || '—'}
              </p>
              <p className="text-white/80 text-sm">{sentenceRU || '—'}</p>
            </div>
            {!sentenceTT && (
              <p className="mt-2 text-white/60 text-xs">
                Слова: {allWordsTT.join(', ')}
              </p>
            )}
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
    </div>
  )
}
