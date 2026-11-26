import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Gauge,
  HandHeart,
  Keyboard,
  Pause,
  Play,
  RotateCcw,
  Trash2,
  Waves,
} from 'lucide-react'
import RiverCleanupEngine from './riverCleanupEngine'
import useIsDark from '../../hooks/useIsDark'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_DURATION   = 90   // seconds
const START_CONDITION = 100

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function conditionFill(pct) {
  if (pct > 55) return 'linear-gradient(90deg, #86efac, #22c55e)'
  if (pct > 28) return 'linear-gradient(90deg, #fde047, #f59e0b)'
  return 'linear-gradient(90deg, #fca5a5, #ef4444)'
}

function conditionLabel(pct) {
  if (pct > 65) return 'Great'
  if (pct > 40) return 'Good'
  if (pct > 20) return 'Damaged'
  return 'Critical'
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RiverCleanupGame() {
  const engineRef  = useRef(null)
  const canvasRef  = useRef(null)
  const wrapRef    = useRef(null)
  const rafRef     = useRef(null)
  const drawOpts   = useRef({ dark: false, reduceMotion: false })

  // Phase: 'ready' | 'playing' | 'paused' | 'over'
  const [phase, setPhase] = useState('ready')
  const phaseRef = useRef('ready')

  // HUD state
  const [score,          setScore]          = useState(0)
  const [condition,      setCondition]      = useState(START_CONDITION)
  const [timeLeft,       setTimeLeft]       = useState(GAME_DURATION)
  const [garbageCount,   setGarbageCount]   = useState(0)
  const [rescueCount,    setRescueCount]    = useState(0)

  // Result snapshot
  const [result, setResult] = useState(null)

  // Refs for mutable game values accessed inside the loop
  const scoreRef     = useRef(0)
  const condRef      = useRef(START_CONDITION)
  const timeRef      = useRef(GAME_DURATION)
  const garbageRef   = useRef(0)
  const rescueRef    = useRef(0)

  // Input state
  const inputRef = useRef({ up: false, down: false, left: false, right: false, rescue: false })

  // Near-rescue indicator
  const [nearRescue, setNearRescue] = useState(false)

  // Collision flash (brief red warning on HUD)
  const [hitFlash, setHitFlash] = useState(false)
  const hitFlashTimer = useRef(null)

  // Toast banner  (level up / events)
  const [banner, setBanner] = useState(null)
  const bannerTimer = useRef(null)

  const dark        = useIsDark()
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => { drawOpts.current = { dark, reduceMotion } }, [dark, reduceMotion])
  useEffect(() => { phaseRef.current = phase }, [phase])

  // ── Engine instantiation ──────────────────────────────────────────────────

  useEffect(() => {
    if (!engineRef.current) engineRef.current = new RiverCleanupEngine()
  }, [])

  // ── Canvas sizing ─────────────────────────────────────────────────────────

  useEffect(() => {
    const engine = engineRef.current
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!engine || !canvas || !wrap) return

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width  = Math.round(rect.width  * dpr)
      canvas.height = Math.round(rect.height * dpr)
      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      engine.setSize(rect.width, rect.height)
    }

    resize()

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(resize)
      ro.observe(wrap)
      return () => ro.disconnect()
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── rAF loop ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const engine = engineRef.current
    const canvas = canvasRef.current
    const ctx    = canvas?.getContext('2d')
    if (!engine || !canvas || !ctx) return

    let last = performance.now()

    const tick = (now) => {
      const rawDt = (now - last) / 1000
      last = now
      const dt = Math.min(rawDt, 0.05)

      if (phaseRef.current === 'playing') {
        // Difficulty 0–1 over 90 seconds
        const elapsed    = GAME_DURATION - timeRef.current
        const difficulty = Math.min(1, elapsed / 70)
        engine.update(dt, inputRef.current, difficulty)

        // Advance timer
        timeRef.current = Math.max(0, timeRef.current - dt)
        setTimeLeft(Math.ceil(timeRef.current))

        if (timeRef.current <= 0) {
          endGame('time')
        }
      } else if (phaseRef.current === 'ready') {
        // Ambient river animates on the start screen only; paused/over freeze.
        engine.update(dt, {}, 0)
      }

      engine.draw(ctx, drawOpts.current)

      // Update near-rescue indicator at ~10Hz to avoid excess renders
      if (phaseRef.current === 'playing' && Math.round(now / 100) !== Math.round((now - rawDt * 1000) / 100)) {
        const dist = engine.nearestRescueDistance()
        setNearRescue(dist < 80)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Engine event callbacks ────────────────────────────────────────────────

  const showHitFlash = useCallback(() => {
    setHitFlash(true)
    clearTimeout(hitFlashTimer.current)
    hitFlashTimer.current = setTimeout(() => setHitFlash(false), 350)
  }, [])

  const showBanner = useCallback((text, color) => {
    setBanner({ text, color, id: Date.now() })
    clearTimeout(bannerTimer.current)
    bannerTimer.current = setTimeout(() => setBanner(null), 2200)
  }, [])

  const endGame = useCallback((reason) => {
    const engine = engineRef.current
    if (!engine) return
    if (phaseRef.current === 'over') return
    // Only stop the engine. The callbacks are registered once on mount, so they
    // must stay attached or the next round never reports hits, pickups or rescues.
    engine.stop()
    setResult({
      score:    scoreRef.current,
      garbage:  garbageRef.current,
      rescues:  rescueRef.current,
      reason,
    })
    setPhase('over')
  }, [])

  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return

    engine.onCollectGarbage = (item) => {
      scoreRef.current   += item.points
      garbageRef.current += 1
      setScore(scoreRef.current)
      setGarbageCount(garbageRef.current)
    }

    engine.onHitObstacle = (obs) => {
      condRef.current = Math.max(0, condRef.current - obs.damage)
      setCondition(condRef.current)
      showHitFlash()
      if (condRef.current <= 0) endGame('condition')
    }

    engine.onHitWildlife = () => {
      scoreRef.current = Math.max(0, scoreRef.current - 25)
      setScore(scoreRef.current)
      showBanner('−25 · Disturbed wildlife!', '#fca5a5')
    }

    engine.onRescue = () => {
      scoreRef.current  += 100
      rescueRef.current += 1
      setScore(scoreRef.current)
      setRescueCount(rescueRef.current)
      showBanner('+100 · Animal rescued! 🎉', '#86efac')
    }

    return () => {
      engine.onCollectGarbage = null
      engine.onHitObstacle    = null
      engine.onHitWildlife    = null
      engine.onRescue         = null
    }
  }, [endGame, showHitFlash, showBanner])

  // ── Keyboard controls ─────────────────────────────────────────────────────

  useEffect(() => {
    const down = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toLowerCase()

      // Prevent page scroll while playing
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) {
        if (phaseRef.current === 'playing') e.preventDefault()
      }

      if (k === 'w' || k === 'arrowup')    { inputRef.current.up    = true }
      if (k === 's' || k === 'arrowdown')  { inputRef.current.down  = true }
      if (k === 'a' || k === 'arrowleft')  { inputRef.current.left  = true }
      if (k === 'd' || k === 'arrowright') { inputRef.current.right = true }
      if (k === 'e')                       { inputRef.current.rescue = true }

      if ((k === 'p' || k === 'escape') && phaseRef.current === 'playing') {
        e.preventDefault()
        setPhase('paused')
      } else if ((k === 'p' || k === 'escape') && phaseRef.current === 'paused') {
        e.preventDefault()
        setPhase('playing')
      }
    }

    const up = (e) => {
      const k = e.key.toLowerCase()
      if (k === 'w' || k === 'arrowup')    inputRef.current.up    = false
      if (k === 's' || k === 'arrowdown')  inputRef.current.down  = false
      if (k === 'a' || k === 'arrowleft')  inputRef.current.left  = false
      if (k === 'd' || k === 'arrowright') inputRef.current.right = false
      if (k === 'e')                       inputRef.current.rescue = false
    }

    const blur = () => {
      inputRef.current = { up: false, down: false, left: false, right: false, rescue: false }
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup',   up)
    window.addEventListener('blur',    blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup',   up)
      window.removeEventListener('blur',    blur)
    }
  }, [])

  // Pause when tab is hidden
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && phaseRef.current === 'playing') setPhase('paused')
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // ── Start / restart ───────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return

    scoreRef.current   = 0
    condRef.current    = START_CONDITION
    timeRef.current    = GAME_DURATION
    garbageRef.current = 0
    rescueRef.current  = 0
    inputRef.current   = { up: false, down: false, left: false, right: false, rescue: false }

    setScore(0)
    setCondition(START_CONDITION)
    setTimeLeft(GAME_DURATION)
    setGarbageCount(0)
    setRescueCount(0)
    setResult(null)
    setBanner(null)
    setHitFlash(false)
    setNearRescue(false)
    clearTimeout(bannerTimer.current)
    clearTimeout(hitFlashTimer.current)

    engine.start()
    setPhase('playing')
    canvasRef.current?.focus({ preventScroll: true })
  }, [])

  // Cleanup timers
  useEffect(() => () => {
    clearTimeout(bannerTimer.current)
    clearTimeout(hitFlashTimer.current)
  }, [])

  const cond    = Math.round(condition)
  const lowCond = condition <= 30
  const timePct = timeLeft / GAME_DURATION

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <div
        ref={wrapRef}
        className="relative aspect-4/5 w-full select-none overflow-hidden rounded-[2rem] border border-white/25 bg-[#1a3f65] shadow-2xl sm:aspect-video"
      >
        {/* Canvas — full-bleed behind everything */}
        <canvas
          ref={canvasRef}
          tabIndex={0}
          aria-label="River Cleanup game. Use WASD to steer the boat. Collect garbage automatically. Press E to rescue animals in danger. Avoid rocks and logs."
          className="absolute inset-0 h-full w-full touch-none outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sky-300/80"
        />

        {/* ── HUD ── */}
        {(phase === 'playing' || phase === 'paused') && (
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between gap-2 p-3 sm:p-4">

            {/* Top row */}
            <div className="flex items-start justify-between gap-2">

              {/* Left: timer + score */}
              <div className="flex flex-col gap-1.5">
                {/* Timer bar */}
                <div className="glass-dark flex items-center gap-2 rounded-2xl px-3 py-2 text-white">
                  <Waves size={14} className="flex-none text-sky-300" aria-hidden="true" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-heading text-base font-semibold leading-none tabular-nums">
                      {formatTime(timeLeft)}
                    </span>
                    <div className="h-1 w-20 overflow-hidden rounded-full bg-black/30">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{
                          width: `${timePct * 100}%`,
                          background: timePct > 0.5 ? '#38bdf8' : timePct > 0.25 ? '#fbbf24' : '#ef4444',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white">
                  <Trash2 size={13} className="text-leaf-500" aria-hidden="true" />
                  <span
                    key={score}
                    className="animate-pop font-heading text-base font-semibold leading-none tabular-nums motion-reduce:animate-none"
                  >
                    {score}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/50">pts</span>
                </div>
              </div>

              {/* Right: garbage + rescues */}
              <div className="flex flex-col items-end gap-1.5">
                <div className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white">
                  <Trash2 size={12} className="text-ocean-600" aria-hidden="true" />
                  <span className="text-xs font-bold tabular-nums">{garbageCount}</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/50">collected</span>
                </div>
                <div className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white">
                  <HandHeart size={12} className="text-leaf-500" aria-hidden="true" />
                  <span className="text-xs font-bold tabular-nums">{rescueCount}</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/50">rescued</span>
                </div>
              </div>
            </div>

            {/* Bottom: condition bar + controls hint */}
            <div className="flex items-end justify-between gap-2">
              <div
                className={`glass-dark rounded-2xl px-3 py-2 text-white transition-shadow ${
                  lowCond ? 'ring-1 ring-[#fca5a5]/70' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/70">
                  <span className={`inline-flex items-center gap-1.5 ${hitFlash ? 'text-[#fca5a5]' : ''}`}>
                    <Gauge
                      size={12}
                      className={lowCond || hitFlash ? 'text-[#fca5a5]' : 'text-leaf-200'}
                      aria-hidden="true"
                    />
                    Condition · {conditionLabel(cond)}
                  </span>
                  <span className="tabular-nums text-white/85">{cond}%</span>
                </div>
                <div className="mt-1.5 h-2.5 w-28 overflow-hidden rounded-full bg-black/40 sm:w-40">
                  <div
                    className="h-full rounded-full transition-[width] duration-300 ease-out"
                    style={{ width: `${condition}%`, background: conditionFill(condition) }}
                  />
                </div>
              </div>

              {/* Controls hint — fades after 8 s */}
              <div className="glass-dark hidden items-center gap-2 rounded-2xl px-3 py-2 text-[10px] font-bold text-white/65 sm:flex">
                <Keyboard size={12} className="text-white/40" aria-hidden="true" />
                <span>WASD move · E rescue · P pause</span>
              </div>
            </div>
          </div>
        )}

        {/* Near-rescue pulse prompt (shown over HUD) */}
        {phase === 'playing' && nearRescue && (
          <div
            key="rescue-hint"
            className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-[#1a1200]/80 px-4 py-2 text-sm font-extrabold text-yellow-300 shadow-lg backdrop-blur-sm"
              style={{ animation: 'toastIn 0.25s cubic-bezier(0.22,1,0.36,1) both' }}
            >
              <HandHeart size={15} aria-hidden="true" />
              Press E to rescue
            </span>
          </div>
        )}

        {/* Event banner (score/rescue feedback) */}
        {banner && (
          <div
            key={banner.id}
            className="pointer-events-none absolute left-1/2 top-20 z-20 -translate-x-1/2 animate-pop motion-reduce:animate-none"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07101f]/80 px-4 py-2 text-sm font-extrabold text-white shadow-lg backdrop-blur-sm"
              style={{ color: banner.color }}
            >
              {banner.text}
            </span>
          </div>
        )}

        {/* ── Ready screen ── */}
        {phase === 'ready' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0d1f38]/50 p-3 backdrop-blur-[2px]">
            <div className="glass-dark max-h-full w-full max-w-md overflow-y-auto rounded-3xl p-5 text-white sm:p-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sky-200">
                <Waves size={12} aria-hidden="true" />
                Mini game · Environment
              </span>
              <h2 className="mt-3 font-heading text-2xl font-semibold sm:text-3xl">
                River Cleanup
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Steer your cleanup boat through the river. Collect garbage, avoid obstacles, and
                rescue stranded animals before the 90 seconds run out.
              </p>

              <div className="mt-3 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                {[
                  ['WASD', 'Move the boat'],
                  ['Auto', 'Collect garbage when nearby'],
                  ['E', 'Rescue a stranded animal'],
                  ['P / Esc', 'Pause'],
                ].map(([key, desc]) => (
                  <div key={key} className="flex items-center gap-3">
                    <kbd className="inline-flex min-w-[2.5rem] items-center justify-center rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-bold">
                      {key}
                    </kbd>
                    <span className="text-white/75">{desc}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-2xl bg-white/5 px-3 py-2 text-xs leading-relaxed text-white/55">
                <span className="font-bold text-white/75">Scoring: </span>
                Foam +8 · Bottle +10 · Cup +12 · Bag +15 · Can +20 · Tire +25 · Rescue +100 · Wildlife −25.
                Collisions drain boat condition; at 0% the run ends.
              </div>

              <button
                type="button"
                onClick={startGame}
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-leaf-600 px-6 font-bold text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 motion-reduce:transform-none"
              >
                Start cleanup
                <Play size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* ── Pause screen ── */}
        {phase === 'paused' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0d1f38]/55 backdrop-blur-[2px]">
            <div className="glass-dark w-full max-w-xs rounded-3xl p-6 text-center text-white">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/10">
                <Pause size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-3 font-heading text-3xl font-semibold">Paused</h2>
              <p className="mt-1 text-sm text-white/60">The river keeps flowing.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => { setPhase('playing'); canvasRef.current?.focus({ preventScroll: true }) }}
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
              <p className="mt-3 text-xs font-bold text-white/40">P or Esc to resume</p>
            </div>
          </div>
        )}

        {/* ── Game over screen ── */}
        {phase === 'over' && result && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0d1f38]/60 p-3 backdrop-blur-[3px]">
            <div
              className="glass-dark w-full max-w-sm rounded-3xl p-5 text-white sm:p-7"
              style={{ animation: 'animalRevealPop 0.35s cubic-bezier(0.22,1,0.36,1) both' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-ocean-100/20 text-sky-300">
                  <Waves size={22} aria-hidden="true" />
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/50">
                    {result.reason === 'condition' ? 'Boat destroyed' : 'Time\'s up!'}
                  </span>
                  <h2 className="font-heading text-2xl font-semibold leading-tight">
                    Run complete
                  </h2>
                </div>
              </div>

              {/* Score highlight */}
              <div className="mt-5 flex items-baseline justify-center gap-2">
                <span className="font-heading text-6xl font-bold text-sky-300 tabular-nums">
                  {result.score}
                </span>
                <span className="text-sm font-bold text-white/50">points</span>
              </div>

              {/* Stats grid */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/5 px-3 py-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-ocean-100/20">
                    <Trash2 size={16} className="text-sky-300" aria-hidden="true" />
                  </span>
                  <span className="font-heading text-2xl font-bold tabular-nums">{result.garbage}</span>
                  <span className="text-center text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/50">
                    garbage items
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/5 px-3 py-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-leaf-200/20">
                    <HandHeart size={16} className="text-leaf-500" aria-hidden="true" />
                  </span>
                  <span className="font-heading text-2xl font-bold tabular-nums">{result.rescues}</span>
                  <span className="text-center text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/50">
                    animals rescued
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={startGame}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-leaf-600 px-5 font-bold text-cream transition hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  Play again
                </button>
                <Link
                  to="/"
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-5 text-sm font-bold text-white/80 transition hover:bg-white/14 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                >
                  Return to mini games
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls reference card — shown below the game */}
      {phase !== 'over' && (
        <div className="hidden items-center justify-center gap-6 text-xs font-bold text-bark/60 sm:flex">
          {[
            ['W A S D', 'steer'],
            ['auto', 'collect garbage'],
            ['E', 'rescue animal'],
            ['P / Esc', 'pause'],
          ].map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5">
              <kbd className="rounded border border-bark/20 bg-surface/60 px-1.5 py-0.5 font-extrabold">{k}</kbd>
              <span className="text-bark/45">{v}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}