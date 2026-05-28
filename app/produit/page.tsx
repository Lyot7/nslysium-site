'use client'

import Link from 'next/link'
import ProductHero3D from './_components/ProductHero3D'
import BetaLysiumMockup from './_components/BetaLysiumMockup'

// La metadata est définie dans app/produit/layout.tsx (Server Component)
// car cette page utilise des handlers onMouseEnter qui demandent "use client".

// ─────────────────────────────────────────────────────────────────────────────

const AETHER_BENEFITS = [
  {
    tag: 'Voix',
    icon: 'mic',
    title: 'Vous parlez naturellement.',
    body:
      "Trois micros directionnels captent votre voix jusqu'à cinq mètres, même en mouvement ou avec du bruit de fond.",
  },
  {
    tag: 'IA locale',
    icon: 'lock',
    title: 'Vos données restent chez vous.',
    body:
      "Aether traite tout sur l'appareil. Aucun cloud obligatoire, aucune écoute extérieure. Chiffrement de bout en bout.",
  },
  {
    tag: 'Présence',
    icon: 'leaf',
    title: 'Il vit dans votre intérieur.',
    body:
      "Pas d'écran, pas d'interruption. Aether se fait oublier, jusqu'à ce que vous ayez besoin de lui.",
  },
  {
    tag: 'Robustesse',
    icon: 'shield',
    title: "Conçu pour durer.",
    body:
      "Bois massif FSC, biocomposites minéraux. Résistant aux projections, huit heures d'autonomie, charge rapide.",
  },
] as const

// Mini-icons SVG outline khaki — 22px, stroke 1.5, opacity 0.75
function BenefitIcon({ kind }: { kind: 'mic' | 'lock' | 'leaf' | 'shield' }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#B59E7D',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    style: { marginBottom: '0.85rem', opacity: 0.75 },
  }
  switch (kind) {
    case 'mic':
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="12" rx="3" />
          <path d="M5 11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11" />
          <line x1="12" y1="18" x2="12" y2="22" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" />
        </svg>
      )
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M21 3C13 3 5 7 5 17C5 18.6569 6.34315 20 8 20H10C18 20 21 12 21 3Z" />
          <line x1="5" y1="17" x2="14" y2="8" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3L5 6V12C5 16.5 8 19.8 12 21C16 19.8 19 16.5 19 12V6L12 3Z" />
        </svg>
      )
  }
}

const APP_FEATURES = [
  {
    title: 'Tableau de bord du jour',
    body:
      "Planning, score global, séance et repas du moment. Tout ce qui compte aujourd'hui, en un écran.",
  },
  {
    title: 'Coach IA conversationnel',
    body:
      "Un assistant disponible 24h/24, avec quatre tons au choix : bienveillant, motivant, direct ou humoristique.",
  },
  {
    title: 'Synchronisation continue',
    body:
      "Votre montre, vos apps santé, votre calendrier. Tout se met à jour automatiquement, sans saisie.",
  },
  {
    title: 'Score quotidien composite',
    body:
      "Sport, nutrition, repos. Trois anneaux concentriques pour comprendre votre forme d'un regard.",
  },
]

const WEARABLES = [
  'Apple Watch',
  'Garmin',
  'Samsung Galaxy Watch',
  'Fitbit',
  'Withings',
  'Polar',
  'Suunto',
  'Whoop',
]

const SERVICES = ['Apple Health', 'Google Fit', 'iCal', 'Outlook', 'Google Home', 'Amazon Alexa']

