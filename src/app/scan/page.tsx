'use client'

import { useState, useRef } from 'react'
import Tile from '@/components/ui/Tile'
import { Camera, Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'

type ProcessImageResponse = {
  objects_ru: string[]
  objects_tt: string[]
  sentence_ru: string
  sentence_tt: string
  target_word_ru: string
  target_word_tt: string
  detections: Array<Record<string, unknown>>
}

export default function ScanPage() {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [data, setData] = useState<ProcessImageResponse | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onPick = () => fileInputRef.current?.click()

  const onChangeFile: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setData(null)
    setImageUrl(URL.createObjectURL(file))
    await submit(file)
  }

  const submit = async (file: File) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('https://vibe-tel.ddns.net/process-image', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const json = (await res.json()) as ProcessImageResponse
      setData(json)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pb-24 pt-4 px-4">
      <div className="grid grid-cols-2 gap-2">
        <Tile size="rect" variant="brand" className="!p-6 col-span-2">
          <div className="flex items-center justify-between w-full">
            <div className="min-w-0">
              <h1 className="text-[24px] font-extrabold leading-tight">
                Сканирование
              </h1>
              <p className="text-ink/70 text-sm mt-1 truncate">
                Сфотографируйте объект или загрузите изображение
              </p>
            </div>
            <button
              onClick={onPick}
              className="inline-flex items-center gap-2 h-11 text-white px-5 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/10"
            >
              <Camera className="w-5 h-5" />
              <span>Выбрать</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onChangeFile}
              className="hidden"
            />
          </div>
        </Tile>

        {imageUrl && (
          <Tile size="wide" variant="glass" className="!p-3 col-span-2">
            <div className="relative w-full h-64 rounded-[20px] overflow-hidden">
              <Image
                src={imageUrl}
                alt="preview"
                fill
                className="object-cover"
              />
            </div>
          </Tile>
        )}

        {loading && (
          <Tile size="rect" variant="glass" className="col-span-2">
            <div className="flex items-center justify-center w-full gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Обрабатываем изображение…</span>
            </div>
          </Tile>
        )}

        {error && (
          <Tile size="rect" variant="glass" className="col-span-2">
            <p className="text-red-300">Ошибка: {error}</p>
          </Tile>
        )}

        {data && (
          <>
            <Tile size="rect" variant="brand" className="col-span-2">
              <div>
                <p className="text-sm text-ink/70">Предложение (тат.)</p>
                <p className="text-lg font-extrabold text-ink">
                  {data.sentence_tt}
                </p>
                <p className="text-xs text-ink/60 mt-1">{data.sentence_ru}</p>
              </div>
            </Tile>

            <Tile size="rect" variant="glass" className="col-span-2">
              <div className="flex flex-wrap gap-2">
                {data.objects_tt.map((tt, i) => (
                  <span
                    key={tt + i}
                    className="px-3 py-1 rounded-full bg-white/10 text-white text-sm"
                  >
                    {tt}
                  </span>
                ))}
              </div>
            </Tile>

            <Tile size="rect" variant="glass" className="col-span-2">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5" />
                <button onClick={onPick} className="underline">
                  Загрузить другое изображение
                </button>
              </div>
            </Tile>
          </>
        )}
      </div>
    </main>
  )
}
