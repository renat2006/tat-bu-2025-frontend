'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import Tile from '@/components/ui/Tile'
import Image from 'next/image'
import {
  Camera,
  ImageUp,
  Loader2,
  ChevronsRight,
  RefreshCw,
} from 'lucide-react'

type Detection = {
  bbox?: [number, number, number, number]
  [k: string]: unknown
}

type ProcessImageResponse = {
  objects_ru: string[]
  objects_tt: string[]
  sentence_ru: string
  sentence_tt: string
  target_word_ru: string
  target_word_tt: string
  detections: Detection[]
}

function Bubble({
  x,
  y,
  tt,
  ru,
}: {
  x: number
  y: number
  tt: string
  ru: string
}) {
  return (
    <div
      className="absolute px-3 py-1 rounded-full bg-[rgba(17,18,23,0.8)] text-white text-xs ring-1 ring-white/10"
      style={{ left: x, top: y, transform: 'translate(-50%, -120%)' }}
    >
      <span className="font-bold">{tt}</span>
      <span className="opacity-70 ml-1">({ru})</span>
    </div>
  )
}

export default function ExplorePage() {
  const [mode, setMode] = useState<'live' | 'upload'>('live')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<ProcessImageResponse | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const camRef = useRef<Webcam>(null)

  const unifiedProcess = useCallback(async (file: File) => {
    try {
      setLoading(true)
      setError('')
      setData(null)
      const form = new FormData()
      form.append('file', file)
      const r = await fetch('https://vibe-tel.ddns.net/process-image', {
        method: 'POST',
        body: form,
      })
      if (!r.ok) throw new Error(`API ${r.status}`)
      const json = (await r.json()) as ProcessImageResponse
      setData(json)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }, [])

  const captureLive = useCallback(async () => {
    if (!camRef.current) return
    const src = camRef.current.getScreenshot()
    if (!src) return
    const res = await fetch(src)
    const blob = await res.blob()
    const file = new File([blob], 'frame.jpg', { type: blob.type })
    await unifiedProcess(file)
  }, [unifiedProcess])

  const onPick = () => fileRef.current?.click()

  const onChangeFile: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUrl(URL.createObjectURL(file))
    await unifiedProcess(file)
  }

  useEffect(() => {
    if (mode !== 'live') return
    const id = setInterval(() => {
      if (!loading) captureLive()
    }, 5000)
    return () => clearInterval(id)
  }, [mode, loading, captureLive])

  return (
    <main className="min-h-screen pb-24 pt-4 px-4">
      {/* Header */}
      <Tile size="rect" variant="brand" className="!p-6 col-span-2">
        <div className="flex items-center justify-between w-full gap-3">
          <div>
            <h1 className="text-[24px] font-extrabold leading-tight">
              Explore
            </h1>
            <p className="text-ink/70 text-sm mt-1">
              Сканируйте вокруг или загрузите фото
            </p>
          </div>
          <div className="flex h-11 rounded-full bg-ink text-brandGreen ring-1 ring-black/10 overflow-hidden">
            <button
              onClick={() => setMode('live')}
              className={`px-4 flex items-center gap-2 text-white ${mode === 'live' ? 'bg-black/20' : ''}`}
            >
              <Camera className="w-5 h-5" /> Live
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`px-4 flex items-center gap-2 ${mode === 'upload' ? 'bg-black/20' : ''}`}
            >
              <ImageUp className="w-5 h-5" /> Upload
            </button>
          </div>
        </div>
      </Tile>

      {/* Live or Upload viewport */}
      {mode === 'live' ? (
        <div className="relative mt-3 rounded-[20px] overflow-hidden ring-1 ring-white/10">
          <Webcam
            ref={camRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'environment' }}
            className="w-full h-[60vh] object-cover"
          />
          {data?.detections?.map((d, i) => {
            const bbox = (d as any).bbox as
              | [number, number, number, number]
              | undefined
            if (!bbox) return null
            const [x, y, w, h] = bbox
            const cx = x + w / 2
            const cy = y
            const tt = data.objects_tt[i] ?? ''
            const ru = data.objects_ru[i] ?? ''
            return <Bubble key={i} x={cx} y={cy} tt={tt} ru={ru} />
          })}
        </div>
      ) : (
        <Tile size="wide" variant="glass" className="!p-3 col-span-2 mt-3">
          {imageUrl ? (
            <div className="relative w-full h-64 rounded-[20px] overflow-hidden">
              <Image
                src={imageUrl}
                alt="preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-64 text-white/60">
              Нет изображения
            </div>
          )}
        </Tile>
      )}

      {/* Controls sticky bottom on mobile */}
      <div className="fixed bottom-24 left-0 right-0 px-4">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex gap-2">
            {mode === 'upload' ? (
              <>
                <button
                  onClick={onPick}
                  className="flex-1 h-12 rounded-full bg-ink text-white font-bold ring-1 ring-black/10"
                >
                  Выбрать фото
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onChangeFile}
                  className="hidden"
                />
              </>
            ) : (
              <>
                <button
                  onClick={captureLive}
                  className="flex-1 h-12 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/10 flex items-center justify-center gap-2"
                >
                  Сканировать кадр <ChevronsRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setData(null)}
                  className="h-12 w-12 rounded-full bg-white/10 text-white flex items-center justify-center"
                  aria-label="Очистить"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {loading && (
          <Tile size="rect" variant="glass" className="col-span-2">
            <div className="flex items-center justify-center w-full gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Обработка…</span>
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
          </>
        )}
      </div>
    </main>
  )
}
