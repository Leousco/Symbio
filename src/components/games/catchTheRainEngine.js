// Simulation + canvas renderer for the Catch the Rain mini game.
// The React component owns the HUD and screen overlays; this file owns the
// world: rain, the potted plant, health, growth stages, splashes and particles.

const TAU = Math.PI * 2

export const START_HEALTH = 75
const MAX_HEALTH = 100
const CATCH_HEAL = 4
const MISS_DAMAGE = 8
const LEVEL_SECONDS = 20
const PLAYER_SPEED = 430

// Score needed for each visual growth stage (0 = sprout, 5 = lush + flowers).
const GROWTH_STEPS = [0, 6, 14, 24, 36, 50]

const hash = (n) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return v - Math.floor(v)
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const lerp = (a, b, t) => a + (b - a) * t
const rand = (min, max) => min + Math.random() * (max - min)

function growthStage(score) {
  let stage = 0
  for (let i = 0; i < GROWTH_STEPS.length; i += 1) {
    if (score >= GROWTH_STEPS[i]) stage = i
  }
  return stage
}

function quadPoint(p0, p1, p2, t) {
  const u = 1 - t
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

function hexToRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16)
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

// Blend two hex colours so the leaves can shift from green to dry brown.
function mixColor(from, to, amount) {
  const t = clamp(amount, 0, 1)
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  return `rgb(${Math.round(lerp(a.r, b.r, t))} ${Math.round(lerp(a.g, b.g, t))} ${Math.round(lerp(a.b, b.b, t))})`
}

function parseColor(color) {
  if (color[0] === '#') return hexToRgb(color)
  const [r, g, b] = color.match(/\d+/g).map(Number)
  return { r, g, b }
}

function shade(color, target, amount) {
  const a = parseColor(color)
  const b = hexToRgb(target)
  const t = clamp(amount, 0, 1)
  return `rgb(${Math.round(lerp(a.r, b.r, t))} ${Math.round(lerp(a.g, b.g, t))} ${Math.round(lerp(a.b, b.b, t))})`
}

function plantPalette(health, tint) {
  const dry = clamp(1 - health / 58, 0, 1)
  return {
    stem: tint(mixColor('#2f7d3a', '#7c6338', dry)),
    stemLight: tint(mixColor('#67b96a', '#a68a51', dry)),
    leaf: tint(mixColor('#3f9b4b', '#a3833f', dry)),
    leafDark: tint(mixColor('#25632e', '#6e5730', dry)),
    leafVein: tint(mixColor('#8ed389', '#c6ac73', dry)),
  }
}

const DAY = {
  sky: ['#cfe7f1', '#e4f1e4', '#f7f9ed'],
  cloud: 'rgba(255, 255, 255, 0.62)',
  cloudDark: 'rgba(146, 174, 189, 0.4)',
  cloudGlow: 'rgba(255, 255, 255, 0.5)',
  hillBack: '#b9dcb2',
  hillFront: '#93c68b',
  ground: ['#7b5b42', '#55402f'],
  grass: '#4f9350',
  rainFar: 'rgba(95, 150, 185, 0.2)',
  rainMid: 'rgba(70, 130, 175, 0.28)',
  rainNear: 'rgba(55, 120, 175, 0.34)',
  ripple: 'rgba(238, 249, 255, 0.85)',
  puddle: 'rgba(77, 145, 183, 0.22)',
  vignette: 'rgba(20, 46, 35, 0.12)',
}

const NIGHT = {
  sky: ['#0a1226', '#15263f', '#1d3a3d'],
  cloud: 'rgba(186, 214, 255, 0.1)',
  cloudDark: 'rgba(28, 46, 76, 0.55)',
  cloudGlow: 'rgba(120, 170, 255, 0.2)',
  hillBack: '#142c35',
  hillFront: '#193a36',
  ground: ['#241f2e', '#131220'],
  grass: '#2c6a4a',
  rainFar: 'rgba(150, 190, 240, 0.11)',
  rainMid: 'rgba(160, 200, 250, 0.17)',
  rainNear: 'rgba(180, 214, 255, 0.26)',
  ripple: 'rgba(190, 225, 255, 0.55)',
  puddle: 'rgba(125, 211, 252, 0.16)',
  vignette: 'rgba(2, 4, 12, 0.5)',
}

export default class CatchTheRainEngine {
  constructor() {
    this.width = 0
    this.height = 0
    this.state = 'idle'
    this.onEvent = null
    this.time = 0
    this.player = { x: 0, vx: 0 }

    this.health = START_HEALTH
    this.score = 0
    this.missed = 0
    this.elapsed = 0
    this.level = 1
    this.spawnTimer = 0.7
    this.ambientTimer = 0.2
    this.volleyCarry = 0
    this.drops = []
    this.particles = []
    this.floaters = []
    this.rings = []
    this.puddles = []
    this.shake = 0
    this.isDark = false
    this.flash = { target: '#ffffff', life: 0, max: 0.3, peak: 0.7 }
  }

