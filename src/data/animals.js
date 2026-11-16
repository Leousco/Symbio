import {
  Bird,
  Bug,
  Droplets,
  Feather,
  Fish,
  Home,
  Leaf,
  MapPin,
  Moon,
  Mountain,
  PawPrint,
  Shell,
  Snowflake,
  Sparkles,
  Sun,
  Thermometer,
  Turtle,
  Waves,
  Wind,
} from 'lucide-react'

export const animalGroups = ['Mammals', 'Birds', 'Insects', 'Water']

export const animals = [
  {
    id: 'wolf',
    name: 'Grey wolf',
    group: 'Mammals',
    superpower: 'A howl that carries for kilometres',
    icon: PawPrint,
    visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-bark',
    stats: [
      { label: 'Length', value: '1–1.6 m' },
      { label: 'Pack', value: '6–10 wolves' },
      { label: 'Diet', value: 'Carnivore' },
    ],
    media: [
      { label: 'The pack', icon: PawPrint, visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-bark' },
      { label: 'The howl', icon: Wind, visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white' },
      { label: 'Winter coat', icon: Snowflake, visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white' },
    ],
    intro:
      'Wolves live in family packs and hunt together, which lets them take on animals far bigger than one wolf could manage alone.',
    facts: [
      'A howl can be heard several kilometres away and helps the pack find each other.',
      'Only the lead pair usually has pups, and the whole pack helps raise them.',
      'A wolf may walk more than 30 km in a single day while searching for food.',
    ],
    didYouKnow:
      'Wolves do not howl at the moon. They howl at night because the air is still and the sound travels further.',
  },
  {
    id: 'emperor-penguin',
    name: 'Emperor penguin',
    group: 'Birds',
    superpower: 'Survives Antarctic winters at -60°C',
    icon: Bird,
    visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
    stats: [
      { label: 'Height', value: '1.1 m' },
      { label: 'Dive', value: '500 m deep' },
      { label: 'Diet', value: 'Fish and squid' },
    ],
    media: [
      { label: 'The huddle', icon: Bird, visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white' },
      { label: 'The ice', icon: Snowflake, visual: 'bg-linear-to-br from-white to-ocean-100 text-ocean-600' },
      { label: 'The dive', icon: Waves, visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white' },
    ],
    intro:
      'Emperor penguins breed in the middle of the Antarctic winter, when the sun does not rise and the temperature drops far below freezing.',
    facts: [
      'The male balances a single egg on his feet for around two months without eating.',
      'Birds in a huddle shuffle in a slow circle so each one takes a turn on the warm inside.',
      'They can hold their breath for more than 20 minutes and dive deeper than most submarines.',
    ],
    didYouKnow:
      'A huddle of emperor penguins can be thousands strong, and the whole group moves like one slow animal.',
  },
  {
    id: 'monarch',
    name: 'Monarch butterfly',
    group: 'Insects',
    superpower: 'Navigates 4,000 km without a map',
    icon: Bug,
    visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-bark',
    stats: [
      { label: 'Wingspan', value: 'About 10 cm' },
      { label: 'Journey', value: 'Up to 4,000 km' },
      { label: 'Diet', value: 'Nectar' },
    ],
    media: [
      { label: 'The journey', icon: MapPin, visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-bark' },
      { label: 'Milkweed', icon: Leaf, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
      { label: 'Wings', icon: Feather, visual: 'bg-linear-to-br from-[#ffe6c7] to-sun-500 text-bark' },
    ],
    intro:
      'Every autumn, monarchs across North America fly south to the same mountain forests in Mexico — places most of them have never seen.',
    facts: [
      'No single butterfly makes the whole round trip. It takes two or three generations.',
      'Caterpillars eat milkweed, which makes them poisonous to many predators.',
      'They use the position of the sun and an internal body clock to stay on course.',
    ],
    didYouKnow:
      'Millions of monarchs gather on a few hectares of forest, turning whole trees orange.',
  },
  {
    id: 'axolotl',
    name: 'Axolotl',
    group: 'Water',
    superpower: 'Regrows a lost limb, again and again',
    icon: Droplets,
    visual: 'bg-linear-to-br from-[#f6d9e8] to-[#c86f9b] text-white',
    stats: [
      { label: 'Length', value: 'About 25 cm' },
      { label: 'Home', value: 'Mexico City canals' },
      { label: 'Diet', value: 'Worms and insects' },
    ],
    media: [
      { label: 'The lake', icon: Droplets, visual: 'bg-linear-to-br from-[#dff0f7] to-ocean-500 text-white' },
      { label: 'Gills', icon: Waves, visual: 'bg-linear-to-br from-[#f6d9e8] to-[#c86f9b] text-white' },
      { label: 'Regrowth', icon: Sparkles, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
    ],
    intro:
      'The axolotl is a salamander that never quite grows up. It keeps its feathery gills and stays in the water for its whole life.',
    facts: [
      'It can regrow a leg, a tail, and even parts of its heart and brain.',
      'It breathes through its gills and also through its skin.',
      'Wild axolotls live in only a few canals in Mexico and are critically endangered.',
    ],
    didYouKnow:
      'New limbs grow back without a scar, which is why scientists study axolotls so closely.',
  },
  {
    id: 'octopus',
    name: 'Octopus',
    group: 'Water',
    superpower: 'Nine brains and three hearts',
    icon: Shell,
    visual: 'bg-linear-to-br from-[#f3c6c6] to-[#b1564e] text-white',
    stats: [
      { label: 'Arms', value: '8' },
      { label: 'Hearts', value: '3' },
      { label: 'Lifespan', value: '1–2 years' },
    ],
    media: [
      { label: 'The arms', icon: Shell, visual: 'bg-linear-to-br from-[#f3c6c6] to-[#b1564e] text-white' },
      { label: 'Blue blood', icon: Droplets, visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white' },
      { label: 'Camouflage', icon: Sparkles, visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-bark' },
    ],
    intro:
      'An octopus has no bones, so it can squeeze through a hole the size of its eye. It can also change colour and texture in less than a second.',
    facts: [
      'Two hearts pump blood to the gills and one pumps it to the rest of the body.',
      'Each arm has its own bundle of nerves and can taste what it touches.',
      'When swimming, the heart that serves the body slows down, which is why octopuses prefer to crawl.',
    ],
    didYouKnow:
      'Their blood is blue because it uses copper instead of iron to carry oxygen.',
  },
  {
    id: 'fennec-fox',
    name: 'Fennec fox',
    group: 'Mammals',
    superpower: 'Hears insects moving under the sand',
    icon: PawPrint,
    visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-bark',
    stats: [
      { label: 'Ears', value: '15 cm long' },
      { label: 'Weight', value: '1.5 kg' },
      { label: 'Diet', value: 'Insects and small animals' },
    ],
    media: [
      { label: 'The ears', icon: Thermometer, visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-bark' },
      { label: 'The desert', icon: Sun, visual: 'bg-linear-to-br from-[#ffe6b8] to-[#e08a3c] text-bark' },
      { label: 'Night hunt', icon: Moon, visual: 'bg-linear-to-br from-[#d9d9f3] to-[#4a4a8c] text-white' },
    ],
    intro:
      'The fennec fox is the smallest fox in the world and lives in the Sahara, where daytime sand can reach 70°C.',
    facts: [
      'Its huge ears work like radiators, releasing heat from the body.',
      'It spends the hot day in a burrow and hunts at night.',
      'Fur on the soles of its feet protects it from burning sand.',
    ],
    didYouKnow:
      'A fennec can hear prey moving beneath the sand and dig it out before it surfaces.',
  },
  {
    id: 'honeybee',
    name: 'Honeybee',
    group: 'Insects',
    superpower: 'Dances to give directions',
    icon: Bug,
    visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-bark',
    stats: [
      { label: 'Wings', value: '4' },
      { label: 'Hive', value: 'Up to 50,000' },
      { label: 'Diet', value: 'Nectar and pollen' },
    ],
    media: [
      { label: 'Waggle dance', icon: Bug, visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-bark' },
      { label: 'The hive', icon: Home, visual: 'bg-linear-to-br from-[#ffe6b8] to-sun-500 text-bark' },
      { label: 'Pollination', icon: Leaf, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
    ],
    intro:
      'A honeybee colony works like one big animal. Scouts find flowers, then tell the others exactly where to fly.',
    facts: [
      'The waggle dance gives the direction and distance of food using the sun as a compass.',
      'A worker visits around a hundred flowers on a single trip.',
      'Bees see ultraviolet light, which makes patterns on petals visible to them.',
    ],
    didYouKnow:
      'A single jar of honey represents around a million flower visits.',
  },
  {
    id: 'sea-turtle',
    name: 'Sea turtle',
    group: 'Water',
    superpower: 'Returns to the beach where it hatched',
    icon: Turtle,
    visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
    stats: [
      { label: 'Weight', value: 'Up to 200 kg' },
      { label: 'Lifespan', value: '60+ years' },
      { label: 'Diet', value: 'Jellyfish and seagrass' },
    ],
    media: [
      { label: 'The beach', icon: MapPin, visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-bark' },
      { label: 'The ocean', icon: Waves, visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white' },
      { label: 'The shell', icon: Shell, visual: 'bg-linear-to-br from-[#e3d3b5] to-[#a98a5c] text-white' },
    ],
    intro:
      'Sea turtles cross whole oceans, then swim back to the exact beach where they hatched to lay their own eggs, decades later.',
    facts: [
      'They read Earth’s magnetic field like a map to find their way.',
      'The temperature of the sand decides whether hatchlings are male or female.',
      'They can hold their breath for hours while resting on the seabed.',
    ],
    didYouKnow:
      'Hatchlings head for the brightest horizon, which used to be the sea — now city lights can lead them the wrong way.',
  },
  {
    id: 'snow-leopard',
    name: 'Snow leopard',
    group: 'Mammals',
    superpower: 'Almost invisible at 5,500 m',
    icon: PawPrint,
    visual: 'bg-linear-to-br from-[#dfe8ee] to-[#7d93a6] text-white',
    stats: [
      { label: 'Tail', value: '90 cm long' },
      { label: 'Jump', value: 'Up to 9 m' },
      { label: 'Diet', value: 'Mountain goats' },
    ],
    media: [
      { label: 'The mountains', icon: Mountain, visual: 'bg-linear-to-br from-[#dfe8ee] to-[#7d93a6] text-white' },
      { label: 'The tail', icon: Wind, visual: 'bg-linear-to-br from-white to-ocean-100 text-ocean-600' },
      { label: 'The jump', icon: Sparkles, visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-bark' },
    ],
    intro:
      'Snow leopards live high in the mountains of Central Asia, where the air is thin and the rocks are steep. They are rarely seen, even by the people who study them.',
    facts: [
      'Its wide paws work like snowshoes and spread its weight on soft snow.',
      'It wraps its long tail around itself like a scarf while resting.',
      'Unlike other big cats, it cannot roar. It chuffs and mews instead.',
    ],
    didYouKnow:
      'The smoky spots on its coat break up its outline, so it disappears against rock and snow.',
  },
  {
    id: 'wood-frog',
    name: 'Wood frog',
    group: 'Water',
    superpower: 'Freezes solid, then thaws alive',
    icon: Droplets,
    visual: 'bg-linear-to-br from-[#e2ebd8] to-[#6d8a4f] text-white',
    stats: [
      { label: 'Length', value: 'About 6 cm' },
      { label: 'Survives', value: '-6°C' },
      { label: 'Diet', value: 'Insects' },
    ],
    media: [
      { label: 'The freeze', icon: Snowflake, visual: 'bg-linear-to-br from-white to-ocean-100 text-ocean-600' },
      { label: 'The thaw', icon: Sun, visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-bark' },
      { label: 'The pond', icon: Droplets, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
    ],
    intro:
      'The wood frog lives further north than any other North American frog. To get through winter, it lets most of its body freeze.',
    facts: [
      'Up to two thirds of the water in its body turns to ice.',
      'Its heart stops and it stops breathing for weeks.',
      'Glucose in its blood works like antifreeze and protects its cells.',
    ],
    didYouKnow:
      'As it thaws, the frog’s heart restarts and it hops away within hours.',
  },
]

// ---------------------------------------------------------- habitat activity
export const habitats = [
  {
    id: 'arctic',
    label: 'Arctic',
    icon: Snowflake,
    scene: 'bg-linear-to-br from-white via-ocean-100 to-[#cfeaf5]',
    chip: 'bg-ocean-600 text-white',
    card: 'border-ocean-600/25 bg-white/85 hover:border-ocean-600/55 hover:bg-white',
    creatureIcon: 'bg-ocean-100 text-ocean-600',
    option:
      'border-ocean-600/35 bg-ocean-100/45 hover:border-ocean-600/65 hover:bg-ocean-100/80',
    blurb: 'Cold, bright, and frozen for most of the year.',
    creatures: [
      {
        name: 'Emperor penguin',
        icon: Bird,
        trick: 'Huddles in a moving circle so every bird gets a turn out of the wind.',
      },
      {
        name: 'Polar bear',
        icon: PawPrint,
        trick: 'Black skin and hollow fur catch sunlight, and a thick fat layer keeps the cold out.',
      },
      {
        name: 'Arctic fox',
        icon: PawPrint,
        trick: 'Curls its bushy tail over its nose like a scarf and swaps coat colour with the season.',
      },
    ],
    challenge: {
      question: 'Which of these does not live in the Arctic?',
      options: ['Polar bear', 'Arctic fox', 'Emperor penguin', 'Fennec fox'],
      answer: 3,
      explain: 'The fennec fox lives in the Sahara, where its huge ears help it lose heat.',
    },
  },
  {
    id: 'desert',
    label: 'Desert',
    icon: Sun,
    scene: 'bg-linear-to-br from-[#fff4d6] via-sun-100 to-[#f2c078]',
    chip: 'bg-sun-500 text-bark',
    card: 'border-sun-500/40 bg-white/85 hover:border-sun-500/80 hover:bg-white',
    creatureIcon: 'bg-sun-100 text-[#8a6d1f]',
    option:
      'border-sun-500/55 bg-sun-100/55 hover:border-sun-500 hover:bg-sun-100',
    blurb: 'Hot days, cold nights, and very little water.',
    creatures: [
      {
        name: 'Fennec fox',
        icon: PawPrint,
        trick: 'Hunts at night and radiates heat through enormous ears.',
      },
      {
        name: 'Desert tortoise',
        icon: Turtle,
        trick: 'Stores water in its bladder and spends the hottest hours underground.',
      },
      {
        name: 'Ostrich',
        icon: Bird,
        trick: 'Long legs and loose feathers keep the sun off and let heat escape.',
      },
    ],
    challenge: {
      question: 'Which of these does not live in the desert?',
      options: ['Desert tortoise', 'Ostrich', 'Fennec fox', 'Polar bear'],
      answer: 3,
      explain: 'Polar bears need sea ice to hunt seals, so they stay in the Arctic.',
    },
  },
  {
    id: 'rainforest',
    label: 'Rainforest',
    icon: Leaf,
    scene: 'bg-linear-to-br from-leaf-100 via-[#dcf1dc] to-[#8fc98f]',
    chip: 'bg-leaf-600 text-white',
    card: 'border-leaf-600/25 bg-white/85 hover:border-leaf-600/55 hover:bg-white',
    creatureIcon: 'bg-leaf-100 text-leaf-700',
    option:
      'border-leaf-600/35 bg-leaf-100/55 hover:border-leaf-600/70 hover:bg-leaf-100',
    blurb: 'Warm, wet, and crowded with life at every level.',
    creatures: [
      {
        name: 'Sloth',
        icon: PawPrint,
        trick: 'Moves so slowly that algae grows in its fur and hides it among the leaves.',
      },
      {
        name: 'Toucan',
        icon: Bird,
        trick: 'The huge beak is light and full of blood vessels that help it lose heat.',
      },
      {
        name: 'Morpho butterfly',
        icon: Bug,
        trick: 'Its blue is not pigment — it is light bouncing off tiny scales.',
      },
    ],
    challenge: {
      question: 'Which of these does not live in the rainforest?',
      options: ['Toucan', 'Morpho butterfly', 'Sloth', 'Emperor penguin'],
      answer: 3,
      explain: 'Emperor penguins breed on Antarctic sea ice, at the other end of the planet.',
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    icon: Waves,
    scene: 'bg-linear-to-br from-[#cfeaf5] via-ocean-100 to-ocean-600',
    chip: 'bg-ocean-600 text-white',
    card: 'border-ocean-600/30 bg-white/85 hover:border-ocean-600/60 hover:bg-white',
    creatureIcon: 'bg-ocean-100 text-ocean-600',
    option:
      'border-ocean-600/40 bg-ocean-100/50 hover:border-ocean-600/70 hover:bg-ocean-100',
    blurb: 'The largest habitat on Earth, from sunlight to total dark.',
    creatures: [
      {
        name: 'Octopus',
        icon: Shell,
        trick: 'Has no bones, so it can squeeze through a hole the size of its eye.',
      },
      {
        name: 'Great white shark',
        icon: Fish,
        trick: 'Senses the tiny electric fields made by a heartbeat in the water.',
      },
      {
        name: 'Sea turtle',
        icon: Turtle,
        trick: 'Reads Earth’s magnetic field to cross whole oceans and find one beach.',
      },
    ],
    challenge: {
      question: 'Which of these is not an ocean animal?',
      options: ['Octopus', 'Sea turtle', 'Great white shark', 'Fennec fox'],
      answer: 3,
      explain: 'The fennec fox is a desert animal. The other three all live in the sea.',
    },
  },
]

export const animalsQuiz = {
  title: 'How well do you know your neighbours?',
  description: 'Three quick questions. Every answer is in the field guide above.',
  questions: [
    {
      question: 'Which animal freezes solid in winter and thaws out alive?',
      options: ['Wood frog', 'Emperor penguin', 'Monarch butterfly', 'Octopus'],
      answer: 0,
      explain:
        'The wood frog lets much of its body freeze, then restarts when temperatures rise.',
    },
    {
      question: 'Why do monarch butterflies fly thousands of kilometres?',
      options: [
        'To reach warmer winter forests',
        'To escape other butterflies',
        'To find salt water',
        'To lay eggs in the sea',
      ],
      answer: 0,
      explain:
        'They gather in the same mountain forests in Mexico each year, guided by the sun and a body clock.',
    },
    {
      question: 'What does an octopus have three of?',
      options: ['Hearts', 'Bones', 'Lungs', 'Fins'],
      answer: 0,
      explain: 'Two hearts serve the gills and one serves the rest of the body. Its blood is blue.',
    },
  ],
}
