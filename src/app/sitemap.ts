import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://tat-bu-2025-frontend.vercel.app'
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/explore`, lastModified: new Date() },
    { url: `${base}/gallery`, lastModified: new Date() },
    { url: `${base}/learn`, lastModified: new Date() },
    { url: `${base}/learn/continue`, lastModified: new Date() },
    { url: `${base}/learn/match`, lastModified: new Date() },
    { url: `${base}/learn/spell`, lastModified: new Date() },
    { url: `${base}/learn/vocab`, lastModified: new Date() },
    { url: `${base}/profile`, lastModified: new Date() },
    { url: `${base}/profile/appearance`, lastModified: new Date() },
    { url: `${base}/profile/notifications`, lastModified: new Date() },
    { url: `${base}/profile/security`, lastModified: new Date() },
  ]
}
