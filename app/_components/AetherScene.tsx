'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

// Profil LatheGeometry — cône élancé avec base semi-sphérique
const PROFILE: [number, number][] = [
  [0.004, 1.44],
  [0.04,  1.28],
  [0.12,  1.06],
  [0.28,  0.78],
  [0.48,  0.46],
  [0.68,  0.12],
  [0.85,  -0.10],
  [0.98,  -0.26],
  [1.05,  -0.40],   // équateur (max radius)
  [1.02,  -0.56],
  [0.91,  -0.72],
  [0.74,  -0.86],
  [0.53,  -0.97],
  [0.28,  -1.05],
  [0.06,  -1.10],
  [0.0,   -1.10],
]

// Diamètre max du cône à scale=1 (unités monde)
const CONE_DIAMETER = 2.10

// Waypoints : vx en fractions du 1/3-viewport
// vx = +1.0 → centre exact du 1/3 droit | vx = -1.0 → centre du 1/3 gauche
// La conversion world x = (vx * viewport.width / 3) se fait dans useFrame
const WAYPOINTS = [
  // 0 Hero : 1/3 droit, cône grand
  { vx:  1.00, vy:  0.08, scale: 0.54, rotX: 0.00, rotZ:  0.00, spin: 0.003, li: '#C4622D', lint: 5.0 },
  // 1 Enceinte : 1/3 droit, légèrement incliné
  { vx:  1.00, vy:  0.05, scale: 0.50, rotX: 0.44, rotZ: -0.08, spin: 0.005, li: '#F5C438', lint: 6.5 },
  // 2 App : 1/3 gauche — DOIT rester dans l'espace vide
  { vx: -1.00, vy:  0.05, scale: 0.46, rotX: 0.08, rotZ:  0.22, spin: 0.004, li: '#8BB4F0', lint: 5.5 },
  // 3 Usages : 1/3 droit, spin rapide
  { vx:  1.00, vy:  0.06, scale: 0.48, rotX: 0.24, rotZ:  0.14, spin: 0.012, li: '#E05810', lint: 7.0 },
  // 4 CTA : centré très haut
  { vx:  0.00, vy:  0.42, scale: 0.46, rotX: 0.00, rotZ:  0.00, spin: 0.003, li: '#FFB347', lint: 5.5 },
]

interface ScrollRef { progress: number; section: number }

interface ConeModelProps {
  scrollRef: React.MutableRefObject<ScrollRef>
  mouseRef:  React.MutableRefObject<{ x: number; y: number }>
}

