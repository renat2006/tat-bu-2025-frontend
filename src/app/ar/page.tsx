'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import Tile from '@/components/ui/Tile'

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

export default function ARPage() {
  const camRef = useRef<Webcam>(null)
  const [processing, setProcessing] = useState(false)
  const [data, setData] = useState<ProcessImageResponse | null>(null)
  const [error, setError] = useState('')

  const captureAndSend = useCallback(async () => {
    if (!camRef.current) return
    const src = camRef.current.getScreenshot()
    if (!src) return
    const res = await fetch(src)
    const blob = await res.blob()
    const file = new File([blob], 'frame.jpg', { type: blob.type })

    const form = new FormData()
    form.append('file', file)
    try {
      setProcessing(true)
      const r = await fetch('https://vibe-tel.ddns.net/process-image', {
        method: 'POST',
        body: form,
      })
      if (!r.ok) throw new Error(`API ${r.status}`)
      const json = (await r.json()) as ProcessImageResponse
      setData(json)
      setError('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setProcessing(false)
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      if (!processing) captureAndSend()
    }, 4000)
    return () => clearInterval(id)
  }, [processing, captureAndSend])

  return (
    <main className="min-h-screen pb-24 pt-4 px-4">
      <Tile size="rect" variant="brand" className="!p-4 col-span-2">
        <div className="flex items-center justify-between w-full">
          <p className="text-ink font-bold">AR режим (beta)</p>
          <button
            className="h-10 px-4 rounded-full bg-ink text-brandGreen font-bold ring-1 ring-black/10"
            onClick={() => captureAndSend()}
          >
            Сканировать кадр
          </button>
        </div>
      </Tile>
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
      {processing && <p className="mt-2 text-white/60">Обработка кадра…</p>}
      {error && <p className="mt-2 text-red-300">Ошибка: {error}</p>}
    </main>
  )
}
