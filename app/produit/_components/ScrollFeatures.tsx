'use client'

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Force GSAP à animer même quand document est caché (utile pour les previews)
gsap.ticker.lagSmoothing(0)

const AetherScene = dynamic(() => import('../../_components/AetherScene'), { ssr: false })



const FEATURES = [
  {
    tag: 'Audio',
    title: '3 microphones\ndirectionnels',
    desc: "Array beamforming 360° capte votre voix même en mouvement, dans un environnement bruyant.",
    detail: 'Portée 5m · Annulation bruit active · Latence <80ms',
  },
  {
    tag: 'Intelligence',
    title: 'IA embarquée\nlocale',
    desc: "Le traitement se fait sur l'appareil. Vos données restent chez vous, toujours.",
    detail: 'Zéro cloud obligatoire · Apprentissage progressif · Chiffrement AES-256',
  },
  {
    tag: 'Connectivité',
    title: 'Bluetooth 5.2\n& WiFi 6',
    desc: "Sync instantanée avec l'app BetaLysium. Mises à jour OTA silencieuses.",
    detail: 'Portée BT 30m · WiFi dual-band · Sync <200ms',
  },
  {
    tag: 'Robustesse',
    title: "IP54 · 8h\nd'autonomie",
    desc: "Résistant aux projections d'eau et à la poussière. Conçu pour les entraînements intenses.",
    detail: 'Charge USB-C 90min · Veille 30 jours · -10°C à +50°C',
  },
]

export default function ScrollFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef({ progress: 0, section: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const sectionEl = sectionRef.current
    const featuresEl = featuresRef.current
    if (!sectionEl || !featuresEl) return

    const panels = Array.from(featuresEl.querySelectorAll<HTMLElement>('.feature-panel'))
    if (!panels.length) return

    // Initialiser tous les panels invisibles sauf le premier
    gsap.set(panels.slice(1), { opacity: 0, y: 25 })
    gsap.set(panels[0], { opacity: 1, y: 0 })
    gsap.set('.sf-heading', { opacity: 0, y: 20 })

    const triggers: ScrollTrigger[] = []

    // Animation d'entrée du heading
    triggers.push(ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top 80%',
      onEnter: () => gsap.to('.sf-heading', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
      onLeaveBack: () => gsap.to('.sf-heading', { opacity: 0, y: 20, duration: 0.3 }),
    }))

    // Pin la section pendant le scroll des features
    triggers.push(ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top top',
      end: `+=${panels.length * window.innerHeight}px`,
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
    }))

    // ScrollTrigger principal pour changer les panels selon la progression
    triggers.push(ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top top',
      end: `+=${panels.length * window.innerHeight}px`,
      scrub: 0.8,
      onUpdate: (self) => {
        const progress = self.progress
        const step = 1 / panels.length
        const activeIndex = Math.min(
          Math.floor(progress / step + 0.1),
          panels.length - 1
        )

        panels.forEach((panel, i) => {
          if (i === activeIndex) {
            gsap.to(panel, { opacity: 1, y: 0, duration: 0.25, overwrite: 'auto' })
          } else if (i < activeIndex) {
            gsap.to(panel, { opacity: 0, y: -25, duration: 0.25, overwrite: 'auto' })
          } else {
            gsap.to(panel, { opacity: 0, y: 25, duration: 0.25, overwrite: 'auto' })
          }
        })
      },
    }))

    ScrollTrigger.refresh()

    return () => {
      triggers.forEach(t => t.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center"
      style={{ background: '#16120E' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">

        {/* Canvas 3D gauche */}
        <div style={{ height: '520px' }}>
          <AetherScene
            scrollRef={scrollRef}
            mouseRef={mouseRef}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Features droite */}
        <div ref={featuresRef} className="relative">
          <p
            className="sf-heading text-xs font-semibold uppercase tracking-[0.2em] mb-10"
            style={{ color: '#C4622D' }}
          >
            L&apos;enceinte Aether
          </p>

          {/* Container des panels avec hauteur fixe */}
          <div style={{ position: 'relative', height: '340px' }}>
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="feature-panel"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  opacity: i === 0 ? 1 : 0,
                }}
              >
                <span
                  className="text-xs px-3 py-1 rounded-full mb-4 inline-block"
                  style={{
                    background: 'rgba(196,98,45,0.12)',
                    color: '#C4622D',
                    border: '1px solid rgba(196,98,45,0.25)',
                  }}
                >
                  {feat.tag}
                </span>
                <h2
                  className="font-display font-light leading-tight mb-6"
                  style={{
                    color: '#FAF7F2',
                    fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                  }}
                >
                  {feat.title.split('\n').map((l, j) => (
                    <span key={j} className="block">
                      {l}
                    </span>
                  ))}
                </h2>
                <p
                  className="text-lg leading-relaxed mb-4"
                  style={{ color: 'rgba(250,247,242,0.6)' }}
                >
                  {feat.desc}
                </p>
                <p
                  className="text-sm font-mono"
                  style={{ color: 'rgba(196,98,45,0.7)' }}
                >
                  {feat.detail}
                </p>

                {/* Progress dots */}
                <div className="flex gap-2 mt-8">
                  {FEATURES.map((_, j) => (
                    <div
                      key={j}
                      className="h-0.5 flex-1 rounded-full"
                      style={{
                        background: j === i ? '#C4622D' : 'rgba(196,98,45,0.2)',
                        transition: 'background 0.3s',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
