import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Abonnement — Freemium · Premium · Elite · NSLysium',
  description:
    "Trois formules. Une seule philosophie. Choisissez ce qui vous ressemble. Pas d'engagement.",
}

export default function AbonnementLayout({ children }: { children: React.ReactNode }) {
  return children
}
