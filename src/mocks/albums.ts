import { Album } from '@/types/gallery'

export const mockAlbums: Album[] = [
  {
    id: 1,
    title: 'Prague Adventures',
    images: [
      {
        src: '/mock_images/gallery/cistye-gorodskie-ulicy-pragi.jpg',
        words: [
          { text: 'Building', position: { x: 50, y: 30 } },
          { text: 'Street', position: { x: 70, y: 80 } },
          { text: 'Sky', position: { x: 30, y: 10 } },
        ],
      },
      {
        src: '/mock_images/gallery/zdania-v-starom-gorode-buharesta.jpg',
        words: [
          { text: 'Clock Tower', position: { x: 60, y: 40 } },
          { text: 'Window', position: { x: 25, y: 65 } },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Architectural Marvels',
    images: [
      {
        src: '/mock_images/gallery/pamatnik-nikolau-i-v-sankt-peterburge-rossia.jpg',
        words: [
          { text: 'Statue', position: { x: 50, y: 50 } },
          { text: 'Horse', position: { x: 55, y: 60 } },
          { text: 'Palace', position: { x: 20, y: 30 } },
        ],
      },
      {
        src: '/mock_images/gallery/vertikal-nyi-snimok-pod-nizkim-uglom-zdania-so-spilem-v-rube-francia.jpg',
        words: [
          { text: 'Spire', position: { x: 50, y: 20 } },
          { text: 'Clouds', position: { x: 70, y: 10 } },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Nature Escapes',
    images: [
      {
        src: '/mock_images/gallery/para-pod-bol-sim-uglom-v-pohode.jpg',
        words: [
          { text: 'Mountain', position: { x: 50, y: 40 } },
          { text: 'Backpack', position: { x: 40, y: 70 } },
          { text: 'Couple', position: { x: 60, y: 65 } },
        ],
      },
    ],
  },
]
