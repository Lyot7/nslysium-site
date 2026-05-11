'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AetherScene from './AetherScene'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ─────────────────────────────────────────────────────────────────

interface EcosystemStep { icon: string; label: string; sub: string }
interface SpecCard { icon: string; tag: string; label: string; sub: string; value: string }
interface ChatBubble { icon: string; category: string; categoryColor: string; command: string; response: string }
interface PricingCard { tier: string; price: string; period?: string; highlight: boolean; badge?: string; features: string[]; cta: string }
interface AetherColoris { name: string; hex: string; border: string; description: string; context: string; packaging: string }
interface WearableCard { icon: string; brand: string; detail: string; metrics: string[] }
interface MarketStat { value: string; label: string; source: string }

// ─── Données statiques ─────────────────────────────────────────────────────

const ECOSYSTEM_STEPS: EcosystemStep[] = [
  { icon: '⌚', label: 'Connecte ta montre', sub: 'Apple Watch · Garmin · Samsung · Fitbit · Whoop · Withings · Polar · Suunto' },
  { icon: '🎙', label: 'Parle à Aether', sub: 'IA locale · 3 micros beamforming · portée 5m · latence <80ms' },
  { icon: '📊', label: 'Visualise tout', sub: 'Sport · Nutrition · Sommeil · Agenda · 45+ activités' },
]

const MARKET_STATS: MarketStat[] = [
  { value: '995 Mrd $', label: 'marché santé numérique d\'ici 2032', source: '+22,2 %/an' },
  { value: '30 %', label: 'des Français ont une enceinte connectée', source: 'Étude 2024' },
  { value: '78 %', label: 'des Européens : confidentialité = critère n°1', source: 'RGPD Report' },
]

const AETHER_COLORIS: AetherColoris[] = [
  { name: 'Blanc', hex: '#F1EADA', border: 'rgba(241,234,218,0.7)', description: 'Egg Shell', context: 'Salon moderne, marbre & végétation', packaging: 'Egg Shell + marbre blanc' },
  { name: 'Orange', hex: '#F1983A', border: 'rgba(241,152,58,0.7)', description: 'Carrot Orange', context: 'Cuisine ouverte, lumière naturelle', packaging: 'Carrot Orange + bois clair' },
  { name: 'Noir', hex: '#1C1410', border: 'rgba(80,60,40,0.6)', description: 'Rich Mahogany', context: 'Salle de bain, rituels soin & récupération', packaging: 'Rich Mahogany + chêne naturel brun' },
  { name: 'Bordeaux', hex: '#6B1F2A', border: 'rgba(107,31,42,0.6)', description: 'Deep Bordeaux', context: 'Bureau, espace de travail premium', packaging: 'Bordeaux + cuir naturel FSC' },
  { name: 'Beige', hex: '#B59E7D', border: 'rgba(181,158,125,0.6)', description: 'Khaki Beige', context: 'Chambre, espace détente & sommeil', packaging: 'Khaki + bois clair FSC' },
]

const AETHER_SPECS: SpecCard[] = [
  { icon: '🎙', tag: 'Audio', label: '3 micros directionnels', sub: 'Beamforming · annulation bruit active', value: 'Portée 5m · latence <80ms' },
  { icon: '🔒', tag: 'IA locale', label: 'Zéro cloud obligatoire', sub: 'NLP embarqué · apprentissage progressif', value: 'Chiffrement AES-256' },
  { icon: '📡', tag: 'Connectivité', label: 'Bluetooth 5.2 & WiFi 6', sub: 'Dual-band · sync automatique', value: 'BT 30m · sync <200ms' },
  { icon: '💧', tag: 'Robustesse', label: 'IP54 certifié', sub: 'Projections d\'eau, vapeur, cuisine', value: '-10°C à +50°C' },
  { icon: '🔋', tag: 'Autonomie', label: '8h d\'utilisation', sub: 'Recharge USB-C 90 min', value: 'Veille 30 jours' },
  { icon: '◎', tag: 'Design', label: 'Forme conique sans écran', sub: 'Bande lumineuse tactile en base', value: '100% vocal' },
]

const WEARABLES_DETAILED: WearableCard[] = [
  { icon: '⌚', brand: 'Apple Watch', detail: 'Série 9 & Ultra 2', metrics: ['FC continu', 'SpO2', 'ECG', 'Récupération'] },
  { icon: '🏃', brand: 'Garmin', detail: 'Forerunner & Fenix', metrics: ['GPS précis', 'VO2max', 'Training Load', 'HRV'] },
  { icon: '📱', brand: 'Samsung', detail: 'Galaxy Watch 6 / 7', metrics: ['BioActive', 'Énergie', 'Cycles sommeil', 'Température'] },
  { icon: '🔥', brand: 'Fitbit', detail: 'Sense 2 & Charge 6', metrics: ['Pas', 'Stress EDA', 'SpO2', 'Skin temp'] },
  { icon: '💙', brand: 'Withings', detail: 'ScanWatch & Body+', metrics: ['ECG', 'Apnée du sommeil', 'Poids', 'Masse grasse'] },
  { icon: '🎯', brand: 'Polar', detail: 'Vantage V3 & Grit', metrics: ['Training Load Pro', 'Nightly recharge', 'Récup. musculaire', 'Course 3D'] },
  { icon: '🏔', brand: 'Suunto', detail: 'Vertical & Race', metrics: ['Trail GPS', 'Plongée', 'Navigation', 'Altitude'] },
  { icon: '⚡', brand: 'Whoop', detail: 'Whoop 4.0', metrics: ['Strain 24/7', 'Récupération', 'Sommeil profond', 'HRV nuit'] },
]

const APP_PILLS = [
  { icon: '🏋️', label: 'Sport & Performance', sub: '45+ activités · séances, records, VO2Max' },
  { icon: '🥗', label: 'Nutrition intelligente', sub: 'Calories, macros, hydratation, suivi repas' },
  { icon: '💤', label: 'Sommeil & récupération', sub: 'Score qualité, cycles, apnée, HRV nuit' },
  { icon: '📅', label: 'Organisation vocale', sub: 'Agenda, rappels, objectifs, bilans quotidiens' },
  { icon: '🧠', label: '4 tons IA', sub: 'Bienveillant · motivant · direct · humoristique' },
  { icon: '❤️', label: 'Fiche santé complète', sub: 'Blessures, médicaments, groupe sanguin' },
]

