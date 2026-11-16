import { Lightbulb, ShieldCheck } from 'lucide-react'
import GlassCard from '../GlassCard'
import Sorter from './Sorter'
import { sorterBins, sorterItems } from '../../data/environment'

function SortItOut() {
  return (
    <GlassCard
      as="section"
      id="activity"
      aria-labelledby="sorter-heading"
      className="scroll-mt-24 space-y-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-bark/60">Activity</p>
          <h2 id="sorter-heading" className="mt-1 font-heading text-4xl font-semibold">
            Sort it out
          </h2>
          <p className="mt-1 max-w-xl text-bark/80">
            Twelve everyday objects, four bins. Get each one right on the first try to finish with a
            perfect score.
          </p>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-ocean-100 px-4 py-1.5 text-sm font-extrabold text-ocean-600">
          <ShieldCheck size={16} />
          Sorting challenge
        </span>
      </div>

      <Sorter bins={sorterBins} items={sorterItems} />

      <p className="flex items-center gap-2 text-sm text-bark/60">
        <Lightbulb size={14} />
        Not sure? The field guide below explains what happens to each material.
      </p>
    </GlassCard>
  )
}

export default SortItOut