function ConeModel({ scrollRef, mouseRef }: ConeModelProps) {
  const { viewport } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const meshRef  = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const cur = useRef({ x: 0, y: 0, sc: 0.58, rx: 0, rz: 0 })
  const tmpA = useRef(new THREE.Color())
  const tmpB = useRef(new THREE.Color())

  const geometry = useMemo(() => {
    const pts = PROFILE.map(([x, y]) => new THREE.Vector2(x, y))
    const g = new THREE.LatheGeometry(pts, 128)
    g.computeVertexNormals()
    return g
  }, [])

  // 24 nervures verticales définies, SSR-safe (useMemo = client-only grâce au wrapper 'use client')
  const bumpTexture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 512
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#888'
    ctx.fillRect(0, 0, 1024, 512)
    for (let i = 0; i < 24; i++) {
      const cx = Math.round((i / 24) * 1024)
      const g = ctx.createLinearGradient(cx - 11, 0, cx + 11, 0)
      g.addColorStop(0,   '#9a9a9a')
      g.addColorStop(0.35,'#4a4a4a')
      g.addColorStop(0.5, '#383838')
      g.addColorStop(0.65,'#4a4a4a')
      g.addColorStop(1,   '#9a9a9a')
      ctx.fillStyle = g
      ctx.fillRect(cx - 11, 0, 22, 512)
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.fillRect(cx - 13, 0, 3, 512)
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.RepeatWrapping
    t.repeat.set(1, 3)
    return t
  }, [])

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current || !lightRef.current) return

    const t = state.clock.elapsedTime
    const p = scrollRef.current.progress

    // Smoothstep entre waypoints adjacents
    const total = WAYPOINTS.length - 1
    const raw = Math.max(0, Math.min(p * total, total - 0.0001))
    const idx = Math.floor(raw)
    const frac = raw - idx
    const st = frac * frac * (3 - 2 * frac)

    const a = WAYPOINTS[idx]
    const b = WAYPOINTS[idx + 1]

    // ── Adaptation responsive ─────────────────────────────────────────────────
    // vx=±1 mappe sur le CENTRE du 1/3 colonne (viewport.width/3 depuis le centre)
    // xMult ne réduit le déplacement que sur vrai portrait mobile (<0.80)
    // Sur tout écran landscape/desktop, le cône va exactement dans son tiers
    const aspect = viewport.aspect
    let xMult  = 1.0   // portrait strict → centré
    let scMult = 1.0
    let yOff   = 0.0
    if (aspect < 0.60) {
      xMult = 0.04; scMult = 0.58; yOff = 0.18   // portrait phone
    } else if (aspect < 0.80) {
      xMult = 0.12; scMult = 0.68; yOff = 0.12   // portrait phone large
    } else if (aspect < 1.05) {
      // Quasi-carré (petite tablette portrait, fenêtre desktop étroite)
      // Pas de layout 2/3+1/3 sur mobile (<768px CSS), mais pour les fenêtres
      // desktop étroites on garde le plein déplacement avec scale réduit
      xMult = 0.85; scMult = 0.80
    }
    // > 1.05 : landscape & desktop → xMult=1, scMult=1 (valeurs par défaut)

    // ── Cible X : centre du tiers gauche/droit, jamais au-delà ───────────────
    // vx=1 → viewport.width/3 depuis le centre (centre du 1/3 droit)
    // vx=0 → 0 (centré)
    const colW   = viewport.width / 3          // largeur d'un tiers en world units
    const vxNow  = a.vx + (b.vx - a.vx) * st
    // Cible brute : centre de la colonne × xMult (réduit sur mobile)
    const baseX  = vxNow * colW * xMult

    // ── Scale : le cône tient dans son tiers avec une marge de 30% ──────────
    const maxRadius = colW * 0.35              // rayon max = 35% de la largeur du tiers
    const maxScale  = (maxRadius * 2) / CONE_DIAMETER
    const baseScale = (a.scale + (b.scale - a.scale) * st) * scMult
    const clampedScale = Math.min(baseScale, maxScale)

    const twx = baseX
    const twy = ((a.vy + (b.vy - a.vy) * st) + yOff) * viewport.height * 0.5
    const trx = a.rotX + (b.rotX - a.rotX) * st
    const trz = a.rotZ + (b.rotZ - a.rotZ) * st
    const spin = a.spin + (b.spin - a.spin) * st

    // Lerp fluide (~0.6s pour atteindre 95% de la cible)
    const lf = 0.075
    cur.current.x  = THREE.MathUtils.lerp(cur.current.x,  twx + mouseRef.current.x * 0.18, lf)
    cur.current.y  = THREE.MathUtils.lerp(cur.current.y,  twy + mouseRef.current.y * 0.12, lf)
    cur.current.sc = THREE.MathUtils.lerp(cur.current.sc, clampedScale, lf)
    cur.current.rx = THREE.MathUtils.lerp(cur.current.rx, trx + mouseRef.current.y * 0.09, lf)
    cur.current.rz = THREE.MathUtils.lerp(cur.current.rz, trz + mouseRef.current.x * 0.05, lf)

    groupRef.current.position.x = cur.current.x
    groupRef.current.position.y = cur.current.y + Math.sin(t * 0.65) * 0.045
    groupRef.current.scale.setScalar(cur.current.sc)
    groupRef.current.rotation.x = cur.current.rx
    groupRef.current.rotation.z = cur.current.rz
    meshRef.current.rotation.y += spin

    // Couleur lumière interpolée
    tmpA.current.set(a.li)
    tmpB.current.set(b.li)
    tmpA.current.lerp(tmpB.current, st)
    lightRef.current.color.lerp(tmpA.current, 0.06)
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      a.lint + (b.lint - a.lint) * st,
      0.05
    )
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry} castShadow>
        <meshPhysicalMaterial
          color="#B54C18"
          roughness={0.28}
          metalness={0.05}
          clearcoat={0.68}
          clearcoatRoughness={0.13}
          sheen={0.38}
          sheenColor="#FF7830"
          sheenRoughness={0.45}
          bumpMap={bumpTexture}
          bumpScale={0.022}
          envMapIntensity={2.6}
        />
      </mesh>

      {/* 3 boutons flush blanc nacré */}
      {([-0.20, 0, 0.20] as number[]).map((off, i) => (
        <mesh key={i} position={[off, -0.14 + off * 0.04, 1.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.030, 0.030, 0.016, 24]} />
          <meshPhysicalMaterial color="#F3EEE6" roughness={0.40} metalness={0.20} clearcoat={0.5} />
        </mesh>
      ))}

      <pointLight ref={lightRef} position={[-2.0, 3.5, 2.8]} intensity={5} color="#C4622D" />
    </group>
  )
}

interface AetherSceneProps {
  scrollRef: React.MutableRefObject<ScrollRef>
  mouseRef:  React.MutableRefObject<{ x: number; y: number }>
  className?: string
  style?: React.CSSProperties
}

function AetherCanvasInner({ scrollRef, mouseRef }: AetherSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.10, 5.6], fov: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.22,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0, 0, 0), 0)
      }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.22} />
      <pointLight position={[4, 5, 4]} intensity={4.5} color="#FFF0D8" />
      <pointLight position={[-5, -2, 3]} intensity={1.2} color="#1A1410" />
      <Environment preset="studio" />
      <ConeModel scrollRef={scrollRef} mouseRef={mouseRef} />
    </Canvas>
  )
}

export default function AetherScene({ scrollRef, mouseRef, className = '', style }: AetherSceneProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <AetherCanvasInner scrollRef={scrollRef} mouseRef={mouseRef} />
    </div>
  )
}
