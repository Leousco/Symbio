import {
  Apple,
  Banana,
  BatteryWarning,
  Box,
  Bug,
  Coffee,
  CupSoda,
  Droplets,
  Earth,
  FileText,
  GlassWater,
  Leaf,
  Package,
  Paintbrush,
  Recycle,
  ShieldCheck,
  Trash2,
  Trees,
  Waves,
  Wind,
  Zap,
} from 'lucide-react'

// ---------------------------------------------------------------- home teaser
export const teaserBins = [
  { id: 'plastic', label: 'Plastic', icon: Recycle, tone: 'bg-ocean-100 text-ocean-600' },
  { id: 'paper', label: 'Paper', icon: FileText, tone: 'bg-sun-100 text-[#8a6d1f] dark:text-sun-400' },
  { id: 'organic', label: 'Organic', icon: Leaf, tone: 'bg-leaf-100 text-leaf-700' },
]

// Each item renders in a fixed image slot. Add `photo: '/images/name.jpg'`
// (plus an optional `alt`) to show a real photo; without one the icon is used.
// `think` and `hint` drive the coach card in the home teaser; `tip` is the fact
// shown once the item is sorted.
export const teaserItems = [
  {
    name: 'Plastic bottle',
    bin: 'plastic',
    icon: Package,
    photo: '/images/home/slides/activity-plastic-bottle.jpg',
    alt: 'A pile of empty plastic bottles',
    think: 'Ask what it is made of. This one was moulded from a single material, and that material can be melted down again.',
    hint: 'It is not paper and not food. Which bin takes something that can be melted and remade?',
    tip: 'Most drink bottles are PET plastic, which can be melted down and made into new bottles or fleece.',
  },
  {
    name: 'Newspaper',
    bin: 'paper',
    icon: FileText,
    photo: '/images/home/slides/activity-newspaper.jpg',
    alt: 'A stack of folded newspapers',
    think: 'Think about how it would break apart. It tears easily, soaks up water, and started life as plant fibre.',
    hint: 'It turns to mush when it gets wet. Which bin takes things that can be pulped?',
    tip: 'Newsprint is mostly wood fibre, so it can be pulped and pressed into new paper.',
  },
  {
    name: 'Banana peel',
    bin: 'organic',
    icon: Banana,
    photo: '/images/home/slides/activity-banana-peel.jpg',
    alt: 'A banana peel on a green surface',
    think: 'Ask whether it was ever alive. This one will rot on its own, and one bin is built for exactly that.',
    hint: 'It is food, not packaging. Which bin is for scraps that break down?',
    tip: 'A banana peel breaks down in weeks and feeds the soil as compost.',
  },
  {
    name: 'Cardboard box',
    bin: 'paper',
    icon: Box,
    photo: '/images/home/slides/activity-cardboard-box.jpg',
    alt: 'Flattened cardboard boxes stacked against a wall',
    focus: 'center 78%',
    think: 'Squash it in your mind. It folds, creases and tears into fibres, which puts it in the paper family.',
    hint: 'It is the same family as a cereal box. Which bin takes paper products?',
    tip: 'Cardboard is layers of paper fibre pressed together, so it can be recycled into new boxes.',
  },
  {
    name: 'Apple core',
    bin: 'organic',
    icon: Apple,
    photo: '/images/home/slides/activity-apple-core.jpg',
    alt: 'An eaten apple core on a white surface',
    think: 'It came from a plant and will break down quickly. Ask which bin handles things that rot.',
    hint: 'This is food, not packaging. Which bin takes kitchen scraps?',
    tip: 'An apple core is food waste, and food waste becomes compost in a few months.',
  },
]

// ------------------------------------------------------------ full sorter game
export const sorterBins = [
  { id: 'recycle', label: 'Recycle', icon: Recycle, tone: 'bg-ocean-100 text-ocean-600' },
  { id: 'compost', label: 'Compost', icon: Leaf, tone: 'bg-leaf-100 text-leaf-700' },
  { id: 'landfill', label: 'Landfill', icon: Trash2, tone: 'bg-bark/10 text-bark/70' },
  { id: 'hazardous', label: 'Hazardous', icon: BatteryWarning, tone: 'bg-[#fbe6e1] text-[#a8412f] dark:bg-[#3a1c1f] dark:text-[#fca5a5]' },
]

