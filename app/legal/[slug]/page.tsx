import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const EDITEUR = [
  'Eliott Bouquerel EI, entrepreneur individuel',
  'SIRET : 10576223100014',
  'Directeur de la publication : Eliott Bouquerel',
]

const HEBERGEUR = [
  'Hostinger International Ltd, 61 Lordou Vironos str., Lumiel Building, 6023 Larnaca, Chypre',
  'Serveur situé en France',
]

const PAGES: Record<string, { titre: string; sections: { titre: string; lignes: string[] }[] }> = {
  'mentions-legales': {
    titre: 'Mentions légales',
    sections: [
      {
        titre: 'Le site',
        lignes: [
          "NSLysium est un projet d'école : la marque, le cône Aether et l'app BetaLysium sont fictifs. Ce site est une démonstration, rien n'y est vendu.",
        ],
      },
      { titre: 'Éditeur', lignes: EDITEUR },
      { titre: 'Hébergeur', lignes: HEBERGEUR },
    ],
  },
  confidentialite: {
    titre: 'Confidentialité',
    sections: [
      {
        titre: 'Données collectées',
        lignes: [
          "Ce site ne dépose aucun cookie et ne mesure pas l'audience.",
          "Le formulaire de contact ouvre votre messagerie : rien n'est envoyé ni enregistré sur nos serveurs.",
        ],
      },
      { titre: 'Responsable', lignes: EDITEUR.slice(0, 1) },
    ],
  },
  cgv: {
    titre: 'Conditions générales de vente',
    sections: [
      {
        titre: 'Aucune vente',
        lignes: [
          "NSLysium est un produit fictif. Les formules et les prix affichés servent la démonstration : aucune commande ni aucun paiement n'est possible.",
        ],
      },
    ],
  },
  rgpd: {
    titre: 'RGPD',
    sections: [
      {
        titre: 'Vos données',
        lignes: [
          "Ce site ne traite aucune donnée personnelle : pas de compte, pas de cookie, pas de formulaire envoyé à un serveur.",
          "Pour toute question, écrivez à l'éditeur depuis eliottbouquerel.fr/contact.",
        ],
      },
      { titre: 'Responsable', lignes: EDITEUR.slice(0, 1) },
    ],
  },
}

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/legal/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const page = PAGES[slug]
  return page ? { title: `${page.titre} · NSLysium` } : {}
}

export default async function LegalPage({ params }: PageProps<'/legal/[slug]'>) {
  const { slug } = await params
  const page = PAGES[slug]
  if (!page) notFound()

  return (
    <article
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: 'clamp(7rem, 14vh, 9rem) clamp(1.5rem, 6vw, 3rem) clamp(4rem, 8vh, 6rem)',
        position: 'relative',
        zIndex: 10,
        fontFamily: 'var(--font-dm-sans)',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontWeight: 300,
          fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
          lineHeight: 1.1,
          color: '#FAF7F2',
          marginBottom: '2.5rem',
        }}
      >
        {page.titre}
      </h1>
      {page.sections.map((s) => (
        <section key={s.titre} style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#B59E7D',
              marginBottom: '0.75rem',
            }}
          >
            {s.titre}
          </h2>
          {s.lignes.map((l) => (
            <p key={l} style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(250,247,242,0.7)' }}>
              {l}
            </p>
          ))}
        </section>
      ))}
    </article>
  )
}
