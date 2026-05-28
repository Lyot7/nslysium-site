import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Produit — Aether & BetaLysium · NSLysium',
  description:
    "Aether, le cône vocal sans écran. BetaLysium, l'app qui orchestre votre quotidien. Découvrez l'écosystème NSLysium.",
}

export default function ProduitLayout({ children }: { children: React.ReactNode }) {
  return children
}
