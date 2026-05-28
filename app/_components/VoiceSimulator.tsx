'use client'

import { useEffect, useRef, useState } from 'react'

type Demo = {
  prompt: string
  reply: string
  tag: string
}

const DEMOS: Demo[] = [
  {
    tag: 'Sport',
    prompt: "Aether, prépare ma séance.",
    reply:
      "C'est noté. Séance modérée aujourd'hui — votre récupération est à 78%. Je lance votre playlist et je suis l'effort.",
  },
  {
    tag: 'Nutrition',
    prompt: "J'ai mangé un déjeuner léger.",
    reply:
      "Enregistré. Il vous reste 920 kcal et vos macros sont équilibrées. Je vous suggère un dîner riche en protéines.",
  },
  {
    tag: 'Sommeil',
    prompt: "Aether, comment j'ai dormi ?",
    reply:
      "Sept heures et douze minutes. La qualité est en hausse par rapport à votre semaine. C'est une bonne journée pour s'entraîner.",
  },
]

const TYPE_DELAY_PER_CHAR = 22 // ms par caractère
const REPLY_LATENCY = 700 // ms d'attente avant que l'IA "réponde"
const AUTO_DEMO_INTERVAL = 9000 // changement auto si idle

export default function VoiceSimulator() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'listening' | 'thinking' | 'replying' | 'done'>(
    'idle',
  )
  const [typedReply, setTypedReply] = useState('')
  const [userControlled, setUserControlled] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const timersRef = useRef<number[]>([])

  // Nettoyage des timers
  const clearAllTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
  }

  // Démarrer la séquence d'une démo
  const playSequence = (idx: number) => {
    clearAllTimers()
    setActiveIdx(idx)
    setTypedReply('')
    setPhase('listening')

    // ── 1. Phase écoute : on simule le micro qui capte (1.2s)
    const t1 = window.setTimeout(() => {
      setPhase('thinking')
      playChime('thinking')
    }, 1200)

    // ── 2. Phase réflexion (700ms)
    const t2 = window.setTimeout(() => {
      setPhase('replying')
      playChime('reply')
      typeReply(DEMOS[idx].reply)
    }, 1200 + REPLY_LATENCY)

    timersRef.current.push(t1, t2)
  }

  const typeReply = (text: string) => {
    let i = 0
    const step = () => {
      i++
      setTypedReply(text.slice(0, i))
      if (i < text.length) {
        const t = window.setTimeout(step, TYPE_DELAY_PER_CHAR)
        timersRef.current.push(t)
      } else {
        const t = window.setTimeout(() => setPhase('done'), 600)
        timersRef.current.push(t)
      }
    }
    step()
  }

  // Petite note sonore (Web Audio API)
  const playChime = (kind: 'thinking' | 'reply') => {
    try {
      if (!audioCtxRef.current) {
        const AC: typeof AudioContext = (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext) as typeof AudioContext
        audioCtxRef.current = new AC()
      }
      const ctx = audioCtxRef.current
      if (!ctx) return
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = kind === 'thinking' ? 520 : 740
      g.gain.value = 0
      o.connect(g)
      g.connect(ctx.destination)
      const now = ctx.currentTime
      g.gain.linearRampToValueAtTime(0.05, now + 0.02)
      g.gain.linearRampToValueAtTime(0, now + 0.35)
      o.start(now)
      o.stop(now + 0.36)
    } catch {
      // ignore — l'audio est optionnel
    }
  }

  // Auto-cycling des démos si l'utilisateur ne touche pas
  useEffect(() => {
    if (userControlled) return
    playSequence(0)
    const cycle = window.setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % DEMOS.length
        playSequence(next)
        return next
      })
    }, AUTO_DEMO_INTERVAL)
    return () => {
      window.clearInterval(cycle)
      clearAllTimers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userControlled])

  const handleDemoClick = (idx: number) => {
    setUserControlled(true)
    playSequence(idx)
  }

  const active = DEMOS[activeIdx]

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        borderRadius: '1.5rem',
        background: 'rgba(34, 30, 24, 0.65)',
        border: '1px solid rgba(181, 158, 125, 0.18)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}
    >
      {/* ── Visualiseur ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '56px',
            height: '56px',
            flexShrink: 0,
          }}
        >
          {/* anneaux de respiration */}
          {(phase === 'listening' || phase === 'thinking') && (
            <>
              <span className="vs-ring" />
              <span className="vs-ring" style={{ animationDelay: '0.7s' }} />
              <span className="vs-ring" style={{ animationDelay: '1.4s' }} />
            </>
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background:
                phase === 'replying' || phase === 'done'
                  ? 'linear-gradient(135deg, #B59E7D, #C9B395)'
                  : phase === 'thinking'
                  ? 'linear-gradient(135deg, #8B7659, #B59E7D)'
                  : 'rgba(181, 158, 125, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.4s ease',
              boxShadow:
                phase === 'replying' || phase === 'done'
                  ? '0 0 24px rgba(181, 158, 125, 0.5)'
                  : 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: '1.5rem',
                color: '#FAF7F2',
                fontWeight: 300,
                lineHeight: 1,
              }}
            >
              ✦
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(181, 158, 125, 0.85)',
              marginBottom: '0.4rem',
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 600,
            }}
          >
            {phase === 'idle' && 'En veille'}
            {phase === 'listening' && 'À l’écoute'}
            {phase === 'thinking' && 'Aether réfléchit'}
            {phase === 'replying' && 'Aether répond'}
            {phase === 'done' && 'Aether — ' + active.tag}
          </div>
          <p
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 300,
              fontSize: 'clamp(1.05rem, 1.6vw, 1.35rem)',
              color: '#FAF7F2',
              lineHeight: 1.4,
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            «&nbsp;{active.prompt}&nbsp;»
          </p>
        </div>
      </div>

      {/* ── Réponse ── */}
      <div
        style={{
          minHeight: '5.5rem',
          padding: '1.1rem 1.2rem',
          borderRadius: '0.85rem',
          background: 'rgba(181, 158, 125, 0.08)',
          border: '1px solid rgba(181, 158, 125, 0.15)',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.65rem',
            alignItems: 'flex-start',
          }}
        >
          <span
            style={{
              flexShrink: 0,
              fontFamily: 'var(--font-fraunces)',
              color: '#C9B395',
              fontSize: '1.1rem',
              lineHeight: 1.4,
              fontWeight: 300,
            }}
          >
            —
          </span>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: 'rgba(250, 247, 242, 0.92)',
              margin: 0,
              minHeight: '1.5em',
            }}
          >
            {typedReply}
            {(phase === 'replying' || phase === 'thinking') && (
              <span className="vs-caret">|</span>
            )}
          </p>
        </div>
      </div>

      {/* ── Sélecteur démos ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
        }}
      >
        {DEMOS.map((demo, i) => {
          const isActive = i === activeIdx
          return (
            <button
              key={i}
              onClick={() => handleDemoClick(i)}
              style={{
                padding: '0.65rem 0.5rem',
                borderRadius: '0.6rem',
                border: isActive
                  ? '1px solid rgba(181, 158, 125, 0.55)'
                  : '1px solid rgba(181, 158, 125, 0.12)',
                background: isActive
                  ? 'rgba(181, 158, 125, 0.12)'
                  : 'rgba(250, 247, 242, 0.02)',
                color: isActive ? '#FAF7F2' : 'rgba(250, 247, 242, 0.55)',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(181, 158, 125, 0.3)'
                  e.currentTarget.style.color = 'rgba(250, 247, 242, 0.85)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(181, 158, 125, 0.12)'
                  e.currentTarget.style.color = 'rgba(250, 247, 242, 0.55)'
                }
              }}
              aria-label={`Essayer la démo ${demo.tag}`}
            >
              {demo.tag}
            </button>
          )
        })}
      </div>

      {/* ── Caption ── */}
      <p
        style={{
          marginTop: '1.2rem',
          fontSize: '0.65rem',
          letterSpacing: '0.05em',
          color: 'rgba(250, 247, 242, 0.32)',
          fontFamily: 'var(--font-dm-sans)',
          textAlign: 'center',
        }}
      >
        Simulation. L’IA tourne localement sur l’appareil — vos données restent chez vous.
      </p>

      <style jsx>{`
        .vs-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(181, 158, 125, 0.45);
          animation: vs-ring 2.1s ease-out infinite;
          pointer-events: none;
        }
        @keyframes vs-ring {
          0% {
            transform: scale(0.85);
            opacity: 0.65;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        .vs-caret {
          display: inline-block;
          margin-left: 2px;
          color: #C9B395;
          animation: vs-caret 0.9s steps(2) infinite;
        }
        @keyframes vs-caret {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
