import {
  Bird,
  Bug,
  CircleDot,
  Droplets,
  Ear,
  Egg,
  Eye,
  Feather,
  Fish,
  Heart,
  HeartPulse,
  Home,
  Leaf,
  MapPin,
  Moon,
  Mountain,
  PawPrint,
  Radar,
  Shield,
  Shell,
  Snowflake,
  Sparkles,
  Sun,
  Thermometer,
  Timer,
  Turtle,
  Waves,
  Wind,
  Zap,
} from 'lucide-react'

export const animalGroups = ['Mammals', 'Birds', 'Insects', 'Water']

export const animals = [
  {
    id: 'wolf',
    name: 'Grey wolf',
    group: 'Mammals',
    superpower: 'A howl that carries for kilometres',
    icon: PawPrint,
    visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
    stats: [
      { label: 'Length', value: '1–1.6 m' },
      { label: 'Pack', value: '6–10 wolves' },
      { label: 'Diet', value: 'Carnivore' },
    ],
    media: [
      {
        label: 'The pack',
        icon: PawPrint,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/animals/field-guide/grey-wolf-1.jpg',
        alt: 'A grey wolf howling among its pack on a rocky outcrop',
      },
      {
        label: 'The howl',
        icon: Wind,
        visual: 'bg-linear-to-br from-[#e6f4f8] to-ocean-500 text-white',
        src: '/images/animals/field-guide/grey-wolf-2.jpg',
        alt: 'A lone grey wolf howling in a snowy forest',
      },
      {
        label: 'Winter coat',
        icon: Snowflake,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/animals/field-guide/grey-wolf-3.jpg',
        alt: 'Two grey wolves resting together in the snow',
      },
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
      {
        label: 'The huddle',
        icon: Bird,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/animals/field-guide/emp-penguin-1.jpg',
        alt: 'A dense huddle of emperor penguins packed together',
      },
      {
        label: 'The ice',
        icon: Snowflake,
        visual: 'bg-linear-to-br from-white to-ocean-100 text-ocean-600 dark:from-[#101a2e]',
        src: '/images/animals/field-guide/emp-penguin-2.jpg',
        alt: 'An adult emperor penguin standing beside its chick on sea ice',
      },
      {
        label: 'The dive',
        icon: Waves,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
        src: '/images/animals/field-guide/emp-penguin-3.jpg',
        alt: 'An emperor penguin diving beneath the surface',
      },
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
    visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
    stats: [
      { label: 'Wingspan', value: 'About 10 cm' },
      { label: 'Journey', value: 'Up to 4,000 km' },
      { label: 'Diet', value: 'Nectar' },
    ],
    media: [
      {
        label: 'The journey',
        icon: MapPin,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/animals/field-guide/mon-butterfly-1.jpg',
        alt: 'A monarch butterfly perched on purple flowers under an open sky',
      },
      {
        label: 'Milkweed',
        icon: Leaf,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/animals/field-guide/mon-butterfly-2.jpg',
        alt: 'A monarch butterfly resting on a cluster of pale pink flowers',
      },
      {
        label: 'Wings',
        icon: Feather,
        visual: 'bg-linear-to-br from-[#ffe6c7] to-sun-500 text-ink',
        src: '/images/animals/field-guide/mon-butterfly-3.jpg',
        alt: 'A close-up of a monarch butterfly’s orange and black wings',
      },
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
      {
        label: 'The lake',
        icon: Droplets,
        visual: 'bg-linear-to-br from-[#dff0f7] to-ocean-500 text-white',
        src: '/images/animals/field-guide/axolotl-1.jpg',
        alt: 'An axolotl resting on the dark bottom of a lake',
      },
      {
        label: 'Gills',
        icon: Waves,
        visual: 'bg-linear-to-br from-[#f6d9e8] to-[#c86f9b] text-white',
        src: '/images/animals/field-guide/axolotl-2.jpg',
        alt: 'A close-up of an axolotl’s feathery external gills',
      },
      {
        label: 'Regrowth',
        icon: Sparkles,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/animals/field-guide/axolotl-3.jpg',
        alt: 'An axolotl moving through dark water, its legs and gills visible',
      },
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
      {
        label: 'The arms',
        icon: Shell,
        visual: 'bg-linear-to-br from-[#f3c6c6] to-[#b1564e] text-white',
        src: '/images/animals/field-guide/octopus-1.jpg',
        alt: 'An octopus with its arms spread across a reef',
      },
      {
        label: 'Blue blood',
        icon: Droplets,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/animals/field-guide/octopus-2.jpg',
        alt: 'A close-up of an octopus arm and its blue-ringed suckers',
      },
      {
        label: 'Camouflage',
        icon: Sparkles,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/animals/field-guide/octopus-3.jpg',
        alt: 'An octopus tucked into a rocky crevice',
      },
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
    visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-ink',
    stats: [
      { label: 'Ears', value: '15 cm long' },
      { label: 'Weight', value: '1.5 kg' },
      { label: 'Diet', value: 'Insects and small animals' },
    ],
    media: [
      {
        label: 'The ears',
        icon: Thermometer,
        visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-ink',
        src: '/images/animals/field-guide/fennec-fox-2.jpg',
        alt: 'A close-up of a sleeping fennec fox with its huge ears folded back',
        objectPosition: 'center 25%',
      },
      {
        label: 'The desert',
        icon: Sun,
        visual: 'bg-linear-to-br from-[#ffe6b8] to-[#e08a3c] text-ink',
        src: '/images/animals/field-guide/fennec-fox-1.jpg',
        alt: 'Two fennec foxes resting on warm desert sand',
      },
      {
        label: 'Night hunt',
        icon: Moon,
        visual: 'bg-linear-to-br from-[#d9d9f3] to-[#4a4a8c] text-white',
        src: '/images/animals/field-guide/fennec-fox-3.jpg',
        alt: 'A fennec fox standing alert in the dark',
      },
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
    visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
    stats: [
      { label: 'Wings', value: '4' },
      { label: 'Hive', value: 'Up to 50,000' },
      { label: 'Diet', value: 'Nectar and pollen' },
    ],
    media: [
      {
        label: 'Waggle dance',
        icon: Bug,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/animals/field-guide/honeybee-1.jpg',
        alt: 'Two honeybees meeting on a flower',
      },
      {
        label: 'The hive',
        icon: Home,
        visual: 'bg-linear-to-br from-[#ffe6b8] to-sun-500 text-ink',
        src: '/images/animals/field-guide/honeybee-2.jpg',
        alt: 'Honeybees crowding the entrance of their hive',
      },
      {
        label: 'Pollination',
        icon: Leaf,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/animals/field-guide/honeybee-3.jpg',
        alt: 'A honeybee reaching into a purple flower',
      },
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
      {
        label: 'The beach',
        icon: MapPin,
        visual: 'bg-linear-to-br from-sun-100 to-sun-500 text-ink',
        src: '/images/animals/field-guide/sea-turtle-1.jpg',
        alt: 'A sea turtle hatchling crossing the sand',
      },
      {
        label: 'The ocean',
        icon: Waves,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/animals/field-guide/sea-turtle-2.jpg',
        alt: 'A sea turtle swimming towards the camera in open water',
      },
      {
        label: 'The shell',
        icon: Shell,
        visual: 'bg-linear-to-br from-[#e3d3b5] to-[#a98a5c] text-white',
        src: '/images/animals/field-guide/sea-turtle-3.jpg',
        alt: 'A sea turtle seen from above, its patterned shell filling the frame',
      },
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
      {
        label: 'The mountains',
        icon: Mountain,
        visual: 'bg-linear-to-br from-[#dfe8ee] to-[#7d93a6] text-white',
        src: '/images/animals/field-guide/snow-leopard-1.jpg',
        alt: 'A snow leopard lying on a pale rock in the mountains',
      },
      {
        label: 'The tail',
        icon: Wind,
        visual: 'bg-linear-to-br from-white to-ocean-100 text-ocean-600 dark:from-[#101a2e]',
        src: '/images/animals/field-guide/snow-leopard-2.jpg',
        alt: 'A snow leopard resting on a rocky ledge, its long tail draped beside it',
      },
      {
        label: 'The jump',
        icon: Sparkles,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/animals/field-guide/snow-leopard-3.jpg',
        alt: 'A snow leopard springing across the snow',
        objectPosition: 'center 30%',
      },
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
      {
        label: 'The freeze',
        icon: Snowflake,
        visual: 'bg-linear-to-br from-white to-ocean-100 text-ocean-600 dark:from-[#101a2e]',
        src: '/images/animals/field-guide/wood-frog-2.jpg',
        alt: 'A wood frog covered in frost resting on frozen leaves',
        objectPosition: 'center 35%',
      },
      {
        label: 'The thaw',
        icon: Sun,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/animals/field-guide/wood-frog-1.jpg',
        alt: 'A wood frog resting on a sunlit fallen log',
        objectPosition: 'center 55%',
      },
      {
        label: 'The pond',
        icon: Droplets,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/animals/field-guide/wood-frog-3.jpg',
        alt: 'A wood frog floating among leaves in a pond',
      },
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
  {
    id: 'atlantic-puffin',
    name: 'Atlantic puffin',
    group: 'Birds',
    superpower: 'Flies through the sea',
    icon: Bird,
    visual: 'bg-linear-to-br from-[#ffe0d2] to-[#c94f3d] text-white',
    stats: [
      { label: 'Dive', value: '60 m deep' },
      { label: 'Wings', value: '400 beats a minute' },
      { label: 'Diet', value: 'Sand eels' },
    ],
    media: [
      {
        label: 'The dive',
        icon: Waves,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
        src: '/images/animals/field-guide/atlantic-puffin-1.jpg',
        alt: 'A puffin flying low over the sea beside a swimming puffin',
      },
      {
        label: 'The burrow',
        icon: Home,
        visual: 'bg-linear-to-br from-[#ffe0d2] to-[#c94f3d] text-white',
        src: '/images/animals/field-guide/atlantic-puffin-2.jpg',
        alt: 'A puffin standing among grass on a clifftop',
      },
      {
        label: 'The beak',
        icon: Sparkles,
        visual: 'bg-linear-to-br from-[#ffe6c7] to-sun-500 text-ink',
        src: '/images/animals/field-guide/atlantic-puffin-3.jpg',
        alt: 'A puffin perched on a mossy rock, its orange beak in profile',
        objectPosition: 'center 30%',
      },
    ],
    intro:
      'The Atlantic puffin is a small seabird that spends most of its life far out at sea. In spring it returns to grassy clifftops to dig a burrow and raise one chick.',
    facts: [
      'Underwater its wings beat around 400 times a minute, so it looks like it is flying through the sea.',
      'Its bright orange beak is only that colour in the breeding season, then the outer plates are shed.',
      'A spiny tongue helps it hold a dozen small fish crosswise in its beak at once.',
    ],
    didYouKnow:
      'Puffins are nicknamed sea parrots because of their colourful beaks and comic faces.',
  },
  {
    id: 'ladybug',
    name: 'Ladybug',
    group: 'Insects',
    superpower: 'Eats 50 aphids a day',
    icon: Bug,
    visual: 'bg-linear-to-br from-[#ffd2d2] to-[#c22f2f] text-white',
    stats: [
      { label: 'Length', value: '5–8 mm' },
      { label: 'Lifespan', value: 'About a year' },
      { label: 'Diet', value: 'Aphids' },
    ],
    media: [
      {
        label: 'The spots',
        icon: CircleDot,
        visual: 'bg-linear-to-br from-[#ffd2d2] to-[#c22f2f] text-white',
        src: '/images/animals/field-guide/ladybug-2.jpg',
        alt: 'A close-up of a ladybug on a green leaf',
      },
      {
        label: 'The warning',
        icon: Shield,
        visual: 'bg-linear-to-br from-sun-100 to-sun-400 text-ink',
        src: '/images/animals/field-guide/ladybug-1.jpg',
        alt: 'A ladybug climbing a plant stem',
      },
      {
        label: 'The garden',
        icon: Leaf,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/animals/field-guide/ladybug-3.jpg',
        alt: 'A ladybug resting on a daisy',
        objectPosition: 'center 25%',
      },
    ],
    intro:
      'Ladybugs are small beetles with round, shiny wings. Gardeners welcome them because a single one can clear a plant of aphids in a few days.',
    facts: [
      'The bright red colour is a warning that says: I taste bad.',
      'When frightened, they can ooze a smelly, bitter liquid from their leg joints.',
      'In autumn they gather in large groups to sleep through the cold months.',
    ],
    didYouKnow: 'A ladybug may eat around 5,000 aphids in its lifetime.',
  },
  {
    id: 'african-elephant',
    name: 'African elephant',
    group: 'Mammals',
    superpower: 'Talks in rumbles you cannot hear',
    icon: PawPrint,
    visual: 'bg-linear-to-br from-[#e3e1dc] to-[#8a8578] text-white',
    stats: [
      { label: 'Weight', value: 'Up to 6 tonnes' },
      { label: 'Trunk', value: '40,000 muscles' },
      { label: 'Diet', value: '150 kg a day' },
    ],
    media: [
      {
        label: 'The trunk',
        icon: Wind,
        visual: 'bg-linear-to-br from-[#e3e1dc] to-[#8a8578] text-white',
        src: '/images/animals/field-guide/af-elephant-1.jpg',
        alt: 'An African elephant facing the camera across the savanna',
      },
      {
        label: 'The herd',
        icon: PawPrint,
        visual: 'bg-linear-to-br from-[#ffe6c7] to-sun-500 text-ink',
        src: '/images/animals/field-guide/af-elephant-2.jpg',
        alt: 'A herd of elephants gathered at a waterhole',
      },
      {
        label: 'The ears',
        icon: Ear,
        visual: 'bg-linear-to-br from-[#f6d9e8] to-[#c86f9b] text-white',
        src: '/images/animals/field-guide/af-elephant-3.jpg',
        alt: 'An African elephant with its ears spread wide',
        objectPosition: 'center 25%',
      },
    ],
    intro:
      'Elephants live in family herds led by the oldest female. They greet each other, mourn their dead, and remember routes to water they have not visited for years.',
    facts: [
      'Much of their talk is a deep rumble below human hearing, felt through the ground as much as heard.',
      'The trunk is a nose and an upper lip, with around 40,000 muscle bundles and no bones at all.',
      'Their huge ears work as radiators, and flapping them can cool several litres of blood at once.',
    ],
    didYouKnow:
      'An elephant can hold about eight litres of water in its trunk, then squirt it into its mouth.',
  },
  {
    id: 'dragonfly',
    name: 'Dragonfly',
    group: 'Insects',
    superpower: 'Catches 95% of what it chases',
    icon: Bug,
    visual: 'bg-linear-to-br from-[#d5f0ec] to-[#2f8f83] text-white',
    stats: [
      { label: 'Wings', value: 'Four, independent' },
      { label: 'Speed', value: '50 km/h' },
      { label: 'Eyes', value: '30,000 lenses' },
    ],
    media: [
      {
        label: 'The wings',
        icon: Feather,
        visual: 'bg-linear-to-br from-[#d5f0ec] to-[#2f8f83] text-white',
        src: '/images/animals/field-guide/dragonfly-1.jpg',
        alt: 'A dragonfly with patterned wings spread flat',
      },
      {
        label: 'The eyes',
        icon: Eye,
        visual: 'bg-linear-to-br from-[#dff0f7] to-ocean-500 text-white',
        src: '/images/animals/field-guide/dragonfly-2.jpg',
        alt: 'A close-up of a dragonfly’s huge compound eyes',
      },
      {
        label: 'The pond',
        icon: Droplets,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/animals/field-guide/dragonfly-3.jpg',
        alt: 'A red dragonfly perched above the water',
      },
    ],
    intro:
      'Dragonflies are the hunters of the insect world. Their four wings work separately, so they can stop dead, spin and reverse in mid-air.',
    facts: [
      'Their eyes are made of thousands of tiny lenses and see almost all the way around them.',
      'Each wing can twist and beat on its own, which is why their flight looks so sudden and precise.',
      'Their young, called nymphs, live underwater for years before climbing out to become adults.',
    ],
    didYouKnow:
      'Dragonflies were flying before the dinosaurs, and some ancient ones had 70 cm wingspans.',
  },
  {
    id: 'bottlenose-dolphin',
    name: 'Bottlenose dolphin',
    group: 'Water',
    superpower: 'Sees the world with sound',
    icon: Droplets,
    visual: 'bg-linear-to-br from-[#cfe9f8] to-[#2f7ea8] text-white',
    stats: [
      { label: 'Length', value: 'Up to 4 m' },
      { label: 'Pod', value: '10–30 dolphins' },
      { label: 'Sleep', value: 'One half at a time' },
    ],
    media: [
      {
        label: 'The echo',
        icon: Radar,
        visual: 'bg-linear-to-br from-[#cfe9f8] to-[#2f7ea8] text-white',
        src: '/images/animals/field-guide/bn-dolphin-1.jpg',
        alt: 'A bottlenose dolphin lifting its head from the water',
        objectPosition: 'center 30%',
      },
      {
        label: 'The leap',
        icon: Waves,
        visual: 'bg-linear-to-br from-ocean-100 to-ocean-600 text-white',
        src: '/images/animals/field-guide/bn-dolphin-2.jpg',
        alt: 'A bottlenose dolphin leaping clear of the waves',
      },
      {
        label: 'The pod',
        icon: Heart,
        visual: 'bg-linear-to-br from-[#f6d9e8] to-[#c86f9b] text-white',
        src: '/images/animals/field-guide/bn-dolphin-3.jpg',
        alt: 'Two bottlenose dolphins surfacing together',
        objectPosition: 'center 30%',
      },
    ],
    intro:
      'Bottlenose dolphins live in social groups and keep in touch with whistles and clicks. They are one of the few animals that seem to recognise themselves in a mirror.',
    facts: [
      'They send out clicks and listen for the echoes to build a picture of objects, even in murky water.',
      'They rest one half of the brain at a time, so they can keep breathing and watching for danger.',
      'Each dolphin has its own signature whistle, which works like a name.',
    ],
    didYouKnow:
      'Dolphins call to each other using signature whistles, and can recognise a friend by that whistle alone.',
  },
  {
    id: 'hummingbird',
    name: 'Ruby-throated hummingbird',
    group: 'Birds',
    superpower: 'Hovers, then flies backwards',
    icon: Bird,
    visual: 'bg-linear-to-br from-[#d8f2d0] to-[#2f8f4e] text-white',
    stats: [
      { label: 'Weight', value: '3 g' },
      { label: 'Heart', value: '1,200 beats a minute' },
      { label: 'Diet', value: 'Nectar' },
    ],
    media: [
      {
        label: 'The hover',
        icon: Wind,
        visual: 'bg-linear-to-br from-[#d8f2d0] to-[#2f8f4e] text-white',
        src: '/images/animals/field-guide/rt-hummingbird-1.jpg',
        alt: 'A ruby-throated hummingbird hovering in mid-air',
      },
      {
        label: 'The heart',
        icon: HeartPulse,
        visual: 'bg-linear-to-br from-[#ffd2d2] to-[#c22f2f] text-white',
        src: '/images/animals/field-guide/rt-hummingbird-2.jpg',
        alt: 'A ruby-throated hummingbird perched among flowers',
      },
      {
        label: 'The feeder',
        icon: Droplets,
        visual: 'bg-linear-to-br from-[#ffe6c7] to-sun-500 text-ink',
        src: '/images/animals/field-guide/rt-hummingbird-3.jpg',
        alt: 'A hummingbird feeding at a red flower',
      },
    ],
    intro:
      'The ruby-throated hummingbird is barely bigger than a bumblebee, but it lives a fast, hungry life. Its wings beat so quickly that they hum.',
    facts: [
      'It can beat its wings over 50 times a second, which lets it hover, reverse and even fly upside down.',
      'At night it enters torpor, slowing its heart and body temperature to survive without food.',
      'Every autumn many cross 800 km of open sea in one non-stop flight.',
    ],
    didYouKnow:
      'A hummingbird may visit more than 1,000 flowers in a day and must feed every 15 minutes or so.',
  },
  {
    id: 'firefly',
    name: 'Firefly',
    group: 'Insects',
    superpower: 'Makes cold light in its belly',
    icon: Bug,
    visual: 'bg-linear-to-br from-[#fff6c2] to-[#7f8b2e] text-ink',
    stats: [
      { label: 'Length', value: '1–2 cm' },
      { label: 'Flash', value: 'A code per species' },
      { label: 'Diet', value: 'Snails and nectar' },
    ],
    media: [
      {
        label: 'The glow',
        icon: Sparkles,
        visual: 'bg-linear-to-br from-[#fff6c2] to-[#7f8b2e] text-ink',
        src: '/images/animals/field-guide/firefly-2.jpg',
        alt: 'A close-up of a firefly glowing on a blade of grass',
      },
      {
        label: 'The signal',
        icon: Zap,
        visual: 'bg-linear-to-br from-[#ffe6b8] to-[#e08a3c] text-ink',
        src: '/images/animals/field-guide/firefly-3.jpg',
        alt: 'A single firefly flashing in the dark',
      },
      {
        label: 'The meadow',
        icon: Leaf,
        visual: 'bg-linear-to-br from-leaf-100 to-leaf-600 text-white',
        src: '/images/animals/field-guide/firefly-1.jpg',
        alt: 'A meadow lit by dozens of fireflies at night',
      },
    ],
    intro:
      'On summer nights fireflies flash to talk to each other. Each species has its own pattern of flashes, and the males are usually the ones flying around.',
    facts: [
      'The light comes from a chemical reaction between luciferin and oxygen, and gives off almost no heat.',
      'Females often wait in the grass and flash back when they like a male’s signal.',
      'Their larvae live in soil and glow too, which is why they are called glow-worms.',
    ],
    didYouKnow:
      'Firefly light is nearly 100% efficient, wasting almost nothing as heat, unlike a light bulb.',
  },
  {
    id: 'polar-bear',
    name: 'Polar bear',
    group: 'Mammals',
    superpower: 'Nearly invisible to a heat camera',
    icon: PawPrint,
    visual: 'bg-linear-to-br from-white to-[#a9c6d8] text-ocean-600',
    stats: [
      { label: 'Weight', value: 'Up to 600 kg' },
      { label: 'Swim', value: '100 km without rest' },
      { label: 'Diet', value: 'Mostly seals' },
    ],
    media: [
      {
        label: 'The fur',
        icon: Snowflake,
        visual: 'bg-linear-to-br from-white to-ocean-100 text-ocean-600 dark:from-[#101a2e]',
        src: '/images/animals/field-guide/polar-bear-1.jpg',
        alt: 'A polar bear standing upright on the ice',
      },
      {
        label: 'The swim',
        icon: Waves,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
        src: '/images/animals/field-guide/polar-bear-2.jpg',
        alt: 'A polar bear swimming with its head above the water',
      },
      {
        label: 'The wait',
        icon: Timer,
        visual: 'bg-linear-to-br from-[#dfe8ee] to-[#7d93a6] text-white',
        src: '/images/animals/field-guide/polar-bear-3.jpg',
        alt: 'A polar bear lying still on the ice',
      },
    ],
    intro:
      'Polar bears are counted as marine mammals. They spend most of their lives on Arctic sea ice, hunting seals at breathing holes and swimming between floes.',
    facts: [
      'Their fur is see-through, not white, and the skin underneath is black to absorb sunlight.',
      'A layer of fat up to 11 cm thick keeps them warm and helps them float like a life jacket.',
      'They can swim for days, using their wide front paws as paddles.',
    ],
    didYouKnow:
      'Because their fur reflects heat instead of releasing it, a polar bear can be almost invisible on a thermal camera.',
  },
  {
    id: 'ostrich',
    name: 'Ostrich',
    group: 'Birds',
    superpower: 'Outruns a racehorse on two legs',
    icon: Bird,
    visual: 'bg-linear-to-br from-[#f0dcc4] to-[#9a6c4e] text-white',
    stats: [
      { label: 'Height', value: '2.7 m tall' },
      { label: 'Egg', value: 'About 1.5 kg' },
      { label: 'Speed', value: '70 km/h' },
    ],
    media: [
      {
        label: 'The sprint',
        icon: Zap,
        visual: 'bg-linear-to-br from-[#f0dcc4] to-[#9a6c4e] text-white',
        src: '/images/animals/field-guide/ostrich-3.jpg',
        alt: 'Two ostriches running across the savanna',
        objectPosition: 'center 30%',
      },
      {
        label: 'The egg',
        icon: Egg,
        visual: 'bg-linear-to-br from-[#ffe6c7] to-sun-500 text-ink',
        src: '/images/animals/field-guide/ostrich-2.jpg',
        alt: 'An ostrich sitting on a nest of eggs',
      },
      {
        label: 'The feathers',
        icon: Feather,
        visual: 'bg-linear-to-br from-[#e3e1dc] to-[#8a8578] text-white',
        src: '/images/animals/field-guide/ostrich-1.jpg',
        alt: 'An ostrich standing in a field of pink flowers',
      },
    ],
    intro:
      'The ostrich is the largest living bird, too heavy to fly but built for running. It lives on open African grassland, where speed is the best way to escape.',
    facts: [
      'It can sprint at 70 km/h and hold a steady 50 km/h for long distances.',
      'Its egg is the biggest single cell in the world, roughly equal to 24 chicken eggs.',
      'The head-in-the-sand story is a myth: it digs shallow holes to turn and check its eggs.',
    ],
    didYouKnow:
      'An ostrich has eyes bigger than its brain, and each eye is nearly 5 cm across.',
  },
  {
    id: 'greater-flamingo',
    name: 'Greater flamingo',
    group: 'Birds',
    superpower: 'Eats itself pink',
    icon: Bird,
    visual: 'bg-linear-to-br from-[#ffdae6] to-[#e06a92] text-white',
    stats: [
      { label: 'Height', value: '1.5 m' },
      { label: 'Diet', value: 'Shrimp and algae' },
      { label: 'Pose', value: 'One leg' },
    ],
    media: [
      {
        label: 'The colour',
        icon: Sun,
        visual: 'bg-linear-to-br from-[#ffdae6] to-[#e06a92] text-white',
        src: '/images/animals/field-guide/g-flamingo-2.jpg',
        alt: 'A greater flamingo standing in still water',
      },
      {
        label: 'The beak',
        icon: Droplets,
        visual: 'bg-linear-to-br from-[#cfeaf5] to-ocean-600 text-white',
        src: '/images/animals/field-guide/g-flamingo-1.jpg',
        alt: 'Two greater flamingos wading among reeds',
      },
      {
        label: 'The one leg',
        icon: Feather,
        visual: 'bg-linear-to-br from-[#ffe6c7] to-sun-500 text-ink',
        src: '/images/animals/field-guide/g-flamingo-3.jpg',
        alt: 'A flamingo preening while balanced on one leg',
        objectPosition: 'center 30%',
      },
    ],
    intro:
      'Greater flamingos gather in enormous flocks on shallow lakes, where they wade on long legs and filter tiny food from the water.',
    facts: [
      'They are born grey. The pink comes from pigments in the shrimp and algae they eat.',
      'They feed upside down, pumping water through a beak lined with comb-like plates.',
      'Standing on one leg may help them save heat, since legs lose warmth quickly in water.',
    ],
    didYouKnow:
      'A flamingo’s pink colour fades if it does not get enough of the right food.',
  },
]

// ---------------------------------------------------------- habitat activity
export const habitats = [
  {
    id: 'arctic',
    label: 'Arctic',
    icon: Snowflake,
    scene:
      'bg-linear-to-br from-white via-ocean-100 to-[#cfeaf5] dark:from-[#12253a] dark:via-[#182b3f] dark:to-[#1f4b63]',
    chip: 'bg-ocean-600 text-cream',
    card: 'border-ocean-600/25 bg-surface/85 hover:border-ocean-600/55 hover:bg-surface',
    creatureIcon: 'bg-ocean-100 text-ocean-600',
    option:
      'border-ocean-600/35 bg-ocean-100/45 hover:border-ocean-600/65 hover:bg-ocean-100/80',
    blurb: 'Cold, bright, and frozen for most of the year.',
    creatures: [
      {
        name: 'Emperor penguin',
        icon: Bird,
        image: '/images/animals/activity/emp-penguin.jpg',
        trick: 'Huddles in a moving circle so every bird gets a turn out of the wind.',
      },
      {
        name: 'Polar bear',
        icon: PawPrint,
        image: '/images/animals/activity/polar-bear.jpg',
        trick: 'Black skin and hollow fur catch sunlight, and a thick fat layer keeps the cold out.',
      },
      {
        name: 'Arctic fox',
        icon: PawPrint,
        image: '/images/animals/activity/arctic-fox.jpg',
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
    scene:
      'bg-linear-to-br from-[#fff4d6] via-sun-100 to-[#f2c078] dark:from-[#3a2c12] dark:via-[#4a3413] dark:to-[#6b4a18]',
    chip: 'bg-sun-500 text-ink',
    card: 'border-sun-500/40 bg-surface/85 hover:border-sun-500/80 hover:bg-surface',
    creatureIcon: 'bg-sun-100 text-[#8a6d1f] dark:text-sun-400',
    option:
      'border-sun-500/55 bg-sun-100/55 hover:border-sun-500 hover:bg-sun-100',
    blurb: 'Hot days, cold nights, and very little water.',
    creatures: [
      {
        name: 'Fennec fox',
        icon: PawPrint,
        image: '/images/animals/activity/fennec-fox.jpg',
        trick: 'Hunts at night and radiates heat through enormous ears.',
      },
      {
        name: 'Desert tortoise',
        icon: Turtle,
        image: '/images/animals/activity/desert-tortoise.jpg',
        trick: 'Stores water in its bladder and spends the hottest hours underground.',
      },
      {
        name: 'Ostrich',
        icon: Bird,
        image: '/images/animals/activity/ostrich.jpg',
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
    scene:
      'bg-linear-to-br from-leaf-100 via-[#dcf1dc] to-[#8fc98f] dark:from-[#10281a] dark:via-[#143021] dark:to-[#1c4a2c]',
    chip: 'bg-leaf-600 text-cream',
    card: 'border-leaf-600/25 bg-surface/85 hover:border-leaf-600/55 hover:bg-surface',
    creatureIcon: 'bg-leaf-100 text-leaf-700',
    option:
      'border-leaf-600/35 bg-leaf-100/55 hover:border-leaf-600/70 hover:bg-leaf-100',
    blurb: 'Warm, wet, and crowded with life at every level.',
    creatures: [
      {
        name: 'Sloth',
        icon: PawPrint,
        image: '/images/animals/activity/sloth.jpg',
        trick: 'Moves so slowly that algae grows in its fur and hides it among the leaves.',
      },
      {
        name: 'Toucan',
        icon: Bird,
        image: '/images/animals/activity/toucan.jpg',
        trick: 'The huge beak is light and full of blood vessels that help it lose heat.',
      },
      {
        name: 'Morpho butterfly',
        icon: Bug,
        image: '/images/animals/activity/morpho-butterfly.jpg',
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
    scene:
      'bg-linear-to-br from-[#cfeaf5] via-ocean-100 to-ocean-600 dark:from-[#102a38] dark:via-[#182b47] dark:to-[#2a3a6b]',
    chip: 'bg-ocean-600 text-cream',
    card: 'border-ocean-600/30 bg-surface/85 hover:border-ocean-600/60 hover:bg-surface',
    creatureIcon: 'bg-ocean-100 text-ocean-600',
    option:
      'border-ocean-600/40 bg-ocean-100/50 hover:border-ocean-600/70 hover:bg-ocean-100',
    blurb: 'The largest habitat on Earth, from sunlight to total dark.',
    creatures: [
      {
        name: 'Octopus',
        icon: Shell,
        image: '/images/animals/activity/octopus.jpg',
        trick: 'Has no bones, so it can squeeze through a hole the size of its eye.',
      },
      {
        name: 'Great white shark',
        icon: Fish,
        image: '/images/animals/activity/great-white-shark.jpg',
        trick: 'Senses the tiny electric fields made by a heartbeat in the water.',
      },
      {
        name: 'Sea turtle',
        icon: Turtle,
        image: '/images/animals/activity/sea-turtle.jpg',
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
      hint: 'Think about which animal lives somewhere with long, freezing winters — and needs a trick to survive them without migrating.',
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
      hint: 'Consider what the butterfly needs in winter that its summer home cannot provide.',
    },
    {
      question: 'What does an octopus have three of?',
      options: ['Hearts', 'Bones', 'Lungs', 'Fins'],
      answer: 0,
      explain: 'Two hearts serve the gills and one serves the rest of the body. Its blood is blue.',
      hint: 'An octopus breathes through gills like a fish — but it also needs to pump blood to the rest of its body separately.',
    },
  ],
}
