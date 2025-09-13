import { Album } from '@/types/gallery'

export const mockAlbums: Album[] = [
  {
    id: 1,
    title: 'Казан',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center&q=80&auto=format',
        words: [
          { text: 'Кирмән', position: { x: 50, y: 30 } },
          { text: 'Урам', position: { x: 70, y: 80 } },
          { text: 'Турист', position: { x: 30, y: 10 } },
        ],
      },
      {
        src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center&q=80&auto=format',
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
        src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&crop=center&q=80&auto=format',
        words: [
          { text: 'Манара', position: { x: 50, y: 50 } },
          { text: 'Таш йорт', position: { x: 55, y: 60 } },
          { text: 'Борынгы', position: { x: 20, y: 30 } },
        ],
      },
      {
        src: 'https://images.unsplash.com/photo-1506905925346-14bda5d4c4a0?w=800&h=600&fit=crop&crop=center&q=80&auto=format',
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
        src: 'https://images.unsplash.com/photo-1506905925346-14bda5d4c4a0?w=800&h=600&fit=crop&crop=center&q=80&auto=format',
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
        src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&crop=center&q=80&auto=format',
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
        src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center&q=80&auto=format',
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
        src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&crop=center&q=80&auto=format',
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
        src: 'https://images.unsplash.com/photo-1506905925346-14bda5d4c4a0?w=800&h=600&fit=crop&crop=center&q=80&auto=format',
        words: [
          { text: 'Сәгать', position: { x: 50, y: 20 } },
          { text: 'Музей', position: { x: 70, y: 10 } },
          { text: 'Тарих', position: { x: 40, y: 80 } },
        ],
      },
    ],
  },
]
