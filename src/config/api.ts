export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://vibetel-backend.duckdns.org'
).replace(/\/+$/, '')

export const API_ENDPOINTS = {
  audio: `${API_BASE_URL}/audio`,
  translate: `${API_BASE_URL}/translate`,
  processImage: `${API_BASE_URL}/process-image`,
  extractObjects: `${API_BASE_URL}/extract-objects`,
  generateSentenceBilingual: `${API_BASE_URL}/generate-sentence-bilingual`,
  generateAlbumMemory: `${API_BASE_URL}/generate-album-memory`,
} as const
