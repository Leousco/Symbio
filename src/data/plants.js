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
      {
        label: 'The canopy',
        icon: TreePine,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/plants/field-guide/oak-tree-1.jpg',
        alt: 'An oak tree’s broad canopy seen from below against a pale sky',
      },
      {
        label: 'Acorns',
        icon: Sprout,
        visual: 'bg-linear-to-br from-[#e3d3b5] to-[#a98a5c] text-white',
        src: '/images/plants/field-guide/oak-tree-2.jpg',
        alt: 'Ripening acorns hanging among oak leaves',
      },
      {
        label: 'The bark',
        icon: Trees,
        visual: 'bg-linear-to-br from-[#d8ceb8] to-[#8a7a5e] text-white',
        src: '/images/plants/field-guide/oak-tree-3.jpg',
        alt: 'The deeply furrowed trunk of an old oak tree',
      },
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
      {
        label: 'The roots',
        icon: Trees,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/plants/field-guide/mangrove-3.jpg',
        alt: 'Mangrove roots arching above shallow water',
      },
      {
        label: 'The coast',
        icon: Waves,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/plants/field-guide/mangrove-1.jpg',
        alt: 'A dense mangrove forest growing along a muddy shoreline',
      },
      {
        label: 'The nursery',
        icon: Droplets,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-500 text-white',
        src: '/images/plants/field-guide/mangrove-2.jpg',
        alt: 'Mangrove roots reflected in calm water',
      },
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
      {
        label: 'The shoot',
        icon: Sprout,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/plants/field-guide/bamboo-1.jpg',
        alt: 'A new bamboo shoot emerging in front of mature green stalks',
      },
      {
        label: 'The stem',
        icon: Trees,
        visual: 'bg-linear-to-br from-[#e2ebd8] to-[#6d8a4f] text-white',
        src: '/images/plants/field-guide/bamboo-2.jpg',
        alt: 'Sunlight filtering through a stand of bamboo stems',
      },
      {
        label: 'The grove',
        icon: Trees,
        visual: 'bg-linear-to-br from-[#dcf1dc] to-leaf-600 text-white',
        src: '/images/plants/field-guide/bamboo-3.jpg',
        alt: 'A path winding through a tall bamboo grove',
      },
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
    id: 'baobab',
    name: 'Baobab',
    group: 'Trees',
    superpower: 'Stores water in a giant trunk',
    icon: TreePine,
    visual: 'bg-linear-to-br from-[#e3d3b5] to-[#8a7a5e] text-white',
    stats: [
      { label: 'Height', value: 'Up to 25 m' },
      { label: 'Trunk', value: 'Water tank' },
      { label: 'Age', value: 'Up to 2,000 years' },
    ],
    media: [
      {
        label: 'The trunk',
        icon: TreePine,
        visual: 'bg-linear-to-br from-[#e3d3b5] to-[#8a7a5e] text-white',
        src: '/images/plants/field-guide/baobab-1.jpg',
        alt: 'A baobab tree with its thick trunk and flat crown standing in open grassland',
      },
      {
        label: 'The fruit',
        icon: Sprout,
        visual: 'bg-linear-to-br from-[#e2ebd8] to-[#8a9a5b] text-white',
        src: '/images/plants/field-guide/baobab-2.jpg',
        alt: 'Two baobab fruits hanging from a leafy branch',
      },
      {
        label: 'The savanna',
        icon: Sun,
        visual: 'bg-linear-to-br from-[#ffe6b8] to-[#e08a3c] text-ink',
        src: '/images/plants/field-guide/baobab-3.jpg',
        alt: 'A row of baobab trees along a dirt road under a blue sky',
      },
    ],
    intro:
      'A baobab looks like a tree planted upside down. Its fat trunk swells with water during the rains and keeps the tree alive through the long dry season.',
    facts: [
      'The trunk can hold tens of thousands of litres of water, enough to last a whole dry season.',
      'Its bark is fire-resistant and can be stripped off and grow back.',
      'Baboons, elephants and people all eat its fruit, which is packed with vitamin C.',
    ],
    didYouKnow:
      'Some baobabs grow so wide and hollow that people have used them as shelters, shops and water stores.',
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    group: 'Flowers',
    superpower: 'Turns its head to follow the sun',
    icon: Flower2,
    visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-ink',
    stats: [
      { label: 'Height', value: 'Up to 3 m' },
      { label: 'Seeds', value: '2,000 per head' },
      { label: 'Family', value: 'Daisy' },
    ],
    media: [
      {
        label: 'Facing the sun',
        icon: Sun,
        visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-ink',
        src: '/images/plants/field-guide/sunflower-1.jpg',
        alt: 'A sunflower turning its head towards a setting sun',
      },
      {
        label: 'The head',
        icon: Flower2,
        visual: 'bg-linear-to-br from-[#ffe6b8] to-sun-500 text-ink',
        src: '/images/plants/field-guide/sunflower-2.jpg',
        alt: 'A sunflower head glowing in low golden light',
      },
      {
        label: 'The seeds',
        icon: Sprout,
        visual: 'bg-linear-to-br from-[#e3d3b5] to-[#8a7a5e] text-white',
        src: '/images/plants/field-guide/sunflower-3.jpg',
        alt: 'A close-up pile of striped sunflower seeds',
      },
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
      {
        label: 'The bloom',
        icon: Flower2,
        visual: 'bg-linear-to-br from-[#f3c6c6] to-[#a63d3d] text-white',
        src: '/images/plants/field-guide/rafflesia-2.jpg',
        alt: 'A huge rafflesia flower with spotted red petals opening on the forest floor',
      },
      {
        label: 'The host',
        icon: Trees,
        visual: 'bg-linear-to-br from-[#e3d3b5] to-[#8a7a5e] text-white',
        src: '/images/plants/field-guide/rafflesia-1.jpg',
        alt: 'A rafflesia bloom growing from the roots of its host vine',
      },
      {
        label: 'The flies',
        icon: Bug,
        visual: 'bg-linear-to-br from-[#e2ebd8] to-[#5b6b4a] text-white',
        src: '/images/plants/field-guide/rafflesia-3.jpg',
        alt: 'A fly resting on the fleshy rim of a rafflesia flower',
        objectPosition: 'center 30%',
      },
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
    id: 'cherry-blossom',
    name: 'Cherry blossom',
    group: 'Flowers',
    superpower: 'Turns a whole tree pink for a fortnight',
    icon: Flower2,
    visual: 'bg-linear-to-br from-[#fbe3ea] to-[#d97a9c] text-white',
    stats: [
      { label: 'Bloom', value: 'About 2 weeks' },
      { label: 'Petals', value: 'Pink or white' },
      { label: 'Home', value: 'East Asia' },
    ],
    media: [
      {
        label: 'The blossom',
        icon: Flower2,
        visual: 'bg-linear-to-br from-[#fbe3ea] to-[#d97a9c] text-white',
        src: '/images/plants/field-guide/cherry-blossom-1.jpg',
        alt: 'Pink cherry blossoms filling the branches against a blue sky',
      },
      {
        label: 'The petals',
        icon: Wind,
        visual: 'bg-linear-to-br from-[#fbe3ea] to-[#c49ab0] text-white',
        src: '/images/plants/field-guide/cherry-blossom-2.jpg',
        alt: 'A close-up cluster of pale pink cherry blossoms',
      },
      {
        label: 'The branch',
        icon: Trees,
        visual: 'bg-linear-to-br from-[#f3c6c6] to-[#a63d3d] text-white',
        src: '/images/plants/field-guide/cherry-blossom-3.jpg',
        alt: 'A branch of cherry blossom against a dark background',
      },
    ],
    intro:
      'For a couple of weeks each spring, a cherry tree covers itself in pink and white flowers. Then the petals fall and drift away like snow.',
    facts: [
      'The blossom lasts only one or two weeks, and a windy or rainy day can end it sooner.',
      'Cherry trees are grown for their flowers as well as for their small, sweet fruit.',
      'In Japan, families gather under the blooming trees to eat and celebrate, a custom called hanami.',
    ],
    didYouKnow:
      'Most garden cherry trees are grown from cuttings, so each new tree is a copy of its parent.',
  },
  {
    id: 'tulip',
    name: 'Tulip',
    group: 'Flowers',
    superpower: 'Sleeps all winter as a bulb',
    icon: Flower2,
    visual: 'bg-linear-to-br from-[#ffd9e2] to-[#c2496a] text-white',
    stats: [
      { label: 'Height', value: 'Up to 60 cm' },
      { label: 'Bulb', value: 'Food store' },
      { label: 'Bloom', value: 'Spring' },
    ],
    media: [
      {
        label: 'The cup',
        icon: Flower2,
        visual: 'bg-linear-to-br from-[#ffd9e2] to-[#c2496a] text-white',
        src: '/images/plants/field-guide/tulip-2.jpg',
        alt: 'A yellow tulip cup opening in warm light',
      },
      {
        label: 'The bunch',
        icon: Sprout,
        visual: 'bg-linear-to-br from-[#e3d3b5] to-[#8a7a5e] text-white',
        src: '/images/plants/field-guide/tulip-1.jpg',
        alt: 'Pink tulips gathered in a glass vase',
      },
      {
        label: 'The field',
        icon: Sun,
        visual: 'bg-linear-to-br from-[#ffe6b8] to-sun-500 text-ink',
        src: '/images/plants/field-guide/tulip-3.jpg',
        alt: 'Rows of red and white tulips growing under a blue sky',
      },
    ],
    intro:
      'A tulip spends the cold months packed inside a bulb underground, then shoots up fast when spring arrives.',
    facts: [
      'The bulb is a short stem wrapped in thick leaves that store food for next year’s flower.',
      'Tulips first grew wild in the mountains of Central Asia before people bred them in Turkey and the Netherlands.',
      'On warm days a tulip flower opens wide, then closes again at night.',
    ],
    didYouKnow:
      'In the 1600s, tulip bulbs in the Netherlands became so valuable that a few sold for more than a house.',
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
      {
        label: 'The trap',
        icon: Bug,
        visual: 'bg-linear-to-br from-leaf-100 to-[#8c3f5e] text-white',
        src: '/images/plants/field-guide/venus-flytrap-2.jpg',
        alt: 'A Venus flytrap with a dark insect caught between its lobes',
      },
      {
        label: 'The trigger',
        icon: Wind,
        visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white',
        src: '/images/plants/field-guide/venus-flytrap-1.jpg',
        alt: 'A cluster of Venus flytrap leaves showing their trigger hairs',
      },
      {
        label: 'The jaws',
        icon: Leaf,
        visual: 'bg-linear-to-br from-[#dcf1dc] to-leaf-600 text-white',
        src: '/images/plants/field-guide/venus-flytrap-3.jpg',
        alt: 'Red-lined Venus flytrap traps against a black background',
      },
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
      {
        label: 'The stem',
        icon: Sprout,
        visual: 'bg-linear-to-br from-[#e2ebd8] to-[#8a9a5b] text-white',
        src: '/images/plants/field-guide/cactus-1.jpg',
        alt: 'A tall saguaro cactus standing alone in a dry desert',
      },
      {
        label: 'The spines',
        icon: Sun,
        visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-ink',
        src: '/images/plants/field-guide/cactus-2.jpg',
        alt: 'Sharp spines running along the edge of a cactus stem',
      },
      {
        label: 'The fruit',
        icon: Flower2,
        visual: 'bg-linear-to-br from-[#ffe6b8] to-[#e08a3c] text-ink',
        src: '/images/plants/field-guide/cactus-3.jpg',
        alt: 'A prickly pear cactus covered in red fruits in a rocky desert',
      },
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
      {
        label: 'The carpet',
        icon: Leaf,
        visual: 'bg-linear-to-br from-[#e2ebd8] to-[#4f6b3a] text-white',
        src: '/images/plants/field-guide/moss-1.jpg',
        alt: 'Moss carpeting rocky ground on a hillside',
      },
      {
        label: 'The water',
        icon: Droplets,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-500 text-white',
        src: '/images/plants/field-guide/moss-2.jpg',
        alt: 'Moss-covered stones beside a stream in a shady forest',
      },
      {
        label: 'The shade',
        icon: Trees,
        visual: 'bg-linear-to-br from-[#dcf1dc] to-leaf-600 text-white',
        src: '/images/plants/field-guide/moss-3.jpg',
        alt: 'A close-up of bright green moss in damp shade',
      },
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
    id: 'pitcher-plant',
    name: 'Pitcher plant',
    group: 'Weird plants',
    superpower: 'Grows its own pitfall trap',
    icon: Leaf,
    visual: 'bg-linear-to-br from-[#dcf1dc] to-[#7a3f5e] text-white',
    stats: [
      { label: 'Trap', value: 'Up to 30 cm' },
      { label: 'Diet', value: 'Insects' },
      { label: 'Home', value: 'Bogs' },
    ],
    media: [
      {
        label: 'The pitcher',
        icon: Leaf,
        visual: 'bg-linear-to-br from-[#dcf1dc] to-[#7a3f5e] text-white',
        src: '/images/plants/field-guide/pitcher-plant-1.jpg',
        alt: 'Red and green pitcher plants hanging from their leaves',
      },
      {
        label: 'The rim',
        icon: Droplets,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-500 text-white',
        src: '/images/plants/field-guide/pitcher-plant-3.jpg',
        alt: 'A cluster of pitcher plants showing their curled rims',
      },
      {
        label: 'The prey',
        icon: Bug,
        visual: 'bg-linear-to-br from-[#e2ebd8] to-[#5b6b4a] text-white',
        src: '/images/plants/field-guide/pitcher-plant-2.jpg',
        alt: 'A fly trapped inside the fluid of a pitcher plant',
      },
    ],
    intro:
      'A pitcher plant rolls one of its leaves into a deep cup with a slippery rim. Insects that land on it slide down and cannot climb back out.',
    facts: [
      'The cup holds a pool of digestive liquid that breaks down the catch.',
      'A lid above the opening keeps rain from filling the pitcher and watering down the liquid.',
      'Some bats and birds use the larger pitchers as a safe place to roost.',
    ],
    didYouKnow:
      'Some pitcher plants have a sugary rim that makes visiting insects even more likely to slip.',
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
      {
        label: 'The mat',
        icon: Droplets,
        visual: 'bg-linear-to-br from-[#dcf1dc] to-ocean-500 text-white',
        src: '/images/plants/field-guide/duckweed-1.jpg',
        alt: 'A pond completely covered by a green mat of duckweed',
      },
      {
        label: 'The pond',
        icon: Waves,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
        src: '/images/plants/field-guide/duckweed-2.jpg',
        alt: 'Tiny duckweed plants floating close together on still water',
      },
      {
        label: 'The ducks',
        icon: Leaf,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/plants/field-guide/duckweed-3.jpg',
        alt: 'Canada geese swimming through duckweed on a pond',
        objectPosition: 'center 35%',
      },
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
      {
        label: 'The meadow',
        icon: Waves,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
        src: '/images/plants/field-guide/seagrass-1.jpg',
        alt: 'A shallow lagoon with seagrass growing across the seabed',
      },
      {
        label: 'The blades',
        icon: Leaf,
        visual: 'bg-linear-to-br from-[#dcf1dc] to-leaf-600 text-white',
        src: '/images/plants/field-guide/seagrass-2.jpg',
        alt: 'Seagrass blades rising through clear blue water',
      },
      {
        label: 'The nursery',
        icon: Droplets,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-500 text-white',
        src: '/images/plants/field-guide/seagrass-3.jpg',
        alt: 'Sunlight falling on a dense bed of seagrass underwater',
      },
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
  {
    id: 'lotus',
    name: 'Lotus',
    group: 'Water plants',
    superpower: 'Rises clean out of muddy water',
    icon: Flower2,
    visual: 'bg-linear-to-br from-[#f7d9e8] to-[#4f7f6a] text-white',
    stats: [
      { label: 'Leaf', value: 'Up to 60 cm' },
      { label: 'Petals', value: 'Waterproof' },
      { label: 'Home', value: 'Still ponds' },
    ],
    media: [
      {
        label: 'The bloom',
        icon: Flower2,
        visual: 'bg-linear-to-br from-[#f7d9e8] to-[#4f7f6a] text-white',
        src: '/images/plants/field-guide/lotus-1.jpg',
        alt: 'A pink lotus flower opening among broad green leaves',
      },
      {
        label: 'The pads',
        icon: Leaf,
        visual: 'bg-linear-to-br from-[#dcf1dc] to-leaf-600 text-white',
        src: '/images/plants/field-guide/lotus-2.jpg',
        alt: 'Pink lotus flowers and round leaves crowding a pond',
      },
      {
        label: 'The pond',
        icon: Waves,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
        src: '/images/plants/field-guide/lotus-3.jpg',
        alt: 'A white lotus flower reflected on still dark water',
        objectPosition: 'center 60%',
      },
    ],
    intro:
      'The lotus roots in the mud at the bottom of a pond and sends long stalks up to flowers that open above the surface.',
    facts: [
      'Its round leaves are waterproof, so rain rolls off and carries dirt away with it.',
      'Lotus seeds can stay alive for hundreds of years and still sprout once they get wet.',
      'The flower opens in the morning and closes again for the night.',
    ],
    didYouKnow:
      'The lotus stays so clean that scientists copy its surface to make self-cleaning paints and glass.',
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
      hint: 'Roots supply the water, but the leaves do the building. Think about what else a leaf takes in from the air and the sun.',
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
      hint: 'A big, flat leaf gives water plenty of room to escape. Think about what a desert plant is trying hardest to keep.',
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
      hint: 'Roots do more than drink. Think about what they need from the tiny gaps between soil particles — and what water pushes out of those gaps.',
    },
  ],
}
