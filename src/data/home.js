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
    badge: 'bg-sun-400 text-ink',
    tagStyle: 'bg-sun-100',
    tags: ['Mammals', 'Birds', 'Insects'],
  },
  {
    to: '/plants',
    title: 'Plants',
    text: 'Explore the world of plants! Learn how they absorb energy, produce their own food, and generate the vital oxygen that keeps us alive.',
    icon: Sprout,
    badge: 'bg-leaf-600 text-cream',
    tagStyle: 'bg-leaf-100',
    tags: ['Trees', 'Flowers', 'Photosynthesis'],
  },
  {
    to: '/environment',
    title: 'Environment',
    text: 'Discover how living things and our planet depend on each other in delicate ecosystems, and learn practical ways we can help protect them.',
    icon: Earth,
    badge: 'bg-ocean-600 text-cream',
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
    topic: 'Animals',
    text: "A hummingbird's heart can beat more than 1,000 times a minute.",
  },
  {
    topic: 'Animals',
    text: 'Elephants can recognise themselves in a mirror.',
  },
  {
    topic: 'Animals',
    text: 'Dolphins call to each other using signature whistles, almost like names.',
  },
  {
    topic: 'Animals',
    text: 'Tardigrades can survive being frozen, dried out, and even the vacuum of space.',
  },
  {
    topic: 'Animals',
    text: "A chameleon's tongue can shoot out twice as far as its body is long.",
  },
  {
    topic: 'Animals',
    text: 'Crows can recognise and remember human faces for years.',
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
    topic: 'Plants',
    text: 'Bamboo can grow almost a metre in a single day.',
  },
  {
    topic: 'Plants',
    text: 'A sunflower head is made of thousands of tiny flowers packed together.',
  },
  {
    topic: 'Plants',
    text: 'Some seeds can wait decades in the soil before they sprout.',
  },
  {
    topic: 'Plants',
    text: "The world's largest flower smells like rotting meat to attract flies.",
  },
  {
    topic: 'Plants',
    text: 'Trees share water and nutrients through fungal networks in the soil.',
  },
  {
    topic: 'Plants',
    text: 'Cactus spines are really leaves, shaped to save water.',
  },
  {
    topic: 'Environment',
    text: 'Glass can be recycled again and again without losing quality.',
  },
  {
    topic: 'Environment',
    text: 'Banana peels and other food scraps can be composted into rich soil.',
  },
  {
    topic: 'Environment',
    text: 'An aluminium can be recycled and back on a shelf in about two months.',
  },
  {
    topic: 'Environment',
    text: 'Millions of tonnes of plastic reach the ocean every year.',
  },
  {
    topic: 'Environment',
    text: 'A dripping tap can waste thousands of litres of water a year.',
  },
  {
    topic: 'Environment',
    text: 'Food buried in landfill releases methane as it rots.',
  },
  {
    topic: 'Environment',
    text: 'Paper can usually be recycled about five times before its fibres wear out.',
  },
  {
    topic: 'Environment',
    text: 'It can take thousands of litres of water to grow cotton for one T-shirt.',
  },
]

