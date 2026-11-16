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

  const shuffle = (
    <button
      type="button"
      onClick={showAnother}
      className="inline-flex min-h-11 flex-none items-center gap-2 rounded-full border border-bark/20 bg-white/70 px-4 text-sm font-bold transition-colors hover:border-bark/30 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 sm:min-h-12 sm:px-5 sm:text-base"
    >
      <RefreshCw size={18} />
      Show me another
    </button>
  )

  return (
    <GlassCard
      as="section"
      id="fact"
      aria-label="Fact of the day"
      className="scroll-mt-24 p-6 sm:p-8"
    >
      {/* Mobile: icon and shuffle share the top row so the text slot stays put */}
      <div className="flex items-center justify-between gap-3 md:hidden">
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-sun-400 text-bark">
          <Lightbulb size={24} />
        </span>
        {shuffle}
      </div>

      <div className="mt-4 flex items-center gap-6 md:mt-0">
        <span className="hidden h-16 w-16 flex-none items-center justify-center rounded-3xl bg-sun-400 text-bark md:flex">
          <Lightbulb size={32} />
        </span>

        <div className="min-w-0 flex-1" aria-live="polite">
          <p className="text-sm font-extrabold text-leaf-700">
            {isDaily ? 'Fact of the day' : 'Random fact'} · {fact.topic}
          </p>

          {/* Fixed text slot: four lines on the smallest phones, two on wide screens */}
          <div className="mt-1 flex h-28 items-center min-[360px]:h-22 md:h-26 xl:h-22">
            <p
              key={fact.text}
              className="line-clamp-4 animate-fade-in font-heading text-xl leading-snug motion-reduce:animate-none min-[360px]:line-clamp-3 md:text-2xl xl:line-clamp-2 xl:text-3xl"
            >
              {fact.text}
            </p>
          </div>
        </div>

        <span className="hidden md:block">{shuffle}</span>
      </div>
    </GlassCard>
  )
}

export default FactOfTheDay
