'use client'

import { useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// Forcer GSAP à animer même quand l'onglet est en arrière-plan
gsap.ticker.lagSmoothing(0)

const AetherScene = dynamic(() => import('./AetherScene'), { ssr: false })

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef({ progress: 0, section: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * -2,
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initialiser à opacity 0 / invisible avant animation
      gsap.set(['.hero-badge', '.hero-word', '.hero-sub', '.hero-cta', '.hero-canvas'], {
        opacity: 0,
      })
      gsap.set(['.hero-word', '.hero-badge', '.hero-sub', '.hero-cta'], { y: 30 })
      gsap.set('.hero-canvas', { scale: 0.9 })

      const tl = gsap.timeline({ delay: 0.3 })
      tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        .to('.hero-word', { opacity: 1, y: 0, stagger: 0.07, duration: 0.8, ease: 'power3.out' }, '-=0.3')
        .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .to('.hero-cta', { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .to('.hero-canvas', { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, '<0.2')

      // Parallax au scroll
      gsap.to('.hero-text-content', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to('.hero-canvas', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#16120E' }}
      onMouseMove={handleMouseMove}
    >
      {/* Fond : grille subtile + gradient radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 65% 70% at 65% 45%, rgba(196,98,45,0.13) 0%, transparent 65%),
            linear-gradient(rgba(250,247,242,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250,247,242,0.02) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, 80px 80px, 80px 80px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* TEXTE */}
        <div className="hero-text-content space-y-8 z-10">
          <div className="hero-badge inline-flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: '#C4622D' }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: '#C4622D' }}
            >
              Assistant de vie intelligent
            </span>
          </div>

          <h1
            className="font-display font-light leading-[1.05]"
            style={{
              color: '#FAF7F2',
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
            }}
          >
            {['Votre assistant', 'de vie,', 'enfin centralisé'].map((line, li) => (
              <span key={li} className="block overflow-hidden">
                {line.split(' ').map((word, wi) => (
                  <span
                    key={wi}
                    className="hero-word inline-block mr-[0.25em]"
                  >
                    {word === 'centralisé' || word === 'enfin' ? (
                      <span className="text-gradient">{word}</span>
                    ) : (
                      word
                    )}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p
            className="hero-sub text-lg leading-relaxed max-w-md"
            style={{ color: 'rgba(250,247,242,0.6)' }}
          >
            NSLysium centralise sport, nutrition, sommeil et organisation —
            pilotés par la voix, appris de vous.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/produit"
              className="hero-cta px-8 py-4 rounded-full text-sm font-semibold text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(196,98,45,0.45)]"
              style={{ background: '#C4622D', color: '#FAF7F2' }}
            >
              Découvrir NSLysium
            </Link>
            <Link
              href="/abonnement"
              className="hero-cta px-8 py-4 rounded-full text-sm font-semibold text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                border: '1px solid rgba(196,98,45,0.4)',
                color: '#FAF7F2',
              }}
            >
              Voir l&apos;abonnement
            </Link>
          </div>

          {/* Stats ligne */}
          <div
            className="flex gap-8 pt-4 border-t"
            style={{ borderColor: 'rgba(196,98,45,0.12)' }}
          >
            {([
              ['995 Md$', 'Marché'],
              ['22.2%', 'Croissance/an'],
              ['3-en-1', 'Solution'],
            ] as [string, string][]).map(([val, label]) => (
              <div key={label}>
                <div
                  className="font-display text-xl font-light"
                  style={{ color: '#C4622D' }}
                >
                  {val}
                </div>
                <div
                  className="text-xs"
                  style={{ color: 'rgba(250,247,242,0.4)' }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CANVAS 3D */}
        <div
          className="hero-canvas relative"
          style={{ height: '580px' }}
        >
          <AetherScene
            scrollRef={scrollRef}
            mouseRef={mouseRef}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span
          className="text-[10px] uppercase tracking-[0.25em]"
          style={{ color: 'rgba(250,247,242,0.3)' }}
        >
          Scroll
        </span>
        <div className="relative w-px h-14 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(196,98,45,0.2)' }}
          />
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: '40%',
              background: 'linear-gradient(to bottom, #C4622D, transparent)',
              animation: 'scrollLine 1.8s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}
