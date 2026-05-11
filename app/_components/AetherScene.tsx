'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const SPEAKER_HEIGHT_M = 0.213
const DISPLAY_SCALE    = 14

useGLTF.preload('/models/speaker.glb')

// ─── Types ──────────────────────────────────────────────────────────────────

interface Waypoint {
  vx:    number  // position X en fractions de (viewport.width / 3) — positif = droite
  vy:    number  // position Y en fractions de (viewport.height / 2) — positif = haut
  scale: number  // scale du modèle (multiplié ensuite par DISPLAY_SCALE)
  rotX:  number  // inclinaison avant/arrière en radians
  rotZ:  number  // inclinaison gauche/droite en radians
  li:    string  // couleur de la pointLight orbitale
  lint:  number  // intensité de la pointLight orbitale
}

interface ScrollRef { progress: number; section: number }

// ─── Waypoints par breakpoint ────────────────────────────────────────────────
// Chaque entrée correspond à une section (0=Hero → 4=Abonnement/Contact).
// Modifier ici pour ajuster positions et tailles par taille d'écran.

const WAYPOINTS_DESKTOP: Waypoint[] = [
  // Section 0 — Hero
  { vx:  1.00, vy:  0.08, scale: 0.54, rotX: 0.00, rotZ:  0.00, li: '#FFCB94', lint: 3.0 },
  // Section 1 — Aether
  { vx:  1.00, vy:  0.05, scale: 0.50, rotX: 0.18, rotZ: -0.08, li: '#FFD78A', lint: 3.5 },
  // Section 2 — App
  { vx: -1.00, vy:  0.05, scale: 0.46, rotX: 0.08, rotZ:  0.18, li: '#A8C8FF', lint: 3.0 },
  // Section 3 — Cas d'usage
  { vx:  1.00, vy:  0.06, scale: 0.48, rotX: 0.10, rotZ:  0.10, li: '#FFB070', lint: 3.5 },
  // Section 4-5 — Abonnement / Contact
  { vx:  0.00, vy:  0.42, scale: 0.46, rotX: 0.00, rotZ:  0.00, li: '#FFC080', lint: 3.0 },
]

const WAYPOINTS_TABLET: Waypoint[] = [
  { vx:  0.65, vy:  0.08, scale: 0.50, rotX: 0.00, rotZ:  0.00, li: '#FFCB94', lint: 3.0 },
  { vx:  0.65, vy:  0.05, scale: 0.46, rotX: 0.18, rotZ: -0.08, li: '#FFD78A', lint: 3.5 },
  { vx: -0.65, vy:  0.05, scale: 0.44, rotX: 0.08, rotZ:  0.18, li: '#A8C8FF', lint: 3.0 },
  { vx:  0.65, vy:  0.06, scale: 0.44, rotX: 0.10, rotZ:  0.10, li: '#FFB070', lint: 3.5 },
  { vx:  0.00, vy:  0.38, scale: 0.42, rotX: 0.00, rotZ:  0.00, li: '#FFC080', lint: 3.0 },
]

const WAYPOINTS_MOBILE: Waypoint[] = [
  // Sur mobile le contenu est en bas — le modèle flotte dans la partie haute
  { vx:  0.00, vy:  0.35, scale: 0.40, rotX: 0.00, rotZ:  0.00, li: '#FFCB94', lint: 3.0 },
  { vx:  0.22, vy:  0.32, scale: 0.38, rotX: 0.12, rotZ: -0.06, li: '#FFD78A', lint: 3.5 },
  { vx: -0.22, vy:  0.32, scale: 0.36, rotX: 0.06, rotZ:  0.12, li: '#A8C8FF', lint: 3.0 },
  { vx:  0.18, vy:  0.32, scale: 0.38, rotX: 0.08, rotZ:  0.08, li: '#FFB070', lint: 3.5 },
  { vx:  0.00, vy:  0.38, scale: 0.36, rotX: 0.00, rotZ:  0.00, li: '#FFC080', lint: 3.0 },
]

function pickWaypoints(): Waypoint[] {
  if (typeof window === 'undefined') return WAYPOINTS_DESKTOP
  const w = window.innerWidth
  if (w < 768)  return WAYPOINTS_MOBILE
  if (w < 1024) return WAYPOINTS_TABLET
  return WAYPOINTS_DESKTOP
}

// ─── Modèle 3D ──────────────────────────────────────────────────────────────

interface SpeakerModelProps {
  scrollRef: React.MutableRefObject<ScrollRef>
  mouseRef:  React.MutableRefObject<{ x: number; y: number }>
  colorRef:  React.MutableRefObject<string>
}

