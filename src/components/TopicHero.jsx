import { ArrowDown } from 'lucide-react'

// Shared opener for every topic page.
// Mirrors the home hero: short promise on the left, one big illustrated orb on the right.
const chipPositions = ['-left-3 top-8', '-right-2 top-1/2', 'bottom-6 left-10']

function TopicHero({
  kicker,
  kickerClass = 'bg-leaf-100 text-leaf-700',
  title,
  highlight,
  highlightClass = 'text-leaf-600',
  description,
  icon: Icon,
  orb,
  chips = [],
  primaryLabel = 'Open the field guide',
  secondaryLabel,
  secondaryHref = '#activity',
}) {
  return (
    <section className="grid items-center gap-10 py-4 sm:py-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col items-start gap-5">
        <span className={`rounded-full px-4 py-1.5 text-sm font-extrabold ${kickerClass}`}>
          {kicker}
        </span>
        <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          {title} <span className={highlightClass}>{highlight}</span>
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-bark/80">{description}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#guide"
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-bark px-6 font-bold text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-bark/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
          >
            {primaryLabel}
            <ArrowDown size={18} className="transition group-hover:translate-y-0.5" />
          </a>
          {secondaryLabel && (
            <a
              href={secondaryHref}
              className="inline-flex min-h-12 items-center rounded-full border border-bark/20 bg-surface/60 px-6 font-bold transition hover:bg-surface/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm">
        <div
          className={`absolute inset-0 overflow-hidden rounded-[2.5rem] shadow-xl ${orb}`}
          aria-hidden="true"
        >
          <Icon className="h-full w-full p-12 text-white/80" strokeWidth={0.9} />
        </div>
        {chips.map(({ icon: ChipIcon, label }, i) => (
          <span
            key={label}
            className={`glass absolute ${chipPositions[i % chipPositions.length]} flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm font-bold`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/80 text-bark dark:bg-[#0b0d1c]/80 dark:text-white">
              <ChipIcon size={16} />
            </span>
            {label}
          </span>
        ))}
      </div>
    </section>
  )
}

export default TopicHero
