import { Droplets, Earth, Flower2, Sun } from 'lucide-react'
import TopicHero from '../components/TopicHero'
import GrowLab from '../components/activities/GrowLab'
import FieldGuide from '../components/FieldGuide'
import ArticlePreview from '../components/ArticlePreview'
import TopicQuiz from '../components/TopicQuiz'
import NextTopic from '../components/NextTopic'
import { plantGroups, plants, plantsQuiz } from '../data/plants'
import { articles } from '../data/home'

const article = articles.find((entry) => entry.topic === 'Plants')

function Plants() {
  return (
    <div className="space-y-20">
      <TopicHero
        kicker="Topic two · Plants"
        kickerClass="bg-leaf-100 text-leaf-700"
        title="Plants are"
        highlight="solar-powered."
        highlightClass="text-leaf-600"
        description="No mouth, no stomach, no problem. Plants build their own food from light, water and air — and hand us the oxygen as a bonus."
        icon={Flower2}
        orb="bg-linear-to-br from-leaf-100 via-leaf-500 to-leaf-700 dark:from-[#0c2a19] dark:via-[#1f8a4c] dark:to-[#166534]"
        chips={[
          { icon: Flower2, label: '10 plants' },
          { icon: Droplets, label: 'Water from roots' },
          { icon: Sun, label: 'Food from light' },
        ]}
        secondaryLabel="Open the grow lab"
      />

      <GrowLab />

      <FieldGuide
        title="A field guide to green"
        description="Trees, flowers, water plants and a few odd ones. Tap a card to see how it lives."
        items={plants}
        groups={plantGroups}
        accentClass="bg-leaf-600 text-cream"
      />

      {article && (
        <section aria-label="Full story" className="space-y-4">
          <p className="px-2 text-sm font-extrabold text-bark/60">Full story</p>
          <ArticlePreview article={article} flip showLink={false} />
        </section>
      )}

      <TopicQuiz
        title={plantsQuiz.title}
        description={plantsQuiz.description}
        questions={plantsQuiz.questions}
        accentClass="bg-leaf-600 text-cream"
      />

      <NextTopic
        to="/environment"
        title="Environment"
        text="Plants make the air and hold the soil. Keeping that system healthy is the environment story."
        icon={Earth}
        visual="bg-ocean-600 text-cream"
      />
    </div>
  )
}

export default Plants
