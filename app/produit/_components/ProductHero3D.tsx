'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// 3D côté client uniquement (Three.js + R3F).
const ProductCone3D = dynamic(() => import('./ProductCone3D'), { ssr: false })

// Coloris officiels Aether (cf. brand book / produit/page.tsx)
type Color = {
  id: string
  name: string
  description: string
  hex: string
  context: string
  packaging: string
}

const COLORS: Color[] = [
  {
    id: 'blanc',
    name: 'Blanc',
    description: 'Egg Shell',
    hex: '#F1EADA',
    context: 'Salon moderne, marbre & végétation',
    packaging: 'Egg Shell + marbre blanc',
  },
  {
    id: 'orange',
    name: 'Orange',
    description: 'Carrot Orange',
    hex: '#F1983A',
    context: 'Cuisine ouverte, lumière naturelle',
    packaging: 'Carrot Orange + bois clair',
  },
  {
    id: 'noir',
    name: 'Noir',
    description: 'Rich Mahogany',
    hex: '#1C1410',
    context: 'Salle de bain, rituels soin & récupération',
    packaging: 'Rich Mahogany + chêne naturel brun',
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux',
    description: 'Deep Bordeaux',
    hex: '#6B1F2A',
    context: 'Bureau, espace de travail premium',
    packaging: 'Bordeaux + cuir naturel FSC',
  },
  {
    id: 'beige',
    name: 'Beige',
    description: 'Khaki Beige',
    hex: '#B59E7D',
    context: 'Chambre, espace détente & sommeil',
    packaging: 'Khaki + bois clair FSC',
  },
]

export default function ProductHero3D() {
  const [activeIdx, setActiveIdx] = useState(4) // Khaki Beige par défaut (DA du site)
  const active = COLORS[activeIdx]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 'clamp(2rem, 5vw, 4rem)',
        alignItems: 'center',
      }}
      className="produit-aether-grid"
    >
      {/* Canvas 3D : cône immobile */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 5',
          borderRadius: '1.25rem',
          background:
            'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(181, 158, 125, 0.10) 0%, rgba(31, 26, 20, 0) 70%), linear-gradient(180deg, rgba(42, 36, 29, 0.5) 0%, rgba(31, 26, 20, 0.7) 100%)',
          border: '1px solid rgba(181, 158, 125, 0.14)',
          overflow: 'hidden',
        }}
      >
        <ProductCone3D colorHex={active.hex} />

        {/* Label coloris en bas-gauche du canvas */}
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            padding: '0.5rem 0.9rem',
            borderRadius: '9999px',
            background: 'rgba(20, 16, 12, 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(181, 158, 125, 0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: active.hex,
              border: '1px solid rgba(250, 247, 242, 0.18)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#FAF7F2',
              fontFamily: 'var(--font-dm-sans)',
              letterSpacing: '0.03em',
            }}
          >
            Aether {active.name}
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              color: 'rgba(250, 247, 242, 0.55)',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            · {active.description}
          </span>
        </div>
      </div>

      {/* Sélecteur de coloris + détails */}
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
          Aether — le cône
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
          Cinq coloris, <span style={{ color: '#C9B395' }}>une seule présence</span>.
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
          Aether n'a pas d'écran. C'est volontaire. Cinq finitions pour qu'il s'intègre noblement
          au lieu qui l'accueille — du salon au bureau, en passant par la chambre.
        </p>

        {/* Pastilles couleur */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.65rem',
            marginBottom: '1.5rem',
          }}
        >
          {COLORS.map((c, i) => {
            const isActive = i === activeIdx
            return (
              <button
                key={c.id}
                onClick={() => setActiveIdx(i)}
                aria-label={`Coloris ${c.name} — ${c.description}`}
                aria-pressed={isActive}
                style={{
                  // Hit area constante 44×44 (WCAG 2.5.5).
                  // L'effet visuel actif/inactif passe par la pastille intérieure.
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: 'block',
                    width: isActive ? '40px' : '30px',
                    height: isActive ? '40px' : '30px',
                    borderRadius: '50%',
                    background: c.hex,
                    border: isActive
                      ? '2px solid rgba(250, 247, 242, 0.95)'
                      : '1px solid rgba(250, 247, 242, 0.18)',
                    outline: isActive
                      ? '2px solid rgba(181, 158, 125, 0.45)'
                      : 'none',
                    outlineOffset: '3px',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive
                      ? `0 6px 18px ${c.hex}66`
                      : '0 2px 6px rgba(0, 0, 0, 0.2)',
                  }}
                />
              </button>
            )
          })}
        </div>

        {/* Détails coloris actif */}
        <div
          style={{
            padding: '1rem 1.15rem',
            borderRadius: '0.85rem',
            background: 'rgba(34, 30, 24, 0.55)',
            border: '1px solid rgba(181, 158, 125, 0.14)',
          }}
        >
          <div
            style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B59E7D',
              marginBottom: '0.4rem',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            {active.description}
          </div>
          <div
            style={{
              fontSize: '0.88rem',
              lineHeight: 1.55,
              color: 'rgba(250, 247, 242, 0.75)',
              fontFamily: 'var(--font-dm-sans)',
              marginBottom: '0.4rem',
            }}
          >
            {active.context}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: 'rgba(250, 247, 242, 0.45)',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Coffret : {active.packaging}
          </div>
        </div>
      </div>
    </div>
  )
}
