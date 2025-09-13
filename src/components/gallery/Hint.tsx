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
      className={`absolute z-50 px-5 py-3 rounded-2xl bg-white/10 ring-1 ring-white/15 text-white text-sm md:text-base backdrop-blur-xl shadow-xl flex items-center gap-3 pointer-events-none transition-all duration-300 ease-out ${getPositionClasses()} ${getAnimationClasses()}`}
    >
      {Icon && (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
          <Icon className="h-4 w-4" />
        </span>
      )}
      {text}
    </div>
  )
}
