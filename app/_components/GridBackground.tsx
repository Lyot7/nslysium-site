'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Suivi souris : lerp simple (pas de spring/velocity → aucun overshoot).
// Plus la valeur est basse, plus le suivi est paresseux (et le halo lent).
const SMOOTHING = 0.08

// Grille déformable façon "tissu élastique"
const CELL_SIZE = 72         // px entre 2 lignes (matche l'ancienne version CSS)
const CURVE_RADIUS = 260     // px : rayon d'influence du curseur
const CURVE_STRENGTH = 12    // px : déplacement max d'un point — très subtil
const SAMPLE_SPACING = 36    // px entre 2 points de contrôle d'une ligne

// Sur la home, la grille s'efface complètement pendant le hero (image salon
// pleine page) pour éviter le quadrillage par-dessus la photo.
const HERO_FADE_END = 0.85

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const initialized = useRef(false)
  const pathname = usePathname()

  // Track souris → target
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
      if (!initialized.current) {
        current.current.x = e.clientX
        current.current.y = e.clientY
        initialized.current = true
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Boucle d'animation : Canvas 2D, grille déformée par champ de force radial
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isHome = pathname === '/'
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    // Resize canvas avec DPR adaptatif (cap 2 pour préserver perf)
    let viewW = 0
    let viewH = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      viewW = window.innerWidth
      viewH = window.innerHeight
      canvas.width = viewW * dpr
      canvas.height = viewH * dpr
      canvas.style.width = `${viewW}px`
      canvas.style.height = `${viewH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Déplace un point selon la distance au curseur.
    // Falloff smoothstep, push radial vers l'extérieur (effet "tissu repoussé").
    const cursor = current.current
    const displace = (x: number, y: number): [number, number] => {
      const dx = x - cursor.x
      const dy = y - cursor.y
      const d2 = dx * dx + dy * dy
      const r2 = CURVE_RADIUS * CURVE_RADIUS
      if (d2 > r2) return [x, y]
      const d = Math.sqrt(d2)
      const t = 1 - d / CURVE_RADIUS
      const eased = t * t * (3 - 2 * t) // smoothstep
      const push = CURVE_STRENGTH * eased
      if (d < 0.01) return [x, y]
      return [x + (dx / d) * push, y + (dy / d) * push]
    }

    // Trace une ligne courbe à travers une série de points via quadratic curves.
    const drawSmoothPath = (points: [number, number][]) => {
      if (points.length < 2) return
      ctx.beginPath()
      ctx.moveTo(points[0][0], points[0][1])
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i][0] + points[i + 1][0]) / 2
        const yc = (points[i][1] + points[i + 1][1]) / 2
        ctx.quadraticCurveTo(points[i][0], points[i][1], xc, yc)
      }
      ctx.lineTo(
        points[points.length - 1][0],
        points[points.length - 1][1],
      )
      ctx.stroke()
    }

    const renderFrame = (alpha: number) => {
      ctx.clearRect(0, 0, viewW, viewH)
      if (alpha < 0.01) return

      // Halo spotlight chaud autour du curseur
      const halo = ctx.createRadialGradient(
        cursor.x,
        cursor.y,
        0,
        cursor.x,
        cursor.y,
        600,
      )
      halo.addColorStop(0, `rgba(181, 158, 125, ${0.18 * alpha})`)
      halo.addColorStop(0.4, `rgba(181, 158, 125, ${0.07 * alpha})`)
      halo.addColorStop(1, 'transparent')
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, viewW, viewH)

      // Lignes : couleur khaki très tamisée
      ctx.strokeStyle = `rgba(181, 158, 125, ${0.14 * alpha})`
      ctx.lineWidth = 1

      // Lignes horizontales (y constant, x varie)
      const samplesH = Math.ceil(viewW / SAMPLE_SPACING)
      const rows = Math.ceil(viewH / CELL_SIZE) + 1
      for (let row = 0; row <= rows; row++) {
        const y = row * CELL_SIZE
        const points: [number, number][] = []
        for (let i = 0; i <= samplesH; i++) {
          const x = (i / samplesH) * viewW
          points.push(displace(x, y))
        }
        drawSmoothPath(points)
      }

      // Lignes verticales (x constant, y varie)
      const samplesV = Math.ceil(viewH / SAMPLE_SPACING)
      const cols = Math.ceil(viewW / CELL_SIZE) + 1
      for (let col = 0; col <= cols; col++) {
        const x = col * CELL_SIZE
        const points: [number, number][] = []
        for (let i = 0; i <= samplesV; i++) {
          const y = (i / samplesV) * viewH
          points.push(displace(x, y))
        }
        drawSmoothPath(points)
      }
    }

    // WCAG 2.3.3 : reduce-motion = grille statique centrée (pas de RAF)
    if (prefersReducedMotion) {
      cursor.x = viewW / 2
      cursor.y = viewH / 2
      renderFrame(isHome ? 0 : 1)
      return () => {
        window.removeEventListener('resize', resize)
      }
    }

    let rafId = 0
    const tick = () => {
      // Lerp simple : cursor approche la cible sans jamais dépasser.
      // current += (target - current) * SMOOTHING  →  pas de velocity, pas
      // d'overshoot. Le halo et la grille suivent en glissant.
      cursor.x += (target.current.x - cursor.x) * SMOOTHING
      cursor.y += (target.current.y - cursor.y) * SMOOTHING

      // Opacity : sur la home, fade in progressif quand on quitte le hero
      let alpha = 1
      if (isHome) {
        alpha = Math.min(
          1,
          Math.max(0, window.scrollY / (window.innerHeight * HERO_FADE_END)),
        )
      }

      // Le canvas lui-même doit suivre l'alpha — sinon le DOM cache tout.
      canvas.style.opacity = String(alpha)

      renderFrame(alpha)
      rafId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [pathname])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: pathname === '/' ? 0 : 1, // initial state : caché sur home
        transition: 'opacity 0.3s ease',
        willChange: 'opacity',
      }}
    />
  )
}
