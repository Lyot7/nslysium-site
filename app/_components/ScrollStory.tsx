'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AetherScene from './AetherScene'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ─────────────────────────────────────────────────────────────────

interface StatItem {
  value: string
  numericTarget: number
  suffix: string
  label: string
  sub: string
}

interface SpecCard {
  label: string
  sub: string
}

interface ChatBubble {
  command: string
  response: string
}

interface PricingCard {
  tier: string
  price: string
  highlight: boolean
  features: string[]
  cta: string
}

// ─── Données statiques ─────────────────────────────────────────────────────

const HERO_STATS: StatItem[] = [
  {
    value: '5→1',
    numericTarget: 1,
    suffix: '',
    label: 'seul assistant',
    sub: 'remplace Strava, MyFitnessPal, Sleep Cycle, votre agenda et plus',
  },
  {
    value: '3s',
    numericTarget: 3,
    suffix: 's',
    label: 'pour tout logger',
    sub: 'Dites "j\'ai mangé une pizza" — les calories sont comptées',
  },
  {
    value: '0',
    numericTarget: 0,
    suffix: '',
    label: 'cloud obligatoire',
    sub: 'votre IA tourne sur votre Aether, vos données restent chez vous',
  },
]

const AETHER_SPECS: SpecCard[] = [
  { label: 'Capte votre voix à 5m', sub: 'Même avec de la musique ou du bruit en fond' },
  { label: 'Traitement 100% local', sub: 'Aucune donnée envoyée dans le cloud · zéro écoute tierce' },
  { label: 'Connexion instantanée', sub: 'Sync avec votre app en moins de 200ms' },
  { label: 'Résistant au quotidien', sub: 'Vapeur de douche, cuisine, projections d\'eau' },
  { label: 'Toute une journée', sub: '8h d\'utilisation · rechargement rapide 90min USB-C' },
  { label: 'Toujours disponible', sub: 'Standby ultra-basse conso · répond en un instant' },
]

const APP_PILLS = [
  { label: 'Sport & Performance', sub: 'Séances, records, VO2Max' },
  { label: 'Nutrition', sub: 'Calories, macros, hydratation' },
  { label: 'Sommeil', sub: 'Score qualité, récupération, cycles' },
  { label: 'Organisation', sub: 'Agenda vocal, rappels, objectifs' },
]

const CHAT_BUBBLES: ChatBubble[] = [
  {
    command: 'Lance un HIIT 30 min',
    response: 'C\'est parti ! Durée 30 min · intensité adaptée à votre récupération · playlist Cardio lancée',
  },
  {
    command: "J'ai mangé une pizza",
    response: 'Noté ! 820 kcal · vos macros du jour sont ajustées · il vous reste 540 kcal pour ce soir',
  },
  {
    command: "Comment j'ai dormi ?",
    response: 'Très bien ! 7h12 de sommeil · score 78/100 · +12% vs la semaine — bien récupéré ✓',
  },
  {
    command: "Rappelle-moi d'appeler Paul ce soir",
    response: 'Rappel créé à 19h00 · calendrier mis à jour · je vous préviens 5 min avant',
  },
]

const PRICING_CARDS: PricingCard[] = [
  {
    tier: 'FREEMIUM',
    price: 'Gratuit',
    highlight: false,
    features: [
      '1 pilier santé à choisir',
      '50 commandes vocales/mois',
      'Tableaux de bord essentiels',
    ],
    cta: 'Démarrer gratuitement',
  },
  {
    tier: 'PREMIUM',
    price: '9,99€/mois',
    highlight: true,
    features: [
      'Sport + Nutrition + Sommeil',
      'Commandes vocales illimitées',
      'Coach IA personnalisé',
    ],
    cta: 'Essayer 14j gratuits',
  },
  {
    tier: 'PRO',
    price: '19,99€/mois',
    highlight: false,
    features: [
      'Tout ce qu\'inclut Premium',
      'Agenda + apps tierces connectées',
      'Export données + accès API',
    ],
    cta: 'Découvrir Pro',
  },
]

