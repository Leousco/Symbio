import { Link } from 'react-router-dom'
import { PawPrint, Sprout, Recycle } from 'lucide-react'
import GlassCard from '../components/GlassCard'

const topics = [
  {
    to: '/animals',
    title: 'Animals',
    text: 'Meet creatures big and small and discover how they live.',
    icon: PawPrint,
    badge: 'bg-sun-400 text-bark',
  },
  {
    to: '/plants',
    title: 'Plants',
    text: 'See how plants grow, feed themselves, and keep us alive.',
    icon: Sprout,
    badge: 'bg-leaf-500 text-white',
  },
  {
    to: '/recycling',
    title: 'Recycling',
    text: 'Learn what goes where and how small habits help the planet.',
    icon: Recycle,
    badge: 'bg-ocean-500 text-white',
  },
]

function Home() {
  return (
    <div className="space-y-16">
      <section className="py-10 text-center sm:py-20">
        <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
          Science, <span className="text-leaf-600">living together.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-bark/80">
          Explore animals, plants, and recycling through quick facts and
          hands-on activities.
        </p>
        <Link
          to="/animals"
          className="mt-8 inline-block rounded-full bg-leaf-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-leaf-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
        >
          Start exploring
        </Link>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map(({ to, title, text, icon: Icon, badge }) => (
          <GlassCard
            key={to}
            as={Link}
            to={to}
            className="group block transition duration-300 hover:-translate-y-1.5 hover:bg-white/60"
          >
            <span className={`inline-flex rounded-2xl p-3 ${badge}`}>
              <Icon size={28} />
            </span>
            <h2 className="mt-4 text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-bark/80">{text}</p>
            <span className="mt-4 inline-block font-semibold text-leaf-600 transition group-hover:translate-x-1">
              Explore →
            </span>
          </GlassCard>
        ))}
      </section>
    </div>
  )
}

export default Home