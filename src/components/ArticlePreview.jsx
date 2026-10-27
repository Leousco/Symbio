import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

// An open, magazine-style preview (no card box).
// Readers pick one of three sections and the text + big icon change.
function ArticlePreview({ article, flip = false }) {
  const [active, setActive] = useState(0)
  const baseId = useId()

  const step = article.steps[active]
  const StepIcon = step.icon

  return (
    <article
      className={`flex flex-col items-center gap-8 md:gap-12 ${
        flip ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      {/* Visual side */}
      <div
        className={`relative flex aspect-4/3 w-full max-w-md items-center justify-center overflow-hidden rounded-[2.5rem] shadow-xl md:w-5/12 ${article.visual}`}
        aria-hidden="true"
      >
        <StepIcon
          key={step.id}
          size={110}
          strokeWidth={1.25}
          className="animate-pop motion-reduce:animate-none"
        />
        <span className="glass absolute left-4 top-4 rounded-full px-4 py-1.5 text-sm font-bold text-bark">
          {article.topic}
        </span>
        <span className="glass absolute bottom-4 right-4 rounded-full px-4 py-1.5 text-sm font-bold text-bark">
          {step.label}
        </span>
      </div>

      {/* Text side */}
      <div className="w-full md:w-7/12">
        <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-bark/70">
          <span className={`h-2.5 w-2.5 rounded-full ${article.dot}`} aria-hidden="true" />
          {article.topic} · {article.readTime}
        </p>

        <h3 className="mt-2 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
          {article.title}
        </h3>
        <p className="mt-3 text-lg leading-relaxed text-bark/80">{article.lede}</p>

        <div
          role="tablist"
          aria-label={`${article.topic} article sections`}
          className="mt-6 flex flex-wrap gap-2"
        >
          {article.steps.map((s, i) => {
            const Icon = s.icon
            const selected = i === active
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                onClick={() => setActive(i)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${
                  selected ? 'bg-bark text-white' : 'glass hover:bg-white/70'
                }`}
              >
                <Icon size={18} />
                {s.label}
              </button>
            )
          })}
        </div>

        <div
          key={step.id}
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${active}`}
          className="mt-4 min-h-32 animate-pop text-lg leading-relaxed motion-reduce:animate-none"
        >
          {step.text}
        </div>

        <Link
          to={article.to}
          className="group mt-4 inline-flex items-center gap-2 font-bold text-leaf-700 hover:text-leaf-600"
        >
          Explore {article.topic.toLowerCase()}
          <ArrowRight size={18} className="transition group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

export default ArticlePreview