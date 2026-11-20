import { Earth, PawPrint, Recycle, Trees, Waves } from 'lucide-react'
import TopicHero from '../components/TopicHero'
import SortItOut from '../components/activities/SortItOut'
import FieldGuide from '../components/FieldGuide'
import ArticlePreview from '../components/ArticlePreview'
import TopicQuiz from '../components/TopicQuiz'
import NextTopic from '../components/NextTopic'
import { environmentEntries, environmentGroups, environmentQuiz } from '../data/environment'
import { articles } from '../data/home'

const article = articles.find((entry) => entry.topic === 'Environment')

function Environment() {
  return (
    <div className="space-y-20">
      <TopicHero
        kicker="Topic three · Environment"
        kickerClass="bg-ocean-100 text-ocean-600"
        title="Everything is"
        highlight="connected."
        highlightClass="text-ocean-600"
        description="A bottle dropped on land can end up in a fish. Sort the waste, meet the ideas behind it, and find the small choices that add up."
        icon={Earth}
        orb="bg-linear-to-br from-ocean-100 via-ocean-500 to-ocean-600 dark:from-[#1b1740] dark:via-[#5b49b8] dark:to-[#6d4ad6]"
        chips={[
          { icon: Recycle, label: '12 things to sort' },
          { icon: Waves, label: 'Land to sea' },
          { icon: Trees, label: '15 big ideas' },
        ]}
        secondaryLabel="Play sort it out"
      />

      <SortItOut />

      <FieldGuide
        title="The ideas behind the bins"
        description="Fifteen cards in three layers: the four bins, one material for each, then the places your choices reach. Tap a card for what it is and what you can do."
        items={environmentEntries}
        groups={environmentGroups}
        accentClass="bg-ocean-600 text-cream"
        pageSize={9}
        randomCardPhoto
      />

      {article && (
        <section aria-label="Full story" className="space-y-4">
          <p className="px-2 text-sm font-extrabold text-bark/60">Full story</p>
          <ArticlePreview article={article} showLink={false} />
        </section>
      )}

      <TopicQuiz
        title={environmentQuiz.title}
        description={environmentQuiz.description}
        questions={environmentQuiz.questions}
        accentClass="bg-ocean-600 text-cream"
      />

      <NextTopic
        to="/animals"
        title="Animals"
        text="Every habitat we protect is a home for something. Meet the creatures that live in them."
        icon={PawPrint}
        visual="bg-sun-500 text-ink"
      />
    </div>
  )
}

export default Environment
