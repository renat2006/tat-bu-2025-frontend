'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, Languages } from 'lucide-react'
import { useRef, useState } from 'react'
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

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
}

export const ImageDetail = ({ data, onClose }: ImageDetailProps) => {
  const [[page, direction], setPage] = useState([0, 0])
  const [isLoading, setIsLoading] = useState(true)
  const isAndroid = useIsAndroid()

  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: scrollRef })

  const y = useTransform(scrollY, [0, 100], [0, -50], { clamp: false })
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1])

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

  return (
    <motion.div
      ref={scrollRef}
      className="fixed inset-0 z-[100] bg-black overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
    >
      <header className="fixed top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between text-white z-30">
        <motion.div
          className={
            isAndroid
              ? 'absolute inset-0 bg-black/40'
              : 'absolute inset-0 bg-black/20 backdrop-blur-lg'
          }
          style={{ opacity: headerOpacity }}
        />
        <button
          onClick={onClose}
          className={
            isAndroid
              ? 'relative w-12 h-12 rounded-full bg-black/40 flex items-center justify-center'
              : 'relative w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center'
          }
        >
          <ArrowLeft size={20} />
        </button>
        <motion.span
          style={{ opacity: headerOpacity }}
          className="relative font-semibold"
        >
          {data.title}
        </motion.span>
        <div className="w-12 h-12" />
      </header>

      <div className="relative w-full h-[65vh] md:h-[75vh]">
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={isAndroid ? undefined : variants}
              initial={isAndroid ? false : 'enter'}
              animate={isAndroid ? { opacity: 1, x: 0 } : 'center'}
              exit={isAndroid ? { opacity: 0 } : 'exit'}
              transition={
                isAndroid
                  ? { opacity: { duration: 0.2 } }
                  : {
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }
              }
              className="absolute h-full w-full"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={isAndroid ? 0.5 : 1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x
                if (swipe < -10000) {
                  paginate(1)
                } else if (swipe > 10000) {
                  paginate(-1)
                }
              }}
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
                unoptimized={isAndroid}
                onLoadingComplete={() => setIsLoading(false)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

        <motion.div
          style={{ y }}
          className="absolute inset-0 p-4 md:p-6 pb-28 flex flex-col justify-end pointer-events-none z-20"
        >
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold">{data.title}</h1>
            <p className="text-white/80">
              Рәсем {currentIndex + 1} / {data.images.length}
            </p>
          </div>
        </motion.div>

        {data.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-20">
            <div className="px-4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {data.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => changeImage(index)}
                    className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
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
                      unoptimized={isAndroid}
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
                className={`rounded-3xl p-4 text-white aspect-square flex flex-col justify-center items-center text-center ${
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
    </motion.div>
  )
}
