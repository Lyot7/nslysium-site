/**
 * Mockup BetaLysium — inspiration Bevel.
 * Design hiérarchique : ring chart concentrique + sparkline + cards minimales.
 * Statique (pas d'interactivité) — c'est un visuel pour la page produit.
 */

const SCORE = 82
const RINGS = [
  // De l'extérieur vers l'intérieur (rayon décroissant)
  { label: 'Sport', value: 78, color: '#C9B395' },
  { label: 'Nutrition', value: 85, color: '#B59E7D' },
  { label: 'Repos', value: 83, color: '#7BA08A' },
]

// Sparkline 7 jours (scores)
const TREND_7D = [74, 71, 78, 80, 77, 85, 82]
const TREND_DELTA = '+8'

// ─── Helpers SVG ─────────────────────────────────────────────────────────────

function RingChart({ size = 168 }: { size?: number }) {
  const stroke = 8
  const gap = 4
  const center = size / 2
  const radii = RINGS.map((_, i) => center - stroke / 2 - i * (stroke + gap))

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {RINGS.map((ring, i) => {
        const r = radii[i]
        const circumference = 2 * Math.PI * r
        const offset = circumference * (1 - ring.value / 100)
        return (
          <g key={ring.label}>
            {/* Track */}
            <circle
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="rgba(250, 247, 242, 0.08)"
              strokeWidth={stroke}
            />
            {/* Progress */}
            <circle
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke={ring.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${center} ${center})`}
            />
          </g>
        )
      })}
    </svg>
  )
}

function Sparkline({ width = 240, height = 36 }: { width?: number; height?: number }) {
  const min = Math.min(...TREND_7D)
  const max = Math.max(...TREND_7D)
  const range = max - min || 1
  const stepX = width / (TREND_7D.length - 1)
  const points = TREND_7D.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')
  const lastX = (TREND_7D.length - 1) * stepX
  const lastY = height - ((TREND_7D[TREND_7D.length - 1] - min) / range) * height

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="spark-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9B395" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C9B395" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Aire sous la courbe */}
      <polygon points={`0,${height} ${points} ${width},${height}`} fill="url(#spark-gradient)" />
      {/* Trait */}
      <polyline points={points} fill="none" stroke="#C9B395" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Point final */}
      <circle cx={lastX} cy={lastY} r="3" fill="#C9B395" />
      <circle cx={lastX} cy={lastY} r="6" fill="#C9B395" opacity="0.25" />
    </svg>
  )
}

// ─── Icons outline (Bevel style) ─────────────────────────────────────────────

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
        </svg>
      )
    case 'activity':
      return (
        <svg {...common}>
          <polyline points="3 12 7 12 10 4 14 20 17 12 21 12" />
        </svg>
      )
    case 'plate':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
        </svg>
      )
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" />
        </svg>
      )
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </svg>
      )
    case 'moon':
      return (
        <svg {...common}>
          <path d="M21 12.5A8.5 8.5 0 1 1 11.5 3a6.5 6.5 0 0 0 9.5 9.5z" />
        </svg>
      )
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 22c4 0 7-3 7-7 0-4-3-5-3-8 0 0-2 2-3 4-1-2-3-3-3-3s1 3-1 6c-2 3-3 4-3 6 0 3 2 5 6 5z" />
        </svg>
      )
    case 'arrow-up':
      return (
        <svg {...common}>
          <path d="M7 14l5-5 5 5" />
        </svg>
      )
    default:
      return null
  }
}

// ─── Composant principal ─────────────────────────────────────────────────────

export default function BetaLysiumMockup() {
  return (
    <div
      style={{
        aspectRatio: '9 / 19',
        maxWidth: '300px',
        margin: '0 auto',
        borderRadius: '2.5rem',
        background: '#0E0B08',
        border: '1px solid rgba(181, 158, 125, 0.16)',
        padding: '1.85rem 1.1rem 0.75rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.55), inset 0 0 0 8px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        fontFamily: 'var(--font-dm-sans)',
        color: '#FAF7F2',
      }}
    >
      {/* Notch / dynamic island */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '0.6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '88px',
          height: '22px',
          background: '#000',
          borderRadius: '9999px',
        }}
      />

      {/* Status bar simulée */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.6rem',
          color: 'rgba(250, 247, 242, 0.55)',
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
      >
        <span>09:24</span>
        <span style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.55rem' }}>●●●</span>
          <span style={{ fontSize: '0.5rem' }}>5G</span>
          <span style={{ fontSize: '0.55rem' }}>▮</span>
        </span>
      </div>

      {/* Header — date + greeting + avatar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div
            style={{
              fontSize: '0.58rem',
              color: 'rgba(250, 247, 242, 0.42)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.2rem',
            }}
          >
            Mardi 28 mai
          </div>
          <div
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '1.1rem',
              fontWeight: 400,
              color: '#FAF7F2',
              lineHeight: 1.1,
            }}
          >
            Bonjour,<br />Sophie.
          </div>
        </div>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#B59E7D',
            border: '1px solid rgba(250, 247, 242, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FAF7F2',
            fontFamily: 'var(--font-fraunces)',
            fontSize: '0.95rem',
            fontWeight: 400,
          }}
        >
          S
        </div>
      </div>

      {/* Ring chart concentrique + score central */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem 0 0.25rem',
        }}
      >
        <RingChart size={150} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.05rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '2.6rem',
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
            }}
          >
            {SCORE}
          </span>
          <span
            style={{
              fontSize: '0.5rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(250, 247, 242, 0.45)',
            }}
          >
            score / 100
          </span>
        </div>
      </div>

      {/* Légende anneaux (3 dots horizontaux) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          fontSize: '0.58rem',
          padding: '0 0.25rem',
        }}
      >
        {RINGS.map((r) => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: r.color,
              }}
            />
            <span style={{ color: 'rgba(250, 247, 242, 0.6)' }}>{r.label}</span>
            <span style={{ color: '#FAF7F2', fontWeight: 600 }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Card trend 7 jours avec sparkline */}
      <div
        style={{
          padding: '0.7rem 0.85rem',
          borderRadius: '0.85rem',
          background: 'rgba(250, 247, 242, 0.03)',
          border: '1px solid rgba(250, 247, 242, 0.06)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span
            style={{
              fontSize: '0.55rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(250, 247, 242, 0.5)',
            }}
          >
            7 derniers jours
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: '#7BA08A',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.15rem',
            }}
          >
            <Icon name="arrow-up" size={11} />
            {TREND_DELTA}
          </span>
        </div>
        <Sparkline width={220} height={32} />
      </div>

      {/* Cards métriques rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {[
          { icon: 'moon', label: 'Sommeil', value: '7h12', sub: 'Qualité 78' },
          { icon: 'flame', label: 'Brûlées', value: '1 840', sub: 'kcal · 78%' },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              padding: '0.65rem 0.7rem',
              borderRadius: '0.7rem',
              background: 'rgba(250, 247, 242, 0.03)',
              border: '1px solid rgba(250, 247, 242, 0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginBottom: '0.35rem',
                color: 'rgba(250, 247, 242, 0.55)',
              }}
            >
              <Icon name={m.icon} size={12} />
              <span
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                {m.label}
              </span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: '1.05rem',
                fontWeight: 400,
                lineHeight: 1,
                marginBottom: '0.2rem',
              }}
            >
              {m.value}
            </div>
            <div style={{ fontSize: '0.58rem', color: 'rgba(250, 247, 242, 0.4)' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Card séance proposée */}
      <div
        style={{
          padding: '0.7rem 0.85rem',
          borderRadius: '0.85rem',
          background: 'linear-gradient(135deg, rgba(181, 158, 125, 0.16), rgba(181, 158, 125, 0.04))',
          border: '1px solid rgba(181, 158, 125, 0.22)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.5rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#C9B395',
              marginBottom: '0.2rem',
            }}
          >
            Séance proposée · 18h
          </div>
          <div
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '0.92rem',
              color: '#FAF7F2',
              lineHeight: 1.2,
            }}
          >
            Trail modéré · 45 min
          </div>
        </div>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#B59E7D',
            color: '#1F1A14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          ▸
        </div>
      </div>

      {/* Bottom nav (5 items + indicateur actif) */}
      <div
        style={{
          marginTop: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          padding: '0.6rem 0 0.4rem',
          borderTop: '1px solid rgba(250, 247, 242, 0.05)',
        }}
      >
        {[
          { icon: 'home', active: true },
          { icon: 'activity', active: false },
          { icon: 'plate', active: false },
          { icon: 'heart', active: false },
          { icon: 'user', active: false },
        ].map((n, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.18rem',
              color: n.active ? '#C9B395' : 'rgba(250, 247, 242, 0.32)',
            }}
          >
            <Icon name={n.icon} size={17} />
            {n.active && (
              <span
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: '#C9B395',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* FAB ✦ flottant (assistant IA) */}
      <div
        style={{
          position: 'absolute',
          bottom: '4.5rem',
          right: '1rem',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: '#B59E7D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1F1A14',
          fontFamily: 'var(--font-fraunces)',
          fontSize: '1.1rem',
          boxShadow: '0 6px 18px rgba(181, 158, 125, 0.45), 0 0 0 4px rgba(181, 158, 125, 0.12)',
        }}
      >
        ✦
      </div>
    </div>
  )
}