const CHAT_BUBBLES: ChatBubble[] = [
  { icon: '🏋️', category: 'Sport', categoryColor: '#C4622D', command: 'Lance un HIIT 30 min', response: 'C\'est parti ! Durée 30 min · intensité modérée (récupération 78%) · playlist Cardio lancée' },
  { icon: '🍕', category: 'Nutrition', categoryColor: '#D4773F', command: "J'ai mangé une pizza", response: 'Noté ! 820 kcal · glucides +64g · macros du jour ajustées · il vous reste 540 kcal ce soir' },
  { icon: '🌙', category: 'Sommeil', categoryColor: '#8B7CF6', command: "Comment j'ai dormi ?", response: '7h12 · score 78/100 · +12% vs la semaine · HRV : 58ms · bonne journée pour s\'entraîner ✓' },
  { icon: '📅', category: 'Organisation', categoryColor: '#4BAED4', command: "Rappelle-moi d'appeler Paul ce soir", response: 'Rappel créé à 19h00 · calendrier mis à jour · je vous préviens 5 min avant' },
  { icon: '🏃', category: 'Trail', categoryColor: '#5C8A6E', command: "Prépare ma sortie trail de demain", response: 'Sortie 14 km planifiée · D+ 420m · météo 16°C · rappel : ceinture hydratation recommandée' },
  { icon: '⚡', category: 'Récupération', categoryColor: '#7B68D4', command: 'Mon score Whoop ce matin ?', response: 'Récupération 83% 🟢 · HRV nuit 62ms (+8 vs moy.) · Strain hier 14.2 · entraînement modéré possible' },
]

const PRICING_CARDS: PricingCard[] = [
  {
    tier: 'FREEMIUM',
    price: 'Gratuit',
    highlight: false,
    features: [
      '1 pilier santé (sport OU nutrition OU sommeil)',
      '50 commandes vocales / mois',
      'Tableau de bord essentiel',
      'Sync 1 wearable',
      'Historique 7 jours',
    ],
    cta: 'Télécharger gratuitement',
  },
  {
    tier: 'PREMIUM',
    price: '9,99€',
    period: '/mois',
    highlight: true,
    badge: 'Populaire',
    features: [
      'Sport + Nutrition + Sommeil unifiés',
      'Commandes vocales illimitées',
      'Coach IA personnalisé (4 tons)',
      'Tous les wearables compatibles',
      'Historique illimité + export CSV',
      'Planification entraînement IA',
    ],
    cta: 'Essayer 14j gratuits',
  },
  {
    tier: 'PRO',
    price: '19,99€',
    period: '/mois',
    highlight: false,
    features: [
      'Tout ce qu\'inclut Premium',
      'Agenda + Outlook · iCal · Google Calendar',
      'Domotique : Google Home · Amazon Alexa',
      'Export données brutes + accès API',
      'Support prioritaire 4h',
      'Accès bêta fonctionnalités',
    ],
    cta: 'Découvrir Pro',
  },
]

const BRAND_VALUES = [
  { icon: '✦', label: 'Simplicité', desc: 'Zéro saisie, zéro friction' },
  { icon: '◎', label: 'Harmonie', desc: 'Corps, esprit, agenda unifiés' },
  { icon: '🔒', label: 'Confiance', desc: 'IA locale, données chez vous' },
  { icon: '⚡', label: 'Excellence', desc: 'Standards Apple / Tesla' },
  { icon: '☽', label: 'Sérénité', desc: 'Votre Elysium numérique' },
]

// ─── App Store Badges ───────────────────────────────────────────────────────

function AppBadge({ type, className }: { type: 'ios' | 'android'; className?: string }) {
  return (
    <a
      href="#"
      className={className}
      onClick={(e) => e.preventDefault()}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', padding: '0.7rem 1.3rem', borderRadius: '12px', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s', fontFamily: 'var(--font-dm-sans)', ...(type === 'ios' ? { background: '#FAF7F2', color: '#16120E' } : { border: '1px solid rgba(196,98,45,0.38)', color: '#FAF7F2', background: 'transparent' }) }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = type === 'ios' ? '0 8px 24px rgba(250,247,242,0.2)' : '0 8px 24px rgba(196,98,45,0.3)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      {type === 'ios' ? (
        <svg width="18" height="22" viewBox="0 0 384 512" fill="#16120E">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
        </svg>
      ) : (
        <svg width="18" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3.18 23.18a2 2 0 01-.93-.53 2.14 2.14 0 01-.5-1.49V2.84a2.14 2.14 0 01.5-1.49 2 2 0 01.95-.54L14.08 12 3.18 23.18z" fill="#4285F4"/>
          <path d="M18.76 14.74l-2.86-1.63-3.26 3.26 3.26 3.26 2.9-1.65a1.55 1.55 0 000-2.98v-.26z" fill="#FBBC05"/>
          <path d="M14.08 12L3.18.82A2 2 0 013.68.29L14.08 12z" fill="#EA4335"/>
          <path d="M14.08 12l3.82 3.82-3.26 3.26L3.68 23.71l10.4-11.71z" fill="#34A853"/>
        </svg>
      )}
      <div>
        <span style={{ display: 'block', fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, lineHeight: 1 }}>
          {type === 'ios' ? 'Télécharger sur' : 'Disponible sur'}
        </span>
        <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.2 }}>
          {type === 'ios' ? 'App Store' : 'Google Play'}
        </span>
      </div>
    </a>
  )
}

// ─── Composant principal ────────────────────────────────────────────────────

