import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import InfoModal from './InfoModal'

// Filterable gallery of field-guide entries. Each card opens the post-style
// InfoModal, so the grid itself stays visual and calm.
function FieldGuide({
  id = 'guide',
  kicker = 'Field guide',
  title,
  description,
  items,
  groups,
  accentClass = 'bg-bark text-cream',
}) {
  const [filter, setFilter] = useState('All')
  const [activeId, setActiveId] = useState(null)
  const gridRef = useRef(null)

  const visible = filter === 'All' ? items : items.filter((item) => item.group === filter)
  const position = visible.findIndex((item) => item.id === activeId)
  const active = position >= 0 ? visible[position] : null
  const headingId = `${id}-heading`

  const close = () => {
    const lastId = activeId
    setActiveId(null)
    requestAnimationFrame(() => {
      gridRef.current?.querySelector(`[data-id="${lastId}"]`)?.focus()
    })
  }

  const navigate = (step) => {
    const next = visible[(position + step + visible.length) % visible.length]
    setActiveId(next.id)
  }

  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-24 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 px-2">
        <div>
          <p className="text-sm font-extrabold text-bark/60">{kicker}</p>
          <h2 id={headingId} className="mt-1 text-4xl font-semibold">
            {title}
          </h2>
          <p className="mt-1 max-w-xl text-lg text-bark/80">{description}</p>
        </div>
        <p className="text-sm font-bold text-bark/60">
          {visible.length} {visible.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>

      <div role="group" aria-label="Filter the field guide" className="flex flex-wrap gap-2 px-2">
        {['All', ...groups].map((group) => {
          const selected = filter === group
          return (
            <button
              key={group}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(group)}
              className={`min-h-10 rounded-full px-4 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${
                selected ? accentClass : 'glass text-bark hover:bg-surface/70'
              }`}
            >
              {group}
            </button>
          )
        })}
      </div>

      <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              data-id={item.id}
              onClick={() => setActiveId(item.id)}
              className="group glass flex w-full flex-col overflow-hidden rounded-3xl p-0 text-left transition duration-300 hover:-translate-y-1.5 hover:bg-surface/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              <span
                className={`relative flex h-36 items-center justify-center ${item.visual}`}
                aria-hidden="true"
              >
                <Icon
                  size={56}
                  strokeWidth={1.3}
                  className="transition duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-surface/85 px-3 py-1 text-xs font-extrabold text-bark dark:bg-[#0b0d1c]/80 dark:text-white">
                  {item.group}
                </span>
              </span>
              <span className="flex flex-1 flex-col gap-1.5 p-5">
                <span className="font-heading text-xl font-semibold leading-tight">{item.name}</span>
                <span className="text-sm leading-relaxed text-bark/75">{item.superpower}</span>
                <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-bold text-leaf-700">
                  Open
                  <ArrowUpRight
                    size={16}
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {active && (
        <InfoModal entry={active} items={visible} onClose={close} onNavigate={navigate} />
      )}
    </section>
  )
}

export default FieldGuide
