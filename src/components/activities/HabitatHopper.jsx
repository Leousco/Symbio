import { useState } from 'react'
import { Check, X } from 'lucide-react'
import GlassCard from '../GlassCard'
import { habitats } from '../../data/animals'

// Pick a habitat, meet three creatures, then spot the one that does not belong.
function HabitatHopper() {
  const [activeId, setActiveId] = useState(habitats[0].id)
  const [revealed, setRevealed] = useState([])
  const [challengePick, setChallengePick] = useState(null)

  const habitat = habitats.find((item) => item.id === activeId) ?? habitats[0]
  const { challenge } = habitat
  const challengeDone = challengePick !== null
  const challengeRight = challengePick === challenge.answer

  const chooseHabitat = (id) => {
    setActiveId(id)
    setRevealed([])
    setChallengePick(null)
  }

  const toggleCreature = (index) => {
    setRevealed((current) =>
      current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
    )
  }

  return (
    <GlassCard
      as="section"
      id="activity"
      aria-labelledby="hopper-heading"
      className="scroll-mt-24 space-y-5 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-bark/60">Activity</p>
          <h2 id="hopper-heading" className="mt-1 font-heading text-4xl font-semibold">
            Habitat hopper
          </h2>
          <p className="mt-1 max-w-xl text-bark/80">
            Every animal has a trick for the place it lives. Pick a habitat, tap a creature, then
            find the one that does not belong.
          </p>
        </div>
      </div>

      <div
        role="group"
        aria-label="Choose a habitat"
        className="flex flex-wrap gap-2"
      >
        {habitats.map(({ id, label, icon: Icon }) => {
          const selected = id === activeId
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => chooseHabitat(id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${
                selected ? 'bg-bark text-white' : 'glass hover:bg-white/70'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          )
        })}
      </div>

      <div className={`overflow-hidden rounded-[2rem] p-5 sm:p-7 ${habitat.scene}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-sm font-heading text-2xl font-semibold leading-snug">
            {habitat.blurb}
          </p>
          <span className={`rounded-full px-4 py-1.5 text-sm font-extrabold ${habitat.chip}`}>
            {habitat.label}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {habitat.creatures.map(({ name, icon: Icon, trick }, index) => {
            const open = revealed.includes(index)
            return (
              <button
                key={name}
                type="button"
                aria-expanded={open}
                onClick={() => toggleCreature(index)}
                className={`flex min-h-44 flex-col items-start gap-3 rounded-3xl border-2 p-5 text-left shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${habitat.card}`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${habitat.creatureIcon}`}
                >
                  <Icon size={26} />
                </span>
                <span className="font-heading text-lg font-semibold leading-tight">{name}</span>
                <span
                  className={`text-sm leading-relaxed ${
                    open ? 'animate-pop text-bark/80 motion-reduce:animate-none' : 'text-bark/70'
                  }`}
                >
                  {open ? trick : 'Tap to see the trick'}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-5 rounded-3xl border border-white/80 bg-white/80 p-5">
          <p className="font-bold">{challenge.question}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {challenge.options.map((option, index) => {
              const isAnswer = index === challenge.answer
              const isPicked = index === challengePick
              const tone = !challengeDone
                ? habitat.option
                : isAnswer
                  ? 'border-leaf-600 bg-leaf-100 text-leaf-700'
                  : isPicked
                    ? 'border-[#d16b5a] bg-[#fbe6e1] text-[#a8412f]'
                    : 'border-bark/10 bg-white/50 opacity-60'
              return (
                <button
                  key={option}
                  type="button"
                  disabled={challengeDone}
                  onClick={() => setChallengePick(index)}
                  className={`flex min-h-11 items-center justify-between gap-2 rounded-2xl border-2 px-4 py-2.5 text-left text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${tone}`}
                >
                  {option}
                  {challengeDone && isAnswer && <Check size={16} className="flex-none" />}
                  {challengeDone && isPicked && !isAnswer && <X size={16} className="flex-none" />}
                </button>
              )
            })}
          </div>
          <p aria-live="polite" className="mt-3 min-h-6 text-sm leading-relaxed text-bark/80">
            {challengeDone &&
              `${challengeRight ? 'Exactly. ' : 'Not that one. '}${challenge.explain}`}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}

export default HabitatHopper
