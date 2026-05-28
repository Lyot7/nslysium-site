'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Spring physics : le spotlight suit la souris avec un léger rebond élastique.
const STIFFNESS = 0.12
const FRICTION = 0.82

// Amplitude max du parallax des lignes (px) — la grille se décale autour de
// son point de repos selon la position normalisée [-1, +1] de la souris.
const GRID_PARALLAX = 28

// Sur la home, la grille s'efface complètement pendant le hero (image salon
// pleine page) pour éviter le quadrillage par-dessus la photo — pas pro.
const HERO_FADE_END = 0.85

export default function GridBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
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

  // Boucle d'animation : spring follow + opacity selon scroll hero
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // WCAG 2.3.3 : si l'utilisateur a demandé moins de mouvement, on fige
    // la grille au centre et on saute la boucle RAF entière.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReducedMotion) {
      el.style.setProperty('--mx', '50vw')
      el.style.setProperty('--my', '50vh')
      el.style.setProperty('--gx', '0px')
      el.style.setProperty('--gy', '0px')
      el.style.opacity = pathname === '/' ? '0' : '1'
      return
    }

    let rafId = 0
    const isHome = pathname === '/'

    const tick = () => {
      // Spring physics : v += (target - current) * stiffness ; v *= friction
      const dx = target.current.x - current.current.x
      const dy = target.current.y - current.current.y
      velocity.current.x = (velocity.current.x + dx * STIFFNESS) * FRICTION
      velocity.current.y = (velocity.current.y + dy * STIFFNESS) * FRICTION
      current.current.x += velocity.current.x
      current.current.y += velocity.current.y

      // Halo : position absolue de la souris (en pixels)
      el.style.setProperty('--mx', `${current.current.x}px`)
      el.style.setProperty('--my', `${current.current.y}px`)

      // Grille : parallax léger autour du repos.
      // Mouse normalisée [-1, +1] → décalage [-GRID_PARALLAX, +GRID_PARALLAX].
      // Direction inversée pour un effet "la grille s'éloigne du curseur"
      // (sensation naturelle d'élasticité, comme un tissu qu'on étire).
      const vw = window.innerWidth
      const vh = window.innerHeight
      const nx = (current.current.x / vw - 0.5) * 2 // [-1, +1]
      const ny = (current.current.y / vh - 0.5) * 2
      const gx = -nx * GRID_PARALLAX
      const gy = -ny * GRID_PARALLAX
      el.style.setProperty('--gx', `${gx}px`)
      el.style.setProperty('--gy', `${gy}px`)

      // Opacity : sur la home, fade in progressif quand on quitte le hero
      // (la grille reste invisible tant qu'on voit l'image salon plein écran).
      if (isHome) {
        const heroFade = Math.min(
          1,
          Math.max(0, window.scrollY / (window.innerHeight * HERO_FADE_END)),
        )
        el.style.opacity = String(heroFade)
      } else {
        el.style.opacity = '1'
      }

      rafId = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(rafId)
  }, [pathname])

  return (
    <div
      ref={ref}
      className="grid-bg"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: pathname === '/' ? 0 : 1, // initial state : caché sur home, visible ailleurs
        transition: 'opacity 0.3s ease',
        willChange: 'opacity',
      }}
    />
  )
}
