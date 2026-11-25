import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  Heart,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react'
import GuessTheAnimalEngine from './guessTheAnimalEngine'
import useIsDark from '../../hooks/useIsDark'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import {
  allKnownAnimalNames,
  easyPool,
  guessAnimals,
  hardPool,
  mediumPool,
  ROUND_DURATION,
} from '../../data/guessTheAnimalData'

// ─── localStorage ─────────────────────────────────────────────────────────────

const LS_KEY = 'symbio-guess-animal-records'

function loadRecords() {
  try {
    const raw = typeof window !== 'undefined' && window.localStorage.getItem(LS_KEY)
    if (!raw) throw new Error()
    const p = JSON.parse(raw)
    return {
      bestScore:    Number(p.bestScore)    || 0,
      highestRound: Number(p.highestRound) || 0,
      totalGames:   Number(p.totalGames)   || 0,
      totalCorrect: Number(p.totalCorrect) || 0,
    }
  } catch {
    return { bestScore: 0, highestRound: 0, totalGames: 0, totalCorrect: 0 }
  }
}

function saveRecords(r) {
  try { window.localStorage.setItem(LS_KEY, JSON.stringify(r)) } catch { /* private mode */ }
}

// ─── Queue helpers ─────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Builds a session queue: easy → medium → hard, each tier shuffled.
// Animals in avoidIds are pushed to the back when cycling.
function buildQueue(avoidIds = []) {
  const all = [...shuffle(easyPool), ...shuffle(mediumPool), ...shuffle(hardPool)]
  if (!avoidIds.length) return all
  return [
    ...all.filter((a) => !avoidIds.includes(a.id)),
    ...all.filter((a) =>  avoidIds.includes(a.id)),
  ]
}

// ─── Autocomplete helpers ─────────────────────────────────────────────────────

function norm(s) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

function getSuggestions(query, limit = 7) {
  if (!query.trim()) return []
  const q    = norm(query)
  const seen = new Set()
  const out  = []
  const pool = [
    ...guessAnimals.flatMap((a) => [a.name, ...a.alternativeNames]),
    ...allKnownAnimalNames,
  ]
  for (const name of pool) {
    const n = norm(name)
    if (n.includes(q) && !seen.has(n)) {
      seen.add(n)
      out.push(name.charAt(0).toUpperCase() + name.slice(1))
      if (out.length >= limit) break
    }
  }
  return out
}

function isCorrect(input, animal) {
  const q = norm(input)
  return [animal.name, ...animal.alternativeNames].some((n) => norm(n) === q)
}

