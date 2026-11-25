import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeftRight,
  Clock,
  CloudRain,
  Droplet,
  Hand,
  HeartPulse,
  Keyboard,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import CatchTheRainEngine, { START_HEALTH } from './catchTheRainEngine'
import useIsDark from '../../hooks/useIsDark'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

const BEST_KEY = 'symbio-catch-rain-best'

function readBest() {
  if (typeof window === 'undefined') return 0
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(total / 60)
  return `${minutes}:${String(total % 60).padStart(2, '0')}`
}

function healthFill(health) {
  if (health > 55) return 'linear-gradient(90deg, #86efac, #22c55e)'
  if (health > 30) return 'linear-gradient(90deg, #fde047, #f59e0b)'
  return 'linear-gradient(90deg, #fca5a5, #ef4444)'
}

function CatchTheRainGame() {
  const engineRef = useRef(null)
  const [phase, setPhase] = useState('ready')
  const [hud, setHud] = useState({
    score: 0,
    missed: 0,
    health: START_HEALTH,
    elapsed: 0,
    level: 1,
  })
  const [result, setResult] = useState(null)
  const [best, setBest] = useState(readBest)
  const [banner, setBanner] = useState(null)
  const [countdown, setCountdown] = useState(0)

  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const inputRef = useRef({ left: false, right: false, pointerX: null })
  const draggingRef = useRef(false)
  const bannerTimer = useRef(null)
  const bestRef = useRef(best)
  const phaseRef = useRef('ready')

  const dark = useIsDark()
  const reduceMotion = usePrefersReducedMotion()
  const drawOptions = useRef({ dark, reduceMotion })

  useEffect(() => {
    drawOptions.current = { dark, reduceMotion }
  }, [dark, reduceMotion])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const focusCanvas = useCallback(() => {
    canvasRef.current?.focus({ preventScroll: true })
  }, [])

  const startGame = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return
    engine.start()
    draggingRef.current = false
    inputRef.current.pointerX = null
    window.clearTimeout(bannerTimer.current)
    setBanner(null)
    setResult(null)
    setCountdown(0)
    setHud({ score: 0, missed: 0, health: engine.health, elapsed: 0, level: 1 })
    setPhase('playing')
    focusCanvas()
  }, [focusCanvas])

  const pauseGame = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return
    engine.pause()
    if (engine.state === 'paused') {
      draggingRef.current = false
      inputRef.current.pointerX = null
      inputRef.current.left = false
      inputRef.current.right = false
      setPhase('paused')
    }
  }, [])

  const beginCountdown = useCallback(() => {
    const engine = engineRef.current
    if (!engine || engine.state !== 'paused' || phaseRef.current !== 'paused') return
    setCountdown(3)
    setPhase('countdown')
  }, [])

  // Resume with a countdown so the player can get their hands back on the
  // controls before the rain starts falling again.
  useEffect(() => {
    if (phase !== 'countdown') return undefined
    const engine = engineRef.current
    if (!engine) return undefined

    const id = window.setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1)
      } else {
        engine.resume()
        setPhase('playing')
        focusCanvas()
      }
    }, 1000)

    return () => window.clearTimeout(id)
  }, [phase, countdown, focusCanvas])

  // The engine is a plain mutable simulation object. It is created after the
  // first render and only touched from effects and event handlers.
  useEffect(() => {
    if (!engineRef.current) engineRef.current = new CatchTheRainEngine()
  }, [])

  // Engine events are the only source of truth for score/health changes.
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return undefined

    engine.onEvent = (event) => {
      if (event.type === 'catch' || event.type === 'miss') {
        setHud((current) => ({
          ...current,
          score: event.score,
          health: event.health,
          missed: event.missed,
          elapsed: event.elapsed,
        }))
      } else if (event.type === 'level') {
        setHud((current) => ({ ...current, level: event.level }))
        setBanner({ level: event.level, id: Date.now() })
        window.clearTimeout(bannerTimer.current)
        bannerTimer.current = window.setTimeout(() => setBanner(null), 2400)
      } else if (event.type === 'gameover') {
        const newBest = event.score > bestRef.current
        if (newBest) {
          bestRef.current = event.score
          setBest(event.score)
          try {
            window.localStorage.setItem(BEST_KEY, String(event.score))
          } catch {
            // Private mode can block storage; the run still ends normally.
          }
        }
        setHud((current) => ({
          ...current,
          health: 0,
          score: event.score,
          missed: event.missed,
          elapsed: event.elapsed,
          level: event.level,
        }))
        setResult({
          score: event.score,
          missed: event.missed,
          elapsed: event.elapsed,
          level: event.level,
          newBest,
        })
        setBanner(null)
        setPhase('over')
      }
    }

    return () => {
      engine.onEvent = null
    }
  }, [])

  // Resize the backing store for the current pixel density. The engine works
  // in CSS pixels; the canvas transform handles the rest.
  useEffect(() => {
    const engine = engineRef.current
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!engine || !canvas || !wrap) return undefined

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      const context = canvas.getContext('2d')
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      engine.setSize(rect.width, rect.height)
    }

    resize()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', resize)
      return () => window.removeEventListener('resize', resize)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [])

  // One animation loop for the whole game page.
  useEffect(() => {
    const engine = engineRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!engine || !canvas || !context) return undefined

    let frame = 0
    let last = performance.now()

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      engine.update(dt, inputRef.current)
      engine.draw(context, drawOptions.current)
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  // The HUD timer only needs a few updates per second.
  useEffect(() => {
    const engine = engineRef.current
    if (!engine || phase !== 'playing') return undefined
    const id = window.setInterval(() => {
      setHud((current) => ({ ...current, elapsed: engine.elapsed }))
    }, 200)
    return () => window.clearInterval(id)
  }, [phase])

  // Keyboard controls: arrows or A/D to move, P/Esc to pause.
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return undefined

    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const key = event.key.toLowerCase()

      if (key === 'arrowleft' || key === 'a') {
        inputRef.current.left = true
        if (engine.state === 'running') event.preventDefault()
      } else if (key === 'arrowright' || key === 'd') {
        inputRef.current.right = true
        if (engine.state === 'running') event.preventDefault()
      } else if (key === 'p' || key === 'escape') {
        if (engine.state === 'running') {
          event.preventDefault()
          pauseGame()
        } else if (engine.state === 'paused') {
          event.preventDefault()
          beginCountdown()
        }
      }
    }

    const onKeyUp = (event) => {
      const key = event.key.toLowerCase()
      if (key === 'arrowleft' || key === 'a') inputRef.current.left = false
      if (key === 'arrowright' || key === 'd') inputRef.current.right = false
    }

    const clearKeys = () => {
      inputRef.current.left = false
      inputRef.current.right = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', clearKeys)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', clearKeys)
    }
  }, [pauseGame, beginCountdown])

  // Pause when the tab is hidden so a run cannot end while nobody is looking.
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return undefined
    const onVisibility = () => {
      if (document.hidden && engine.state === 'running') pauseGame()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [pauseGame])

  useEffect(() => () => window.clearTimeout(bannerTimer.current), [])

  const pointerX = (event) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return null
    return event.clientX - rect.left
  }

  const handlePointerDown = (event) => {
    const engine = engineRef.current
    if (!engine || engine.state !== 'running') return
    draggingRef.current = true
    inputRef.current.pointerX = pointerX(event)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    focusCanvas()
  }

  const handlePointerMove = (event) => {
    const engine = engineRef.current
    if (!engine || !draggingRef.current || engine.state !== 'running') return
    inputRef.current.pointerX = pointerX(event)
  }

  const handlePointerEnd = (event) => {
    draggingRef.current = false
    inputRef.current.pointerX = null
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const health = Math.round(hud.health)
  const lowHealth = hud.health <= 30

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <div
        ref={wrapRef}
        className="relative aspect-4/5 w-full select-none overflow-hidden rounded-[2rem] border border-white/25 bg-[#0b1020] shadow-2xl sm:aspect-video"
      >
        <canvas
          ref={canvasRef}
          tabIndex={0}
          aria-label="Catch the Rain. Use the left and right arrow keys or A and D to move the potted plant, or drag across the scene. Catching drops heals the plant; missed drops drain its health."
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className="absolute inset-0 h-full w-full touch-none outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sky-300/80"
        />

        {/* HUD */}
        <div
          className={`pointer-events-none absolute inset-0 flex flex-col justify-between p-3 transition-opacity duration-300 sm:p-5 ${
            phase === 'ready' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col items-start gap-2">
              <span className="glass-dark inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-white">
                <Clock size={15} className="text-sun-400" aria-hidden="true" />
                <span className="font-heading text-base font-semibold leading-none tabular-nums">
                  {formatTime(hud.elapsed)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0b0d1c]/50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                <CloudRain size={12} className="text-sky-300" aria-hidden="true" />
                Level {hud.level}
              </span>
            </div>

            <div className="glass-dark inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-white">
              <Droplet size={16} className="text-sky-300" aria-hidden="true" />
              <span
                key={hud.score}
                className="animate-pop font-heading text-lg font-semibold leading-none tabular-nums motion-reduce:animate-none"
              >
                {hud.score}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/55">
                caught
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div
              className={`glass-dark rounded-2xl px-3.5 py-2.5 text-white transition-shadow ${
                lowHealth ? 'ring-1 ring-[#fca5a5]/70' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <HeartPulse
                    size={13}
                    className={lowHealth ? 'text-[#fca5a5]' : 'text-leaf-200'}
                    aria-hidden="true"
                  />
                  Health
                </span>
                <span className="tabular-nums text-white/85">{health}%</span>
              </div>
              <div className="mt-1.5 h-2.5 w-32 overflow-hidden rounded-full bg-black/40 sm:w-44">
                <div
                  className="h-full rounded-full transition-[width] duration-300 ease-out"
                  style={{ width: `${hud.health}%`, background: healthFill(hud.health) }}
                />
              </div>
            </div>

            <span
              className={`glass-dark hidden items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-bold text-white/70 transition-opacity duration-500 sm:inline-flex ${
                hud.elapsed < 6 && phase === 'playing' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Drag or use ← →
            </span>
          </div>
        </div>

        {/* Level-up toast */}
        {banner && (
          <div
            key={banner.id}
            className="pointer-events-none absolute left-1/2 top-20 z-10 -translate-x-1/2 animate-pop motion-reduce:animate-none sm:top-24"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/30 bg-[#07101f]/75 px-4 py-2 text-sm font-extrabold text-white shadow-lg backdrop-blur-sm">
              <CloudRain size={16} className="text-sky-300" aria-hidden="true" />
              Level {banner.level}
              <span className="font-bold text-white/55">heavier rain</span>
            </span>
          </div>
        )}

        {/* Ready screen */}
        {phase === 'ready' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#08111f]/40 p-3 backdrop-blur-[2px] sm:p-5">
            <div className="glass-dark max-h-full w-full max-w-md overflow-y-auto rounded-3xl p-4 text-white scrollbar-soft sm:p-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-400/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sky-200">
                <CloudRain size={13} aria-hidden="true" />
                Mini game · Plants
              </span>
              <h2 className="mt-3 font-heading text-2xl font-semibold sm:text-3xl">
                Catch the rain
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Slide the potted plant beneath the falling drops. Every catch heals it and helps
                it grow.
              </p>

              <div className="mt-3 grid gap-2 text-sm sm:mt-4">
                <p className="flex items-center gap-2.5 text-white/85">
                  <span className="flex size-8 flex-none items-center justify-center rounded-full bg-white/10">
                    <ArrowLeftRight size={16} aria-hidden="true" />
                  </span>
                  Use ← → or A / D
                </p>
                <p className="flex items-center gap-2.5 text-white/85">
                  <span className="flex size-8 flex-none items-center justify-center rounded-full bg-white/10">
                    <Hand size={16} aria-hidden="true" />
                  </span>
                  Or drag anywhere in the scene
                </p>
              </div>

              <p className="mt-3 rounded-2xl bg-white/5 px-3 py-2.5 text-xs leading-relaxed text-white/60 sm:mt-4">
                A missed drop costs 8 health. Every 20 seconds the rain falls faster and thicker,
                so keep that meter alive.
              </p>

              <button
                type="button"
                onClick={startGame}
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-leaf-600 px-6 font-bold text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 motion-reduce:transform-none"
              >
                Start the rain
                <Play size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Pause screen */}
        {phase === 'paused' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#08111f]/50 p-4 backdrop-blur-[2px]">
            <div className="glass-dark w-full max-w-sm rounded-3xl p-6 text-center text-white">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/10">
                <Pause size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-3 font-heading text-3xl font-semibold">Paused</h2>
              <p className="mt-1 text-sm text-white/65">The rain is holding.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={beginCountdown}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-leaf-600 px-5 text-sm font-bold text-cream transition hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                >
                  <Play size={16} aria-hidden="true" />
                  Resume
                </button>
                <button
                  type="button"
                  onClick={startGame}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  Restart
                </button>
              </div>
              <p className="mt-3 text-xs font-bold text-white/45">
                P or Esc resumes · 3-second countdown
              </p>
            </div>
          </div>
        )}

        {/* Resume countdown */}
        {phase === 'countdown' && (
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#08111f]/45 text-white backdrop-blur-[1px]">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/65">
              Get ready
            </p>
            <span
              key={countdown}
              className="mt-2 animate-pop font-heading text-8xl font-semibold leading-none tabular-nums drop-shadow-lg motion-reduce:animate-none"
            >
              {countdown}
            </span>
            <p className="mt-3 text-sm font-bold text-white/70">The rain starts again…</p>
          </div>
        )}

        {/* Game over screen */}
        {phase === 'over' && result && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#08111f]/55 p-3 backdrop-blur-[2px] sm:p-5">
            <div className="glass-dark max-h-full w-full max-w-lg overflow-y-auto rounded-3xl p-5 text-white scrollbar-soft sm:p-7">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#fca5a5]">
                Game over
              </p>
              <h2 className="mt-1 font-heading text-3xl font-semibold">Your plant wilted</h2>
              <p className="mt-1 text-sm text-white/65">
                The drops it missed finally outweighed the ones it caught.
              </p>

              {result.newBest && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sun-400/15 px-3 py-1 text-xs font-extrabold text-sun-400">
                  <Sparkles size={13} aria-hidden="true" />
                  New personal best
                </p>
              )}

              <div className="mt-5 grid grid-cols-3 divide-x divide-white/15 rounded-2xl bg-white/5 py-3">
                <div className="flex flex-col items-center gap-1 px-2">
                  <Droplet size={16} className="text-sky-300" aria-hidden="true" />
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {result.score}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/50">
                    Caught
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 px-2">
                  <Clock size={16} className="text-sun-400" aria-hidden="true" />
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {formatTime(result.elapsed)}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/50">
                    Lasted
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 px-2">
                  <CloudRain size={16} className="text-[#fca5a5]" aria-hidden="true" />
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {result.missed}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/50">
                    Missed
                  </span>
                </div>
              </div>

              {best > 0 && (
                <p className="mt-2 text-center text-[11px] font-bold text-white/45">
                  Personal best · {best}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={startGame}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-leaf-600 px-5 font-bold text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 motion-reduce:transform-none"
                >
                  <RotateCcw size={17} aria-hidden="true" />
                  Play again
                </button>
                <Link
                  to="/"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 font-bold text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                >
                  Back home
                </Link>
              </div>
            </div>
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {phase === 'over' && result
            ? `Game over. Caught ${result.score}, lasted ${formatTime(result.elapsed)}, missed ${result.missed}.`
            : phase === 'countdown'
              ? `Resuming in ${countdown}.`
              : banner
                ? `Level ${banner.level}. The rain is getting heavier.`
                : ''}
        </p>
      </div>

      {phase === 'playing' || phase === 'paused' || phase === 'countdown' ? (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-bark/65">
            <span className="inline-flex items-center gap-1.5">
              <Keyboard size={15} aria-hidden="true" />
              ← → / A D
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Hand size={15} aria-hidden="true" />
              Drag to move
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Pause size={15} aria-hidden="true" />
              P to pause
            </span>
          </p>
          <div className="flex gap-2">
            {phase === 'playing' ? (
              <button
                type="button"
                onClick={pauseGame}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-bark/20 bg-surface/60 px-4 text-sm font-bold transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
              >
                <Pause size={15} aria-hidden="true" />
                Pause
              </button>
            ) : phase === 'paused' ? (
              <button
                type="button"
                onClick={beginCountdown}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-leaf-600 px-4 text-sm font-bold text-cream transition hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
              >
                <Play size={15} aria-hidden="true" />
                Resume
              </button>
            ) : (
              <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-leaf-600/15 px-4 text-sm font-bold text-leaf-700">
                <Play size={15} aria-hidden="true" />
                Starting in {countdown}
              </span>
            )}
            <button
              type="button"
              onClick={startGame}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-bark/20 bg-surface/60 px-4 text-sm font-bold transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Restart
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CatchTheRainGame