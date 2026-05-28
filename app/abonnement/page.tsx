import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Abonnement — Freemium · Premium · Elite · NSLysium',
  description:
    "Trois formules. Une seule philosophie. Choisissez ce qui vous ressemble. Pas d'engagement.",
}

// ─────────────────────────────────────────────────────────────────────────────

type Tier = {
  id: 'freemium' | 'premium' | 'elite'
  name: string
  price: string
  period: string
  tagline: string
  highlight?: boolean
  badge?: string
  features: string[]
  excluded?: string[]
  cta: string
  ctaHref: string
}

const TIERS: Tier[] = [
  {
    id: 'freemium',
    name: 'Freemium',
    price: 'Gratuit',
    period: '',
    tagline: "Pour découvrir, sans engagement.",
    features: [
      'Un pilier au choix : sport, nutrition ou sommeil',
      'Cinquante commandes vocales par mois',
      'Tableau de bord essentiel',
      'Une montre connectée synchronisée',
      'Historique sur sept jours',
    ],
    excluded: ['Coach IA personnalisé', 'Tous les piliers en simultané', 'Agenda & domotique'],
    cta: "Télécharger l'app",
    ctaHref: '/contact',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '9,99€',
    period: '/ mois',
    tagline: "Le quotidien orchestré, pour la plupart.",
    highlight: true,
    badge: 'Recommandé',
    features: [
      'Sport, nutrition et sommeil unifiés',
      'Commandes vocales illimitées',
      'Coach IA avec quatre tons au choix',
      'Toutes les montres connectées compatibles',
      'Historique illimité, export CSV',
      'Planification IA des entraînements',
      'Quatorze jours d’essai gratuit',
    ],
    cta: 'Essayer 14 jours',
    ctaHref: '/contact',
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 'Sur devis',
    period: '',
    tagline: "Tout l'écosystème. Sans limite.",
    features: [
      'Tout ce qu’inclut Premium',
      'Agenda : Google · Outlook · iCal',
      'Domotique : Google Home · Amazon Alexa',
      'Export brut des données + accès API',
      'Support prioritaire sous 4 heures',
      'Accès anticipé aux nouvelles fonctionnalités',
    ],
    cta: 'Discuter de mes besoins',
    ctaHref: '/contact',
  },
]

