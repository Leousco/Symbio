import { Link } from 'react-router-dom'
import { ArrowRight, CloudRain, Droplets, Globe, PawPrint, Sprout } from 'lucide-react'
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

const gameTags = ['Catch to heal', 'Grow as you catch', 'Storm every 20s']
const guessTags = ['5 hearts', '25-second timer', 'Hint system']

function Home() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="grid items-center gap-10 py-4 sm:py-12 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <span className="rounded-full border border-hairline/80 bg-surface/60 px-4 py-1.5 text-sm font-extrabold text-leaf-700">
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
              className="group inline-flex min-h-13 items-center gap-2 rounded-full bg-leaf-600 px-7 text-lg font-bold text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              Start exploring
              <ArrowRight size={20} className="transition group-hover:translate-x-1" />
            </Link>
            <a
              href="#fact"
              className="inline-flex min-h-13 items-center rounded-full border border-bark/20 bg-surface/60 px-7 text-lg font-bold transition hover:bg-surface/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
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
              className="group flex flex-col gap-3 transition duration-300 hover:-translate-y-1.5 hover:bg-surface/60 sm:p-7"
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
          <div key={article.id} className={i > 0 ? 'border-t border-hairline/70 pt-14' : ''}>
            <ArticlePreview article={article} flip={i % 2 === 1} />
          </div>
        ))}
      </section>

      {/* Featured activity */}
      <SorterTeaser />

      {/* Mini games */}
      <section aria-labelledby="games-heading" className="space-y-6">
        <div className="px-2">
          <h2 id="games-heading" className="text-4xl font-semibold">
            Mini games
          </h2>
          <p className="mt-1 text-lg text-bark/80">
            Learn by playing. Keep a plant alive in a downpour, or guess the animal from its silhouette.
          </p>
        </div>

        <GlassCard className="grid items-center gap-10 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-100 px-4 py-1 text-sm font-extrabold text-ocean-600">
              <CloudRain size={15} aria-hidden="true" />
              Playable now · Plants
            </span>
            <h3 className="font-heading text-3xl font-semibold sm:text-4xl">Catch the rain</h3>
            <p className="max-w-xl leading-relaxed text-bark/80">
              Slide a potted plant under the falling drops. Catch them to fill the health meter
              and grow the plant; miss too many and it wilts. The storm gets heavier every 20
              seconds.
            </p>
            <div className="flex flex-wrap gap-2">
              {gameTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-leaf-600/15 bg-leaf-100 px-3 py-1 text-sm font-extrabold text-leaf-700"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              to="/games/catch-the-rain"
              className="group mt-1 inline-flex min-h-13 items-center gap-2 rounded-full bg-leaf-600 px-7 text-lg font-bold text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              Play Catch the rain
              <ArrowRight size={20} className="transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-xs">
            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-ocean-100 via-cream to-leaf-100 shadow-xl dark:from-[#0b1024] dark:via-[#16233c] dark:to-[#143a2b]">
              <CloudRain
                className="h-full w-full p-12 text-ocean-600/70 dark:text-ocean-600"
                strokeWidth={0.8}
              />
            </div>
            <span className="glass absolute -left-3 top-8 flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                <Sprout size={16} />
              </span>
              Grows as you catch
            </span>
            <span className="glass absolute -right-2 bottom-10 flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean-100 text-ocean-600">
                <Droplets size={16} />
              </span>
              Health meter
            </span>
          </div>
        </GlassCard>

        <GlassCard className="grid items-center gap-10 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sun-100 px-4 py-1 text-sm font-extrabold text-sun-500">
              <PawPrint size={15} aria-hidden="true" />
              Playable now · Animals
            </span>
            <h3 className="font-heading text-3xl font-semibold sm:text-4xl">Guess the animal</h3>
            <p className="max-w-xl leading-relaxed text-bark/80">
              A black silhouette appears. Type the animal's name and use autocomplete to find it.
              Five hearts, 25 seconds per round — animals get rarer as you progress.
            </p>
            <div className="flex flex-wrap gap-2">
              {guessTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-sun-400/20 bg-sun-100 px-3 py-1 text-sm font-extrabold text-sun-500"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              to="/games/guess-the-animal"
              className="group mt-1 inline-flex min-h-13 items-center gap-2 rounded-full bg-sun-500 px-7 text-lg font-bold text-ink shadow-lg transition hover:-translate-y-0.5 hover:bg-sun-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-500"
            >
              Play Guess the animal
              <ArrowRight size={20} className="transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-xs">
            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-sun-100 via-cream to-leaf-100 shadow-xl dark:from-[#241a06] dark:via-[#1c1c10] dark:to-[#143a2b]">
              <PawPrint
                className="h-full w-full p-12 text-sun-500/60 dark:text-sun-500"
                strokeWidth={0.8}
              />
            </div>
            <span className="glass absolute -left-3 top-8 flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sun-100 text-sun-500">
                <PawPrint size={16} />
              </span>
              Identify by shape
            </span>
            <span className="glass absolute -right-2 bottom-10 flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                <Droplets size={16} />
              </span>
              Learn every round
            </span>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}

export default Home
