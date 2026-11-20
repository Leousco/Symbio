import {
  Apple,
  Banana,
  BatteryWarning,
  Box,
  Bug,
  Cable,
  Car,
  Cat,
  Coffee,
  Cpu,
  CupSoda,
  Droplets,
  Earth,
  FileText,
  GlassWater,
  Layers,
  Leaf,
  Lightbulb,
  Package,
  Package2,
  Paintbrush,
  Recycle,
  ShieldCheck,
  Shirt,
  Smartphone,
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
    photo: '/images/environment/activity/plastic-bottle.jpg',
    alt: 'Three crushed clear plastic bottles on an orange background',
    hint: 'It is one clean material, moulded into shape. Ask whether melting it down could make a new one.',
    tip: 'Rinse it first, then it can become a new bottle.',
  },
  {
    name: 'Glass jar',
    bin: 'recycle',
    icon: GlassWater,
    photo: '/images/environment/activity/glass-jar.jpg',
    alt: 'A green glass jar with a red lid standing on a stone slab',
    focus: 'center 58%',
    hint: 'Made from melted sand. Think about whether melting it again would weaken it at all.',
    tip: 'Glass can be recycled again and again without losing quality.',
  },
  {
    name: 'Aluminium can',
    bin: 'recycle',
    icon: CupSoda,
    photo: '/images/environment/activity/aluminum-can.jpg',
    alt: 'A whole aluminium can beside a crushed one on a blue surface',
    hint: 'Light, metal and easy to melt. Ask which bin turns an old can into a new one.',
    tip: 'Cans are one of the most valuable things in a recycling bin.',
  },
  {
    name: 'Cardboard box',
    bin: 'recycle',
    icon: Box,
    photo: '/images/environment/activity/cardboard-box.jpg',
    alt: 'A stack of used cardboard boxes',
    hint: 'It tears into plant fibres. Which bin takes things that can be pulped and pressed?',
    tip: 'Flatten it so more boxes fit in the truck.',
  },
  {
    name: 'Banana peel',
    bin: 'compost',
    icon: Banana,
    photo: '/images/environment/activity/banana-peel.jpg',
    alt: 'A pile of empty yellow banana peels',
    hint: 'It was part of a plant and will rot on its own. Which bin is built for food scraps?',
    tip: 'Food scraps rot down into compost that feeds soil.',
  },
  {
    name: 'Apple core',
    bin: 'compost',
    icon: Apple,
    photo: '/images/environment/activity/apple-core.jpg',
    alt: 'An eaten apple core lying on paving stones',
    hint: 'It came from a tree and breaks down in weeks. Which bin turns scraps back into soil?',
    tip: 'Fruit scraps are perfect for a compost heap.',
  },
  {
    name: 'Coffee grounds',
    bin: 'compost',
    icon: Coffee,
    photo: '/images/environment/activity/coffee-grounds.jpg',
    alt: 'A close-up mound of used coffee grounds with beans behind',
    hint: 'Wet plant material that rots. Ask which bin feeds a heap instead of burying it.',
    tip: 'Used grounds add nutrients to compost.',
  },
  {
    name: 'Greasy pizza box',
    bin: 'compost',
    icon: Box,
    photo: '/images/environment/activity/greasy-pizza-box.jpg',
    alt: 'A greasy pizza box left on top of a skip',
    hint: 'Cardboard can be pulped, but grease cannot be washed out. Which bin takes food-soiled paper?',
    tip: 'Greasy paper cannot be recycled, but it can compost.',
  },
  {
    name: 'Chip bag',
    bin: 'landfill',
    icon: Package,
    photo: '/images/environment/activity/chip-bag.jpg',
    alt: 'A crumpled pink crisp packet lying on sand',
    hint: 'Squash it: thin, shiny film pressed from layers. Ask whether recycling could separate them.',
    tip: 'Soft plastic film is not accepted by most programs.',
  },
  {
    name: 'Broken ceramic mug',
    bin: 'landfill',
    icon: CupSoda,
    photo: '/images/environment/activity/broken-ceramic-mug.jpg',
    alt: 'A broken white ceramic mug resting on a rock',
    hint: 'Baked clay, not glass. Think about what sharp shards would do inside a sorting machine.',
    tip: 'Pottery shards jam recycling machines, so they go in the rubbish.',
  },
  {
    name: 'Old battery',
    bin: 'hazardous',
    icon: BatteryWarning,
    photo: '/images/environment/activity/old-battery.jpg',
    alt: 'Two AA batteries standing beside a device with red lights',
    hint: 'It stores energy in chemicals. Ask what happens if it is crushed, leaks or gets hot.',
    tip: 'Batteries can leak and start fires. Use a drop-off point.',
  },
  {
    name: 'Leftover paint',
    bin: 'hazardous',
    icon: Paintbrush,
    photo: '/images/environment/activity/leftover-paint.jpg',
    alt: 'Peeling layers of colourful paint on a surface',
    hint: 'A chemical, not something to remake. Ask where it can go without reaching water.',
    tip: 'Paint needs a hazardous waste collection point.',
  },
]