export const sorterItems = [
  {
    name: 'Plastic bottle',
    bin: 'recycle',
    icon: Package,
    tip: 'Rinse it first, then it can become a new bottle.',
  },
  {
    name: 'Glass jar',
    bin: 'recycle',
    icon: GlassWater,
    tip: 'Glass can be recycled again and again without losing quality.',
  },
  {
    name: 'Aluminium can',
    bin: 'recycle',
    icon: CupSoda,
    tip: 'Cans are one of the most valuable things in a recycling bin.',
  },
  {
    name: 'Cardboard box',
    bin: 'recycle',
    icon: Box,
    tip: 'Flatten it so more boxes fit in the truck.',
  },
  {
    name: 'Banana peel',
    bin: 'compost',
    icon: Banana,
    tip: 'Food scraps rot down into compost that feeds soil.',
  },
  {
    name: 'Apple core',
    bin: 'compost',
    icon: Apple,
    tip: 'Fruit scraps are perfect for a compost heap.',
  },
  {
    name: 'Coffee grounds',
    bin: 'compost',
    icon: Coffee,
    tip: 'Used grounds add nutrients to compost.',
  },
  {
    name: 'Greasy pizza box',
    bin: 'compost',
    icon: Box,
    tip: 'Greasy paper cannot be recycled, but it can compost.',
  },
  {
    name: 'Chip bag',
    bin: 'landfill',
    icon: Package,
    tip: 'Soft plastic film is not accepted by most programs.',
  },
  {
    name: 'Broken ceramic mug',
    bin: 'landfill',
    icon: CupSoda,
    tip: 'Pottery shards jam recycling machines, so they go in the rubbish.',
  },
  {
    name: 'Old battery',
    bin: 'hazardous',
    icon: BatteryWarning,
    tip: 'Batteries can leak and start fires. Use a drop-off point.',
  },
  {
    name: 'Leftover paint',
    bin: 'hazardous',
    icon: Paintbrush,
    tip: 'Paint needs a hazardous waste collection point.',
  },
]

// ------------------------------------------------------------- field guide
export const environmentGroups = ['Home', 'Water', 'Land', 'Air']

