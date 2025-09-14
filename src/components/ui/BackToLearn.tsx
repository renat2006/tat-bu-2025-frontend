'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  className?: string
  label?: string
}

export default function BackToLearn({
  className,
  label = 'Назад к обучению',
}: Props) {
  const [targetHref, setTargetHref] = useState('/learn')
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const src = params.get('src')
      if (src === 'continue') setTargetHref('/learn/continue')
      else setTargetHref('/learn')
    } catch {
      setTargetHref('/learn')
    }
  }, [])
  return (
    <Link
      href={targetHref}
      className={
        'inline-flex items-center gap-2 h-11 px-4 rounded-full bg-[rgba(26,27,32,0.75)] ring-1 ring-white/15 text-white backdrop-blur-md hover:bg-[rgba(26,27,32,0.9)] transition-colors ' +
        (className || '')
      }
      aria-label={label}
    >
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/10">
        <ArrowLeft className="w-4 h-4" />
      </span>
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  )
}
