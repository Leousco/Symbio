// ─── Guess the Animal — ambient jungle canvas engine ─────────────────────────
// Draws a layered jungle background: sky gradient, distant haze, mid-ground
// foliage, foreground leaves, drifting fireflies, and a subtle vignette.
// The React component owns all game logic; this file owns only the visual scene.

const TAU = Math.PI * 2
const rand  = (lo, hi) => lo + Math.random() * (hi - lo)
const lerp  = (a, b, t) => a + (b - a) * t
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// ─── Colour palettes ──────────────────────────────────────────────────────────

const DAY = {
  skyTop:    '#1a3a1f',
  skyMid:    '#2d5a1b',
  skyBot:    '#4a7c35',
  hazeFar:   'rgba(60,100,40,0.35)',
  hazeMid:   'rgba(30,70,20,0.30)',
  treeFar:   '#1e4a18',
  treeMid:   '#1a3f14',
  treeFront: '#0f2a0a',
  leafLight: '#2d6b1a',
  leafDark:  '#163810',
  ground:    '#0d1f0a',
  firefly:   '#c8f060',
  fogBot:    'rgba(20,50,10,0.55)',
  vignette:  0.42,
}

const NIGHT = {
  skyTop:    '#0a1c2c',
  skyMid:    '#12324a',
  skyBot:    '#1d4636',
  hazeFar:   'rgba(26,64,44,0.55)',
  hazeMid:   'rgba(16,46,32,0.48)',
  treeFar:   '#123a1e',
  treeMid:   '#0e2b16',
  treeFront: '#081e12',
  leafLight: '#22692a',
  leafDark:  '#12381a',
  ground:    '#081d12',
  firefly:   '#ddff86',
  fogBot:    'rgba(8,26,16,0.60)',
  vignette:  0.32,
}

// ─── Pseudo-random helpers ────────────────────────────────────────────────────

function seededRand(seed) {
  const v = Math.sin(seed * 9301 + 49297) * 233280
  return v - Math.floor(v)
}

// ─── Tree silhouette drawing ──────────────────────────────────────────────────

function drawTree(ctx, x, groundY, height, spread, fill) {
  // Trunk
  const trunkW = spread * 0.06
  ctx.fillStyle = fill
  ctx.fillRect(x - trunkW / 2, groundY - height * 0.25, trunkW, height * 0.3)

  // Layered canopy with 3-4 overlapping ovals for a jungle silhouette look
  const layers = 4
  for (let i = 0; i < layers; i++) {
    const t    = i / (layers - 1)
    const cx   = x + (seededRand(x * 0.01 + i) - 0.5) * spread * 0.35
    const cy   = groundY - height * (0.35 + t * 0.5)
    const rx   = spread * (0.42 - t * 0.1) * (0.85 + seededRand(x * 0.03 + i) * 0.3)
    const ry   = height * (0.18 + seededRand(x * 0.07 + i) * 0.14)
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU)
    ctx.fill()
  }
}

function drawPalmTree(ctx, x, groundY, height, spread, fill) {
  // Curved trunk
  ctx.strokeStyle = fill
  ctx.lineWidth = spread * 0.07
  ctx.lineCap   = 'round'
  ctx.beginPath()
  ctx.moveTo(x, groundY)
  const lean = (seededRand(x * 0.02) - 0.4) * 60
  ctx.quadraticCurveTo(x + lean * 0.4, groundY - height * 0.5, x + lean, groundY - height)
  ctx.stroke()
  const topX = x + lean
  const topY = groundY - height

  // Palm fronds — 7 arching lines from crown
  const fronds = 7
  for (let i = 0; i < fronds; i++) {
    const angle  = -Math.PI * 0.95 + (i / (fronds - 1)) * Math.PI * 1.1
    const length = spread * (0.55 + seededRand(x * 0.05 + i) * 0.45)
    const cp1x   = topX + Math.cos(angle) * length * 0.4
    const cp1y   = topY + Math.sin(angle) * length * 0.3 + 10
    const ep     = { x: topX + Math.cos(angle) * length, y: topY + Math.sin(angle) * length + 20 }
    ctx.lineWidth = spread * 0.025 * (1 - i / fronds * 0.4)
    ctx.beginPath()
    ctx.moveTo(topX, topY)
    ctx.quadraticCurveTo(cp1x, cp1y, ep.x, ep.y)
    ctx.stroke()
  }
}

// ─── Leaf overlay ─────────────────────────────────────────────────────────────

function drawLeafEdge(ctx, width, groundY, palette, side, t) {
  const xs = side === 'left' ? 0 : width
  const dir = side === 'left' ? 1 : -1
  const count = 7

  for (let i = 0; i < count; i++) {
    const seed   = i * 13.7 + (side === 'left' ? 0 : 100)
    const y      = (groundY * 0.1) + seededRand(seed) * groundY * 0.75
    const len    = width * (0.12 + seededRand(seed + 1) * 0.12)
    const angle  = dir * (0.3 + seededRand(seed + 2) * 0.6) + Math.sin(t * 0.4 + i) * 0.04
    const sway   = Math.sin(t * 0.6 + i * 1.4) * 4

    ctx.save()
    ctx.translate(xs + sway * dir, y)
    ctx.rotate(angle)
    ctx.fillStyle = i % 2 === 0 ? palette.leafLight : palette.leafDark
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(len * 0.3, -len * 0.15, len * 0.7, -len * 0.1, len, 0)
    ctx.bezierCurveTo(len * 0.7, len * 0.1, len * 0.3, len * 0.15, 0, 0)
    ctx.fill()
    ctx.restore()
  }
}