export const environmentEntries = [
  {
    id: 'recycling',
    name: 'Recycling',
    group: 'Home',
    superpower: 'The same bottle can come back as a bottle',
    icon: Recycle,
    visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
    stats: [
      { label: 'A bottle returns in', value: 'About a month' },
      { label: 'Biggest win', value: 'Using less' },
      { label: 'Sorted by', value: 'Material' },
    ],
    media: [
      { label: 'The loop', icon: Recycle, visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white' },
      { label: 'Your bin', icon: Package, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
      { label: 'New product', icon: ShieldCheck, visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink' },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Recycling breaks a used item back down into its material, then builds something new from it. A bottle can become a bottle again, or a jumper, or a park bench.',
      },
      {
        heading: 'Why it matters',
        body: 'Making new plastic, paper, glass or metal from scratch takes energy, water and raw materials. Recycling uses less of all three — but only if the material is clean and sorted.',
      },
      {
        heading: 'What you can do',
        body: [
          'Rinse jars and bottles so they do not spoil a whole load.',
          'Keep paper dry and free of grease.',
          'Check your town’s bin rules — they really do differ.',
        ],
      },
    ],
    didYouKnow:
      'Aluminium can be recycled forever without losing quality, which is why cans are worth more than most recycling.',
  },
  {
    id: 'composting',
    name: 'Composting',
    group: 'Land',
    superpower: 'Food scraps turn back into soil',
    icon: Leaf,
    visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
    stats: [
      { label: 'Takes', value: '2–6 months' },
      { label: 'Makes', value: 'Compost' },
      { label: 'Keeps out', value: 'Methane' },
    ],
    media: [
      { label: 'Food scraps', icon: Banana, visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink' },
      { label: 'The heap', icon: Leaf, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
      { label: 'New soil', icon: Earth, visual: 'bg-linear-to-br from-[#e3d3b5] to-[#a98a5c] text-white' },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Composting lets bacteria, fungi and worms break food scraps down in air. What is left is a dark, crumbly soil that plants love.',
      },
      {
        heading: 'Why it matters',
        body: 'Food buried in a landfill is squeezed of oxygen and releases methane, a powerful greenhouse gas. Composted instead, the same scraps feed soil and lock carbon in.',
      },
      {
        heading: 'What you can do',
        body: [
          'Keep fruit and vegetable scraps separate from plastic packaging.',
          'Add dry leaves or cardboard to stop the heap getting slimy.',
          'Turn the pile now and then so it gets air.',
        ],
      },
    ],
    didYouKnow:
      'A handful of healthy compost can hold more living organisms than there are people on Earth.',
  },
  {
    id: 'water',
    name: 'Fresh water',
    group: 'Water',
    superpower: 'Only a tiny slice is easy to use',
    icon: Droplets,
    visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
    stats: [
      { label: 'Of Earth’s water', value: '3% fresh' },
      { label: 'Easiest to use', value: 'Under 1%' },
      { label: 'A person needs', value: '50 L a day' },
    ],
    media: [
      { label: 'The planet', icon: Earth, visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white' },
      { label: 'Rivers', icon: Droplets, visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-500 text-white' },
      { label: 'At home', icon: GlassWater, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Most of Earth’s water is salty ocean. Most of the fresh water is locked in ice. The rivers, lakes and groundwater we can actually reach are a very small share.',
      },
      {
        heading: 'Why it matters',
        body: 'We drink it, grow food with it and share it with every other living thing. When it is polluted or wasted, the cost is paid downstream.',
      },
      {
        heading: 'What you can do',
        body: [
          'Turn the tap off while you brush your teeth.',
          'Take shorter showers and fix dripping taps.',
          'Never pour paint or oil down a drain — it leads to a river.',
        ],
      },
    ],
    didYouKnow:
      'The water in your glass has been around for billions of years. It has been through clouds, oceans and dinosaurs.',
  },
  {
    id: 'energy',
    name: 'Energy at home',
    group: 'Home',
    superpower: 'Every switch has a power station behind it',
    icon: Zap,
    visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
    stats: [
      { label: 'Biggest use', value: 'Heating' },
      { label: 'Wasteful', value: 'Standby mode' },
      { label: 'Cleanest', value: 'Using less' },
    ],
    media: [
      { label: 'The grid', icon: Zap, visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink' },
      { label: 'Standby', icon: Box, visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white' },
      { label: 'Your choice', icon: ShieldCheck, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Electricity is made somewhere — by wind, water, sun, gas or coal — and travels to your home through wires. Whatever your source, every unit you do not use is a unit nobody had to make.',
      },
      {
        heading: 'Why it matters',
        body: 'Heating, cooling and appliances make up a large share of a home’s energy use. Saving energy cuts emissions and bills at the same time.',
      },
      {
        heading: 'What you can do',
        body: [
          'Put on a jumper before turning the heating up.',
          'Switch off lights and unplug chargers when they are done.',
          'Dry clothes on a line instead of in a machine when you can.',
        ],
      },
    ],
    didYouKnow:
      'A charger left plugged in with nothing attached still uses a small amount of power — that is why it feels warm.',
  },
  {
    id: 'air',
    name: 'Clean air',
    group: 'Air',
    superpower: 'Air is shared, so pollution is shared too',
    icon: Wind,
    visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white',
    stats: [
      { label: 'Main source', value: 'Burning fuel' },
      { label: 'Tiny particles', value: 'Enter deep lungs' },
      { label: 'Natural filter', value: 'Trees' },
    ],
    media: [
      { label: 'The sky', icon: Wind, visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white' },
      { label: 'Traffic', icon: Box, visual: 'bg-linear-to-br from-bark/20 to-bark/60 text-cream' },
      { label: 'Trees', icon: Trees, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Clean air is mostly nitrogen and oxygen. Pollution adds tiny particles and gases from traffic, fires, factories and farming.',
      },
      {
        heading: 'Why it matters',
        body: 'The smallest particles slip past the body’s defences and into the lungs. Air does not stay where it is made, so a city’s exhaust becomes a neighbour’s problem.',
      },
      {
        heading: 'What you can do',
        body: [
          'Walk, cycle or take the bus for short trips.',
          'Plant shade trees — leaves trap particles and cool streets.',
          'Avoid burning rubbish, which releases some of the worst smoke.',
        ],
      },
    ],
    didYouKnow:
      'A single mature tree can intercept thousands of litres of rain a year, which is one reason city trees help in storms.',
  },
  {
    id: 'plastic',
    name: 'Plastic in the sea',
    group: 'Water',
    superpower: 'A bottle can outlive your grandparents',
    icon: Package,
    visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
    stats: [
      { label: 'A bottle lasts', value: 'Hundreds of years' },
      { label: 'Breaks into', value: 'Microplastics' },
      { label: 'Eaten by', value: 'Fish and birds' },
    ],
    media: [
      { label: 'Rivers', icon: Droplets, visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white' },
      { label: 'The ocean', icon: Waves, visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white' },
      { label: 'Microplastics', icon: Package, visual: 'bg-linear-to-br from-white to-ocean-100 text-ocean-600 dark:from-[#101a2e]' },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Plastic does not rot. Sunlight and waves break it into smaller and smaller pieces called microplastics, which are now found in rivers, oceans and rain.',
      },
      {
        heading: 'Why it matters',
        body: 'Animals mistake the pieces for food. Plastic also carries chemicals and can travel for thousands of kilometres from where it was dropped.',
      },
      {
        heading: 'What you can do',
        body: [
          'Carry a reusable bottle and bag.',
          'Pick up litter before it reaches a drain — drains lead to rivers.',
          'Choose products with less packaging when you can.',
        ],
      },
    ],
    didYouKnow:
      'Most ocean plastic does not come from ships. It starts on land and arrives through rivers and drains.',
  },
  {
    id: 'biodiversity',
    name: 'Biodiversity',
    group: 'Land',
    superpower: 'Variety is what keeps nature steady',
    icon: Bug,
    visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
    stats: [
      { label: 'Means', value: 'Many kinds of life' },
      { label: 'Includes', value: 'Genes to habitats' },
      { label: 'Gives us', value: 'Food and medicine' },
    ],
    media: [
      { label: 'Many species', icon: Bug, visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink' },
      { label: 'Habitats', icon: Trees, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
      { label: 'Resilience', icon: ShieldCheck, visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white' },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Biodiversity is the variety of living things: different species, different genes inside a species, and different habitats. It is measured at every scale.',
      },
      {
        heading: 'Why it matters',
        body: 'A system with many species copes better when something goes wrong. If one food source fails, animals can switch. If a disease hits, some individuals survive.',
      },
      {
        heading: 'What you can do',
        body: [
          'Leave a wild corner of the garden for insects.',
          'Avoid chemicals that kill pollinators.',
          'Support places that protect whole habitats, not just one animal.',
        ],
      },
    ],
    didYouKnow:
      'A single oak tree can support hundreds of species, from fungi in its roots to insects in its bark.',
  },
  {
    id: 'landfill',
    name: 'Landfill',
    group: 'Land',
    superpower: 'Buried is not the same as gone',
    icon: Trash2,
    visual: 'bg-linear-to-br from-bark/30 to-bark/80 text-cream',
    stats: [
      { label: 'Holds', value: 'Household rubbish' },
      { label: 'Produces', value: 'Methane' },
      { label: 'Lasts', value: 'Decades' },
    ],
    media: [
      { label: 'The bin', icon: Trash2, visual: 'bg-linear-to-br from-bark/30 to-bark/80 text-cream' },
      { label: 'The site', icon: Box, visual: 'bg-linear-to-br from-[#d8ceb8] to-[#8a7a5e] text-white' },
      { label: 'Better options', icon: Recycle, visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white' },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'A landfill is a designed pit where rubbish is buried in layers and covered with soil. Modern sites collect some of the liquid and gas that form inside.',
      },
      {
        heading: 'Why it matters',
        body: 'Buried food and paper break down without oxygen and release methane. Landfills also take up land, and a site can stay out of use for decades after it closes.',
      },
      {
        heading: 'What you can do',
        body: [
          'Reduce and reuse before you think about the bin.',
          'Sort out anything that can be recycled or composted.',
          'Choose products built to last, not to be thrown away.',
        ],
      },
    ],
    didYouKnow:
      'Some closed landfills are now parks, with pipes still collecting gas from the rubbish underneath.',
  },
]

// ------------------------------------------------------------------- quiz
export const environmentQuiz = {
  title: 'Can you sort it in your head?',
  description: 'Three quick calls. The field guide has the details.',
  questions: [
    {
      question: 'Which bin does a greasy pizza box belong in?',
      options: ['Recycle', 'Compost', 'Landfill', 'Hazardous'],
      answer: 1,
      explain:
        'Grease spoils paper recycling, but the cardboard can still break down in compost.',
    },
    {
      question: 'Why is composting better than burying food scraps?',
      options: [
        'It takes up more space',
        'It releases methane',
        'It locks carbon in soil',
        'It uses more water',
      ],
      answer: 2,
      explain:
        'Composting breaks scraps down with oxygen and puts carbon back into the soil instead of releasing methane.',
    },
    {
      question: 'Where does most ocean plastic start?',
      options: ['Ships', 'The sea floor', 'Land, through rivers', 'Rain'],
      answer: 2,
      explain: 'Most of it is dropped on land and carried to the sea by rivers and drains.',
    },
  ],
}
