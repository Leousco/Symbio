// ─── River Cleanup — canvas engine (v2, fully procedural art) ────────────────
// Owns the river world: flowing water, shoreline, boat, garbage, obstacles,
// wildlife, rescue animals, particles and screen juice.
// The React component owns the HUD, overlays, and game state.
//
// No image assets are used. Everything is drawn with canvas paths so it stays
// crisp at any size, themes for day/night, and ships in a single file.
//
// Public API is unchanged from v1:
//   setSize, update(dt, input, difficulty), draw(ctx, {dark, reduceMotion}),
//   start, stop, nearestRescueDistance, RESCUE_R, and the four on* callbacks.

const TAU = Math.PI * 2
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const lerp = (a, b, t) => a + (b - a) * t
const rand = (lo, hi) => lo + Math.random() * (hi - lo)
const randInt = (lo, hi) => Math.floor(rand(lo, hi + 1))
const wrapMod = (v, m) => ((v % m) + m) % m

// ─── Tunables ─────────────────────────────────────────────────────────────────

const FLOW = 56          // px/s the water moves down the screen
const BANK_PARALLAX = 0.8 // banks scroll a little slower than the water

const BOAT_W = 60
const BOAT_H = 36
const BOAT_SPEED = 220
const COLLECT_R = 46
export const RESCUE_R = 60

// ─── Colour palettes ──────────────────────────────────────────────────────────

const DAY = {
  night: false,
  riverA: '#0e5f8e', riverB: '#1a82ba', riverC: '#34aed0',
  shallow: 'rgba(130,240,215,0.42)',
  foam: 'rgba(255,255,255,0.62)',
  shimmer: 'rgba(255,255,255,0.55)',
  causticA: 0.15,
  glint: '#ffffff',
  haze: 'rgba(235,248,255,0.34)',
  vignette: 'rgba(0,25,45,0.30)',
  waterMask: 'rgba(24,126,184,0.88)',
  sand: '#d2c08a', sandDark: '#a89560',
  grassLight: '#9ad452', grass: '#62a83a', grassDark: '#3a7a2c', forest: '#2a5a24',
  treeA: '#3f9a30', treeB: '#2d7a26', treeC: '#7fcf4a', treeDark: '#1d5018',
  reed: '#4f8f2e', cattail: '#6b4426',
  rockA: '#9a8c7a', rockB: '#625648', rockC: '#d2c4a8',
  logA: '#9a6e44', logB: '#5a3a1e', logC: '#c8a070', plank2: '#8a6a46',
  pad: '#43a043', padDark: '#2a7030',
  ripple: 'rgba(255,255,255,0.40)',
  shadow: 'rgba(0,10,30,0.30)',
}

const NIGHT = {
  night: true,
  riverA: '#06213a', riverB: '#0b3558', riverC: '#124a72',
  shallow: 'rgba(70,170,200,0.22)',
  foam: 'rgba(160,210,255,0.48)',
  shimmer: 'rgba(130,190,255,0.40)',
  causticA: 0.09,
  glint: '#cfe6ff',
  haze: 'rgba(40,70,120,0.30)',
  vignette: 'rgba(0,0,12,0.55)',
  waterMask: 'rgba(10,52,92,0.9)',
  sand: '#6a6048', sandDark: '#4a4230',
  grassLight: '#3a6a2a', grass: '#244a1c', grassDark: '#173612', forest: '#0f2610',
  treeA: '#1d4a1a', treeB: '#133614', treeC: '#2f6a28', treeDark: '#0a200c',
  reed: '#2c5a22', cattail: '#3e2a1a',
  rockA: '#5a5248', rockB: '#34302c', rockC: '#8a8070',
  logA: '#6a4a2e', logB: '#34210f', logC: '#8a6a44', plank2: '#58402a',
  pad: '#27602c', padDark: '#17401c',
  ripple: 'rgba(130,190,255,0.28)',
  shadow: 'rgba(0,0,10,0.45)',
}

// ─── Object tables ────────────────────────────────────────────────────────────

const GARBAGE_TYPES = [
  { kind: 'bottle',  points: 10, label: '+10', color: '#38bdf8', accent: '#bae6fd', dark: '#0369a1' },
  { kind: 'bag',     points: 15, label: '+15', color: '#c084fc', accent: '#e9d5ff', dark: '#7e22ce' },
  { kind: 'can',     points: 20, label: '+20', color: '#fbbf24', accent: '#fef08a', dark: '#b45309' },
  { kind: 'foam',    points: 8,  label: '+8',  color: '#e5e7eb', accent: '#ffffff', dark: '#6b7280' },
  { kind: 'cup',     points: 12, label: '+12', color: '#d6a46a', accent: '#fde7c4', dark: '#78350f' },
  { kind: 'tire',    points: 25, label: '+25', color: '#a8a29e', accent: '#e7e5e4', dark: '#1c1917' },
]

const OBSTACLE_TYPES = [
  { kind: 'rock',   damage: 18 },
  { kind: 'log',    damage: 12 },
  { kind: 'debris', damage: 10 },
]

const SWIM_KINDS = ['fish', 'turtle']
const RESCUE_KINDS = ['deer', 'fox', 'rabbit']

const FISH_VARIANTS = [
  { top: '#ffb36b', body: '#ff8a3d', belly: '#ffe2c0', fin: '#ff6a1f', patch: '#fff4e6' }, // koi
  { top: '#6fd0ff', body: '#2f9bd8', belly: '#d6f3ff', fin: '#1b78b8', patch: null },      // blue
  { top: '#a9e0c0', body: '#5fa585', belly: '#e9fff3', fin: '#3f8264', patch: null },      // silver-green
]

const BIN_COLORS = ['#38bdf8', '#c084fc', '#fbbf24', '#d6a46a', '#e5e7eb', '#78716c']

// ─── Small helpers ────────────────────────────────────────────────────────────

function sr(seed) { // seeded pseudo-random [0,1)
  const v = Math.sin(seed * 9301 + 49297) * 233280
  return v - Math.floor(v)
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

function ell(ctx, x, y, rx, ry, rot = 0) {
  ctx.beginPath()
  ctx.ellipse(x, y, rx, ry, rot, 0, TAU)
}

function fillEll(ctx, color, x, y, rx, ry, rot = 0) {
  ell(ctx, x, y, rx, ry, rot)
  ctx.fillStyle = color
  ctx.fill()
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// Closed smooth curve through the midpoints of a polygon
function smoothPoly(ctx, pts) {
  const n = pts.length
  ctx.beginPath()
  ctx.moveTo((pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2)
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n]
    ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
  }
  ctx.closePath()
}

function star4(ctx, x, y, r, color, alpha) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU - Math.PI / 2
    const rr = i % 2 === 0 ? r : r * 0.28
    const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
  }
  ctx.closePath(); ctx.fill()
  ctx.restore()
}

// Halo-outlined fill: white halo, fill, thin dark line. Used so trash pops off water.
function outlined(ctx, fill, line, halo = 'rgba(255,255,255,0.85)', haloW = 4, lineW = 1.4) {
  ctx.lineJoin = 'round'
  ctx.strokeStyle = halo; ctx.lineWidth = haloW; ctx.stroke()
  ctx.fillStyle = fill; ctx.fill()
  ctx.strokeStyle = line; ctx.lineWidth = lineW; ctx.stroke()
}

// Seamless Worley "caustic" tile (bright web of light on the river bed)
function makeCausticTile(size, seed, makeCanvas) {
  const c = makeCanvas(size, size)
  const g = c.getContext('2d')
  const img = g.createImageData(size, size)
  const N = 6
  const cell = size / N
  const pts = []
  for (let gy = 0; gy < N; gy++) {
    for (let gx = 0; gx < N; gx++) {
      pts.push([
        (gx + 0.12 + 0.76 * sr(seed + gx * 13.7 + gy * 7.1)) * cell,
        (gy + 0.12 + 0.76 * sr(seed + gx * 5.3 + gy * 17.9 + 3)) * cell,
      ])
    }
  }
  const thr = cell * 0.26
  for (let y = 0; y < size; y++) {
    const cy = Math.floor(y / cell)
    for (let x = 0; x < size; x++) {
      const cx = Math.floor(x / cell)
      let d1 = 1e9, d2 = 1e9
      for (let oy = -1; oy <= 1; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          const p = pts[((cy + oy + N) % N) * N + ((cx + ox + N) % N)]
          let dx = Math.abs(x - p[0]); if (dx > size / 2) dx = size - dx
          let dy = Math.abs(y - p[1]); if (dy > size / 2) dy = size - dy
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < d1) { d2 = d1; d1 = d } else if (d < d2) d2 = d
        }
      }
      const k = clamp(1 - (d2 - d1) / thr, 0, 1)
      const a = Math.pow(k, 3)
      const i = (y * size + x) * 4
      img.data[i] = 255; img.data[i + 1] = 255; img.data[i + 2] = 255
      img.data[i + 3] = Math.round(a * 255)
    }
  }
  g.putImageData(img, 0, 0)
  return c
}

// ─── Particle ────────────────────────────────────────────────────────────────
// kinds: dot | text | drop | bubble | heart | spark

