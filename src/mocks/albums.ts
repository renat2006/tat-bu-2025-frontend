import { Album } from '@/types/gallery'

export const mockAlbums: Album[] = [
  {
    id: 1,
    title: 'Казан',
    images: [
      {
        src: '/mock_images/gallery/kazan/Казань_ Россия.jpg',
        words: [
          { text: 'Кирмән', position: { x: 50, y: 30 } },
          { text: 'Урам', position: { x: 70, y: 80 } },
          { text: 'Турист', position: { x: 30, y: 10 } },
        ],
      },
      {
        src: '/mock_images/gallery/kazan/мечеть,_казань,_татарстан,_закат,_обои.jpg',
        words: [
          { text: 'Һәйкәл', position: { x: 60, y: 40 } },
          { text: 'Ат', position: { x: 25, y: 65 } },
          { text: 'Мәйдан', position: { x: 50, y: 80 } },
        ],
      },
      {
        src: '/mock_images/gallery/kazan/d85d3114-356f-5e97-bddb-c5535bc4593b.jpeg',
        words: [
          { text: 'Манара', position: { x: 60, y: 40 } },
          { text: 'Сәяхәт', position: { x: 25, y: 65 } },
        ],
      },
      {
        src: '/mock_images/gallery/kazan/scale_1200 (1).jpeg',
        words: [{ text: 'Мәчет', position: { x: 50, y: 20 } }],
      },
    ],
  },
  {
    id: 2,
    title: 'Алабуга',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1543349689-31f7c8d9fb44?w=1200&h=900&fit=crop&crop=center&q=80&auto=format',
        words: [
          { text: 'Манара', position: { x: 50, y: 50 } },
          { text: 'Таш йорт', position: { x: 55, y: 60 } },
          { text: 'Борынгы', position: { x: 20, y: 30 } },
        ],
      },
      {
        src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=900&fit=crop&crop=center&q=80&auto=format',
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
        src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=900&fit=crop&crop=center&q=80&auto=format',
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
        src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=900&fit=crop&crop=center&q=80&auto=format',
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
        src: 'https://images.unsplash.com/photo-1535086181675-4d06b1f3c3c1?w=1200&h=900&fit=crop&crop=center&q=80&auto=format',
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
        src: 'https://images.unsplash.com/photo-1529927066849-6f67c8f2cc02?w=1200&h=900&fit=crop&crop=center&q=80&auto=format',
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
        src: 'https://images.unsplash.com/photo-1508057198894-247b23fea5e3?w=1200&h=900&fit=crop&crop=center&q=80&auto=format',
        words: [
          { text: 'Сәгать', position: { x: 50, y: 20 } },
          { text: 'Музей', position: { x: 70, y: 10 } },
          { text: 'Тарих', position: { x: 40, y: 80 } },
        ],
      },
    ],
  },
]
