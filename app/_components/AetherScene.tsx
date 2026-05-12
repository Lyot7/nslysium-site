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
  t?:    number  // position de scroll normalisée 0-1 (si absent : espacement uniforme)
  vx:    number  // position X idéale en fractions de colW (viewport.width/3)
                 // ±1.0 = centre de la colonne 1/3 droite ou gauche
                 // Valeur désirée « infinie » — adaptiveBaseX() la clampe pour rester dans le viewport
  vy:    number  // position Y en fractions de (viewport.height / 2) — positif = haut
  scale: number  // scale du modèle (multiplié ensuite par DISPLAY_SCALE)
  rotX:  number  // inclinaison avant/arrière en radians
  rotZ:  number  // inclinaison gauche/droite en radians
  li:    string  // couleur de la pointLight orbitale
  lint:  number  // intensité de la pointLight orbitale
}

interface ScrollRef { progress: number; section: number }

// ─── Waypoints ────────────────────────────────────────────────────────────────
//
// Principe :
//   scale ≤ 0.40  →  rayon ≤ 0.87 u.  →  tient dans la colonne 1/3 (2.17 u.) sans déborder.
//
// Transitions (scale-fade) :
//   Le modèle se rétrécit jusqu'à scale≈0.01 (lint=0 pour éteindre la lumière)
//   DANS SA COLONNE COURANTE, puis regrandit dans la colonne de destination.
//   Aucun déplacement visible au centre ou en bas du viewport.
//
// Sections mesurées sur 1280 × 800 px (scrollable = 5447 px) :
//   Hero 0.00–0.14 | Produit 0.14–0.28 | App 0.28–0.43
//   Cas  0.43–0.63 | Abo    0.63–0.88  | Contact 0.88–1.0
//
// Grille CSS par section :
//   Hero / Produit / Cas  =  2fr 1fr  (texte gauche, modèle colonne droite)
//   App                   =  1fr 2fr  (modèle colonne gauche, texte droite)
//   Abo / Contact         =  1fr centré

const WAYPOINTS_WIDE: Waypoint[] = [
  // ── Hero + Produit : colonne droite ────────────────────────────────────────
  { t: 0.00, vx:  1.0, vy: 0.08, scale: 0.38, rotX: 0.00, rotZ:  0.00, li: '#FFCB94', lint: 3.0 },
  { t: 0.22, vx:  1.0, vy: 0.04, scale: 0.37, rotX: 0.15, rotZ: -0.06, li: '#FFD78A', lint: 3.5 },
  // ── Glissement R→L vers App ────────────────────────────────────────────────
  { t: 0.33, vx: -1.0, vy: 0.06, scale: 0.37, rotX: 0.05, rotZ:  0.00, li: '#A8C8FF', lint: 3.0 },
  // ── App : colonne gauche ───────────────────────────────────────────────────
  { t: 0.42, vx: -1.0, vy: 0.04, scale: 0.37, rotX: 0.08, rotZ:  0.16, li: '#A8C8FF', lint: 3.2 },
  // ── Glissement L→R vers Cas ────────────────────────────────────────────────
  { t: 0.53, vx:  1.0, vy: 0.06, scale: 0.37, rotX: 0.05, rotZ:  0.00, li: '#FFB070', lint: 3.5 },
  // ── Cas : colonne droite ───────────────────────────────────────────────────
  { t: 0.66, vx:  1.0, vy: 0.04, scale: 0.38, rotX: 0.08, rotZ:  0.06, li: '#FFB070', lint: 3.5 },
  // ── Abo : discret en haut à droite ─────────────────────────────────────────
  { t: 0.78, vx:  0.5, vy: 0.42, scale: 0.34, rotX: 0.04, rotZ: -0.03, li: '#FFC080', lint: 3.0 },
  // ── Contact : fond sombre masque le modèle ─────────────────────────────────
  { t: 1.00, vx:  0.5, vy: 0.45, scale: 0.32, rotX: 0.02, rotZ: -0.02, li: '#FFC080', lint: 2.5 },
]

// Layout < 768 px : colonne unique, modèle fond ambiant centré
const WAYPOINTS_MOBILE: Waypoint[] = [
  { t: 0.00, vx: 0.0, vy: 0.30, scale: 0.36, rotX: 0.00, rotZ:  0.00, li: '#FFCB94', lint: 3.0 },
  { t: 0.30, vx: 0.0, vy: 0.26, scale: 0.32, rotX: 0.06, rotZ: -0.04, li: '#FFD78A', lint: 3.5 },
  { t: 0.55, vx: 0.0, vy: 0.26, scale: 0.30, rotX: 0.05, rotZ:  0.05, li: '#A8C8FF', lint: 3.0 },
  { t: 0.75, vx: 0.0, vy: 0.26, scale: 0.30, rotX: 0.05, rotZ: -0.04, li: '#FFB070', lint: 3.5 },
  { t: 1.00, vx: 0.0, vy: 0.35, scale: 0.26, rotX: 0.00, rotZ:  0.00, li: '#FFC080', lint: 2.5 },
]

