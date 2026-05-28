'use client'

import { useState } from 'react'

const SUBJECTS = [
  { value: 'general', label: 'Une question générale' },
  { value: 'product', label: 'Sur le produit' },
  { value: 'subscription', label: 'Sur mon abonnement' },
  { value: 'support', label: "Besoin d'aide / SAV" },
  { value: 'partnership', label: 'Partenariat / presse' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Cas fictif : pas d'API backend
    const body = encodeURIComponent(
      `Sujet : ${SUBJECTS.find((s) => s.value === form.subject)?.label}\nDe : ${
        form.name
      } (${form.email})\n\n${form.message}`,
    )
    window.location.href = `mailto:contact@nslysium.com?subject=Contact%20depuis%20le%20site&body=${body}`
    setSubmitted(true)
  }

  return (
    <main style={{ paddingTop: '5rem', position: 'relative', zIndex: 10 }}>
      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: 'clamp(4rem, 10vh, 7rem) clamp(1.5rem, 6vw, 5rem) clamp(2rem, 4vh, 3rem)',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#B59E7D',
            marginBottom: '1.25rem',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          Nous écrire
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 300,
            fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
            lineHeight: 1.1,
            color: '#FAF7F2',
            marginBottom: '1.5rem',
          }}
        >
          Un échange, <span style={{ color: '#C9B395' }}>sans bruit.</span>
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.78,
            color: 'rgba(250,247,242,0.6)',
            maxWidth: '50ch',
            margin: '0 auto',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          Une question, une remarque, un projet de partenariat. Nous lisons chaque message et
          répondons dans les vingt-quatre heures ouvrées.
        </p>
      </section>

      {/* ── BLOCS DIRECTS ── */}
      <section
        id="rdv"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: 'clamp(2rem, 4vh, 3rem) clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {[
            {
              label: 'Support',
              title: 'Email',
              value: 'support@nslysium.com',
              href: 'mailto:support@nslysium.com',
            },
            {
              label: 'Téléphone',
              title: 'Lun-Ven, 9h-18h',
              value: '+33 1 23 45 67 89',
              href: 'tel:+33123456789',
            },
            {
              label: 'Adresse',
              title: 'NSLysium SAS',
              value: 'Paris, France',
              href: null,
            },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                background: 'rgba(34,30,24,0.55)',
                border: '1px solid rgba(181, 158, 125,0.13)',
              }}
            >
              <div
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#B59E7D',
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-dm-sans)',
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: '#FAF7F2',
                  marginBottom: '0.4rem',
                }}
              >
                {c.title}
              </div>
              {c.href ? (
                <a
                  href={c.href}
                  style={{
                    fontSize: '0.88rem',
                    color: 'rgba(250,247,242,0.7)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-dm-sans)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#B59E7D')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(250,247,242,0.7)')
                  }
                >
                  {c.value}
                </a>
              ) : (
                <div
                  style={{
                    fontSize: '0.88rem',
                    color: 'rgba(250,247,242,0.7)',
                    fontFamily: 'var(--font-dm-sans)',
                  }}
                >
                  {c.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FORMULAIRE ── */}
      <section
        id="support"
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 6vw, 5rem) clamp(5rem, 10vh, 7rem)',
        }}
      >
        <div
          style={{
            padding: 'clamp(2rem, 4vw, 3rem)',
            borderRadius: '1.25rem',
            background: 'rgba(34,30,24,0.6)',
            border: '1px solid rgba(181, 158, 125,0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 300,
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              color: '#FAF7F2',
              marginBottom: '0.5rem',
            }}
          >
            Écrivez-nous.
          </h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'rgba(250,247,242,0.55)',
              marginBottom: '2rem',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Nous vous répondons sous 24h ouvrées.
          </p>

          {submitted ? (
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '0.85rem',
                background: 'rgba(92,138,110,0.12)',
                border: '1px solid rgba(92,138,110,0.4)',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontSize: '1.1rem',
                  color: '#FAF7F2',
                  marginBottom: '0.4rem',
                }}
              >
                Message envoyé.
              </p>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(250,247,242,0.6)',
                  fontFamily: 'var(--font-dm-sans)',
                  margin: 0,
                }}
              >
                Si votre client mail ne s'est pas ouvert, écrivez-nous à{' '}
                <a
                  href="mailto:contact@nslysium.com"
                  style={{ color: '#B59E7D', textDecoration: 'none' }}
                >
                  contact@nslysium.com
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label style={fieldLabelStyle}>
                  <span style={fieldHintStyle}>Prénom et nom</span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Sophie Martin"
                    style={inputStyle}
                  />
                </label>
                <label style={fieldLabelStyle}>
                  <span style={fieldHintStyle}>Email</span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="vous@exemple.com"
                    style={inputStyle}
                  />
                </label>
              </div>

              <label style={fieldLabelStyle}>
                <span style={fieldHintStyle}>Sujet</span>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value} style={{ background: '#221E18' }}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>

              <label style={fieldLabelStyle}>
                <span style={fieldHintStyle}>Votre message</span>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Dites-nous tout. Nous prenons le temps de lire."
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-dm-sans)' }}
                />
              </label>

              <button
                type="submit"
                style={{
                  marginTop: '0.5rem',
                  padding: '1rem 1.5rem',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#B59E7D',
                  color: '#FAF7F2',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-dm-sans)',
                  transition: 'all 0.25s ease',
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
                Envoyer le message
              </button>

              <p
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(250,247,242,0.4)',
                  textAlign: 'center',
                  fontFamily: 'var(--font-dm-sans)',
                  marginTop: '0.5rem',
                }}
              >
                Vos données sont traitées conformément au RGPD. Nous ne partageons rien avec des
                tiers.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

const fieldLabelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
}

const fieldHintStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(250,247,242,0.55)',
  fontFamily: 'var(--font-dm-sans)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '0.65rem',
  background: 'rgba(22,18,14,0.6)',
  border: '1px solid rgba(181, 158, 125,0.18)',
  color: '#FAF7F2',
  fontSize: '0.92rem',
  fontFamily: 'var(--font-dm-sans)',
  outline: 'none',
  transition: 'border-color 0.2s ease',
}
