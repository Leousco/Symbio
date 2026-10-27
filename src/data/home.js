import {
  PawPrint,
  Sprout,
  Earth,
  Bird,
  Moon,
  Snowflake,
  Sun,
  Droplets,
  Wind,
  Minimize2,
  Repeat,
  Recycle,
} from 'lucide-react'

// Topic cards shown under the hero
export const topics = [
  {
    to: '/animals',
    title: 'Animals',
    text: 'Step into the animal kingdom! Meet creatures big and small from around the globe and discover how they live, adapt, and thrive in the wild.',
    icon: PawPrint,
    badge: 'bg-sun-400 text-bark',
    tagStyle: 'bg-sun-100',
    tags: ['Mammals', 'Birds', 'Insects'],
  },
  {
    to: '/plants',
    title: 'Plants',
    text: 'Explore the world of plants! Learn how they absorb energy, produce their own food, and generate the vital oxygen that keeps us alive.',
    icon: Sprout,
    badge: 'bg-leaf-600 text-white',
    tagStyle: 'bg-leaf-100',
    tags: ['Trees', 'Flowers', 'Photosynthesis'],
  },
  {
    to: '/environment',
    title: 'Environment',
    text: 'Discover how living things and our planet depend on each other in delicate ecosystems, and learn practical ways we can help protect them.',
    icon: Earth,
    badge: 'bg-ocean-600 text-white',
    tagStyle: 'bg-ocean-100',
    tags: ['Recycling', 'Pollution', 'Ecosystems'],
  },
]

// Fact of the Day pool.
// TODO: add a source for each fact before the final version.
export const facts = [
  { topic: 'Animals', text: 'An octopus has three hearts and blue blood.' },
  {
    topic: 'Animals',
    text: 'Monarch butterflies fly thousands of kilometres to reach the same winter forests.',
  },
  {
    topic: 'Animals',
    text: 'Wood frogs can freeze solid in winter and thaw out alive in spring.',
  },
  {
    topic: 'Plants',
    text: 'Plants make their own food using sunlight, water, and air.',
  },
  {
    topic: 'Plants',
    text: 'Plants release oxygen into the air as they make their food.',
  },
  {
    topic: 'Environment',
    text: 'Glass can be recycled again and again without losing quality.',
  },
  {
    topic: 'Environment',
    text: 'Banana peels and other food scraps can be composted into rich soil.',
  },
]

// Article previews. Each article has three selectable sections.
// Full class names are written out so Tailwind can find them.
export const articles = [
  {
    id: 'winter',
    topic: 'Animals',
    to: '/animals',
    // readTime: '2 min read',
    dot: 'bg-sun-400',
    visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-bark',
    title: 'How do animals survive the winter?',
    lede: 'When food gets scarce and the days get cold, animals have three big options: leave, sleep through it, or toughen up.',
    steps: [
      {
        id: 'migrate',
        label: 'Migrate',
        icon: Bird,
        text: 'Many birds and butterflies travel long distances to warmer places. Monarch butterflies fly thousands of kilometres to spend the winter in the same forests.',
      },
      {
        id: 'hibernate',
        label: 'Hibernate',
        icon: Moon,
        text: 'Some animals slow their bodies right down and rest through the coldest months, using very little energy. Wood frogs even freeze solid and thaw out again in spring.',
      },
      {
        id: 'adapt',
        label: 'Adapt',
        icon: Snowflake,
        text: 'Others stay put and change. A thicker coat, extra fat, or huddling together keeps them warm, like emperor penguins standing in a tight group.',
      },
    ],
  },
  {
    id: 'food',
    topic: 'Plants',
    to: '/plants',
    // readTime: '2 min read',
    dot: 'bg-leaf-500',
    visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
    title: 'How do plants make their own food?',
    lede: "Plants don't eat. They build food from three simple ingredients, and give us oxygen along the way.",
    steps: [
      {
        id: 'sunlight',
        label: 'Sunlight',
        icon: Sun,
        text: 'Leaves catch sunlight with a green substance called chlorophyll. That light is the energy that powers the whole process.',
      },
      {
        id: 'water',
        label: 'Water',
        icon: Droplets,
        text: 'Roots soak up water from the soil, and it travels up the stem to the leaves.',
      },
      {
        id: 'air',
        label: 'Air',
        icon: Wind,
        text: 'Leaves take in carbon dioxide from the air through tiny openings. Using the energy from light, the plant turns water and carbon dioxide into sugar and releases oxygen.',
      },
    ],
  },
  {
    id: 'trash',
    topic: 'Environment',
    to: '/environment',
    // readTime: '2 min read',
    dot: 'bg-ocean-500',
    visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
    title: 'Where does your trash go?',
    lede: 'Throwing something away is only the middle of its journey. The best choices happen before it ever reaches the bin.',
    steps: [
      {
        id: 'reduce',
        label: 'Reduce',
        icon: Minimize2,
        text: 'The easiest trash to handle is the trash that never exists. Choosing less packaging and only taking what you need comes first.',
      },
      {
        id: 'reuse',
        label: 'Reuse',
        icon: Repeat,
        text: "Refill a bottle, repair a bag, or pass on clothes you've outgrown. Every reuse saves the resources used to make something new.",
      },
      {
        id: 'recycle',
        label: 'Recycle',
        icon: Recycle,
        text: 'Clean, sorted plastic, paper, glass, and metal can be turned into new products. Food scraps can be composted into soil.',
      },
    ],
  },
]