function isKnownName(input) {
  const q = norm(input)
  return [
    ...guessAnimals.flatMap((a) => [a.name, ...a.alternativeNames]),
    ...allKnownAnimalNames,
  ].some((n) => norm(n) === q)
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_HEARTS       = 3
const POINTS_CORRECT   = 100
const HINT_THRESHOLD   = 3
const MAX_HINTS        = 1
const AUTO_CONTINUE_S  = 5          // seconds before result auto-advances
const CONTINUE_ARM_MS  = 700        // Enter ignored this long after a result appears
const RESUME_ARM_MS    = 300        // same guard for the pause overlay
const WRAPPER_H        = 620        // fixed height (desktop), svh-clamped on mobile
const GAMEOVER_CARD_H  = 400        // fixed height of the game-over modal itself

// Difficulty ramp — the clock tightens as the player survives more rounds.
function roundDurationFor(round) {
  if (round >= 20) return 5
  if (round >= 16) return 10
  if (round >= 12) return 15
  if (round >= 8)  return 20
  return ROUND_DURATION
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Animated heart row — the heart at `animIdx` plays the lose animation
function HeartRow({ count, max = 5, animIdx = -1 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} of ${max} hearts`}>
      {Array.from({ length: max }, (_, i) => {
        const filled  = i < count
        const animate = i === animIdx
        return (
          <Heart
            key={i}
            size={20}
            className={filled ? 'fill-red-500 text-red-500' : 'fill-white/15 text-white/30'}
            style={animate ? { animation: 'heartLose 0.55s cubic-bezier(0.22,1,0.36,1) both' } : undefined}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}

// Circular countdown arc for the round timer
function TimerArc({ elapsed, total }) {
  const pct       = Math.max(0, Math.min(1, 1 - elapsed / total))
  const remaining = Math.max(0, Math.ceil(total - elapsed))
  const critical  = pct < 0.15
  const urgent    = pct < 0.35
  const colour    = critical ? '#ef4444' : urgent ? '#f59e0b' : '#4ade80'
  const R = 22, C = 2 * Math.PI * R

  return (
    <div className="relative flex h-14 w-14 flex-none items-center justify-center">
      <svg className="-rotate-90" width="56" height="56" aria-hidden="true">
        <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={R}
          fill="none" stroke={colour} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.15s linear, stroke 0.3s' }}
        />
      </svg>
      <span className="absolute text-sm font-extrabold tabular-nums" style={{ color: colour }}>
        {remaining}
      </span>
    </div>
  )
}

// Auto-continue button with a sweeping ring countdown
function ContinueButton({ onContinue, label = 'Continue', seconds = AUTO_CONTINUE_S }) {
  // We drive everything off a single CSS animation duration rather than JS
  // polling so the fill sweeps smoothly at 60fps. JS only handles the
  // auto-fire after the animation ends.
  // `firedRef` guards synchronously so Enter (window listener) and a native
  // click can never both advance the round.
  const firedRef = useRef(false)
  // False until the screen has been visible for CONTINUE_ARM_MS, so the Enter
  // keydown that submitted the answer (or a held key's auto-repeat) can't
  // instantly dismiss the result the moment it appears.
  const armedRef = useRef(false)

  const fire = useCallback(() => {
    if (firedRef.current) return
    firedRef.current = true
    onContinue()
  }, [onContinue])

  useEffect(() => {
    const id = setTimeout(() => { armedRef.current = true }, CONTINUE_ARM_MS)
    return () => clearTimeout(id)
  }, [])

  // Auto-fire once after `seconds`
  useEffect(() => {
    const id = setTimeout(fire, seconds * 1000)
    return () => clearTimeout(id)
  }, [fire, seconds])

  // Also let Enter fire the button while this screen is showing
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Enter' || e.repeat || !armedRef.current) return
      fire()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [fire])

  const handleClick = () => fire()

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative inline-flex min-h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-leaf-600 px-5 font-bold text-cream transition hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
      aria-label={`${label} — auto-advances in ${seconds} seconds`}
    >
      {/* Smooth fill sweep — CSS animation, no JS polling */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-left bg-leaf-700/70"
        style={{
          animation: `continueFill ${seconds}s linear forwards`,
        }}
      />
      <span className="relative flex items-center gap-2">
        {label}
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </button>
  )
}

// Toast notification — floats at top of wrapper, never shifts layout
function Toast({ message, onDismiss }) {
  useEffect(() => {
    const id = setTimeout(onDismiss, 2800)
    return () => clearTimeout(id)
  }, [onDismiss])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="pointer-events-none absolute inset-x-4 top-16 z-50 flex justify-center"
    >
      <div
        className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-950/90 px-4 py-2 text-sm font-bold text-red-200 shadow-xl backdrop-blur-sm"
        style={{ animation: 'toastIn 0.25s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        <X size={14} className="flex-none" aria-hidden="true" />
        {message}
      </div>
    </div>
  )
}

// Pause overlay — blurs the game, shows resume + restart
function PauseOverlay({ onResume, onRestart }) {
  // Also resume on P / Escape
  useEffect(() => {
    let armed = false
    const armId = setTimeout(() => { armed = true }, RESUME_ARM_MS)
    const handler = (e) => {
      if (!armed || e.repeat) return
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') onResume()
    }
    window.addEventListener('keydown', handler)
    return () => { clearTimeout(armId); window.removeEventListener('keydown', handler) }
  }, [onResume])

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center backdrop-blur-md">
      {/* Dark scrim */}
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative flex w-full max-w-xs flex-col items-center gap-5 rounded-3xl border border-white/15 bg-black/70 p-8 text-center backdrop-blur-sm"
        style={{ animation: 'animalRevealPop 0.3s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <Pause size={22} className="text-white" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-heading text-2xl font-semibold text-white">Paused</h3>
          <p className="mt-1 text-sm text-white/55">The jungle is waiting.</p>
        </div>
        <button
          type="button"
          onClick={onResume}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-leaf-600 px-6 font-bold text-cream transition hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
          autoFocus
        >
          <Play size={16} aria-hidden="true" />
          Resume
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-bold text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Restart
        </button>
        <p className="text-xs font-bold text-white/30">P or Esc to resume</p>
      </div>
    </div>
  )
}

// ─── Main game component ──────────────────────────────────────────────────────

export default function GuessTheAnimalGame() {
  // phase: 'idle' | 'playing' | 'revealing' | 'result_correct' | 'result_wrong' | 'gameover'
  const [phase, setPhase] = useState('idle')
  const [paused, setPaused] = useState(false)

  // Session
  const [hearts,       setHearts]       = useState(MAX_HEARTS)
  const [score,        setScore]        = useState(0)
  const [round,        setRound]        = useState(0)
  const [streak,       setStreak]       = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)

  // Current round's clock (tightens at rounds 8 / 12 / 16 / 20)
  const roundDuration = roundDurationFor(round)

  // Which heart index just animated (for the lose animation)
  const [lostHeartIdx, setLostHeartIdx] = useState(-1)

  // Queue
  const queueRef = useRef([])
  const usedIds  = useRef([])
  const [animal, setAnimal] = useState(null)

  // Timer
  const [elapsed,   setElapsed]   = useState(0)
  const timerRef    = useRef(null)
  const roundActive = useRef(false)
  // Stores elapsed when paused so resume picks up exactly where it left off
  const elapsedAtPause = useRef(0)
  // Tracks whether the next 'playing' entry is a fresh round or a resume
  const isResumingRef  = useRef(false)

  // Input
  const [input,       setInput]       = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [activeIdx,   setActiveIdx]   = useState(-1)
  const [toast,       setToast]       = useState(null) // { message, key }
  const inputRef = useRef(null)
  const listRef  = useRef(null)

  // Hints
  const [hintsLeft,    setHintsLeft]    = useState(MAX_HINTS)
  const [hintUsed,     setHintUsed]     = useState(false)
  const [hintProgress, setHintProgress] = useState(0)

  // Result
  const [lastResult, setLastResult] = useState(null)

  // Records
  const [records, setRecords] = useState(loadRecords)

  // Canvas
  const canvasRef = useRef(null)
  const wrapRef   = useRef(null)
  const engineRef = useRef(null)
  const rafRef    = useRef(null)
  const dark      = useIsDark()
  const noMotion  = usePrefersReducedMotion()
  const drawOpts  = useRef({ dark, reduceMotion: noMotion })

  useEffect(() => { drawOpts.current = { dark, reduceMotion: noMotion } }, [dark, noMotion])

  // ── Canvas engine ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!engineRef.current) engineRef.current = new GuessTheAnimalEngine()
  }, [])

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

  useEffect(() => {
    const engine = engineRef.current
    const canvas = canvasRef.current
    const ctx    = canvas?.getContext('2d')
    if (!engine || !canvas || !ctx) return
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      engine.update(dt)
      engine.draw(ctx, drawOpts.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // ── Timer ──────────────────────────────────────────────────────────────────

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  const startTimer = useCallback((startElapsed = 0) => {
    stopTimer()
    setElapsed(startElapsed)
    roundActive.current = true
    const start = performance.now() - startElapsed * 1000
    timerRef.current = setInterval(() => {
      setElapsed((performance.now() - start) / 1000)
    }, 100)
  }, [stopTimer])

  // Timer expiry effect
  useEffect(() => {
    if (phase !== 'playing' || paused || elapsed < roundDuration || !roundActive.current) return
    roundActive.current = false
    stopTimer()
    setHearts((h) => {
      const next = h - 1
      setLostHeartIdx(next)
      return next
    })
    setStreak(0)
    setHintProgress(0)
    setLastResult('timeout')
    setSuggestions([])
    setInput('')
    setToast(null)
    setPhase('result_wrong')
  }, [elapsed, phase, paused, roundDuration, stopTimer])

  // Clear heart animation after it plays
  useEffect(() => {
    if (lostHeartIdx < 0) return
    const id = setTimeout(() => setLostHeartIdx(-1), 700)
    return () => clearTimeout(id)
  }, [lostHeartIdx])

  // Phase → gameover when hearts reach zero
  useEffect(() => {
    if ((phase !== 'result_correct' && phase !== 'result_wrong') || hearts > 0) return
    setRecords((prev) => {
      const updated = {
        bestScore:    Math.max(prev.bestScore, score),
        highestRound: Math.max(prev.highestRound, round),
        totalGames:   prev.totalGames + 1,
        totalCorrect: prev.totalCorrect + totalCorrect,
      }
      saveRecords(updated)
      return updated
    })
    setPhase('gameover')
  }, [phase, hearts, score, round, totalCorrect])

  useEffect(() => () => stopTimer(), [stopTimer])

  // ── Pause / resume ─────────────────────────────────────────────────────────

  const pause = useCallback(() => {
    if (phase !== 'playing' || paused) return
    stopTimer()
    elapsedAtPause.current = elapsed
    setPaused(true)
  }, [phase, paused, elapsed, stopTimer])

  const resume = useCallback(() => {
    if (!paused) return
    isResumingRef.current = true
    setPaused(false)
    // startTimer is called by the phase effect below, which reads isResumingRef
  }, [paused])

  // Keyboard shortcut — Escape pauses while playing. When the answer input is
  // focused its own onKeyDown handles Escape (so suggestions close and the game
  // pauses), and stops propagation so this listener never double-fires.
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Escape' || e.repeat) return
      if (document.activeElement === inputRef.current) return
      if (phase === 'playing' && !paused) {
        e.preventDefault()
        pause()
      }
      // Resume from pause is handled inside PauseOverlay's own listener
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, paused, pause])

  // ── Queue ──────────────────────────────────────────────────────────────────

  const nextAnimal = useCallback(() => {
    if (queueRef.current.length === 0) {
      queueRef.current = buildQueue(usedIds.current.slice(-6))
    }
    const a = queueRef.current.shift()
    usedIds.current.push(a.id)
    setAnimal(a)
  }, [])

  // ── Start game ─────────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    stopTimer()
    setPaused(false)
    usedIds.current  = []
    queueRef.current = buildQueue()
    setHearts(MAX_HEARTS)
    setScore(0)
    setRound(0)
    setStreak(0)
    setTotalCorrect(0)
    setLostHeartIdx(-1)
    setInput('')
    setSuggestions([])
    setToast(null)
    setHintsLeft(MAX_HINTS)
    setHintUsed(false)
    setHintProgress(0)
    setLastResult(null)
    const a = queueRef.current.shift()
    usedIds.current.push(a.id)
    setAnimal(a)
    setRound(1)
    setPhase('playing')
  }, [stopTimer])

  // Start/stop timer with phase — distinguishes fresh round from resume
  useEffect(() => {
    if (phase === 'playing' && !paused) {
      if (isResumingRef.current) {
        // Resume: pick up from where we left off
        isResumingRef.current = false
        startTimer(elapsedAtPause.current)
      } else {
        // Fresh round
        startTimer(0)
      }
      setTimeout(() => inputRef.current?.focus(), 60)
    }
    return () => { if (phase === 'playing') stopTimer() }
  }, [phase, paused, startTimer, stopTimer])

  // After reveal animation, go to result_correct
  useEffect(() => {
    if (phase !== 'revealing') return
    const id = setTimeout(() => setPhase('result_correct'), 1800)
    return () => clearTimeout(id)
  }, [phase])

  // ── Autocomplete ───────────────────────────────────────────────────────────

  const handleInput = (e) => {
    const v = e.target.value
    setInput(v)
    setToast(null)
    setActiveIdx(-1)
    setSuggestions(getSuggestions(v))
  }

  const selectSuggestion = useCallback((name) => {
    setInput(name)
    setSuggestions([])
    setActiveIdx(-1)
    setToast(null)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  const showToast = useCallback((message) => {
    setToast({ message, key: Date.now() })
  }, [])

  // ── Submit ─────────────────────────────────────────────────────────────────

  const submit = useCallback(() => {
    if (phase !== 'playing' || !roundActive.current || !animal || paused) return
    const trimmed = input.trim()
    if (!trimmed) { showToast('Type an animal name first.'); return }
    if (!isKnownName(trimmed)) { showToast("Not recognised — pick from the suggestions."); return }

    roundActive.current = false
    stopTimer()
    setSuggestions([])
    setToast(null)

    if (isCorrect(trimmed, animal)) {
      setScore((s) => s + POINTS_CORRECT)
      setTotalCorrect((c) => c + 1)
      setStreak((s) => s + 1)
      setHintProgress((p) => {
        const next = p + 1
        if (next >= HINT_THRESHOLD) { setHintsLeft((h) => Math.min(h + 1, MAX_HINTS)); return 0 }
        return next
      })
      setLastResult('correct')
      setPhase('revealing')
    } else {
      setHearts((h) => {
        const next = h - 1
        setLostHeartIdx(next)
        return next
      })
      setStreak(0)
      setHintProgress(0)
      setLastResult('wrong')
      setPhase('result_wrong')
    }
  }, [phase, animal, input, paused, stopTimer, showToast])

  // ── Keyboard navigation ────────────────────────────────────────────────────

  const handleKeyDown = useCallback((e) => {
    // Escape always pauses (and closes the suggestion list). Stopping
    // propagation prevents the window-level Escape listener and a freshly
    // mounted PauseOverlay from seeing this same event.
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setSuggestions([])
      setActiveIdx(-1)
      pause()
      return
    }
    if (suggestions.length === 0) {
      if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); submit() }
      return
    }
    if (e.key === 'ArrowDown')  { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp')  { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      // Stop propagation so the ContinueButton's window listener (mounted by
      // the same event when the guess is wrong) never sees this keydown.
      e.stopPropagation()
      if (activeIdx >= 0 && suggestions[activeIdx]) selectSuggestion(suggestions[activeIdx])
      else submit()
    }
  }, [suggestions, activeIdx, selectSuggestion, submit, pause])

  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return
    listRef.current.children[activeIdx]?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  // ── Hint ───────────────────────────────────────────────────────────────────

  const useHint = useCallback(() => {
    if (phase !== 'playing' || hintsLeft <= 0 || hintUsed || paused) return
    setHintsLeft((h) => h - 1)
    setHintUsed(true)
  }, [phase, hintsLeft, hintUsed, paused])

  // ── Continue ───────────────────────────────────────────────────────────────

  const continueRound = useCallback(() => {
    if (hearts <= 0) { setPhase('gameover'); return }
    setRound((r) => r + 1)
    setInput('')
    setSuggestions([])
    setToast(null)
    setHintUsed(false)
    nextAnimal()
    setPhase('playing')
  }, [hearts, nextAnimal])
  // ── Shared layout ──────────────────────────────────────────────────────────

  const wrapperStyle = { height: `min(${WRAPPER_H}px, 92svh)` }

  const CanvasBG = (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ display: 'block' }}
    />
  )

  // HUD bar — shown during playing, revealing, and both result phases
  const showHUD = phase === 'playing' || phase === 'revealing' || phase === 'result_correct' || phase === 'result_wrong'
  const HUD = showHUD && (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
          Round {round}
        </span>
        <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
          {score} pts
        </span>
      </div>
      <div className="flex items-center gap-2">
        {/* Pause button — only during active play */}
        {phase === 'playing' && !paused && (
          <button
            type="button"
            onClick={pause}
            aria-label="Pause game"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/70 backdrop-blur-sm transition hover:bg-black/60 hover:text-white"
          >
            <Pause size={14} aria-hidden="true" />
          </button>
        )}
        <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
          <HeartRow count={hearts} max={MAX_HEARTS} animIdx={lostHeartIdx} />
        </div>
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // IDLE
  // ══════════════════════════════════════════════════════════════════════════

  if (phase === 'idle') {
    return (
      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl" style={wrapperStyle}>
        {CanvasBG}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
          <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-black/55 p-6 backdrop-blur-md sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-white/80">
              🐾 Guess the Animal
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-white sm:text-4xl">
              Who's that animal?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              A silhouette appears. Type the animal's name and use the autocomplete to find it.
              Guess correctly to reveal the animal and earn points.
            </p>
            <ul className="mt-4 space-y-2 text-left text-sm text-white/65">
              {[
                ['❤️', '3 hearts — lose one per wrong answer or timeout'],
                ['⏱', `Starts at ${ROUND_DURATION}s — the clock shrinks every 4 rounds`],
                ['💡', 'Hints recharge after 3 correct answers in a row'],
                ['📸', 'Correct answers dramatically reveal the animal'],
              ].map(([icon, text]) => (
                <li key={text} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-0.5 flex-none">{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={startGame}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-leaf-600 px-6 font-bold text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              Start the game
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            {records.totalGames > 0 && (
              <p className="mt-3 text-center text-xs font-bold text-white/35">
                Personal best: {records.bestScore} pts · {records.totalGames} {records.totalGames === 1 ? 'game' : 'games'} played
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PLAYING + REVEALING
  // ══════════════════════════════════════════════════════════════════════════

  if ((phase === 'playing' || phase === 'revealing') && animal) {
    const isRevealing = phase === 'revealing'

    return (
      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl" style={wrapperStyle}>
        {CanvasBG}
        {HUD}

        {/* Toast — floats over everything, never shifts layout */}
        {toast && (
          <Toast key={toast.key} message={toast.message} onDismiss={() => setToast(null)} />
        )}

        {/* Pause overlay */}
        {paused && (
          <PauseOverlay onResume={resume} onRestart={startGame} />
        )}

        <div className="absolute inset-0 z-10 flex flex-col px-4 pb-4 pt-14">
          <div className="flex h-full flex-col gap-3">

            {/* Timer row */}
            <div className="flex items-center gap-3">
              <div
                className="flex-1 overflow-hidden rounded-full bg-white/10"
                style={{ height: 5 }}
                role="progressbar"
                aria-label="Round timer"
                aria-valuenow={Math.round((1 - elapsed / roundDuration) * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-150 ease-linear"
                  style={{
                    width: `${Math.max(0, (1 - elapsed / roundDuration)) * 100}%`,
                    background:
                      elapsed / roundDuration > 0.85 ? '#ef4444'
                      : elapsed / roundDuration > 0.65 ? '#f59e0b'
                      : '#4ade80',
                  }}
                />
              </div>
              <TimerArc elapsed={elapsed} total={roundDuration} />
            </div>

            {/* Silhouette / reveal */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm">
              <div className="absolute inset-4">
                <img
                  key={animal.id}
                  src={animal.image}
                  alt={isRevealing ? animal.name : 'Animal silhouette — guess what this is'}
                  draggable="false"
                  className="absolute inset-0 h-full w-full object-contain"
                  style={{
                    filter:     isRevealing ? 'brightness(1) drop-shadow(0 0 24px rgba(255,255,220,0.5))' : 'brightness(0)',
                    transition: isRevealing ? 'filter 0.9s ease-out' : 'none',
                    animation:  isRevealing ? 'animalRevealPop 0.6s 0.3s cubic-bezier(0.22,1,0.36,1) both' : 'none',
                  }}
                />
                {!isRevealing && dark && (
                  // Moonlit sheen, masked to the animal's alpha so the black
                  // silhouette reads clearly against the night jungle.
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(215,255,248,0.95) 0%, rgba(160,235,255,0.50) 10%, rgba(90,170,200,0.16) 22%, rgba(60,130,160,0.09) 38%, rgba(80,160,190,0.09) 60%, rgba(140,220,245,0.28) 79%, rgba(205,255,245,0.85) 94%, rgba(255,255,255,0.98) 100%)',
                      WebkitMaskImage: `url(${animal.image})`,
                      maskImage: `url(${animal.image})`,
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      animation: noMotion ? 'none' : 'silhouetteSheen 4.5s ease-in-out infinite',
                    }}
                  />
                )}
              </div>
              {isRevealing && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,200,0.6) 0%, rgba(255,255,200,0) 70%)',
                    animation:  'revealFlash 0.8s ease-out forwards',
                  }}
                />
              )}
              <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-white/55 backdrop-blur-sm">
                {animal.category}
              </span>
            </div>

            {/* Hint text — appears below image when hint is used */}
            {hintUsed && !isRevealing && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-yellow-400/30 bg-yellow-900/40 px-4 py-2.5 backdrop-blur-sm">
                <Lightbulb size={15} className="mt-0.5 flex-none text-yellow-300" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-yellow-100/90">{animal.description}</p>
              </div>
            )}

            {/* Input row: text field + hint icon + submit */}
            {!isRevealing && (
              <div className="relative flex gap-2">
                {/* Autocomplete wrapper */}
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Type an animal name…"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    aria-label="Animal name"
                    aria-expanded={suggestions.length > 0}
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                    aria-controls="gta-suggestions"
                    aria-activedescendant={activeIdx >= 0 ? `gta-s-${activeIdx}` : undefined}
                    className="w-full rounded-2xl border border-white/20 bg-black/50 px-4 py-3 font-sans text-base font-medium text-white placeholder:text-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-leaf-500"
                  />
                  {suggestions.length > 0 && (
                    <ul
                      id="gta-suggestions"
                      ref={listRef}
                      role="listbox"
                      aria-label="Animal name suggestions"
                      className="absolute bottom-full left-0 right-0 z-30 mb-1 max-h-48 overflow-y-auto rounded-2xl border border-white/15 bg-black/85 shadow-xl backdrop-blur-md scrollbar-soft"
                    >
                      {suggestions.map((s, i) => (
                        <li
                          key={s + i}
                          id={`gta-s-${i}`}
                          role="option"
                          aria-selected={i === activeIdx}
                          onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s) }}
                          className={`cursor-pointer px-4 py-2.5 text-sm font-bold transition-colors ${
                            i === activeIdx ? 'bg-leaf-600/70 text-white' : 'text-white/80 hover:bg-white/10'
                          }`}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Hint button — icon only, no label */}
                <button
                  type="button"
                  onClick={useHint}
                  disabled={hintsLeft <= 0 || hintUsed}
                  aria-label={
                    hintUsed       ? 'Hint already used this round'
                    : hintsLeft > 0 ? `Use hint (${hintsLeft} available)`
                    : `No hints — ${hintProgress}/${HINT_THRESHOLD} correct to recharge`
                  }
                  className={`inline-flex h-12 w-12 flex-none items-center justify-center rounded-2xl transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${
                    hintsLeft > 0 && !hintUsed
                      ? 'border border-yellow-400/40 bg-yellow-900/40 text-yellow-300 hover:bg-yellow-900/60'
                      : 'cursor-not-allowed border border-white/10 bg-white/5 text-white/25'
                  }`}
                >
                  <Lightbulb size={18} aria-hidden="true" />
                </button>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={submit}
                  className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-leaf-600 px-5 font-bold text-cream transition hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
                >
                  <Check size={18} aria-hidden="true" />
                  <span className="hidden sm:inline">Submit</span>
                </button>
              </div>
            )}

            {/* Hint recharge note — only when no hints and hint not yet used */}
            {!isRevealing && !hintUsed && hintsLeft === 0 && (
              <p className="text-center text-xs font-bold text-white/35">
                {hintProgress}/{HINT_THRESHOLD} correct guesses until hint recharges
              </p>
            )}

            {/* Revealing success banner */}
            {isRevealing && (
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-green-400/30 bg-green-900/40 px-5 py-3 backdrop-blur-sm">
                <Check size={18} className="flex-none text-green-300" aria-hidden="true" />
                <span className="font-heading text-lg font-semibold text-white">
                  Correct! <span className="text-green-300">+{POINTS_CORRECT} pts</span>
                </span>
                <Sparkles size={15} className="flex-none text-yellow-300" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RESULT — WRONG / TIMEOUT: modal overlay on the silhouette, 3-sec auto-continue
  // ══════════════════════════════════════════════════════════════════════════

  if (phase === 'result_wrong' && animal) {
    const isTimeout = lastResult === 'timeout'

    return (
      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl" style={wrapperStyle}>
        {CanvasBG}
        {HUD}

        {/* Silhouette stays visible and blurred in background */}
        <div className="absolute inset-0 z-10 flex flex-col px-4 pb-4 pt-14">
          <div className="flex h-full flex-col gap-3">
            {/* Timer bar frozen at 0 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 overflow-hidden rounded-full bg-white/10" style={{ height: 5 }}>
                <div className="h-full w-0 rounded-full bg-red-500" />
              </div>
              <div className="relative flex h-14 w-14 flex-none items-center justify-center">
                <svg className="-rotate-90" width="56" height="56" aria-hidden="true">
                  <circle cx="28" cy="28" r={22} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
                  <circle cx="28" cy="28" r={22} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeDasharray={138} strokeDashoffset={138} />
                </svg>
                <span className="absolute text-sm font-extrabold tabular-nums text-red-400">0</span>
              </div>
            </div>

            {/* Silhouette — still black, blurred */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm" style={{ filter: 'blur(1px)' }}>
              <img
                src={animal.image}
                alt="Animal silhouette"
                draggable="false"
                className="max-h-full max-w-full object-contain p-4"
                style={{ filter: 'brightness(0)' }}
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-white/55 backdrop-blur-sm">
                {animal.category}
              </span>
            </div>
          </div>
        </div>

        {/* Wrong modal overlay */}
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6">
          <div
            className="w-full max-w-xs rounded-3xl border border-red-400/30 bg-black/80 p-6 text-center backdrop-blur-md"
            style={{ animation: 'animalRevealPop 0.35s cubic-bezier(0.22,1,0.36,1) both' }}
          >
            {/* Big X icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 ring-2 ring-red-400/40">
              <X size={28} className="text-red-400" aria-hidden="true" />
            </div>

            <h3 className="mt-4 font-heading text-2xl font-semibold text-white">
              {isTimeout ? "Time's up!" : 'Wrong guess!'}
            </h3>
            <p className="mt-1.5 text-sm text-white/65">
              {isTimeout ? 'You ran out of time.' : "That wasn't the right animal."}
            </p>

            {/* −1 heart badge */}
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 bg-red-900/40 px-3 py-1.5 text-sm font-extrabold text-red-200">
                <Heart size={13} className="fill-red-400 text-red-400" aria-hidden="true" />
                −1 heart
              </span>
            </div>

            {/* Auto-continue with 3s countdown */}
            <div className="mt-4">
              <ContinueButton
                onContinue={continueRound}
                label={hearts > 0 ? 'Next round' : 'See results'}
                seconds={3}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RESULT — CORRECT: image slides left, info panel slides in from right
  // ══════════════════════════════════════════════════════════════════════════

  if (phase === 'result_correct' && animal) {
    return (
      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl" style={wrapperStyle}>
        {CanvasBG}
        {HUD}

        <div className="absolute inset-0 z-10 flex flex-col px-4 pb-4 pt-14">
          {/* Correct banner */}
          <div
            className="mb-3 flex items-center gap-3 rounded-2xl border border-green-400/30 bg-green-900/50 px-4 py-2.5 text-green-100 backdrop-blur-sm"
            style={{ animation: 'animalRevealPop 0.4s cubic-bezier(0.22,1,0.36,1) both' }}
          >
            <Check size={16} className="flex-none" aria-hidden="true" />
            <span className="flex-1 text-sm font-bold">Correct! +{POINTS_CORRECT} points</span>
            <Sparkles size={14} className="flex-none text-yellow-300" aria-hidden="true" />
          </div>

          {/* Two-panel layout */}
          <div className="flex flex-1 gap-3 overflow-hidden">
            {/* Image panel slides in */}
            <div
              className="relative flex flex-none items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm"
              style={{ width: '42%', animation: 'slideImageLeft 0.5s 0.05s cubic-bezier(0.22,1,0.36,1) both' }}
            >
              <img
                src={animal.image}
                alt={animal.name}
                draggable="false"
                className="max-h-full max-w-full object-contain p-3"
                style={{ filter: 'brightness(1) drop-shadow(0 4px 20px rgba(0,0,0,0.5))' }}
              />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-2.5 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-white/60 backdrop-blur-sm">
                {animal.category}
              </span>
            </div>

            {/* Info panel slides in */}
            <div
              className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-sm scrollbar-soft"
              style={{ animation: 'slideInfoRight 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both' }}
            >
              <h3 className="font-heading text-xl font-semibold leading-tight text-white sm:text-2xl">
                {animal.name}
              </h3>
              <div className="flex items-start gap-2 rounded-xl border border-yellow-400/25 bg-yellow-900/30 px-3 py-2.5">
                <Sparkles size={13} className="mt-0.5 flex-none text-yellow-300" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-yellow-100/90 sm:text-sm">
                  <span className="font-extrabold text-yellow-300/90">Did you know? </span>
                  {animal.fact}
                </p>
              </div>
              <p className="text-xs leading-relaxed text-white/60 sm:text-sm">{animal.description}</p>

              <div className="mt-auto pt-1">
                <ContinueButton
                  onContinue={continueRound}
                  label={hearts > 0 ? 'Continue' : 'See results'}
                  seconds={AUTO_CONTINUE_S}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GAME OVER
  // ══════════════════════════════════════════════════════════════════════════

  if (phase === 'gameover') {
    const newBest  = score >= records.bestScore && score > 0
    const newRound = round >= records.highestRound && round > 1

    return (
      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl" style={wrapperStyle}>
        {CanvasBG}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-3 sm:p-4">
          <div
            className="mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/15 bg-black/65 p-4 backdrop-blur-md sm:p-5"
            style={{ height: GAMEOVER_CARD_H, maxHeight: '100%', animation: 'animalRevealPop 0.5s cubic-bezier(0.22,1,0.36,1) both' }}
          >
            <div className="my-auto w-full">
              <div className="flex-none text-center">
                <span className="inline-flex items-center gap-1 rounded-full border border-red-400/30 bg-red-900/40 px-2.5 py-0.5 text-[10px] font-extrabold text-red-200">
                  <Heart size={10} aria-hidden="true" /> Game over
                </span>
                <h2 className="mt-1 font-heading text-2xl font-semibold leading-tight text-white">{score} points</h2>
                <p className="text-[11px] text-white/55">
                  {totalCorrect === 0
                    ? 'Better luck next time!'
                    : `You identified ${totalCorrect} animal${totalCorrect !== 1 ? 's' : ''} correctly.`}
                </p>
                {(newBest || newRound) && (
                  <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-yellow-400/30 bg-yellow-900/40 px-2.5 py-0.5 text-[10px] font-extrabold text-yellow-200">
                    <Sparkles size={10} aria-hidden="true" />
                    {newBest && newRound ? 'New best score and round!' : newBest ? 'New personal best!' : 'New highest round!'}
                  </div>
                )}
              </div>

              <div className="mt-2 grid flex-none grid-cols-2 gap-1.5 sm:grid-cols-4">
                {[
                  { label: 'Score',       value: score,               icon: '🏆' },
                  { label: 'Round',       value: round,               icon: '🔄' },
                  { label: 'Identified',  value: totalCorrect,        icon: '✅' },
                  { label: 'Hearts lost', value: MAX_HEARTS - hearts, icon: '💔' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex flex-col items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 px-1 py-1.5 text-center">
                    <span className="text-base leading-none" aria-hidden="true">{icon}</span>
                    <span className="font-heading text-lg font-semibold leading-none tabular-nums text-white">{value}</span>
                    <span className="text-[10px] font-extrabold uppercase leading-tight tracking-[0.06em] text-white/40">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex-none rounded-2xl border border-white/10 bg-white/5 px-2.5 py-2">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/40">Personal records</p>
                <div className="mt-0.5 grid grid-cols-2 gap-x-4">
                  {[
                    ['Best score',       records.bestScore],
                    ['Highest round',    records.highestRound],
                    ['Games played',     records.totalGames],
                    ['Total identified', records.totalCorrect],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between gap-2 text-[11px] leading-snug">
                      <span className="text-white/55">{label}</span>
                      <span className="font-bold tabular-nums text-white">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-none gap-2 pt-2">
              <button
                type="button"
                onClick={startGame}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-leaf-600 px-4 text-sm font-bold text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
              >
                <RotateCcw size={14} aria-hidden="true" /> Play again
              </button>
              <button
                type="button"
                onClick={() => setPhase('idle')}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-bold text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
