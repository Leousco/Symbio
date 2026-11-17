import { useState } from 'react'
import { Droplets, RotateCcw, Sparkles, Sun, Thermometer } from 'lucide-react'
import GlassCard from '../GlassCard'
import { growLabTips } from '../../data/plants'

const START = { water: 55, sunlight: 70, temperature: 22, soil: 'rich' }

function readPlant(water, sunlight, temperature, soil) {
  const dry = water < 35
  const soggy = water > 80
  const dark = sunlight < 35
  const scorched = sunlight > 88
  const cold = temperature < 10
  const hot = temperature > 32

  if (dry) return { key: 'dry', title: 'Too dry', text: growLabTips.thirsty }
  if (soggy) return { key: 'soggy', title: 'Too wet', text: growLabTips.soggy }
  if (dark) return { key: 'dark', title: 'Too dark', text: growLabTips.dark }
  if (scorched) return { key: 'scorched', title: 'Too much sun', text: growLabTips.scorched }
  if (cold) return { key: 'cold', title: 'Too cold', text: 'Warmth helps the plant grow. Move it somewhere above 10°C.' }
  if (hot) return { key: 'hot', title: 'Too hot', text: 'Very hot air can stress the plant and make it lose water quickly.' }
  if (soil === 'sandy') return { key: 'soil', title: 'Sandy soil', text: growLabTips.sandy }
  if (soil === 'clay') {
    return { key: 'soil', title: 'Heavy clay soil', text: 'Clay holds onto water and can leave roots short of air. Try a lighter, well-draining soil.' }
  }
  if (soil === 'rocky') {
    return { key: 'soil', title: 'Rocky soil', text: 'There is little fine soil to hold water and nutrients around the roots.' }
  }
  return { key: 'happy', title: 'Perfect balance', text: growLabTips.happy }
}

const toneByKey = {
  happy: 'border border-leaf-600/40 bg-leaf-100 text-leaf-700',
  dry: 'border border-sun-500/40 bg-sun-100 text-[#8a6d1f] dark:text-sun-400',
  soggy: 'border border-ocean-500/40 bg-ocean-100 text-ocean-600',
  dark: 'border border-bark/20 bg-bark/10 text-bark',
  scorched:
    'border border-[#d16b5a]/40 bg-[#fbe6e1] text-[#a8412f] dark:bg-[#3a1c1f] dark:text-[#fca5a5]',
  soil: 'border border-[#b99a63]/50 bg-[#f3e9d6] text-[#7a5f33] dark:bg-[#2c2517] dark:text-[#e8d6ad]',
  cold: 'border border-ocean-500/40 bg-ocean-100 text-ocean-600',
  hot: 'border border-[#d16b5a]/35 bg-[#fbe6e1] text-[#8a493b] dark:bg-[#3a1c1f] dark:text-[#fca5a5]',
}

