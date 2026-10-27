import { Link } from 'react-router-dom'
import { ArrowRight, Globe } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import FactOfTheDay from '../components/FactOfTheDay'
import ArticlePreview from '../components/ArticlePreview'
import SorterTeaser from '../components/SorterTeaser'
import { topics, articles } from '../data/home'

// Floating chips around the hero globe
const heroChips = [
  { topic: topics[0], position: 'left-0 top-6' },
  { topic: topics[1], position: 'right-0 top-36' },
  { topic: topics[2], position: 'bottom-8 left-4' },
]

const quizLevels = [
  {
    level: 'Level 1',
    title: 'Explorer',
    text: 'Short questions and big pictures. A good place to start.',
    badge: 'bg-sun-100',
  },
  {
    level: 'Level 2',
    title: 'Scientist',
    text: 'Trickier questions that use the deeper facts from each topic.',
    badge: 'bg-ocean-100',
  },
  {
    level: 'Level 3',
    title: 'Genius',
    text: 'The toughest questions for curious minds ready for a real challenge.',
    badge: 'bg-[#fbdada]',
  },
]

function Home() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="grid items-center gap-10 py-4 sm:py-12 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <span className="rounded-full border border-white/80 bg-white/60 px-4 py-1.5 text-sm font-extrabold text-leaf-700">
            Science for curious beginners
          </span>
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Science, <span className="text-leaf-600">living together.</span>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-bark/80 sm:text-xl">
            Explore animals, plants, and our planet through quick facts, short stories, and
            hands-on activities. No science background needed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/animals"
              className="group inline-flex min-h-13 items-center gap-2 rounded-full bg-leaf-600 px-7 text-lg font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              Start exploring
              <ArrowRight size={20} className="transition group-hover:translate-x-1" />
            </Link>
            <a
              href="#fact"
              className="inline-flex min-h-13 items-center rounded-full border border-bark/20 bg-white/60 px-7 text-lg font-bold transition hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              See today&apos;s fact
            </a>
          </div>
        </div>

        {/* Globe + floating topic chips */}
        <div className="relative mx-auto h-80 w-full max-w-md sm:h-104">
          <div className="absolute inset-x-10 inset-y-6 rounded-full bg-[radial-gradient(circle_at_30%_28%,#d5f0d7_0,#3f9b4b_52%,#2c7ea8_100%)] shadow-2xl">
            <Globe className="h-full w-full text-white/40" strokeWidth={0.6} aria-hidden="true" />
          </div>
          {heroChips.map(({ topic, position }) => {
            const Icon = topic.icon
            return (
              <Link
                key={topic.to}
                to={topic.to}
                className={`glass absolute ${position} flex items-center gap-2.5 rounded-full py-2 pl-2 pr-5 font-bold transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${topic.badge}`}
                >
                  <Icon size={20} />
                </span>
                {topic.title}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Topics */}
      <section aria-labelledby="topics-heading" className="space-y-6">
        <div className="px-2">
          <h2 id="topics-heading" className="text-4xl font-semibold">
            Pick a topic
          </h2>
          <p className="mt-1 text-lg text-bark/80">Three worlds to explore. Start anywhere.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map(({ to, title, text, icon: Icon, badge, tags, tagStyle }) => (
            <GlassCard
              key={to}
              as={Link}
              to={to}
              className="group flex flex-col gap-3 transition duration-300 hover:-translate-y-1.5 hover:bg-white/60 sm:p-7"
            >
              <span className={`inline-flex w-fit rounded-2xl p-3.5 ${badge}`}>
                <Icon size={30} />
              </span>
              <h3 className="text-3xl font-semibold">{title}</h3>
              <p className="leading-relaxed text-bark/80">{text}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-3 py-1 text-sm font-extrabold ${tagStyle}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-auto pt-2 font-bold text-leaf-700 transition group-hover:translate-x-1">
                Explore {title.toLowerCase()} →
              </span>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Fact of the day */}
      <FactOfTheDay />

      {/* Article previews */}
      <section aria-labelledby="stories-heading" className="space-y-14">
        <div className="px-2">
          <h2 id="stories-heading" className="text-4xl font-semibold">
            A peek inside
          </h2>
          <p className="mt-1 text-lg text-bark/80">
            One short story from each topic. Pick a section to read more.
          </p>
        </div>
        {articles.map((article, i) => (
          <div key={article.id} className={i > 0 ? 'border-t border-white/70 pt-14' : ''}>
            <ArticlePreview article={article} flip={i % 2 === 1} />
          </div>
        ))}
      </section>

      {/* Featured activity */}
      <SorterTeaser />

      {/* Quizzes (placeholders until the quiz is built) */}
      <section aria-labelledby="quiz-heading" className="space-y-6">
        <div className="px-2">
          <h2 id="quiz-heading" className="text-4xl font-semibold">
            Test what you know
          </h2>
          <p className="mt-1 text-lg text-bark/80">Pick a level and see how many you get right.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizLevels.map(({ level, title, text, badge }) => (
            <GlassCard key={title} className="flex flex-col items-start gap-3 sm:p-7">
              <span className={`rounded-full px-4 py-1 text-sm font-extrabold ${badge}`}>
                {level}
              </span>
              <h3 className="text-3xl font-semibold">{title}</h3>
              <p className="leading-relaxed text-bark/80">{text}</p>
              {/* TODO: turn this into a <Link> once the quiz page exists */}
              <button
                type="button"
                disabled
                className="mt-auto inline-flex min-h-12 cursor-not-allowed items-center rounded-full bg-bark/15 px-6 font-bold text-bark/70"
              >
                Coming soon
              </button>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
