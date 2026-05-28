'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AetherScene from './AetherScene'
import VoiceSimulator from './VoiceSimulator'

gsap.registerPlugin(ScrollTrigger)

// ─── 3 moments de vie (brief : "mise en situation sport, sommeil, nutrition") ─

const MOMENTS = [
  {
    label: 'Le matin',
    title: 'Aether ouvre votre journée.',
    body:
      "Avant même que vous parliez, il connaît la qualité de votre nuit. Il vous propose une intensité d'entraînement, un petit-déjeuner, un horaire de pause.",
  },
  {
    label: 'En séance',
    title: 'Une voix qui guide, jamais qui interrompt.',
    body:
      "Vous parlez naturellement, même de loin. Aether enregistre, ajuste, encourage. Aucun écran à consulter, aucun bouton à toucher.",
  },
  {
    label: 'Le soir',
    title: 'Un bilan, sans effort.',
    body:
      "Repas, séance, charge mentale. Aether fait la synthèse de votre journée et prépare la suivante. Vous n'avez rien à saisir.",
  },
]

// ═══════════════════════════════════════════════════════════════════════════

// ─── Anchor table : où le cône doit se poser sur l'image salon ────────────
// Coordonnées en fractions de l'image (0..1). Mesuré à l'œil.
const TABLE_X_FRAC = 0.50 // centre horizontal de l'image
const TABLE_Y_FRAC = 0.68 // 68% depuis le top de l'image (centre du plateau marbre)

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const salonOverlayRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef({ progress: 0, section: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })
  const colorRef = useRef('#B59E7D')
  // Anchor du cône en hero (recalculé au resize selon ratio image)
  const heroAnchorRef = useRef({ vx: 0, vy: -0.4, active: true })
  const salonAspectRef = useRef(16 / 9) // ratio image, mesuré au mount
  const [activeSection, setActiveSection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Recalcule la position du cône (Three.js coords) pour qu'il tombe sur la
  // table de l'image salon. L'image est en background-size: cover → croppée
  // pour remplir le viewport. Le cône suit la table qu'importe le crop.
  const recomputeHeroAnchor = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const imageAspect = salonAspectRef.current
    const viewportAspect = vw / vh

    // Algorithme cover : on scale l'image pour remplir, en croppant l'excédent.
    let displayedW: number, displayedH: number, offsetY: number
    if (viewportAspect > imageAspect) {
      // Viewport plus large que l'image → scale par width, crop vertical
      displayedW = vw
      displayedH = vw / imageAspect
      offsetY = (vh - displayedH) / 2 // négatif (image dépasse)
    } else {
      // Viewport plus étroit → scale par height, crop horizontal
      displayedH = vh
      displayedW = vh * imageAspect
      offsetY = 0
    }

    const tableYAbsolute = offsetY + TABLE_Y_FRAC * displayedH
    // Clamp dans le viewport pour éviter que le cône sorte de l'écran sur très grand desktop
    const clampedY = Math.max(vh * 0.55, Math.min(tableYAbsolute, vh * 0.85))
    const tableYfrac = clampedY / vh
    const vy = 1 - 2 * tableYfrac
    heroAnchorRef.current.vy = vy
    heroAnchorRef.current.vx = (TABLE_X_FRAC - 0.5) * 2
    heroAnchorRef.current.active = true
  }

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768)
      recomputeHeroAnchor()
    }
    check()

    // Mesure le ratio réel de l'image salon une seule fois au mount.
    const img = new window.Image()
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        salonAspectRef.current = img.naturalWidth / img.naturalHeight
        recomputeHeroAnchor()
      }
    }
    img.src = '/images/ambient/salon.jpg'

    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // WCAG 2.3.3 : si reduce-motion est demandé, on saute les timelines GSAP
    // décoratives (fade-in tags/words, indicator). Le scroll-driven progress
    // pour AetherScene reste actif (driven by user scroll).
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const globalTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollRef.current.progress = self.progress
        const sec = Math.min(3, Math.floor(self.progress * 4))
        scrollRef.current.section = sec
        setActiveSection((prev) => (prev !== sec ? sec : prev))

        // Salon overlay fade out — visible de 0 à 0.05, fade de 0.05 à 0.18
        if (salonOverlayRef.current) {
          const p = self.progress
          const opacity =
            p < 0.05 ? 1 : p > 0.18 ? 0 : 1 - (p - 0.05) / 0.13
          salonOverlayRef.current.style.opacity = String(opacity)
        }
      },
    })

    const panels = container.querySelectorAll<HTMLElement>('.ss-panel')

    if (prefersReducedMotion) {
      // Sans animation : on force tout en état final visible (opacity 1, no transform).
      container.querySelectorAll<HTMLElement>('.ss-content, .ss-word, .ss-tag').forEach(
        (el) => {
          el.style.opacity = '1'
          el.style.transform = 'none'
        },
      )
    } else {
      panels.forEach((panel, i) => {
        const content = panel.querySelector<HTMLElement>('.ss-content')
        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 48 },
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
            },
          )
        }

        const words = panel.querySelectorAll<HTMLElement>('.ss-word')
        if (words.length) {
          gsap.fromTo(
            words,
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
            },
          )
        }

        const tag = panel.querySelector<HTMLElement>('.ss-tag')
        if (tag) {
          gsap.fromTo(
            tag,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 75%',
                toggleActions: 'play reverse play reverse',
              },
            },
          )
        }

        if (i === 0) {
          const indicator = panel.querySelector<HTMLElement>('.ss-scroll-indicator')
          if (indicator) {
            gsap.to(indicator, { y: 8, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut' })
          }
        }
      })
    }

    return () => {
      globalTrigger.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  // highlightColor : applique une couleur unie aux mots highlights.
  // Défaut #C9B395 (khaki light) — gradient-on-text retiré (ban Impeccable).
  const renderWordTitle = (
    lines: string[],
    highlights: string[],
    fontSize: string,
    highlightColor: string = '#C9B395',
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
          {line.split(' ').map((word, wi) => {
            const isHl = highlights.some((h) => word.startsWith(h))
            return (
              <span
                key={wi}
                className="ss-word"
                style={{
                  display: 'inline-block',
                  marginRight: '0.22em',
                  color: isHl ? highlightColor : undefined,
                }}
              >
                {word}
              </span>
            )
          })}
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
        color: '#B59E7D',
        marginBottom: '1.1rem',
        fontFamily: 'var(--font-dm-sans)',
      }}
    >
      {label}
    </span>
  )

  const titleSize = isMobile
    ? 'clamp(1.85rem, 6vw, 2.6rem)'
    : 'clamp(2.4rem, 4vw, 4.2rem)'

  return (
    <>
      {/* Overlay salon (background hero) — fullscreen cover, fade au scroll.
          L'image source fait 835 Ko (compressée depuis 8.1 Mo via sips). */}
      <div
        ref={salonOverlayRef}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          backgroundColor: '#1F1A14',
          backgroundImage: "url('/images/ambient/salon.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          opacity: 1,
          transition: 'opacity 0.15s linear',
        }}
      />
      {/* Halo sombre — radial centré sur le texte hero, transparent vers la table.
          Aucune démarcation : dégradés doux qui se fondent sur l'image salon. */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          background: isMobile
            ? // Mobile : halo modéré centré sur le bloc texte (qui est au milieu du viewport)
              'radial-gradient(ellipse 100% 55% at 50% 42%, rgba(15, 12, 9, 0.7) 0%, rgba(15, 12, 9, 0.45) 38%, rgba(15, 12, 9, 0.18) 70%, transparent 92%), linear-gradient(180deg, rgba(15, 12, 9, 0.28) 0%, transparent 30%, transparent 72%, rgba(15, 12, 9, 0.35) 100%)'
            : // Desktop : halo ovale modéré, laisse respirer l'image salon
              'radial-gradient(ellipse 55% 70% at 28% 45%, rgba(15, 12, 9, 0.7) 0%, rgba(15, 12, 9, 0.42) 40%, rgba(15, 12, 9, 0.16) 72%, transparent 92%), linear-gradient(180deg, rgba(15, 12, 9, 0.28) 0%, transparent 25%, transparent 75%, rgba(15, 12, 9, 0.35) 100%)',
        }}
      />

      {/* Canvas fixe : cône 3D */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <AetherScene
          scrollRef={scrollRef}
          mouseRef={mouseRef}
          colorRef={colorRef}
          heroAnchorRef={heroAnchorRef}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Indicateur de section */}
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
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: i === activeSection ? 'rgba(181, 158, 125,0.85)' : 'transparent',
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
                background: i === activeSection ? '#B59E7D' : 'rgba(181, 158, 125,0.18)',
                width: i === activeSection ? '20px' : '4px',
                transition: 'all 0.3s ease',
              }}
            />
          </div>
        ))}
      </div>

      <div ref={containerRef} style={{ position: 'relative', zIndex: 10 }}>
        {/* ════ SECTION 0 — HERO ════ */}
        {/* Hero : contenu poussé EN HAUT pour laisser la table libre en bas où */}
        {/* le cône 3D est posé. Layout : texte à gauche, espace vide à droite. */}
        <section
          id="hero"
          className="ss-panel"
          style={{
            minHeight: '100dvh',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
            alignItems: 'start',
          }}
        >
          <div
            className="ss-content ss-hero-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              // Centré vertical sur les deux breakpoints — le content tombe
              // autour du milieu du viewport, le cône respire en bas.
              justifyContent: 'center',
              padding: isMobile
                ? '6rem 1.5rem 6rem'
                : '5rem clamp(2rem, 3vw, 3rem) 5rem clamp(2.5rem, 7vw, 6rem)',
              textAlign: isMobile ? 'center' : 'left',
              minHeight: '100dvh',
              // Pas de voile rectangulaire : la lisibilité est assurée par le halo
              // global dans l'overlay parent + un text-shadow profond sur chaque ligne.
              background: 'transparent',
              textShadow:
                '0 1px 2px rgba(0, 0, 0, 0.85), 0 2px 8px rgba(0, 0, 0, 0.75), 0 4px 24px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 0, 0, 0.45)',
            }}
          >
            {renderTag('Reach Your Elysium')}

            {/* Hero : pas de gradient, "enfin centralisé" en beige khaki uni */}
            {renderWordTitle(
              ['Votre assistant', 'de vie,', 'enfin centralisé'],
              ['enfin', 'centralisé'],
              titleSize,
              '#C9B395',
            )}

            <p
              style={{
                fontSize: isMobile ? '0.95rem' : '1.1rem',
                lineHeight: 1.78,
                color: 'rgba(250,247,242,0.92)',
                marginBottom: '2rem',
                maxWidth: '52ch',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Libérez votre esprit de la logistique santé. NSLysium centralise sport, nutrition et
              sommeil en une interface unifiée, pilotée par la voix, gardée par vous seul.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '0.85rem',
                flexWrap: 'wrap',
                justifyContent: isMobile ? 'center' : 'flex-start',
              }}
            >
              <Link
                href="/produit"
                style={{
                  padding: '0.85rem 1.6rem',
                  borderRadius: '9999px',
                  background: '#B59E7D',
                  color: '#FAF7F2',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-dm-sans)',
                  display: 'inline-block',
                }}
              >
                Découvrir le produit
              </Link>
              <Link
                href="/abonnement"
                style={{
                  padding: '0.85rem 1.6rem',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(181, 158, 125,0.45)',
                  color: '#FAF7F2',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-dm-sans)',
                  display: 'inline-block',
                  background: 'transparent',
                }}
              >
                Commencer
              </Link>
            </div>

            <div
              className="ss-scroll-indicator"
              style={{
                display: isMobile ? 'none' : 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                marginTop: '3rem',
                color: '#C9B395',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-dm-sans)',
                textShadow:
                  '0 1px 2px rgba(0, 0, 0, 0.85), 0 2px 8px rgba(0, 0, 0, 0.6)',
              }}
            >
              <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="12"
                  height="18"
                  rx="6"
                  stroke="#C9B395"
                  strokeWidth="1.4"
                />
                <circle cx="7" cy="6" r="2" fill="#B59E7D" />
              </svg>
              Découvrir
            </div>
          </div>
          {!isMobile && <div />}
        </section>

        {/* ════ SECTION 1 — SIMULATION IA VOCALE ════
             Desktop : texte gauche / VoiceSimulator droite (cône 3D passe à droite).
             Mobile : empilé, texte en haut, simulator en bas. */}
        <section
          id="voix"
          className="ss-panel"
          style={{
            minHeight: '100dvh',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            alignItems: 'center',
            gap: isMobile ? '2rem' : 'clamp(2rem, 5vw, 4rem)',
            padding: isMobile
              ? 'clamp(3rem, 8vh, 6rem) clamp(1.5rem, 6vw, 5rem)'
              : 'clamp(4rem, 8vh, 7rem) clamp(2.5rem, 7vw, 6rem)',
            position: 'relative',
          }}
        >
          <div
            className="ss-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              textAlign: isMobile ? 'center' : 'left',
              maxWidth: isMobile ? '100%' : '560px',
            }}
          >
            <div>
              {renderTag('Parlez. Aether écoute.')}
              {renderWordTitle(
                ['Une voix.', 'Tout votre quotidien.'],
                ['Tout'],
                isMobile ? 'clamp(1.6rem, 5.5vw, 2.4rem)' : 'clamp(1.8rem, 2.8vw, 2.8rem)',
              )}

              <p
                style={{
                  fontSize: isMobile ? '0.92rem' : '1rem',
                  lineHeight: 1.7,
                  color: 'rgba(250,247,242,0.62)',
                  maxWidth: '52ch',
                  margin: isMobile ? '1rem auto 0' : '1rem 0 0',
                  fontFamily: 'var(--font-dm-sans)',
                }}
              >
                Aether comprend ce que vous lui dites. Il enregistre, ajuste, vous répond. Sans
                écran, sans saisie, sans friction.
              </p>
            </div>

            <VoiceSimulator />
          </div>

          {/* Colonne droite : laissée libre pour le cône 3D (AetherScene) */}
          {!isMobile && <div aria-hidden />}
        </section>

        {/* ════ SECTION 2 — TROIS MOMENTS DE VIE ════ */}
        <section
          id="moments"
          className="ss-panel"
          style={{
            minHeight: '100dvh',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
            alignItems: isMobile ? 'flex-end' : 'stretch',
          }}
        >
          {!isMobile && <div />}
          <div
            className="ss-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: isMobile
                ? '2rem 1.5rem clamp(2rem, 5vh, 3.5rem)'
                : '5rem clamp(2.5rem, 7vw, 6rem) 4rem clamp(2rem, 3vw, 3rem)',
              textAlign: isMobile ? 'center' : 'left',
              background: isMobile ? 'rgba(22,18,14,0.72)' : 'transparent',
              backdropFilter: isMobile ? 'blur(14px)' : 'none',
              WebkitBackdropFilter: isMobile ? 'blur(14px)' : 'none',
              borderRadius: isMobile ? '1.25rem 1.25rem 0 0' : '0',
              borderTop: isMobile ? '1px solid rgba(181, 158, 125,0.15)' : 'none',
            }}
          >
            {renderTag('Une journée avec Aether')}
            {renderWordTitle(
              ['Du réveil', 'au coucher,', 'il orchestre.'],
              ['orchestre.'],
              titleSize,
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              {MOMENTS.map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1.25rem 1.4rem',
                    borderRadius: '0.85rem',
                    background: '#2A241D',
                    border: '1px solid rgba(181, 158, 125,0.14)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#B59E7D',
                      marginBottom: '0.4rem',
                      fontFamily: 'var(--font-dm-sans)',
                    }}
                  >
                    {m.label}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-fraunces)',
                      fontWeight: 400,
                      fontSize: '1.15rem',
                      color: '#FAF7F2',
                      lineHeight: 1.3,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {m.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.83rem',
                      lineHeight: 1.6,
                      color: 'rgba(250,247,242,0.55)',
                      fontFamily: 'var(--font-dm-sans)',
                      margin: 0,
                    }}
                  >
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ SECTION 3 — CTA FINAL ════ */}
        <section
          id="commencer"
          className="ss-panel"
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 6vw, 5rem)',
            position: 'relative',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, transparent 0%, transparent 18%, rgba(22,18,14,0.92) 38%, rgba(22,18,14,0.98) 60%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          <div className="ss-content" style={{ position: 'relative', zIndex: 2 }}>
            {renderTag('Rejoindre NSLysium')}
            {renderWordTitle(
              ['Reach', 'Your', 'Elysium.'],
              ['Your', 'Elysium.'],
              isMobile ? 'clamp(2.5rem, 10vw, 4.5rem)' : 'clamp(3.5rem, 7vw, 6.5rem)',
            )}

            <p
              style={{
                fontSize: isMobile ? '0.95rem' : '1.1rem',
                lineHeight: 1.78,
                color: 'rgba(250,247,242,0.62)',
                maxWidth: '52ch',
                margin: '0 auto 2.5rem',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Commencez avec ce qui compte pour vous. NSLysium s'adapte à vos objectifs, en silence.
              Sans engagement.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '0.85rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Link
                href="/abonnement"
                style={{
                  padding: '0.95rem 2rem',
                  borderRadius: '9999px',
                  background: '#B59E7D',
                  color: '#FAF7F2',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-dm-sans)',
                  display: 'inline-block',
                }}
              >
                Choisir un abonnement
              </Link>
              <Link
                href="/produit"
                style={{
                  padding: '0.95rem 2rem',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(181, 158, 125,0.45)',
                  color: '#FAF7F2',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-dm-sans)',
                  display: 'inline-block',
                  background: 'transparent',
                }}
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