const USE_CASES = [
  {
    label: 'Sport',
    title: 'Quarante-cinq sports, une seule voix.',
    body:
      "Running, musculation, yoga, natation, trail, CrossFit… Aether planifie, ajuste à votre fatigue, enregistre vos sensations.",
    quote: '« Aether, prépare ma séance trail de demain. »',
  },
  {
    label: 'Nutrition',
    title: 'Manger juste, sans calculer.',
    body:
      "Vous dites ce que vous mangez. Aether tient les macros, l'hydratation, suggère un dîner qui équilibre la journée.",
    quote: '« J\'ai mangé une salade et un thé. »',
  },
  {
    label: 'Sommeil',
    title: 'Comprendre vos nuits.',
    body:
      "Durée, qualité, cycles, variabilité cardiaque. Aether commente, ajuste votre intensité d'entraînement du jour.",
    quote: '« Comment j\'ai dormi ? »',
  },
  {
    label: 'Organisation',
    title: 'Votre agenda parle votre langue.',
    body:
      "Rappels vocaux, créneaux libres, exports iCal et Google Calendar. Aether intègre vos contraintes, pas l'inverse.",
    quote: '« Rappelle-moi d\'appeler Paul ce soir. »',
  },
  {
    label: 'Récupération',
    title: 'Connaître votre charge réelle.',
    body:
      "Variabilité cardiaque, sommeil profond, sensations subjectives. Aether croise les signaux pour vous dire si la séance d'aujourd'hui est une bonne idée.",
    quote: '« Suis-je prêt pour une grosse séance&nbsp;? »',
  },
  {
    label: 'Bilan',
    title: 'Une synthèse, chaque soir.',
    body:
      "Repas, séance, charge mentale, qualité de la journée. Aether résume sans vous demander de relire des graphiques.",
    quote: '« Aether, fais mon bilan du jour. »',
  },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function ProduitPage() {
  return (
    <main style={{ paddingTop: '5rem', position: 'relative', zIndex: 10 }}>
      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(4rem, 10vh, 8rem) clamp(1.5rem, 6vw, 5rem) clamp(3rem, 6vh, 5rem)',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#B59E7D',
            marginBottom: '1.25rem',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          Le produit
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 300,
            fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
            lineHeight: 1.08,
            color: '#FAF7F2',
            marginBottom: '1.5rem',
            maxWidth: '20ch',
            marginInline: 'auto',
          }}
        >
          Un cône. <span style={{ color: '#C9B395' }}>Une app.</span> Une seule voix.
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.78,
            color: 'rgba(250,247,242,0.6)',
            maxWidth: '54ch',
            margin: '0 auto',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          NSLysium se compose de deux pièces complémentaires : <strong style={{ color: '#FAF7F2', fontWeight: 500 }}>Aether</strong>, l'enceinte
          vocale qui orchestre votre quotidien, et <strong style={{ color: '#FAF7F2', fontWeight: 500 }}>BetaLysium</strong>, l'app qui visualise
          tout ce qu'Aether enregistre.
        </p>
      </section>

      {/* ── BLOC 1 : AETHER 3D + SÉLECTEUR DE COLORIS ── */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <ProductHero3D />
      </section>

      {/* ── BLOC 1bis : 4 BÉNÉFICES AETHER ── */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(2rem, 4vh, 3rem) clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {AETHER_BENEFITS.map((b) => (
            <div
              key={b.tag}
              style={{
                padding: '1.4rem 1.35rem',
                borderRadius: '0.85rem',
                background: 'rgba(34, 30, 24, 0.55)',
                border: '1px solid rgba(181, 158, 125, 0.12)',
                transition: 'border-color 0.3s ease, background 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(181, 158, 125, 0.28)'
                e.currentTarget.style.background = 'rgba(34, 30, 24, 0.78)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(181, 158, 125, 0.12)'
                e.currentTarget.style.background = 'rgba(34, 30, 24, 0.55)'
              }}
            >
              <BenefitIcon kind={b.icon} />
              <div
                style={{
                  fontSize: '0.58rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#B59E7D',
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-dm-sans)',
                }}
              >
                {b.tag}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontWeight: 400,
                  fontSize: '1.05rem',
                  color: '#FAF7F2',
                  lineHeight: 1.3,
                  marginBottom: '0.5rem',
                }}
              >
                {b.title}
              </h3>
              <p
                style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.6,
                  color: 'rgba(250, 247, 242, 0.55)',
                  fontFamily: 'var(--font-dm-sans)',
                  margin: 0,
                }}
              >
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BLOC 2 : BETALYSIUM ── */}
      <section
        id="app"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'center',
          }}
          className="produit-aether-grid"
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#B59E7D',
                marginBottom: '1rem',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              BetaLysium — l'app
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontWeight: 300,
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                lineHeight: 1.15,
                color: '#FAF7F2',
                marginBottom: '1.25rem',
              }}
            >
              Le silence d'un écran. La présence d'un coach.
            </h2>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.75,
                color: 'rgba(250,247,242,0.6)',
                marginBottom: '2rem',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              BetaLysium consulte ce qu'Aether a enregistré. Sept onglets, aucun bruit visuel.
              Un score quotidien, des recommandations, et un assistant IA conversationnel
              disponible quand vous en avez besoin.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              {APP_FEATURES.map((f) => (
                <div
                  key={f.title}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem 1.15rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(34,30,24,0.55)',
                    border: '1px solid rgba(181, 158, 125,0.12)',
                    transition: 'border-color 0.3s ease, background 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(181, 158, 125, 0.28)'
                    e.currentTarget.style.background = 'rgba(34,30,24,0.78)'
                    const chev = e.currentTarget.querySelector('[data-chev]') as HTMLElement | null
                    if (chev) chev.style.transform = 'translateX(3px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(181, 158, 125, 0.12)'
                    e.currentTarget.style.background = 'rgba(34,30,24,0.55)'
                    const chev = e.currentTarget.querySelector('[data-chev]') as HTMLElement | null
                    if (chev) chev.style.transform = 'translateX(0)'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-fraunces)',
                        fontWeight: 400,
                        fontSize: '1rem',
                        color: '#FAF7F2',
                        lineHeight: 1.3,
                        marginBottom: '0.35rem',
                      }}
                    >
                      {f.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        lineHeight: 1.6,
                        color: 'rgba(250,247,242,0.55)',
                        fontFamily: 'var(--font-dm-sans)',
                        margin: 0,
                      }}
                    >
                      {f.body}
                    </p>
                  </div>
                  <span
                    data-chev
                    aria-hidden
                    style={{
                      color: '#8B7659',
                      fontSize: '1.5rem',
                      lineHeight: 1,
                      opacity: 0.5,
                      transition: 'transform 0.3s ease',
                      marginTop: '-2px',
                      flexShrink: 0,
                    }}
                  >
                    ›
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <BetaLysiumMockup />
          </div>
        </div>
      </section>

      {/* ── BLOC 3 : ÉCOSYSTÈME ── */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 6vw, 5rem)',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#B59E7D',
            marginBottom: '1rem',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          L'écosystème
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            color: '#FAF7F2',
            marginBottom: '1rem',
          }}
        >
          Compatible avec ce que vous utilisez déjà.
        </h2>
        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'rgba(250,247,242,0.55)',
            maxWidth: '54ch',
            margin: '0 auto 2.5rem',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          Aether et BetaLysium se branchent aux outils que vous avez déjà. Aucun écosystème
          fermé, aucune dépendance forcée. Vos appareils restent les vôtres.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(250,247,242,0.45)',
              marginBottom: '0.85rem',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Huit montres connectées
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5rem 1.1rem',
              fontSize: '0.88rem',
              color: 'rgba(250,247,242,0.78)',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            {WEARABLES.map((w, i) => (
              <span key={w} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                {i > 0 && (
                  <span aria-hidden style={{ color: 'rgba(181, 158, 125, 0.45)', fontSize: '0.6rem' }}>
                    ·
                  </span>
                )}
                {w}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(250,247,242,0.45)',
              marginBottom: '0.85rem',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Services & domotique
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5rem 1.1rem',
              fontSize: '0.88rem',
              color: 'rgba(250,247,242,0.68)',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            {SERVICES.map((s, i) => (
              <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                {i > 0 && (
                  <span aria-hidden style={{ color: 'rgba(181, 158, 125, 0.45)', fontSize: '0.6rem' }}>
                    ·
                  </span>
                )}
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOC 4 : CAS D'USAGE ── */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#B59E7D',
              marginBottom: '1rem',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Quatre piliers
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              color: '#FAF7F2',
              maxWidth: '20ch',
              margin: '0 auto',
            }}
          >
            Tout votre quotidien, orchestré.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {USE_CASES.map((u, i) => (
            <div
              key={u.label}
              style={{
                position: 'relative',
                padding: '2rem 1.75rem 1.75rem',
                borderRadius: '1rem',
                background: '#2A241D',
                border: '1px solid rgba(181, 158, 125,0.13)',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(181, 158, 125, 0.32)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(181, 158, 125, 0.13)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1.4rem',
                  fontFamily: 'var(--font-fraunces)',
                  fontWeight: 300,
                  fontSize: '2.6rem',
                  lineHeight: 1,
                  color: 'rgba(181, 158, 125, 0.18)',
                  letterSpacing: '-0.02em',
                  pointerEvents: 'none',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#B59E7D',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--font-dm-sans)',
                }}
              >
                {u.label}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontWeight: 400,
                  fontSize: '1.25rem',
                  color: '#FAF7F2',
                  lineHeight: 1.3,
                  marginBottom: '0.75rem',
                }}
              >
                {u.title}
              </h3>
              <p
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  color: 'rgba(250,247,242,0.55)',
                  fontFamily: 'var(--font-dm-sans)',
                  margin: '0 0 1.25rem',
                }}
              >
                {u.body}
              </p>
              <div
                style={{
                  padding: '1rem 1.15rem',
                  borderRadius: '0.6rem',
                  background: 'rgba(181, 158, 125,0.08)',
                  border: '1px solid rgba(181, 158, 125, 0.18)',
                  fontFamily: 'var(--font-fraunces)',
                  fontStyle: 'italic',
                  fontSize: '0.9rem',
                  color: 'rgba(250,247,242,0.85)',
                  lineHeight: 1.5,
                }}
              >
                {u.quote}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'clamp(4rem, 10vh, 8rem) clamp(1.5rem, 6vw, 5rem)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 300,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            color: '#FAF7F2',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
          }}
        >
          Prêt à <span style={{ color: '#C9B395' }}>essayer&nbsp;?</span>
        </h2>
        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.75,
            color: 'rgba(250,247,242,0.6)',
            maxWidth: '46ch',
            margin: '0 auto 2.5rem',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          Trois formules. Une seule philosophie. Choisissez ce qui vous ressemble.
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
            Voir les abonnements
          </Link>
          <Link
            href="/contact"
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
            Nous contacter
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .produit-aether-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
