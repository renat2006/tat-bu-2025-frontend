'use client'
import clsx from 'clsx'
import { colors, type ColorToken } from '@/constants/theme'
import { useMemo } from 'react'

type CardSize = 'square' | 'wide' | 'auto'

type CardProps = {
  size?: CardSize
  color?: ColorToken
  className?: string
  title?: string
  description?: string
  children?: React.ReactNode
}

export default function Card({
  size = 'square',
  color = 'brandGreen',
  className,
  title,
  description,
  children,
}: CardProps) {
  const backgroundColor = colors[color]
  const isGlass = color === 'glassDark'

  const sizeClasses = {
    square: 'aspect-square',
    wide: 'col-span-2 aspect-[2/1]',
    auto: '',
  }[size]

  const radiusClasses = size === 'wide' ? 'rounded-[34px]' : 'rounded-[38px]'

  const maskStyles = useMemo(() => {
    const ratio = size === 'wide' ? 2 : 1
    const W = 100 * ratio
    const H = 100
    const r = size === 'wide' ? 36 : 40
    const n = size === 'wide' ? 4.5 : 4
    const steps = 96
    const pow = (v: number) => Math.pow(Math.abs(v), 2 / n) * Math.sign(v)

    const quarter = (
      cx: number,
      cy: number,
      start: number,
      end: number,
      rx: number,
      ry: number,
    ) => {
      const pts: Array<[number, number]> = []
      for (let i = 0; i <= steps; i++) {
        const t = start + (i / steps) * (end - start)
        const x = cx + rx * pow(Math.cos(t))
        const y = cy + ry * pow(Math.sin(t))
        pts.push([x, y])
      }
      return pts
    }

    const tlStart: [number, number] = [r, 0]
    const trStart: [number, number] = [W - r, 0]
    const brStart: [number, number] = [W, H - r]
    const blStart: [number, number] = [r, H]

    const ptsTopRight = quarter(W - r, r, -Math.PI / 2, 0, r, r)
    const ptsBottomRight = quarter(W - r, H - r, 0, Math.PI / 2, r, r)
    const ptsBottomLeft = quarter(r, H - r, Math.PI / 2, Math.PI, r, r)
    const ptsTopLeft = quarter(r, r, Math.PI, (3 * Math.PI) / 2, r, r)

    const parts: string[] = []
    parts.push(`M ${tlStart[0]} ${tlStart[1]}`)
    parts.push(`L ${trStart[0]} ${trStart[1]}`)
    parts.push(
      `L ${ptsTopRight.map((p) => `${p[0].toFixed(3)} ${p[1].toFixed(3)}`).join(' L ')}`,
    )
    parts.push(`L ${brStart[0]} ${brStart[1]}`)
    parts.push(
      `L ${ptsBottomRight.map((p) => `${p[0].toFixed(3)} ${p[1].toFixed(3)}`).join(' L ')}`,
    )
    parts.push(`L ${blStart[0]} ${blStart[1]}`)
    parts.push(
      `L ${ptsBottomLeft.map((p) => `${p[0].toFixed(3)} ${p[1].toFixed(3)}`).join(' L ')}`,
    )
    parts.push(`L 0 ${r}`)
    parts.push(
      `L ${ptsTopLeft.map((p) => `${p[0].toFixed(3)} ${p[1].toFixed(3)}`).join(' L ')}`,
    )
    parts.push('Z')

    const d = parts.join(' ')
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' preserveAspectRatio='none'><path d='${d}' fill='black'/></svg>`
    const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`

    return {
      WebkitMaskImage: url as unknown as string,
      maskImage: url as unknown as string,
      WebkitMaskSize: '100% 100%',
      maskSize: '100% 100%',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
    } as React.CSSProperties
  }, [size])

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        radiusClasses,
        sizeClasses,
        className,
      )}
      style={{ ...maskStyles }}
    >
      <div
        className={clsx(
          'h-full w-full p-[1px]',
          isGlass ? 'bg-white/10' : 'bg-black/5',
          radiusClasses,
        )}
      >
        <div
          className={clsx(
            'h-full w-full p-6',
            isGlass
              ? 'text-white [backdrop-filter:saturate(160%)_blur(16px)]'
              : 'text-ink',
          )}
          style={{ backgroundColor }}
        >
          {children}
          <div className="flex flex-col justify-between h-full">
            <div />
            <div>
              {title && <h3 className="text-lg font-bold">{title}</h3>}
              {description && <p className="text-sm">{description}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
