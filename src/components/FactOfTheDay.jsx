import { useState } from 'react'
import { Lightbulb, RefreshCw } from 'lucide-react'
import GlassCard from './GlassCard'
import { facts } from '../data/home'

const DAY_MS = 86_400_000

function FactOfTheDay() {
  // Starts on a fact that changes once per day
  const [index, setIndex] = useState(() => Math.floor(Date.now() / DAY_MS) % facts.length)
  const [isDaily, setIsDaily] = useState(true)

  const fact = facts[index]

  const showAnother = () => {
    let next = index
    while (next === index) {
      next = Math.floor(Math.random() * facts.length)
    }
    setIndex(next)
    setIsDaily(false)
  }

  return (
    <GlassCard
      as="section"
      id="fact"
      aria-label="Fact of the day"
      className="flex scroll-mt-24 flex-wrap items-center gap-6 sm:p-8"
    >
      <span className="flex h-16 w-16 flex-none items-center justify-center rounded-3xl bg-sun-400 text-bark">
        <Lightbulb size={32} />
      </span>

      <div className="min-w-0 flex-1 basis-72" aria-live="polite">
        <p className="text-sm font-extrabold text-leaf-700">
          {isDaily ? 'Fact of the day' : 'Random fact'} · {fact.topic}
        </p>
        <p className="mt-1 font-heading text-2xl leading-snug sm:text-3xl">{fact.text}</p>
      </div>

      <button
        type="button"
        onClick={showAnother}
        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-bark/20 bg-white/70 px-5 font-bold transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
      >
        <RefreshCw size={18} />
        Show me another
      </button>
    </GlassCard>
  )
}

export default FactOfTheDay