// ─── Firefly particles ────────────────────────────────────────────────────────

function makeFirefly(width, groundY) {
  return {
    x:     rand(width * 0.05, width * 0.95),
    y:     rand(groundY * 0.1, groundY * 0.85),
    vx:    rand(-18, 18),
    vy:    rand(-12, 12),
    phase: rand(0, TAU),
    speed: rand(0.4, 1.2),
    size:  rand(1.5, 3),
    life:  rand(2, 6),
    max:   8,
    age:   0,
  }
}

// ─── Stars (night only) ───────────────────────────────────────────────────────

function makeStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    x:    seededRand(i * 3.14) ,
    y:    seededRand(i * 7.72) * 0.65,
    r:    0.5 + seededRand(i * 11.1) * 1.2,
    blink: seededRand(i * 5.5) * TAU,
  }))
}

// ─── Engine class ─────────────────────────────────────────────────────────────

export default class GuessTheAnimalEngine {
  constructor() {
    this.width     = 0
    this.height    = 0
    this.time      = 0
    this.fireflies = []
    this.stars     = makeStars(60)

    // Static tree layout seeds (recomputed in setSize)
    this.trees = []
  }

  setSize(width, height) {
    this.width  = width
    this.height = height
    this._buildTrees()
    // Seed initial fireflies
    if (this.fireflies.length === 0) {
      const count = Math.round(width * height / 14000)
      for (let i = 0; i < count; i++) {
        this.fireflies.push(makeFirefly(width, this._groundY()))
      }
    }
  }

  _groundY() {
    return this.height * 0.88
  }

  _buildTrees() {
    const { width, height } = this
    const groundY = this._groundY()
    this.trees = []

    // Far layer — small, many
    const farCount = Math.ceil(width / 55)
    for (let i = 0; i < farCount; i++) {
      const x = (i / farCount) * width + seededRand(i * 2.1) * (width / farCount)
      this.trees.push({ layer: 0, x, groundY: groundY + 10, height: height * (0.22 + seededRand(i * 3.3) * 0.14), spread: 60 + seededRand(i * 7.7) * 50, palm: seededRand(i * 11) > 0.75 })
    }
    // Mid layer
    const midCount = Math.ceil(width / 80)
    for (let i = 0; i < midCount; i++) {
      const x = (i / midCount) * width + seededRand(i * 4.2 + 1) * (width / midCount)
      this.trees.push({ layer: 1, x, groundY: groundY + 4, height: height * (0.30 + seededRand(i * 5.1) * 0.18), spread: 90 + seededRand(i * 8.3) * 65, palm: seededRand(i * 9.1) > 0.68 })
    }
    // Front layer — large, sparse
    const frontCount = Math.ceil(width / 140)
    for (let i = 0; i < frontCount; i++) {
      const x = (i / frontCount) * width + seededRand(i * 6.3 + 2) * (width / frontCount)
      this.trees.push({ layer: 2, x, groundY, height: height * (0.42 + seededRand(i * 9.9) * 0.22), spread: 130 + seededRand(i * 12.1) * 90, palm: seededRand(i * 7.3) > 0.60 })
    }
  }

  update(dt) {
    const step = clamp(dt, 0, 0.05)
    this.time += step

    const groundY = this._groundY()
    // Update fireflies
    for (let i = this.fireflies.length - 1; i >= 0; i--) {
      const f = this.fireflies[i]
      f.age += step
      f.x   += f.vx * step + Math.sin(this.time * f.speed + f.phase) * 12 * step
      f.y   += f.vy * step + Math.cos(this.time * f.speed * 0.7 + f.phase) * 8 * step

      // Soft boundary reflection
      if (f.x < 0 || f.x > this.width)   f.vx *= -1
      if (f.y < 0 || f.y > groundY * 0.9) f.vy *= -1
      f.x = clamp(f.x, 0, this.width)
      f.y = clamp(f.y, 0, groundY)

      if (f.age > f.max) {
        this.fireflies[i] = makeFirefly(this.width, groundY)
      }
    }

    // Keep firefly count correct after resize
    const targetCount = Math.max(6, Math.round(this.width * this.height / 14000))
    while (this.fireflies.length < targetCount) this.fireflies.push(makeFirefly(this.width, groundY))
    while (this.fireflies.length > targetCount + 2) this.fireflies.pop()
  }

  draw(ctx, options = {}) {
    if (!this.width || !this.height) return
    const { dark = false, reduceMotion = false } = options
    const P = dark ? NIGHT : DAY
    const t = reduceMotion ? 0 : this.time

    this._drawSky(ctx, P)
    if (dark) this._drawStars(ctx, t)
    this._drawHaze(ctx, P)
    this._drawTrees(ctx, P, t)
    this._drawGround(ctx, P)
    this._drawLeaves(ctx, P, t)
    this._drawFireflies(ctx, P, t, reduceMotion, dark)
    this._drawVignette(ctx, P)
  }

