import { ImageGallery } from '@/components/gallery/ImageGallery'

export default function GalleryPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Discover your next stay
        </h1>
        <ImageGallery />
      </div>
    </main>
  )
}
