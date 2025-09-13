'use client'

import Image from 'next/image'
import { ArrowLeft, Languages } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { Album } from '@/types/gallery'
import { useIsAndroid } from '@/hooks/useIsAndroid'

interface ImageDetailProps {
  data: Album
  onClose: () => void
}

const cardColors = [
  'bg-lime-400/80 text-lime-950',
  'bg-sky-400/80 text-sky-950',
  'bg-amber-400/80 text-amber-950',
  'bg-violet-400/80 text-violet-950',
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragStart({ x: clientX, y: clientY })
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
    const velocity = Math.abs(dragOffset) > threshold

    if (velocity) {
      if (dragOffset < -threshold) {
        paginate(1)
      } else if (dragOffset > threshold) {
        paginate(-1)
      }
    }

    setDragStart(null)
    setDragOffset(0)
  }

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black overflow-y-auto transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <header className="fixed top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between text-white z-30">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isMobile
              ? 'bg-black/60'
              : isAndroid
                ? 'bg-black/40'
                : 'bg-black/20 backdrop-blur-lg'
          }`}
        />
        <button
          onClick={onClose}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isMobile
              ? 'bg-black/60 hover:bg-black/80'
              : isAndroid
                ? 'bg-black/40 hover:bg-black/60'
                : 'bg-black/20 backdrop-blur-md hover:bg-black/40'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <span className="relative font-semibold">{data.title}</span>
        <div className="w-12 h-12" />
      </header>

      <div className="relative w-full h-[65vh] md:h-[75vh]">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute h-full w-full"
            style={{
              transform:
                dragOffset !== 0
                  ? `translateX(${dragOffset}px)`
                  : 'translateX(0)',
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

        <div
          className={`absolute inset-0 pointer-events-none z-10 ${
            isMobile
              ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent'
              : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
          }`}
        />

        <div className="absolute inset-0 p-4 md:p-6 pb-28 flex flex-col justify-end pointer-events-none z-20">
          <div className="text-white">
            <h1
              className={`font-bold ${isMobile ? 'text-3xl' : 'text-5xl md:text-6xl'}`}
            >
              {data.title}
            </h1>
            <p className="text-white/80">
              Рәсем {currentIndex + 1} / {data.images.length}
            </p>
          </div>
        </div>

        {data.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-20">
            <div className="px-4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
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
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      unoptimized={isMobile || isAndroid}
                      quality={isMobile ? 60 : 70}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4 text-white">
          <Languages size={20} />
          <h3 className="text-lg font-semibold">Бу истәлектән сүзлек</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 pb-24">
          {data.images[currentIndex].words.length > 0 ? (
            data.images[currentIndex].words.map((word, index) => (
              <div
                key={index}
                className={`rounded-3xl p-4 text-white aspect-square flex flex-col justify-center items-center text-center transition-all duration-200 hover:scale-105 ${
                  cardColors[index % cardColors.length]
                }`}
              >
                <p className="text-xl font-semibold">{word.text}</p>
              </div>
            ))
          ) : (
            <p className="text-white/60 text-sm col-span-2">
              Бу рәсемдә сүзләр табылмады.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
