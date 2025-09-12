import { memo } from 'react'
import Image from 'next/image'
import { Bed, Share, Star } from 'lucide-react'

interface ImageCardProps {
  data: {
    title: string
    location: string
    price: number
    rating: number
    beds: number
    image: string
  }
  isTop?: boolean
}

const ImageCardComponent = ({ data, isTop = false }: ImageCardProps) => {
  return (
    <div
      className="relative w-full h-full rounded-[48px] overflow-hidden shadow-2xl"
      style={{
        maskImage: `url("data:image/svg+xml,%3csvg width='350' height='480' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M48 0L121 0C141 0 141 24 175 24C209 24 209 0 229 0L302 0A48 48 0 01350 48L350 432A48 48 0 01302 480L48 480A48 48 0 010 432L0 48A48 48 0 0148 0Z' fill='white'/%3e%3c/svg%3e")`,
        WebkitMaskImage: `url("data:image/svg+xml,%3csvg width='350' height='480' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M48 0L121 0C141 0 141 24 175 24C209 24 209 0 229 0L302 0A48 48 0 01350 48L350 432A48 48 0 01302 480L48 480A48 48 0 010 432L0 48A48 48 0 0148 0Z' fill='white'/%3e%3c/svg%3e")`,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
      }}
    >
      <Image
        src={data.image}
        alt={data.title}
        fill
        sizes="(max-width: 640px) 90vw, 480px"
        priority={isTop}
        placeholder="empty"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      <div className="absolute top-0 left-0 right-0 p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-bold">{data.title}</h2>
            <p className="text-white/80">{data.location}</p>
          </div>
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Share size={20} />
            </button>
            <button className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="flex gap-4 items-center bg-black/30 backdrop-blur-md rounded-full p-3">
          <div className="bg-black/50 rounded-full px-4 py-2 text-lg font-semibold">
            ${data.price}
          </div>
          <div className="flex items-center gap-1">
            <Star size={18} className="text-yellow-400" />
            <span>{data.rating}/5</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed size={18} />
            <span>{data.beds} bed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ImageCard = memo(ImageCardComponent)