function PlantArt({ water, sunlight, temperature, soil }) {
  const dry = water < 35
  const soggy = water > 80
  const dark = sunlight < 35
  const scorched = sunlight > 88
  const cold = temperature < 10
  const hot = temperature > 32
  const happy = !dry && !soggy && !dark && !scorched && !cold && !hot && soil === 'rich'

  const stressed = dry || dark || cold || hot || soil !== 'rich'
  const leafColor = dry || dark || cold || hot
    ? '#c9b45b'
    : scorched
      ? '#b8863b'
      : soggy
        ? '#6f8f5a'
        : soil === 'rocky'
          ? '#82966b'
          : '#3f9b4b'
  const stemColor = dark || cold ? '#a8b26a' : soggy ? '#4d7a4a' : '#2f7d3a'
  const droop = dry ? 16 : soggy ? 12 : stressed ? 9 : 0
  const stretch = dark ? 24 : 0
  const flowerY = 58 - stretch
  const soilColor = soil === 'sandy' ? '#d5b875' : soil === 'clay' ? '#98684b' : soil === 'rocky' ? '#777b72' : '#68452e'

  return (
    <svg
      viewBox="0 0 200 236"
      className="h-full w-full"
      role="img"
      aria-label={happy ? 'A healthy flowering plant' : 'A plant responding to its growing conditions'}
    >
      <defs>
        <linearGradient id="leaf" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#73bc65" />
          <stop offset="1" stopColor={leafColor} />
        </linearGradient>
        <linearGradient id="pot" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#e89a70" />
          <stop offset="1" stopColor="#bd6345" />
        </linearGradient>
      </defs>

      <circle
        cx="168"
        cy="34"
        r={12 + sunlight / 12}
        fill="#ffc83d"
        opacity={0.3 + sunlight / 230}
        style={{ transition: 'r 400ms ease, opacity 400ms ease' }}
      />

      <ellipse cx="100" cy="224" rx="48" ry="7" fill="#59745b" opacity=".14" />
      <path d="M100 174c-12 0-23-8-31-15m31 15c12-1 24-9 31-17" fill="none" stroke="#71905a" strokeWidth="3" strokeLinecap="round" />

      <g
        style={{
          transform: `rotate(${droop}deg)`,
          transformOrigin: '100px 171px',
          transformBox: 'view-box',
          transition: 'transform 500ms ease',
        }}
      >
        <path
          d={`M100 172 C 94 ${132 - stretch}, 106 ${98 - stretch}, 100 ${flowerY + 10}`}
          fill="none"
          stroke={stemColor}
          strokeWidth="5"
          strokeLinecap="round"
          style={{ transition: 'd 500ms ease, stroke 500ms ease' }}
        />
        <path d={`M98 143 Q79 137 70 ${130 - stretch * 0.45} M102 128 Q121 124 131 ${116 - stretch * 0.45} M99 112 Q84 104 78 ${96 - stretch * 0.45}`} fill="none" stroke={stemColor} strokeWidth="3" strokeLinecap="round" />

        {[
          { cx: 77, cy: 134, rx: 23, ry: 11, rotate: -27 },
          { cx: 123, cy: 120, rx: 22, ry: 10, rotate: 25 },
          { cx: 82, cy: 100, rx: 19, ry: 9, rotate: -28 },
        ].map(({ cx, cy, rx, ry, rotate }) => {
          const y = cy - stretch * 0.55
          return (
            <g key={`${cx}-${cy}`} transform={`rotate(${rotate} ${cx} ${y})`}>
              <ellipse cx={cx} cy={y} rx={rx} ry={ry} fill="url(#leaf)" style={{ transition: 'fill 500ms ease' }} />
              <path d={`M${cx - rx + 4} ${y} Q${cx} ${y + 1} ${cx + rx - 3} ${y}`} fill="none" stroke="#d7e9ae" strokeWidth="1.2" opacity=".75" />
            </g>
          )
        })}
        <g transform={`rotate(28 122 ${137 - stretch * 0.55})`}>
          <ellipse cx="122" cy={137 - stretch * 0.55} rx="23" ry="11" fill="url(#leaf)" />
          <path d={`M101 ${137 - stretch * 0.55} Q122 ${138 - stretch * 0.55} 142 ${137 - stretch * 0.55}`} fill="none" stroke="#d7e9ae" strokeWidth="1.2" opacity=".75" />
        </g>

        {happy && (
          <g className="animate-pop" style={{ transformBox: 'view-box' }}>
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <circle
                key={angle}
                cx={100 + 12 * Math.cos((angle * Math.PI) / 180)}
                cy={flowerY + 12 * Math.sin((angle * Math.PI) / 180)}
                r="7"
                fill="#ffd45c"
                stroke="#f6b83d"
                strokeWidth="1"
              />
            ))}
            <circle cx="100" cy={flowerY} r="6" fill="#ad6b27" />
          </g>
        )}
      </g>

      <path d="M55 170h90l-9 46a9 9 0 0 1-9 7H73a9 9 0 0 1-9-7z" fill="url(#pot)" />
      <path d="M66 180l5 31m63-31-5 31" fill="none" stroke="#f6b08a" strokeWidth="2" opacity=".55" />
      <path d="M70 182h60" stroke="#955137" strokeWidth="3" opacity=".48" />
      <rect x="50" y="164" width="100" height="15" rx="6" fill="#e89a70" />
      <ellipse cx="100" cy="166" rx="44" ry="5" fill={soilColor} />
    </svg>
  )
}