function pickWaypoints(): Waypoint[] {
  if (typeof window === 'undefined') return WAYPOINTS_WIDE
  return window.innerWidth < 768 ? WAYPOINTS_MOBILE : WAYPOINTS_WIDE
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
  const cur = useRef({ x: 0, y: 0, sc: 0.58, rx: 0, rz: 0 })
  const tmpA          = useRef(new THREE.Color())
  const tmpB          = useRef(new THREE.Color())
  const targetCol     = useRef(new THREE.Color())
  // Matériaux colorables avec leur couleur originale du GLB sauvegardée
  const colorableMats = useRef<Array<{ mat: THREE.MeshStandardMaterial; orig: THREE.Color }>>([])

  useEffect(() => {
    const seen = new Set<string>()
    colorableMats.current = []

    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return
      const mesh = obj as THREE.Mesh
      mesh.castShadow    = true
      mesh.receiveShadow = true
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (!mat || seen.has(mat.uuid)) return
      seen.add(mat.uuid)

      const n = mat.name.toLowerCase()

      if (n.includes('white') || n.includes('blanc') || n.includes('tip')) {
        // Parties blanches (bande lumineuse, icônes) — couleur fixe
        mat.roughness       = 0.35
        mat.envMapIntensity = 1.5
      } else {
        // Tout le reste (cône, grille, socle) change de couleur avec le coloris
        mat.roughness       = n.includes('fabric') || n.includes('tissu') || n.includes('grille') ? 0.85 : 0.45
        mat.envMapIntensity = n.includes('fabric') || n.includes('tissu') || n.includes('grille') ? 1.2  : 2.0
        colorableMats.current.push({ mat, orig: mat.color.clone() })
      }

      mat.needsUpdate = true
    })
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current || !innerRef.current || !lightRef.current) return

    const t   = state.clock.elapsedTime
    const p   = scrollRef.current.progress
    const wps = pickWaypoints()

    let idx  = 0
    let frac = 0
    if (wps[0].t !== undefined) {
      // Timing personnalisé : trouver l'intervalle courant par recherche linéaire
      idx = wps.length - 2
      for (let i = 0; i < wps.length - 1; i++) {
        if (p <= wps[i + 1].t!) { idx = i; break }
      }
      const tA = wps[idx].t!
      const tB = wps[idx + 1].t!
      frac = tB > tA ? Math.max(0, Math.min((p - tA) / (tB - tA), 1)) : 0
    } else {
      const total = wps.length - 1
      const raw   = Math.max(0, Math.min(p * total, total - 0.0001))
      idx  = Math.floor(raw)
      frac = raw - idx
    }
    const st = frac * frac * (3 - 2 * frac) // smoothstep

    const a = wps[idx]
    const b = wps[idx + 1]

    const colW = viewport.width / 3
    // Sur mobile (viewport étroit < 3 u.), le modèle est centré → on lui alloue 25 % du viewport.
    // Sur tablet/desktop, on respecte la colonne CSS 1/3 → 35 % de colW.
    const maxRadius = viewport.width < 3.0
      ? viewport.width * 0.25
      : colW * 0.35
    const maxScale  = (maxRadius * 2) / (0.156 * DISPLAY_SCALE)
    const baseScale = a.scale + (b.scale - a.scale) * st
    const finalSc   = Math.min(baseScale, maxScale)

    const vxNow = a.vx + (b.vx - a.vx) * st
    const modelR = 0.156 * finalSc * DISPLAY_SCALE
    // Marge 0.7× : le modèle peut légèrement dépasser les bords (crop partiel ok)
    // sans être tiré vers le centre et superposé au texte.
    const safeHalf = Math.max(0, viewport.width * 0.5 - modelR * 0.7)
    const baseX    = Math.sign(vxNow) * Math.min(Math.abs(vxNow * colW), safeHalf)

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
    groupRef.current.visible = true

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

    // Couleur du cône selon le coloris sélectionné
    // '__original__' = coloris Orange → restaure la couleur native du GLB
    if (colorableMats.current.length > 0) {
      const useOrig = colorRef.current === '__original__'
      if (!useOrig) targetCol.current.set(colorRef.current)
      for (const { mat, orig } of colorableMats.current) {
        mat.color.lerp(useOrig ? orig : targetCol.current, 0.06)
      }
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