// ─── Composant principal ────────────────────────────────────────────────────

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef    = useRef({ progress: 0, section: 0 })
  const mouseRef     = useRef({ x: 0, y: 0 })
  const [activeSection, setActiveSection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Stat counter displayed values
  const stat0Ref = useRef<HTMLSpanElement>(null)
  const stat1Ref = useRef<HTMLSpanElement>(null)
  const stat2Ref = useRef<HTMLSpanElement>(null)
  const statRefs = [stat0Ref, stat1Ref, stat2Ref]

  // Spec bar ref for scaleX animation
  const specBarRef = useRef<HTMLDivElement>(null)

  // Responsive detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * -2,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── GSAP ScrollTrigger setup ───────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Global progress tracker (feeds AetherScene) ──
    const globalTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollRef.current.progress = self.progress
        const sec = Math.min(4, Math.floor(self.progress * 5))
        scrollRef.current.section = sec
        setActiveSection((prev) => (prev !== sec ? sec : prev))
      },
    })

    const panels = container.querySelectorAll<HTMLElement>('.ss-panel')

    panels.forEach((panel, i) => {
      // ── Per-panel content fade-in ──
      const content = panel.querySelector<HTMLElement>('.ss-content')
      if (content) {
        gsap.fromTo(
          content,
          { opacity: 0, y: 52 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 72%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      }

      // ── Word-by-word title reveal ──
      const wordSpans = panel.querySelectorAll<HTMLElement>('.ss-word')
      if (wordSpans.length) {
        gsap.fromTo(
          wordSpans,
          { opacity: 0, y: 28, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.055,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 68%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      }

      // ── Tag flicker/glitch ──
      const tag = panel.querySelector<HTMLElement>('.ss-tag')
      if (tag) {
        gsap.fromTo(
          tag,
          { opacity: 0, x: -10, skewX: 6 },
          {
            opacity: 1,
            x: 0,
            skewX: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 75%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      }

      // ── ss-item stagger (spec cards, chat bubbles, pills) ──
      const items = panel.querySelectorAll<HTMLElement>('.ss-item')
      if (items.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 62%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      }

      // ── Section 0: stat counters ──
      if (i === 0) {
        HERO_STATS.forEach((stat, si) => {
          const el = statRefs[si].current
          if (!el) return
          const counter = { value: 0 }
          gsap.to(counter, {
            value: stat.numericTarget,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              if (el) {
                if (stat.suffix === '') {
                  el.textContent = stat.value
                } else {
                  el.textContent = `${Math.round(counter.value)}${stat.suffix}`
                }
              }
            },
            scrollTrigger: {
              trigger: panel,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          })
        })

        // Scroll indicator pulse
        const scrollIndicator = panel.querySelector<HTMLElement>('.ss-scroll-indicator')
        if (scrollIndicator) {
          gsap.to(scrollIndicator, {
            y: 8,
            repeat: -1,
            yoyo: true,
            duration: 1.2,
            ease: 'sine.inOut',
          })
        }
      }

      // ── Section 1: spec bar scaleX ──
      if (i === 1 && specBarRef.current) {
        gsap.fromTo(
          specBarRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power2.inOut',
            transformOrigin: 'left center',
            scrollTrigger: {
              trigger: panel,
              start: 'top 65%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      }

      // ── Parallax body text subtle drift ──
      const body = panel.querySelector<HTMLElement>('.ss-body')
      if (body) {
        gsap.fromTo(
          body,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 64%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      }

      // ── CTA slide-in ──
      const ctas = panel.querySelectorAll<HTMLElement>('.ss-cta')
      if (ctas.length) {
        gsap.fromTo(
          ctas,
          { opacity: 0, y: 24, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.65,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: panel,
              start: 'top 58%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      }

      // ── Pricing cards stagger (section 4) ──
      if (i === 4) {
        const pricingCards = panel.querySelectorAll<HTMLElement>('.ss-pricing-card')
        if (pricingCards.length) {
          gsap.fromTo(
            pricingCards,
            { opacity: 0, y: 50, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.13,
              duration: 0.75,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 62%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        }
      }
    })

    return () => {
      globalTrigger.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Stable — ne se re-run pas

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderWordTitle = (
    lines: string[],
    highlights: string[],
    fontSize: string
  ) => (
    <h2
      style={{
        color: '#FAF7F2',
        fontSize,
        fontWeight: 300,
        lineHeight: 1.08,
        marginBottom: '1.25rem',
        fontFamily: 'var(--font-fraunces)',
        perspective: '600px',
      }}
    >
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {line.split(' ').map((word, wi) => (
            <span
              key={wi}
              className={`ss-word${highlights.some((h) => word.startsWith(h)) ? ' text-gradient' : ''}`}
              style={{ display: 'inline-block', marginRight: '0.22em' }}
            >
              {word}
            </span>
          ))}
        </span>
      ))}
    </h2>
  )

  const renderTag = (label: string) => (
    <span
      className="ss-tag"
      style={{
        display: 'inline-block',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: '#C4622D',
        marginBottom: '1.1rem',
        fontFamily: 'var(--font-dm-sans)',
      }}
    >
      {label}
    </span>
  )

  const btnPrimary: React.CSSProperties = {
    padding: '0.9rem 1.85rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: 600,
    background: '#C4622D',
    color: '#FAF7F2',
    textDecoration: 'none',
    transition: 'transform 0.25s, box-shadow 0.25s',
    fontFamily: 'var(--font-dm-sans)',
    display: 'inline-block',
  }

  const btnGhost: React.CSSProperties = {
    padding: '0.9rem 1.85rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: 600,
    border: '1px solid rgba(196,98,45,0.38)',
    color: '#FAF7F2',
    textDecoration: 'none',
    transition: 'transform 0.25s, border-color 0.25s',
    fontFamily: 'var(--font-dm-sans)',
    display: 'inline-block',
    background: 'transparent',
  }

  const titleSize = isMobile ? 'clamp(1.7rem, 5.5vw, 2.5rem)' : 'clamp(2.2rem, 3.8vw, 4rem)'

  // ── Section layout helpers ─────────────────────────────────────────────────

  type TextSide = 'left' | 'right' | 'center'

  const sectionGrid = (side: TextSide): string => {
    if (isMobile) return '1fr'
    if (side === 'center') return '1fr'
    if (side === 'left') return '2fr 1fr'
    return '1fr 2fr'
  }

  const contentPadding = (side: TextSide): string => {
    if (isMobile) return '2rem 1.5rem clamp(2rem, 5vh, 3.5rem)'
    if (side === 'center') return `0 clamp(2rem, 6vw, 5rem) clamp(3rem, 6vh, 5rem)`
    // left : texte gauche, cône droit — padding-right réduit (cône côté droit)
    if (side === 'left') return `5rem clamp(1.5rem, 3vw, 2.5rem) 4rem clamp(2.5rem, 7vw, 6rem)`
    // right : texte droit, cône gauche — padding-left généreux pour ne pas toucher le cône
    return `5rem clamp(2.5rem, 7vw, 6rem) 4rem clamp(3rem, 5vw, 4.5rem)`
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <>
      {/* ── Canvas fixe fullscreen ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <AetherScene scrollRef={scrollRef} mouseRef={mouseRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* ── Indicateur de section (bas droite) ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.75rem',
          right: '1.75rem',
          zIndex: 20,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          alignItems: 'flex-end',
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: i === activeSection ? 'rgba(196,98,45,0.85)' : 'transparent',
                transform: i === activeSection ? 'translateX(0)' : 'translateX(6px)',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div
              style={{
                height: '4px',
                borderRadius: '2px',
                background: i === activeSection ? '#C4622D' : 'rgba(196,98,45,0.18)',
                width: i === activeSection ? '20px' : '4px',
                transition: 'all 0.3s ease',
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Contenu scrollable ── */}
      <div ref={containerRef} style={{ position: 'relative', zIndex: 10 }}>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 0 — HERO
        ════════════════════════════════════════════════════════════════════ */}
        <section
          className="ss-panel"
          style={{
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: sectionGrid('left'),
            alignItems: isMobile ? 'flex-end' : 'stretch',
          }}
        >
          <div
            className="ss-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'center',
              padding: contentPadding('left'),
              textAlign: isMobile ? 'center' : 'left',
              background: isMobile ? 'rgba(22, 18, 14, 0.72)' : 'transparent',
              backdropFilter: isMobile ? 'blur(14px)' : 'none',
              WebkitBackdropFilter: isMobile ? 'blur(14px)' : 'none',
              borderRadius: isMobile ? '1.25rem 1.25rem 0 0' : '0',
              borderTop: isMobile ? '1px solid rgba(196,98,45,0.15)' : 'none',
            }}
          >
            {renderTag('Assistant de vie intelligent')}

            {renderWordTitle(
              ['Votre assistant', 'de vie,', 'enfin centralisé'],
              ['enfin', 'centralisé'],
              titleSize
            )}

            {/* Stats row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.75rem',
              }}
            >
              {HERO_STATS.map((stat, si) => (
                <div
                  key={si}
                  className="ss-item"
                  style={{
                    padding: '1rem 1.1rem',
                    borderRadius: '0.9rem',
                    background: 'rgba(196,98,45,0.06)',
                    border: '1px solid rgba(196,98,45,0.14)',
                    textAlign: 'left',
                  }}
                >
                  <span
                    ref={statRefs[si]}
                    style={{
                      display: 'block',
                      fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                      fontWeight: 700,
                      fontFamily: 'var(--font-fraunces)',
                      color: '#C4622D',
                      lineHeight: 1,
                      marginBottom: '0.3rem',
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#FAF7F2',
                      fontFamily: 'var(--font-dm-sans)',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {stat.label}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.68rem',
                      color: 'rgba(250,247,242,0.42)',
                      fontFamily: 'var(--font-dm-sans)',
                    }}
                  >
                    {stat.sub}
                  </span>
                </div>
              ))}
            </div>

            <p
              className="ss-body"
              style={{
                fontSize: isMobile ? '0.90rem' : '1.05rem',
                lineHeight: 1.78,
                color: 'rgba(250,247,242,0.60)',
                marginBottom: '2rem',
                maxWidth: '52ch',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Combien d'apps ouvrez-vous chaque matin pour suivre votre santé ?
              NSLysium remplace tout ça. Parlez simplement — il s'occupe du reste.
            </p>

            {/* CTA row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                justifyContent: isMobile ? 'center' : 'flex-start',
                marginBottom: '2rem',
              }}
            >
              <Link
                href="/abonnement"
                className="ss-cta"
                style={btnPrimary}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(196,98,45,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                Démarrer gratuitement
              </Link>
              <Link
                href="/produit"
                className="ss-cta"
                style={btnGhost}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.borderColor = 'rgba(196,98,45,0.7)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.borderColor = 'rgba(196,98,45,0.38)'
                }}
              >
                Voir le produit
              </Link>
            </div>

            {/* Progress dots */}
            {!isMobile && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {[0, 1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    style={{
                      height: '4px',
                      borderRadius: '2px',
                      background: j === activeSection ? '#C4622D' : 'rgba(196,98,45,0.22)',
                      width: j === activeSection ? '22px' : '4px',
                      transition: 'all 0.4s ease',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Scroll indicator */}
            <div
              className="ss-scroll-indicator"
              style={{
                display: isMobile ? 'none' : 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '2.5rem',
                color: 'rgba(250,247,242,0.35)',
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                <rect x="1" y="1" width="12" height="18" rx="6" stroke="rgba(250,247,242,0.35)" strokeWidth="1.2" />
                <circle cx="7" cy="6" r="2" fill="rgba(196,98,45,0.7)" />
              </svg>
              Scroll
            </div>
          </div>

          {/* Cone placeholder */}
          {!isMobile && <div />}
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1 — ENCEINTE AETHER
        ════════════════════════════════════════════════════════════════════ */}
        <section
          className="ss-panel"
          style={{
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: sectionGrid('left'),
            alignItems: isMobile ? 'flex-end' : 'stretch',
          }}
        >
          <div
            className="ss-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'center',
              padding: contentPadding('left'),
              textAlign: isMobile ? 'center' : 'left',
              background: isMobile ? 'rgba(22, 18, 14, 0.72)' : 'transparent',
              backdropFilter: isMobile ? 'blur(14px)' : 'none',
              WebkitBackdropFilter: isMobile ? 'blur(14px)' : 'none',
              borderRadius: isMobile ? '1.25rem 1.25rem 0 0' : '0',
              borderTop: isMobile ? '1px solid rgba(196,98,45,0.15)' : 'none',
            }}
          >
            {renderTag("L'enceinte Aether")}

            {renderWordTitle(
              ['3 microphones.', 'IA locale.', 'Zéro compromis.'],
              ['Zéro'],
              titleSize
            )}

            <p
              className="ss-body"
              style={{
                fontSize: isMobile ? '0.90rem' : '1.05rem',
                lineHeight: 1.78,
                color: 'rgba(250,247,242,0.60)',
                marginBottom: '1.5rem',
                maxWidth: '52ch',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Posez Aether dans votre salon ou votre cuisine. Parlez normalement —
              même avec de la musique en fond. Tout est traité sur l'appareil :
              personne d'autre n'écoute.
            </p>

            {/* Spec bar */}
            <div
              ref={specBarRef}
              style={{
                height: '1px',
                background: 'linear-gradient(90deg, #C4622D, transparent)',
                marginBottom: '1.25rem',
                transformOrigin: 'left center',
              }}
            />

            {/* Spec cards 3×2 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
                gap: '0.55rem',
                marginBottom: '0',
              }}
            >
              {AETHER_SPECS.map((spec, si) => (
                <div
                  key={si}
                  className="ss-item feature-card"
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'left',
                    transition: 'border-color 0.25s',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#FAF7F2',
                      fontFamily: 'var(--font-dm-sans)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {spec.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: 'rgba(250,247,242,0.42)',
                      fontFamily: 'var(--font-dm-sans)',
                    }}
                  >
                    {spec.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!isMobile && <div />}
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 2 — APP BETALYSIUM (textSide: right)
        ════════════════════════════════════════════════════════════════════ */}
        <section
          className="ss-panel"
          style={{
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: sectionGrid('right'),
            alignItems: isMobile ? 'flex-end' : 'stretch',
          }}
        >
          {/* Cone placeholder left */}
          {!isMobile && <div />}

          <div
            className="ss-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'center',
              padding: contentPadding('right'),
              textAlign: isMobile ? 'center' : 'left',
              background: isMobile ? 'rgba(22, 18, 14, 0.72)' : 'transparent',
              backdropFilter: isMobile ? 'blur(14px)' : 'none',
              WebkitBackdropFilter: isMobile ? 'blur(14px)' : 'none',
              borderRadius: isMobile ? '1.25rem 1.25rem 0 0' : '0',
              borderTop: isMobile ? '1px solid rgba(196,98,45,0.15)' : 'none',
            }}
          >
            {renderTag("L'app BetaLysium")}

            {renderWordTitle(
              ['Tout votre bien-être,', 'un seul tableau de bord.'],
              ['un'],
              titleSize
            )}

            <p
              className="ss-body"
              style={{
                fontSize: isMobile ? '0.90rem' : '1.05rem',
                lineHeight: 1.78,
                color: 'rgba(250,247,242,0.60)',
                marginBottom: '1.75rem',
                maxWidth: '52ch',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Vous avez mal dormi hier et couru ce matin ? NSLysium le sait et
              adapte vos objectifs du jour en conséquence. Vous visualisez tout,
              sans avoir rien à saisir manuellement.
            </p>

            {/* Dashboard mockup */}
            <div
              className="ss-item"
              style={{
                width: '100%',
                maxWidth: '300px',
                margin: isMobile ? '0 auto 1.5rem' : '0 0 1.5rem',
                background: '#221E18',
                border: '1px solid rgba(196,98,45,0.2)',
                borderRadius: '12px',
                padding: '1rem',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              {/* Dashboard header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.9rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C4622D, #D4773F)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    color: '#FAF7F2',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  E
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#FAF7F2' }}>
                    Bonsoir, Eliott
                  </span>
                  <span style={{ fontSize: '0.62rem', color: 'rgba(250,247,242,0.4)' }}>Bien-être 82/100</span>
                </div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: '#C4622D',
                    fontWeight: 600,
                    background: 'rgba(196,98,45,0.1)',
                    padding: '0.2rem 0.45rem',
                    borderRadius: '4px',
                  }}
                >
                  Sync ●
                </div>
              </div>

              {/* Metric cards 2×2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                {[
                  { icon: '⚡', label: 'Activité', value: '7 200', unit: 'pas', pct: 72, color: '#C4622D' },
                  { icon: '🔥', label: 'Calories', value: '1 840', unit: 'kcal', pct: 85, color: '#D4773F' },
                  { icon: '🌙', label: 'Sommeil', value: '7h12', unit: 'score 78', pct: 78, color: '#8B7CF6' },
                  { icon: '💧', label: 'Hydratation', value: '1.8L', unit: '/ 2.5L', pct: 72, color: '#4BAED4' },
                ].map((m, mi) => (
                  <div
                    key={mi}
                    style={{
                      background: 'rgba(250,247,242,0.03)',
                      border: '1px solid rgba(196,98,45,0.08)',
                      borderRadius: '8px',
                      padding: '0.55rem 0.6rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem' }}>{m.icon}</span>
                      <span style={{ fontSize: '0.6rem', color: 'rgba(250,247,242,0.45)', fontFamily: 'var(--font-dm-sans)' }}>
                        {m.label}
                      </span>
                    </div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#FAF7F2', marginBottom: '0.1rem' }}>
                      {m.value}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.55rem', color: 'rgba(250,247,242,0.35)', marginBottom: '0.4rem' }}>
                      {m.unit}
                    </span>
                    {/* Progress bar */}
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${m.pct}%`,
                          background: m.color,
                          borderRadius: '2px',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)',
                gap: '0.55rem',
              }}
            >
              {APP_PILLS.map((pill, pi) => (
                <div
                  key={pi}
                  className="ss-item"
                  style={{
                    padding: '0.7rem 0.9rem',
                    borderRadius: '0.65rem',
                    background: 'rgba(196,98,45,0.06)',
                    border: '1px solid rgba(196,98,45,0.13)',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.77rem',
                      fontWeight: 600,
                      color: '#FAF7F2',
                      fontFamily: 'var(--font-dm-sans)',
                      marginBottom: '0.15rem',
                    }}
                  >
                    {pill.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: 'rgba(250,247,242,0.42)',
                      fontFamily: 'var(--font-dm-sans)',
                    }}
                  >
                    {pill.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 3 — CAS D'USAGE (textSide: left)
        ════════════════════════════════════════════════════════════════════ */}
        <section
          className="ss-panel"
          style={{
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: sectionGrid('left'),
            alignItems: isMobile ? 'flex-end' : 'stretch',
          }}
        >
          <div
            className="ss-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'center',
              padding: contentPadding('left'),
              textAlign: isMobile ? 'center' : 'left',
              background: isMobile ? 'rgba(22, 18, 14, 0.72)' : 'transparent',
              backdropFilter: isMobile ? 'blur(14px)' : 'none',
              WebkitBackdropFilter: isMobile ? 'blur(14px)' : 'none',
              borderRadius: isMobile ? '1.25rem 1.25rem 0 0' : '0',
              borderTop: isMobile ? '1px solid rgba(196,98,45,0.15)' : 'none',
            }}
          >
            {renderTag("Cas d'usage")}

            {renderWordTitle(
              ["Dites-le,", 'NSLysium s\'en occupe.'],
              ['NSLysium'],
              titleSize
            )}

            <p
              className="ss-body"
              style={{
                fontSize: isMobile ? '0.90rem' : '1.05rem',
                lineHeight: 1.78,
                color: 'rgba(250,247,242,0.60)',
                marginBottom: '1.75rem',
                maxWidth: '52ch',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Le matin, NSLysium vous dit comment vous avez dormi et ce que vous
              devriez manger. Le soir, il fait votre bilan. Entre les deux — il
              enregistre, sans que vous y pensiez.
            </p>

            {/* Chat bubbles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {CHAT_BUBBLES.map((bubble, bi) => (
                <div
                  key={bi}
                  className="ss-item"
                  style={{
                    borderRadius: '12px',
                    background: 'rgba(196,98,45,0.06)',
                    border: '1px solid rgba(196,98,45,0.15)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Command row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.9rem 0.45rem',
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
                      <path
                        d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"
                        fill="rgba(196,98,45,0.8)"
                      />
                      <path
                        d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
                        stroke="rgba(196,98,45,0.8)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#FAF7F2',
                        fontFamily: 'var(--font-dm-sans)',
                        fontStyle: 'italic',
                      }}
                    >
                      &ldquo;{bubble.command}&rdquo;
                    </span>
                  </div>
                  {/* Response row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      padding: '0.35rem 0.9rem 0.65rem 0.9rem',
                      borderTop: '1px solid rgba(196,98,45,0.08)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#C4622D',
                        marginTop: '0.05rem',
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'rgba(196,98,45,0.85)',
                        fontFamily: 'var(--font-dm-sans)',
                        lineHeight: 1.5,
                      }}
                    >
                      {bubble.response}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isMobile && <div />}
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 4 — CTA / PRICING (textSide: center)
        ════════════════════════════════════════════════════════════════════ */}
        <section
          className="ss-panel"
          style={{
            minHeight: isMobile ? '100vh' : '130vh',
            display: 'grid',
            gridTemplateColumns: sectionGrid('center'),
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {/* Scrim : haut transparent (cône flotte librement) → mi-page sombre (texte lisible) */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 0%, transparent 26%, rgba(22,18,14,0.90) 38%, rgba(22,18,14,0.98) 50%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          <div
            className="ss-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              /* paddingTop pousse le titre sous la zone du cône */
              paddingTop: isMobile ? '2rem' : 'clamp(38vh, 42vh, 46vh)',
              paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
              paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
              paddingBottom: isMobile ? '2.5rem' : 'clamp(3rem, 6vh, 5rem)',
              textAlign: 'center',
              position: 'relative',
              zIndex: 2,
              background: 'transparent',
            }}
          >
            {renderTag('Rejoindre NSLysium')}

            {renderWordTitle(
              ['Reach', 'Your', 'Elysium.'],
              ['Your', 'Elysium.'],
              isMobile ? 'clamp(2.5rem, 10vw, 4.5rem)' : 'clamp(3.5rem, 7vw, 6.5rem)'
            )}

            <p
              className="ss-body"
              style={{
                fontSize: isMobile ? '0.90rem' : '1.05rem',
                lineHeight: 1.78,
                color: 'rgba(250,247,242,0.60)',
                marginBottom: '2.5rem',
                maxWidth: '52ch',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Commencez avec ce qui compte pour vous. NSLysium apprend, s'adapte,
              et évolue avec vos objectifs. Pas d'engagement — juste votre
              meilleure version.
            </p>

            {/* Pricing cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '1rem',
                width: '100%',
                maxWidth: '820px',
                marginBottom: '2.5rem',
              }}
            >
              {PRICING_CARDS.map((card, ci) => (
                <div
                  key={ci}
                  className={`ss-pricing-card${card.highlight ? ' glass glow-primary' : ''}`}
                  style={{
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    position: 'relative',
                    background: card.highlight ? undefined : 'rgba(34,30,24,0.6)',
                    border: card.highlight ? undefined : '1px solid rgba(196,98,45,0.13)',
                    textAlign: 'left',
                    backdropFilter: card.highlight ? undefined : 'blur(10px)',
                    WebkitBackdropFilter: card.highlight ? undefined : 'blur(10px)',
                  }}
                >
                  {card.highlight && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#C4622D',
                        color: '#FAF7F2',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontFamily: 'var(--font-dm-sans)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Populaire
                    </div>
                  )}

                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#C4622D',
                        fontFamily: 'var(--font-dm-sans)',
                        marginBottom: '0.3rem',
                      }}
                    >
                      {card.tier}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-fraunces)',
                        color: '#FAF7F2',
                      }}
                    >
                      {card.price}
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                    {card.features.map((feat, fi) => (
                      <li
                        key={fi}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                          fontSize: '0.78rem',
                          color: 'rgba(250,247,242,0.75)',
                          fontFamily: 'var(--font-dm-sans)',
                          marginBottom: '0.45rem',
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: '#C4622D', fontSize: '0.7rem', marginTop: '0.2rem', flexShrink: 0 }}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/abonnement"
                    style={{
                      padding: '0.75rem 1.2rem',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-dm-sans)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      display: 'block',
                      ...(card.highlight
                        ? { background: '#C4622D', color: '#FAF7F2' }
                        : {
                            border: '1px solid rgba(196,98,45,0.35)',
                            color: '#FAF7F2',
                            background: 'transparent',
                          }),
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      if (card.highlight) {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(196,98,45,0.45)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.boxShadow = ''
                    }}
                  >
                    {card.cta}
                  </Link>
                </div>
              ))}
            </div>

            {/* Final CTA row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              <Link
                href="/abonnement"
                className="ss-cta"
                style={btnPrimary}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(196,98,45,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/contact"
                className="ss-cta"
                style={btnGhost}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.borderColor = 'rgba(196,98,45,0.7)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.borderColor = 'rgba(196,98,45,0.38)'
                }}
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
