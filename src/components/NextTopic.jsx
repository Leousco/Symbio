import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function NextTopic({ kicker = 'Next up', title, text, to, icon: Icon, visual }) {
  return (
    <Link
      to={to}
      className="group glass flex flex-wrap items-center gap-6 rounded-4xl p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 sm:p-8"
    >
      <span className={`flex h-20 w-20 flex-none items-center justify-center rounded-3xl ${visual}`}>
        <Icon size={38} strokeWidth={1.5} />
      </span>
      <span className="min-w-0 flex-1 basis-64">
        <span className="text-sm font-extrabold text-bark/60">{kicker}</span>
        <span className="mt-1 block font-heading text-2xl font-semibold">{title}</span>
        <span className="mt-1 block leading-relaxed text-bark/80">{text}</span>
      </span>
      <ArrowRight size={24} className="text-leaf-700 transition group-hover:translate-x-1" />
    </Link>
  )
}

export default NextTopic
