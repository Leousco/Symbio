import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

// How long each photo holds before cross-fading to the next.
const HOLD_MS = 4000
const FADE_MS = 700

// Decoded-image cache, shared across remounts. Decoding each JPEG before the
// timer starts is what keeps the cross-fade smooth on slower machines.
const decoded = new Set()

function preloadImage(src) {
  if (decoded.has(src)) return Promise.resolve()
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    const done = () => {
      decoded.add(src)
      resolve()
    }
    img.onload = () => {
      if (img.decode) img.decode().then(done).catch(done)
      else done()
    }
    img.onerror = done
    img.src = src
  })
}

// Auto-advancing photo slideshow for one article section.
// Only the active section's images are mounted, so the page never loads all 27.
function StepSlideshow({ images, activeImageRef }) {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(true)
  const reduce = usePrefersReducedMotion()
  const timer = useRef(null)
  const container = useRef(null)
  const total = images.length

  const next = useCallback(() => setSlide((s) => (s + 1) % total), [total])

  // Only run the slideshow while it is actually on screen.
  useEffect(() => {
    const node = container.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Decode all three photos before showing the slideshow or starting the timer.
  useEffect(() => {
    let cancelled = false
    Promise.all(images.map((image) => preloadImage(image.src))).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [images])

  // Advance only when the images are ready, in view, not paused and motion is allowed.
  useEffect(() => {
    if (!ready || !inView || paused || reduce || total <= 1) return
    timer.current = setInterval(next, HOLD_MS + FADE_MS)
    return () => clearInterval(timer.current)
  }, [ready, inView, paused, reduce, total, next])

  const onEnter = useCallback(() => setPaused(true), [])
  const onLeave = useCallback(() => setPaused(false), [])

  // With reduced motion we stay on the first photo and never rotate.
  const shown = reduce ? 0 : slide

  // Let the parent know which photo is on screen, so a tab change can fade
  // out from exactly that image instead of jumping to the first one.
  useEffect(() => {
    if (activeImageRef) activeImageRef.current = images[shown]
  }, [activeImageRef, images, shown])

  return (
    <div
      ref={container}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative h-full w-full overflow-hidden rounded-2xl"
    >
      {images.map((img, i) => {
        const active = i === shown
        const visible = ready ? active : i === 0
        return (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            draggable="false"
            decoding="async"
            fetchPriority={i === 0 ? 'high' : 'low'}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            className={`pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-opacity ease-in-out ${
              visible ? 'opacity-100' : 'opacity-0'
            } ${active ? 'z-10' : 'z-0'}`}
          />
        )
      })}
    </div>
  )
}

// An open, magazine-style preview (no card box).
// Readers pick one of three sections and the text + photo slideshow change.
function ArticlePreview({ article, flip = false, showLink = true }) {
  const [active, setActive] = useState(0)
  const [outgoing, setOutgoing] = useState(null)
  const [near, setNear] = useState(false)
  const reduce = usePrefersReducedMotion()
  const articleRef = useRef(null)
  const activeImage = useRef(null)
  const outgoingTimer = useRef(null)
  const baseId = useId()

  const step = article.steps[active]
  const images = step.images ?? []

  // Preload the whole article once it is near the viewport, so switching tabs
  // fades between already-decoded photos instead of waiting on the network.
  useEffect(() => {
    const node = articleRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        observer.disconnect()
      },
      { rootMargin: '300px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!near) return
    article.steps.forEach((section) => {
      section.images?.forEach((image) => preloadImage(image.src))
    })
  }, [near, article])

  // Keep the last photo visible for the same 700ms cross-fade as the slideshow.
  const selectStep = (index) => {
    if (index === active) return
    if (!reduce) {
      setOutgoing(activeImage.current ?? step.images?.[0] ?? null)
      window.clearTimeout(outgoingTimer.current)
      outgoingTimer.current = window.setTimeout(() => setOutgoing(null), FADE_MS + 50)
    }
    setActive(index)
  }

  useEffect(() => () => window.clearTimeout(outgoingTimer.current), [])

  return (
    <article
      ref={articleRef}
      className={`flex flex-col items-center gap-8 md:gap-12 ${
        flip ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      {/* Visual side */}
      <div
        className={`relative flex aspect-4/3 w-full max-w-md items-center justify-center overflow-hidden rounded-[2.5rem] shadow-xl md:w-5/12 ${article.visual}`}
      >
        {/* Outgoing photo sits on top for one cross-fade when the tab changes. */}
        {outgoing?.src && (
          <img
            key={outgoing.src}
            src={outgoing.src}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 h-full w-full select-none object-cover"
            style={{ animation: `fade-out ${FADE_MS}ms ease-in-out both` }}
          />
        )}

        <div key={step.id} className="h-full w-full">
          <StepSlideshow images={images} activeImageRef={activeImage} />
        </div>

        <span className="glass pointer-events-none absolute left-4 top-4 z-30 rounded-full px-4 py-1.5 text-sm font-bold text-bark dark:bg-[#0b0d1c]/80 dark:text-white">
          {article.topic}
        </span>
        <span className="glass pointer-events-none absolute bottom-4 right-4 z-30 rounded-full px-4 py-1.5 text-sm font-bold text-bark dark:bg-[#0b0d1c]/80 dark:text-white">
          {step.label}
        </span>
      </div>

      {/* Text side */}
      <div className="w-full md:w-7/12">
        <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-bark/70">
          <span className={`h-2.5 w-2.5 rounded-full ${article.dot}`} aria-hidden="true" />
          {article.topic}
          {article.readTime ? ` · ${article.readTime}` : ''}
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
                onClick={() => selectStep(i)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${
                  selected ? 'bg-bark text-cream' : 'glass hover:bg-surface/70'
                }`}
              >
                {Icon && <Icon size={18} aria-hidden="true" />}
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

        {showLink && (
          <Link
            to={article.to}
            className="group mt-4 inline-flex items-center gap-2 font-bold text-leaf-700 hover:text-leaf-600"
          >
            Explore {article.topic.toLowerCase()}
            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </article>
  )
}

export default ArticlePreview
