'use client'

export function toOptimized(
  src: string,
  preferredExt: 'webp' | 'avif' = 'webp',
) {
  if (!src.startsWith('/mock_images/')) return src
  const dotIndex = src.lastIndexOf('.')
  if (dotIndex === -1) return src
  const base = src.slice(0, dotIndex)
  const folderAdjusted = base.replace(
    '/mock_images/',
    '/_optimized/mock_images/',
  )
  return `${folderAdjusted}.${preferredExt}`
}