// Article previews. Each article has three selectable sections.
// Full class names are written out so Tailwind can find them.
export const articles = [
  {
    id: 'winter',
    topic: 'Animals',
    to: '/animals',
    readTime: '2 min read',
    dot: 'bg-sun-400',
    visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
    title: 'How do animals survive the winter?',
    lede: 'When food gets scarce and the days get cold, animals have three big options: leave, sleep through it, or toughen up.',
    steps: [
      {
        id: 'migrate',
        label: 'Migrate',
        icon: Bird,
        text: 'Some animals travel to find food and water. Wildebeest herds cross rivers, white rhinos roam dusty tracks, and geese fly in formation to share the effort.',
        images: [
          { src: '/images/home/slides/animals-migrate-1.jpg', alt: 'A herd of wildebeest crossing a river' },
          { src: '/images/home/slides/animals-migrate-2.jpg', alt: 'Two white rhinos walking along a dirt track' },
          { src: '/images/home/slides/animals-migrate-3.jpg', alt: 'A flock of geese flying in formation' },
        ],
      },
      {
        id: 'hibernate',
        label: 'Hibernate',
        icon: Moon,
        text: 'When food is scarce, some animals slow right down and sleep through the cold. A brown bear rests in a rocky den, a red fox curls up on a stump, and a hedgehog tucks into a ball among the leaves.',
        images: [
          { src: '/images/home/slides/animals-hibernate-1.jpg', alt: 'A brown bear resting beside a rocky den' },
          { src: '/images/home/slides/animals-hibernate-2.jpg', alt: 'A red fox curled up asleep on a mossy stump' },
          { src: '/images/home/slides/animals-hibernate-3.jpg', alt: 'A hedgehog curled up asleep among green leaves' },
        ],
      },
      {
        id: 'adapt',
        label: 'Adapt',
        icon: Snowflake,
        text: "Others stay put and are built for their home. A tiger's stripes hide it in the grass, a giraffe reaches high leaves, and a sable antelope grazes the open savanna.",
        images: [
          { src: '/images/home/slides/animals-adapt-1.jpg', alt: 'A tiger resting on a rock' },
          { src: '/images/home/slides/animals-adapt-2.jpg', alt: 'A giraffe standing among tall green plants' },
          { src: '/images/home/slides/animals-adapt-3.jpg', alt: 'A sable antelope grazing in a green field' },
        ],
      },
    ],
  },
  {
    id: 'food',
    topic: 'Plants',
    to: '/plants',
    readTime: '2 min read',
    dot: 'bg-leaf-500',
    visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
    title: 'How do plants make their own food?',
    lede: "Plants don't eat. They build food from three simple ingredients, and give us oxygen along the way.",
    steps: [
      {
        id: 'sunlight',
        label: 'Sunlight',
        icon: Sun,
        text: 'Leaves are built to catch light. Sunlight pours across a wildflower meadow, filters through branches, and glows through a leaf, showing the veins that carry water and sugar.',
        images: [
          { src: '/images/home/slides/plants-sunlight-1.jpg', alt: 'A wildflower meadow lit by low sunlight' },
          { src: '/images/home/slides/plants-sunlight-2.jpg', alt: 'Sunlight filtering through leafy branches' },
          { src: '/images/home/slides/plants-sunlight-3.jpg', alt: 'A backlit leaf showing its veins' },
        ],
      },
      {
        id: 'water',
        label: 'Water',
        icon: Droplets,
        text: 'Water reaches a plant from above and below. A sprinkler soaks rows of lettuce, rain beads on broad leaves, and droplets cling to the surface before soaking in.',
        images: [
          { src: '/images/home/slides/plants-water-1.jpg', alt: 'A sprinkler watering rows of lettuce' },
          { src: '/images/home/slides/plants-water-2.jpg', alt: 'Raindrops beading on broad green leaves' },
          { src: '/images/home/slides/plants-water-3.jpg', alt: 'Water droplets covering dark green leaves' },
        ],
      },
      {
        id: 'air',
        label: 'Air',
        icon: Wind,
        text: 'Plants breathe through their leaves. Tiny openings take in carbon dioxide and release oxygen, so even a room full of houseplants is quietly cleaning the air.',
        images: [
          { src: '/images/home/slides/plants-air-1.jpg', alt: 'A collection of potted houseplants' },
          { src: '/images/home/slides/plants-air-2.jpg', alt: 'Close-up of a monstera leaf' },
          { src: '/images/home/slides/plants-air-3.jpg', alt: 'Houseplants arranged in a bright room' },
        ],
      },
    ],
  },
  {
    id: 'trash',
    topic: 'Environment',
    to: '/environment',
    readTime: '2 min read',
    dot: 'bg-ocean-500',
    visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
    title: 'Where does your trash go?',
    lede: 'Throwing something away is only the middle of its journey. The best choices happen before it ever reaches the bin.',
    steps: [
      {
        id: 'reduce',
        label: 'Reduce',
        icon: Minimize2,
        text: 'The best waste is the waste never made. Piles of used bulbs, discarded electronics, and single-use bottles show what builds up behind our choices. Durable products and less packaging cut it at the source.',
        images: [
          { src: '/images/home/slides/env-reduce-1.jpg', alt: 'A pile of used light bulbs' },
          { src: '/images/home/slides/env-reduce-2.jpg', alt: 'A heap of discarded electronics' },
          { src: '/images/home/slides/env-reduce-3.jpg', alt: 'Clear plastic bottles collected in a bin' },
        ],
      },
      {
        id: 'reuse',
        label: 'Reuse',
        icon: Repeat,
        text: 'Things can get a second life before they become waste. A cat sculpture built from scrap, a whale made of plastic bottles, and bales of cardboard all show materials being used again.',
        images: [
          { src: '/images/home/slides/env-reuse-1.jpg', alt: 'A cat sculpture built from recycled materials' },
          { src: '/images/home/slides/env-reuse-2.jpg', alt: 'A whale sculpture made from plastic bottles' },
          { src: '/images/home/slides/env-reuse-3.jpg', alt: 'Bales of mixed paper and cardboard' },
        ],
      },
      {
        id: 'recycle',
        label: 'Recycle',
        icon: Recycle,
        text: 'Recycling starts with sorting. Bins for compost, waste and recycling, crushed plastic bottles, and bundled cardboard show how used material becomes raw material again.',
        images: [
          { src: '/images/home/slides/env-recycle-1.jpg', alt: 'Three bins labelled compost, waste and recycle' },
          { src: '/images/home/slides/env-recycle-2.jpg', alt: 'A pile of crushed plastic bottles' },
          { src: '/images/home/slides/env-recycle-3.jpg', alt: 'Bundles of flattened cardboard on pallets' },
        ],
      },
    ],
  },
]