function SpeakerModel({ scrollRef, mouseRef, colorRef }: SpeakerModelProps) {
  const { viewport } = useThree()
  const { scene }    = useGLTF('/models/speaker.glb') as unknown as { scene: THREE.Group }
  const groupRef     = useRef<THREE.Group>(null)
  const innerRef     = useRef<THREE.Group>(null)
  const lightRef     = useRef<THREE.PointLight>(null)
  const cur          = useRef({ x: 0, y: 0, sc: 0.58, rx: 0, rz: 0 })
  const tmpA         = useRef(new THREE.Color())
  const tmpB         = useRef(new THREE.Color())
  const targetCol    = useRef(new THREE.Color())
  const orangeMatRef = useRef<THREE.MeshStandardMaterial | null>(null)

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return
      const mesh = obj as THREE.Mesh
      mesh.castShadow    = true
      mesh.receiveShadow = true
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (!mat) return
      mat.envMapIntensity = 1.8
      if (mat.name === 'M_Orange') {
        mat.roughness        = 0.45
        mat.envMapIntensity  = 2.0
        orangeMatRef.current = mat
      }
      if (mat.name === 'M_Fabric') {
        mat.roughness       = 0.85
        mat.envMapIntensity = 1.2
      }
      if (mat.name === 'M_White') {
        mat.roughness       = 0.35
        mat.envMapIntensity = 1.5
      }
      mat.needsUpdate = true
    })
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current || !innerRef.current || !lightRef.current) return

    const t   = state.clock.elapsedTime
    const p   = scrollRef.current.progress
    const wps = pickWaypoints()

    const total = wps.length - 1
    const raw   = Math.max(0, Math.min(p * total, total - 0.0001))
    const idx   = Math.floor(raw)
    const frac  = raw - idx
    const st    = frac * frac * (3 - 2 * frac) // smoothstep

    const a = wps[idx]
    const b = wps[idx + 1]

    const colW     = viewport.width / 3
    const vxNow    = a.vx + (b.vx - a.vx) * st
    const baseX    = vxNow * colW

    const maxRadius = colW * 0.35
    const maxScale  = (maxRadius * 2) / (0.156 * DISPLAY_SCALE)
    const baseScale = a.scale + (b.scale - a.scale) * st
    const finalSc   = Math.min(baseScale, maxScale)

    const twy = (a.vy + (b.vy - a.vy) * st) * viewport.height * 0.5
    const trx = a.rotX + (b.rotX - a.rotX) * st
    const trz = a.rotZ + (b.rotZ - a.rotZ) * st

    const lf = 0.075
    cur.current.x  = THREE.MathUtils.lerp(cur.current.x,  baseX + mouseRef.current.x * 0.18, lf)
    cur.current.y  = THREE.MathUtils.lerp(cur.current.y,  twy   + mouseRef.current.y * 0.12, lf)
    cur.current.sc = THREE.MathUtils.lerp(cur.current.sc, finalSc * DISPLAY_SCALE,            lf)
    cur.current.rx = THREE.MathUtils.lerp(cur.current.rx, trx + mouseRef.current.y * 0.09,   lf)
    cur.current.rz = THREE.MathUtils.lerp(cur.current.rz, trz + mouseRef.current.x * 0.05,   lf)

    groupRef.current.position.x = cur.current.x
    groupRef.current.position.y = cur.current.y + Math.sin(t * 0.65) * 0.045
    groupRef.current.scale.setScalar(cur.current.sc)
    groupRef.current.rotation.x = cur.current.rx
    groupRef.current.rotation.z = cur.current.rz

    // Couleur pointLight orbitale
    tmpA.current.set(a.li)
    tmpB.current.set(b.li)
    tmpA.current.lerp(tmpB.current, st)
    lightRef.current.color.lerp(tmpA.current, 0.06)
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      a.lint + (b.lint - a.lint) * st,
      0.05,
    )

    // Couleur du cône (M_Orange) selon le coloris sélectionné
    if (orangeMatRef.current) {
      targetCol.current.set(colorRef.current)
      orangeMatRef.current.color.lerp(targetCol.current, 0.05)
    }
  })

  return (
    <group ref={groupRef}>
      <group ref={innerRef} position={[0, -SPEAKER_HEIGHT_M / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={scene} />
      </group>
      <pointLight ref={lightRef} position={[-2.0, 3.5, 2.8]} intensity={3} color="#FFCB94" />
    </group>
  )
}

// ─── Canvas + export ─────────────────────────────────────────────────────────

interface AetherSceneProps {
  scrollRef: React.MutableRefObject<ScrollRef>
  mouseRef:  React.MutableRefObject<{ x: number; y: number }>
  colorRef:  React.MutableRefObject<string>
  className?: string
  style?: React.CSSProperties
}

function AetherCanvasInner({ scrollRef, mouseRef, colorRef }: AetherSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.10, 5.6], fov: 40 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      onCreated={({ gl }) => { gl.setClearColor(new THREE.Color(0, 0, 0), 0) }}
      shadows
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.30} color="#FFF3E0" />
      <directionalLight position={[3, 6, 4]} intensity={1.2} color="#FFEDD0" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[-4, 2, 3]} intensity={1.0} color="#E8DFFF" />
      <pointLight position={[0, 4, -3]} intensity={1.3} color="#FFB070" />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#FFE4C4" />
      <pointLight position={[0, 0.5, 5]} intensity={0.9} color="#FFFFFF" />
      <Environment preset="studio" environmentIntensity={0.85} />
      <SpeakerModel scrollRef={scrollRef} mouseRef={mouseRef} colorRef={colorRef} />
    </Canvas>
  )
}

export default function AetherScene({ scrollRef, mouseRef, colorRef, className = '', style }: AetherSceneProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <AetherCanvasInner scrollRef={scrollRef} mouseRef={mouseRef} colorRef={colorRef} />
    </div>
  )
}
