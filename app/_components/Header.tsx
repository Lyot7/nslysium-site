'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { id: 'produit', label: 'Produit' },
  { id: 'abonnement', label: 'Abonnement' },
  { id: 'contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(22, 18, 14, 0.95)'
          : 'rgba(22, 18, 14, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(196, 98, 45, 0.15)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a
            href="#hero"
            onClick={(e) => handleAnchorClick(e, 'hero')}
            className="flex items-center"
          >
            <Image
              src="/images/logos/NSLysium_Logotype_Principal_1_blanc.svg"
              alt="NSLysium"
              width={140}
              height={32}
              priority
            />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleAnchorClick(e, link.id)}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'rgba(250, 247, 242, 0.75)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#FAF7F2')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'rgba(250, 247, 242, 0.75)')
                }
              >
                {link.label}
              </a>
            ))}
            <a
              href="#abonnement"
              onClick={(e) => handleAnchorClick(e, 'abonnement')}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                background: '#C4622D',
                color: '#FAF7F2',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D4773F'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#C4622D'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Commencer
            </a>
          </nav>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span
              className="block w-6 h-0.5 transition-all duration-300"
              style={{
                background: '#FAF7F2',
                transform: menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
              }}
            />
            <span
              className="block w-6 h-0.5 transition-all duration-300"
              style={{
                background: '#FAF7F2',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-0.5 transition-all duration-300"
              style={{
                background: '#FAF7F2',
                transform: menuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
              }}
            />
          </button>
        </div>

        {menuOpen && (
          <div
            className="md:hidden py-6 border-t"
            style={{ borderColor: 'rgba(196, 98, 45, 0.2)' }}
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleAnchorClick(e, link.id)}
                  className="text-base font-medium py-2"
                  style={{ color: 'rgba(250, 247, 242, 0.85)', textDecoration: 'none' }}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#abonnement"
                onClick={(e) => handleAnchorClick(e, 'abonnement')}
                className="mt-2 px-5 py-3 rounded-full text-base font-semibold text-center"
                style={{ background: '#C4622D', color: '#FAF7F2', textDecoration: 'none' }}
              >
                Commencer
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
