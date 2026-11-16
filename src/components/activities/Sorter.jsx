import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

// The sorting engine, shared by the home teaser and the Environment page.
// The station keeps one fixed height: on desktop the object card fills the
// right half while the choices, feedback and action sit on the left. Reserving
// the feedback area means answering never moves the page.
//
// bins:  [{ id, label, icon, tone }]
// items: [{ name, bin, icon, tip, photo?, alt? }]  — a photo replaces the icon slot
function Sorter({ bins, items, className = '' }) {
  const [index, setIndex] = useState(0)
  const [solvedBin, setSolvedBin] = useState(null)
  const [wrongBin, setWrongBin] = useState(null)
  const [missed, setMissed] = useState(false)
  const [score, setScore] = useState(0)

  const item = items[index]
  const solved = solvedBin === item.bin
  const isLast = index === items.length - 1
  const finished = solved && isLast
  const ItemIcon = item.icon

  const progress = (index + (solved ? 1 : 0)) / items.length
  const feedback = finished
    ? `Done. You got ${score} of ${items.length} on the first try.`
    : solved
      ? `Correct. ${item.tip}`
      : missed
        ? 'Not quite. Try another bin.'
        : 'Pick the bin you think it belongs in.'
  const hint = finished
    ? ''
    : solved
      ? 'Next one when you are ready.'
      : 'First-try answers score a point.'

  const pick = (binId) => {
    if (solved) return
    if (binId === item.bin) {
      setSolvedBin(binId)
      setWrongBin(null)
      if (!missed) setScore((current) => current + 1)
    } else {
      setWrongBin(binId)
      setMissed(true)
      window.setTimeout(() => {
        setWrongBin((current) => (current === binId ? null : current))
      }, 550)
    }
  }

  const reset = () => {
    setIndex(0)
    setSolvedBin(null)
    setWrongBin(null)
    setMissed(false)
    setScore(0)
  }

  const advance = () => {
    if (!solved) return
    if (finished) {
      reset()
      return
    }
    setIndex((current) => current + 1)
    setSolvedBin(null)
    setWrongBin(null)
    setMissed(false)
  }

  return (
    <div className={className}>
      <div className="grid gap-5 md:grid-cols-2">
        {/* Object card: the right half on desktop, first on mobile */}
        <div className="flex h-full flex-col rounded-3xl border border-white/80 bg-white/60 p-4 md:order-last">
          <div className="flex items-center justify-between text-sm font-bold text-bark/70">
            <span className="tabular-nums">
              Item {index + 1} of {items.length}
            </span>
            <span className="tabular-nums">Score {score}</span>
          </div>

          <div
            key={item.name}
            className="mt-3 flex min-h-0 flex-1 animate-pop flex-col motion-reduce:animate-none"
          >
            <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#eaf2e6] to-[#dfe9d9] ring-1 ring-inset ring-bark/5 md:aspect-auto md:min-h-0 md:flex-1">
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.alt ?? item.name}
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
                    ? 'border-[#d16b5a] bg-[#fbe6e1]'
                    : 'border-bark/10 bg-white/70 hover:border-bark/25 hover:bg-white'
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

          <p
            aria-live="polite"
            className="mt-4 h-18 overflow-hidden text-sm leading-6 text-bark/80 md:text-base"
          >
            <span className="line-clamp-3">{feedback}</span>
          </p>

          <div className="mt-auto flex h-12 items-center justify-between gap-3">
            <p className="hidden text-sm leading-5 text-bark/60 sm:line-clamp-2">{hint}</p>
            <button
              type="button"
              disabled={!solved}
              onClick={advance}
              className={`ml-auto inline-flex min-h-10 flex-none items-center gap-2 whitespace-nowrap rounded-full bg-bark px-4 text-sm font-bold text-white transition-[background-color,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${
                solved ? 'opacity-100 enabled:hover:bg-bark/90' : 'cursor-not-allowed opacity-40'
              }`}
            >
              {finished ? 'Play again' : 'Next item'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sorter