// ------------------------------------------------------------- field guide
// Fifteen entries in three layers, in reading order:
//   1–4   the four bins, and what happens after you sort
//   5–11  one material for each bin, so the advice has an example
//   12–15 the four places your choices reach, and why they matter
// Every entry follows the same shape: a one-line superpower, three stats,
// a three-beat media rail (start → middle → end), and the same three sections.
export const environmentGroups = ['Home', 'Water', 'Land', 'Air']

export const environmentEntries = [
  // ---------------------------------------------------------------- the bins
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
      { label: 'Takes', value: 'Paper, glass, metal' },
    ],
    media: [
      {
        label: 'Your bin',
        icon: Package,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/environment/field-guide/recycle-2.jpg',
        alt: 'A black and a blue wheelie bin standing side by side outdoors',
      },
      {
        label: 'Sorted by material',
        icon: Recycle,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/environment/field-guide/recycle-1.jpg',
        alt: 'Bins filled with empty glass bottles and metal bottle caps',
      },
      {
        label: 'New product',
        icon: ShieldCheck,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/environment/field-guide/recycle-3.jpg',
        alt: 'Outdoor chairs and a table made from recycled steel drums',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Recycling breaks a used item back down into its material, then builds something new from it. A bottle can become a bottle again, or a jumper, or a park bench. It only works with four families: paper and card, glass, metal, and rigid plastic.',
      },
      {
        heading: 'Why it matters',
        body: 'Making new plastic, paper, glass or metal from scratch takes energy, water and raw materials. Recycling uses less of all three — but only if the material is clean, dry and sorted. One greasy tub can spoil a whole load.',
      },
      {
        heading: 'What you can do',
        body: [
          'Rinse jars and tubs and let them dry — clean things get recycled, dirty things get binned.',
          'Keep soft plastic film out. Wrappers and carrier bags jam the sorting machines, so they belong in landfill.',
          'Ask whether you need it at all. Using less beats recycling everything.',
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
      {
        label: 'Food scraps',
        icon: Banana,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/environment/field-guide/composting-1.jpg',
        alt: 'A compost crate filled with orange peels and plant scraps',
      },
      {
        label: 'Breaking down',
        icon: Leaf,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/environment/field-guide/composting-2.jpg',
        alt: 'Apple halves breaking down among dry leaves and straw',
      },
      {
        label: 'New soil',
        icon: Earth,
        visual: 'bg-linear-to-br from-[#e3d3b5] to-[#a98a5c] text-white',
        src: '/images/environment/field-guide/composting-3.jpg',
        alt: 'Ants moving through a mound of dark, crumbly compost',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Composting lets bacteria, fungi and worms break food scraps down in air. What is left is a dark, crumbly soil that plants love. A good heap needs two things: greens that are wet, like fruit and vegetable scraps, and browns that are dry, like leaves and torn cardboard.',
      },
      {
        heading: 'Why it matters',
        body: 'Food buried in a landfill is squeezed of oxygen and releases methane, a powerful greenhouse gas. Composted instead, the same scraps feed the soil and lock carbon into it. It is the same banana peel doing damage in one bin and good in the other.',
      },
      {
        heading: 'What you can do',
        body: [
          'Put fruit and vegetable scraps, coffee grounds, tea bags and garden clippings in the compost.',
          'Keep out meat, dairy and cooked food, plus anything plastic — including the sticker on a banana peel.',
          'Add dry leaves or torn cardboard, and turn the pile now and then so it gets air.',
        ],
      },
    ],
    didYouKnow:
      'A handful of healthy compost can hold more living organisms than there are people on Earth.',
  },
  {
    id: 'landfill',
    name: 'Landfill',
    group: 'Land',
    superpower: 'Buried is not the same as gone',
    icon: Trash2,
    visual: 'bg-linear-to-br from-bark/30 to-bark/80 text-cream',
    stats: [
      { label: 'Holds', value: 'What no bin wants' },
      { label: 'Produces', value: 'Methane' },
      { label: 'Lasts', value: 'Decades' },
    ],
    media: [
      {
        label: 'The bin',
        icon: Trash2,
        visual: 'bg-linear-to-br from-bark/30 to-bark/80 text-cream',
        src: '/images/environment/field-guide/landfill-1.jpg',
        alt: 'A wooden litter bin standing beside the sea',
      },
      {
        label: 'The site',
        icon: Box,
        visual: 'bg-linear-to-br from-[#d8ceb8] to-[#8a7a5e] text-white',
        src: '/images/environment/field-guide/landfill-2.jpg',
        alt: 'A bulldozer working across a vast landfill site',
      },
      {
        label: 'Smoke and gas',
        icon: Wind,
        visual: 'bg-linear-to-br from-bark/30 to-bark/80 text-cream',
        src: '/images/environment/field-guide/landfill-3.jpg',
        alt: 'A smoking rubbish dump with birds circling overhead',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'A landfill is a designed pit where rubbish is buried in layers and covered with soil. It is the last stop for things no other bin can take: soft plastic film, chip bags, broken cups and plates, nappies, and anything made of mixed materials that cannot be pulled apart.',
      },
      {
        heading: 'Why it matters',
        body: 'Buried food and paper break down without oxygen and release methane. Landfills also take up land, and a site can stay out of use for decades after it closes. Nothing in there is coming back — a landfill is a store, not a cycle.',
      },
      {
        heading: 'What you can do',
        body: [
          'Reduce and reuse before you think about the bin.',
          'Sort out anything that can be recycled or composted — the landfill bin should be the smallest one in your home.',
          'Choose products built to last, not to be thrown away.',
        ],
      },
    ],
    didYouKnow:
      'Some closed landfills are now parks, with pipes still collecting gas from the rubbish underneath.',
  },
  {
    id: 'hazardous',
    name: 'Hazardous waste',
    group: 'Home',
    superpower: 'The smallest bin does the most damage',
    icon: BatteryWarning,
    visual: 'bg-linear-to-br from-[#fbe6e1] to-[#a8412f] text-white',
    stats: [
      { label: 'Examples', value: 'Batteries, paint' },
      { label: 'Needs', value: 'A drop-off point' },
      { label: 'Never', value: 'Down the drain' },
    ],
    media: [
      {
        label: 'The cupboard',
        icon: Paintbrush,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/environment/field-guide/hazard-waste-3.jpg',
        alt: 'A yellow flammable storage cabinet holding bottles of chemicals',
      },
      {
        label: 'The drop-off',
        icon: BatteryWarning,
        visual: 'bg-linear-to-br from-[#fbe6e1] to-[#a8412f] text-white',
        src: '/images/environment/field-guide/hazard-waste-2.jpg',
        alt: 'Electrical waste and building materials piled at an industrial site at night',
      },
      {
        label: 'The risk',
        icon: Droplets,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/environment/field-guide/hazard-waste-1.jpg',
        alt: 'A pile of used household batteries of many brands',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Hazardous waste is anything that can burn, poison or pollute: batteries, leftover paint, cleaning chemicals, medicines and old electronics. It is the smallest group in your home, and the one that needs the most care.',
      },
      {
        heading: 'Why it matters',
        body: 'A battery crushed in a bin lorry can spark a fire. Paint and chemicals poured down a drain travel to a river, where they harm fish and plants. These things do not break down safely, so they need a collection point instead of a bin.',
      },
      {
        heading: 'What you can do',
        body: [
          'Keep batteries, bulbs and old chargers in a box until you can drop them off.',
          'Find your local hazardous waste or e-waste collection point — many shops take batteries back for free.',
          'Never pour paint, oil or medicine down a drain or onto the ground.',
        ],
      },
    ],
    didYouKnow:
      'A single lithium battery can start a fire in a bin lorry, which is one reason crews ask you to keep them separate.',
  },

  // ------------------------------------------------------------ the materials
  {
    id: 'plastic',
    name: 'Plastic',
    group: 'Water',
    superpower: 'Useful for a day, around for centuries',
    icon: Package,
    visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
    stats: [
      { label: 'A bottle lasts', value: 'Hundreds of years' },
      { label: 'Breaks into', value: 'Microplastics' },
      { label: 'Rigid goes in', value: 'Recycling' },
    ],
    media: [
      {
        label: 'Rivers',
        icon: Droplets,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/environment/field-guide/plastic-3.jpg',
        alt: 'Plastic bottles floating among lily pads in still water',
      },
      {
        label: 'The ocean',
        icon: Waves,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
        src: '/images/environment/field-guide/plastic-1.jpg',
        alt: 'Plastic bags and rope drifting underwater beside a fish',
      },
      {
        label: 'Still there',
        icon: Package,
        visual: 'bg-linear-to-br from-white to-ocean-100 text-ocean-600 dark:from-[#101a2e]',
        src: '/images/environment/field-guide/plastic-2.jpg',
        alt: 'A single plastic bag drifting underwater',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Plastic is light, cheap and tough, which is exactly the problem. Rigid plastic such as bottles and tubs can be recycled. Soft plastic such as wrappers, bags and film usually cannot, so it goes to landfill. Either way it does not rot: sunlight and waves break it into smaller and smaller pieces called microplastics.',
      },
      {
        heading: 'Why it matters',
        body: 'Animals mistake the pieces for food, and the plastic carries chemicals with it. Because it floats and drifts, a bottle dropped inland can end up in the sea hundreds of kilometres away. Most ocean plastic starts on land.',
      },
      {
        heading: 'What you can do',
        body: [
          'Carry a reusable bottle and bag.',
          'Rinse rigid plastic and put it in recycling; put wrappers and film in landfill.',
          'Pick up litter before it reaches a drain — drains lead to rivers.',
        ],
      },
    ],
    didYouKnow:
      'Most ocean plastic does not come from ships. It starts on land and arrives through rivers and drains.',
  },
  {
    id: 'paper',
    name: 'Paper & card',
    group: 'Home',
    superpower: 'Made from trees, saved by the bin',
    icon: FileText,
    visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
    stats: [
      { label: 'Reused', value: '5–7 times' },
      { label: 'Must stay', value: 'Clean and dry' },
      { label: 'Grease', value: 'Ruins it' },
    ],
    media: [
      {
        label: 'Trees',
        icon: Trees,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/environment/field-guide/paper-2.jpg',
        alt: 'The peeling, papery bark of a tree trunk',
      },
      {
        label: 'The bin',
        icon: Box,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/environment/field-guide/paper-3.jpg',
        alt: 'Crumpled paper balls beside a wire recycling basket',
      },
      {
        label: 'At the plant',
        icon: FileText,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/environment/field-guide/paper-1.jpg',
        alt: 'Cardboard boxes pressed into bales at a recycling plant',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Paper and card are pressed plant fibres: newspapers, boxes, envelopes, cereal packets and office paper. They are collected, pulped and pressed into new sheets. The fibres get shorter each time, so the same paper can only go round about five to seven times.',
      },
      {
        heading: 'Why it matters',
        body: 'Every load of paper recycled saves trees, water and energy. But paper is only recyclable while it is clean and dry. A greasy pizza box or a soaked newspaper can spoil the rest of the load.',
      },
      {
        heading: 'What you can do',
        body: [
          'Flatten boxes so more fits in the truck.',
          'Keep paper dry and out of the food bin.',
          'Tear the greasy part off a pizza box and compost it, then recycle the clean lid.',
        ],
      },
    ],
    didYouKnow:
      'A sheet of paper can come back as newspaper, then a cereal box, then an egg carton as its fibres get shorter.',
  },
  {
    id: 'glass-metal',
    name: 'Glass & metal',
    group: 'Home',
    superpower: 'Glass and metal never wear out',
    icon: GlassWater,
    visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
    stats: [
      { label: 'Glass', value: 'Recycles forever' },
      { label: 'Aluminium saves', value: '95% energy' },
      { label: 'Cans are', value: 'Worth money' },
    ],
    media: [
      {
        label: 'Broken glass',
        icon: GlassWater,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
        src: '/images/environment/field-guide/glass-1.jpg',
        alt: 'A heap of broken glass shards in mixed colours',
      },
      {
        label: 'Scrap metal',
        icon: CupSoda,
        visual: 'bg-linear-to-br from-[#d8ceb8] to-[#8a7a5e] text-white',
        src: '/images/environment/field-guide/glass-3.jpg',
        alt: 'A skip filled with scrap metal chairs and frames',
      },
      {
        label: 'The furnace',
        icon: Zap,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/environment/field-guide/glass-2.jpg',
        alt: 'Glowing coals inside an industrial furnace',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Glass is melted sand, and metal is refined from rock. Both can be melted down and remade again and again without losing quality. A glass bottle can be washed and refilled or melted into a new one, and an aluminium can can be back on a shelf in about two months.',
      },
      {
        heading: 'Why it matters',
        body: 'Recycling aluminium uses around 95% less energy than making it from scratch, and recycling glass saves sand and heat. These are the materials that make recycling a real loop rather than a delay.',
      },
      {
        heading: 'What you can do',
        body: [
          'Rinse jars and cans — a sticky jar can spoil a load.',
          'Keep drinking glasses and Pyrex out of the glass bin; they melt at a different temperature.',
          'Take cans to a refund point if you have one, because metal is worth money.',
        ],
      },
    ],
    didYouKnow:
      'A glass bottle can be recycled and back on a shop shelf in about 30 days.',
  },
  {
    id: 'food-scraps',
    name: 'Food scraps',
    group: 'Land',
    superpower: 'A third of all food is never eaten',
    icon: Apple,
    visual: 'bg-linear-to-br from-sun-100 to-[#e08a3c] text-ink',
    stats: [
      { label: 'Wasted', value: 'About a third' },
      { label: 'Composts in', value: '2–6 months' },
      { label: 'Buried, it makes', value: 'Methane' },
    ],
    media: [
      {
        label: 'The plate',
        icon: Apple,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/environment/field-guide/food-scraps-1.jpg',
        alt: 'A plate of leftover vegetables with a fork resting on it',
      },
      {
        label: 'Collected scraps',
        icon: Banana,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/environment/field-guide/food-scraps-2.jpg',
        alt: 'A close-up of collected fruit and vegetable scraps',
      },
      {
        label: 'Eaten, not wasted',
        icon: Cat,
        visual: 'bg-linear-to-br from-bark/20 to-bark/60 text-cream',
        src: '/images/environment/field-guide/food-scraps-3.jpg',
        alt: 'A cat eating leftover food from a brick ledge',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Food scraps are the peel, core and leftovers you do not eat. In the compost bin they break down into soil in a few months. In the landfill bin they are buried without air, where they rot slowly and release methane instead.',
      },
      {
        heading: 'Why it matters',
        body: 'Growing food uses land, water and fuel, so throwing it away throws all of that away too. Food is also the easiest waste problem to fix: the same scrap does damage when buried and does good when composted.',
      },
      {
        heading: 'What you can do',
        body: [
          'Put fruit and vegetable scraps in the compost or food caddy, never in the landfill bin.',
          'Plan meals and take smaller portions so less is left on the plate.',
          'Keep stickers, bags and packaging out of the food bin.',
        ],
      },
    ],
    didYouKnow:
      'If food waste were a country, it would be one of the biggest sources of greenhouse gas on Earth.',
  },
  {
    id: 'textiles',
    name: 'Textiles & clothing',
    group: 'Water',
    superpower: 'Every wash sheds a cloud of plastic',
    icon: Shirt,
    visual: 'bg-linear-to-br from-[#e6d9f5] to-[#5b49b8] text-white',
    stats: [
      { label: 'Every wash', value: 'Thousands of fibres' },
      { label: 'Most clothes', value: 'Buried or burned' },
      { label: 'One cotton shirt', value: 'Thousands of litres' },
    ],
    media: [
      {
        label: 'The fibre',
        icon: Shirt,
        visual: 'bg-linear-to-br from-[#e6d9f5] to-[#5b49b8] text-white',
        src: '/images/environment/field-guide/textile-1.jpg',
        alt: 'Rolls of undyed textile fibre',
      },
      {
        label: 'Cut-offs',
        icon: Layers,
        visual: 'bg-linear-to-br from-[#f5dbe6] to-[#b8497a] text-white',
        src: '/images/environment/field-guide/textile-2.jpg',
        alt: 'Shredded colourful fabric offcuts and threads',
      },
      {
        label: 'Worn out',
        icon: Shirt,
        visual: 'bg-linear-to-br from-bark/20 to-bark/60 text-cream',
        src: '/images/environment/field-guide/textile-3.jpg',
        alt: 'A person in a field holding a bundle of worn woven sacks',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Clothes are made from cotton, wool or synthetic fibres such as polyester. Synthetic fabric is a kind of plastic, and every wash sheds tiny fibres that go down the drain and end up in rivers and the sea.',
      },
      {
        heading: 'Why it matters',
        body: 'Clothing is one of the fastest-growing waste streams. Most clothes are worn a few times and then buried or burned, and growing the cotton for a single shirt can take thousands of litres of water.',
      },
      {
        heading: 'What you can do',
        body: [
          'Wear things more often and repair them before replacing them.',
          'Pass clothes on, swap them, or take them to a collection point.',
          'Wash less often and on a cooler, shorter cycle to shed fewer fibres.',
        ],
      },
    ],
    didYouKnow:
      'A synthetic fleece can shed thousands of plastic fibres in a single wash.',
  },
  {
    id: 'batteries',
    name: 'Batteries & electronics',
    group: 'Home',
    superpower: 'A phone holds a mine’s worth of metal',
    icon: Smartphone,
    visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white',
    stats: [
      { label: 'Lithium', value: 'Can catch fire' },
      { label: 'Inside', value: 'Gold and copper' },
      { label: 'E-waste', value: 'Fastest growing' },
    ],
    media: [
      {
        label: 'Old cables',
        icon: Cable,
        visual: 'bg-linear-to-br from-bark/20 to-bark/60 text-cream',
        src: '/images/environment/field-guide/batt-electronics-2.jpg',
        alt: 'A tangle of old chargers, cables and plugs',
      },
      {
        label: 'Circuit boards',
        icon: Cpu,
        visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white',
        src: '/images/environment/field-guide/batt-electronics-1.jpg',
        alt: 'A pile of discarded circuit boards',
      },
      {
        label: 'Batteries',
        icon: BatteryWarning,
        visual: 'bg-linear-to-br from-[#fbe6e1] to-[#a8412f] text-white',
        src: '/images/environment/field-guide/batt-electronics-3.jpg',
        alt: 'A heap of used batteries, including laptop battery packs',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Phones, tablets, chargers, cables and batteries are packed with metals: copper, aluminium, silver, gold and lithium. They are also the fastest-growing waste stream in the world, because people replace them long before they stop working.',
      },
      {
        heading: 'Why it matters',
        body: 'Mining new metal is expensive and damaging, yet a tonne of old phones contains more gold than a tonne of ore. Dropped in the wrong bin, batteries can spark fires, and all those metals are lost for good.',
      },
      {
        heading: 'What you can do',
        body: [
          'Keep old devices and batteries out of every household bin.',
          'Take them to an e-waste or battery drop-off — many shops accept them for free.',
          'Repair or pass on a working device before replacing it.',
        ],
      },
    ],
    didYouKnow:
      'A tonne of old phones holds more gold than a tonne of gold ore.',
  },
  {
    id: 'soft-plastic',
    name: 'Soft plastic & packaging',
    group: 'Land',
    superpower: 'The wrapper no bin wants',
    icon: Package2,
    visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white',
    stats: [
      { label: 'Examples', value: 'Wrappers and film' },
      { label: 'Belongs in', value: 'Landfill' },
      { label: 'Recycles', value: 'Rarely' },
    ],
    media: [
      {
        label: 'Takeaway waste',
        icon: CupSoda,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/environment/field-guide/soft-plastic-2.jpg',
        alt: 'A heap of disposable coffee cups and takeaway packaging',
      },
      {
        label: 'Crumpled film',
        icon: Package2,
        visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white',
        src: '/images/environment/field-guide/soft-plastic-3.jpg',
        alt: 'Crumpled clear plastic bottles and film',
      },
      {
        label: 'Baled bags',
        icon: Package2,
        visual: 'bg-linear-to-br from-bark/30 to-bark/80 text-cream',
        src: '/images/environment/field-guide/soft-plastic-1.jpg',
        alt: 'Clear plastic bags stacked and bundled together',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Soft plastic is the thin, flexible kind: crisp packets, carrier bags, bin liners, bubble wrap, cling film and the film lids on trays. It is often made of several layers glued together, which makes it almost impossible to separate and recycle.',
      },
      {
        heading: 'Why it matters',
        body: 'Soft plastic jams the spinning machines at a recycling plant and can tangle a whole load, so most programs send it to landfill. Once buried it does not rot: it breaks into fragments that last for centuries and blow into drains and rivers.',
      },
      {
        heading: 'What you can do',
        body: [
          'Put wrappers, film and crisp packets in the landfill bin, not recycling.',
          'Use a reusable bag and buy loose fruit and vegetables to make less film in the first place.',
          'Look for a soft plastic drop-off at a supermarket if your area has one.',
        ],
      },
    ],
    didYouKnow:
      'A single plastic carrier bag can take hundreds of years to break down, and even then it only becomes smaller plastic.',
  },

  // ----------------------------------------------------------- the biospheres
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
      {
        label: 'Rivers',
        icon: Droplets,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-500 text-white',
        src: '/images/environment/field-guide/fresh-water-2.jpg',
        alt: 'Fast-flowing river water rushing over stones',
      },
      {
        label: 'Lakes',
        icon: Waves,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/environment/field-guide/fresh-water-3.jpg',
        alt: 'Clear shallow water with smooth stones on the bed',
      },
      {
        label: 'From the tap',
        icon: GlassWater,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/environment/field-guide/fresh-water-1.jpg',
        alt: 'An outdoor tap pouring water, with a lake and hills behind',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Most of Earth’s water is salty ocean, and most of the fresh water is locked in ice. The rivers, lakes and groundwater we can actually reach are a very small share. Tap water is cleaned at a treatment plant before it reaches your home, then cleaned again after it leaves.',
      },
      {
        heading: 'Why it matters',
        body: 'We drink it, grow food with it and share it with every other living thing. When it is polluted or wasted, the cost is paid downstream. Water is also heavy, so pumping and heating it uses energy — saving water saves energy too.',
      },
      {
        heading: 'What you can do',
        body: [
          'Turn the tap off while you brush your teeth.',
          'Take shorter showers and fix dripping taps.',
          'Never pour paint, oil or medicine down a drain — it leads to a river.',
        ],
      },
    ],
    didYouKnow:
      'The water in your glass has been around for billions of years. It has been through clouds, oceans and dinosaurs.',
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
      {
        label: 'The sky',
        icon: Wind,
        visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white',
        src: '/images/environment/field-guide/clean-air-1.jpg',
        alt: 'Open green parkland under a clear blue sky',
      },
      {
        label: 'Traffic',
        icon: Car,
        visual: 'bg-linear-to-br from-bark/20 to-bark/60 text-cream',
        src: '/images/environment/field-guide/clean-air-2.jpg',
        alt: 'A jet flying low over a hazy city street full of traffic',
      },
      {
        label: 'Trees',
        icon: Trees,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/environment/field-guide/clean-air-3.jpg',
        alt: 'Sunlight filtering through the leaves of a large tree',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Clean air is mostly nitrogen and oxygen. Pollution adds tiny particles and gases from traffic, fires, factories and farming. Some of those particles are small enough to slip past the body’s defences and reach deep into your lungs.',
      },
      {
        heading: 'Why it matters',
        body: 'Air does not stay where it is made. Wind carries a city’s exhaust to the next town, and smoke from a garden fire drifts into a neighbour’s window. Because everyone breathes the same air, cleaning it is something nobody can do alone.',
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
    id: 'biodiversity',
    name: 'Biodiversity',
    group: 'Land',
    superpower: 'Variety is what keeps nature steady',
    icon: Bug,
    visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
    stats: [
      { label: 'Means', value: 'Many kinds of life' },
      { label: 'Starts in', value: 'The soil' },
      { label: 'Gives us', value: 'Food and medicine' },
    ],
    media: [
      {
        label: 'Wildlife',
        icon: Bug,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/environment/field-guide/biodiversity-1.jpg',
        alt: 'A white-faced capuchin monkey sitting on a rainforest branch',
      },
      {
        label: 'Reef life',
        icon: Waves,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
        src: '/images/environment/field-guide/biodiversity-2.jpg',
        alt: 'A snorkeler swimming over a coral reef crowded with fish',
      },
      {
        label: 'Wetlands',
        icon: Leaf,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/environment/field-guide/biodiversity-3.jpg',
        alt: 'A white egret flying low over a reed-filled wetland',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Biodiversity is the variety of living things, and it starts in the soil: bacteria, fungi, worms and roots, then insects, plants and everything that eats them. It is measured at every scale, from genes inside one species to whole habitats.',
      },
      {
        heading: 'Why it matters',
        body: 'A system with many species copes better when something goes wrong. If one food source fails, animals can switch. If a disease hits, some individuals survive. Healthy soil is the base of that system: it holds water, stores carbon and grows our food.',
      },
      {
        heading: 'What you can do',
        body: [
          'Leave a wild corner of the garden for insects.',
          'Feed the soil with compost instead of chemicals.',
          'Support places that protect whole habitats, not just one animal.',
        ],
      },
    ],
    didYouKnow:
      'A single oak tree can support hundreds of species, from fungi in its roots to insects in its bark.',
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
      {
        label: 'Solar panels',
        icon: Zap,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/environment/field-guide/energy-at-home-2.jpg',
        alt: 'Solar panels mounted on the roof of a brick house',
        objectPosition: 'center 30%',
      },
      {
        label: 'Wind power',
        icon: Wind,
        visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white',
        src: '/images/environment/field-guide/energy-at-home-3.jpg',
        alt: 'Wind turbines turning behind a house in a green field',
        objectPosition: 'center 40%',
      },
      {
        label: 'Lights on',
        icon: Lightbulb,
        visual: 'bg-linear-to-br from-bark/20 to-bark/60 text-cream',
        src: '/images/environment/field-guide/energy-at-home-1.jpg',
        alt: 'A house at dusk with warmly lit windows',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: 'Electricity is made somewhere — by wind, water, sun, gas or coal — and travels to your home through wires. Whatever the source, every unit you do not use is a unit nobody had to make. Most of a home’s energy goes on heating and cooling.',
      },
      {
        heading: 'Why it matters',
        body: 'Energy made by burning fuel releases gases that pollute the air and warm the planet. Saving energy cuts emissions and bills at the same time, and the power on the grid is cleanest when demand is low.',
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
      hint: 'Paper recycling works by pulping, and grease cannot be washed out. Think about which bin can handle food-soiled card.',
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
      hint: 'Buried scraps are squeezed of air. Think about what changes when the same scraps break down with oxygen instead.',
      explain:
        'Composting breaks scraps down with oxygen and puts carbon back into the soil instead of releasing methane.',
    },
    {
      question: 'Where does most ocean plastic start?',
      options: ['Ships', 'The sea floor', 'Land, through rivers', 'Rain'],
      answer: 2,
      hint: 'Plastic floats, but it does not fall from the sky. Think about where a dropped bottle travels before the sea.',
      explain: 'Most of it is dropped on land and carried to the sea by rivers and drains.',
    },
  ],
}
