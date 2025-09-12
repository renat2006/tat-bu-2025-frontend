'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import type { StaticImageData } from 'next/image'
import {
  ArrowLeft,
  Bookmark,
  Share,
  Star,
  Bed,
  DollarSign,
  Telescope,
  Coffee,
  Leaf,
} from 'lucide-react'
import { useRef } from 'react'

interface ImageDetailProps {
  data: {
    title: string
    location: string
    price: number
    rating: number
    beds: number
    image: string | StaticImageData
  }
  onClose: () => void
}

const detailCards = [
  {
    icon: DollarSign,
    title: '$94/night',
    subtitle: 'Cost',
    color: 'bg-green-400/80 text-green-950',
  },
  {
    icon: Telescope,
    title: 'Mesmerizing',
    subtitle: 'View',
    color: 'bg-white/10 text-white',
  },
  {
    icon: Coffee,
    title: 'Delicious',
    subtitle: 'Breakfast',
    color: 'bg-white/10 text-white',
  },
  {
    icon: Leaf,
    title: 'Eco-friendly',
    subtitle: 'Stay',
    color: 'bg-white/10 text-white',
  },
]

export const ImageDetail = ({ data, onClose }: ImageDetailProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: scrollRef })

  const y = useTransform(scrollY, [0, 100], [0, -50], { clamp: false })
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1])

  return (
    <motion.div
      ref={scrollRef}
      className="fixed inset-0 z-[100] bg-black overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
    >
      <header className="fixed top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between text-white z-20">
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-lg"
          style={{ opacity: headerOpacity }}
        />
        <button
          onClick={onClose}
          className="relative w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <motion.span
          style={{ opacity: headerOpacity }}
          className="relative font-semibold"
        >
          {data.title} Hotel
        </motion.span>
        <div className="flex gap-2 relative">
          <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
            <Share size={20} />
          </button>
          <button className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white">
            <Bookmark size={20} />
          </button>
        </div>
      </header>

      <div className="relative w-full h-[65vh] md:h-[75vh]">
        <Image
          src={data.image}
          alt={data.title}
          fill
          priority
          className="object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <motion.div
        style={{ y }}
        className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end h-[65vh] md:h-[75vh] pointer-events-none"
      >
        <div className="text-white">
          <h1 className="text-5xl md:text-6xl font-bold">{data.title}</h1>
          <p className="text-white/80">{data.location}</p>
        </div>
      </motion.div>

      <div className="relative z-10 p-4 md:p-6 bg-black">
        <div className="flex gap-2 items-center bg-neutral-900/50 rounded-full p-2 text-white text-sm mb-8 w-fit">
          <span className="bg-neutral-800 rounded-full px-3 py-1 font-semibold">
            ${data.price}
          </span>
          <span className="flex items-center gap-1 px-2">
            <Star size={16} className="text-yellow-400" />
            {data.rating}/5
          </span>
          <span className="flex items-center gap-1 px-2">
            <Bed size={16} />
            {data.beds} bed
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-24">
          {detailCards.map((card, index) => (
            <div
              key={index}
              className={`rounded-3xl p-4 ${card.color} backdrop-blur-lg aspect-square flex flex-col justify-between`}
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center mb-2">
                  <card.icon size={20} />
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold">{card.title}</p>
                <p className="opacity-70">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
