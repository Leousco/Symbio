import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Gauge, HandHeart, Trash2, Waves } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import RiverCleanupGame from '../components/games/RiverCleanupGame'

const rules = [
  {
    icon: Trash2,
    title: 'Collect garbage',
    text: 'Steer the boat close to any floating trash and it is collected automatically. Foam scores 8 pts, bottles 10, cups 12, bags 15, cans 20, and heavy tires 25.',
    tone: 'bg-ocean-100 text-ocean-600',
  },
  {
    icon: Gauge,
    title: 'Avoid obstacles',
    text: 'Rocks, logs, and debris damage the boat. Start with 100% condition — if it reaches zero the run ends early. Collect garbage without crashing to last the full 90 seconds.',
    tone: 'bg-[#fbe6e1] text-[#a8412f] dark:bg-[#3a1c1f] dark:text-[#fca5a5]',
  },
  {
    icon: HandHeart,
    title: 'Rescue animals',
    text: 'Deer, foxes, and rabbits occasionally appear in the water and need help. Approach and press E to rescue each one for a 100-point bonus. Disturbing harmless wildlife costs 25 points.',
    tone: 'bg-leaf-100 text-leaf-700',
  },
]

function RiverCleanup() {
  return (
    <div className="mx-auto w-full max-w-[60rem] space-y-8">
      {/* Back + badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pr-16 sm:pr-0">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-bold text-bark/70 transition hover:text-bark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back home
        </Link>
        <span className="rounded-full border border-hairline/80 bg-surface/60 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-bark/60">
          Mini game 03
        </span>
      </div>

      {/* Header */}
      <header className="grid items-end gap-4 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-ocean-100 px-4 py-1.5 text-sm font-extrabold text-ocean-600">
            <Waves size={15} aria-hidden="true" />
            Play · Environment
          </span>
          <h1 className="mt-3 text-balance text-4xl font-bold leading-tight sm:text-5xl">
            River <span className="text-ocean-600">cleanup.</span>
          </h1>
        </div>
        <p className="max-w-lg text-lg leading-relaxed text-bark/80 lg:pb-1">
          A cleanup boat, a polluted river, and 90 seconds to make a difference. Collect garbage,
          dodge obstacles, and rescue stranded animals before the whistle blows.
        </p>
      </header>

      {/* Game */}
      <RiverCleanupGame />

      {/* Rules */}
      <section aria-labelledby="rules-heading" className="space-y-5">
        <div className="px-2">
          <h2 id="rules-heading" className="text-2xl font-semibold sm:text-3xl">
            How to play
          </h2>
          <p className="mt-1 text-bark/80">
            Three things decide how much river you can clean in 90 seconds.
          </p>
        </div>

        <GlassCard className="grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-hairline/70">
          {rules.map(({ icon: Icon, title, text, tone }) => (
            <div
              key={title}
              className="flex gap-4 sm:flex-col sm:gap-3 sm:px-6 sm:first:pl-0 sm:last:pr-0"
            >
              <span className={`flex size-11 flex-none items-center justify-center rounded-2xl ${tone}`}>
                <Icon size={21} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-bark/75">{text}</p>
              </div>
            </div>
          ))}
        </GlassCard>
      </section>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline/70 pt-6">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-bark/60">
          <Waves size={15} aria-hidden="true" />
          Garbage and obstacles appear faster as time passes.
        </p>
        <Link
          to="/environment"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-bark/20 bg-surface/60 px-5 text-sm font-bold transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
        >
          <Waves size={16} aria-hidden="true" />
          Read about rivers
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export default RiverCleanup