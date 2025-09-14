import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
    ],
    minimumCacheTTL: 60,
  },
  headers: async () => [
    {
      source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/:all*(woff|woff2|ttf|otf|eot)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],
}
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})
export default withBundleAnalyzer(nextConfig)
