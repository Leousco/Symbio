import { MapPin, PawPrint, Snowflake, Sprout } from 'lucide-react'
import TopicHero from '../components/TopicHero'
import HabitatHopper from '../components/activities/HabitatHopper'
import FieldGuide from '../components/FieldGuide'
import ArticlePreview from '../components/ArticlePreview'
import TopicQuiz from '../components/TopicQuiz'
import NextTopic from '../components/NextTopic'
import { animalGroups, animals, animalsQuiz } from '../data/animals'
import { articles } from '../data/home'

const article = articles.find((entry) => entry.topic === 'Animals')

function Animals() {
  return (
    <div className="space-y-20">
      <TopicHero
        kicker="Topic one · Animals"
        kickerClass="bg-sun-100 text-[#8a6d1f] dark:text-sun-400"
        title="Every animal has"
        highlight="a trick."
        highlightClass="text-sun-500"
        description="From frogs that freeze solid to foxes that hear insects under the sand. Pick a habitat, then open the field guide to meet ten creatures up close."
        icon={PawPrint}
        orb="bg-linear-to-br from-sun-100 via-sun-400 to-[#e08a3c] dark:from-[#3a2c12] dark:via-[#b5741f] dark:to-[#6b3f12]"
        chips={[
          { icon: PawPrint, label: '10 creatures' },
          { icon: MapPin, label: '4 habitats' },
          { icon: Snowflake, label: 'Survives -60°C' },
        ]}
        secondaryLabel="Try the habitat hopper"
      />

      <HabitatHopper />

      <FieldGuide
        title="Meet the neighbours"
        description="Ten creatures, one superpower each. Tap a card to open its full story."
        items={animals}
        groups={animalGroups}
        accentClass="bg-sun-500 text-ink"
      />

      {article && (
        <section aria-label="Full story" className="space-y-4">
          <p className="px-2 text-sm font-extrabold text-bark/60">Full story</p>
          <ArticlePreview article={article} showLink={false} />
        </section>
      )}

      <TopicQuiz
        title={animalsQuiz.title}
        description={animalsQuiz.description}
        questions={animalsQuiz.questions}
        accentClass="bg-sun-500 text-ink"
      />

      <NextTopic
        to="/plants"
        title="Plants"
        text="Almost every animal food chain starts with a plant making its own food from sunlight."
        icon={Sprout}
        visual="bg-leaf-600 text-cream"
      />
    </div>
  )
}

export default Animals
