import clsx from 'clsx'
import Link from 'next/link'
import { ReactNode } from 'react'

type TileVariant = 'brand' | 'glass'

type TileProps = {
  children: ReactNode
  className?: string
  variant?: TileVariant
  size?: 'square' | 'wide' | 'rect'
  right?: ReactNode
  href?: string
}

export default function Tile({
  children,
  className,
  variant = 'brand',
  size = 'square',
  right,
  href,
}: TileProps) {
  const base = 'relative rounded-[28px] overflow-hidden'
  const bg =
    variant === 'brand'
      ? 'bg-[linear-gradient(90deg,#BCFB6C_0%,#A9E85E_100%)] text-ink'
      : '[backdrop-filter:saturate(160%)_blur(14px)] bg-white/5 text-white'
  const pad = 'p-5'
  const sizing =
    size === 'wide'
      ? 'col-span-2 aspect-[2/1]'
      : size === 'rect'
        ? 'col-span-2 h-[112px]'
        : 'aspect-square'

  const inner = (
    <div
      className={clsx(
        'tile-inner h-full w-full flex items-center justify-between',
      )}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {right && <div className="pl-5 shrink-0 flex items-center">{right}</div>}
    </div>
  )

  const classes = clsx(base, bg, pad, sizing, className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  }

  return <div className={classes}>{inner}</div>
}
