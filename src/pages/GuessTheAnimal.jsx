import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lightbulb, PawPrint, Timer } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import GuessTheAnimalGame from '../components/games/GuessTheAnimalGame'

const rules = [
  {
    icon: PawPrint,
    title: 'Spot the silhouette',
    text: 'Each round reveals a black silhouette of an animal. Type your best guess into the input field and use autocomplete to find the right name.',
    tone: 'bg-sun-100 text-sun-500',
  },
  {
    icon: Timer,
    title: 'Beat the clock',
    text: 'You start with 25 seconds per animal — the clock shortens at rounds 8, 12, 16 and 20. Run out of time and you lose a heart. Three hearts, then game over.',
    tone: 'bg-[#fbe6e1] text-[#a8412f] dark:bg-[#3a1c1f] dark:text-[#fca5a5]',
  },
  {
    icon: Lightbulb,
    title: 'Use your hints',
    text: 'Stuck? Hit the hint button for a short clue about the animal. Hints recharge after every three correct answers in a row.',
    tone: 'bg-leaf-100 text-leaf-700',
  },
]

function GuessTheAnimal() {
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
          Mini game 02
        </span>
      </div>

      {/* Header */}
      <header className="grid items-end gap-4 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-sun-100 px-4 py-1.5 text-sm font-extrabold text-sun-500">
            <PawPrint size={15} aria-hidden="true" />
            Play · Animals
          </span>
          <h1 className="mt-3 text-balance text-4xl font-bold leading-tight sm:text-5xl">
            Guess the <span className="text-sun-500">animal.</span>
          </h1>
        </div>
        <p className="max-w-lg text-lg leading-relaxed text-bark/80 lg:pb-1">
          A black silhouette, a ticking clock, and a question: what animal is hiding in the
          shadow? Identify as many as you can before you run out of hearts.
        </p>
      </header>

      {/* Game */}
      <GuessTheAnimalGame />

      {/* Rules */}
      <section aria-labelledby="rules-heading" className="space-y-5">
        <div className="px-2">
          <h2 id="rules-heading" className="text-2xl font-semibold sm:text-3xl">
            How to play
          </h2>
          <p className="mt-1 text-bark/80">Three things decide how long you last.</p>
        </div>

        <GlassCard className="grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-hairline/70">
          {rules.map(({ icon: Icon, title, text, tone }) => (
            <div
              key={title}
              className="flex gap-4 sm:flex-col sm:gap-3 sm:px-6 sm:first:pl-0 sm:last:pr-0"
            >
              <span
                className={`flex size-11 flex-none items-center justify-center rounded-2xl ${tone}`}
              >
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

      {/* Footer link */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline/70 pt-6">
        <p className="text-sm font-bold text-bark/60">
          Animals get rarer and harder to identify as rounds progress.
        </p>
        <Link
          to="/animals"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-bark/20 bg-surface/60 px-5 text-sm font-bold transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
        >
          <PawPrint size={16} aria-hidden="true" />
          Read about real animals
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export default GuessTheAnimal
