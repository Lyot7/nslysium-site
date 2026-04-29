'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Diamètre max du speaker à scale=1 (le bowl mesh fait 156mm de diamètre)
// Sur unités world, on prend le rayon réel (156/2 = 78mm = 0.078)
// Le scale dans WAYPOINTS sera appliqué par-dessus.
const SPEAKER_HEIGHT_M = 0.213   // hauteur réelle GLB en mètres
const SPEAKER_DIAMETER_M = 0.156 // diamètre max GLB
const DISPLAY_SCALE = 14         // multiplier pour afficher à l'échelle scène

// Précharge GLB
useGLTF.preload('/models/speaker.glb')

// Waypoints : vx en fractions du 1/3-viewport
// spin = 0 partout → boutons toujours visibles face caméra
const WAYPOINTS = [
  { vx:  1.00, vy:  0.08, scale: 0.54, rotX: 0.00, rotZ:  0.00, spin: 0, li: '#FFCB94', lint: 3.0 },
  { vx:  1.00, vy:  0.05, scale: 0.50, rotX: 0.18, rotZ: -0.08, spin: 0, li: '#FFD78A', lint: 3.5 },
  { vx: -1.00, vy:  0.05, scale: 0.46, rotX: 0.08, rotZ:  0.18, spin: 0, li: '#A8C8FF', lint: 3.0 },
  { vx:  1.00, vy:  0.06, scale: 0.48, rotX: 0.10, rotZ:  0.10, spin: 0, li: '#FFB070', lint: 3.5 },
  { vx:  0.00, vy:  0.42, scale: 0.46, rotX: 0.00, rotZ:  0.00, spin: 0, li: '#FFC080', lint: 3.0 },
]

interface ScrollRef { progress: number; section: number }

interface ConeModelProps {
  scrollRef: React.MutableRefObject<ScrollRef>
  mouseRef:  React.MutableRefObject<{ x: number; y: number }>
}

function SpeakerModel({ scrollRef, mouseRef }: ConeModelProps) {
  const { viewport } = useThree()
  const { scene } = useGLTF('/models/speaker.glb') as unknown as { scene: THREE.Group }
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const cur = useRef({ x: 0, y: 0, sc: 0.58, rx: 0, rz: 0 })
  const tmpA = useRef(new THREE.Color())
  const tmpB = useRef(new THREE.Color())

  // Setup matériaux pour rendu propre
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial
        if (mat) {
          // Boost env reflections pour le brillant orange
          mat.envMapIntensity = 1.8
          // Si c'est le matériau orange (Cone, Socle), légèrement réduire la roughness
          if (mat.name === 'M_Orange') {
            mat.roughness = 0.45
            mat.envMapIntensity = 2.0
          }
          // Fabric : garder mat
          if (mat.name === 'M_Fabric') {
            mat.roughness = 0.85
            mat.envMapIntensity = 1.2
          }
          // White tip
          if (mat.name === 'M_White') {
            mat.roughness = 0.35
            mat.envMapIntensity = 1.5
          }
          mat.needsUpdate = true
        }
      }
    })
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current || !innerRef.current || !lightRef.current) return

    const t = state.clock.elapsedTime
    const p = scrollRef.current.progress

    const total = WAYPOINTS.length - 1
    const raw = Math.max(0, Math.min(p * total, total - 0.0001))
    const idx = Math.floor(raw)
    const frac = raw - idx
    const st = frac * frac * (3 - 2 * frac)

    const a = WAYPOINTS[idx]
    const b = WAYPOINTS[idx + 1]

    const aspect = viewport.aspect
    let xMult  = 1.0
    let scMult = 1.0
    let yOff   = 0.0
    if (aspect < 0.60) {
      xMult = 0.04; scMult = 0.58; yOff = 0.18
    } else if (aspect < 0.80) {
      xMult = 0.12; scMult = 0.68; yOff = 0.12
    } else if (aspect < 1.05) {
      xMult = 0.85; scMult = 0.80
    }

    const colW   = viewport.width / 3
    const vxNow  = a.vx + (b.vx - a.vx) * st
    const baseX  = vxNow * colW * xMult

    // Le speaker fait ~21cm de haut. À scale 1, il est trop petit pour la scène.
    // On applique DISPLAY_SCALE à la base, puis le multiplicateur waypoint.
    const maxRadius = colW * 0.35
    const maxScale  = (maxRadius * 2) / (SPEAKER_DIAMETER_M * DISPLAY_SCALE)
    const baseScale = (a.scale + (b.scale - a.scale) * st) * scMult
    const clampedScale = Math.min(baseScale, maxScale)

    const twx = baseX
    const twy = ((a.vy + (b.vy - a.vy) * st) + yOff) * viewport.height * 0.5
    const trx = a.rotX + (b.rotX - a.rotX) * st
    const trz = a.rotZ + (b.rotZ - a.rotZ) * st
    const spin = a.spin + (b.spin - a.spin) * st

    const lf = 0.075
    cur.current.x  = THREE.MathUtils.lerp(cur.current.x,  twx + mouseRef.current.x * 0.18, lf)
    cur.current.y  = THREE.MathUtils.lerp(cur.current.y,  twy + mouseRef.current.y * 0.12, lf)
    cur.current.sc = THREE.MathUtils.lerp(cur.current.sc, clampedScale * DISPLAY_SCALE, lf)
    cur.current.rx = THREE.MathUtils.lerp(cur.current.rx, trx + mouseRef.current.y * 0.09, lf)
    cur.current.rz = THREE.MathUtils.lerp(cur.current.rz, trz + mouseRef.current.x * 0.05, lf)

    groupRef.current.position.x = cur.current.x
    groupRef.current.position.y = cur.current.y + Math.sin(t * 0.65) * 0.045
    groupRef.current.scale.setScalar(cur.current.sc)
    groupRef.current.rotation.x = cur.current.rx
    groupRef.current.rotation.z = cur.current.rz
    innerRef.current.rotation.y += spin

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
      {/* Recentré + rotation initiale Y=-π/2 pour que les icônes face caméra */}
      <group ref={innerRef} position={[0, -SPEAKER_HEIGHT_M / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={scene} />
      </group>
      <pointLight ref={lightRef} position={[-2.0, 3.5, 2.8]} intensity={3} color="#FFCB94" />
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
        toneMappingExposure: 1.15,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0, 0, 0), 0)
      }}
      shadows
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      {/* ─── ÉCLAIRAGE STUDIO MODÉRÉ ───────────────────────────── */}
      <ambientLight intensity={0.30} color="#FFF3E0" />

      <directionalLight
        position={[3, 6, 4]}
        intensity={1.2}
        color="#FFEDD0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <pointLight position={[-4, 2, 3]} intensity={1.0} color="#E8DFFF" />
      <pointLight position={[0, 4, -3]} intensity={1.3} color="#FFB070" />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#FFE4C4" />
      <pointLight position={[0, 0.5, 5]} intensity={0.9} color="#FFFFFF" />

      <Environment preset="studio" environmentIntensity={0.85} />

      <SpeakerModel scrollRef={scrollRef} mouseRef={mouseRef} />
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
