import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ScrollFeaturesWrapper from './_components/ScrollFeaturesWrapper'

export const metadata: Metadata = {
  title: 'Produit — NSLysium, l\'écosystème complet',
  description:
    "Découvrez l'enceinte Aether et l'application BetaLysium — l'écosystème NSLysium pour centraliser sport, nutrition, sommeil et organisation.",
}

const specs = [
  { label: '3 microphones', detail: 'Array directionnel 360°' },
  { label: 'IA embarquée', detail: 'Traitement local sécurisé' },
  { label: 'Bluetooth & WiFi', detail: 'Connectivité double bande' },
  { label: 'IP54', detail: 'Résistant à la poussière et aux éclaboussures' },
  { label: '8h autonomie', detail: 'Charge rapide USB-C' },
]

const useCases = [
  {
    icon: '🏃',
    title: 'Sport',
    features: [
      'Lance un entraînement adapté à ta forme du jour',
      'Chronomètre et guide tes séries en temps réel',
      'Analyse tes performances et ajuste le programme',
    ],
  },
  {
    icon: '🥗',
    title: 'Nutrition',
    features: [
      'Crée un plan nutritionnel selon tes objectifs',
      'Enregistre tes repas par la voix',
      'Reçois des suggestions de recettes adaptées',
    ],
  },
  {
    icon: '😴',
    title: 'Sommeil',
    features: [
      "Lance une routine de relaxation avant de dormir",
      'Analyse la qualité de ton sommeil',
      'Reçois des conseils personnalisés de récupération',
    ],
  },
  {
    icon: '📅',
    title: 'Organisation',
    features: [
      'Dicte tes tâches et gère ton agenda vocalement',
      'Reçois des rappels contextuels intelligents',
      'Synchronise avec tes apps existantes',
    ],
  },
]

const colorVariants = [
  { src: '/images/cone/cone-orange.jpeg', alt: 'Aether Orange', label: 'Orange' },
  { src: '/images/cone/cone-blanc.jpeg', alt: 'Aether Blanc', label: 'Blanc' },
  { src: '/images/cone/cone-anthracite.jpeg', alt: 'Aether Anthracite', label: 'Anthracite' },
  { src: '/images/cone/cone-beige.jpeg', alt: 'Aether Beige', label: 'Beige' },
  { src: '/images/cone/cone-bordeaux.jpeg', alt: 'Aether Bordeaux', label: 'Bordeaux' },
  { src: '/images/cone/cone-noir.jpeg', alt: 'Aether Noir', label: 'Noir' },
  { src: '/images/cone/cone-vert.jpeg', alt: 'Aether Vert', label: 'Vert' },
]

