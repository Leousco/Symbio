import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react'

const CLOSE_MS = 170
const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

// The "open a post" dialog: media on the left, the full story on the right.
// Placeholders use the same gradient + icon recipe as ArticlePreview, so real
// photos can replace them later by adding `src`/`alt` to a media entry.
function InfoModal({ entry, items, onClose, onNavigate }) {
  // Track which entry the chosen image belongs to, so switching creature
  // (including prev/next) starts the rail back at the first image.
  const [mediaState, setMediaState] = useState({ id: entry.id, index: 0 })
  const mediaIndex = mediaState.id === entry.id ? mediaState.index : 0
  const [closing, setClosing] = useState(false)
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const titleId = useId()

  // Keep callbacks fresh without re-registering the keyboard listener
  const onCloseRef = useRef(onClose)
  const onNavigateRef = useRef(onNavigate)
  useEffect(() => {
    onCloseRef.current = onClose
    onNavigateRef.current = onNavigate
  })

  const closedRef = useRef(false)
  const close = useCallback(() => {
    if (closedRef.current) return
    closedRef.current = true
    setClosing(true)
    window.setTimeout(() => onCloseRef.current(), CLOSE_MS)
  }, [])

  const position = items.findIndex((item) => item.id === entry.id)
  const media = entry.media?.[mediaIndex] ?? entry.media?.[0]
  const mediaCount = entry.media?.length ?? 0
  const MediaIcon = media?.icon

  // Keyboard: Esc closes, arrows browse the field guide, Tab stays inside
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key === 'ArrowRight' && items.length > 1) {
        event.preventDefault()
        onNavigateRef.current(1)
        return
      }
      if (event.key === 'ArrowLeft' && items.length > 1) {
        event.preventDefault()
        onNavigateRef.current(-1)
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusables = [...panelRef.current.querySelectorAll(FOCUSABLE)]
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [items.length, close])

  // Lock page scroll and move focus into the dialog
  useEffect(() => {
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      root.style.overflow = previousOverflow
    }
  }, [])

  const stepMedia = (step) => {
    setMediaState({
      id: entry.id,
      index: (mediaIndex + step + mediaCount) % mediaCount,
    })
  }

  const previous = position > 0 ? items[position - 1] : items[items.length - 1]
  const next = position < items.length - 1 ? items[position + 1] : items[0]

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-stretch justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-bark/55 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex h-full w-full flex-col overflow-hidden bg-cream shadow-2xl sm:h-[min(88vh,44rem)] sm:max-w-5xl sm:rounded-[2rem] ${
          closing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
      >
        <div className="grid min-h-0 flex-1 grid-rows-[14rem_minmax(0,1fr)] md:grid-cols-[1.05fr_1fr] md:grid-rows-1">
          {/* Media rail */}
          <div className="relative flex min-h-0 flex-col justify-between overflow-hidden">
            <div className={`absolute inset-0 ${media.visual}`} aria-hidden="true" />

            <div className="relative flex items-center justify-between gap-3 p-4">
              <span className="glass rounded-full px-3.5 py-1.5 text-xs font-extrabold text-bark dark:bg-[#0b0d1c]/80 dark:text-white">
                {entry.group}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-bark/80 text-cream transition hover:bg-bark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-8">
              {media.src ? (
                <img
                  key={media.src}
                  src={media.src}
                  alt={media.alt ?? ''}
                  className="h-full w-full animate-pop object-cover motion-reduce:animate-none"
                />
              ) : (
                MediaIcon && (
                  <MediaIcon
                    key={mediaIndex}
                    size={128}
                    strokeWidth={1}
                    className="animate-pop max-h-full motion-reduce:animate-none"
                  />
                )
              )}
            </div>

            <div className="relative flex items-end justify-between gap-3 p-4">
              <span className="glass rounded-full px-4 py-1.5 text-sm font-bold text-bark dark:bg-[#0b0d1c]/80 dark:text-white">
                {media.label}
              </span>
              {mediaCount > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => stepMedia(-1)}
                    aria-label="Previous image"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/80 text-bark transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bark"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs font-bold text-bark/70" aria-live="polite">
                    {mediaIndex + 1} / {mediaCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => stepMedia(1)}
                    aria-label="Next image"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/80 text-bark transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bark"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Story */}
          <div className="min-h-0 overflow-y-auto p-6 sm:p-8">
            <h2 id={titleId} className="font-heading text-3xl font-semibold leading-tight">
              {entry.name}
            </h2>
            <p className="mt-1 text-lg font-bold text-leaf-700">{entry.superpower}</p>

            {entry.stats?.length > 0 && (
              <dl className="mt-5 grid grid-cols-3 gap-2">
                {entry.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-surface/70 px-3 py-2.5">
                    <dt className="text-xs font-bold text-bark/60">{stat.label}</dt>
                    <dd className="mt-0.5 text-sm font-extrabold leading-snug">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {entry.intro && (
              <p className="mt-5 leading-relaxed text-bark/80">{entry.intro}</p>
            )}

            {entry.facts?.length > 0 && (
              <>
                <h3 className="mt-6 font-heading text-xl font-semibold">Fast facts</h3>
                <ul className="mt-2 space-y-2">
                  {entry.facts.map((fact) => (
                    <li key={fact} className="flex gap-2.5 leading-relaxed text-bark/85">
                      <span
                        className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-leaf-500"
                        aria-hidden="true"
                      />
                      {fact}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {entry.sections?.map((section) => (
              <section key={section.heading} className="mt-6">
                <h3 className="font-heading text-xl font-semibold">{section.heading}</h3>
                {Array.isArray(section.body) ? (
                  <ul className="mt-2 space-y-2">
                    {section.body.map((line) => (
                      <li key={line} className="flex gap-2.5 leading-relaxed text-bark/85">
                        <span
                          className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-ocean-500"
                          aria-hidden="true"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 leading-relaxed text-bark/80">{section.body}</p>
                )}
              </section>
            ))}

            {entry.didYouKnow && (
              <p className="mt-6 rounded-2xl border border-hairline/70 bg-surface/70 p-4 leading-relaxed">
                <span className="font-extrabold text-leaf-700">Did you know? </span>
                {entry.didYouKnow}
              </p>
            )}

            {items.length > 1 && (
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-bark/10 pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate(-1)}
                  className="group inline-flex items-center gap-1.5 text-sm font-bold text-bark/70 transition hover:text-bark"
                >
                  <ArrowLeft size={16} className="transition group-hover:-translate-x-0.5" />
                  {previous.name}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(1)}
                  className="group inline-flex items-center gap-1.5 text-sm font-bold text-bark/70 transition hover:text-bark"
                >
                  {next.name}
                  <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default InfoModal
