import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import GlassCard from './GlassCard'
import Sorter from './activities/Sorter'
import { teaserBins, teaserItems } from '../data/environment'

// Home-page taster for the full sorter on the Environment page.
// The station holds its shape while you play, so nothing below it jumps.
function SorterTeaser() {
  return (
    <GlassCard as="section" aria-labelledby="sorter-teaser-heading" className="sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-bark/60">Activity</p>
          <h2
            id="sorter-teaser-heading"
            className="mt-1 font-heading text-3xl font-semibold sm:text-4xl"
          >
            Sort the trash
          </h2>
          <p className="mt-1 max-w-xl text-bark/80">
            Five everyday objects, three bins. Pick the right one for each.
          </p>
        </div>
        <Link
          to="/environment#activity"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-bark/20 bg-white/60 px-5 text-sm font-bold transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
        >
          Open the full sorter
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
        </Link>
      </div>

      <Sorter bins={teaserBins} items={teaserItems} className="mt-6" />
    </GlassCard>
  )
}

export default SorterTeaser