export default function ScrollStory() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const scrollRef     = useRef({ progress: 0, section: 0 })
  const mouseRef      = useRef({ x: 0, y: 0 })
  const [activeSection, setActiveSection] = useState(0)
  const [isMobile, setIsMobile]           = useState(false)
  const [activeColoris, setActiveColoris] = useState(0)

  const specBarRef = useRef<HTMLDivElement>(null)

  const smoothScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
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

    const globalTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollRef.current.progress = self.progress
        const sec = Math.min(5, Math.floor(self.progress * 6))
        scrollRef.current.section = sec
        setActiveSection((prev) => (prev !== sec ? sec : prev))
      },
    })

    const panels = container.querySelectorAll<HTMLElement>('.ss-panel')

    panels.forEach((panel, i) => {
      const content = panel.querySelector<HTMLElement>('.ss-content')
      if (content) {
        gsap.fromTo(content, { opacity: 0, y: 52 }, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 72%', toggleActions: 'play reverse play reverse' },
        })
      }

      const wordSpans = panel.querySelectorAll<HTMLElement>('.ss-word')
      if (wordSpans.length) {
        gsap.fromTo(wordSpans, { opacity: 0, y: 28, rotateX: -15 }, {
          opacity: 1, y: 0, rotateX: 0, stagger: 0.055, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 68%', toggleActions: 'play reverse play reverse' },
        })
      }

      const tag = panel.querySelector<HTMLElement>('.ss-tag')
      if (tag) {
        gsap.fromTo(tag, { opacity: 0, x: -10, skewX: 6 }, {
          opacity: 1, x: 0, skewX: 0, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: panel, start: 'top 75%', toggleActions: 'play reverse play reverse' },
        })
      }

      const items = panel.querySelectorAll<HTMLElement>('.ss-item')
      if (items.length) {
        gsap.fromTo(items, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 62%', toggleActions: 'play reverse play reverse' },
        })
      }

      if (i === 0) {
        const scrollIndicator = panel.querySelector<HTMLElement>('.ss-scroll-indicator')
        if (scrollIndicator) {
          gsap.to(scrollIndicator, { y: 8, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut' })
        }
      }

      if (i === 1 && specBarRef.current) {
        gsap.fromTo(specBarRef.current, { scaleX: 0 }, {
          scaleX: 1, duration: 1.2, ease: 'power2.inOut', transformOrigin: 'left center',
          scrollTrigger: { trigger: panel, start: 'top 65%', toggleActions: 'play reverse play reverse' },
        })
      }

      const body = panel.querySelector<HTMLElement>('.ss-body')
      if (body) {
        gsap.fromTo(body, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: panel, start: 'top 64%', toggleActions: 'play reverse play reverse' },
        })
      }

      const ctas = panel.querySelectorAll<HTMLElement>('.ss-cta')
      if (ctas.length) {
        gsap.fromTo(ctas, { opacity: 0, y: 24, scale: 0.96 }, {
          opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.65, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: panel, start: 'top 58%', toggleActions: 'play reverse play reverse' },
        })
      }

      if (i === 4) {
        const pricingCards = panel.querySelectorAll<HTMLElement>('.ss-pricing-card')
        if (pricingCards.length) {
          gsap.fromTo(pricingCards, { opacity: 0, y: 50, scale: 0.94 }, {
            opacity: 1, y: 0, scale: 1, stagger: 0.13, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 62%', toggleActions: 'play reverse play reverse' },
          })
        }
      }
    })

    return () => {
      globalTrigger.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderWordTitle = (lines: string[], highlights: string[], fontSize: string) => (
    <h2 style={{ color: '#FAF7F2', fontSize, fontWeight: 300, lineHeight: 1.08, marginBottom: '1.25rem', fontFamily: 'var(--font-fraunces)', perspective: '600px' }}>
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {line.split(' ').map((word, wi) => (
            <span key={wi} className={`ss-word${highlights.some((h) => word.startsWith(h)) ? ' text-gradient' : ''}`} style={{ display: 'inline-block', marginRight: '0.22em' }}>
              {word}
            </span>
          ))}
        </span>
      ))}
    </h2>
  )

  const renderTag = (label: string) => (
    <span className="ss-tag" style={{ display: 'inline-block', fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4622D', marginBottom: '1.1rem', fontFamily: 'var(--font-dm-sans)' }}>
      {label}
    </span>
  )

  const titleSize = isMobile ? 'clamp(1.7rem, 5.5vw, 2.5rem)' : 'clamp(2.2rem, 3.8vw, 4rem)'

  type TextSide = 'left' | 'right' | 'center'
  const sectionGrid = (side: TextSide) => {
    if (isMobile) return '1fr'
    if (side === 'center') return '1fr'
    if (side === 'left') return '2fr 1fr'
    return '1fr 2fr'
  }
  const contentPadding = (side: TextSide) => {
    if (isMobile) return '2rem 1.5rem clamp(2rem, 5vh, 3.5rem)'
    if (side === 'center') return `0 clamp(2rem, 6vw, 5rem) clamp(3rem, 6vh, 5rem)`
    if (side === 'left') return `5rem clamp(1.5rem, 3vw, 2.5rem) 4rem clamp(2.5rem, 7vw, 6rem)`
    return `5rem clamp(2.5rem, 7vw, 6rem) 4rem clamp(3rem, 5vw, 4.5rem)`
  }

  const col = AETHER_COLORIS[activeColoris]

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <>
      {/* ── Canvas fixe fullscreen ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <AetherScene scrollRef={scrollRef} mouseRef={mouseRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* ── Indicateur de section ── */}
      <div style={{ position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 20, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'flex-end' }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: i === activeSection ? 'rgba(196,98,45,0.85)' : 'transparent', transform: i === activeSection ? 'translateX(0)' : 'translateX(6px)', transition: 'all 0.3s ease', fontFamily: 'var(--font-dm-sans)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div style={{ height: '4px', borderRadius: '2px', background: i === activeSection ? '#C4622D' : 'rgba(196,98,45,0.18)', width: i === activeSection ? '20px' : '4px', transition: 'all 0.3s ease' }} />
          </div>
        ))}
      </div>

      {/* ── Contenu scrollable ── */}
      <div ref={containerRef} style={{ position: 'relative', zIndex: 10 }}>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 0 — HERO
        ════════════════════════════════════════════════════════════════════ */}
        <section id="hero" className="ss-panel" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: sectionGrid('left'), alignItems: isMobile ? 'flex-end' : 'stretch' }}>
          <div className="ss-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', padding: contentPadding('left'), textAlign: isMobile ? 'center' : 'left', background: isMobile ? 'rgba(22, 18, 14, 0.72)' : 'transparent', backdropFilter: isMobile ? 'blur(14px)' : 'none', WebkitBackdropFilter: isMobile ? 'blur(14px)' : 'none', borderRadius: isMobile ? '1.25rem 1.25rem 0 0' : '0', borderTop: isMobile ? '1px solid rgba(196,98,45,0.15)' : 'none' }}>
            {renderTag('Le cerveau de ta vie quotidienne')}

            {renderWordTitle(
              ['Votre assistant', 'de vie,', 'enfin centralisé'],
              ['enfin', 'centralisé'],
              titleSize
            )}

            {/* ── 3 étapes du système ── */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '0.65rem', marginBottom: '1.75rem' }}>
              {ECOSYSTEM_STEPS.map((step, si) => (
                <div key={si} className="ss-item" style={{ padding: '1.1rem 1rem', borderRadius: '0.9rem', background: 'rgba(196,98,45,0.06)', border: '1px solid rgba(196,98,45,0.14)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{step.icon}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FAF7F2', fontFamily: 'var(--font-dm-sans)', lineHeight: 1.2 }}>{step.label}</span>
                  <span style={{ fontSize: '0.63rem', color: 'rgba(250,247,242,0.42)', fontFamily: 'var(--font-dm-sans)', lineHeight: 1.5 }}>{step.sub}</span>
                </div>
              ))}
            </div>

            <p className="ss-body" style={{ fontSize: isMobile ? '0.90rem' : '1.05rem', lineHeight: 1.78, color: 'rgba(250,247,242,0.60)', marginBottom: '1.25rem', maxWidth: '52ch', fontFamily: 'var(--font-dm-sans)' }}>
              Parlez à Aether. NSLysium centralise sport, nutrition, sommeil et agenda
              en un seul tableau de bord — sans rien saisir manuellement.
              <em style={{ display: 'block', marginTop: '0.5rem', color: 'rgba(250,247,242,0.38)', fontSize: '0.88em', fontStyle: 'normal' }}>
                &ldquo;Libérez votre esprit de la logistique santé.&rdquo;
              </em>
            </p>

            {/* ── Données marché ── */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {MARKET_STATS.map((stat, si) => (
                <div key={si} className="ss-item" style={{ padding: '0.75rem 0.9rem', borderRadius: '0.65rem', background: 'rgba(196,98,45,0.04)', border: '1px solid rgba(196,98,45,0.1)', textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#C4622D', fontFamily: 'var(--font-fraunces)', lineHeight: 1.1, marginBottom: '0.25rem' }}>{stat.value}</span>
                  <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(250,247,242,0.5)', fontFamily: 'var(--font-dm-sans)', lineHeight: 1.4, marginBottom: '0.15rem' }}>{stat.label}</span>
                  <span style={{ display: 'block', fontSize: '0.55rem', color: '#C4622D', fontFamily: 'var(--font-dm-sans)', opacity: 0.6, letterSpacing: '0.06em' }}>{stat.source}</span>
                </div>
              ))}
            </div>

            {/* ── App Store badges ── */}
            <div className="ss-cta" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: isMobile ? 'center' : 'flex-start', marginBottom: '0.85rem' }}>
              <AppBadge type="ios" />
              <AppBadge type="android" />
            </div>

            <p style={{ fontSize: '0.65rem', color: 'rgba(250,247,242,0.32)', fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.04em', textAlign: isMobile ? 'center' : 'left', marginBottom: '1.5rem' }}>
              Se connecte à Apple Health · Google Fit · Garmin · Fitbit · Whoop · Withings · Polar · Suunto
            </p>

            {!isMobile && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {[0, 1, 2, 3, 4, 5].map((j) => (
                  <div key={j} style={{ height: '4px', borderRadius: '2px', background: j === activeSection ? '#C4622D' : 'rgba(196,98,45,0.22)', width: j === activeSection ? '22px' : '4px', transition: 'all 0.4s ease' }} />
                ))}
              </div>
            )}

            <div className="ss-scroll-indicator" style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', color: 'rgba(250,247,242,0.35)', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-dm-sans)' }}>
              <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                <rect x="1" y="1" width="12" height="18" rx="6" stroke="rgba(250,247,242,0.35)" strokeWidth="1.2" />
                <circle cx="7" cy="6" r="2" fill="rgba(196,98,45,0.7)" />
              </svg>
              Scroll
            </div>
          </div>
          {!isMobile && <div />}
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1 — ENCEINTE AETHER
        ════════════════════════════════════════════════════════════════════ */}
        <section id="produit" className="ss-panel" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: sectionGrid('left'), alignItems: isMobile ? 'flex-end' : 'stretch' }}>
          <div className="ss-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', padding: contentPadding('left'), textAlign: isMobile ? 'center' : 'left', background: isMobile ? 'rgba(22, 18, 14, 0.72)' : 'transparent', backdropFilter: isMobile ? 'blur(14px)' : 'none', WebkitBackdropFilter: isMobile ? 'blur(14px)' : 'none', borderRadius: isMobile ? '1.25rem 1.25rem 0 0' : '0', borderTop: isMobile ? '1px solid rgba(196,98,45,0.15)' : 'none' }}>
            {renderTag("L'enceinte Aether — Sub-brand NSLysium")}
            {renderWordTitle(['3 microphones.', 'IA locale.', 'Zéro compromis.'], ['Zéro'], titleSize)}

            <p className="ss-body" style={{ fontSize: isMobile ? '0.90rem' : '1.05rem', lineHeight: 1.78, color: 'rgba(250,247,242,0.60)', marginBottom: '1.25rem', maxWidth: '52ch', fontFamily: 'var(--font-dm-sans)' }}>
              Posez Aether dans votre salon ou votre salle de bain. Parlez normalement —
              même avec de la musique en fond. Tout est traité sur l'appareil :
              personne d'autre n'écoute. Chiffrement AES-256, IA embarquée.
            </p>

            {/* ── Sélecteur de coloris ── */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 600, color: 'rgba(250,247,242,0.45)', fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  5 coloris
                </span>
                <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                  {AETHER_COLORIS.map((c, ci) => (
                    <button
                      key={ci}
                      onClick={() => setActiveColoris(ci)}
                      title={`${c.name} — ${c.description}`}
                      style={{ width: ci === activeColoris ? '22px' : '16px', height: ci === activeColoris ? '22px' : '16px', borderRadius: '50%', background: c.hex, border: ci === activeColoris ? `2px solid ${c.hex}` : '1.5px solid rgba(250,247,242,0.15)', outline: ci === activeColoris ? `2px solid rgba(250,247,242,0.3)` : 'none', outlineOffset: '2px', cursor: 'pointer', transition: 'all 0.25s ease', flexShrink: 0 }}
                    />
                  ))}
                </div>
              </div>

              {/* Coloris info card */}
              <div style={{ padding: '0.8rem 1rem', borderRadius: '0.75rem', background: `rgba(${col.hex === '#1C1410' ? '28,20,16' : col.hex === '#6B1F2A' ? '107,31,42' : col.hex === '#B59E7D' ? '181,158,125' : col.hex === '#F1983A' ? '241,152,58' : '241,234,218'},0.06)`, border: `1px solid ${col.border}`, transition: 'all 0.3s ease', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: col.hex, flexShrink: 0, marginTop: '0.1rem', boxShadow: `0 4px 12px ${col.hex}44` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FAF7F2', fontFamily: 'var(--font-dm-sans)' }}>Aether {col.name}</span>
                    <span style={{ fontSize: '0.6rem', color: 'rgba(250,247,242,0.4)', fontFamily: 'var(--font-dm-sans)' }}>{col.description}</span>
                  </div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(250,247,242,0.55)', fontFamily: 'var(--font-dm-sans)', marginBottom: '0.2rem' }}>
                    📍 {col.context}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.62rem', color: 'rgba(250,247,242,0.3)', fontFamily: 'var(--font-dm-sans)' }}>
                    🎁 Coffret : {col.packaging}
                  </span>
                </div>
              </div>
            </div>

            <div ref={specBarRef} style={{ height: '1px', background: 'linear-gradient(90deg, #C4622D, transparent)', marginBottom: '1.25rem', transformOrigin: 'left center' }} />

            {/* Spec cards avec tag + valeur */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '0.55rem' }}>
              {AETHER_SPECS.map((spec, si) => (
                <div key={si} className="ss-item feature-card" style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', textAlign: 'left', transition: 'border-color 0.25s', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1rem', lineHeight: 1 }}>{spec.icon}</span>
                    <span style={{ fontSize: '0.55rem', fontWeight: 700, color: '#C4622D', fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{spec.tag}</span>
                  </div>
                  <span style={{ display: 'block', fontSize: '0.77rem', fontWeight: 600, color: '#FAF7F2', fontFamily: 'var(--font-dm-sans)', lineHeight: 1.25 }}>{spec.label}</span>
                  <span style={{ fontSize: '0.63rem', color: 'rgba(250,247,242,0.42)', fontFamily: 'var(--font-dm-sans)', lineHeight: 1.4 }}>{spec.sub}</span>
                  <span style={{ fontSize: '0.62rem', color: 'rgba(196,98,45,0.7)', fontFamily: 'var(--font-dm-sans)', marginTop: '0.15rem', fontWeight: 600 }}>{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Packaging line */}
            <p style={{ fontSize: '0.62rem', color: 'rgba(250,247,242,0.25)', fontFamily: 'var(--font-dm-sans)', marginTop: '1rem', fontStyle: 'italic', textAlign: isMobile ? 'center' : 'left' }}>
              Packaging : bois massif FSC + biocomposites minéraux · design zéro plastique
            </p>
          </div>
          {!isMobile && <div />}
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 2 — APP BETALYSIUM
        ════════════════════════════════════════════════════════════════════ */}
        <section id="app" className="ss-panel" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: sectionGrid('right'), alignItems: isMobile ? 'flex-end' : 'stretch' }}>
          {!isMobile && <div />}
          <div className="ss-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', padding: contentPadding('right'), textAlign: isMobile ? 'center' : 'left', background: isMobile ? 'rgba(22, 18, 14, 0.72)' : 'transparent', backdropFilter: isMobile ? 'blur(14px)' : 'none', WebkitBackdropFilter: isMobile ? 'blur(14px)' : 'none', borderRadius: isMobile ? '1.25rem 1.25rem 0 0' : '0', borderTop: isMobile ? '1px solid rgba(196,98,45,0.15)' : 'none' }}>
            {renderTag("L'app BetaLysium — Tableau de bord unifié")}
            {renderWordTitle(['Vos données de santé,', 'enfin réunies.'], ['enfin'], titleSize)}

            <p className="ss-body" style={{ fontSize: isMobile ? '0.90rem' : '1.05rem', lineHeight: 1.78, color: 'rgba(250,247,242,0.60)', marginBottom: '1.25rem', maxWidth: '52ch', fontFamily: 'var(--font-dm-sans)' }}>
              La montre capte. L'app comprend. Vous visualisez.
              Sommeil, activité, calories, récupération : tout arrive
              automatiquement depuis votre wearable. Aucune saisie.
            </p>

            {/* ── 8 Wearables compatibles ── */}
            <div style={{ marginBottom: '1.1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 600, color: 'rgba(250,247,242,0.45)', fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>8 wearables compatibles</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(196,98,45,0.15)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
                {WEARABLES_DETAILED.map((w, wi) => (
                  <div key={wi} className="ss-item" style={{ padding: '0.65rem 0.75rem', borderRadius: '0.6rem', background: 'rgba(196,98,45,0.04)', border: '1px solid rgba(196,98,45,0.1)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '0.05rem' }}>{w.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FAF7F2', fontFamily: 'var(--font-dm-sans)' }}>{w.brand}</span>
                        <span style={{ fontSize: '0.58rem', color: 'rgba(250,247,242,0.3)', fontFamily: 'var(--font-dm-sans)' }}>{w.detail}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginTop: '0.3rem' }}>
                        {w.metrics.map((m, mi) => (
                          <span key={mi} style={{ fontSize: '0.55rem', color: 'rgba(250,247,242,0.45)', background: 'rgba(250,247,242,0.04)', padding: '0.1rem 0.35rem', borderRadius: '3px', fontFamily: 'var(--font-dm-sans)', whiteSpace: 'nowrap' }}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services tiers */}
            <div className="ss-item" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.9rem', borderRadius: '0.65rem', background: 'rgba(196,98,45,0.05)', border: '1px solid rgba(196,98,45,0.12)', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 600, color: 'rgba(250,247,242,0.45)', fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0 }}>Aussi connecté à</span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {['🍎 Apple Health', '📅 iCal', '📆 Outlook', '🏠 Google Home', '🔊 Alexa'].map((s) => (
                  <span key={s} style={{ fontSize: '0.63rem', color: '#FAF7F2', background: 'rgba(250,247,242,0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: 'var(--font-dm-sans)' }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Feature pills 6 items */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {APP_PILLS.map((pill, pi) => (
                <div key={pi} className="ss-item" style={{ padding: '0.65rem 0.9rem', borderRadius: '0.65rem', background: 'rgba(196,98,45,0.06)', border: '1px solid rgba(196,98,45,0.13)', textAlign: 'left', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '0.05rem' }}>{pill.icon}</span>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#FAF7F2', fontFamily: 'var(--font-dm-sans)', marginBottom: '0.12rem' }}>{pill.label}</span>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(250,247,242,0.42)', fontFamily: 'var(--font-dm-sans)' }}>{pill.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 3 — CAS D'USAGE
        ════════════════════════════════════════════════════════════════════ */}
        <section id="cas-usage" className="ss-panel" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: sectionGrid('left'), alignItems: isMobile ? 'flex-end' : 'stretch' }}>
          <div className="ss-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', padding: contentPadding('left'), textAlign: isMobile ? 'center' : 'left', background: isMobile ? 'rgba(22, 18, 14, 0.72)' : 'transparent', backdropFilter: isMobile ? 'blur(14px)' : 'none', WebkitBackdropFilter: isMobile ? 'blur(14px)' : 'none', borderRadius: isMobile ? '1.25rem 1.25rem 0 0' : '0', borderTop: isMobile ? '1px solid rgba(196,98,45,0.15)' : 'none' }}>
            {renderTag("Cas d'usage — 45+ activités supportées")}
            {renderWordTitle(["Dites-le,", "NSLysium s'en occupe."], ['NSLysium'], titleSize)}

            <p className="ss-body" style={{ fontSize: isMobile ? '0.90rem' : '1.05rem', lineHeight: 1.78, color: 'rgba(250,247,242,0.60)', marginBottom: '1rem', maxWidth: '52ch', fontFamily: 'var(--font-dm-sans)' }}>
              Le matin, NSLysium vous dit comment vous avez dormi et ce que vous
              devriez manger. Le soir, il fait votre bilan. Entre les deux —
              il enregistre, sans que vous y pensiez.
            </p>

            {/* Badge 45+ sports */}
            <div className="ss-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.85rem', borderRadius: '9999px', background: 'rgba(196,98,45,0.08)', border: '1px solid rgba(196,98,45,0.2)', marginBottom: '1.1rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#C4622D', fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.05em' }}>45+ activités</span>
              <span style={{ fontSize: '0.6rem', color: 'rgba(250,247,242,0.45)', fontFamily: 'var(--font-dm-sans)' }}>Running · Trail · Muscu · CrossFit · Yoga · Natation · Cyclisme · Tennis · Padel · Ski · Escalade · Triathlon · Golf · MMA …</span>
            </div>

            {/* Chat bubbles 6 items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {CHAT_BUBBLES.map((bubble, bi) => (
                <div key={bi} className="ss-item" style={{ borderRadius: '12px', background: 'rgba(196,98,45,0.06)', border: '1px solid rgba(196,98,45,0.15)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.9rem 0.4rem' }}>
                    <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.18rem 0.5rem', borderRadius: '9999px', background: `${bubble.categoryColor}18`, border: `1px solid ${bubble.categoryColor}30`, fontSize: '0.58rem', fontWeight: 700, color: bubble.categoryColor, fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {bubble.icon} {bubble.category}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#FAF7F2', fontFamily: 'var(--font-dm-sans)', fontStyle: 'italic' }}>
                      &ldquo;{bubble.command}&rdquo;
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.3rem 0.9rem 0.6rem', borderTop: '1px solid rgba(196,98,45,0.08)' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#C4622D', marginTop: '0.05rem', flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '0.73rem', color: 'rgba(196,98,45,0.85)', fontFamily: 'var(--font-dm-sans)', lineHeight: 1.5 }}>
                      {bubble.response}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tons IA */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {[{ t: 'Bienveillant', c: '#8B7CF6' }, { t: 'Motivant', c: '#C4622D' }, { t: 'Direct', c: '#4BAED4' }, { t: 'Humoristique', c: '#5C8A6E' }].map(({ t, c }) => (
                <span key={t} style={{ fontSize: '0.62rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', border: `1px solid ${c}40`, color: c, fontFamily: 'var(--font-dm-sans)', fontWeight: 600 }}>
                  {t}
                </span>
              ))}
              <span style={{ fontSize: '0.62rem', color: 'rgba(250,247,242,0.3)', fontFamily: 'var(--font-dm-sans)', alignSelf: 'center' }}>4 tons d'IA disponibles</span>
            </div>
          </div>
          {!isMobile && <div />}
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 4 — CTA / PRICING
        ════════════════════════════════════════════════════════════════════ */}
        <section id="abonnement" className="ss-panel" style={{ minHeight: isMobile ? '100vh' : '140vh', display: 'grid', gridTemplateColumns: sectionGrid('center'), alignItems: 'flex-start', position: 'relative' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, transparent 24%, rgba(22,18,14,0.90) 36%, rgba(22,18,14,0.98) 48%)', pointerEvents: 'none', zIndex: 1 }} />

          <div className="ss-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: isMobile ? '2rem' : 'clamp(38vh, 42vh, 46vh)', paddingLeft: 'clamp(1.5rem, 6vw, 5rem)', paddingRight: 'clamp(1.5rem, 6vw, 5rem)', paddingBottom: isMobile ? '2.5rem' : 'clamp(3rem, 6vh, 5rem)', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            {renderTag('Rejoindre NSLysium')}
            {renderWordTitle(['Reach', 'Your', 'Elysium.'], ['Your', 'Elysium.'], isMobile ? 'clamp(2.5rem, 10vw, 4.5rem)' : 'clamp(3.5rem, 7vw, 6.5rem)')}

            <p className="ss-body" style={{ fontSize: isMobile ? '0.90rem' : '1.05rem', lineHeight: 1.78, color: 'rgba(250,247,242,0.60)', marginBottom: '2rem', maxWidth: '52ch', fontFamily: 'var(--font-dm-sans)' }}>
              Commencez avec ce qui compte pour vous. NSLysium apprend, s'adapte,
              et évolue avec vos objectifs. Pas d'engagement — juste votre
              meilleure version.
            </p>

            {/* Pricing cards */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem', width: '100%', maxWidth: '860px', marginBottom: '2.5rem' }}>
              {PRICING_CARDS.map((card, ci) => (
                <div key={ci} className={`ss-pricing-card${card.highlight ? ' glass glow-primary' : ''}`} style={{ borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', position: 'relative', background: card.highlight ? undefined : 'rgba(34,30,24,0.6)', border: card.highlight ? undefined : '1px solid rgba(196,98,45,0.13)', textAlign: 'left', backdropFilter: card.highlight ? undefined : 'blur(10px)', WebkitBackdropFilter: card.highlight ? undefined : 'blur(10px)' }}>
                  {card.badge && (
                    <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#C4622D', color: '#FAF7F2', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontFamily: 'var(--font-dm-sans)', whiteSpace: 'nowrap' }}>
                      {card.badge}
                    </div>
                  )}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C4622D', fontFamily: 'var(--font-dm-sans)', marginBottom: '0.3rem' }}>{card.tier}</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-fraunces)', color: '#FAF7F2' }}>{card.price}</span>
                      {card.period && <span style={{ fontSize: '0.75rem', color: 'rgba(250,247,242,0.45)', fontFamily: 'var(--font-dm-sans)' }}>{card.period}</span>}
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                    {card.features.map((feat, fi) => (
                      <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.76rem', color: 'rgba(250,247,242,0.75)', fontFamily: 'var(--font-dm-sans)', marginBottom: '0.4rem', lineHeight: 1.5 }}>
                        <span style={{ color: '#C4622D', fontSize: '0.7rem', marginTop: '0.22rem', flexShrink: 0 }}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    style={{ padding: '0.75rem 1.2rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600, textAlign: 'center', textDecoration: 'none', fontFamily: 'var(--font-dm-sans)', transition: 'transform 0.2s, box-shadow 0.2s', display: 'block', cursor: 'pointer', ...(card.highlight ? { background: '#C4622D', color: '#FAF7F2' } : { border: '1px solid rgba(196,98,45,0.35)', color: '#FAF7F2', background: 'transparent' }) }}
                    onClick={(e) => { e.preventDefault(); smoothScrollTo('contact') }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; if (card.highlight) e.currentTarget.style.boxShadow = '0 6px 20px rgba(196,98,45,0.45)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                  >
                    {card.cta}
                  </a>
                </div>
              ))}
            </div>

            {/* Valeurs de marque */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', maxWidth: '700px', width: '100%' }}>
              {BRAND_VALUES.map((v, vi) => (
                <div key={vi} className="ss-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.9rem', borderRadius: '9999px', background: 'rgba(196,98,45,0.05)', border: '1px solid rgba(196,98,45,0.12)' }}>
                  <span style={{ fontSize: '0.85rem' }}>{v.icon}</span>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#FAF7F2', fontFamily: 'var(--font-dm-sans)', lineHeight: 1 }}>{v.label}</span>
                    <span style={{ display: 'block', fontSize: '0.58rem', color: 'rgba(250,247,242,0.35)', fontFamily: 'var(--font-dm-sans)' }}>{v.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ROI / social proof */}
            <div className="ss-item" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', padding: '0.9rem 1.5rem', borderRadius: '0.85rem', background: 'rgba(196,98,45,0.05)', border: '1px solid rgba(196,98,45,0.1)', marginBottom: '2rem' }}>
              {[
                { v: '+470%', l: 'ROI santé B2B (Deloitte)' },
                { v: '+24%', l: 'rétention via sync vocale quotidienne' },
                { v: '88%', l: 'rétention après 18 mois (modèle Oura)' },
              ].map(({ v, l }) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700, color: '#C4622D', fontFamily: 'var(--font-fraunces)' }}>{v}</span>
                  <span style={{ display: 'block', fontSize: '0.62rem', color: 'rgba(250,247,242,0.45)', fontFamily: 'var(--font-dm-sans)', maxWidth: '120px' }}>{l}</span>
                </div>
              ))}
            </div>

            {/* CTA final — App Store badges */}
            <div className="ss-cta" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <AppBadge type="ios" />
              <AppBadge type="android" />
            </div>
            <p style={{ fontSize: '0.65rem', color: 'rgba(250,247,242,0.3)', fontFamily: 'var(--font-dm-sans)' }}>
              Gratuit · Se connecte à votre montre · Données chez vous · IA locale AES-256
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 5 — CONTACT
        ════════════════════════════════════════════════════════════════════ */}
        <section id="contact" className="ss-panel" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr', alignItems: 'center', position: 'relative', background: 'rgba(22,18,14,0.97)' }}>
          <div className="ss-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isMobile ? '6rem 1.5rem 3rem' : 'clamp(5rem, 8vh, 7rem) clamp(2rem, 8vw, 8rem) clamp(3rem, 6vh, 5rem)', textAlign: 'center' }}>
            {renderTag('Contact')}
            {renderWordTitle(['Parlons de votre', 'Elysium.'], ['Elysium.'], isMobile ? 'clamp(1.7rem, 5.5vw, 2.5rem)' : 'clamp(2.2rem, 3.8vw, 3.5rem)')}

            <p className="ss-body" style={{ fontSize: isMobile ? '0.90rem' : '1.05rem', lineHeight: 1.78, color: 'rgba(250,247,242,0.60)', marginBottom: '3rem', maxWidth: '52ch', fontFamily: 'var(--font-dm-sans)' }}>
              Une question, une suggestion, ou envie de collaborer ?
              Notre équipe est là pour vous répondre.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.6fr', gap: '2rem', width: '100%', maxWidth: '900px', textAlign: 'left' }}>
              {/* Left: contact info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { icon: '✉️', label: 'Email', value: 'contact@nslysium.com', href: 'mailto:contact@nslysium.com', external: false },
                  { icon: '📷', label: 'Instagram', value: '@nslysium', href: 'https://instagram.com/nslysium', external: true },
                  { icon: '💼', label: 'LinkedIn', value: 'NSLysium', href: 'https://linkedin.com/company/nslysium', external: true },
                ].map((item) => (
                  <div key={item.label} className="ss-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(196,98,45,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FAF7F2', fontFamily: 'var(--font-dm-sans)', marginBottom: '0.2rem' }}>{item.label}</p>
                      <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} style={{ fontSize: '0.85rem', color: '#7A6A58', fontFamily: 'var(--font-dm-sans)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#FAF7F2')} onMouseLeave={(e) => (e.currentTarget.style.color = '#7A6A58')}>
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}

                {/* Cibles */}
                <div className="ss-item" style={{ padding: '1rem 1.25rem', borderRadius: '0.75rem', background: '#221E18', border: '1px solid rgba(196,98,45,0.12)' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C4622D', fontFamily: 'var(--font-dm-sans)', marginBottom: '0.6rem' }}>Notre cœur de cible</p>
                  {[
                    { emoji: '⚡', name: 'L\'Optimisateur', desc: '25-45 ans · CSP+ · performance' },
                    { emoji: '🌿', name: 'L\'Esthète Holistique', desc: '35-50 ans · bien-être · design' },
                    { emoji: '🛡', name: 'Le Senior Préventif', desc: '55-70 ans · santé · simplicité' },
                  ].map(({ emoji, name, desc }) => (
                    <div key={name} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.45rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.8rem', flexShrink: 0, marginTop: '0.05rem' }}>{emoji}</span>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#FAF7F2', fontFamily: 'var(--font-dm-sans)' }}>{name}</span>
                        <span style={{ fontSize: '0.62rem', color: 'rgba(250,247,242,0.4)', fontFamily: 'var(--font-dm-sans)' }}>{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ss-item" style={{ padding: '1rem 1.25rem', borderRadius: '0.75rem', background: '#221E18', border: '1px solid rgba(196,98,45,0.12)' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C4622D', fontFamily: 'var(--font-dm-sans)', marginBottom: '0.5rem' }}>Temps de réponse</p>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(250,247,242,0.65)', fontFamily: 'var(--font-dm-sans)', lineHeight: 1.6 }}>
                    Toutes les demandes sous <strong style={{ color: '#FAF7F2' }}>48h ouvrées</strong>. Abonnés Pro : <strong style={{ color: '#FAF7F2' }}>4h</strong>.
                  </p>
                </div>
              </div>

              {/* Right: form */}
              <div className="ss-item" style={{ padding: '2rem', borderRadius: '1.25rem', background: '#221E18', border: '1px solid rgba(196,98,45,0.15)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 300, color: '#FAF7F2', fontFamily: 'var(--font-fraunces)', marginBottom: '1.5rem' }}>Envoyer un message</h3>
                <form action="mailto:contact@nslysium.com" method="post" encType="text/plain" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { id: 'contact-name', name: 'name', type: 'text', placeholder: 'Votre nom', label: 'Nom' },
                      { id: 'contact-email', name: 'email', type: 'email', placeholder: 'votre@email.com', label: 'Email' },
                    ].map((field) => (
                      <div key={field.id}>
                        <label htmlFor={field.id} style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'rgba(250,247,242,0.7)', fontFamily: 'var(--font-dm-sans)', marginBottom: '0.4rem' }}>{field.label}</label>
                        <input id={field.id} name={field.name} type={field.type} required placeholder={field.placeholder} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '0.65rem', background: '#16120E', border: '1px solid rgba(196,98,45,0.2)', color: '#FAF7F2', fontSize: '0.85rem', fontFamily: 'var(--font-dm-sans)', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label htmlFor="contact-subject" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'rgba(250,247,242,0.7)', fontFamily: 'var(--font-dm-sans)', marginBottom: '0.4rem' }}>Sujet</label>
                    <select id="contact-subject" name="subject" style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '0.65rem', background: '#16120E', border: '1px solid rgba(196,98,45,0.2)', color: '#FAF7F2', fontSize: '0.85rem', fontFamily: 'var(--font-dm-sans)', outline: 'none', appearance: 'none', boxSizing: 'border-box' }}>
                      <option value="">Choisir un sujet</option>
                      <option value="produit">Question produit (Aether)</option>
                      <option value="abonnement">Abonnement Freemium / Premium / Pro</option>
                      <option value="partenariat">Partenariat</option>
                      <option value="presse">Presse</option>
                      <option value="investisseur">Investisseur</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'rgba(250,247,242,0.7)', fontFamily: 'var(--font-dm-sans)', marginBottom: '0.4rem' }}>Message</label>
                    <textarea id="contact-message" name="message" required rows={5} placeholder="Votre message..." style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '0.65rem', background: '#16120E', border: '1px solid rgba(196,98,45,0.2)', color: '#FAF7F2', fontSize: '0.85rem', fontFamily: 'var(--font-dm-sans)', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '0.9rem 1.5rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, background: '#C4622D', color: '#FAF7F2', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', transition: 'transform 0.2s, box-shadow 0.2s', textAlign: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(196,98,45,0.4)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
