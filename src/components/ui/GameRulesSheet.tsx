type Props = {
  open: boolean
  onClose: () => void
  title: string
  items: string[]
}

export default function GameRulesSheet({ open, onClose, title, items }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50">
      <div className="m-4 p-4 rounded-2xl bg-[rgba(26,27,32,0.95)] ring-1 ring-white/10 text-white w-full">
        <p className="font-bold">{title}</p>
        <ul className="text-white/80 text-sm mt-2 space-y-2 list-disc pl-5">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-3 h-11 w-full rounded-xl bg-ink text-brandGreen font-bold"
        >
          Понятно
        </button>
      </div>
    </div>
  )
}
