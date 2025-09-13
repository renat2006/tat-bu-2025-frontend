import { Card } from '@/components/ui'

export default function Home() {
  const cardData = [
    { size: 'square', color: 'brandGreen' },
    { size: 'square', color: 'glassDark' },
    { size: 'wide', color: 'glassDark' },
    { size: 'wide', color: 'brandGreen' },
    { size: 'square', color: 'glassDark' },
    { size: 'square', color: 'brandGreen' },
    { size: 'square', color: 'brandGreen' },
    { size: 'wide', color: 'glassDark' },
    { size: 'square', color: 'glassDark' },
    { size: 'square', color: 'brandGreen' },
  ]

  return (
    <main className="min-h-screen">
      <div className="p-2">
        <section className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-2">
          {cardData.map((card, index) => (
            <Card
              key={index}
              size={card.size as 'square' | 'wide'}
              color={card.color as 'brandGreen' | 'glassDark'}
              className={card.size === 'wide' ? 'col-span-2' : ''}
            />
          ))}
        </section>
      </div>
    </main>
  )
}
