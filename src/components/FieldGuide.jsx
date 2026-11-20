import { useRef, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import InfoModal from './InfoModal'

const photoRotationKey = 'symbio:card-photos'

// Pick a photo for a card and remember the choice, so the next page load moves
// on to a different shot instead of occasionally repeating the same one.
function pickCardPhoto(item, key) {
  const photos = (item.media ?? []).filter((media) => media.src)
  if (photos.length === 0) return null
  if (photos.length === 1) return photos[0]

  let index = Math.floor(Math.random() * photos.length)
  try {
    const saved = JSON.parse(window.localStorage.getItem(photoRotationKey) ?? '{}')
    const last = saved[key]
    if (Number.isInteger(last)) {
      // Step by anything except 0, so the same shot never follows itself.
      const step = 1 + Math.floor(Math.random() * (photos.length - 1))
      index = (last + step) % photos.length
    }
    saved[key] = index
    window.localStorage.setItem(photoRotationKey, JSON.stringify(saved))
  } catch {
    // Storage can be unavailable (private mode); the random pick above stands in.
  }
  return photos[index]
}

// Filterable gallery of field-guide entries. Each card opens the post-style
// InfoModal, so the grid itself stays visual and calm. Set `pageSize` to split
// long guides into pages; groups that fit on one page keep the plain grid.
function FieldGuide({
  id = 'guide',
  kicker = 'Field guide',
  title,
  description,
  items,
  groups,
  accentClass = 'bg-bark text-cream',
  pageSize = 0,
  randomCardPhoto = false,
}) {
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [activeId, setActiveId] = useState(null)
  const gridRef = useRef(null)

  // Pick one photo per card, once per mount, so the grid keeps the same photo
  // while paging or filtering but greets each visit with a different shot.
  const [cardPhotos] = useState(() => {
    if (!randomCardPhoto) return {}
    const picks = {}
    items.forEach((item) => {
      const photo = pickCardPhoto(item, `${title ?? id}:${item.id}`)
      if (photo) picks[item.id] = photo
    })
    return picks
  })

  const visible = filter === 'All' ? items : items.filter((item) => item.group === filter)
  const position = visible.findIndex((item) => item.id === activeId)
  const active = position >= 0 ? visible[position] : null
  const headingId = `${id}-heading`

  const paged = pageSize > 0
  const pageCount = paged ? Math.max(1, Math.ceil(visible.length / pageSize)) : 1
  const currentPage = Math.min(page, pageCount)
  const start = paged ? (currentPage - 1) * pageSize : 0
  const shown = paged ? visible.slice(start, start + pageSize) : visible
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  const close = () => {
    const lastId = activeId
    setActiveId(null)
    requestAnimationFrame(() => {
      gridRef.current?.querySelector(`[data-id="${lastId}"]`)?.focus()
    })
  }

  const goToPage = (nextPage) => {
    setPage(nextPage)
    requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gridRef.current?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }

  const navigate = (step) => {
    const nextPosition = (position + step + visible.length) % visible.length
    const next = visible[nextPosition]
    // Keep the grid on the page of the entry being opened, so closing the
    // dialog returns focus to a card that is actually rendered.
    if (paged) setPage(Math.floor(nextPosition / pageSize) + 1)
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
              onClick={() => {
                setFilter(group)
                setPage(1)
              }}
              className={`min-h-10 rounded-full px-4 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${
                selected ? accentClass : 'glass text-bark hover:bg-surface/70'
              }`}
            >
              {group}
            </button>
          )
        })}
      </div>

      <div
        ref={gridRef}
        key={paged ? `${filter}-${currentPage}` : filter}
        className="grid scroll-mt-28 gap-5 motion-safe:animate-rise sm:grid-cols-2 lg:grid-cols-3"
      >
        {shown.map((item) => {
          const Icon = item.icon
          const photo = cardPhotos[item.id]
          return (
            <button
              key={item.id}
              type="button"
              data-id={item.id}
              onClick={() => setActiveId(item.id)}
              className="group glass flex w-full flex-col overflow-hidden rounded-3xl p-0 text-left transition duration-300 hover:-translate-y-1.5 hover:bg-surface/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              <span
                className={`relative flex h-36 items-center justify-center overflow-hidden ${item.visual}`}
                aria-hidden="true"
              >
                {/* The icon sits underneath the photo, so a slow or missing
                    image still leaves a card that reads at a glance. */}
                <Icon
                  size={56}
                  strokeWidth={1.3}
                  className="transition duration-500 group-hover:scale-110"
                />
                {photo && (
                  <img
                    src={photo.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                    style={{ objectPosition: photo.objectPosition ?? 'center' }}
                    className="absolute inset-0 h-full w-full select-none object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
                <span className="absolute left-3 top-3 z-10 rounded-full bg-surface/85 px-3 py-1 text-xs font-extrabold text-bark dark:bg-[#0b0d1c]/80 dark:text-white">
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

      {paged && pageCount > 1 && (
        <nav
          aria-label={`${title} pages`}
          className="flex flex-col items-center justify-between gap-4 px-2 pt-2 sm:flex-row"
        >
          <p className="text-sm font-bold text-bark/60" aria-live="polite">
            Showing {start + 1}–{Math.min(start + pageSize, visible.length)} of {visible.length}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-bark transition hover:bg-surface/70 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              <ChevronLeft size={18} />
            </button>

            {pages.map((pageNumber) => {
              const selected = pageNumber === currentPage
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => goToPage(pageNumber)}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={selected ? 'page' : undefined}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-extrabold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${
                    selected ? accentClass : 'glass text-bark hover:bg-surface/70'
                  }`}
                >
                  {pageNumber}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              aria-label="Next page"
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-bark transition hover:bg-surface/70 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </nav>
      )}

      {active && (
        <InfoModal entry={active} items={visible} onClose={close} onNavigate={navigate} />
      )}
    </section>
  )
}

export default FieldGuide
