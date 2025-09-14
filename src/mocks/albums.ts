import { Album } from '@/types/gallery'

export const mockAlbums: Album[] = [
  {
    id: 1,
    title: 'Казан',
    images: [
      {
        src: '/_optimized/mock_images/gallery/kazan/Казань_ Россия.avif',
        words: [
          { text: 'Кирмән', position: { x: 50, y: 30 } },
          { text: 'Урам', position: { x: 70, y: 80 } },
          { text: 'Турист', position: { x: 30, y: 10 } },
        ],
      },
      {
        src: '/_optimized/mock_images/gallery/kazan/мечеть,_казань,_татарстан,_закат,_обои.avif',
        words: [
          { text: 'Һәйкәл', position: { x: 60, y: 40 } },
          { text: 'Ат', position: { x: 25, y: 65 } },
          { text: 'Мәйдан', position: { x: 50, y: 80 } },
        ],
      },
      {
        src: '/_optimized/mock_images/gallery/kazan/d85d3114-356f-5e97-bddb-c5535bc4593b.avif',
        words: [
          { text: 'Манара', position: { x: 60, y: 40 } },
          { text: 'Сәяхәт', position: { x: 25, y: 65 } },
        ],
      },
      {
        src: '/_optimized/mock_images/gallery/kazan/scale_1200 (1).avif',
        words: [{ text: 'Мәчет', position: { x: 50, y: 20 } }],
      },
    ],
  },
  {
    id: 2,
    title: 'Чистай',
    images: [
      {
        src: '/_optimized/mock_images/gallery/chist/caption.avif',
        words: [
          { text: 'Сәгать', position: { x: 48, y: 24 } },
          { text: 'Музей', position: { x: 72, y: 12 } },
        ],
      },
      {
        src: '/_optimized/mock_images/gallery/chist/mechet-nur-.avif',
        words: [
          { text: 'Мәчет', position: { x: 50, y: 22 } },
          { text: 'Мәдәният', position: { x: 28, y: 64 } },
        ],
      },
    ],
  },
]
