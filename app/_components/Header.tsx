'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

// Navigation : 3 sections distinctes du site (4-pages selon brief).
// Aucun doublon — chaque libellé pointe vers une page unique.
const NAV = [
  { href: '/produit', label: 'Produit' },
  { href: '/abonnement', label: 'Abonnement' },
  { href: '/contact', label: 'Contact' },
]

// CTA principal : action commerciale concrète (commander le hardware),
// distincte du lien menu "Abonnement" (consulter les tarifs).
const CTA = { href: '/contact#rdv', label: 'Précommander' }

const DESKTOP_BREAKPOINT = 900 // px — au-dessus, menu inline. En-dessous, burger.

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const pathname = usePathname()

  // Détection viewport (plus fiable que md:hidden de Tailwind quand le header
  // a un `width: auto` qui ne déclenche pas les breakpoints comme attendu).
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className="fixed z-50"
      style={{
        top: 'clamp(0.85rem, 1.5vh, 1.5rem)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'auto',
        maxWidth: 'calc(100vw - 1.5rem)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.4rem',
          // Math du containement du CTA dans la pill (borderRadius 9999px) :
          // Le CTA a height 32px + borderRadius 9999px → courbe de rayon 16px.
          // Pour qu'il tienne dans la courbe pill, il faut :
          //   pill_half_radius ≥ padding-horizontal + CTA_radius
          // Avec padding `0.85rem 0.7rem` :
          //   pill_height = 32 + 27.2 = 59.2px → half-radius 29.6px
          //   ≥ 11.2 (padding-right) + 16 (CTA radius) = 27.2 ✓ avec ~2px de marge
          padding: '0.85rem 0.7rem',
          borderRadius: '9999px',
          background: scrolled
            ? 'rgba(20, 16, 12, 0.85)'
            : 'rgba(20, 16, 12, 0.55)',
          backdropFilter: 'blur(20px) saturate(1.15)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.15)',
          border: '1px solid rgba(181, 158, 125, 0.18)',
          boxShadow: scrolled
            ? '0 12px 36px rgba(0, 0, 0, 0.35)'
            : '0 8px 24px rgba(0, 0, 0, 0.25)',
          // Largeur fixe en mobile : pill et drawer partagent la même largeur
          // pour que le header ne se redimensionne pas à l'ouverture du menu
          // (sinon translateX(-50%) recale visuellement la pill).
          width: isDesktop ? 'auto' : '280px',
        }}
      >
        {/* Logo — conteneur dimensions explicites (le SVG s'aligne dedans) */}
        <Link
          href="/"
          aria-label="Accueil NSLysium"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '36px',
            padding: '0 0.6rem',
            flexShrink: 0,
          }}
        >
          <Image
            src="/images/logos/NSLysium_Logotype_Principal_1_blanc.svg"
            alt="NSLysium"
            width={132}
            height={28}
            priority
            style={{ display: 'block', height: '20px', width: 'auto' }}
          />
        </Link>

        {/* Séparateur subtil — uniquement desktop */}
        {isDesktop && (
          <div
            aria-hidden
            style={{
              width: '1px',
              height: '20px',
              background: 'rgba(181, 158, 125, 0.25)',
              margin: '0 0.35rem',
            }}
          />
        )}

        {/* Nav desktop */}
        {isDesktop && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {NAV.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '32px',
                    padding: '0 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    color: isActive ? '#FAF7F2' : 'rgba(250, 247, 242, 0.72)',
                    textDecoration: 'none',
                    background: isActive ? 'rgba(181, 158, 125, 0.12)' : 'transparent',
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--font-dm-sans)',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#FAF7F2'
                      e.currentTarget.style.background = 'rgba(181, 158, 125, 0.08)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(250, 247, 242, 0.72)'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}

        {/* CTA principal — desktop seulement (en mobile il est dans le drawer) */}
        {isDesktop && (
          <Link
            href={CTA.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '32px',
              padding: '0 0.95rem',
              borderRadius: '9999px',
              background: '#B59E7D',
              color: '#1F1A14',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.01em',
              textDecoration: 'none',
              marginLeft: '0.2rem',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-dm-sans)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#C9B395'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#B59E7D'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {CTA.label}
          </Link>
        )}

        {/* Hamburger — uniquement quand pas de nav desktop visible */}
        {!isDesktop && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {/* 3 barres absolutely positioned dans un carré 20×16
                → rotation autour du centre exact → X parfaitement symétrique */}
            <div style={{ position: 'relative', width: '20px', height: '16px' }}>
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1.5px',
                  background: '#FAF7F2',
                  transformOrigin: 'center',
                  transform: menuOpen
                    ? 'translateY(-50%) rotate(45deg)'
                    : 'translateY(calc(-50% - 6px))',
                  transition: 'transform 0.25s ease',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1.5px',
                  background: '#FAF7F2',
                  transform: 'translateY(-50%)',
                  opacity: menuOpen ? 0 : 1,
                  transition: 'opacity 0.18s ease',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1.5px',
                  background: '#FAF7F2',
                  transformOrigin: 'center',
                  transform: menuOpen
                    ? 'translateY(-50%) rotate(-45deg)'
                    : 'translateY(calc(-50% + 6px))',
                  transition: 'transform 0.25s ease',
                }}
              />
            </div>
          </button>
        )}
      </div>

      {/* Drawer : panneau dropdown sous la pill, uniquement quand burger ouvert.
          Width = 100% du header parent (= 280px en mobile) pour que la pill
          ne bouge pas à l'ouverture. */}
      {!isDesktop && menuOpen && (
        <div
          style={{
            marginTop: '0.6rem',
            padding: '1rem',
            borderRadius: '1.25rem',
            background: 'rgba(20, 16, 12, 0.92)',
            backdropFilter: 'blur(20px) saturate(1.15)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.15)',
            border: '1px solid rgba(181, 158, 125, 0.18)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {NAV.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '0.7rem 0.85rem',
                    borderRadius: '0.65rem',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: isActive ? '#FAF7F2' : 'rgba(250, 247, 242, 0.78)',
                    textDecoration: 'none',
                    background: isActive ? 'rgba(181, 158, 125, 0.12)' : 'transparent',
                    fontFamily: 'var(--font-dm-sans)',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href={CTA.href}
              style={{
                marginTop: '0.5rem',
                padding: '0.8rem 1rem',
                borderRadius: '9999px',
                background: '#B59E7D',
                color: '#1F1A14',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              {CTA.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