  emit(event) {
    if (this.onEvent) this.onEvent(event)
  }

  setSize(width, height) {
    this.width = width
    this.height = height
    if (!this.player.x) this.player.x = width / 2
    this.player.x = clamp(this.player.x, this.margin, this.width - this.margin)
    this.drops.forEach((drop) => {
      drop.x = clamp(drop.x, 12, this.width - 12)
    })
  }

  get margin() {
    return 62
  }

  start() {
    this.health = START_HEALTH
    this.score = 0
    this.missed = 0
    this.elapsed = 0
    this.level = 1
    this.spawnTimer = 0.7
    this.ambientTimer = 0.2
    this.volleyCarry = 0
    this.drops = []
    this.particles = []
    this.floaters = []
    this.rings = []
    this.puddles = []
    this.shake = 0
    this.flash.life = 0
    this.player.x = this.width / 2
    this.player.vx = 0
    this.state = 'running'
    this.emit({ type: 'start' })
  }

  pause() {
    if (this.state !== 'running') return
    this.state = 'paused'
    this.emit({ type: 'pause' })
  }

  resume() {
    if (this.state !== 'paused') return
    this.state = 'running'
    this.emit({ type: 'resume' })
  }

  update(dt, input) {
    const step = clamp(dt, 0, 0.05)
    if (this.state === 'paused') return

    this.time += step
    this.shake = Math.max(0, this.shake - step * 3.2)

    if (this.state === 'running') {
      this.elapsed += step
      const nextLevel = Math.floor(this.elapsed / LEVEL_SECONDS) + 1
      if (nextLevel !== this.level) {
        this.level = nextLevel
        this.emit({ type: 'level', level: this.level })
      }
      this.updatePlayer(step, input)
      this.updateRain(step)
    } else {
      this.updateAmbientRain(step)
    }

    this.updateParticles(step)
  }

  updatePlayer(dt, input) {
    if (!this.width) return

    if (input.pointerX != null) {
      const target = clamp(input.pointerX, this.margin, this.width - this.margin)
      const previous = this.player.x
      const ease = 1 - Math.exp(-16 * dt)
      this.player.x = lerp(this.player.x, target, ease)
      this.player.vx = (this.player.x - previous) / Math.max(dt, 0.001)
      return
    }

    const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0)
    const targetSpeed = direction * PLAYER_SPEED
    this.player.vx = lerp(this.player.vx, targetSpeed, 1 - Math.exp(-14 * dt))
    this.player.x += this.player.vx * dt

