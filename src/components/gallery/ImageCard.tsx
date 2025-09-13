'use client'

import { memo, useState } from 'react'
import Image from 'next/image'
import { Album } from '@/types/gallery'
import { ImageIcon } from 'lucide-react'
import { useIsAndroid } from '@/hooks/useIsAndroid'

interface ImageCardProps {
  data: Album
  isTop?: boolean
  preload?: boolean
  onLoaded?: () => void
}

const NOTCH_MASK = `url("data:image/svg+xml,%3csvg width='350' height='480' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M48 0L121 0C141 0 141 24 175 24C209 24 209 0 229 0L302 0A48 48 0 01350 48L350 432A48 48 0 01302 480L48 480A48 48 0 010 432L0 48A48 48 0 0148 0Z' fill='white'/%3e%3c/svg%3e")`

const ImageCardComponent = ({
  data,
  isTop = false,
  preload = false,
  onLoaded,
}: ImageCardProps) => {
  const [loaded, setLoaded] = useState(false)
  const coverImage = data.images[0]
  const isAndroid = useIsAndroid()

  return (
    <div
      className="relative w-full h-full rounded-[48px] overflow-hidden shadow-2xl"
      style={{
        contain: 'layout paint size style',
        maskImage: NOTCH_MASK as unknown as string,
        WebkitMaskImage: NOTCH_MASK as unknown as string,
        maskSize: '100% 100%',
      }}
    >
      <div
        className={`absolute inset-0 bg-neutral-900 ${
          loaded ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300 animate-pulse`}
      />
      {coverImage && (
        <Image
          src={coverImage.src}
          alt={data.title}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 720px, 960px"
          priority={isTop && preload}
          loading={isTop ? 'eager' : 'lazy'}
          decoding="async"
          placeholder="empty"
          className="object-cover"
          draggable={false}
          unoptimized={isAndroid}
          onLoadingComplete={() => {
            setLoaded(true)
            onLoaded?.()
          }}
          onLoad={() => {
            if (!loaded) {
              setLoaded(true)
              onLoaded?.()
            }
          }}
        />
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute top-0 left-0 right-0 p-8 text-white transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-bold">{data.title}</h2>
          </div>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 p-8 text-white transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex gap-4 items-center bg-black/30 backdrop-blur-md rounded-full p-3 w-fit">
          <div className="flex items-center gap-2">
            <ImageIcon size={18} />
            <span>{data.images.length} фото</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ImageCard = memo(ImageCardComponent)
