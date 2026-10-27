import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Leaf, Recycle, RotateCcw } from 'lucide-react'
import GlassCard from './GlassCard'

const bins = [
  { id: 'plastic', label: 'Plastic', icon: Recycle, style: 'border-ocean-600 bg-ocean-100' },
  { id: 'paper', label: 'Paper', icon: FileText, style: 'border-sun-500 bg-sun-100' },
  { id: 'organic', label: 'Organic', icon: Leaf, style: 'border-leaf-500 bg-leaf-100' },
]

const items = [
  { name: 'Plastic bottle', bin: 'plastic', tip: 'Empty plastic bottles can be recycled into new plastic products.' },
  { name: 'Newspaper', bin: 'paper', tip: 'Paper is turned back into pulp and made into new paper.' },
  { name: 'Banana peel', bin: 'organic', tip: 'Food scraps break down into compost that feeds soil.' },
  { name: 'Cardboard box', bin: 'paper', tip: 'Flattened cardboard is recycled into new boxes.' },
  { name: 'Apple core', bin: 'organic', tip: 'Fruit scraps can be composted instead of thrown away.' },
]

// A small click-to-sort demo. The full game can live on the Environment page.
function SorterTeaser() {
  const [index, setIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const [missed, setMissed] = useState(false)
  const [message, setMessage] = useState('Which bin does it go in?')
  const [score, setScore] = useState(0)

  const item = items[index]
  const isLast = index === items.length - 1

  const pick = (binId) => {
    if (solved) return
    if (binId === item.bin) {
      setSolved(true)
      setMessage(`Correct! ${item.tip}`)
      if (!missed) setScore((s) => s + 1)
    } else {
      setMissed(true)
      setMessage('Not quite. Try another bin.')
    }
  }

  const next = () => {
    setIndex((i) => i + 1)
    setSolved(false)
    setMissed(false)
    setMessage('Which bin does it go in?')
  }

  const restart = () => {
    setIndex(0)
    setSolved(false)
    setMissed(false)
    setMessage('Which bin does it go in?')
    setScore(0)
  }

  return (
    <GlassCard
      as="section"
      aria-label="Sort the trash activity"
      className="flex flex-wrap items-center gap-8 rounded-4xl sm:p-10"
    >
      <div className="flex-1 basis-72">
        <span className="rounded-full bg-ocean-100 px-4 py-1 text-sm font-extrabold">
          Featured activity
        </span>
        <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight">Sort the trash</h2>
        <p className="mt-3 text-lg leading-relaxed text-bark/80">
          Pick the right bin for each item. Learn what can be recycled, what can be composted, and
          why it matters.
        </p>
        <Link
          to="/environment"
          className="group mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-leaf-600 px-7 font-bold text-white transition hover:-translate-y-0.5 hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
        >
          More on the environment
          <ArrowRight size={18} className="transition group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="flex-1 basis-80 rounded-3xl border border-white/80 bg-white/55 p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-bark px-3 py-1 text-sm font-bold text-white">
            Item {index + 1} of {items.length}
          </span>
          <span className="text-sm font-bold text-bark/80">Score: {score}</span>
        </div>

        <p className="mt-6 rounded-2xl border-2 border-dashed border-leaf-600 bg-white py-4 text-center font-heading text-2xl shadow-lg">
          {item.name}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {bins.map(({ id, label, icon: Icon, style }) => (
            <button
              key={id}
              type="button"
              disabled={solved}
              onClick={() => pick(id)}
              className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border-2 px-2 font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 enabled:hover:-translate-y-0.5 ${style} ${
                solved && id === item.bin ? 'ring-4 ring-leaf-500' : ''
              }`}
            >
              <Icon size={26} />
              {label}
            </button>
          ))}
        </div>

        <p aria-live="polite" className="mt-4 min-h-14 leading-relaxed">
          {message}
        </p>

        {solved && !isLast && (
          <button
            type="button"
            onClick={next}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-bark px-5 font-bold text-white"
          >
            Next item
            <ArrowRight size={18} />
          </button>
        )}

        {solved && isLast && (
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-bold">
              You got {score} of {items.length} on the first try.
            </p>
            <button
              type="button"
              onClick={restart}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-bark px-5 font-bold text-white"
            >
              <RotateCcw size={18} />
              Play again
            </button>
          </div>
        )}
      </div>
    </GlassCard>
  )
}

export default SorterTeaser