    const minX = this.margin
    const maxX = this.width - this.margin
    if (this.player.x < minX) {
      this.player.x = minX
      this.player.vx = 0
    } else if (this.player.x > maxX) {
      this.player.x = maxX
      this.player.vx = 0
    }
  }

  updateRain(dt) {
    const heightScale = clamp(this.height / 560, 0.75, 1.25)
    // Every level raises both the fall speed and the number of drops.
    const fallSpeed = 160 * Math.pow(1.24, this.level - 1) * heightScale
    const spawnInterval = Math.max(0.12, 0.95 * Math.pow(0.78, this.level - 1))
    const dropsPerVolley = Math.min(6, 1 + (this.level - 1) * 0.55)

    this.spawnTimer -= dt
    if (this.spawnTimer <= 0) {
      // Fractional volley sizes are carried across spawns so the extra drops
      // arrive gradually instead of in one sudden burst.
      this.volleyCarry += dropsPerVolley
      const count = Math.min(6, Math.floor(this.volleyCarry))
      this.volleyCarry -= count
      for (let i = 0; i < count; i += 1) {
        this.spawnDrop(fallSpeed * rand(0.92, 1.08))
      }
      this.spawnTimer = spawnInterval * rand(0.88, 1.12)
    }

    const geometry = this.getGeometry()
    const catchZones = [
      // The leaves are the main target...
      { y: geometry.catchY, half: geometry.catchHalf, kind: 'leaves' },
      // ...but the pot and the soil in it catch drops too.
      { y: geometry.potTop + 9, half: 46, kind: 'soil' },
    ]

    for (let i = this.drops.length - 1; i >= 0; i -= 1) {
      const drop = this.drops[i]
      drop.prevY = drop.y
      drop.y += drop.vy * dt
      drop.x += drop.vx * dt + Math.sin(this.time * 3 + drop.wobble) * 6 * dt

      if (drop.x < 10 || drop.x > this.width - 10) {
        drop.vx *= -1
        drop.x = clamp(drop.x, 10, this.width - 10)
      }

      if (!drop.ambient) {
        // Zone checks use the swept path, so fast drops cannot skip through
        // the leaves or the pot between two frames.
        let caught = null
        for (const zone of catchZones) {
          if (
            drop.prevY <= zone.y + 18 &&
            drop.y >= zone.y - 18 &&
            Math.abs(drop.x - this.player.x) <= zone.half + drop.size * 0.8
          ) {
            caught = zone
            break
          }
        }
        if (caught) {
          this.catchDrop(i, caught)
          continue
        }
      }

      if (drop.y >= geometry.groundY - 4) {
        if (drop.ambient) {
          this.addSplash(drop.x, geometry.groundY, 3, true)
          this.drops.splice(i, 1)
        } else {
          this.missDrop(i, geometry)
        }
      }
    }
  }

  updateAmbientRain(dt) {
    this.ambientTimer -= dt
    if (this.ambientTimer <= 0) {
      this.ambientTimer = rand(0.42, 0.85)
      this.drops.push({
        x: rand(16, Math.max(17, this.width - 16)),
        y: -12,
        prevY: -12,
        vy: rand(105, 165) * clamp(this.height / 560, 0.75, 1.25),
        vx: rand(-8, 8),
        size: rand(2.6, 4.2),
        wobble: rand(0, TAU),
        phase: rand(0, TAU),
        ambient: true,
      })
    }

    const groundY = this.getGeometry().groundY
    for (let i = this.drops.length - 1; i >= 0; i -= 1) {
      const drop = this.drops[i]
      drop.prevY = drop.y
      drop.y += drop.vy * dt
      drop.x += drop.vx * dt
      if (drop.y >= groundY - 4) {
        this.addSplash(drop.x, groundY, 2, true)
        this.drops.splice(i, 1)
      }
    }
  }

  spawnDrop(baseSpeed) {
    const margin = 22
    this.drops.push({
      x: rand(margin, Math.max(margin + 1, this.width - margin)),
      y: -rand(16, 44),
      prevY: -60,
      vy: baseSpeed * rand(0.84, 1.18),
      vx: rand(-14, 14),
      size: rand(5, 7),
      wobble: rand(0, TAU),
      phase: rand(0, TAU),
      ambient: false,
    })
  }

  catchDrop(index, zone) {
    const drop = this.drops[index]
    this.drops.splice(index, 1)
    this.score += 1
    this.health = Math.min(MAX_HEALTH, this.health + CATCH_HEAL)
    this.flash = { target: '#ffffff', life: 0.32, max: 0.32, peak: 0.75 }

    const catchY = zone.y - 5
    const onSoil = zone.kind === 'soil'
    this.addSplash(drop.x, catchY, onSoil ? 7 : 10, false)
    this.rings.push({ x: drop.x, y: catchY, life: 0.55, max: 0.55 })
    this.floaters.push({
      x: drop.x,
      y: catchY - 18,
      text: '+1',
      life: 0.9,
      max: 0.9,
      color: '#bbf7d0',
      size: 14,
    })

    this.emit({
      type: 'catch',
      score: this.score,
      health: this.health,
      missed: this.missed,
      elapsed: this.elapsed,
    })
  }

  missDrop(index, geometry) {
    const drop = this.drops[index]
    this.drops.splice(index, 1)
    this.missed += 1
    this.health = Math.max(0, this.health - MISS_DAMAGE)
    this.shake = 1
    this.flash = { target: '#ff2d2d', life: 0.45, max: 0.45, peak: 0.7 }

    this.addSplash(drop.x, geometry.groundY, 8, false)
    this.puddles.push({ x: drop.x, radius: rand(9, 17), life: 3.4, max: 3.4 })
    this.floaters.push({
      x: drop.x,
      y: geometry.groundY - 20,
      text: `-${MISS_DAMAGE}`,
      life: 1,
      max: 1,
      color: '#fecaca',
      size: 14,
    })

    this.emit({
      type: 'miss',
      score: this.score,
      health: this.health,
      missed: this.missed,
      elapsed: this.elapsed,
    })

    if (this.health <= 0) {
      this.state = 'over'
      this.emit({
        type: 'gameover',
        score: this.score,
        missed: this.missed,
        elapsed: this.elapsed,
        level: this.level,
      })
    }
  }

  addSplash(x, y, count, soft) {
    for (let i = 0; i < count; i += 1) {
      const angle = rand(-Math.PI * 0.9, -Math.PI * 0.1)
      const speed = rand(35, soft ? 90 : 165)
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed * rand(0.55, 1.2),
        vy: Math.sin(angle) * speed,
        gravity: 420,
        life: rand(0.3, 0.62),
        max: 0.62,
        size: rand(1.8, soft ? 3 : 4),
        tint: Math.random() < 0.35 ? 1 : 0,
      })
    }
  }

  updateParticles(dt) {
    this.flash.life = Math.max(0, this.flash.life - dt)

    this.particles = this.particles.filter((particle) => {
      particle.life -= dt
      if (particle.life <= 0) return false
      particle.vy += particle.gravity * dt
      particle.x += particle.vx * dt
      particle.y += particle.vy * dt
      return true
    })

    this.floaters = this.floaters.filter((floater) => {
      floater.life -= dt
      floater.y -= 30 * dt
      return floater.life > 0
    })

    this.rings = this.rings.filter((ring) => {
      ring.life -= dt
      return ring.life > 0
    })

    this.puddles = this.puddles.filter((puddle) => {
      puddle.life -= dt
      return puddle.life > 0
    })
  }

  getGeometry() {
    const groundY = this.height - clamp(this.height * 0.115, 42, 68)
    const potHeight = 68
    const potTop = groundY - potHeight
    const baseY = potTop + 11
    const stage = growthStage(this.score)
    const healthRatio = clamp(this.health / 100, 0, 1)
    const wilt = clamp(1 - this.health / 55, 0, 1)
    const stemHeight = (64 + stage * 15) * (1 - wilt * 0.5)

    return {
      groundY,
      potHeight,
      potTop,
      baseY,
      stage,
      healthRatio,
      wilt,
      stemHeight,
      catchY: baseY - stemHeight * 0.68,
      catchHalf: 40 + stage * 5.5,
    }
  }

  draw(ctx, options = {}) {
    if (!this.width || !this.height) return

    const { dark = false, reduceMotion = false } = options
    const palette = dark ? NIGHT : DAY
    this.isDark = dark

    ctx.save()
    if (this.shake > 0 && !reduceMotion) {
      const amount = this.shake * this.shake * 7
      ctx.translate(rand(-amount, amount), rand(-amount, amount))
    }

    this.drawSky(ctx, palette)
    this.drawCelestial(ctx, dark, reduceMotion)
    this.drawClouds(ctx, palette, reduceMotion)
    this.drawHills(ctx, palette)
    this.drawDrizzle(ctx, palette, reduceMotion)
    this.drawGround(ctx, palette)
    this.drawRainRipples(ctx, palette, reduceMotion)
    this.drawPuddles(ctx, palette)
    this.drawPlant(ctx)
    this.drawDrops(ctx)
    this.drawRings(ctx)
    this.drawParticles(ctx)
    this.drawFloaters(ctx)
    this.drawVignette(ctx, palette)

    ctx.restore()
  }

  drawSky(ctx, palette) {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height)
    gradient.addColorStop(0, palette.sky[0])
    gradient.addColorStop(0.58, palette.sky[1])
    gradient.addColorStop(1, palette.sky[2])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.width, this.height)

    // A soft glow low on the horizon keeps the scene from feeling flat.
    const glow = ctx.createRadialGradient(
      this.width * 0.72,
      this.height * 0.55,
      0,
      this.width * 0.72,
      this.height * 0.55,
      this.height * 0.7,
    )
    glow.addColorStop(0, palette.cloudGlow)
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, this.width, this.height)
  }

  drawCelestial(ctx, dark, reduceMotion) {
    const t = reduceMotion ? 0 : this.time
    const x = this.width * 0.78
    const y = this.height * 0.2

    ctx.save()
    if (dark) {
      // Moon: cool halo, pale disc, a few craters and a soft shadow edge.
      const halo = ctx.createRadialGradient(x, y, 6, x, y, 96)
      halo.addColorStop(0, 'rgba(214, 232, 255, 0.34)')
      halo.addColorStop(0.45, 'rgba(170, 200, 255, 0.14)')
      halo.addColorStop(1, 'rgba(170, 200, 255, 0)')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(x, y, 96, 0, TAU)
      ctx.fill()

      const body = ctx.createRadialGradient(x - 9, y - 10, 3, x, y, 27)
      body.addColorStop(0, '#fdfefe')
      body.addColorStop(0.55, '#e6edf7')
      body.addColorStop(1, '#c0cce0')
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(x, y, 25, 0, TAU)
      ctx.fill()

      ctx.fillStyle = 'rgba(148, 165, 191, 0.3)'
      ctx.beginPath()
      ctx.arc(x - 7, y - 5, 4.6, 0, TAU)
      ctx.arc(x + 8, y + 4, 3.4, 0, TAU)
      ctx.arc(x - 1, y + 11, 2.4, 0, TAU)
      ctx.arc(x + 10, y - 10, 2, 0, TAU)
      ctx.fill()

      const shade = ctx.createRadialGradient(x + 17, y - 12, 2, x + 15, y - 10, 38)
      shade.addColorStop(0, 'rgba(8, 14, 30, 0.32)')
      shade.addColorStop(1, 'rgba(8, 14, 30, 0)')
      ctx.fillStyle = shade
      ctx.beginPath()
      ctx.arc(x + 7, y - 3, 36, 0, TAU)
      ctx.fill()
    } else {
      // Sun: slow breathing halo behind a warm disc.
      const pulse = 1 + Math.sin(t * 0.7) * 0.03
      const halo = ctx.createRadialGradient(x, y, 10, x, y, 122)
      halo.addColorStop(0, 'rgba(255, 238, 170, 0.72)')
      halo.addColorStop(0.4, 'rgba(255, 225, 140, 0.28)')
      halo.addColorStop(1, 'rgba(255, 220, 130, 0)')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(x, y, 122, 0, TAU)
      ctx.fill()

      const body = ctx.createRadialGradient(x - 8, y - 9, 4, x, y, 34 * pulse)
      body.addColorStop(0, '#fffbe8')
      body.addColorStop(0.6, '#ffe9a3')
      body.addColorStop(1, '#ffd166')
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(x, y, 28 * pulse, 0, TAU)
      ctx.fill()
    }
    ctx.restore()
  }

  drawClouds(ctx, palette, reduceMotion) {
    const t = reduceMotion ? 0 : this.time
    const span = this.width + 280
    const clouds = [
      { x: 0.06, y: 0.16, scale: 1.05, speed: 5, tone: 'pale', phase: 0.4 },
      { x: 0.34, y: 0.1, scale: 0.78, speed: 3.4, tone: 'pale', phase: 2.2 },
      { x: 0.58, y: 0.24, scale: 0.62, speed: 7, tone: 'pale', phase: 4.1 },
      { x: 0.83, y: 0.11, scale: 0.9, speed: 4.2, tone: 'pale', phase: 1.2 },
      { x: 0.16, y: 0.3, scale: 0.7, speed: 6.2, tone: 'storm', phase: 3.4 },
      { x: 0.72, y: 0.32, scale: 0.56, speed: 8, tone: 'storm', phase: 5.3 },
    ]
    const sizeScale = clamp(this.width / 900, 0.7, 1.15)

    ctx.save()
    clouds.forEach((cloud) => {
      const cx = ((cloud.x * span + t * cloud.speed) % span) - 140
      const cy = cloud.y * this.height + Math.sin(t * 0.25 + cloud.phase) * 2
      const fill = cloud.tone === 'storm' ? palette.cloudDark : palette.cloud
      this.drawCloud(ctx, cx, cy, cloud.scale * sizeScale, fill, palette.cloudGlow)
    })
    ctx.restore()
  }

  drawCloud(ctx, cx, cy, s, fill, glow) {
    ctx.save()
    ctx.fillStyle = fill
    ctx.shadowColor = glow
    ctx.shadowBlur = 22 * s
    ctx.beginPath()
    ctx.ellipse(cx - 38 * s, cy + 2 * s, 34 * s, 16 * s, 0, 0, TAU)
    ctx.ellipse(cx - 4 * s, cy - 9 * s, 27 * s, 21 * s, 0, 0, TAU)
    ctx.ellipse(cx + 28 * s, cy + 1 * s, 30 * s, 15 * s, 0, 0, TAU)
    ctx.ellipse(cx + 2 * s, cy + 9 * s, 46 * s, 14 * s, 0, 0, TAU)
    ctx.fill()
    ctx.restore()
  }

  drawHills(ctx, palette) {
    const { groundY } = this.getGeometry()
    const width = this.width

    ctx.fillStyle = palette.hillBack
    ctx.beginPath()
    ctx.moveTo(0, groundY + 2)
    ctx.quadraticCurveTo(width * 0.18, groundY - 92, width * 0.43, groundY - 34)
    ctx.quadraticCurveTo(width * 0.68, groundY - 112, width, groundY - 42)
    ctx.lineTo(width, groundY + 2)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = palette.hillFront
    ctx.beginPath()
    ctx.moveTo(0, groundY + 2)
    ctx.quadraticCurveTo(width * 0.24, groundY - 48, width * 0.52, groundY - 16)
    ctx.quadraticCurveTo(width * 0.78, groundY - 66, width, groundY - 22)
    ctx.lineTo(width, groundY + 2)
    ctx.closePath()
    ctx.fill()
  }

  rainLayers(palette, groundY) {
    const intensity = Math.min(1.6, 1 + (this.level - 1) * 0.12)
    const layers = [
      { spacing: 26, speed: 190, length: 9, thickness: 0.8, color: palette.rainFar, seed: 1.3, ripple: 0 },
      { spacing: 44, speed: 270, length: 14, thickness: 1.1, color: palette.rainMid, seed: 7.7, ripple: 7 },
      { spacing: 80, speed: 380, length: 21, thickness: 1.5, color: palette.rainNear, seed: 13.1, ripple: 11 },
    ]
    return layers.map((layer) => ({
      ...layer,
      count: Math.ceil((this.width / layer.spacing) * intensity),
      cycle: (groundY + layer.length) / layer.speed + 0.45,
    }))
  }

  drawDrizzle(ctx, palette, reduceMotion) {
    const time = reduceMotion ? 0 : this.time
    const { groundY } = this.getGeometry()
    const slant = 0.16

    ctx.save()
    ctx.lineCap = 'round'
    this.rainLayers(palette, groundY).forEach((layer) => {
      ctx.strokeStyle = layer.color
      ctx.lineWidth = layer.thickness
      ctx.beginPath()
      for (let i = 0; i < layer.count; i += 1) {
        const landX = hash(i * 2.17 + layer.seed) * (this.width + 60) - 30
        const progress = (hash(i * 5.31 + layer.seed * 3.1) * layer.cycle + time) % layer.cycle
        const head = progress * layer.speed
        const tail = Math.max(head - layer.length, -4)
        const end = Math.min(head, groundY)
        if (end <= tail) continue
        ctx.moveTo(landX - (groundY - tail) * slant, tail)
        ctx.lineTo(landX - (groundY - end) * slant, end)
      }
      ctx.stroke()
    })
    ctx.restore()
  }

  drawRainRipples(ctx, palette, reduceMotion) {
    if (reduceMotion) return
    const { groundY } = this.getGeometry()
    ctx.save()
    ctx.strokeStyle = palette.ripple
    ctx.lineWidth = 1
    this.rainLayers(palette, groundY).forEach((layer) => {
      if (!layer.ripple) return
      for (let i = 0; i < layer.count; i += 1) {
        const landX = hash(i * 2.17 + layer.seed) * (this.width + 60) - 30
        const progress = (hash(i * 5.31 + layer.seed * 3.1) * layer.cycle + this.time) % layer.cycle
        const age = progress - groundY / layer.speed
        if (age < 0 || age > 0.45) continue
        const spread = age / 0.45
        ctx.globalAlpha = (1 - spread) * 0.9
        ctx.beginPath()
        ctx.ellipse(landX, groundY + 4, 1.5 + spread * layer.ripple, 0.6 + spread * layer.ripple * 0.3, 0, 0, TAU)
        ctx.stroke()
      }
    })
    ctx.restore()
  }

  drawGround(ctx, palette) {
    const { groundY } = this.getGeometry()
    const gradient = ctx.createLinearGradient(0, groundY, 0, this.height)
    gradient.addColorStop(0, palette.ground[0])
    gradient.addColorStop(1, palette.ground[1])
    ctx.fillStyle = gradient
    ctx.fillRect(0, groundY, this.width, this.height - groundY)

    ctx.fillStyle = palette.grass
    ctx.beginPath()
    ctx.moveTo(0, groundY + 1)
    for (let x = 0; x <= this.width; x += 34) {
      const lift = 3 + ((x * 7) % 5)
      ctx.quadraticCurveTo(x + 17, groundY - lift, x + 34, groundY + 1)
    }
    ctx.lineTo(this.width, groundY + 8)
    ctx.lineTo(0, groundY + 8)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = palette.grass
    ctx.lineWidth = 2
    for (let x = 10; x < this.width; x += 47) {
      const tall = 6 + ((x * 13) % 11)
      ctx.beginPath()
      ctx.moveTo(x, groundY + 1)
      ctx.quadraticCurveTo(x + 2, groundY - tall * 0.6, x + 5, groundY - tall)
      ctx.stroke()
    }
  }

  drawPuddles(ctx, palette) {
    const { groundY } = this.getGeometry()
    ctx.save()
    this.puddles.forEach((puddle) => {
      const alpha = clamp(puddle.life / puddle.max, 0, 1)
      ctx.globalAlpha = alpha
      ctx.fillStyle = palette.puddle
      ctx.beginPath()
      ctx.ellipse(puddle.x, groundY + 8, puddle.radius, puddle.radius * 0.3, 0, 0, TAU)
      ctx.fill()
    })
    ctx.restore()
  }

  flashTint() {
    const { target, life, max, peak } = this.flash
    const amount = Math.pow(life / max, 1.3) * peak
    if (amount < 0.01) return (color) => color
    return (color) => shade(color, target, amount)
  }

  drawPlant(ctx) {
    const geometry = this.getGeometry()
    const { potTop, groundY, stage, wilt, stemHeight } = geometry
    const x = this.player.x
    const healthRatio = geometry.healthRatio
    const tint = this.flashTint()
    const colors = plantPalette(this.health, tint)

    this.drawPot(ctx, x, groundY, potTop, tint)

    const baseY = potTop + 11
    const swayAmount = 1.2 + healthRatio * 2.6
    const sway = Math.sin(this.time * 1.55) * swayAmount
    const lean = clamp(-this.player.vx / PLAYER_SPEED, -1, 1) * 9
    const bend = wilt * 30
    const topX = x + sway + lean + bend
    const topY = baseY - stemHeight
    const control = {
      x: x + sway * 0.55 + lean * 0.35 + bend * 0.25,
      y: baseY - stemHeight * 0.53,
    }

    ctx.save()
    ctx.lineCap = 'round'
    ctx.strokeStyle = colors.stem
    ctx.lineWidth = 6 + Math.min(2.4, stage * 0.45)
    ctx.beginPath()
    ctx.moveTo(x, baseY)
    ctx.quadraticCurveTo(control.x, control.y, topX, topY)
    ctx.stroke()

    ctx.strokeStyle = colors.stemLight
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(x - 1, baseY)
    ctx.quadraticCurveTo(control.x - 1, control.y, topX - 1, topY)
    ctx.stroke()
    ctx.restore()

    const start = { x, y: baseY }
    const end = { x: topX, y: topY }
    const pairs = 1 + Math.min(2, Math.floor(stage / 2))
    const leafRotation = -0.52 + wilt * 1.18

    for (let i = 0; i < pairs; i += 1) {
      const anchor = quadPoint(start, control, end, 0.56 + i * 0.17)
      const size = (28 + stage * 5.2) * (1 - i * 0.08)
      const width = size * 0.36
      this.drawLeaf(ctx, anchor.x - 1, anchor.y, -1, size * 0.94, width, leafRotation, colors)
      this.drawLeaf(ctx, anchor.x + 1, anchor.y, 1, size, width, leafRotation - 0.08, colors)
    }

    if (this.state !== 'over' && this.health > 65 && stage >= 2) {
      const bloom = clamp((this.health - 65) / 25, 0, 1)
      this.drawFlower(ctx, topX, topY - 2, (7 + stage * 1.2) * (0.5 + bloom * 0.5), colors, tint)
    }
  }

  drawPot(ctx, x, groundY, potTop, tint) {
    const topWidth = 98
    const bottomWidth = 72

    ctx.save()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)'
    ctx.beginPath()
    ctx.ellipse(x, groundY + 6, 55, 9, 0, 0, TAU)
    ctx.fill()

    const body = ctx.createLinearGradient(x - topWidth / 2, 0, x + topWidth / 2, 0)
    body.addColorStop(0, tint('#a85f3f'))
    body.addColorStop(0.36, tint('#dd9268'))
    body.addColorStop(0.72, tint('#c1724e'))
    body.addColorStop(1, tint('#9b5638'))

    ctx.fillStyle = body
    ctx.beginPath()
    ctx.moveTo(x - topWidth / 2 + 3, potTop + 12)
    ctx.lineTo(x + topWidth / 2 - 3, potTop + 12)
    ctx.lineTo(x + bottomWidth / 2, groundY)
    ctx.quadraticCurveTo(x, groundY + 7, x - bottomWidth / 2, groundY)
    ctx.closePath()
    ctx.fill()

    const rim = ctx.createLinearGradient(x - topWidth / 2, 0, x + topWidth / 2, 0)
    rim.addColorStop(0, tint('#b86c49'))
    rim.addColorStop(0.4, tint('#e6a079'))
    rim.addColorStop(1, tint('#a65d3e'))
    ctx.fillStyle = rim
    roundedRect(ctx, x - topWidth / 2 - 4, potTop, topWidth + 8, 18, 8)
    ctx.fill()

    ctx.fillStyle = tint('#4a3426')
    ctx.beginPath()
    ctx.ellipse(x, potTop + 12, topWidth / 2 - 8, 6, 0, 0, TAU)
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.beginPath()
    ctx.ellipse(x - 14, potTop + 9, 21, 3, -0.08, 0, TAU)
    ctx.fill()
    ctx.restore()
  }

  drawLeaf(ctx, x, y, direction, length, width, rotation, colors) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(direction, 1)
    ctx.rotate(rotation)

    const gradient = ctx.createLinearGradient(0, 0, length, 0)
    gradient.addColorStop(0, colors.leafDark)
    gradient.addColorStop(0.55, colors.leaf)
    gradient.addColorStop(1, colors.leafDark)
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(length * 0.24, -width, length * 0.8, -width * 0.92, length, 0)
    ctx.bezierCurveTo(length * 0.8, width * 0.92, length * 0.24, width, 0, 0)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = colors.leafVein
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(length * 0.08, 0)
    ctx.quadraticCurveTo(length * 0.5, width * 0.08, length * 0.88, 0)
    ctx.stroke()
    ctx.restore()
  }

  drawFlower(ctx, x, y, radius, colors, tint) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(Math.sin(this.time * 1.2) * 0.05)

    const petals = 6
    ctx.fillStyle = tint('#fff3c4')
    for (let i = 0; i < petals; i += 1) {
      const angle = (i / petals) * TAU
      ctx.beginPath()
      ctx.ellipse(
        Math.cos(angle) * radius * 0.62,
        Math.sin(angle) * radius * 0.62,
        radius * 0.48,
        radius * 0.31,
        angle,
        0,
        TAU,
      )
      ctx.fill()
    }

    ctx.fillStyle = tint('#f5a623')
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.38, 0, TAU)
    ctx.fill()

    ctx.fillStyle = colors.stem
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.16, 0, TAU)
    ctx.fill()
    ctx.restore()
  }

  drawDrops(ctx) {
    this.drops.forEach((drop) => this.drawDrop(ctx, drop))
  }

  drawDrop(ctx, drop) {
    const t = this.time
    const dark = this.isDark
    const phase = drop.phase ?? drop.wobble ?? 0
    const ambient = Boolean(drop.ambient)
    const speedFactor = clamp(drop.vy / 300, 0.55, 1.5)
    const scale = ambient ? 0.8 : 1
    const halfWidth = Math.max(1.4, drop.size * 0.32) * scale * (1 + Math.sin(t * 11 + phase) * 0.08)
    const length = drop.size * (3.4 + speedFactor * 2.1) * scale * (0.94 + Math.sin(t * 17 + phase) * 0.06)
    const angle = -Math.atan2(drop.vx + Math.sin(t * 3 + phase) * 6, drop.vy)

    ctx.save()
    ctx.translate(drop.x, drop.y)
    ctx.rotate(angle)
    ctx.globalAlpha = ambient ? 0.6 : 1

    ctx.beginPath()
    ctx.moveTo(0, -length)
    ctx.lineTo(halfWidth, 0)
    ctx.arc(0, 0, halfWidth, 0, Math.PI)
    ctx.closePath()

    ctx.lineJoin = 'round'
    ctx.strokeStyle = dark ? 'rgba(125, 220, 255, 0.28)' : 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = halfWidth * 1.9
    ctx.stroke()

    const body = ctx.createLinearGradient(0, -length, 0, halfWidth)
    if (dark) {
      body.addColorStop(0, 'rgba(150, 225, 255, 0)')
      body.addColorStop(0.55, 'rgba(150, 225, 255, 0.7)')
      body.addColorStop(1, 'rgba(225, 248, 255, 1)')
    } else {
      body.addColorStop(0, 'rgba(14, 100, 190, 0)')
      body.addColorStop(0.55, 'rgba(14, 100, 190, 0.7)')
      body.addColorStop(1, 'rgba(10, 82, 170, 1)')
    }
    ctx.fillStyle = body
    ctx.fill()

    const glint = (t * 2.6 + phase) % 1
    const glintY = -length * (0.12 + glint * 0.72)
    ctx.fillStyle = `rgba(255, 255, 255, ${0.75 * (1 - glint)})`
    ctx.beginPath()
    ctx.ellipse(0, glintY, halfWidth * 0.45, Math.max(1.5, length * 0.1), 0, 0, TAU)
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.beginPath()
    ctx.arc(-halfWidth * 0.3, -halfWidth * 0.1, Math.max(0.5, halfWidth * 0.32), 0, TAU)
    ctx.fill()
    ctx.restore()
  }

  drawRings(ctx) {
    ctx.save()
    this.rings.forEach((ring) => {
      const progress = 1 - ring.life / ring.max
      ctx.globalAlpha = clamp(ring.life / ring.max, 0, 1) * 0.7
      ctx.strokeStyle = this.isDark ? '#bae6fd' : '#1f9be8'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(ring.x, ring.y, 7 + progress * 34, 0, TAU)
      ctx.stroke()
    })
    ctx.restore()
  }

  drawParticles(ctx) {
    const dark = this.isDark
    const fills = dark ? ['#7dd3fc', '#e0f7ff'] : ['#1f9be8', '#6cc8fa']
    ctx.save()
    ctx.strokeStyle = 'rgba(8, 72, 140, 0.75)'
    ctx.lineWidth = 1
    this.particles.forEach((particle) => {
      ctx.globalAlpha = clamp(particle.life / particle.max, 0, 1)
      ctx.fillStyle = fills[particle.tint]
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, TAU)
      ctx.fill()
      if (!dark) ctx.stroke()
    })
    ctx.restore()
  }

  drawFloaters(ctx) {
    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    this.floaters.forEach((floater) => {
      ctx.globalAlpha = clamp(floater.life / floater.max, 0, 1)
      ctx.fillStyle = floater.color
      ctx.font = `800 ${floater.size}px Nunito, ui-sans-serif, sans-serif`
      ctx.fillText(floater.text, floater.x, floater.y)
    })
    ctx.restore()
  }

  drawVignette(ctx, palette) {
    const radius = Math.max(this.width, this.height) * 0.78
    const gradient = ctx.createRadialGradient(
      this.width / 2,
      this.height / 2,
      radius * 0.45,
      this.width / 2,
      this.height / 2,
      radius,
    )
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(1, palette.vignette)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.width, this.height)
  }
}