'use client'

import { ImageGallery, ImageDetailController } from '@/components/gallery'

export default function GalleryPage() {
  return (
    <>
      <main className="min-h-screen">
        <div
          className="mx-auto max-w-5xl px-4 pt-12 pb-28"
          style={{
            paddingTop: 'calc(48px + env(safe-area-inset-top, 0px))',
            paddingBottom: 'calc(112px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="flex items-center justify-center">
            <ImageGallery />
          </div>
        </div>
      </main>
      <ImageDetailController />
    </>
  )
}
