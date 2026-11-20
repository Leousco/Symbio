import { useEffect, useState } from 'react'
import { ArrowRight, Check, Lightbulb, RotateCcw } from 'lucide-react'

// The sorting engine, shared by the home teaser and the Environment page.
// The station keeps one fixed height while you play: on desktop the object
// card fills the right half while the choices, feedback and action sit on the
// left. Reserving the feedback area means answering never moves the page.
//
// bins:  [{ id, label, icon, tone }]
// items: [{ name, bin, icon, tip, photo?, alt?, focus? }] — a photo replaces the
// icon slot; `focus` sets the CSS object-position for cropping the photo.
// fisher-yates: returns a new array, so the source data is never mutated.
function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// The coach card under the bins: how to think before answering, a nudge after a
// wrong pick, and a fact once the item is sorted. Home teaser only for now.
function CoachNote({ item, solved, missed }) {
  const isFact = solved
  const label = isFact ? 'Did you know?' : missed ? 'A hint' : 'How to decide'
  const text = isFact ? item.tip : missed ? item.hint : item.think

  if (!text) return null

  return (
    <div
      aria-live="polite"
      className={`mt-4 flex h-[170px] items-center gap-3 overflow-hidden rounded-2xl border p-3.5 transition-colors min-[360px]:h-[146px] min-[430px]:h-[122px] sm:h-[98px] md:h-[146px] lg:h-[98px] ${
        isFact ? 'border-leaf-600/30 bg-leaf-50' : 'border-bark/10 bg-surface/70'
      }`}
    >
      <span
        className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${
          isFact ? 'bg-leaf-100 text-leaf-700' : 'bg-sun-100 text-[#8a6d1f] dark:text-sun-400'
        }`}
        aria-hidden="true"
      >
        <Lightbulb size={18} />
      </span>

      <div className="min-w-0">
        <p className={`text-sm font-extrabold ${isFact ? 'text-leaf-700' : 'text-bark/60'}`}>
          {label}
        </p>
        <p
          key={text}
          className="mt-0.5 line-clamp-5 animate-fade-in text-sm leading-6 text-bark/80 motion-reduce:animate-none min-[360px]:line-clamp-4 min-[430px]:line-clamp-3 sm:line-clamp-2 md:line-clamp-4 lg:line-clamp-2"
        >
          {text}
        </p>
      </div>
    </div>
  )
}

function Sorter({ bins, items, className = '', coach = false }) {
  const [deck, setDeck] = useState(() => shuffle(items))
  const [index, setIndex] = useState(0)
  const [solvedBin, setSolvedBin] = useState(null)
  const [wrongBin, setWrongBin] = useState(null)
  const [missed, setMissed] = useState(false)
  const [score, setScore] = useState(0)
  const [missedItems, setMissedItems] = useState([])

  const item = deck[index]
  const solved = solvedBin === item.bin
  const isLast = index === deck.length - 1
  const finished = solved && isLast
  const ItemIcon = item.icon

  const progress = (index + (solved ? 1 : 0)) / deck.length

  // Load every photo for this set once, so changing items never flashes empty.
  useEffect(() => {
    items.forEach(({ photo }) => {
      if (!photo) return
      const img = new Image()
      img.src = photo
    })
  }, [items])

  const pick = (binId) => {
    if (solved) return
    if (binId === item.bin) {
      setSolvedBin(binId)
      setWrongBin(null)
      if (!missed) setScore((current) => current + 1)
    } else {
      setWrongBin(binId)
      setMissed(true)
      setMissedItems((list) => (list.includes(item.name) ? list : [...list, item.name]))
      window.setTimeout(() => {
        setWrongBin((current) => (current === binId ? null : current))
      }, 550)
    }
  }

  const reset = () => {
    setDeck(shuffle(items))
    setIndex(0)
    setSolvedBin(null)
    setWrongBin(null)
    setMissed(false)
    setScore(0)
    setMissedItems([])
  }

  const advance = () => {
    if (!solved) return
    setIndex((current) => current + 1)
    setSolvedBin(null)
    setWrongBin(null)
    setMissed(false)
  }

  const perfect = score === deck.length

  // The station keeps its height when the round ends: the play layout stays in
  // the flow (hidden) and the score card is laid over it, so nothing below moves.
  const resultPanel = finished ? (
    <div
      role="status"
      className="absolute inset-0 flex animate-pop flex-col items-center justify-center rounded-3xl border border-hairline/80 bg-surface/60 px-6 py-12 text-center motion-reduce:animate-none"
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          perfect ? 'bg-leaf-100 text-leaf-700' : 'bg-sun-100 text-[#8a6d1f] dark:text-sun-400'
        }`}
        aria-hidden="true"
      >
        <Check size={30} strokeWidth={2.5} />
      </span>

      <p className="mt-5 font-heading text-5xl font-semibold tabular-nums">
        {score} of {deck.length}
      </p>
      <p className="mt-1 font-bold text-bark/70">sorted right on the first try</p>

      <p className="mt-4 max-w-sm leading-relaxed text-bark/80">
        {perfect
          ? 'Every item went in the right bin without a second guess.'
          : `Good run. ${missedItems.length === 1 ? 'One item needed' : `${missedItems.length} items needed`} a second look: ${missedItems.join(', ')}.`}
      </p>

      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-bark px-5 font-bold text-cream transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-bark/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
      >
        <RotateCcw size={18} />
        Play again
      </button>
    </div>
  ) : null

  const feedback = solved
    ? `Correct. ${item.tip}`
    : missed
      ? 'Not quite. Try another bin.'
      : 'Pick the bin you think it belongs in.'
  const hint = solved ? 'Next one when you are ready.' : 'First-try answers score a point.'

  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden={finished || undefined}
        className={finished ? 'invisible' : undefined}
      >
        <div className="grid gap-5 md:grid-cols-2">
        {/* Object card: the right half on desktop, first on mobile */}
        <div className="flex h-full flex-col rounded-3xl border border-hairline/80 bg-surface/60 p-4 md:order-last">
          <div className="flex items-center justify-between text-sm font-bold text-bark/70">
            <span className="tabular-nums">
              Item {index + 1} of {deck.length}
            </span>
            <span className="tabular-nums">Score {score}</span>
          </div>

          <div
            key={item.name}
            className="mt-3 flex min-h-0 flex-1 animate-pop flex-col motion-reduce:animate-none"
          >
            <div className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#eaf2e6] to-[#dfe9d9] ring-1 ring-inset ring-bark/5 dark:from-[#13251b] dark:to-[#0f1f17]">
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.alt ?? item.name}
                  decoding="async"
                  style={{ objectPosition: item.focus ?? 'center' }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ItemIcon
                  size={56}
                  strokeWidth={1.25}
                  className="size-14 text-bark/30 md:size-24"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="mt-3 flex h-14 items-center justify-center md:h-16">
              <p className="line-clamp-2 text-center font-heading text-xl leading-tight md:text-2xl">
                {item.name}
              </p>
            </div>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bark/10" aria-hidden="true">
            <div
              className="h-full w-full origin-left rounded-full bg-leaf-600 transition-transform duration-500 motion-reduce:transition-none"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>

        {/* Choices, description and the one action, on the left */}
        <div className="flex flex-col md:order-first">
          <p className="text-sm font-extrabold text-bark/60">Where does it go?</p>

          <div
            className={`mt-3 grid gap-3 ${
              bins.length > 3 ? 'grid-cols-2' : 'grid-cols-3'
            } md:grid-cols-1`}
          >
            {bins.map(({ id, label, icon: Icon, tone }) => {
              const isAnswer = id === item.bin
              const stateClass =
                solved && isAnswer
                  ? 'border-leaf-600 bg-leaf-100'
                  : wrongBin === id
                    ? 'border-[#d16b5a] bg-[#fbe6e1] dark:bg-[#3a1c1f]'
                    : 'border-bark/10 bg-surface/70 hover:border-bark/25 hover:bg-surface'
              return (
                <button
                  key={id}
                  type="button"
                  disabled={solved}
                  onClick={() => pick(id)}
                  className={`flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border text-sm font-bold text-bark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 disabled:cursor-default md:h-18 md:flex-row md:justify-start md:gap-3 md:px-4 md:text-base ${stateClass}`}
                >
                  <span
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${tone}`}
                  >
                    <Icon size={18} />
                  </span>
                  {label}
                  {solved && isAnswer && (
                    <Check
                      size={18}
                      className="ml-auto hidden text-leaf-700 md:block"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>

          {coach ? (
            <CoachNote item={item} solved={solved} missed={missed} />
          ) : (
            <div
              aria-live="polite"
              className="mt-4 flex h-24 items-start text-sm leading-6 text-bark/80 md:text-base"
            >
              {!solved && !missed && item.hint ? (
                <>
                  <Lightbulb
                    size={16}
                    className="mr-2.5 mt-1 flex-none text-[#8a6d1f] dark:text-sun-400"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-bark/60">
                      How to think about it
                    </p>
                    <p className="mt-0.5 line-clamp-3 leading-6 text-bark/80">{item.hint}</p>
                  </div>
                </>
              ) : (
                <span className="line-clamp-3">{feedback}</span>
              )}
            </div>
          )}

          <div
            className={`mt-auto flex items-center justify-between gap-3 ${
              coach ? 'min-h-12 pt-4' : 'h-12'
            }`}
          >
            <p className="hidden text-sm leading-5 text-bark/60 sm:line-clamp-2">{hint}</p>
            <button
              type="button"
              disabled={!solved}
              onClick={advance}
              className={`ml-auto inline-flex min-h-10 flex-none items-center gap-2 whitespace-nowrap rounded-full bg-bark px-4 text-sm font-bold text-cream transition-[background-color,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${
                solved ? 'opacity-100 enabled:hover:bg-bark/90' : 'cursor-not-allowed opacity-40'
              }`}
            >
              Next item
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        </div>
      </div>
      {resultPanel}
    </div>
  )
}

export default Sorter
