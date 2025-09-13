import { Album } from '@/types/gallery'

export const mockAlbums: Album[] = [
  {
    id: 1,
    title: 'Казан',
    images: [
      {
        src: '/mock_images/gallery/cistye-gorodskie-ulicy-pragi.jpg',
        words: [
          { text: 'Кирмән', position: { x: 50, y: 30 } },
          { text: 'Урам', position: { x: 70, y: 80 } },
          { text: 'Турист', position: { x: 30, y: 10 } },
        ],
      },
      {
        src: '/mock_images/gallery/pamatnik-nikolau-i-v-sankt-peterburge-rossia.jpg',
        words: [
          { text: 'Һәйкәл', position: { x: 60, y: 40 } },
          { text: 'Ат', position: { x: 25, y: 65 } },
          { text: 'Мәйдан', position: { x: 50, y: 80 } },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Алабуга',
    images: [
      {
        src: '/mock_images/gallery/zdania-v-starom-gorode-buharesta.jpg',
        words: [
          { text: 'Манара', position: { x: 50, y: 50 } },
          { text: 'Таш йорт', position: { x: 55, y: 60 } },
          { text: 'Борынгы', position: { x: 20, y: 30 } },
        ],
      },
      {
        src: '/mock_images/gallery/vertikal-nyi-snimok-pod-nizkim-uglom-zdania-so-spilem-v-rube-francia.jpg',
        words: [
          { text: 'Чиркәү', position: { x: 50, y: 20 } },
          { text: 'Гөмбәз', position: { x: 70, y: 10 } },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Татарстан табигате',
    images: [
      {
        src: '/mock_images/gallery/para-pod-bol-sim-uglom-v-pohode.jpg',
        words: [
          { text: 'Тау', position: { x: 50, y: 40 } },
          { text: 'Сәяхәт', position: { x: 40, y: 70 } },
          { text: 'Елга', position: { x: 60, y: 65 } },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Яр Чаллы',
    images: [
      {
        src: '/mock_images/gallery/pamatnik-nikolau-i-v-sankt-peterburge-rossia.jpg',
        words: [
          { text: 'Проспект', position: { x: 50, y: 40 } },
          { text: 'КАМАЗ', position: { x: 40, y: 70 } },
          { text: 'Завод', position: { x: 60, y: 65 } },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Әлмәт',
    images: [
      {
        src: '/mock_images/gallery/cistye-gorodskie-ulicy-pragi.jpg',
        words: [
          { text: 'Нефть', position: { x: 50, y: 30 } },
          { text: 'Каскад', position: { x: 70, y: 80 } },
          { text: 'Скульптура', position: { x: 30, y: 10 } },
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'Түбән Кама',
    images: [
      {
        src: '/mock_images/gallery/zdania-v-starom-gorode-buharesta.jpg',
        words: [
          { text: 'Химия', position: { x: 50, y: 50 } },
          { text: 'Парк', position: { x: 55, y: 60 } },
          { text: 'Елга', position: { x: 20, y: 30 } },
        ],
      },
    ],
  },
  {
    id: 7,
    title: 'Чистай',
    images: [
      {
        src: '/mock_images/gallery/vertikal-nyi-snimok-pod-nizkim-uglom-zdania-so-spilem-v-rube-francia.jpg',
        words: [
          { text: 'Сәгать', position: { x: 50, y: 20 } },
          { text: 'Музей', position: { x: 70, y: 10 } },
          { text: 'Тарих', position: { x: 40, y: 80 } },
        ],
      },
    ],
  },
]
