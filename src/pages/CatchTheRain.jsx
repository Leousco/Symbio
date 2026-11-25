import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, CloudRain, Droplets, HeartPulse, Sprout } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import CatchTheRainGame from '../components/games/CatchTheRainGame'

const rules = [
  {
    icon: Droplets,
    title: 'Catch to heal',
    text: 'Each caught drop adds 4 health and counts as one catch. Your plant grows a little with every catch.',
    tone: 'bg-ocean-100 text-ocean-600',
  },
  {
    icon: HeartPulse,
    title: 'Miss to wilt',
    text: 'A drop that hits the ground costs 8 health. Fill the meter by catching; empty it and the plant dies.',
    tone: 'bg-[#fbe6e1] text-[#a8412f] dark:bg-[#3a1c1f] dark:text-[#fca5a5]',
  },
  {
    icon: CloudRain,
    title: 'Survive the storm',
    text: 'Every 20 seconds the rain gets faster and heavier. See how long you can keep the plant alive.',
    tone: 'bg-leaf-100 text-leaf-700',
  },
]

function CatchTheRain() {
  return (
    <div className="mx-auto w-full max-w-[60rem] space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 pr-16 sm:pr-0">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-bold text-bark/70 transition hover:text-bark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back home
        </Link>
        <span className="rounded-full border border-hairline/80 bg-surface/60 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-bark/60">
          Mini game 01
        </span>
      </div>

      <header className="grid items-end gap-4 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-ocean-100 px-4 py-1.5 text-sm font-extrabold text-ocean-600">
            <CloudRain size={15} aria-hidden="true" />
            Play · Plants
          </span>
          <h1 className="mt-3 text-balance text-4xl font-bold leading-tight sm:text-5xl">
            Catch the <span className="text-ocean-600">rain.</span>
          </h1>
        </div>
        <p className="max-w-lg text-lg leading-relaxed text-bark/80 lg:pb-1">
          A potted plant, a heavy sky, and a very simple job: slide the pot under the falling
          drops. Catch them to heal and grow. Miss too many and the plant withers away.
        </p>
      </header>

      <CatchTheRainGame />

      <section aria-labelledby="rules-heading" className="space-y-5">
        <div className="px-2">
          <h2 id="rules-heading" className="text-2xl font-semibold sm:text-3xl">
            How the garden works
          </h2>
          <p className="mt-1 text-bark/80">Three numbers decide whether the plant makes it.</p>
        </div>

        <GlassCard className="grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-hairline/70">
          {rules.map(({ icon: Icon, title, text, tone }) => (
            <div key={title} className="flex gap-4 sm:flex-col sm:gap-3 sm:px-6 sm:first:pl-0 sm:last:pr-0">
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

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline/70 pt-6">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-bark/60">
          <Clock size={15} aria-hidden="true" />
          Runs last as long as your plant does.
        </p>
        <Link
          to="/plants"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-bark/20 bg-surface/60 px-5 text-sm font-bold transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
        >
          <Sprout size={16} aria-hidden="true" />
          Read about real plants
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export default CatchTheRain
