import {
  Bug,
  Droplets,
  Flower2,
  Leaf,
  Sprout,
  Sun,
  TreePine,
  Trees,
  Waves,
  Wind,
} from 'lucide-react'

export const plantGroups = ['Trees', 'Flowers', 'Water plants', 'Weird plants']

export const plants = [
  {
    id: 'oak',
    name: 'Oak tree',
    group: 'Trees',
    superpower: 'Feeds hundreds of species at once',
    icon: TreePine,
    visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
    stats: [
      { label: 'Height', value: 'Up to 40 m' },
      { label: 'Age', value: 'Up to 1,000 years' },
      { label: 'Wildlife', value: '500+ species' },
    ],
    media: [
      { label: 'The canopy', icon: TreePine, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
      { label: 'Acorns', icon: Sprout, visual: 'bg-linear-to-br from-[#e3d3b5] to-[#a98a5c] text-white' },
      { label: 'The bark', icon: Trees, visual: 'bg-linear-to-br from-[#d8ceb8] to-[#8a7a5e] text-white' },
    ],
    intro:
      'An oak is not one home but a whole neighbourhood. Its roots, bark, leaves and acorns feed and shelter hundreds of other living things.',
    facts: [
      'A single oak can support more than 500 species of insects, birds, fungi and lichens.',
      'Jays bury acorns for winter and forget some, which plants new oaks.',
      'Oaks can live for a thousand years and keep growing the whole time.',
    ],
    didYouKnow:
      'An oak produces acorns only after about 40 years, so a new tree is a long-term project.',
  },
  {
    id: 'mangrove',
    name: 'Mangrove',
    group: 'Trees',
    superpower: 'Drinks salt water and survives',
    icon: Trees,
    visual: 'bg-linear-to-br from-leaf-100 to-ocean-600 text-white',
    stats: [
      { label: 'Roots', value: 'Above the mud' },
      { label: 'Salt', value: 'Filtered out' },
      { label: 'Home', value: 'Coastlines' },
    ],
    media: [
      { label: 'The roots', icon: Trees, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
      { label: 'The coast', icon: Waves, visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white' },
      { label: 'The nursery', icon: Droplets, visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-500 text-white' },
    ],
    intro:
      'Mangroves grow where river meets sea, standing in salty mud on roots that reach up out of the water.',
    facts: [
      'Their roots filter out most of the salt before it reaches the leaves.',
      'The stilt roots take in air, because the mud below has almost no oxygen.',
      'Fish and crabs use the tangled roots as a nursery for their young.',
    ],
    didYouKnow:
      'Mangrove belts soften storm waves before they reach the shore, protecting villages behind them.',
  },
  {
    id: 'bamboo',
    name: 'Bamboo',
    group: 'Trees',
    superpower: 'Grows up to 90 cm in a day',
    icon: Sprout,
    visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
    stats: [
      { label: 'Growth', value: '90 cm a day' },
      { label: 'Height', value: 'Up to 30 m' },
      { label: 'Family', value: 'Grass' },
    ],
    media: [
      { label: 'The shoot', icon: Sprout, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
      { label: 'The stem', icon: Trees, visual: 'bg-linear-to-br from-[#e2ebd8] to-[#6d8a4f] text-white' },
      { label: 'The grove', icon: Trees, visual: 'bg-linear-to-br from-[#dcf1dc] to-leaf-600 text-white' },
    ],
    intro:
      'Bamboo looks like a tree and grows like a race. It is actually a grass, and some species add almost a metre a day.',
    facts: [
      'The stem is hollow and divided into sections by joints called nodes.',
      'Bamboo spreads underground and sends up new shoots from the same roots.',
      'Many bamboos flower only once every few decades, then die.',
    ],
    didYouKnow:
      'Because it regrows from the roots, bamboo can be harvested without replanting the whole crop.',
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    group: 'Flowers',
    superpower: 'Turns its head to follow the sun',
    icon: Flower2,
    visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-bark',
    stats: [
      { label: 'Height', value: 'Up to 3 m' },
      { label: 'Seeds', value: '2,000 per head' },
      { label: 'Family', value: 'Daisy' },
    ],
    media: [
      { label: 'Facing the sun', icon: Sun, visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-bark' },
      { label: 'The head', icon: Flower2, visual: 'bg-linear-to-br from-[#ffe6b8] to-sun-500 text-bark' },
      { label: 'The seeds', icon: Sprout, visual: 'bg-linear-to-br from-[#e3d3b5] to-[#8a7a5e] text-white' },
    ],
    intro:
      'Young sunflowers follow the sun across the sky, then settle facing east when they are fully grown.',
    facts: [
      'The seed head can hold more than 2,000 seeds.',
      'Seeds are arranged in two spirals, often 34 and 55, which pack space perfectly.',
      'Bees use the flower as a landing pad and pick up pollen while they feed.',
    ],
    didYouKnow:
      'A field of sunflowers facing the same way can warm the air above it.',
  },
  {
    id: 'rafflesia',
    name: 'Rafflesia',
    group: 'Flowers',
    superpower: 'Grows the biggest flower on Earth',
    icon: Flower2,
    visual: 'bg-linear-to-br from-[#f3c6c6] to-[#a63d3d] text-white',
    stats: [
      { label: 'Width', value: 'About 1 m' },
      { label: 'Smell', value: 'Rotting meat' },
      { label: 'Leaves', value: 'None' },
    ],
    media: [
      { label: 'The bloom', icon: Flower2, visual: 'bg-linear-to-br from-[#f3c6c6] to-[#a63d3d] text-white' },
      { label: 'The host', icon: Trees, visual: 'bg-linear-to-br from-[#e3d3b5] to-[#8a7a5e] text-white' },
      { label: 'The flies', icon: Bug, visual: 'bg-linear-to-br from-[#e2ebd8] to-[#5b6b4a] text-white' },
    ],
    intro:
      'Rafflesia has no leaves, no stem and no roots. It lives as threads inside a vine and bursts out as a giant flower.',
    facts: [
      'It smells of rotting meat, which attracts the flies that pollinate it.',
      'The flower can weigh as much as a small child.',
      'It takes months to develop and lasts only a few days.',
    ],
    didYouKnow:
      'Because it has no leaves, rafflesia cannot make its own food. It takes everything from its host vine.',
  },
  {
    id: 'venus-flytrap',
    name: 'Venus flytrap',
    group: 'Weird plants',
    superpower: 'Counts to two before it snaps',
    icon: Bug,
    visual: 'bg-linear-to-br from-leaf-100 to-[#8c3f5e] text-white',
    stats: [
      { label: 'Trap', value: 'About 3 cm' },
      { label: 'Snap', value: '0.1 seconds' },
      { label: 'Diet', value: 'Insects' },
    ],
    media: [
      { label: 'The trap', icon: Bug, visual: 'bg-linear-to-br from-leaf-100 to-[#8c3f5e] text-white' },
      { label: 'The trigger', icon: Wind, visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white' },
      { label: 'The bog', icon: Droplets, visual: 'bg-linear-to-br from-[#dcf1dc] to-leaf-600 text-white' },
    ],
    intro:
      'The Venus flytrap grows in boggy soil that has almost no nutrients, so it catches its own.',
    facts: [
      'It needs two touches of its trigger hairs within about 20 seconds to close.',
      'The trap is a modified leaf, not a mouth.',
      'It flowers on a tall stalk so that pollinating insects are not eaten.',
    ],
    didYouKnow:
      'Counting the touches stops the trap wasting energy on raindrops and stray bits of debris.',
  },
  {
    id: 'cactus',
    name: 'Cactus',
    group: 'Weird plants',
    superpower: 'Stores water for months',
    icon: Sprout,
    visual: 'bg-linear-to-br from-[#e2ebd8] to-[#8a9a5b] text-white',
    stats: [
      { label: 'Water', value: 'Months of supply' },
      { label: 'Spines', value: 'Modified leaves' },
      { label: 'Roots', value: 'Wide and shallow' },
    ],
    media: [
      { label: 'The stem', icon: Sprout, visual: 'bg-linear-to-br from-[#e2ebd8] to-[#8a9a5b] text-white' },
      { label: 'The spines', icon: Sun, visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-bark' },
      { label: 'The desert', icon: Sun, visual: 'bg-linear-to-br from-[#ffe6b8] to-[#e08a3c] text-bark' },
    ],
    intro:
      'A cactus is built to hold water. Its stem swells after rain, and its leaves have become spines to save every drop.',
    facts: [
      'Spines are leaves, reduced so the plant loses almost no water through them.',
      'The stem does the photosynthesis that leaves normally do.',
      'Shallow roots spread wide to catch rain before it soaks away.',
    ],
    didYouKnow:
      'A saguaro cactus can drink hundreds of litres in one storm and live on that for a year.',
  },
  {
    id: 'moss',
    name: 'Moss',
    group: 'Weird plants',
    superpower: 'Drinks straight through its leaves',
    icon: Leaf,
    visual: 'bg-linear-to-br from-[#e2ebd8] to-[#4f6b3a] text-white',
    stats: [
      { label: 'Height', value: 'About 5 cm' },
      { label: 'Water', value: 'Soaks up like a sponge' },
      { label: 'Roots', value: 'None' },
    ],
    media: [
      { label: 'The carpet', icon: Leaf, visual: 'bg-linear-to-br from-[#e2ebd8] to-[#4f6b3a] text-white' },
      { label: 'The water', icon: Droplets, visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-500 text-white' },
      { label: 'The shade', icon: Trees, visual: 'bg-linear-to-br from-[#dcf1dc] to-leaf-600 text-white' },
    ],
    intro:
      'Moss has no roots and no proper veins. It lives in damp shade and takes water in through its whole surface.',
    facts: [
      'Moss anchors itself with fine threads called rhizoids, not roots.',
      'It dries out and turns brown, then goes green again when rain returns.',
      'Mosses were among the first plants to grow on land.',
    ],
    didYouKnow:
      'A patch of moss can hold many times its own weight in water, which helps a forest floor stay damp.',
  },
  {
    id: 'duckweed',
    name: 'Duckweed',
    group: 'Water plants',
    superpower: 'Doubles in size every two days',
    icon: Droplets,
    visual: 'bg-linear-to-br from-[#dcf1dc] to-ocean-500 text-white',
    stats: [
      { label: 'Size', value: '1–3 mm' },
      { label: 'Doubling', value: 'Every 2 days' },
      { label: 'Home', value: 'Still ponds' },
    ],
    media: [
      { label: 'The mat', icon: Droplets, visual: 'bg-linear-to-br from-[#dcf1dc] to-ocean-500 text-white' },
      { label: 'The pond', icon: Waves, visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white' },
      { label: 'The ducks', icon: Leaf, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
    ],
    intro:
      'Duckweed floats on still water in a bright green mat. Each plant is barely bigger than a pinhead.',
    facts: [
      'It is one of the smallest flowering plants in the world.',
      'Under good conditions it can double its mass every couple of days.',
      'It pulls nutrients out of the water, which can help clean a pond.',
    ],
    didYouKnow:
      'Because it grows so fast, duckweed is being studied as a food and fuel crop.',
  },
  {
    id: 'seagrass',
    name: 'Seagrass',
    group: 'Water plants',
    superpower: 'Flowers underwater',
    icon: Waves,
    visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
    stats: [
      { label: 'Depth', value: '0–50 m' },
      { label: 'Flowers', value: 'Underwater' },
      { label: 'Stores', value: 'Carbon' },
    ],
    media: [
      { label: 'The meadow', icon: Waves, visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white' },
      { label: 'The flowers', icon: Flower2, visual: 'bg-linear-to-br from-[#dcf1dc] to-leaf-600 text-white' },
      { label: 'The nursery', icon: Droplets, visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-500 text-white' },
    ],
    intro:
      'Seagrass is a flowering plant that lives in the sea. It grows in meadows that shelter young fish and turtles.',
    facts: [
      'It pollinates underwater, which is rare for a flowering plant.',
      'Its roots hold the seabed together and keep the water clear.',
      'Seagrass meadows store carbon in the mud below them for centuries.',
    ],
    didYouKnow:
      'A seagrass meadow can be as productive as a rainforest, hectare for hectare.',
  },
]

// ------------------------------------------------------------- grow lab tips
export const growLabTips = {
  happy: 'Everything is in balance. This plant has the light, water and soil it needs.',
  thirsty: 'The soil is too dry. Without water the plant cannot stand up or make food.',
  soggy: 'The soil is waterlogged. Roots need air pockets to breathe, so this plant is drowning.',
  dark: 'There is not enough light. The plant stretches upward and turns pale looking for the sun.',
  scorched: 'Too much direct sun. The leaves are losing water faster than the roots can replace it.',
  sandy: 'Sandy soil drains fast, so water slips away before the roots can drink.',
}

export const plantsQuiz = {
  title: 'What does a plant actually need?',
  description: 'Three questions about how plants live. No green thumb required.',
  questions: [
    {
      question: 'Where does a plant’s food actually come from?',
      options: ['The soil', 'Sunlight, water and air', 'Fertiliser', 'The roots only'],
      answer: 1,
      explain:
        'Roots take up water and minerals, but the food itself is built in the leaves from water, carbon dioxide and light.',
    },
    {
      question: 'Why do desert plants often have spines instead of big leaves?',
      options: [
        'Spines scare away rain',
        'Leaves would freeze',
        'Spines lose far less water',
        'Spines help them swim',
      ],
      answer: 2,
      explain:
        'Leaves lose water through their surface, so turning them into spines saves water in dry places.',
    },
    {
      question: 'What happens if a plant gets too much water?',
      options: [
        'It grows faster forever',
        'The roots cannot get air',
        'It makes extra flowers',
        'Nothing changes',
      ],
      answer: 1,
      explain:
        'Waterlogged soil pushes air out. Roots need oxygen too, so they can rot when the soil stays soaked.',
    },
  ],
}