function GrowLab() {
  const [water, setWater] = useState(START.water)
  const [sunlight, setSunlight] = useState(START.sunlight)
  const [temperature, setTemperature] = useState(START.temperature)
  const [soil, setSoil] = useState(START.soil)

  const status = readPlant(water, sunlight, temperature, soil)
  const happy = status.key === 'happy'

  return (
    <GlassCard
      as="section"
      id="activity"
      aria-labelledby="growlab-heading"
      className="scroll-mt-24 space-y-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-bark/60">Activity</p>
          <h2 id="growlab-heading" className="mt-1 font-heading text-4xl font-semibold">
            Grow lab
          </h2>
          <p className="mt-1 max-w-xl text-bark/80">
            Give the plant light, water and soil. Find the balance that makes it flower.
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-extrabold transition ${
            happy ? 'bg-leaf-600 text-cream' : 'bg-surface/70 text-bark/70'
          }`}
        >
          <Sparkles size={16} />
          {happy ? 'Flower grown' : 'Goal: grow a flower'}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="space-y-5 rounded-3xl border border-hairline/80 bg-surface/55 p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="water" className="flex items-center gap-2 font-bold">
                <Droplets size={18} className="text-ocean-600" />
                Water
              </label>
              <span className="text-sm font-bold text-bark/60">{water}%</span>
            </div>
            <input
              id="water"
              type="range"
              min="0"
              max="100"
              value={water}
              onChange={(event) => setWater(Number(event.target.value))}
              className="mt-3 w-full accent-ocean-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="sunlight" className="flex items-center gap-2 font-bold">
                <Sun size={18} className="text-sun-500" />
                Sunlight
              </label>
              <span className="text-sm font-bold text-bark/60">{sunlight}%</span>
            </div>
            <input
              id="sunlight"
              type="range"
              min="0"
              max="100"
              value={sunlight}
              onChange={(event) => setSunlight(Number(event.target.value))}
              className="mt-3 w-full accent-sun-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="temperature" className="flex items-center gap-2 font-bold">
                <Thermometer size={18} className="text-[#d16b5a]" />
                Temperature
              </label>
              <span className="text-sm font-bold text-bark/60">{temperature}°C</span>
            </div>
            <input
              id="temperature"
              type="range"
              min="0"
              max="40"
              value={temperature}
              onChange={(event) => setTemperature(Number(event.target.value))}
              className="mt-3 w-full accent-[#d16b5a]"
            />
          </div>

          <div>
            <fieldset>
              <legend className="font-bold">Soil type</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { id: 'rich', label: 'Rich' },
                  { id: 'sandy', label: 'Sandy' },
                  { id: 'clay', label: 'Clay' },
                  { id: 'rocky', label: 'Rocky' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={soil === id}
                    onClick={() => setSoil(id)}
                    className={`min-h-11 rounded-2xl border-2 px-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${
                      soil === id
                        ? 'border-bark bg-bark text-cream'
                        : 'border-hairline bg-surface/80 text-bark hover:bg-surface'
                    }`}
                  >
                    {label} soil
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <button
            type="button"
            onClick={() => {
              setWater(START.water)
              setSunlight(START.sunlight)
              setTemperature(START.temperature)
              setSoil(START.soil)
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-bark/20 bg-surface/70 px-4 text-sm font-bold transition hover:bg-surface"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="relative flex h-full min-h-56 items-center justify-center overflow-hidden rounded-[2rem] border border-hairline/75 bg-linear-to-b from-[#d8eef4] via-[#f6faf1] to-[#e2ebd8] p-4 dark:from-[#0f2a33] dark:via-[#101a26] dark:to-[#12251c]">
          <div aria-hidden="true" className="absolute left-0 right-0 top-[80%] h-px bg-surface/70" />
          <div className="relative h-64 w-56">
            <PlantArt water={water} sunlight={sunlight} temperature={temperature} soil={soil} />
          </div>
        </div>
      </div>

      <div
        aria-live="polite"
        className={`rounded-3xl p-5 transition-colors ${toneByKey[status.key]}`}
      >
        <p className="font-heading text-xl font-semibold">{status.title}</p>
        <p className="mt-1 leading-relaxed">{status.text}</p>
      </div>
    </GlassCard>
  )
}

export default GrowLab
