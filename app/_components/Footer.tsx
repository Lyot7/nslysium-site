import Link from 'next/link'
import Image from 'next/image'

const footerColumns = [
  {
    title: 'Produit',
    links: [
      { href: '/produit#fonctionnalites', label: 'Fonctionnalités' },
      { href: '/abonnement', label: 'Abonnement' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { href: '/produit', label: 'À propos' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { href: '/legal/mentions-legales', label: 'Mentions légales' },
      { href: '/legal/confidentialite', label: 'Politique de confidentialité' },
      { href: '/legal/rgpd', label: 'RGPD' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ background: '#221E18', position: 'relative', zIndex: 20 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logos/NSLysium_Logotype_Principal_1_blanc.svg"
                alt="NSLysium"
                width={130}
                height={30}
              />
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: '#7A6A58' }}>
              Reach Your Elysium
            </p>
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
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-[#FAF7F2]"
                      style={{ color: '#7A6A58' }}
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
          style={{ borderTop: '1px solid rgba(196, 98, 45, 0.15)' }}
        >
          <p className="text-sm" style={{ color: '#7A6A58' }}>
            © 2025 NSLysium. Tous droits réservés.
          </p>
          <p className="text-sm" style={{ color: 'rgba(122, 106, 88, 0.6)' }}>
            Fabriqué avec soin en France
          </p>
        </div>
      </div>
    </footer>
  )
}
