'use client'

import { motion } from 'framer-motion'
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

  const getAnimation = () => {
    switch (position) {
      case 'top':
        return {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
        }
      case 'left':
        return {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
        }
      case 'right':
        return {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
        }
    }
  }

  return (
    <motion.div
      className={`absolute z-50 px-5 py-3 rounded-2xl bg-white/10 ring-1 ring-white/15 text-white text-sm md:text-base backdrop-blur-xl shadow-xl flex items-center gap-3 pointer-events-none ${getPositionClasses()}`}
      initial={getAnimation().initial}
      animate={visible ? getAnimation().animate : getAnimation().exit}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {Icon && (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
          <Icon className="h-4 w-4" />
        </span>
      )}
      {text}
    </motion.div>
  )
}