const FAQ = [
  {
    q: 'Le cône Aether est-il inclus ?',
    a:
      "Le cône Aether est commercialisé séparément. L'app BetaLysium fonctionne avec ou sans Aether — Aether enrichit l'expérience en ajoutant la commande vocale sans écran.",
  },
  {
    q: 'Puis-je changer d’offre à tout moment ?',
    a:
      "Oui. Vous pouvez passer de Freemium à Premium, ou de Premium à Elite, à tout moment depuis l'onglet Profil. Le changement est immédiat, sans frais.",
  },
  {
    q: 'Que se passe-t-il à la fin de l’essai gratuit ?',
    a:
      "À la fin des quatorze jours, vous pouvez choisir de continuer en Premium ou de revenir gratuitement à Freemium. Aucun prélèvement automatique sans votre confirmation.",
  },
  {
    q: 'Mes données sont-elles vraiment privées ?',
    a:
      "Oui. L'IA d'Aether tourne localement sur l'appareil — aucun cloud obligatoire. Les données stockées dans BetaLysium sont chiffrées (AES-256) et hébergées en Europe, conformément au RGPD.",
  },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function AbonnementPage() {
  return (
    <main style={{ paddingTop: '5rem', position: 'relative', zIndex: 10 }}>
      {/* ── BANDEAU MODÈLE — clarifie produit physique vs abonnement ── */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: 'clamp(3rem, 8vh, 5rem) clamp(1.5rem, 6vw, 5rem) clamp(1rem, 2vh, 1.5rem)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            padding: '1.5rem',
            borderRadius: '1rem',
            background: 'rgba(42, 36, 29, 0.55)',
            border: '1px solid rgba(181, 158, 125, 0.18)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#B59E7D',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Achat unique
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontWeight: 400,
                fontSize: '1.15rem',
                color: '#FAF7F2',
                marginBottom: '0.4rem',
              }}
            >
              Le cône Aether
            </h3>
            <p
              style={{
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: 'rgba(250, 247, 242, 0.62)',
                fontFamily: 'var(--font-dm-sans)',
                margin: 0,
              }}
            >
              Commandé séparément, dès <strong style={{ color: '#FAF7F2' }}>299 €</strong> selon le
              coloris. Livré avec son coffret en bois FSC, garanti deux ans.
            </p>
          </div>
          <div>
            <div
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#B59E7D',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Abonnement logiciel
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontWeight: 400,
                fontSize: '1.15rem',
                color: '#FAF7F2',
                marginBottom: '0.4rem',
              }}
            >
              L'app BetaLysium
            </h3>
            <p
              style={{
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: 'rgba(250, 247, 242, 0.62)',
                fontFamily: 'var(--font-dm-sans)',
                margin: 0,
              }}
            >
              Fonctionne avec ou sans cône. La voix d'Aether devient disponible quand vous le
              connectez. Sans engagement, modifiable à tout moment.
            </p>
          </div>
        </div>
      </section>

      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: 'clamp(2rem, 4vh, 3rem) clamp(1.5rem, 6vw, 5rem) clamp(2rem, 4vh, 3.5rem)',
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
          Abonnement
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 300,
            fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
            lineHeight: 1.1,
            color: '#FAF7F2',
            marginBottom: '1.5rem',
          }}
        >
          Choisissez <span style={{ color: '#C9B395' }}>votre rythme.</span>
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.78,
            color: 'rgba(250,247,242,0.6)',
            maxWidth: '50ch',
            margin: '0 auto',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          Trois formules. Une seule philosophie : vous accompagner sans vous encombrer. Sans
          engagement, modifiable à tout moment.
        </p>
      </section>

      {/* ── PRICING ── */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(2rem, 4vh, 3rem) clamp(1.5rem, 6vw, 5rem) clamp(4rem, 8vh, 6rem)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch',
          }}
        >
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              style={{
                position: 'relative',
                padding: '2rem 1.75rem',
                borderRadius: '1.25rem',
                background: tier.highlight
                  ? 'linear-gradient(180deg, rgba(181, 158, 125,0.12), #2A241D)'
                  : '#2A241D',
                border: tier.highlight
                  ? '1.5px solid rgba(181, 158, 125,0.55)'
                  : '1px solid rgba(181, 158, 125,0.13)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: tier.highlight
                  ? '0 20px 60px rgba(181, 158, 125,0.2)'
                  : '0 10px 30px rgba(0,0,0,0.15)',
              }}
            >
              {tier.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '0.3rem 0.85rem',
                    background: '#B59E7D',
                    color: '#FAF7F2',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-dm-sans)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tier.badge}
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#B59E7D',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-dm-sans)',
                  }}
                >
                  {tier.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-fraunces)',
                    fontWeight: 300,
                    fontSize: '2.5rem',
                    color: '#FAF7F2',
                    lineHeight: 1,
                    marginBottom: '0.3rem',
                  }}
                >
                  {tier.price}
                  {tier.period && (
                    <span
                      style={{
                        fontSize: '0.85rem',
                        color: 'rgba(250,247,242,0.5)',
                        fontFamily: 'var(--font-dm-sans)',
                        marginLeft: '0.3rem',
                      }}
                    >
                      {tier.period}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'rgba(250,247,242,0.55)',
                    fontFamily: 'var(--font-dm-sans)',
                    margin: 0,
                    minHeight: '2.6em',
                  }}
                >
                  {tier.tagline}
                </p>
              </div>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  flex: 1,
                }}
              >
                {tier.features.map((f, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '0.6rem',
                      alignItems: 'flex-start',
                      fontSize: '0.85rem',
                      color: 'rgba(250,247,242,0.82)',
                      fontFamily: 'var(--font-dm-sans)',
                      lineHeight: 1.5,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      style={{ flexShrink: 0, marginTop: '0.2rem' }}
                    >
                      <path
                        d="M2.5 7.5L6 11L12 4"
                        stroke="#B59E7D"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
                {tier.excluded?.map((f, i) => (
                  <li
                    key={`x${i}`}
                    style={{
                      display: 'flex',
                      gap: '0.6rem',
                      alignItems: 'flex-start',
                      fontSize: '0.82rem',
                      color: 'rgba(250,247,242,0.35)',
                      fontFamily: 'var(--font-dm-sans)',
                      lineHeight: 1.5,
                      textDecoration: 'line-through',
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      style={{ flexShrink: 0, marginTop: '0.2rem' }}
                    >
                      <path
                        d="M3 3L11 11M3 11L11 3"
                        stroke="rgba(250,247,242,0.3)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaHref}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '0.85rem 1.5rem',
                  borderRadius: '9999px',
                  background: tier.highlight ? '#B59E7D' : 'transparent',
                  border: tier.highlight ? 'none' : '1.5px solid rgba(181, 158, 125,0.5)',
                  color: '#FAF7F2',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-dm-sans)',
                }}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.78rem',
            color: 'rgba(250,247,242,0.4)',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          Le cône Aether est commercialisé séparément. Toutes les formules incluent l'app
          BetaLysium pour iOS et Android.
        </p>
      </section>

      {/* ── COMPARAISON USAGE ── */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
            Une journée selon votre formule
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              color: '#FAF7F2',
            }}
          >
            Voici à quoi ressemble votre matin.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {[
            {
              tier: 'Freemium',
              scenario:
                "« Aether, lance ma séance running. » L'app suit l'entraînement, propose un récap basique. Le sommeil et la nutrition restent ailleurs.",
            },
            {
              tier: 'Premium',
              scenario:
                "« Comment je vais aujourd'hui ? » Aether commente votre nuit, propose une séance ajustée à votre fatigue, suggère un petit-déjeuner adapté.",
            },
            {
              tier: 'Elite',
              scenario:
                "« Prépare ma journée. » Aether bloque vos créneaux dans Google Calendar, ajuste la lumière du salon, prépare la playlist, exporte le bilan vers votre coach.",
            },
          ].map((s) => (
            <div
              key={s.tier}
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                background: 'rgba(34,30,24,0.55)',
                border: '1px solid rgba(181, 158, 125,0.13)',
              }}
            >
              <div
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#B59E7D',
                  marginBottom: '0.85rem',
                  fontFamily: 'var(--font-dm-sans)',
                }}
              >
                {s.tier}
              </div>
              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.65,
                  color: 'rgba(250,247,242,0.75)',
                  fontFamily: 'var(--font-dm-sans)',
                  fontStyle: 'italic',
                  margin: 0,
                }}
              >
                {s.scenario}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'clamp(4rem, 8vh, 6rem) clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            color: '#FAF7F2',
            textAlign: 'center',
            marginBottom: '2.5rem',
          }}
        >
          Questions fréquentes.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {FAQ.map((f, i) => (
            <details
              key={i}
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '0.85rem',
                background: 'rgba(34,30,24,0.55)',
                border: '1px solid rgba(181, 158, 125,0.13)',
                cursor: 'pointer',
              }}
            >
              <summary
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontWeight: 400,
                  fontSize: '1.05rem',
                  color: '#FAF7F2',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span>{f.q}</span>
                <span
                  style={{
                    color: '#B59E7D',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                    fontFamily: 'var(--font-dm-sans)',
                  }}
                >
                  +
                </span>
              </summary>
              <p
                style={{
                  marginTop: '0.85rem',
                  fontSize: '0.92rem',
                  lineHeight: 1.7,
                  color: 'rgba(250,247,242,0.6)',
                  fontFamily: 'var(--font-dm-sans)',
                }}
              >
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 6vw, 5rem) clamp(5rem, 10vh, 7rem)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            color: '#FAF7F2',
            marginBottom: '1rem',
          }}
        >
          Une question avant de vous lancer&nbsp;?
        </h2>
        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'rgba(250,247,242,0.6)',
            marginBottom: '2rem',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          Nous prenons le temps de répondre, sans jamais vous pousser à acheter.
        </p>
        <Link
          href="/contact"
          style={{
            display: 'inline-block',
            padding: '0.95rem 2rem',
            borderRadius: '9999px',
            border: '1.5px solid rgba(181, 158, 125,0.5)',
            color: '#FAF7F2',
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '0.03em',
            textDecoration: 'none',
            fontFamily: 'var(--font-dm-sans)',
            background: 'transparent',
          }}
        >
          Nous contacter
        </Link>
      </section>
    </main>
  )
}
