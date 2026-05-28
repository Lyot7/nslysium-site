'use client'

import Image from 'next/image'
import Link from 'next/link'

const footerColumns = [
  {
    title: 'Produit',
    links: [
      { href: '/produit', label: 'Le cône Aether' },
      { href: '/produit#app', label: "L'app BetaLysium" },
      { href: '/abonnement', label: 'Abonnement' },
    ],
  },
  {
    title: 'Société',
    links: [
      { href: '/contact', label: 'Contact' },
      { href: '/contact#rdv', label: 'Prendre RDV' },
      { href: '/contact#support', label: 'Support' },
    ],
  },
]

const legalLinks = [
  { href: '/legal/mentions-legales', label: 'Mentions légales' },
  { href: '/legal/confidentialite', label: 'Confidentialité' },
  { href: '/legal/cgv', label: 'CGV' },
  { href: '/legal/rgpd', label: 'RGPD' },
]

const socialLinks = [
  { href: 'https://instagram.com', label: 'Instagram', icon: 'instagram' },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'https://x.com', label: 'X', icon: 'x' },
]

function SocialIcon({ icon }: { icon: string }) {
  const common = {
    width: 16,
    height: 16,
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (icon === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    )
  }
  if (icon === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="8" y1="11" x2="8" y2="17" />
        <line x1="8" y1="8" x2="8" y2="8.01" />
        <path d="M12 17v-4a2 2 0 0 1 4 0v4M12 11v6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#221E18', position: 'relative', zIndex: 20 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4" aria-label="Accueil NSLysium">
              <Image
                src="/images/logos/NSLysium_Logotype_Principal_1_blanc.svg"
                alt="NSLysium"
                width={130}
                height={30}
              />
            </Link>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: '#A09484', maxWidth: '32ch' }}
            >
              Reach Your Elysium. Libérez votre esprit de la logistique santé.
            </p>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1px solid rgba(181, 158, 125, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A09484',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FAF7F2'
                    e.currentTarget.style.borderColor = 'rgba(181, 158, 125, 0.55)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#A09484'
                    e.currentTarget.style.borderColor = 'rgba(181, 158, 125, 0.25)'
                  }}
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-6"
                style={{ color: '#FAF7F2' }}
              >
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: '#A09484', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#FAF7F2')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#A09484')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(181, 158, 125, 0.15)' }}
        >
          <p className="text-sm" style={{ color: '#A09484' }}>
            © 2026 NSLysium. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs transition-colors duration-200"
                style={{ color: 'rgba(122, 106, 88, 0.7)', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FAF7F2')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'rgba(122, 106, 88, 0.7)')
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
