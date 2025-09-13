export interface AlbumImage {
  src: string
  words: { text: string; position: { x: number; y: number } }[]
}

export interface Album {
  id: number
  title: string
  images: AlbumImage[]
}