class Particle {
  constructor(x, y, color, text = null, o = {}) {
    this.x = x; this.y = y
    this.kind = o.kind || (text ? 'text' : 'dot')
    this.vx = o.vx ?? rand(-45, 45)
    this.vy = o.vy ?? rand(-95, -40)
    this.g = o.g ?? 65
    this.color = color; this.text = text
    this.radius = o.radius ?? (text ? 0 : rand(2.5, 5.5))
    this.life = o.life ?? (text ? 1.15 : rand(0.5, 0.9))
    this.spin = o.spin ?? 0
    this.rot = rand(0, TAU)
    this.age = 0
  }
  update(dt) {
    this.age += dt
    this.x += this.vx * dt
    this.y += this.vy * dt
    this.vy += this.g * dt
    this.rot += this.spin * dt
    return this.age < this.life
  }
  draw(ctx) {
    const t = this.age / this.life
    const alpha = clamp(1 - t * t, 0, 1)
    ctx.save()
    ctx.globalAlpha = alpha
    switch (this.kind) {
      case 'text': {
        const pop = t < 0.12 ? 0.7 + (t / 0.12) * 0.5 : 1.2 - t * 0.2
        ctx.font = `800 ${Math.round(16 * pop)}px "Nunito",sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 4
        ctx.strokeText(this.text, this.x, this.y)
        ctx.fillStyle = this.color
        ctx.fillText(this.text, this.x, this.y)
        break
      }
      case 'drop': {
        const r = this.radius * (1 - t * 0.35)
        ctx.fillStyle = this.color
        ctx.beginPath(); ctx.arc(this.x, this.y, r, 0, TAU); ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.beginPath(); ctx.arc(this.x - r * 0.3, this.y - r * 0.3, r * 0.38, 0, TAU); ctx.fill()
        break
      }
      case 'bubble': {
        const r = this.radius * (1 + t * 0.5)
        ctx.strokeStyle = this.color; ctx.lineWidth = 1.2
        ctx.beginPath(); ctx.arc(this.x, this.y, r, 0, TAU); ctx.stroke()
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.beginPath(); ctx.arc(this.x - r * 0.35, this.y - r * 0.35, r * 0.25, 0, TAU); ctx.fill()
        break
      }
      case 'heart': {
        const s = this.radius * (0.8 + Math.sin(Math.min(1, t * 3) * Math.PI * 0.5) * 0.4)
        ctx.translate(this.x, this.y)
        ctx.rotate(Math.sin(this.age * 5 + this.rot) * 0.25)
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.moveTo(0, s * 0.9)
        ctx.bezierCurveTo(-s * 1.7, -s * 0.1, -s * 0.9, -s * 1.3, 0, -s * 0.45)
        ctx.bezierCurveTo(s * 0.9, -s * 1.3, s * 1.7, -s * 0.1, 0, s * 0.9)
        ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.beginPath(); ctx.arc(-s * 0.55, -s * 0.35, s * 0.22, 0, TAU); ctx.fill()
        break
      }
      case 'spark': {
        ctx.translate(this.x, this.y); ctx.rotate(this.rot)
        star4(ctx, 0, 0, this.radius * (1 - t * 0.4), this.color, 1)
        break
      }
      default: {
        ctx.fillStyle = this.color
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, TAU); ctx.fill()
      }
    }
    ctx.restore()
  }
}

// ─── Ripple (rings drift downstream with the water) ──────────────────────────

class Ripple {
  constructor(x, y, maxR = 28) {
    this.x = x; this.y = y; this.r = 3; this.maxR = maxR
    this.alpha = 0.7; this.done = false; this.vy = FLOW * 0.9
  }
  update(dt) {
    this.r += this.maxR * dt * 1.8
    this.y += this.vy * dt
    this.alpha -= dt * 1.15
    if (this.alpha <= 0) { this.alpha = 0; this.done = true }
  }
  draw(ctx, color) {
    ctx.save()
    ctx.strokeStyle = color
    ctx.globalAlpha = this.alpha
    ctx.lineWidth = 1.8
    ctx.beginPath(); ctx.ellipse(this.x, this.y, this.r, this.r * 0.82, 0, 0, TAU); ctx.stroke()
    ctx.globalAlpha = this.alpha * 0.5
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.ellipse(this.x, this.y, this.r * 0.65, this.r * 0.53, 0, 0, TAU); ctx.stroke()
    ctx.restore()
  }
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export default class RiverCleanupEngine {
  constructor() {
    this.width = 0; this.height = 0; this.time = 0
    this._dist = 0          // distance the water has flowed (drives all scrolling)
    this._shake = 0
    this._flashAlpha = 0
    this._tiles = null
    this._tilesTried = false
    this._warmed = false
    this.makeCanvas = null  // optional override (tests / SSR)

    this._streaks = []
    this._crests = []
    this._sparkles = []
    this._pads = []
    this._leaves = []

    this.loadCount = 0
    this.boat = { x: 0.5, y: 0.6, vx: 0, vy: 0 }
    this.garbage = []
    this.obstacles = []
    this.wildlife = []
    this.rescuables = []
    this.particles = []
    this.ripples = []
    this.boatWake = []
    this._wakeTimer = 0

    this._garbageTimer = 0
    this._obstacleTimer = 0
    this._wildlifeTimer = 0
    this._rescueTimer = 0

    this.onCollectGarbage = null
    this.onHitObstacle = null
    this.onHitWildlife = null
    this.onRescue = null

    this.running = false
    this.difficulty = 0
  }

  // ── Sizing ──────────────────────────────────────────────────────────────────

  setSize(w, h) {
    this.width = w; this.height = h
    this._buildDecor()
    if (!this._warmed) {
      this._warmed = true
      this._resetWorld(true)
      this._prewarm()
    }
  }

  _bankW() { return clamp(this.width * 0.12, 28, 80) }

  _buildDecor() {
    if (!this.width) return
    const W = this.width, H = this.height
    const bw = this._bankW()
    const rw = W - bw * 2

    // Long flow lines that stream downstream
    this._streaks = []
    const sn = Math.ceil(rw / 26) + 8
    for (let i = 0; i < sn; i++) {
      this._streaks.push({
        x: bw + 12 + sr(i * 3.7) * (rw - 24),
        yf: sr(i * 5.1),
        len: 50 + sr(i * 11.3) * 120,
        amp: 3 + sr(i * 7.9) * 7,
        ph: sr(i * 2.3) * TAU,
        speed: 0.8 + sr(i * 4.4) * 0.55,
        a: 0.10 + sr(i * 9.1) * 0.20,
        w: 1 + sr(i * 6.1) * 1.6,
      })
    }

    // Little wave crests
    this._crests = []
    const cn = Math.ceil(rw / 22) + 10
    for (let i = 0; i < cn; i++) {
      this._crests.push({
        x: bw + 8 + sr(i * 1.9 + 4) * (rw - 16),
        yf: sr(i * 8.3 + 1),
        s: 5 + sr(i * 3.1) * 11,
        speed: 0.9 + sr(i * 5.7) * 0.45,
        ph: sr(i * 6.6) * TAU,
      })
    }

    // Sun / moon glints
    this._sparkles = []
    for (let i = 0; i < 26; i++) {
      this._sparkles.push({
        x: bw + 10 + sr(i * 12.1 + 2) * (rw - 20),
        yf: sr(i * 3.3 + 9),
        speed: 0.95 + sr(i * 2.9) * 0.3,
        ph: sr(i * 7.7) * TAU,
        rate: 1.2 + sr(i * 4.1) * 2.2,
        s: 3 + sr(i * 6.2) * 4,
      })
    }

    // Lily pads in the shallows
    this._pads = []
    for (let i = 0; i < 12; i++) {
      this._pads.push({
        side: i % 2,
        off: 12 + sr(i * 5.3 + 1) * 46,
        yf: sr(i * 9.7),
        r: 9 + sr(i * 2.7) * 7,
        rot: sr(i * 3.9) * TAU,
        flower: sr(i * 8.1) > 0.6,
        speed: 1.0 + sr(i * 1.3) * 0.2,
      })
    }

    // Drifting leaves
    this._leaves = []
    for (let i = 0; i < 7; i++) {
      this._leaves.push({
        x: bw + 30 + sr(i * 6.3 + 5) * (rw - 60),
        yf: sr(i * 2.2 + 3),
        rot: sr(i * 4.4) * TAU,
        spin: (sr(i * 9.9) - 0.5) * 1.4,
        s: 4 + sr(i * 7.1) * 3,
        hue: i % 3,
        speed: 0.95 + sr(i * 3.7) * 0.2,
      })
    }
  }

  _ensureTiles() {
    if (this._tilesTried) return
    this._tilesTried = true
    try {
      const mk = this.makeCanvas || (typeof document !== 'undefined'
        ? (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c }
        : null)
      if (!mk) return
      this._tiles = {
        a: { canvas: makeCausticTile(192, 11, mk), pat: null, size: 192 },
        b: { canvas: makeCausticTile(160, 29, mk), pat: null, size: 160 },
      }
    } catch { this._tiles = null }
  }

  // ── Spawn ────────────────────────────────────────────────────────────────────

  _spawnGarbage() {
    if (!this.width) return
    const bw = this._bankW()
    const type = GARBAGE_TYPES[randInt(0, GARBAGE_TYPES.length - 1)]
    this.garbage.push({
      ...type,
      x: rand(bw + 26, this.width - bw - 26),
      y: -36,
      vy: rand(44, 60),
      age: 0,
      bob: rand(0, TAU),
      rot: rand(0, TAU),
      spin: rand(-0.7, 0.7),
      collecting: false,
      ct: 0,
    })
  }

  _spawnObstacle() {
    if (!this.width) return
    const bw = this._bankW()
    const type = OBSTACLE_TYPES[randInt(0, OBSTACLE_TYPES.length - 1)]
    this.obstacles.push({
      ...type,
      x: rand(bw + 32, this.width - bw - 32),
      y: -56,
      vy: rand(46, 64),
      vx: rand(-14, 14),
      rot: type.kind === 'log' ? rand(-0.45, 0.45) : rand(0, TAU),
      spin: type.kind === 'log' ? rand(-0.08, 0.08) : rand(-0.25, 0.25),
      age: 0,
      seed: Math.random() * 1000,
      hitCooldown: 0,
    })
  }

  _spawnWildlife() {
    if (!this.width) return
    const bw = this._bankW()
    const kind = SWIM_KINDS[randInt(0, SWIM_KINDS.length - 1)]
    const fromLeft = Math.random() > 0.5
    this.wildlife.push({
      kind,
      variant: randInt(0, FISH_VARIANTS.length - 1),
      size: kind === 'fish' ? rand(0.9, 1.25) : rand(0.95, 1.15),
      x: fromLeft ? bw - 4 : this.width - bw + 4,
      y: rand(this.height * 0.05, this.height * 0.7),
      vx: (fromLeft ? 1 : -1) * (kind === 'fish' ? rand(70, 110) : rand(45, 70)),
      vy: rand(-12, 22),
      vyEff: 0,
      ph: rand(0, TAU),
      age: 0,
      penalized: false,
      hitCooldown: 0,
      ripT: rand(0, 0.4),
    })
  }

  _spawnRescuable() {
    if (!this.width) return
    const bw = this._bankW()
    const kind = RESCUE_KINDS[randInt(0, RESCUE_KINDS.length - 1)]
    this.rescuables.push({
      kind,
      x: rand(bw + 44, this.width - bw - 44),
      y: -60,
      vy: rand(30, 40),
      ph: rand(0, TAU),
      age: 0,
      rescued: false,
      rt: 0,
      ring: 0,
      splashT: rand(0.1, 0.4),
      ripT: 0,
    })
  }

  // ── Particle helpers ────────────────────────────────────────────────────────

  _splash(x, y, n = 8, power = 1, color = 'rgba(210,240,255,0.95)') {
    for (let i = 0; i < n; i++) {
      this.particles.push(new Particle(x, y, color, null, {
        kind: 'drop',
        vx: rand(-70, 70) * power,
        vy: rand(-150, -55) * power,
        g: 420,
        radius: rand(1.6, 3.4),
        life: rand(0.4, 0.75),
      }))
    }
  }

  _bubbles(x, y, n = 4) {
    for (let i = 0; i < n; i++) {
      this.particles.push(new Particle(x + rand(-6, 6), y + rand(-4, 4), 'rgba(255,255,255,0.85)', null, {
        kind: 'bubble', vx: rand(-10, 10), vy: rand(-40, -16), g: -10, radius: rand(1.6, 3.4), life: rand(0.6, 1.1),
      }))
    }
  }

  // ── Update ───────────────────────────────────────────────────────────────────

  _obstacleHit(o, bx, by) {
    // Boat counts as a ~16px circle; obstacle shapes are tested by kind
    if (o.kind === 'log') {
      const dx = bx - o.x, dy = by - o.y
      const c = Math.cos(-o.rot), s = Math.sin(-o.rot)
      const lx = dx * c - dy * s, ly = dx * s + dy * c
      return Math.abs(lx) < 30 + 12 && Math.abs(ly) < 9 + 17
    }
    return Math.hypot(bx - o.x, by - o.y) < (o.kind === 'rock' ? 36 : 34)
  }

  update(dt, input = {}, difficulty = 0) {
    if (!this.width) return
    const live = this.running
    const step = clamp(dt, 0, 0.05)
    this.time += step
    this._dist += FLOW * step
    this.difficulty = difficulty

    const bw = this._bankW()

    // On the start screen the boat cruises by itself so the world looks alive.
    if (!live) {
      const a = Math.sin(this.time * 0.5)
      input = { left: a < -0.35, right: a > 0.35 }
      difficulty = 0
    }

    // Boat movement
    const tvx = (input.right ? 1 : 0) - (input.left ? 1 : 0)
    const tvy = (input.down ? 1 : 0) - (input.up ? 1 : 0)
    const k = 1 - Math.pow(0.004, step)
    this.boat.vx = lerp(this.boat.vx, tvx * BOAT_SPEED, k)
    this.boat.vy = lerp(this.boat.vy, tvy * BOAT_SPEED, k)

    const bxPx = this.boat.x * this.width + this.boat.vx * step
    const byPx = this.boat.y * this.height + this.boat.vy * step
    this.boat.x = clamp(bxPx, bw + BOAT_W / 2, this.width - bw - BOAT_W / 2) / this.width
    this.boat.y = clamp(byPx, 54, this.height - BOAT_H * 1.4) / this.height

    const boatX = this.boat.x * this.width
    const boatY = this.boat.y * this.height

    // Foam wake — churned at the stern, carried downstream by the current
    this._wakeTimer -= step
    if (this._wakeTimer <= 0) {
      this._wakeTimer = 0.04
      const sx = boatX, sy = boatY + 33
      for (const side of [-1, 1]) {
        this.boatWake.push({
          x: sx + side * 6, y: sy, vx: side * rand(8, 20), vy: FLOW * rand(0.9, 1.1),
          r: rand(2.5, 4), grow: rand(9, 15), a: 0.6,
        })
      }
      this.boatWake.push({
        x: sx + rand(-4, 4), y: sy + 2, vx: rand(-4, 4), vy: FLOW * rand(0.95, 1.15),
        r: rand(3, 5), grow: rand(7, 12), a: 0.5,
      })
      if (this.boatWake.length > 160) this.boatWake.splice(0, this.boatWake.length - 160)
    }
    for (let i = this.boatWake.length - 1; i >= 0; i--) {
      const w = this.boatWake[i]
      w.x += w.vx * step; w.y += w.vy * step
      w.vx *= 1 - 0.9 * step
      w.r += w.grow * step
      w.a -= 0.55 * step
      if (w.a <= 0) this.boatWake.splice(i, 1)
    }

    if (this._flashAlpha > 0) this._flashAlpha = Math.max(0, this._flashAlpha - step * 3.5)
    if (this._shake > 0) this._shake = Math.max(0, this._shake - step * 22)

    // Spawn timers
    const df = 1 - difficulty * 0.42
    this._garbageTimer -= step
    if (this._garbageTimer <= 0) { this._spawnGarbage(); this._garbageTimer = rand(0.9, 2.2) * df }
    this._obstacleTimer -= step
    if (this._obstacleTimer <= 0) { this._spawnObstacle(); this._obstacleTimer = rand(2.0, 4.5) * df }
    this._wildlifeTimer -= step
    if (this._wildlifeTimer <= 0) { this._spawnWildlife(); this._wildlifeTimer = rand(2.5, 5.5) }
    this._rescueTimer -= step
    if (this._rescueTimer <= 0) { this._spawnRescuable(); this._rescueTimer = rand(8, 16) }

    // Garbage
    for (let i = this.garbage.length - 1; i >= 0; i--) {
      const g = this.garbage[i]
      g.age += step
      if (g.collecting) {
        g.ct += step
        const kk = Math.min(1, step * 16)
        g.x += (boatX - g.x) * kk
        g.y += (boatY - 26 - g.y) * kk
        if (g.ct > 0.22) this.garbage.splice(i, 1)
        continue
      }
      g.y += g.vy * step
      g.rot += g.spin * step
      if (Math.hypot(boatX - g.x, boatY - g.y) < COLLECT_R) {
        g.collecting = true; g.ct = 0
        this.loadCount++
        this._splash(g.x, g.y, 6, 0.8)
        for (let p = 0; p < 4; p++) {
          this.particles.push(new Particle(g.x, g.y, g.accent, null, { kind: 'spark', radius: rand(3, 5.5), life: rand(0.35, 0.6) }))
        }
        this.particles.push(new Particle(g.x, g.y - 14, g.color, g.label, { vx: 0, vy: -52, g: 20 }))
        this.ripples.push(new Ripple(g.x, g.y, 32))
        if (live) this.onCollectGarbage?.(g)
        continue
      }
      if (g.y > this.height + 50) this.garbage.splice(i, 1)
    }

    // Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const o = this.obstacles[i]
      o.y += o.vy * step; o.x += o.vx * step; o.age += step
      o.rot += o.spin * step
      if (o.hitCooldown > 0) o.hitCooldown -= step
      if (o.x < bw + 26) { o.x = bw + 26; o.vx = Math.abs(o.vx) }
      if (o.x > this.width - bw - 26) { o.x = this.width - bw - 26; o.vx = -Math.abs(o.vx) }
      if (live && o.hitCooldown <= 0 && this._obstacleHit(o, boatX, boatY)) {
        o.hitCooldown = 1.2
        this._flashAlpha = 0.6
        this._shake = 7
        this.ripples.push(new Ripple(boatX, boatY, 46))
        this._splash(boatX, boatY - 10, 12, 1.2)
        for (let p = 0; p < 6; p++) {
          this.particles.push(new Particle(boatX, boatY, '#fca5a5', null, { kind: 'spark', radius: rand(3, 6), life: rand(0.3, 0.55) }))
        }
        this.onHitObstacle?.(o)
      }
      if (o.y > this.height + 70) this.obstacles.splice(i, 1)
    }

    // Swimming wildlife
    for (let i = this.wildlife.length - 1; i >= 0; i--) {
      const w = this.wildlife[i]
      w.age += step
      const wob = Math.sin(w.age * 1.6 + w.ph) * (w.kind === 'fish' ? 24 : 7)
      w.vyEff = w.vy + wob + FLOW * 0.45
      w.x += w.vx * step; w.y += w.vyEff * step
      if (w.hitCooldown > 0) w.hitCooldown -= step
      w.ripT -= step
      if (w.ripT <= 0) {
        w.ripT = w.kind === 'fish' ? 0.42 : 0.75
        const h = Math.atan2(w.vyEff, w.vx)
        this.ripples.push(new Ripple(w.x - Math.cos(h) * 14, w.y - Math.sin(h) * 14, w.kind === 'fish' ? 13 : 18))
      }
      const crossed = (w.vx > 0 && w.x > this.width - bw + 6) || (w.vx < 0 && w.x < bw - 6)
      if (crossed || w.y > this.height + 60) { this.wildlife.splice(i, 1); continue }
      if (live && !w.penalized && w.hitCooldown <= 0 && Math.hypot(boatX - w.x, boatY - w.y) < COLLECT_R - 8) {
        w.penalized = true; w.hitCooldown = 1.5
        w.vx *= 1.5
        w.vy += (w.y >= boatY ? 1 : -1) * 90   // startled dash away from the boat
        this.particles.push(new Particle(w.x, w.y - 10, '#fbbf24', '−25', { vx: 0, vy: -50, g: 20 }))
        this.ripples.push(new Ripple(w.x, w.y, 38))
        this._splash(w.x, w.y, 7, 1)
        this.onHitWildlife?.()
      }
    }

    // Rescuables (animals stuck on a floating raft)
    for (let i = this.rescuables.length - 1; i >= 0; i--) {
      const r = this.rescuables[i]
      r.age += step
      if (r.rescued) {
        r.rt += step
        if (r.rt > 1.05) this.rescuables.splice(i, 1)
        continue
      }
      r.y += r.vy * step
      r.x += Math.sin(r.age * 1.1 + r.ph) * 7 * step
      if (r.y > this.height + 70) { this.rescuables.splice(i, 1); continue }

      const d = Math.hypot(boatX - r.x, boatY - r.y)
      r.ring = lerp(r.ring, d < RESCUE_R ? 1 : 0, 1 - Math.pow(0.001, step))

      // flailing splashes + ripples
      r.splashT -= step
      if (r.splashT <= 0) {
        r.splashT = rand(0.28, 0.55)
        this._splash(r.x + rand(-10, 10), r.y + 8, 3, 0.55)
      }
      r.ripT -= step
      if (r.ripT <= 0) {
        r.ripT = 0.5
        this.ripples.push(new Ripple(r.x, r.y + 10, 30))
      }

      if (live && input.rescue && d < RESCUE_R) {
        r.rescued = true; r.rt = 0
        for (let p = 0; p < 8; p++) {
          this.particles.push(new Particle(r.x + rand(-12, 12), r.y - 6, '#fb7185', null, {
            kind: 'heart', vx: rand(-45, 45), vy: rand(-120, -60), g: 10, radius: rand(3.5, 6), life: rand(0.9, 1.4),
          }))
        }
        for (let p = 0; p < 10; p++) {
          this.particles.push(new Particle(r.x, r.y, p % 2 ? '#86efac' : '#fde047', null, {
            kind: 'spark', vx: rand(-90, 90), vy: rand(-110, 20), g: 60, radius: rand(3, 6), life: rand(0.5, 0.9), spin: rand(-6, 6),
          }))
        }
        this._splash(r.x, r.y + 8, 14, 1.3)
        this.particles.push(new Particle(r.x, r.y - 26, '#4ade80', '+100', { vx: 0, vy: -48, g: 15 }))
        this.ripples.push(new Ripple(r.x, r.y + 8, 56))
        this.onRescue?.()
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (!this.particles[i].update(step)) this.particles.splice(i, 1)
    }
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      this.ripples[i].update(step)
      if (this.ripples[i].done) this.ripples.splice(i, 1)
    }
  }

  // ── Draw ─────────────────────────────────────────────────────────────────────

  draw(ctx, options = {}) {
    if (!this.width || !this.height) return
    const { dark = false, reduceMotion = false } = options
    const P = dark ? NIGHT : DAY
    const t = reduceMotion ? 0 : this.time
    const W = this.width, H = this.height
    this._ensureTiles()

    ctx.save()
    if (this._shake > 0.2 && !reduceMotion) {
      ctx.translate(rand(-1, 1) * this._shake, rand(-1, 1) * this._shake)
    }
    ctx.fillStyle = P.riverA
    ctx.fillRect(-10, -10, W + 20, H + 20)

    this._drawRiver(ctx, P, t)
    this._drawWaterPlants(ctx, P, t)
    this._drawBanks(ctx, P, t)
    this._drawWake(ctx, P)
    for (const r of this.ripples) r.draw(ctx, P.ripple)
    this._drawWildlife(ctx, P, t)
    this._drawGarbage(ctx, P, t)
    this._drawObstacles(ctx, P, t)
    this._drawRescuables(ctx, P, t)
    this._drawBoat(ctx, P, t)
    for (const p of this.particles) p.draw(ctx)
    ctx.restore()

    this._drawAtmosphere(ctx, P, t)

    if (this._flashAlpha > 0) {
      ctx.save(); ctx.globalAlpha = this._flashAlpha * 0.32
      ctx.fillStyle = '#ff2222'
      ctx.fillRect(0, 0, W, H)
      ctx.restore()
    }
  }

  // ── River ─────────────────────────────────────────────────────────────────────

  _fillPattern(ctx, tile, x, y, w, h, ox, oy, s) {
    if (!tile) return
    if (!tile.pat) tile.pat = ctx.createPattern(tile.canvas, 'repeat')
    if (!tile.pat) return
    const period = tile.size * s
    ox = wrapMod(ox, period); oy = wrapMod(oy, period)
    ctx.save()
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip()
    ctx.translate(ox, oy); ctx.scale(s, s)
    ctx.fillStyle = tile.pat
    ctx.fillRect((x - ox - period) / s, (y - oy - period) / s, (w + period * 2) / s, (h + period * 2) / s)
    ctx.restore()
  }

  _drawRiver(ctx, P, t) {
    const W = this.width, H = this.height
    const bw = this._bankW()
    const rl = bw - 16, rr = W - bw + 16, rw = rr - rl
    const f = this._dist

    // Depth: dark centre, turquoise shallows
    const rg = ctx.createLinearGradient(rl, 0, rr, 0)
    rg.addColorStop(0, P.riverC)
    rg.addColorStop(0.16, P.riverB)
    rg.addColorStop(0.5, P.riverA)
    rg.addColorStop(0.84, P.riverB)
    rg.addColorStop(1, P.riverC)
    ctx.fillStyle = rg
    ctx.fillRect(rl, 0, rw, H)

    // Shallows — sandy turquoise glow along both banks
    for (const side of [0, 1]) {
      const x0 = side === 0 ? bw - 6 : W - bw + 6
      const x1 = side === 0 ? bw + 56 : W - bw - 56
      const sg = ctx.createLinearGradient(x0, 0, x1, 0)
      sg.addColorStop(0, P.shallow); sg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = sg
      ctx.fillRect(Math.min(x0, x1), 0, Math.abs(x1 - x0), H)
    }

    // Caustic light webs — two layers drifting at different speeds/scales
    if (this._tiles) {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = P.causticA
      this._fillPattern(ctx, this._tiles.a, rl, 0, rw, H, t * 5, f * 0.9 + Math.sin(t * 0.3) * 6, 1)
      ctx.globalAlpha = P.causticA * 0.7
      this._fillPattern(ctx, this._tiles.b, rl, 0, rw, H, -t * 4, f * 1.25, 1.7)
      ctx.restore()
    }

    ctx.save()
    ctx.beginPath(); ctx.rect(rl, 0, rw, H); ctx.clip()

    // Flow lines
    ctx.lineCap = 'round'
    ctx.strokeStyle = P.shimmer
    const span = H + 260
    for (const s of this._streaks) {
      const y0 = wrapMod(s.yf * span + f * s.speed, span) - 160
      const segs = 8
      ctx.lineWidth = s.w
      let px = s.x + s.amp * Math.sin(y0 * 0.03 + s.ph + t * 0.6), py = y0
      for (let i = 1; i <= segs; i++) {
        const y = y0 + (s.len * i) / segs
        const x = s.x + s.amp * Math.sin(y * 0.03 + s.ph + t * 0.6)
        ctx.globalAlpha = s.a * Math.sin((Math.PI * (i - 0.5)) / segs)
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke()
        px = x; py = y
      }
    }

    // Wave crests
    ctx.strokeStyle = P.foam
    ctx.lineWidth = 1.5
    for (const c of this._crests) {
      const y = wrapMod(c.yf * (H + 60) + f * c.speed, H + 60) - 30
      ctx.globalAlpha = clamp(0.2 + 0.2 * Math.sin(t * 1.3 + c.ph), 0, 1)
      ctx.beginPath()
      ctx.moveTo(c.x - c.s, y)
      ctx.quadraticCurveTo(c.x, y - c.s * 0.55, c.x + c.s, y)
      ctx.stroke()
      ctx.globalAlpha *= 0.55
      ctx.beginPath()
      ctx.moveTo(c.x - c.s * 0.6, y + 4)
      ctx.quadraticCurveTo(c.x, y + 4 - c.s * 0.3, c.x + c.s * 0.6, y + 4)
      ctx.stroke()
    }

    // Glints
    for (const s of this._sparkles) {
      const tw = Math.sin(t * s.rate + s.ph)
      if (tw < 0.55) continue
      const y = wrapMod(s.yf * H + f * s.speed, H)
      star4(ctx, s.x, y, s.s * (0.4 + (tw - 0.55) * 1.6), P.glint, clamp((tw - 0.5) * 1.8, 0, 0.95))
    }
    ctx.restore()
  }

  _drawWaterPlants(ctx, P, t) {
    const W = this.width, H = this.height, bw = this._bankW()
    const f = this._dist
    const span = H + 100

    for (const p of this._pads) {
      const x = p.side === 0 ? bw + 16 + p.off : W - bw - 16 - p.off
      const y = wrapMod(p.yf * span + f * p.speed, span) - 50
      const bob = Math.sin(t * 1.2 + p.rot) * 0.8
      ctx.save()
      ctx.translate(x, y + bob); ctx.rotate(p.rot + Math.sin(t * 0.5 + p.rot) * 0.05)
      // soft shadow
      fillEll(ctx, 'rgba(0,30,40,0.22)', 1.5, 2.5, p.r, p.r * 0.92)
      // pad with notch
      ctx.beginPath()
      ctx.moveTo(0, 0); ctx.arc(0, 0, p.r, 0.32, TAU - 0.32); ctx.closePath()
      ctx.fillStyle = P.pad; ctx.fill()
      ctx.strokeStyle = P.padDark; ctx.lineWidth = 1.2; ctx.stroke()
      // veins
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 0.8
      for (let i = 0; i < 5; i++) {
        const a = 0.6 + (i / 4) * (TAU - 1.2)
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * p.r * 0.9, Math.sin(a) * p.r * 0.9); ctx.stroke()
      }
      // sheen
      fillEll(ctx, 'rgba(255,255,255,0.18)', -p.r * 0.28, -p.r * 0.3, p.r * 0.4, p.r * 0.22, -0.6)
      if (p.flower) {
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * TAU
          fillEll(ctx, P.night ? '#c26b9a' : '#ff9ec7', Math.cos(a) * 3.2, Math.sin(a) * 3.2, 3.2, 1.7, a)
        }
        fillEll(ctx, '#ffe066', 0, 0, 1.8, 1.8)
      }
      ctx.restore()
    }

    const leafCols = P.night ? ['#4a5a22', '#6a4a22', '#3a5a28'] : ['#c8a23a', '#a8632a', '#7ab13a']
    for (const l of this._leaves) {
      const y = wrapMod(l.yf * (H + 60) + f * l.speed, H + 60) - 30
      const x = l.x + Math.sin(f * 0.02 + l.rot) * 10
      ctx.save()
      ctx.translate(x, y); ctx.rotate(l.rot + t * l.spin)
      ctx.fillStyle = leafCols[l.hue]
      ctx.beginPath()
      ctx.moveTo(-l.s, 0)
      ctx.quadraticCurveTo(0, -l.s * 0.9, l.s, 0)
      ctx.quadraticCurveTo(0, l.s * 0.9, -l.s, 0)
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 0.7
      ctx.beginPath(); ctx.moveTo(-l.s, 0); ctx.lineTo(l.s, 0); ctx.stroke()
      ctx.restore()
    }
  }

  // ── Banks ─────────────────────────────────────────────────────────────────────

  _edge(y, side, bd, bw) {
    const w = y - bd
    return bw - 6
      + 5 * Math.sin(w * 0.012 + side * 2.1)
      + 3 * Math.sin(w * 0.031 + side * 0.7 + 1.3)
      + 1.5 * Math.sin(w * 0.077 + side)
  }

  _bankPath(ctx, side, inset, bd, bw) {
    const W = this.width, H = this.height
    ctx.beginPath()
    const x0 = side === 0 ? -4 : W + 4
    ctx.moveTo(x0, -10)
    for (let y = -10; y <= H + 10; y += 8) {
      const e = this._edge(y, side, bd, bw) - inset
      ctx.lineTo(side === 0 ? Math.max(e, -4) : Math.min(W - e, W + 4), y)
    }
    ctx.lineTo(x0, H + 10)
    ctx.closePath()
  }

  _drawBanks(ctx, P, t) {
    const W = this.width, H = this.height
    const bw = this._bankW()
    const bd = this._dist * BANK_PARALLAX
    const sc = clamp(bw / 70, 0.55, 1.1)

    for (const side of [0, 1]) {
      // contact shadow on the water
      this._bankPath(ctx, side, -3, bd, bw)
      ctx.fillStyle = 'rgba(0,30,50,0.22)'; ctx.fill()
      // layered ground
      const layers = [
        [0, P.sand], [7, P.grassLight], [14, P.grass], [34, P.grassDark], [54, P.forest],
      ]
      for (const [inset, col] of layers) {
        this._bankPath(ctx, side, inset, bd, bw)
        ctx.fillStyle = col; ctx.fill()
      }
      // darker wet-sand rim
      this._bankPath(ctx, side, 0, bd, bw)
      ctx.strokeStyle = hexA(P.sandDark.length === 7 ? P.sandDark : '#a89560', 0.55)
      ctx.lineWidth = 2.5; ctx.stroke()
    }

    // Lapping foam along the shoreline
    ctx.save()
    ctx.lineCap = 'round'
    for (const side of [0, 1]) {
      this._bankPath(ctx, side, -2.5, bd, bw)
      ctx.strokeStyle = P.foam
      ctx.setLineDash([22, 9, 8, 14]); ctx.lineDashOffset = -this._dist * 1.1
      ctx.lineWidth = 3.2; ctx.globalAlpha = 0.7 + Math.sin(t * 1.6 + side) * 0.2
      ctx.stroke()
      ctx.setLineDash([10, 16]); ctx.lineDashOffset = -this._dist * 1.3
      ctx.lineWidth = 1.6; ctx.globalAlpha = 0.45
      this._bankPath(ctx, side, -6, bd, bw)
      ctx.stroke()
    }
    ctx.setLineDash([]); ctx.restore()

    // ─ Features, generated from world cells so they scroll seamlessly ─
    const cell = 22
    const j0 = Math.floor((-60 - bd) / cell)
    const j1 = Math.ceil((H + 60 - bd) / cell)

    // pass 1: ground details (tufts, pebbles, flowers, rocks, reeds)
    for (let j = j0; j <= j1; j++) {
      const y = j * cell + bd
      for (const side of [0, 1]) {
        const s = j * 2.31 + side * 57.7
        const e = this._edge(y, side, bd, bw)
        const X = (d) => (side === 0 ? d : W - d)
        const r0 = sr(s)

        // grass tufts
        ctx.strokeStyle = P.grassDark; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.7
        for (let k = 0; k < 2; k++) {
          const tx = X(e - 12 - sr(s + k * 3 + 1) * (e - 22))
          const ty = y + sr(s + k * 5 + 2) * cell
          ctx.beginPath()
          ctx.moveTo(tx - 2, ty); ctx.lineTo(tx - 3, ty - 4)
          ctx.moveTo(tx, ty); ctx.lineTo(tx, ty - 5)
          ctx.moveTo(tx + 2, ty); ctx.lineTo(tx + 3, ty - 4)
          ctx.stroke()
        }
        ctx.globalAlpha = 1

        // pebbles on the sand
        if (sr(s + 9) > 0.5) {
          const px = X(e - 2 - sr(s + 10) * 4), py = y + sr(s + 11) * cell
          fillEll(ctx, P.rockC, px, py, 1.8, 1.3, sr(s + 12))
          fillEll(ctx, P.rockB, px + 3.5, py + 2, 1.2, 0.9)
        }

        if (r0 > 0.34 && r0 < 0.5) {            // rock
          const rx = X(e - 8 - sr(s + 1) * 12), ry = y + sr(s + 2) * cell
          const rs = (4 + sr(s + 3) * 4) * sc
          fillEll(ctx, 'rgba(0,0,0,0.2)', rx + 1.5, ry + 2, rs * 1.05, rs * 0.8)
          fillEll(ctx, P.rockA, rx, ry, rs, rs * 0.82, sr(s + 4))
          fillEll(ctx, P.rockC, rx - rs * 0.25, ry - rs * 0.25, rs * 0.45, rs * 0.28, -0.5)
        } else if (r0 >= 0.5 && r0 < 0.74) {     // reeds
          const rx = X(e + 1 + sr(s + 1) * 2), ry = y + sr(s + 2) * cell
          ctx.save(); ctx.translate(rx, ry)
          ctx.globalAlpha = 0.3; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1
          ctx.beginPath(); ctx.ellipse(0, 1, 9 + Math.sin(t * 1.5 + s) * 1.5, 5, 0, 0, TAU); ctx.stroke()
          ctx.globalAlpha = 1
          const n = 6
          for (let k = 0; k < n; k++) {
            const a = (k / n) * TAU + sr(s + k) + Math.sin(t * 1.1 + s + k) * 0.08
            const len = (8 + sr(s + k + 20) * 6) * sc
            ctx.strokeStyle = P.reed; ctx.lineWidth = 1.6
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len); ctx.stroke()
            if (k % 3 === 0) fillEll(ctx, P.cattail, Math.cos(a) * len, Math.sin(a) * len, 1.8, 3.2, a + Math.PI / 2)
          }
          ctx.restore()
        } else if (r0 >= 0.74 && r0 < 0.86) {    // flowers
          const fx = X(e - 14 - sr(s + 1) * 14), fy = y + sr(s + 2) * cell
          const cols = P.night ? ['#b8a0c8', '#c8c08a', '#c89aa8'] : ['#ffffff', '#ffd84a', '#ff8fb8', '#c79bff']
          for (let k = 0; k < 4; k++) {
            const ox = (sr(s + k * 2) - 0.5) * 12, oy = (sr(s + k * 3) - 0.5) * 10
            fillEll(ctx, cols[(j + k + side) % cols.length], fx + ox, fy + oy, 1.9, 1.9)
            fillEll(ctx, '#f8e060', fx + ox, fy + oy, 0.7, 0.7)
          }
        }
      }
    }

    // pass 2: shadows
    ctx.save(); ctx.globalAlpha = P.night ? 0.3 : 0.17; ctx.fillStyle = '#000'
    const treeAt = (j, side) => {
      const s = j * 2.31 + side * 57.7
      const r0 = sr(s)
      if (!(r0 < 0.2 || (r0 >= 0.2 && r0 < 0.34))) return null
      const y = j * cell + bd
      const e = this._edge(y, side, bd, bw)
      const big = r0 < 0.2
      const rad = (big ? 13 + sr(s + 2) * 13 : 7 + sr(s + 2) * 5) * sc
      const cx = e * (0.3 + 0.38 * sr(s + 1))
      return { s, big, rad, cx, cy: y + sr(s + 3) * cell, e }
    }
    for (let j = j0; j <= j1; j++) {
      for (const side of [0, 1]) {
        const T = treeAt(j, side); if (!T) continue
        const x = side === 0 ? T.cx : W - T.cx
        ell(ctx, x + T.rad * 0.5, T.cy + T.rad * 0.6, T.rad * 1.05, T.rad * 0.9); ctx.fill()
      }
    }
    ctx.restore()

    // pass 3: canopies and bushes
    for (let j = j0; j <= j1; j++) {
      for (const side of [0, 1]) {
        const T = treeAt(j, side); if (!T) continue
        const x = side === 0 ? T.cx : W - T.cx
        const sway = Math.sin(t * 0.6 + T.s) * 1.2
        if (T.big) this._tree(ctx, P, x + sway, T.cy, T.rad, T.s)
        else this._bush(ctx, P, x, T.cy, T.rad, T.s)
      }
    }
  }

  _tree(ctx, P, cx, cy, r, seed) {
    fillEll(ctx, P.treeDark, cx, cy, r, r * 0.95)
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * TAU + seed
      fillEll(ctx, P.treeB, cx + Math.cos(a) * r * 0.48, cy + Math.sin(a) * r * 0.44, r * 0.52, r * 0.5)
    }
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * TAU + seed * 1.3
      fillEll(ctx, P.treeA, cx - r * 0.12 + Math.cos(a) * r * 0.34, cy - r * 0.16 + Math.sin(a) * r * 0.3, r * 0.4, r * 0.36)
    }
    for (let k = 0; k < 5; k++) {
      fillEll(ctx, P.treeC,
        cx - r * 0.25 + (sr(seed + k) - 0.5) * r * 0.9,
        cy - r * 0.3 + (sr(seed + k + 7) - 0.5) * r * 0.7,
        r * 0.16, r * 0.12, sr(seed + k) * 3)
    }
  }

  _bush(ctx, P, cx, cy, r, seed) {
    fillEll(ctx, P.treeDark, cx, cy, r, r * 0.9)
    fillEll(ctx, P.treeB, cx - r * 0.2, cy - r * 0.1, r * 0.8, r * 0.7)
    fillEll(ctx, P.treeA, cx - r * 0.3, cy - r * 0.25, r * 0.5, r * 0.42)
    const cols = P.night ? ['#b98aa8', '#c8c08a'] : ['#ff7aa8', '#fff', '#ffd84a']
    for (let k = 0; k < 5; k++) {
      fillEll(ctx, cols[k % cols.length], cx + (sr(seed + k) - 0.5) * r * 1.3, cy + (sr(seed + k + 4) - 0.5) * r, 1.5, 1.5)
    }
  }

  // ── Wake ──────────────────────────────────────────────────────────────────────

  _drawWake(ctx, P) {
    ctx.save()
    for (const w of this.boatWake) {
      ctx.globalAlpha = clamp(w.a, 0, 1) * 0.45
      ctx.fillStyle = P.night ? 'rgba(170,215,255,1)' : 'rgba(255,255,255,1)'
      ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, TAU); ctx.fill()
      ctx.globalAlpha = clamp(w.a, 0, 1) * 0.7
      ctx.strokeStyle = P.foam; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, TAU); ctx.stroke()
    }
    ctx.restore()
  }

  // ── Garbage ───────────────────────────────────────────────────────────────────

  _drawGarbage(ctx, P, t) {
    for (const g of this.garbage) {
      const sc = g.collecting ? Math.max(0, 1 - g.ct / 0.22) : 1
      const bob = Math.sin(t * 1.5 + g.bob) * 1.6
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + g.bob)
      ctx.save()
      ctx.translate(g.x, g.y + bob)
      ctx.scale(sc, sc)

      // colour-coded glow so trash reads as "pick me up"
      const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 30)
      glow.addColorStop(0, hexA(g.color, 0.38))
      glow.addColorStop(0.55, hexA(g.color, 0.14))
      glow.addColorStop(1, hexA(g.color, 0))
      ctx.fillStyle = glow
      ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fill()

      // oily sheen on the water
      const sheen = ctx.createRadialGradient(0, 0, 2, 0, 0, 20)
      sheen.addColorStop(0, 'rgba(170,120,255,0.28)')
      sheen.addColorStop(0.5, 'rgba(70,210,170,0.16)')
      sheen.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = sheen
      ctx.beginPath(); ctx.ellipse(0, 1, 20, 15, 0.3, 0, TAU); ctx.fill()

      // floating ring + soft shadow
      ctx.globalAlpha = 0.25; fillEll(ctx, '#000a1e', 3, 5, 13, 8)
      ctx.globalAlpha = 0.55 - pulse * 0.2
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.4
      ell(ctx, 0, 0, 16 + pulse * 3, 11 + pulse * 2); ctx.stroke()
      ctx.globalAlpha = 1

      ctx.rotate(g.rot + Math.sin(t * 0.9 + g.bob) * 0.12)
      ctx.scale(1.25, 1.25)
      switch (g.kind) {
        case 'bottle': this._drawBottle(ctx, g); break
        case 'bag': this._drawBag(ctx, g, t); break
        case 'can': this._drawCan(ctx, g); break
        case 'foam': this._drawFoam(ctx, g); break
        case 'cup': this._drawCup(ctx, g); break
        case 'tire': this._drawTire(ctx, g); break
        default: this._drawBottle(ctx, g)
      }
      ctx.restore()

      // twinkle (unrotated so it always looks like light)
      const tw = Math.sin(t * 2.6 + g.bob * 3)
      if (tw > 0.7 && !g.collecting) {
        star4(ctx, g.x + 9, g.y + bob - 10, 2 + (tw - 0.7) * 12, '#ffffff', clamp((tw - 0.65) * 3, 0, 1))
      }
    }
  }

  _drawBottle(ctx, g) {
    // Clear PET bottle lying on its side, cap to the right
    ctx.beginPath()
    ctx.moveTo(-11, -5.5); ctx.lineTo(6, -5.5)
    ctx.quadraticCurveTo(10, -5.5, 11.5, -2.2); ctx.lineTo(13, -2.2)
    ctx.lineTo(13, 2.2); ctx.lineTo(11.5, 2.2)
    ctx.quadraticCurveTo(10, 5.5, 6, 5.5); ctx.lineTo(-11, 5.5)
    ctx.quadraticCurveTo(-13.5, 5.5, -13.5, 3); ctx.lineTo(-13.5, -3)
    ctx.quadraticCurveTo(-13.5, -5.5, -11, -5.5); ctx.closePath()
    const body = ctx.createLinearGradient(0, -5.5, 0, 5.5)
    body.addColorStop(0, 'rgba(225,246,255,0.80)')
    body.addColorStop(0.55, 'rgba(120,200,240,0.72)')
    body.addColorStop(1, 'rgba(40,130,200,0.82)')
    outlined(ctx, body, g.dark)

    // paper label wrap
    ctx.fillStyle = g.color
    ctx.fillRect(-6.5, -5.2, 9, 10.4)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillRect(-6.5, -1.2, 9, 2.4)
    ctx.strokeStyle = g.dark; ctx.lineWidth = 0.8
    ctx.strokeRect(-6.5, -5.2, 9, 10.4)

    // base ridges + neck ring
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 0.9
    for (const x of [-11.5, -9.5]) { ctx.beginPath(); ctx.moveTo(x, -4.5); ctx.lineTo(x, 4.5); ctx.stroke() }
    ctx.beginPath(); ctx.moveTo(10, -3); ctx.lineTo(10, 3); ctx.stroke()

    // cap
    rrect(ctx, 13, -2.8, 4.6, 5.6, 1.2)
    ctx.fillStyle = '#0c4a6e'; ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 0.8
    for (const x of [14.5, 16]) { ctx.beginPath(); ctx.moveTo(x, -2.5); ctx.lineTo(x, 2.5); ctx.stroke() }

    // highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(-12, -3.6); ctx.lineTo(7, -3.6); ctx.stroke()
  }

  _drawBag(ctx, g, t) {
    // Billowing translucent carrier bag
    const k = t * 1.6 + g.bob
    const blob = () => {
      ctx.beginPath()
      const N = 26
      for (let i = 0; i <= N; i++) {
        const a = (i / N) * TAU
        const r = 11 * (1 + 0.14 * Math.sin(3 * a + k) + 0.09 * Math.sin(5 * a - k * 0.8))
        const x = Math.cos(a) * r * 1.05, y = Math.sin(a) * r * 0.95
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
    }
    // handles (behind)
    ctx.lineCap = 'round'
    for (const s of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(s * 4, -9); ctx.bezierCurveTo(s * 11, -19, s * 1, -20, s * 1.5, -10)
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 3.6; ctx.stroke()
      ctx.strokeStyle = g.dark; ctx.lineWidth = 1.4; ctx.stroke()
    }
    blob()
    const gr = ctx.createRadialGradient(-3, -4, 1, 0, 0, 14)
    gr.addColorStop(0, 'rgba(255,255,255,0.92)')
    gr.addColorStop(1, 'rgba(225,215,255,0.62)')
    outlined(ctx, gr, g.dark)

    ctx.save(); blob(); ctx.clip()
    ctx.fillStyle = hexA(g.color, 0.9)
    ctx.fillRect(-14, -1.5, 28, 5.5)
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.beginPath(); ctx.arc(-4, 1.2, 1.6, 0, TAU); ctx.arc(1, 1.2, 1.6, 0, TAU); ctx.arc(6, 1.2, 1.6, 0, TAU); ctx.fill()
    // crinkles
    ctx.strokeStyle = hexA(g.dark, 0.4); ctx.lineWidth = 0.9; ctx.lineCap = 'round'
    for (const [x1, y1, x2, y2, cx, cy] of [[-8, -6, -3, 9, -6, 1], [2, -8, 6, 8, 0, 1], [8, -4, 4, 9, 7, 3], [-2, -9, -1, -2, 1, -6]]) {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke()
    }
    ctx.restore()
    fillEll(ctx, 'rgba(255,255,255,0.85)', -4.5, -5.5, 3.4, 1.7, -0.6)
  }

  _drawCan(ctx, g) {
    // Drinks can lying on its side with a visible ring-pull end
    rrect(ctx, -10, -6, 19, 12, 1.5)
    ctx.fillStyle = g.color
    outlined(ctx, g.color, '#1f2937')
    // metallic shading
    const m = ctx.createLinearGradient(0, -6, 0, 6)
    m.addColorStop(0, 'rgba(255,255,255,0.65)')
    m.addColorStop(0.35, 'rgba(255,255,255,0)')
    m.addColorStop(0.75, 'rgba(0,0,0,0)')
    m.addColorStop(1, 'rgba(0,0,0,0.38)')
    rrect(ctx, -10, -6, 19, 12, 1.5); ctx.fillStyle = m; ctx.fill()
    // printed band
    ctx.fillStyle = g.dark; ctx.globalAlpha = 0.85
    ctx.fillRect(-5, -6, 9, 12)
    ctx.globalAlpha = 1
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillRect(-3.2, -1.2, 5.4, 2.4)
    ctx.fillStyle = g.accent
    ctx.beginPath(); ctx.arc(-0.5, 0, 1.1, 0, TAU); ctx.fill()
    // end caps
    fillEll(ctx, '#94a3b8', -10, 0, 2.2, 5.6)
    fillEll(ctx, '#e2e8f0', 9.5, 0, 2.6, 5.7)
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 0.9
    ell(ctx, 9.5, 0, 2.6, 5.7); ctx.stroke()
    ell(ctx, 9.5, 0, 1.4, 3.8); ctx.stroke()
    // ring-pull
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.1
    ctx.beginPath(); ctx.ellipse(10.2, 0, 1.2, 2.2, 0, 0, TAU); ctx.stroke()
    // highlight + dent
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 1.3; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(-8.5, -3.6); ctx.lineTo(7.5, -3.6); ctx.stroke()
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(5, 6); ctx.lineTo(6.5, 3); ctx.lineTo(5.2, 1.5); ctx.stroke()
  }

  _drawTire(ctx, g) {
    // Dumped rubber tyre seen from above: worn tread, scuffed sidewall, mud and algae
    const R = 13.5, r = 6.4
    const ring = () => {
      ctx.beginPath()
      ctx.arc(0, 0, R, 0, TAU)
      ctx.moveTo(r, 0)
      ctx.arc(0, 0, r, 0, TAU)
    }
    ring()
    ctx.lineJoin = 'round'
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 4; ctx.stroke()
    const rub = ctx.createRadialGradient(-4, -5, 2, 0, 0, R + 2)
    rub.addColorStop(0, '#5a5a60'); rub.addColorStop(0.55, '#2a2a2e'); rub.addColorStop(1, '#0e0e10')
    ctx.fillStyle = rub; ctx.fill('evenodd')
    ctx.strokeStyle = '#050505'; ctx.lineWidth = 1.3; ctx.stroke()

    // tread band + grooves
    ctx.strokeStyle = 'rgba(120,120,128,0.32)'; ctx.lineWidth = 2.8
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.stroke()
    ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.lineWidth = 1.5; ctx.lineCap = 'butt'
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * TAU, c = Math.cos(a), s = Math.sin(a)
      ctx.beginPath(); ctx.moveTo(c * 10.6, s * 10.6); ctx.lineTo(c * 13.4, s * 13.4); ctx.stroke()
    }
    // shoulder, embossed sidewall lettering, bead ring
    ctx.strokeStyle = 'rgba(0,0,0,0.65)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.stroke()
    ctx.strokeStyle = 'rgba(205,205,215,0.22)'; ctx.lineWidth = 1.1
    ctx.setLineDash([2.2, 1.6])
    ctx.beginPath(); ctx.arc(0, 0, 8.4, 0.4, TAU - 1.4); ctx.stroke()
    ctx.setLineDash([])
    ctx.strokeStyle = 'rgba(170,170,180,0.4)'; ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.stroke()
    // wet inner rim
    ctx.strokeStyle = 'rgba(140,210,235,0.6)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke()
    // dull highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.arc(0, 0, 11.8, Math.PI * 1.05, Math.PI * 1.45); ctx.stroke()

    // grime: dried mud, algae smears, pale scuffs (clipped to the rubber)
    ctx.save()
    ring(); ctx.clip('evenodd')
    for (let i = 0; i < 7; i++) {
      const x = (sr(g.bob * 3 + i * 1.7) - 0.5) * 24, y = (sr(g.bob * 5 + i * 2.3) - 0.5) * 24
      const rx = 2.2 + sr(g.bob + i * 4.1) * 3.4, ry = 1.4 + sr(g.bob + i * 6.7) * 2.2
      fillEll(ctx, i % 3 === 0 ? 'rgba(78,128,56,0.5)' : 'rgba(128,98,56,0.5)', x, y, rx, ry, sr(g.bob + i) * 3)
    }
    ctx.strokeStyle = 'rgba(190,170,130,0.35)'; ctx.lineWidth = 0.8
    for (let i = 0; i < 5; i++) {
      const a = sr(g.bob * 2 + i * 3.3) * TAU, rr = 8 + sr(g.bob + i * 9.1) * 4.5
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); ctx.lineTo(Math.cos(a + 0.35) * rr, Math.sin(a + 0.35) * rr); ctx.stroke()
    }
    ctx.restore()
  }

  _drawCup(ctx, g) {
    // Used takeaway coffee cup on its side: stained paper, cardboard sleeve, chewed plastic lid
    const half = (x) => 4.6 + (x + 11) * 0.11 // cup widens toward the lid
    const body = () => {
      ctx.beginPath()
      ctx.moveTo(-11, -half(-11) + 1)
      ctx.quadraticCurveTo(-11.8, 0, -11, half(-11) - 1)
      ctx.lineTo(8, half(8)); ctx.lineTo(8, -half(8)); ctx.closePath()
    }

    // spilled coffee on the water
    fillEll(ctx, 'rgba(96,56,24,0.32)', 12, 3, 9, 5, 0.4)
    fillEll(ctx, 'rgba(96,56,24,0.22)', 16, 5, 4, 2.4, 0.2)

    body()
    const paper = ctx.createLinearGradient(0, -7, 0, 7)
    paper.addColorStop(0, '#fbfaf5'); paper.addColorStop(0.55, '#e8e3d6'); paper.addColorStop(1, '#b9b29f')
    outlined(ctx, paper, '#5e5849')

    ctx.save(); body(); ctx.clip()
    // coffee stains and drips
    fillEll(ctx, 'rgba(112,66,28,0.6)', 6.5, -2.5, 4.2, 3, 0.4)
    fillEll(ctx, 'rgba(112,66,28,0.4)', -8.5, 2, 3.4, 2.6, -0.3)
    ctx.strokeStyle = 'rgba(112,66,28,0.6)'; ctx.lineWidth = 1.3; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(7, -1); ctx.quadraticCurveTo(3, 1, 4.2, 5.5); ctx.stroke()
    // faded print and mud
    ctx.fillStyle = 'rgba(190,60,50,0.5)'
    ctx.fillRect(-10.5, -6, 3.2, 12)
    for (let i = 0; i < 5; i++) {
      fillEll(ctx, 'rgba(110,92,56,0.38)', -9 + sr(g.bob + i * 3.1) * 16, (sr(g.bob + i * 5.7) - 0.5) * 9, 1.2 + sr(g.bob + i) * 1.6, 0.9 + sr(g.bob + i * 2) * 1.2, i)
    }
    ctx.restore()

    // cardboard sleeve with ridges
    ctx.beginPath()
    ctx.moveTo(-6, -half(-6)); ctx.lineTo(3, -half(3)); ctx.lineTo(3, half(3)); ctx.lineTo(-6, half(-6)); ctx.closePath()
    const sl = ctx.createLinearGradient(0, -6, 0, 6)
    sl.addColorStop(0, '#c99058'); sl.addColorStop(1, '#85562a')
    ctx.fillStyle = sl; ctx.fill()
    ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 0.9; ctx.stroke()
    ctx.strokeStyle = 'rgba(60,30,10,0.38)'; ctx.lineWidth = 0.7
    for (let x = -4.8; x < 3; x += 1.5) {
      ctx.beginPath(); ctx.moveTo(x, -half(x) + 0.5); ctx.lineTo(x, half(x) - 0.5); ctx.stroke()
    }
    fillEll(ctx, 'rgba(70,45,20,0.5)', -1.5, 2.2, 2.2, 1.5, 0.3)

    // plastic lid with a bitten rim
    rrect(ctx, 8, -7.8, 3.4, 15.6, 1.3)
    const lid = ctx.createLinearGradient(0, -8, 0, 8)
    lid.addColorStop(0, '#f1f5f9'); lid.addColorStop(1, '#8e98a4')
    ctx.fillStyle = lid; ctx.fill()
    ctx.strokeStyle = '#3f4954'; ctx.lineWidth = 1; ctx.stroke()
    rrect(ctx, 10.3, -8.8, 1.8, 17.6, 0.9)
    ctx.fillStyle = '#dfe3e8'; ctx.fill(); ctx.strokeStyle = '#3f4954'; ctx.lineWidth = 0.8; ctx.stroke()
    ctx.fillStyle = '#4a2f18'
    ctx.beginPath(); ctx.arc(11.2, 5.8, 1.5, 0, TAU); ctx.fill() // chewed notch with coffee residue

    // crumples + highlight
    ctx.strokeStyle = 'rgba(0,0,0,0.28)'; ctx.lineWidth = 0.9; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(-9.5, -4); ctx.lineTo(-7.2, -0.8); ctx.lineTo(-9, 3.2); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(4.5, -6); ctx.lineTo(6.2, -3.4); ctx.stroke()
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.moveTo(4, -5.9); ctx.lineTo(7.6, -6); ctx.stroke()
  }

  _drawFoam(ctx, g) {
    // Broken polystyrene chunks: yellowed, beaded surface, grime and algae
    const chunk = (cx, cy, R, sd, n) => {
      const pts = []
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + sr(sd) * 0.6
        const rr = R * (0.7 + sr(sd + i * 1.9) * 0.42)
        pts.push([cx + Math.cos(a) * rr * 1.1, cy + Math.sin(a) * rr * 0.85])
      }
      const path = () => {
        ctx.beginPath()
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
        ctx.closePath()
      }
      path()
      const gr = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R)
      gr.addColorStop(0, '#fbfaf3'); gr.addColorStop(0.5, '#e4e0d2'); gr.addColorStop(1, '#b4af9c')
      outlined(ctx, gr, '#7d7867', 'rgba(0,40,70,0.35)', 3.6, 1.1)

      ctx.save(); path(); ctx.clip()
      // bead texture
      const beads = Math.round(R * 2.2)
      for (let k = 0; k < beads; k++) {
        const a = sr(sd + k * 2.7) * TAU, d = Math.sqrt(sr(sd + k * 4.3)) * R
        const bx = cx + Math.cos(a) * d, by = cy + Math.sin(a) * d * 0.85
        const br = 0.8 + sr(sd + k * 1.3) * 0.8
        ctx.strokeStyle = 'rgba(105,100,86,0.42)'; ctx.lineWidth = 0.6
        ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.stroke()
        if (k % 4 === 0) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(bx - 0.3, by - 0.3, br * 0.4, 0, TAU); ctx.fill() }
      }
      // grime: waterline stain, mud, algae
      fillEll(ctx, 'rgba(125,105,60,0.36)', cx + R * 0.3, cy + R * 0.35, R * 0.7, R * 0.42, 0.3)
      fillEll(ctx, 'rgba(80,130,70,0.32)', cx - R * 0.4, cy + R * 0.2, R * 0.38, R * 0.22, -0.4)
      fillEll(ctx, 'rgba(70,60,40,0.25)', cx + R * 0.1, cy - R * 0.45, R * 0.25, R * 0.16, 0.8)
      ctx.strokeStyle = 'rgba(80,74,58,0.45)'; ctx.lineWidth = 0.8; ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(cx - R * 0.5, cy - R * 0.1); ctx.lineTo(cx - R * 0.1, cy + R * 0.15); ctx.lineTo(cx + R * 0.1, cy + R * 0.02); ctx.stroke()
      ctx.restore()
    }
    chunk(0, 0, 10.5, g.bob * 5, 9)
    chunk(11, 6, 5, g.bob * 5 + 11, 7)
    chunk(-11, 7, 3.6, g.bob * 5 + 23, 6)
    chunk(-5, -11, 3, g.bob * 5 + 31, 6)
    // loose beads drifting away
    for (let i = 0; i < 6; i++) {
      const a = sr(g.bob + i * 5.5) * TAU, d = 14 + sr(g.bob + i * 2.2) * 5
      ctx.fillStyle = 'rgba(250,248,240,0.95)'
      ctx.strokeStyle = 'rgba(0,40,70,0.4)'; ctx.lineWidth = 0.6
      ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 0.9 + sr(g.bob + i) * 0.6, 0, TAU); ctx.fill(); ctx.stroke()
    }
  }

  // ── Obstacles ─────────────────────────────────────────────────────────────────

  _foamRing(ctx, P, rx, ry, t, seed, strength = 1) {
    const n = 18
    ctx.fillStyle = P.foam
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + t * 0.25
      const wob = 0.5 + 0.5 * Math.sin(t * 2.4 + i * 1.7 + seed)
      ctx.globalAlpha = (0.3 + wob * 0.35) * strength
      ctx.beginPath()
      ctx.arc(Math.cos(a) * (rx + wob * 2.5), Math.sin(a) * (ry + wob * 2.5), 2.6 + wob * 3, 0, TAU)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  _downstreamWake(ctx, P, rx, ry, t) {
    ctx.save()
    ctx.lineCap = 'round'
    ctx.strokeStyle = P.foam
    for (const s of [-1, 1]) {
      ctx.globalAlpha = 0.28; ctx.lineWidth = 2.2
      ctx.beginPath()
      ctx.moveTo(s * rx * 0.8, ry * 0.4)
      ctx.quadraticCurveTo(s * (rx + 4), ry + 18, s * (rx + 15), ry + 52)
      ctx.stroke()
    }
    ctx.fillStyle = P.foam
    for (let k = 0; k < 5; k++) {
      const f = (t * 0.8 + k / 5) % 1
      ctx.globalAlpha = (1 - f) * 0.55
      ctx.beginPath(); ctx.arc((k % 2 ? 1 : -1) * (rx * 0.5 + f * 12), ry + f * 48, 2.6 * (1 - f * 0.5), 0, TAU); ctx.fill()
    }
    ctx.restore()
  }

  _drawObstacles(ctx, P, t) {
    for (const o of this.obstacles) {
      ctx.save()
      ctx.translate(o.x, o.y)
      if (o.hitCooldown > 0) ctx.globalAlpha = 0.6 + Math.sin(t * 20) * 0.4
      switch (o.kind) {
        case 'rock': this._drawRock(ctx, P, o, t); break
        case 'log': this._drawLog(ctx, P, o, t); break
        case 'debris': this._drawDebris(ctx, P, o, t); break
        default: this._drawRock(ctx, P, o, t)
      }
      ctx.restore()
    }
  }

  _drawRock(ctx, P, o, t) {
    const seed = o.seed
    this._downstreamWake(ctx, P, 20, 18, t)
    this._foamRing(ctx, P, 22, 19, t, seed)
    ctx.save()
    ctx.rotate(o.rot)
    fillEll(ctx, P.shadow, 3, 4, 21, 18)
    const pts = []
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * TAU
      const r = 16 + sr(seed + i) * 8
      pts.push([Math.cos(a) * r, Math.sin(a) * r * 0.92])
    }
    smoothPoly(ctx, pts)
    const rg = ctx.createRadialGradient(-7, -8, 2, 0, 0, 26)
    rg.addColorStop(0, P.rockC); rg.addColorStop(0.45, P.rockA); rg.addColorStop(1, P.rockB)
    ctx.fillStyle = rg; ctx.fill()
    ctx.strokeStyle = 'rgba(30,20,10,0.65)'; ctx.lineWidth = 1.6; ctx.stroke()
    // facets
    ctx.save(); smoothPoly(ctx, pts); ctx.clip()
    ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 1.2
    for (let i = 0; i < 4; i++) {
      const p = pts[(i * 2 + 1) % 9]
      ctx.beginPath(); ctx.moveTo(p[0] * 0.15, p[1] * 0.15); ctx.lineTo(p[0] * 0.95, p[1] * 0.95); ctx.stroke()
    }
    // moss
    ctx.fillStyle = P.night ? 'rgba(40,90,40,0.7)' : 'rgba(90,150,60,0.75)'
    for (let i = 0; i < 5; i++) {
      fillEll(ctx, ctx.fillStyle, -8 + sr(seed + i * 2) * 10, -9 + sr(seed + i * 3) * 8, 3 + sr(seed + i) * 3, 2 + sr(seed + i + 4) * 2, sr(seed + i))
    }
    ctx.restore()
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(0, 0, 21, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke()
    ctx.restore()
  }

  _drawLog(ctx, P, o, t) {
    const seed = o.seed
    ctx.save()
    ctx.rotate(o.rot)
    // Foam hugging the log — heavier on the upstream side
    ctx.fillStyle = P.foam
    for (let i = 0; i < 13; i++) {
      const x = -30 + (i / 12) * 60
      const wob = 0.5 + 0.5 * Math.sin(t * 2.3 + i * 1.4 + seed)
      ctx.globalAlpha = 0.28 + wob * 0.34
      ctx.beginPath(); ctx.arc(x, -12 - wob * 2, 2.4 + wob * 2.6, 0, TAU); ctx.fill()
      ctx.globalAlpha = 0.18 + wob * 0.2
      ctx.beginPath(); ctx.arc(x, 12 + wob * 2, 2 + wob * 2, 0, TAU); ctx.fill()
    }
    ctx.globalAlpha = 1
    ctx.save(); ctx.rotate(-o.rot); this._downstreamWake(ctx, P, 26, 12, t); ctx.restore()

    fillEll(ctx, P.shadow, 3, 5, 31, 10)

    // branch stub
    ctx.save(); ctx.translate(sr(seed) * 20 - 10, -9); ctx.rotate(-0.7)
    rrect(ctx, -2.5, -11, 5, 12, 2)
    ctx.fillStyle = P.logA; ctx.fill(); ctx.strokeStyle = P.logB; ctx.lineWidth = 1; ctx.stroke()
    fillEll(ctx, P.logC, 0, -11, 2.4, 1.4)
    ctx.restore()

    // body
    ctx.beginPath()
    ctx.moveTo(-28, -9); ctx.lineTo(28, -9)
    ctx.quadraticCurveTo(31, 0, 28, 9); ctx.lineTo(-28, 9)
    ctx.quadraticCurveTo(-31, 0, -28, -9); ctx.closePath()
    const lg = ctx.createLinearGradient(0, -9, 0, 9)
    lg.addColorStop(0, P.logC); lg.addColorStop(0.35, P.logA); lg.addColorStop(1, P.logB)
    ctx.fillStyle = lg; ctx.fill()
    ctx.strokeStyle = 'rgba(30,15,5,0.8)'; ctx.lineWidth = 1.5; ctx.stroke()

    // bark grooves
    ctx.save(); ctx.clip()
    ctx.strokeStyle = 'rgba(30,15,5,0.4)'; ctx.lineWidth = 1
    for (let i = 0; i < 12; i++) {
      const x = -26 + sr(seed + i) * 52, y = -8 + sr(seed + i + 9) * 16, l = 4 + sr(seed + i + 3) * 8
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + l * 0.5, y + 1.4, x + l, y); ctx.stroke()
    }
    // moss
    ctx.fillStyle = P.night ? 'rgba(40,90,40,0.6)' : 'rgba(100,160,60,0.65)'
    fillEll(ctx, ctx.fillStyle, -12 + sr(seed + 4) * 8, -5, 6, 2.6)
    fillEll(ctx, ctx.fillStyle, 12 + sr(seed + 6) * 6, 5, 5, 2.2)
    // knot
    fillEll(ctx, P.logB, 4, 1, 3.2, 2.4)
    ctx.strokeStyle = P.logC; ctx.lineWidth = 0.8; ell(ctx, 4, 1, 1.6, 1.2); ctx.stroke()
    ctx.restore()

    // end grain
    fillEll(ctx, P.logC, 28, 0, 3.6, 8.6)
    ctx.strokeStyle = P.logB; ctx.lineWidth = 0.9
    ell(ctx, 28, 0, 3.6, 8.6); ctx.stroke()
    ell(ctx, 28, 0, 2, 5); ctx.stroke()
    ell(ctx, 28, 0, 0.8, 2); ctx.stroke()
    fillEll(ctx, P.logB, -28, 0, 3.2, 8.6)

    // wet highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(-24, -5.5); ctx.lineTo(22, -5.5); ctx.stroke()
    ctx.restore()
  }

  _drawDebris(ctx, P, o, t) {
    const seed = o.seed
    this._downstreamWake(ctx, P, 20, 14, t)
    this._foamRing(ctx, P, 24, 16, t, seed, 0.9)
    ctx.save()
    ctx.rotate(o.rot)
    fillEll(ctx, P.shadow, 3, 4, 24, 15)

    const plank = (x, y, w, h, a, col) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(a)
      ctx.beginPath()
      ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - 3, -h / 2); ctx.lineTo(w / 2, -h / 4)
      ctx.lineTo(w / 2 - 3, 0); ctx.lineTo(w / 2 + 1, h / 4); ctx.lineTo(w / 2 - 2, h / 2); ctx.lineTo(-w / 2, h / 2)
      ctx.closePath()
      const pg = ctx.createLinearGradient(0, -h / 2, 0, h / 2)
      pg.addColorStop(0, col); pg.addColorStop(1, P.logB)
      ctx.fillStyle = pg; ctx.fill()
      ctx.strokeStyle = 'rgba(30,15,5,0.85)'; ctx.lineWidth = 1.2; ctx.stroke()
      ctx.strokeStyle = 'rgba(30,15,5,0.35)'; ctx.lineWidth = 0.8
      for (const gy of [-h * 0.15, h * 0.2]) {
        ctx.beginPath(); ctx.moveTo(-w / 2 + 2, gy); ctx.lineTo(w / 2 - 4, gy + 0.6); ctx.stroke()
      }
      fillEll(ctx, '#9aa4ae', -w / 2 + 4, 0, 1.3, 1.3)
      fillEll(ctx, '#9aa4ae', w / 2 - 9, 0, 1.3, 1.3)
      ctx.restore()
    }
    plank(-3, -6, 42, 8.5, -0.28, P.logA)
    plank(2, 6, 36, 8, 0.32, P.plank2)
    plank(-4, 0, 32, 7.5, 1.38, P.logC)

    // rusty barrel hoop
    ctx.strokeStyle = P.night ? '#4a4a52' : '#7b8794'; ctx.lineWidth = 2.6
    ell(ctx, 4, 0, 14, 11, sr(seed) * TAU); ctx.stroke()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1
    ell(ctx, 4, -1, 14, 11, sr(seed) * TAU); ctx.stroke()
    ctx.restore()
  }

  // ── Swimming wildlife (top-down, underwater) ─────────────────────────────────

  _drawWildlife(ctx, P, t) {
    const W = this.width, bw = this._bankW()
    for (const w of this.wildlife) {
      const edge = Math.min(w.x - (bw - 6), (W - bw + 6) - w.x)
      const fade = clamp(edge / 34, 0, 1)
      if (fade <= 0.01) continue
      const heading = Math.atan2(w.vyEff || w.vy, w.vx)

      // V-shaped surface wake behind the swimmer
      ctx.save()
      ctx.translate(w.x, w.y)
      ctx.rotate(heading)
      ctx.globalAlpha = 0.28 * fade
      ctx.strokeStyle = P.foam; ctx.lineWidth = 1.6; ctx.lineCap = 'round'
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(-8, s * 3); ctx.quadraticCurveTo(-26, s * 9, -48, s * 20); ctx.stroke()
      }
      ctx.restore()

      ctx.save()
      ctx.translate(w.x, w.y)
      ctx.rotate(heading)
      if (Math.cos(heading) < 0) ctx.scale(1, -1)
      ctx.globalAlpha = 0.93 * fade
      if (w.kind === 'turtle') this._drawTurtle(ctx, P, w)
      else this._drawFish(ctx, P, w)
      ctx.restore()
    }
  }

  _drawFish(ctx, P, w) {
    const v = FISH_VARIANTS[w.variant % FISH_VARIANTS.length]
    const ph = w.age * 7.5 + w.ph
    const n = 12
    const L = 34 * w.size, maxW = 7.5 * w.size
    const sp = []
    for (let i = 0; i <= n; i++) {
      const u = i / n
      sp.push({
        x: L * (0.5 - u),
        y: Math.sin(ph - u * 3.2) * (0.25 + u * u * 1.9) * 2.0 * w.size,
      })
    }
    const hw = (i) => {
      const u = i / n
      return maxW * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.85 + 0.08)), 0.9) * (1 - 0.75 * u * u)
    }
    const bodyPath = () => {
      ctx.beginPath()
      ctx.moveTo(sp[0].x + 2.5, sp[0].y)
      for (let i = 0; i <= n; i++) ctx.lineTo(sp[i].x, sp[i].y - hw(i))
      for (let i = n; i >= 0; i--) ctx.lineTo(sp[i].x, sp[i].y + hw(i))
      ctx.closePath()
    }

    // refracted shadow on the river bed
    ctx.save(); ctx.translate(3, 4); ctx.globalAlpha *= 0.25
    bodyPath(); ctx.fillStyle = '#001428'; ctx.fill(); ctx.restore()

    // tail fin
    const ta = Math.atan2(sp[n].y - sp[n - 1].y, sp[n].x - sp[n - 1].x) + Math.PI
    ctx.save()
    ctx.translate(sp[n].x, sp[n].y)
    ctx.rotate(ta + Math.PI + Math.sin(ph - 3.8) * 0.3)
    const s = w.size
    ctx.beginPath()
    ctx.moveTo(1, 0)
    ctx.quadraticCurveTo(-5, -3, -13 * s, -9 * s)
    ctx.quadraticCurveTo(-9 * s, 0, -13 * s, 9 * s)
    ctx.quadraticCurveTo(-5, 3, 1, 0)
    ctx.closePath()
    ctx.fillStyle = v.fin; ctx.globalAlpha *= 0.9; ctx.fill()
    ctx.restore()

    // pectoral fins
    for (const side of [-1, 1]) {
      ctx.save()
      ctx.translate(sp[3].x, sp[3].y + side * hw(3) * 0.85)
      ctx.rotate(Math.PI - side * (0.75 + Math.sin(ph * 0.6 + side) * 0.28))
      fillEll(ctx, v.fin, 4, 0, 5.5 * s, 2.2 * s)
      ctx.restore()
    }

    // body
    bodyPath()
    const bg = ctx.createLinearGradient(0, -maxW, 0, maxW)
    bg.addColorStop(0, v.top); bg.addColorStop(0.5, v.body); bg.addColorStop(1, v.belly)
    ctx.fillStyle = bg; ctx.fill()
    ctx.save()
    ctx.clip()
    if (v.patch) {
      ctx.fillStyle = v.patch
      for (const [i, r] of [[3, 3.2], [6, 3.6], [9, 2.4]]) fillEll(ctx, v.patch, sp[i].x, sp[i].y + (i % 2 ? 1.5 : -1.5), r * s, 2.4 * s)
    }
    // scale sheen
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 0.8
    for (let i = 2; i < 10; i++) {
      ctx.beginPath(); ctx.arc(sp[i].x, sp[i].y, hw(i) * 0.8, -1.2, 1.2); ctx.stroke()
    }
    ctx.restore()
    ctx.strokeStyle = 'rgba(0,30,60,0.45)'; ctx.lineWidth = 1; bodyPath(); ctx.stroke()
    // dorsal ridge
    ctx.strokeStyle = 'rgba(0,30,60,0.35)'; ctx.lineWidth = 1.8; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(sp[2].x, sp[2].y)
    for (let i = 3; i <= 9; i++) ctx.lineTo(sp[i].x, sp[i].y)
    ctx.stroke()
    // eyes
    for (const side of [-1, 1]) {
      const ex = sp[1].x, ey = sp[1].y + side * hw(1) * 0.7
      fillEll(ctx, '#fff', ex, ey, 1.9, 1.9)
      fillEll(ctx, '#05121f', ex + 0.4, ey, 1.1, 1.1)
    }
  }

  _drawTurtle(ctx, P, w) {
    const ph = w.age * 3 + w.ph
    const s = w.size
    ctx.scale(s, s)

    // bed shadow
    ctx.save(); ctx.globalAlpha *= 0.22; ctx.translate(3, 4)
    fillEll(ctx, '#001428', 0, 0, 17, 14); ctx.restore()

    const skin = '#6b8f3e', skinDark = '#4e6e2c'
    // flippers — front pair paddles, rear pair trails
    for (const side of [-1, 1]) {
      const pa = Math.sin(ph + (side > 0 ? 0 : Math.PI))
      ctx.save()
      ctx.translate(8, side * 10)
      ctx.rotate(side * (Math.PI / 2 + 0.5 + pa * 0.4))
      fillEll(ctx, skin, 7, 0, 9, 3.6)
      fillEll(ctx, skinDark, 9, 0, 4.5, 1.8)
      ctx.restore()
      ctx.save()
      ctx.translate(-9, side * 9)
      ctx.rotate(side * (Math.PI / 2 + 1.0 - pa * 0.25))
      fillEll(ctx, skin, 4, 0, 5.5, 2.6)
      ctx.restore()
    }
    // tail
    ctx.beginPath(); ctx.moveTo(-14, -2); ctx.lineTo(-22, 0); ctx.lineTo(-14, 2); ctx.closePath()
    ctx.fillStyle = skin; ctx.fill()

    // head
    const hx = 17 + Math.sin(ph * 0.5) * 1.2
    fillEll(ctx, skin, hx, 0, 7.2, 5.4)
    for (const side of [-1, 1]) {
      fillEll(ctx, '#fff', hx + 3, side * 2.8, 1.5, 1.5)
      fillEll(ctx, '#0a1408', hx + 3.4, side * 2.8, 0.9, 0.9)
    }

    // shell
    ell(ctx, 0, 0, 16, 13)
    const sg = ctx.createRadialGradient(-4, -4, 2, 0, 0, 18)
    sg.addColorStop(0, '#9dc063'); sg.addColorStop(0.6, '#5e8a36'); sg.addColorStop(1, '#3b5a22')
    ctx.fillStyle = sg; ctx.fill()
    ctx.strokeStyle = '#27401a'; ctx.lineWidth = 1.6; ctx.stroke()
    // scutes: central hex + radial seams + marginals
    ctx.strokeStyle = 'rgba(25,45,12,0.7)'; ctx.lineWidth = 1.1
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU
      const x = Math.cos(a) * 6.5, y = Math.sin(a) * 5.5
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath(); ctx.stroke()
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU
      ctx.beginPath()
      ctx.moveTo(Math.cos(a) * 6.5, Math.sin(a) * 5.5)
      ctx.lineTo(Math.cos(a) * 14.6, Math.sin(a) * 11.8); ctx.stroke()
    }
    ctx.strokeStyle = 'rgba(25,45,12,0.45)'; ell(ctx, 0, 0, 12.5, 10); ctx.stroke()
    fillEll(ctx, 'rgba(255,255,255,0.2)', -5, -5, 7, 3.5, -0.5)
  }

  // ── Rescuables ───────────────────────────────────────────────────────────────

  _drawRescuables(ctx, P, t) {
    const boatX = this.boat.x * this.width, boatY = this.boat.y * this.height
    for (const r of this.rescuables) {
      const rescued = r.rescued
      const fade = rescued ? clamp(1 - r.rt / 1.0, 0, 1) : 1
      const urg = clamp(r.y / this.height, 0, 1)
      ctx.save()
      ctx.translate(r.x, r.y)

      // rescue range ring — amber far away, green + expanded when in range
      if (!rescued) {
        const rr = lerp(36, RESCUE_R, r.ring)
        ctx.save()
        ctx.rotate(t * 0.7)
        ctx.globalAlpha = 0.5 + 0.25 * Math.sin(t * 3)
        ctx.strokeStyle = r.ring > 0.5 ? '#4ade80' : '#fbbf24'
        ctx.lineWidth = 2.5; ctx.setLineDash([7, 6])
        ctx.beginPath(); ctx.arc(0, 4, rr, 0, TAU); ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
      } else {
        ctx.globalAlpha = fade
        ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 3
        ctx.beginPath(); ctx.arc(0, 4, 24 + r.rt * 50, 0, TAU); ctx.stroke()
      }

      // disturbed water around the raft
      ctx.globalAlpha = fade
      for (let i = 0; i < 3; i++) {
        const f = (t * 0.8 + i / 3 + r.ph) % 1
        ctx.globalAlpha = (1 - f) * 0.5 * fade
        ctx.strokeStyle = P.foam; ctx.lineWidth = 1.5
        ell(ctx, 0, 10, 24 + f * 26, 9 + f * 11); ctx.stroke()
      }
      ctx.globalAlpha = fade

      const bob = Math.sin(t * 2.4 + r.ph) * 1.6
      ctx.translate(0, bob)
      if (rescued) { ctx.translate(0, -r.rt * 38); ctx.scale(1 + r.rt * 0.25, 1 + r.rt * 0.25) }

      // look toward the boat
      const lx = clamp((boatX - r.x) / 70, -1, 1)
      const ly = clamp((boatY - r.y) / 70, -1, 1)
      const panic = rescued ? 0 : 0.6 + urg * 0.4

      ctx.scale(1.1, 1.1)
      this._drawAnimalBust(ctx, P, r, t, lx, ly, panic, rescued)

      if (!rescued) {
        this._drawWaterMask(ctx, P, r, t)
        this._drawRaft(ctx, P, r, t)
        this._drawPaws(ctx, r, t, panic)
      }
      ctx.restore()

      // HELP bubble + proximity prompt (unscaled)
      if (!rescued) {
        ctx.save()
        ctx.translate(r.x, r.y)
        const rate = 4 + urg * 6
        const pop = 1 + Math.max(0, Math.sin(t * rate)) * 0.12
        ctx.translate(30, -34 + Math.sin(t * 3 + r.ph) * 1.5)
        ctx.scale(pop, pop)
        rrect(ctx, -19, -9, 38, 17, 8)
        ctx.fillStyle = '#ef4444'; ctx.fill()
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()
        ctx.beginPath(); ctx.moveTo(-10, 7); ctx.lineTo(-17, 15); ctx.lineTo(-4, 7); ctx.closePath()
        ctx.fillStyle = '#ef4444'; ctx.fill()
        ctx.font = '800 10px "Nunito",sans-serif'
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillStyle = '#fff'; ctx.fillText('HELP!', 0, 0.5)
        ctx.restore()

        const dist = Math.hypot(boatX - r.x, boatY - r.y)
        if (dist < RESCUE_R * 1.7) {
          const a = clamp(1 - (dist - RESCUE_R) / (RESCUE_R * 0.7), 0, 1)
          ctx.save()
          ctx.globalAlpha = a
          ctx.font = '800 11px "Nunito",sans-serif'
          ctx.textAlign = 'center'; ctx.textBaseline = 'top'
          ctx.lineJoin = 'round'
          ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 3
          ctx.strokeText('[E] Rescue', r.x, r.y + 34)
          ctx.fillStyle = '#fde047'
          ctx.fillText('[E] Rescue', r.x, r.y + 34)
          ctx.restore()
        }
      }
    }
  }

  _eye(ctx, x, y, rad, lx, ly, scared) {
    fillEll(ctx, '#fff', x, y, rad + (scared ? 0.5 : 0), rad + (scared ? 0.7 : 0))
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 0.7
    ell(ctx, x, y, rad + (scared ? 0.5 : 0), rad + (scared ? 0.7 : 0)); ctx.stroke()
    const pr = rad * (scared ? 0.5 : 0.62)
    fillEll(ctx, '#1a0f0a', x + lx * rad * 0.35, y + ly * rad * 0.35, pr, pr)
    fillEll(ctx, '#fff', x + lx * rad * 0.35 - pr * 0.35, y + ly * rad * 0.35 - pr * 0.4, pr * 0.32, pr * 0.32)
  }

  _brows(ctx, x, y, w, color) {
    // worried brows: inner ends raised
    ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.lineCap = 'round'
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(s * (x + w), y + 1.2); ctx.lineTo(s * x, y - 1.8); ctx.stroke()
    }
  }

  _sweat(ctx, t, ph, side) {
    const f = (t * 1.6 + ph) % 1
    ctx.save()
    ctx.translate(side * (13 + f * 4), -22 - f * 6)
    ctx.globalAlpha *= 1 - f
    ctx.fillStyle = '#9fdcff'
    ctx.beginPath(); ctx.moveTo(0, -3); ctx.quadraticCurveTo(2.6, 0.6, 0, 2.4); ctx.quadraticCurveTo(-2.6, 0.6, 0, -3); ctx.fill()
    ctx.restore()
  }

  _drawAnimalBust(ctx, P, r, t, lx, ly, panic, happy) {
    const shake = happy ? 0 : Math.sin(t * 22 + r.ph) * 0.35 * panic
    ctx.save()
    ctx.translate(shake, 0)

    const torso = (c1, c2) => {
      const g = ctx.createRadialGradient(-3, 2, 2, 0, 8, 16)
      g.addColorStop(0, c1); g.addColorStop(1, c2)
      fillEll(ctx, g, 0, 8, 13, 11)
    }

    if (r.kind === 'deer') {
      // antlers
      ctx.strokeStyle = '#7a4a20'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'
      for (const s of [-1, 1]) {
        const w = Math.sin(t * 6 + s) * 0.04 * panic
        ctx.save(); ctx.rotate(s * w)
        ctx.beginPath()
        ctx.moveTo(s * 6, -22); ctx.lineTo(s * 11, -34)
        ctx.moveTo(s * 9, -29); ctx.lineTo(s * 15, -31)
        ctx.moveTo(s * 11, -34); ctx.lineTo(s * 10, -40)
        ctx.moveTo(s * 10, -26); ctx.lineTo(s * 14, -24)
        ctx.stroke(); ctx.restore()
      }
      torso('#d4894e', '#8a4e22')
      fillEll(ctx, '#f1dcb8', 0, 11, 6, 4.5)
      // ears
      for (const s of [-1, 1]) {
        fillEll(ctx, '#b8703a', s * 12.5, -19, 5.5, 3, s * 0.6)
        fillEll(ctx, '#f0b8a0', s * 12.5, -19, 3.2, 1.6, s * 0.6)
      }
      const hg = ctx.createRadialGradient(-3, -16, 1, 0, -13, 12)
      hg.addColorStop(0, '#e29a5c'); hg.addColorStop(1, '#a8652f')
      fillEll(ctx, hg, 0, -13, 10, 11.5)
      fillEll(ctx, '#f3dfbc', 0, -6.5, 6.2, 4.6)
      fillEll(ctx, '#2c1a10', 0, -9, 2.4, 1.6)
      // mouth (open when scared)
      if (!happy) { fillEll(ctx, '#3a1410', 0, -3.8, 2.2, 1.8); fillEll(ctx, '#ef7f8a', 0, -3.2, 1.3, 0.9) }
      else { ctx.strokeStyle = '#3a1410'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, -5.5, 2.4, 0.2, Math.PI - 0.2); ctx.stroke() }
      this._eye(ctx, -5, -15, 3.2, lx, ly, !happy)
      this._eye(ctx, 5, -15, 3.2, lx, ly, !happy)
      if (!happy) this._brows(ctx, 3, -20, 5.5, '#5a3216')
    } else if (r.kind === 'fox') {
      // floating bushy tail
      const tg = ctx.createRadialGradient(20, 6, 1, 20, 6, 14)
      tg.addColorStop(0, '#f09048'); tg.addColorStop(1, '#c06028')
      ctx.beginPath()
      ctx.moveTo(11, 4); ctx.quadraticCurveTo(26, -8, 33, 6); ctx.quadraticCurveTo(26, 22, 11, 12); ctx.closePath()
      ctx.fillStyle = tg; ctx.fill()
      fillEll(ctx, '#fff', 31, 7, 4.5, 5)
      torso('#ee8a3a', '#b85a22')
      fillEll(ctx, '#f8e8cc', 0, 10, 6, 5)
      // ears
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(s * 5, -18); ctx.lineTo(s * 12, -32); ctx.lineTo(s * 14, -16); ctx.closePath()
        ctx.fillStyle = '#d96d28'; ctx.fill()
        ctx.beginPath(); ctx.moveTo(s * 10.2, -26.5); ctx.lineTo(s * 12, -32); ctx.lineTo(s * 12.9, -22.2); ctx.closePath()
        ctx.fillStyle = '#2a1308'; ctx.fill()
        ctx.beginPath(); ctx.moveTo(s * 7.2, -19); ctx.lineTo(s * 11, -27); ctx.lineTo(s * 12, -18); ctx.closePath()
        ctx.fillStyle = '#f0a090'; ctx.fill()
      }
      const hg = ctx.createRadialGradient(-3, -16, 1, 0, -12, 13)
      hg.addColorStop(0, '#f6a05a'); hg.addColorStop(1, '#d4682a')
      fillEll(ctx, hg, 0, -12, 12.5, 9.5)
      // white cheeks/muzzle
      ctx.beginPath()
      ctx.moveTo(-11.5, -11); ctx.quadraticCurveTo(-6, -2, 0, -1); ctx.quadraticCurveTo(6, -2, 11.5, -11)
      ctx.quadraticCurveTo(0, -7, -11.5, -11); ctx.closePath()
      ctx.fillStyle = '#fbeed8'; ctx.fill()
      fillEll(ctx, '#1d0d08', 0, -3.2, 2.2, 1.7)
      if (!happy) { fillEll(ctx, '#3a1410', 0, 0.8, 1.9, 1.5) }
      this._eye(ctx, -5.2, -12.5, 2.9, lx, ly, !happy)
      this._eye(ctx, 5.2, -12.5, 2.9, lx, ly, !happy)
      if (!happy) this._brows(ctx, 3, -17, 5.5, '#7a3a14')
    } else { // rabbit
      // ears (one flops)
      const flop = Math.sin(t * 7 + r.ph) * 0.12 * panic
      for (const s of [-1, 1]) {
        ctx.save()
        ctx.translate(s * 5, -20)
        ctx.rotate(s * 0.15 + (s > 0 ? 0.5 + flop * 2 : flop))
        fillEll(ctx, '#a89f9d', 0, -10, 3.7, 11)
        fillEll(ctx, '#f0a8b0', 0, -10, 1.9, 8.2)
        ctx.restore()
      }
      torso('#d4ccca', '#8f8785')
      fillEll(ctx, '#fff', 0, 10, 7, 5.5)
      const hg = ctx.createRadialGradient(-3, -14, 1, 0, -11, 11)
      hg.addColorStop(0, '#e2dbd9'); hg.addColorStop(1, '#9a9290')
      fillEll(ctx, hg, 0, -11, 9.8, 9.2)
      fillEll(ctx, '#fff', -2.6, -6, 3.6, 3); fillEll(ctx, '#fff', 2.6, -6, 3.6, 3)
      ctx.beginPath(); ctx.moveTo(-1.8, -9.2); ctx.lineTo(1.8, -9.2); ctx.lineTo(0, -7.4); ctx.closePath()
      ctx.fillStyle = '#e8808c'; ctx.fill()
      // teeth
      ctx.fillStyle = '#fff'; ctx.fillRect(-1.3, -5.6, 2.6, 3.4)
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 0.6
      ctx.strokeRect(-1.3, -5.6, 2.6, 3.4)
      ctx.beginPath(); ctx.moveTo(0, -5.6); ctx.lineTo(0, -2.2); ctx.stroke()
      // whiskers
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 0.8
      for (const s of [-1, 1]) for (const dy of [-1.5, 0.5]) {
        ctx.beginPath(); ctx.moveTo(s * 4, -6 + dy); ctx.lineTo(s * 12, -7 + dy * 2.2); ctx.stroke()
      }
      this._eye(ctx, -4.6, -12.6, 3.0, lx, ly, !happy)
      this._eye(ctx, 4.6, -12.6, 3.0, lx, ly, !happy)
      if (!happy) this._brows(ctx, 2.6, -17.6, 5, '#5a504e')
    }

    if (!happy) { this._sweat(ctx, t, r.ph, 1); this._sweat(ctx, t, r.ph + 0.5, -1) }
    else {
      fillEll(ctx, 'rgba(255,120,150,0.45)', -7, -8, 2.6, 1.6)
      fillEll(ctx, 'rgba(255,120,150,0.45)', 7, -8, 2.6, 1.6)
    }
    ctx.restore()
  }

  _drawWaterMask(ctx, P, r, t) {
    // Hides the lower body so the animal sits *in* the water, not on it.
    const top = 5
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(-34, top)
    for (let x = -34; x <= 34; x += 3) ctx.lineTo(x, top + Math.sin(x * 0.4 + t * 4.5 + r.ph) * 1.5)
    ctx.lineTo(34, 46); ctx.lineTo(-34, 46); ctx.closePath()
    ctx.clip()
    const g = ctx.createRadialGradient(0, 14, 2, 0, 14, 34)
    g.addColorStop(0, P.waterMask)
    g.addColorStop(0.62, P.waterMask)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(-36, top - 4, 72, 46)
    ctx.restore()
    // waterline foam
    const fg = ctx.createLinearGradient(-26, 0, 26, 0)
    fg.addColorStop(0, 'rgba(255,255,255,0)'); fg.addColorStop(0.5, 'rgba(255,255,255,0.85)'); fg.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.strokeStyle = fg; ctx.lineWidth = 2; ctx.lineCap = 'round'
    ctx.beginPath()
    for (let x = -26; x <= 26; x += 3) {
      const y = top + Math.sin(x * 0.4 + t * 4.5 + r.ph) * 1.5
      x === -26 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  _drawRaft(ctx, P, r, t) {
    // Tangled branches + litter the animal is clinging to
    ctx.save()
    ctx.translate(0, 12)
    ctx.rotate(Math.sin(t * 1.7 + r.ph) * 0.03)

    // foam collar
    ctx.fillStyle = P.foam
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU + t * 0.3
      const wob = 0.5 + 0.5 * Math.sin(t * 2.6 + i * 1.6 + r.ph)
      ctx.globalAlpha = 0.3 + wob * 0.3
      ctx.beginPath(); ctx.arc(Math.cos(a) * (28 + wob * 2), Math.sin(a) * (10 + wob * 1.5), 2.2 + wob * 2, 0, TAU); ctx.fill()
    }
    ctx.globalAlpha = 1

    const log = (x, y, len, th, rot, a, b) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot)
      rrect(ctx, -len / 2, -th / 2, len, th, th / 2)
      const g = ctx.createLinearGradient(0, -th / 2, 0, th / 2)
      g.addColorStop(0, a); g.addColorStop(1, b)
      ctx.fillStyle = g; ctx.fill()
      ctx.strokeStyle = 'rgba(30,15,5,0.85)'; ctx.lineWidth = 1.2; ctx.stroke()
      ctx.strokeStyle = 'rgba(30,15,5,0.35)'; ctx.lineWidth = 0.8
      for (let i = 0; i < 4; i++) {
        const gx = -len / 2 + 5 + i * (len / 4.2)
        ctx.beginPath(); ctx.moveTo(gx, -th / 2 + 1.5); ctx.lineTo(gx + 3, th / 2 - 1.5); ctx.stroke()
      }
      ctx.restore()
    }
    fillEll(ctx, P.shadow, 2, 4, 28, 7)
    log(4, 4, 44, 7, 0.28, P.logC, P.logB)
    log(-2, 1, 52, 8.5, -0.06, P.logA, P.logB)

    // twig with leaves
    ctx.strokeStyle = P.logB; ctx.lineWidth = 1.6; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(18, -1); ctx.lineTo(30, -8); ctx.moveTo(25, -5); ctx.lineTo(31, -1); ctx.stroke()
    for (const [lx, ly, a] of [[30, -9, -0.6], [33, -4, 0.4], [27, -9, -1.2], [32, -1, 0.9]]) {
      fillEll(ctx, P.night ? '#2f6a28' : '#68b83e', lx, ly, 3.4, 1.7, a)
    }

    // torn plastic bag snagged on the raft
    ctx.beginPath()
    ctx.moveTo(-24, -1); ctx.quadraticCurveTo(-30, -9, -20, -8); ctx.quadraticCurveTo(-14, -6, -12, 2)
    ctx.quadraticCurveTo(-18, 7, -26, 4); ctx.closePath()
    ctx.fillStyle = 'rgba(235,240,255,0.72)'; ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1; ctx.stroke()
    ctx.strokeStyle = 'rgba(100,120,170,0.45)'; ctx.lineWidth = 0.8
    ctx.beginPath(); ctx.moveTo(-23, 0); ctx.lineTo(-16, -4); ctx.moveTo(-22, 3); ctx.lineTo(-15, 1); ctx.stroke()
    ctx.restore()
  }

  _drawPaws(ctx, r, t, panic) {
    const fur = r.kind === 'deer' ? '#c07840' : r.kind === 'fox' ? '#d96d28' : '#b8b0ae'
    const pad = r.kind === 'fox' ? '#2a1308' : r.kind === 'deer' ? '#5a3216' : '#f0a8b0'
    const wave = (ph) => Math.max(0, Math.sin(t * 4.5 * panic + r.ph + ph))
    ctx.save()
    ctx.scale(1.1, 1.1)
    for (const [s, ph] of [[-1, 0], [1, 2.1]]) {
      const lift = wave(ph) * 9
      const px = s * (10 + wave(ph) * 3), py = 8 - lift
      ctx.strokeStyle = fur; ctx.lineWidth = 4.6; ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(s * 7, 1); ctx.lineTo(px, py); ctx.stroke()
      fillEll(ctx, fur, px, py, 3.4, 3.2)
      fillEll(ctx, pad, px, py + 0.4, 1.6, 1.4)
      if (lift > 6) {
        ctx.fillStyle = 'rgba(210,240,255,0.9)'
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(px + (i - 1) * 3.2, py - 4 - i % 2 * 2.4, 1, 0, TAU); ctx.fill() }
      }
    }
    ctx.restore()
  }

  // ── Boat ──────────────────────────────────────────────────────────────────────

  _hull(ctx, sx = 1, sy = 1, oy = 0) {
    ctx.beginPath()
    ctx.moveTo(0, -31 * sy + oy)
    ctx.bezierCurveTo(9 * sx, -26 * sy + oy, 17 * sx, -12 * sy + oy, 17 * sx, 2 * sy + oy)
    ctx.lineTo(16 * sx, 20 * sy + oy)
    ctx.quadraticCurveTo(15 * sx, 28 * sy + oy, 8 * sx, 28 * sy + oy)
    ctx.lineTo(-8 * sx, 28 * sy + oy)
    ctx.quadraticCurveTo(-15 * sx, 28 * sy + oy, -16 * sx, 20 * sy + oy)
    ctx.lineTo(-17 * sx, 2 * sy + oy)
    ctx.bezierCurveTo(-17 * sx, -12 * sy + oy, -9 * sx, -26 * sy + oy, 0, -31 * sy + oy)
    ctx.closePath()
  }

  _drawBoat(ctx, P, t) {
    const bx = this.boat.x * this.width
    const by = this.boat.y * this.height
    const bob = Math.sin(t * 2.3) * 0.9
    const lean = clamp(this.boat.vx / BOAT_SPEED, -1, 1)

    ctx.save()
    ctx.translate(bx, by + bob)
    ctx.rotate(lean * 0.14)

    // headlight cone at night
    if (P.night) {
      const g = ctx.createLinearGradient(0, -30, 0, -160)
      g.addColorStop(0, 'rgba(255,240,180,0.38)'); g.addColorStop(1, 'rgba(255,240,180,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.moveTo(-4, -30); ctx.lineTo(-52, -160); ctx.lineTo(52, -160); ctx.lineTo(4, -30); ctx.closePath(); ctx.fill()
    }

    // shadow + waterline foam
    ctx.save(); ctx.translate(5, 7); ctx.globalAlpha = 0.3
    this._hull(ctx, 1.06, 1.03); ctx.fillStyle = '#000a1e'; ctx.fill(); ctx.restore()
    this._hull(ctx, 1.12, 1.07)
    ctx.strokeStyle = P.foam; ctx.lineWidth = 3
    ctx.globalAlpha = 0.5 + Math.sin(t * 3) * 0.12; ctx.stroke(); ctx.globalAlpha = 1

    // propeller wash
    for (let i = 0; i < 3; i++) {
      const f = (t * 3 + i / 3) % 1
      ctx.globalAlpha = (1 - f) * 0.55
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4
      ell(ctx, Math.sin(t * 9 + i) * 2, 35 + f * 9, 4 + f * 6, 2.6 + f * 2.4); ctx.stroke()
    }
    ctx.globalAlpha = 1

    this._drawNet(ctx, t)

    // hull
    this._hull(ctx)
    const hg = ctx.createLinearGradient(-17, 0, 17, 0)
    hg.addColorStop(0, '#4f9f44'); hg.addColorStop(0.45, '#86d65e'); hg.addColorStop(1, '#2f7a34')
    ctx.fillStyle = hg; ctx.fill()
    ctx.strokeStyle = '#17491f'; ctx.lineWidth = 2; ctx.stroke()
    this._hull(ctx, 0.94, 0.95, -0.3)
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1.3; ctx.stroke()

    // wooden deck
    this._hull(ctx, 0.82, 0.85, -0.4)
    const dg = ctx.createLinearGradient(-14, 0, 14, 0)
    dg.addColorStop(0, '#e6c78e'); dg.addColorStop(1, '#c49a5a')
    ctx.fillStyle = dg; ctx.fill()
    ctx.save(); this._hull(ctx, 0.82, 0.85, -0.4); ctx.clip()
    ctx.strokeStyle = 'rgba(90,55,20,0.35)'; ctx.lineWidth = 0.9
    for (let y = -28; y < 28; y += 5.5) { ctx.beginPath(); ctx.moveTo(-16, y); ctx.lineTo(16, y); ctx.stroke() }
    ctx.restore()

    // collection bin — fills with what you've scooped
    rrect(ctx, -9.5, -17, 19, 15, 3)
    ctx.fillStyle = '#1f3a2c'; ctx.fill()
    const n = Math.min(this.loadCount, 9)
    for (let i = 0; i < n; i++) {
      const cx = -6 + (i % 3) * 6 + (sr(i * 3.1) - 0.5) * 1.6
      const cy = -13.5 + Math.floor(i / 3) * 4.6
      fillEll(ctx, BIN_COLORS[i % BIN_COLORS.length], cx, cy, 2.6, 2.1, i)
      fillEll(ctx, 'rgba(255,255,255,0.6)', cx - 0.8, cy - 0.7, 0.8, 0.6)
    }
    rrect(ctx, -9.5, -17, 19, 15, 3)
    ctx.strokeStyle = '#e8efe4'; ctx.lineWidth = 1.8; ctx.stroke()

    // cabin
    rrect(ctx, -11, 5, 22, 17, 4)
    const cg = ctx.createLinearGradient(-11, 0, 11, 0)
    cg.addColorStop(0, '#ffffff'); cg.addColorStop(1, '#d4ddd0')
    ctx.fillStyle = cg; ctx.fill()
    ctx.strokeStyle = '#7fa07c'; ctx.lineWidth = 1.2; ctx.stroke()
    rrect(ctx, -9, 4.4, 18, 3.8, 1.8)
    const wg = ctx.createLinearGradient(-9, 0, 9, 0)
    wg.addColorStop(0, '#b6e4ff'); wg.addColorStop(1, '#6ab8e8')
    ctx.fillStyle = wg; ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(-6, 5.2); ctx.lineTo(-2, 5.2); ctx.stroke()
    // roof emblem
    fillEll(ctx, '#3a9b3a', 0, 14, 5.2, 5.2)
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.3
    ctx.beginPath(); ctx.arc(0, 14, 2.6, 0.4, TAU - 1.0); ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.moveTo(1.7, 11); ctx.lineTo(4.4, 12.4); ctx.lineTo(1.2, 13.4); ctx.closePath(); ctx.fill()
    // beacon
    const bl = 0.5 + 0.5 * Math.sin(t * 6)
    const bgl = ctx.createRadialGradient(0, 19.5, 0, 0, 19.5, 6)
    bgl.addColorStop(0, `rgba(255,170,40,${0.7 * bl})`); bgl.addColorStop(1, 'rgba(255,170,40,0)')
    ctx.fillStyle = bgl; ctx.beginPath(); ctx.arc(0, 19.5, 6, 0, TAU); ctx.fill()
    fillEll(ctx, '#ff9a1f', 0, 19.5, 1.7, 1.7)

    // fenders
    for (const s of [-1, 1]) {
      rrect(ctx, s * 17.5 - 2, -5, 4, 22, 2)
      ctx.fillStyle = '#ff9a3c'; ctx.fill()
      ctx.strokeStyle = '#a85a14'; ctx.lineWidth = 1; ctx.stroke()
    }
    // outboard + headlight
    rrect(ctx, -4, 26, 8, 8, 2); ctx.fillStyle = '#3b4551'; ctx.fill()
    fillEll(ctx, '#ffe9a0', 0, -27, 1.9, 1.9)
    ctx.restore()
  }

  _drawNet(ctx, t) {
    const sw = Math.sin(t * 2.6) * 1.5
    ctx.save()
    ctx.lineCap = 'round'
    // arms
    ctx.strokeStyle = '#d9e2e8'; ctx.lineWidth = 2.4
    ctx.beginPath()
    ctx.moveTo(-12, -20); ctx.lineTo(-21 + sw, -45)
    ctx.moveTo(12, -20); ctx.lineTo(21 + sw, -45)
    ctx.stroke()
    // mesh
    ctx.beginPath()
    ctx.moveTo(-12, -22); ctx.lineTo(-21 + sw, -45); ctx.lineTo(21 + sw, -45); ctx.lineTo(12, -22); ctx.closePath()
    ctx.fillStyle = 'rgba(20,60,45,0.30)'; ctx.fill()
    ctx.save(); ctx.clip()
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 0.9
    for (let k = -3; k <= 3; k++) {
      ctx.beginPath(); ctx.moveTo(k * 4, -22); ctx.lineTo(k * 6.4 + sw, -45); ctx.stroke()
    }
    for (const y of [-29, -36, -43]) {
      ctx.beginPath(); ctx.moveTo(-24 + sw * 0.5, y + Math.sin(t * 3 + y) * 0.6); ctx.lineTo(24 + sw * 0.5, y + Math.sin(t * 3 + y) * 0.6); ctx.stroke()
    }
    ctx.restore()
    // floater bar + buoys
    ctx.strokeStyle = '#ff8a3d'; ctx.lineWidth = 2.8
    ctx.beginPath(); ctx.moveTo(-21 + sw, -45); ctx.lineTo(21 + sw, -45); ctx.stroke()
    for (const s of [-1, 1]) {
      fillEll(ctx, '#ff8a3d', s * 21 + sw, -45, 3.8, 3.8)
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.arc(s * 21 + sw, -45, 2.4, 0, TAU); ctx.stroke()
    }
    // bow wave curling off the floater
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.6
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(s * 22 + sw, -45); ctx.quadraticCurveTo(s * 30, -34, s * 30, -14); ctx.stroke()
    }
    ctx.restore()
  }

  // ── Atmosphere ────────────────────────────────────────────────────────────────

  _drawAtmosphere(ctx, P, t) {
    const W = this.width, H = this.height
    const bw = this._bankW()

    // drifting light shafts (day) / faint moon shafts (night)
    ctx.save()
    ctx.beginPath(); ctx.rect(bw, 0, W - bw * 2, H); ctx.clip()
    const beams = [[0.18, 0.12, 0.06], [0.5, 0.18, 0.045], [0.8, 0.1, 0.055]]
    beams.forEach(([x, w, a], i) => {
      const sx = bw + (W - bw * 2) * x + Math.sin(t * 0.2 + i * 2) * 22
      const bwid = (W - bw * 2) * w
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, `rgba(255,255,255,${P.night ? a * 0.5 : a})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.moveTo(sx, 0); ctx.lineTo(sx + bwid, 0); ctx.lineTo(sx + bwid - 160, H); ctx.lineTo(sx - 160, H)
      ctx.closePath(); ctx.fill()
    })
    ctx.restore()

    // distance haze at the top, so the river feels like it continues
    const hz = ctx.createLinearGradient(0, 0, 0, H * 0.16)
    hz.addColorStop(0, P.haze); hz.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = hz; ctx.fillRect(0, 0, W, H * 0.16)

    // vignette
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, Math.max(W, H) * 0.75)
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, P.vignette)
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)
  }

  // ── Nearest rescuable distance ─────────────────────────────────────────────

  nearestRescueDistance() {
    if (!this.rescuables.length) return Infinity
    const bx = this.boat.x * this.width
    const by = this.boat.y * this.height
    let min = Infinity
    for (const r of this.rescuables) {
      if (r.rescued) continue
      const d = Math.hypot(bx - r.x, by - r.y)
      if (d < min) min = d
    }
    return min
  }

  // ── Start / stop ──────────────────────────────────────────────────────────────

  _resetWorld(ambient = false) {
    this.time = 0
    this._dist = 0
    this._shake = 0
    this.loadCount = 0
    this.boat = { x: 0.5, y: 0.6, vx: 0, vy: 0 }
    this.garbage = []; this.obstacles = []; this.wildlife = []
    this.rescuables = []; this.particles = []; this.ripples = []; this.boatWake = []
    this._flashAlpha = 0
    this._wakeTimer = 0
    if (ambient) {
      this._garbageTimer = 0.2
      this._obstacleTimer = 1.5
      this._wildlifeTimer = 1.2
      this._rescueTimer = 2.5
    } else {
      this._garbageTimer = 1.2
      this._obstacleTimer = 2.5
      this._wildlifeTimer = 3.0
      this._rescueTimer = 10
    }
  }

  // Fill the start screen with a few seconds of river so it isn't empty
  _prewarm() {
    const was = this.running
    this.running = false
    for (let i = 0; i < 150; i++) this.update(0.05, {}, 0)
    this.running = was
  }

  start() {
    this._resetWorld(false)
    this.running = true
  }

  stop() { this.running = false }
}