  _drawSky(ctx, P) {
    const grad = ctx.createLinearGradient(0, 0, 0, this.height)
    grad.addColorStop(0,    P.skyTop)
    grad.addColorStop(0.55, P.skyMid)
    grad.addColorStop(1,    P.skyBot)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, this.width, this.height)
  }

  _drawStars(ctx, t) {
    ctx.save()
    this.stars.forEach((s) => {
      const alpha = 0.4 + Math.sin(t * 0.9 + s.blink) * 0.3
      ctx.globalAlpha = clamp(alpha, 0.1, 0.9)
      ctx.fillStyle = '#e8f0ff'
      ctx.beginPath()
      ctx.arc(s.x * this.width, s.y * this.height, s.r, 0, TAU)
      ctx.fill()
    })
    ctx.globalAlpha = 1
    ctx.restore()
  }

  _drawHaze(ctx, P) {
    const groundY = this._groundY()
    // Far haze strip
    const h1 = ctx.createLinearGradient(0, groundY * 0.3, 0, groundY * 0.6)
    h1.addColorStop(0, 'rgba(0,0,0,0)')
    h1.addColorStop(0.5, P.hazeFar)
    h1.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = h1
    ctx.fillRect(0, 0, this.width, this.height)

    // Mid haze strip
    const h2 = ctx.createLinearGradient(0, groundY * 0.5, 0, groundY * 0.78)
    h2.addColorStop(0, 'rgba(0,0,0,0)')
    h2.addColorStop(0.5, P.hazeMid)
    h2.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = h2
    ctx.fillRect(0, 0, this.width, this.height)
  }

  _drawTrees(ctx, P, t) {
    const fills = [P.treeFar, P.treeMid, P.treeFront]
    // Draw back-to-front by layer
    for (let layer = 0; layer < 3; layer++) {
      const fill = fills[layer]
      ctx.fillStyle  = fill
      ctx.strokeStyle = fill
      this.trees
        .filter((tr) => tr.layer === layer)
        .forEach((tr) => {
          // Slight wind sway for mid and front trees
          const sway = layer > 0 ? Math.sin(t * 0.5 + tr.x * 0.01) * (layer * 1.5) : 0
          ctx.save()
          ctx.translate(sway, 0)
          if (tr.palm) {
            drawPalmTree(ctx, tr.x, tr.groundY, tr.height, tr.spread, fill)
          } else {
            drawTree(ctx, tr.x, tr.groundY, tr.height, tr.spread, fill)
          }
          ctx.restore()
        })
    }
  }

  _drawGround(ctx, P) {
    const groundY = this._groundY()
    const grad = ctx.createLinearGradient(0, groundY, 0, this.height)
    grad.addColorStop(0, P.ground)
    grad.addColorStop(1, '#000000')
    ctx.fillStyle = grad
    ctx.fillRect(0, groundY, this.width, this.height - groundY)
  }

  _drawLeaves(ctx, P, t) {
    const groundY = this._groundY()
    drawLeafEdge(ctx, this.width, groundY, P, 'left',  t)
    drawLeafEdge(ctx, this.width, groundY, P, 'right', t)
  }

  _drawFireflies(ctx, P, t, reduceMotion, dark) {
    if (reduceMotion) return
    ctx.save()
    // At night the swarm is the star of the scene: additive blending plus a
    // wider, brighter halo makes the fireflies pop out of the dark jungle.
    if (dark) ctx.globalCompositeOperation = 'lighter'
    const glowRadius = dark ? 7 : 5
    this.fireflies.forEach((f) => {
      const flicker = 0.5 + Math.sin(t * 3 + f.phase) * 0.5
      const fade    = Math.min(f.age / 0.8, 1) * Math.min((f.max - f.age) / 1.5, 1)
      const alpha   = clamp(flicker * fade * (dark ? 1 : 0.9), 0, 1)

      ctx.globalAlpha = alpha
      // Glow halo
      const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * glowRadius)
      glow.addColorStop(0, P.firefly)
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.size * glowRadius, 0, TAU)
      ctx.fill()
      // Bright core
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.size * (dark ? 0.85 : 0.6), 0, TAU)
      ctx.fill()
    })
    ctx.globalAlpha = 1
    ctx.restore()
  }

  _drawVignette(ctx, P) {
    const { width, height } = this
    // Bottom fog
    const fog = ctx.createLinearGradient(0, height * 0.75, 0, height)
    fog.addColorStop(0, 'rgba(0,0,0,0)')
    fog.addColorStop(1, P.fogBot)
    ctx.fillStyle = fog
    ctx.fillRect(0, 0, width, height)

    // Edge vignette
    const vig = ctx.createRadialGradient(width/2, height/2, height*0.25, width/2, height/2, height*0.9)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, `rgba(0,0,0,${P.vignette})`)
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, width, height)
  }
}
