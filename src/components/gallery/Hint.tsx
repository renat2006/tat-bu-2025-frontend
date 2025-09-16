'use client'

import { LucideIcon } from 'lucide-react'

interface HintProps {
  position: 'left' | 'right' | 'top'
  text: string
  icon?: LucideIcon
  visible: boolean
}

export const Hint = ({ position, text, icon: Icon, visible }: HintProps) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-6 left-1/2 -translate-x-1/2'
      case 'left':
        return 'top-1/2 -translate-y-1/2 left-8'
      case 'right':
        return 'top-1/2 -translate-y-1/2 right-8'
      default:
        return ''
    }
  }

  const getAnimationClasses = () => {
    switch (position) {
      case 'top':
        return visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-5'
      case 'left':
        return visible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-5'
      case 'right':
        return visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
      default:
        return visible ? 'opacity-100' : 'opacity-0'
    }
  }

  if (!visible) return null

  return (
    <div
      className={`absolute z-50 px-4 py-2 rounded-xl bg-[rgba(17,18,23,0.75)] ring-1 ring-white/10 text-white text-xs md:text-sm backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.45)] flex items-center gap-2 pointer-events-none transition-all duration-300 ease-out ${getPositionClasses()} ${getAnimationClasses()}`}
    >
      {Icon && (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 flex-shrink-0">
          <Icon className="h-3.5 w-3.5" />
        </span>
      )}
      <span className="max-w-[70vw] md:max-w-none leading-snug">{text}</span>
    </div>
  )
}