export default function ProduitPage() {
  return (
    <>
      <section
        className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden"
        style={{ background: '#16120E' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 70% at 50% 40%, rgba(196, 98, 45, 0.1) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center z-10">
          <span
            className="text-xs font-semibold uppercase tracking-widest mb-6 block"
            style={{ color: '#C4622D' }}
          >
            L&apos;écosystème
          </span>
          <h1
            className="font-display text-5xl lg:text-7xl font-light leading-tight mb-8"
            style={{ color: '#FAF7F2' }}
          >
            L&apos;écosystème{' '}
            <span className="text-gradient">NSLysium</span>
          </h1>
          <p
            className="text-xl leading-relaxed max-w-2xl mx-auto mb-12"
            style={{ color: 'rgba(250, 247, 242, 0.65)' }}
          >
            Une enceinte intelligente. Une application unifiée. Une intelligence vocale
            qui apprend de vous.
          </p>
          <div style={{ position: 'relative', display: 'inline-block', filter: 'drop-shadow(0 0 60px rgba(196, 98, 45, 0.5))' }}>
            <Image
              src="/images/cone/cone-orange.jpeg"
              alt="NSLysium Aether"
              width={260}
              height={340}
              className="object-contain block"
              priority
            />
            <div style={{
              position: 'absolute',
              inset: '-10px',
              background: 'radial-gradient(ellipse 50% 55% at 50% 48%, transparent 0%, transparent 36%, #16120E 64%)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </section>

      <ScrollFeaturesWrapper />

      <section style={{ background: '#221E18' }} className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest mb-4 block"
                style={{ color: '#C4622D' }}
              >
                Hardware
              </span>
              <h2
                className="font-display text-4xl lg:text-5xl font-light mb-6"
                style={{ color: '#FAF7F2' }}
              >
                L&apos;Enceinte <span className="text-gradient">Aether</span>
              </h2>
              <p
                className="text-lg leading-relaxed mb-10"
                style={{ color: 'rgba(250, 247, 242, 0.65)' }}
              >
                Aether est plus qu&apos;une enceinte — c&apos;est le centre nerveux de votre
                vie connectée. Conçue pour s&apos;intégrer élégamment dans votre intérieur,
                elle écoute, comprend et agit.
              </p>
              <ul className="space-y-4">
                {specs.map((spec) => (
                  <li key={spec.label} className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                      style={{ background: '#C4622D' }}
                    />
                    <div>
                      <span
                        className="font-semibold text-base"
                        style={{ color: '#FAF7F2' }}
                      >
                        {spec.label}
                      </span>
                      <span
                        className="text-base ml-2"
                        style={{ color: '#7A6A58' }}
                      >
                        — {spec.detail}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-40"
                style={{ background: 'rgba(196, 98, 45, 0.3)' }}
              />
              <div style={{ position: 'relative', display: 'inline-block', width: '100%', filter: 'drop-shadow(0 20px 50px rgba(196, 98, 45, 0.35))' }}>
                <Image
                  src="/images/cone/cone-orange.jpeg"
                  alt="NSLysium Aether — vue détaillée"
                  width={480}
                  height={560}
                  className="w-full object-contain block"
                />
                <div style={{
                  position: 'absolute',
                  inset: '-10px',
                  background: 'radial-gradient(ellipse 52% 55% at 50% 48%, transparent 0%, transparent 38%, #221E18 65%)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#16120E' }} className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div
              className="rounded-3xl p-8 lg:p-12 order-2 lg:order-1"
              style={{
                background: '#221E18',
                border: '1px solid rgba(196, 98, 45, 0.15)',
              }}
            >
              <div className="space-y-4">
                {['Sport & Fitness', 'Nutrition & Repas', 'Sommeil & Repos', 'Agenda & Tâches'].map(
                  (item, i) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{
                        background: i === 0 ? 'rgba(196, 98, 45, 0.12)' : 'rgba(46, 39, 31, 0.5)',
                        border: i === 0 ? '1px solid rgba(196, 98, 45, 0.3)' : '1px solid rgba(46, 39, 31, 0.8)',
                      }}
                    >
                      <span className="text-2xl">
                        {['🏃', '🥗', '😴', '📅'][i]}
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: i === 0 ? '#FAF7F2' : '#7A6A58' }}
                      >
                        {item}
                      </span>
                      {i === 0 && (
                        <span
                          className="ml-auto text-xs px-2 py-1 rounded-full font-semibold"
                          style={{ background: '#C4622D', color: '#FAF7F2' }}
                        >
                          Actif
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span
                className="text-xs font-semibold uppercase tracking-widest mb-4 block"
                style={{ color: '#C4622D' }}
              >
                Application mobile
              </span>
              <h2
                className="font-display text-4xl lg:text-5xl font-light mb-6"
                style={{ color: '#FAF7F2' }}
              >
                L&apos;App <span className="text-gradient">BetaLysium</span>
              </h2>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: 'rgba(250, 247, 242, 0.65)' }}
              >
                L&apos;application mobile qui centralise toutes vos données de bien-être.
                Synchronisée avec Aether, elle offre une vue unifiée de votre santé et
                de votre progression.
              </p>
              <ul className="space-y-3">
                {[
                  'Dashboard unifié sport, nutrition, sommeil',
                  'Historique et graphiques de progression',
                  'Notifications intelligentes contextuelles',
                  'Mode hors-ligne pour toutes les fonctionnalités',
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="8" cy="8" r="8" fill="rgba(196,98,45,0.15)" />
                      <path
                        d="M5 8l2 2 4-4"
                        stroke="#C4622D"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-base" style={{ color: 'rgba(250, 247, 242, 0.75)' }}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#221E18' }} className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="font-display text-4xl lg:text-5xl font-light mb-4"
              style={{ color: '#FAF7F2' }}
            >
              L&apos;Écosystème <span className="text-gradient">Connecté</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: 'rgba(250, 247, 242, 0.6)' }}
            >
              Trois composantes qui travaillent ensemble en harmonie
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
            {[
              { icon: '🔊', label: 'Enceinte Aether', sublabel: 'Capture vocale' },
              { icon: '→', isArrow: true },
              { icon: '🧠', label: 'IA Cloud NSLysium', sublabel: 'Traitement intelligent' },
              { icon: '→', isArrow: true },
              { icon: '📱', label: 'App BetaLysium', sublabel: 'Visualisation & contrôle' },
            ].map((item, i) =>
              item.isArrow ? (
                <div
                  key={i}
                  className="text-3xl font-light hidden md:block mx-4"
                  style={{ color: '#C4622D' }}
                >
                  →
                </div>
              ) : (
                <div
                  key={i}
                  className="flex flex-col items-center p-8 rounded-2xl"
                  style={{
                    background: '#16120E',
                    border: '1px solid rgba(196, 98, 45, 0.2)',
                    minWidth: '200px',
                  }}
                >
                  <span className="text-4xl mb-4">{item.icon}</span>
                  <span
                    className="font-semibold text-base mb-1"
                    style={{ color: '#FAF7F2' }}
                  >
                    {item.label}
                  </span>
                  <span className="text-sm text-center" style={{ color: '#7A6A58' }}>
                    {item.sublabel}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section style={{ background: '#16120E' }} className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span
              className="text-xs font-semibold uppercase tracking-widest mb-4 block"
              style={{ color: '#C4622D' }}
            >
              Cas d&apos;usage
            </span>
            <h2
              className="font-display text-4xl lg:text-5xl font-light"
              style={{ color: '#FAF7F2' }}
            >
              Ce que vous pouvez faire{' '}
              <span className="text-gradient">par la voix</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="p-8 rounded-2xl"
                style={{
                  background: '#221E18',
                  border: '1px solid rgba(196, 98, 45, 0.12)',
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl">{uc.icon}</span>
                  <h3
                    className="font-display text-2xl font-medium"
                    style={{ color: '#FAF7F2' }}
                  >
                    {uc.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {uc.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-3 text-base"
                      style={{ color: 'rgba(250, 247, 242, 0.7)' }}
                    >
                      <span className="text-[#C4622D] mt-0.5 flex-shrink-0">"</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#221E18' }} className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2
            className="font-display text-3xl lg:text-4xl font-light text-center mb-12"
            style={{ color: '#FAF7F2' }}
          >
            7 coloris pour exprimer{' '}
            <span className="text-gradient">votre style</span>
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              overflowX: 'auto',
              paddingBottom: '1rem',
              marginLeft: '-1.5rem',
              marginRight: '-1.5rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
            }}
          >
            {colorVariants.map((variant) => (
              <div
                key={variant.label}
                className="flex flex-col items-center gap-2 flex-shrink-0"
                style={{ scrollSnapAlign: 'start', width: '120px' }}
              >
                <div className="rounded-xl overflow-hidden w-full aspect-[3/4]">
                  <Image
                    src={variant.src}
                    alt={variant.alt}
                    width={120}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs" style={{ color: '#7A6A58' }}>
                  {variant.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 lg:py-28 text-center"
        style={{ background: '#C4622D' }}
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2
            className="font-display text-4xl lg:text-5xl font-light mb-6"
            style={{ color: '#FAF7F2' }}
          >
            Prêt à rejoindre l&apos;écosystème ?
          </h2>
          <p
            className="text-lg mb-10 leading-relaxed"
            style={{ color: 'rgba(250,247,242,0.8)' }}
          >
            Choisissez votre abonnement et commencez dès aujourd&apos;hui.
          </p>
          <Link
            href="/abonnement"
            className="inline-block px-10 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:-translate-y-1"
            style={{ background: '#FAF7F2', color: '#C4622D' }}
          >
            Voir les abonnements
          </Link>
        </div>
      </section>
    </>
  )
}
