'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    id: 'freemium',
    name: 'Freemium',
    price: 'Gratuit',
    period: '',
    description: 'Pour découvrir NSLysium',
    badge: null,
    featured: false,
    features: [
      { label: 'Accès app basique', included: true },
      { label: '5 séances / mois', included: true },
      { label: 'Dashboard limité', included: true },
      { label: 'IA vocale Aether', included: false },
      { label: 'Synchronisation cône', included: false },
      { label: 'Séances illimitées', included: false },
      { label: 'Coaching personnalisé', included: false },
      { label: 'Analytics avancés', included: false },
      { label: 'Support prioritaire', included: false },
    ],
    cta: 'Commencer gratuitement',
    ctaHref: '/contact',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '19,99€',
    period: '/mois',
    description: 'L\'expérience complète NSLysium',
    badge: 'Populaire',
    featured: true,
    features: [
      { label: 'Accès app complète', included: true },
      { label: 'Séances illimitées', included: true },
      { label: 'Dashboard complet', included: true },
      { label: 'IA vocale Aether', included: true },
      { label: 'Synchronisation cône', included: true },
      { label: 'Coaching IA adaptatif', included: true },
      { label: 'Coaching personnalisé humain', included: false },
      { label: 'Analytics avancés', included: false },
      { label: 'Support prioritaire', included: false },
    ],
    cta: 'Choisir Premium',
    ctaHref: '/contact',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '49,99€',
    period: '/mois',
    description: 'Performance maximale',
    badge: null,
    featured: false,
    features: [
      { label: 'Tout Premium inclus', included: true },
      { label: 'Séances illimitées', included: true },
      { label: 'Dashboard complet', included: true },
      { label: 'IA vocale Aether', included: true },
      { label: 'Synchronisation cône', included: true },
      { label: 'Coaching IA adaptatif', included: true },
      { label: 'Coaching personnalisé humain', included: true },
      { label: 'Analytics avancés', included: true },
      { label: 'Support prioritaire', included: true },
    ],
    cta: 'Choisir Pro',
    ctaHref: '/contact',
  },
]

const faqs = [
  {
    question: 'Puis-je changer d\'abonnement à tout moment ?',
    answer:
      'Oui, vous pouvez passer à un abonnement supérieur ou inférieur à tout moment depuis votre espace client. La facturation est ajustée au prorata.',
  },
  {
    question: 'L\'enceinte Aether est-elle incluse dans l\'abonnement ?',
    answer:
      "L'enceinte Aether est vendue séparément. L'abonnement Premium et Pro sont nécessaires pour connecter l'enceinte à l'application et profiter de l'IA vocale complète.",
  },
  {
    question: 'Comment fonctionne l\'IA vocale NSLysium ?',
    answer:
      "L'IA vocale NSLysium combine traitement local sur l'enceinte Aether et intelligence cloud. Vos données personnelles restent chiffrées et vous en gardez la maîtrise complète.",
  },
  {
    question: 'Y a-t-il une période d\'essai ?',
    answer:
      "Le plan Freemium est disponible sans limite de temps. Pour les plans payants, nous offrons 14 jours d'essai satisfait ou remboursé.",
  },
]

export default function AbonnementPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <section
        className="pt-32 pb-16 text-center"
        style={{ background: '#16120E' }}
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <span
            className="text-xs font-semibold uppercase tracking-widest mb-6 block"
            style={{ color: '#C4622D' }}
          >
            Tarifs
          </span>
          <h1
            className="font-display text-5xl lg:text-6xl font-light mb-6"
            style={{ color: '#FAF7F2' }}
          >
            Choisissez votre <span className="text-gradient">Elysium</span>
          </h1>
          <p
            className="text-xl leading-relaxed"
            style={{ color: 'rgba(250, 247, 242, 0.65)' }}
          >
            Un abonnement pour chaque étape de votre parcours. Commencez gratuitement,
            évoluez à votre rythme.
          </p>
        </div>
      </section>

      <section style={{ background: '#16120E' }} className="pb-24 lg:pb-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative rounded-3xl p-8 lg:p-10 transition-all duration-300"
                style={{
                  background: plan.featured ? 'rgba(196, 98, 45, 0.08)' : '#221E18',
                  border: plan.featured
                    ? '1.5px solid #C4622D'
                    : '1px solid rgba(196, 98, 45, 0.12)',
                  transform: plan.featured ? 'scale(1.03)' : 'none',
                }}
              >
                {plan.badge && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ background: '#C4622D', color: '#FAF7F2' }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="mb-8">
                  <h2
                    className="font-display text-2xl font-medium mb-2"
                    style={{ color: '#FAF7F2' }}
                  >
                    {plan.name}
                  </h2>
                  <p className="text-sm mb-6" style={{ color: '#7A6A58' }}>
                    {plan.description}
                  </p>
                  <div className="flex items-end gap-1">
                    <span
                      className="font-display text-4xl lg:text-5xl font-light"
                      style={{ color: plan.featured ? '#C4622D' : '#FAF7F2' }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        className="text-base mb-1"
                        style={{ color: '#7A6A58' }}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-center gap-3 text-sm"
                      style={{
                        color: feature.included
                          ? 'rgba(250, 247, 242, 0.85)'
                          : 'rgba(122, 106, 88, 0.5)',
                      }}
                    >
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: feature.included
                            ? 'rgba(196, 98, 45, 0.15)'
                            : 'rgba(46, 39, 31, 0.8)',
                          color: feature.included ? '#C4622D' : '#4a3f35',
                        }}
                      >
                        {feature.included ? '✓' : '×'}
                      </span>
                      {feature.label}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className="block w-full text-center py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: plan.featured ? '#C4622D' : 'transparent',
                    color: plan.featured ? '#FAF7F2' : '#FAF7F2',
                    border: plan.featured ? 'none' : '1.5px solid rgba(196, 98, 45, 0.4)',
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#221E18' }} className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2
            className="font-display text-3xl lg:text-4xl font-light text-center mb-12"
            style={{ color: '#FAF7F2' }}
          >
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: '#16120E',
                  border: '1px solid rgba(196, 98, 45, 0.12)',
                }}
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span
                    className="font-medium text-base pr-4"
                    style={{ color: '#FAF7F2' }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className="flex-shrink-0 text-xl transition-transform duration-300"
                    style={{
                      color: '#C4622D',
                      transform: openFaq === index ? 'rotate(45deg)' : 'none',
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: 'rgba(250, 247, 242, 0.65)' }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-16 lg:py-20 text-center"
        style={{ background: '#16120E', borderTop: '1px solid rgba(196, 98, 45, 0.12)' }}
      >
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <h2
            className="font-display text-3xl font-light mb-4"
            style={{ color: '#FAF7F2' }}
          >
            Des questions ?
          </h2>
          <p className="text-base mb-8" style={{ color: '#7A6A58' }}>
            Notre équipe est disponible pour vous aider à choisir le plan adapté.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            style={{ border: '1.5px solid rgba(196, 98, 45, 0.5)', color: '#FAF7F2' }}
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </>
  )
}
