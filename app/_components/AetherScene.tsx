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
  // ════ HERO ════ (0.00 → 0.12) — sur la table du salon ═════════════════════
  { t: 0.00, vx:  0.00, vy: -0.50, scale: 0.16, rotX: 0.02, rotZ:  0.00, li: '#FFA755', lint: 5.0 },
  // Lift-off : monte verticalement, salon disparaît
  { t: 0.12, vx:  0.00, vy: -0.10, scale: 0.30, rotX: 0.04, rotZ: -0.02, li: '#FFCB94', lint: 4.0 },

  // ════ VOIX ════ (0.22 → 0.42) — palier droite, fixe ═══════════════════════
  // 0.18 = arrivée à droite (transition courte 0.06)
  { t: 0.18, vx:  0.85, vy:  0.05, scale: 0.36, rotX: 0.06, rotZ:  0.04, li: '#FFD78A', lint: 3.5 },
  // 0.42 = fin du palier droite (durée stable = 24% du scroll)
  { t: 0.42, vx:  0.85, vy:  0.05, scale: 0.36, rotX: 0.06, rotZ:  0.04, li: '#FFD78A', lint: 3.5 },

  // ════ TRANSITION ════ (0.42 → 0.58) — slide centre vers gauche ════════════
  { t: 0.50, vx:  0.00, vy:  0.05, scale: 0.40, rotX: 0.08, rotZ:  0.00, li: '#FFCB94', lint: 3.8 },

  // ════ MOMENTS ════ (0.58 → 0.78) — palier gauche, fixe ════════════════════
  // 0.58 = arrivée à gauche
  { t: 0.58, vx: -0.85, vy:  0.05, scale: 0.36, rotX: 0.06, rotZ: -0.04, li: '#FFB070', lint: 3.5 },
  // 0.78 = fin du palier gauche (durée stable = 20% du scroll)
  { t: 0.78, vx: -0.85, vy:  0.05, scale: 0.36, rotX: 0.06, rotZ: -0.04, li: '#FFB070', lint: 3.5 },

  // ════ CTA ════ (0.86 → 1.0) — retour au centre pour finir au milieu ══════
  { t: 0.88, vx:  0.00, vy:  0.05, scale: 0.40, rotX: 0.04, rotZ:  0.00, li: '#FFC080', lint: 3.5 },
  { t: 1.00, vx:  0.00, vy:  0.00, scale: 0.42, rotX: 0.02, rotZ:  0.00, li: '#FFC080', lint: 3.5 },
]

// Mobile : centré horizontalement, paliers verticaux pour rester stable
const WAYPOINTS_MOBILE: Waypoint[] = [
  // Hero (table)
  { t: 0.00, vx: 0.0, vy: -0.40, scale: 0.18, rotX: 0.02, rotZ:  0.00, li: '#FFA755', lint: 5.0 },
  // Lift-off
  { t: 0.15, vx: 0.0, vy: -0.05, scale: 0.30, rotX: 0.05, rotZ: -0.03, li: '#FFD78A', lint: 3.5 },
  // Voix — palier centré, stable
  { t: 0.22, vx: 0.0, vy:  0.05, scale: 0.34, rotX: 0.06, rotZ:  0.02, li: '#FFCB94', lint: 3.5 },
  { t: 0.45, vx: 0.0, vy:  0.05, scale: 0.34, rotX: 0.06, rotZ:  0.02, li: '#FFCB94', lint: 3.5 },
  // Moments — palier centré, stable (légère rotation différente pour le sentir bouger un peu)
  { t: 0.55, vx: 0.0, vy:  0.05, scale: 0.34, rotX: 0.06, rotZ: -0.02, li: '#FFB070', lint: 3.5 },
  { t: 0.78, vx: 0.0, vy:  0.05, scale: 0.34, rotX: 0.06, rotZ: -0.02, li: '#FFB070', lint: 3.5 },
  // CTA — finit centré au milieu de la page
  { t: 0.90, vx: 0.0, vy:  0.05, scale: 0.36, rotX: 0.02, rotZ:  0.00, li: '#FFC080', lint: 3.2 },
  { t: 1.00, vx: 0.0, vy:  0.00, scale: 0.40, rotX: 0.00, rotZ:  0.00, li: '#FFC080', lint: 3.5 },
]

function pickWaypoints(): Waypoint[] {
  if (typeof window === 'undefined') return WAYPOINTS_WIDE
  return window.innerWidth < 768 ? WAYPOINTS_MOBILE : WAYPOINTS_WIDE
}

// ─── Modèle 3D ──────────────────────────────────────────────────────────────

interface HeroAnchor { vx: number; vy: number; active: boolean }

interface SpeakerModelProps {
  scrollRef: React.MutableRefObject<ScrollRef>
  mouseRef:  React.MutableRefObject<{ x: number; y: number }>
  colorRef:  React.MutableRefObject<string>
  heroAnchorRef?: React.MutableRefObject<HeroAnchor>
}

function SpeakerModel({ scrollRef, mouseRef, colorRef, heroAnchorRef }: SpeakerModelProps) {
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

  // WCAG 2.3.3 : si reduce-motion est demandé, on coupe le flottement sin et
  // la dérive souris idle. La position scroll-driven reste (elle est sous
  // contrôle de l'utilisateur via le scroll, donc autorisée).
  const reduceMotionRef = useRef(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotionRef.current = mq.matches
    const handler = (e: MediaQueryListEvent) => {
      reduceMotionRef.current = e.matches
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

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

    let vxNow = a.vx + (b.vx - a.vx) * st
    let vyNow = a.vy + (b.vy - a.vy) * st

    // ── Hero override : cône posé sur la table (position proportionnelle ─────
    // à l'image salon, calculée côté parent et fournie via heroAnchorRef).
    // Activé seulement quand active=true (progress très bas).
    const hero = heroAnchorRef?.current
    const heroFade = hero?.active
      ? Math.max(0, 1 - scrollRef.current.progress / 0.05)
      : 0
    if (heroFade > 0) {
      vxNow = vxNow * (1 - heroFade) + hero!.vx * heroFade
      vyNow = vyNow * (1 - heroFade) + hero!.vy * heroFade
    }

    const modelR = 0.156 * finalSc * DISPLAY_SCALE
    const safeHalf = Math.max(0, viewport.width * 0.5 - modelR * 0.7)
    const baseX    = Math.sign(vxNow) * Math.min(Math.abs(vxNow * colW), safeHalf)

    const twy = vyNow * viewport.height * 0.5
    const trx = a.rotX + (b.rotX - a.rotX) * st
    const trz = a.rotZ + (b.rotZ - a.rotZ) * st

    // ── Idle activity : OFF quand posé sur la table (heroFade≈1), ON sinon ──
    // Force OFF si l'utilisateur a demandé reduce-motion (WCAG 2.3.3).
    const idleActivity = reduceMotionRef.current ? 0 : (1 - heroFade)
    const mX = mouseRef.current.x * idleActivity
    const mY = mouseRef.current.y * idleActivity

    const lf = 0.075
    cur.current.x  = THREE.MathUtils.lerp(cur.current.x,  baseX + mX * 0.18, lf)
    cur.current.y  = THREE.MathUtils.lerp(cur.current.y,  twy   + mY * 0.12, lf)
    cur.current.sc = THREE.MathUtils.lerp(cur.current.sc, finalSc * DISPLAY_SCALE,        lf)
    cur.current.rx = THREE.MathUtils.lerp(cur.current.rx, trx + mY * 0.09,   lf)
    cur.current.rz = THREE.MathUtils.lerp(cur.current.rz, trz + mX * 0.05,   lf)

    // Flottement vertical (sin) : éteint quand posé, allumé dès qu'on scroll
    const floatY = Math.sin(t * 0.65) * 0.045 * idleActivity

    groupRef.current.position.x = cur.current.x
    groupRef.current.position.y = cur.current.y + floatY
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

// ─── Lights adaptatives ──────────────────────────────────────────────────────
// En hero (cône posé sur la table du salon), on bascule vers un éclairage chaud
// et doux qui s'intègre à l'ambiance "feu de cheminée" de l'image de fond.
// Hors hero (scroll au-delà), on revient à l'éclairage studio standard.

interface SceneLightsProps {
  scrollRef: React.MutableRefObject<ScrollRef>
  heroAnchorRef?: React.MutableRefObject<HeroAnchor>
}

// Presets de lights : { intensity, color en linear-rgb hex }
// "studio" = état hors hero (rendu actuel). "salon" = éclairage tamisé chaud.
const LIGHT_PRESETS = {
  studio: {
    ambient:     { intensity: 0.30, color: '#FFF3E0' },
    directional: { intensity: 1.20, color: '#FFEDD0' },
    pointA:      { intensity: 1.00, color: '#E8DFFF' }, // froid violet (fill)
    pointB:      { intensity: 1.30, color: '#FFB070' }, // chaud (key arrière)
    pointC:      { intensity: 0.60, color: '#FFE4C4' }, // chaud bas (rim)
    pointD:      { intensity: 0.90, color: '#FFFFFF' }, // neutre frontal
    envIntensity: 0.85,
  },
  salon: {
    // Salon = lumière dorée très tamisée façon feu de cheminée en fin de journée.
    // Le cône doit être perceptible mais clairement moins éclairé que la scène
    // studio neutre — il s'intègre dans l'ambiance, il ne la domine pas.
    ambient:     { intensity: 0.22, color: '#F0BE82' }, // ambient ambre doré, doux
    directional: { intensity: 0.32, color: '#F2B074' }, // soleil tamisé chaud bas
    pointA:      { intensity: 0.06, color: '#F0BE82' }, // fill froid quasi tué
    pointB:      { intensity: 0.45, color: '#E08850' }, // braise saturée mais douce
    pointC:      { intensity: 0.22, color: '#EFB082' }, // rim chaud bas, discret
    pointD:      { intensity: 0.15, color: '#F2D2A8' }, // frontal très doux chaud
    envIntensity: 0.32,
  },
}

function SceneLights({ scrollRef, heroAnchorRef }: SceneLightsProps) {
  const { scene } = useThree()
  const ambientRef     = useRef<THREE.AmbientLight>(null)
  const directionalRef = useRef<THREE.DirectionalLight>(null)
  const pointARef      = useRef<THREE.PointLight>(null)
  const pointBRef      = useRef<THREE.PointLight>(null)
  const pointCRef      = useRef<THREE.PointLight>(null)
  const pointDRef      = useRef<THREE.PointLight>(null)
  const tmpStudio = useRef(new THREE.Color())
  const tmpSalon  = useRef(new THREE.Color())

  useFrame(() => {
    // heroFade : 1 quand cône posé sur la table, 0 dès qu'on scrolle.
    const hero = heroAnchorRef?.current
    const heroFade = hero?.active
      ? Math.max(0, 1 - scrollRef.current.progress / 0.05)
      : 0
    const t = heroFade // 0 studio → 1 salon

    // Environment intensity : lerp studio↔salon (dim l'IBL en hero pour
    // ne pas surcharger l'éclairage déjà tamisé du salon).
    scene.environmentIntensity =
      LIGHT_PRESETS.studio.envIntensity * (1 - t) +
      LIGHT_PRESETS.salon.envIntensity * t

    // Lerp entre studio et salon pour intensity ET couleur.
    const apply = (
      ref: React.MutableRefObject<THREE.Light | null>,
      studio: { intensity: number; color: string },
      salon: { intensity: number; color: string },
    ) => {
      const l = ref.current
      if (!l) return
      l.intensity = studio.intensity * (1 - t) + salon.intensity * t
      tmpStudio.current.set(studio.color)
      tmpSalon.current.set(salon.color)
      tmpStudio.current.lerp(tmpSalon.current, t)
      l.color.copy(tmpStudio.current)
    }

    apply(ambientRef     as React.MutableRefObject<THREE.Light | null>, LIGHT_PRESETS.studio.ambient,     LIGHT_PRESETS.salon.ambient)
    apply(directionalRef as React.MutableRefObject<THREE.Light | null>, LIGHT_PRESETS.studio.directional, LIGHT_PRESETS.salon.directional)
    apply(pointARef      as React.MutableRefObject<THREE.Light | null>, LIGHT_PRESETS.studio.pointA,      LIGHT_PRESETS.salon.pointA)
    apply(pointBRef      as React.MutableRefObject<THREE.Light | null>, LIGHT_PRESETS.studio.pointB,      LIGHT_PRESETS.salon.pointB)
    apply(pointCRef      as React.MutableRefObject<THREE.Light | null>, LIGHT_PRESETS.studio.pointC,      LIGHT_PRESETS.salon.pointC)
    apply(pointDRef      as React.MutableRefObject<THREE.Light | null>, LIGHT_PRESETS.studio.pointD,      LIGHT_PRESETS.salon.pointD)
  })

  return (
    <>
      <ambientLight     ref={ambientRef}     intensity={LIGHT_PRESETS.studio.ambient.intensity}     color={LIGHT_PRESETS.studio.ambient.color} />
      <directionalLight ref={directionalRef} intensity={LIGHT_PRESETS.studio.directional.intensity} color={LIGHT_PRESETS.studio.directional.color}
                        position={[3, 6, 4]} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight ref={pointARef} position={[-4, 2, 3]}   intensity={LIGHT_PRESETS.studio.pointA.intensity} color={LIGHT_PRESETS.studio.pointA.color} />
      <pointLight ref={pointBRef} position={[0, 4, -3]}   intensity={LIGHT_PRESETS.studio.pointB.intensity} color={LIGHT_PRESETS.studio.pointB.color} />
      <pointLight ref={pointCRef} position={[0, -3, 2]}   intensity={LIGHT_PRESETS.studio.pointC.intensity} color={LIGHT_PRESETS.studio.pointC.color} />
      <pointLight ref={pointDRef} position={[0, 0.5, 5]}  intensity={LIGHT_PRESETS.studio.pointD.intensity} color={LIGHT_PRESETS.studio.pointD.color} />
    </>
  )
}

// ─── Canvas + export ─────────────────────────────────────────────────────────

interface AetherSceneProps {
  scrollRef: React.MutableRefObject<ScrollRef>
  mouseRef:  React.MutableRefObject<{ x: number; y: number }>
  colorRef:  React.MutableRefObject<string>
  heroAnchorRef?: React.MutableRefObject<HeroAnchor>
  className?: string
  style?: React.CSSProperties
}

function AetherCanvasInner({ scrollRef, mouseRef, colorRef, heroAnchorRef }: AetherSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.10, 5.6], fov: 40 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      onCreated={({ gl }) => { gl.setClearColor(new THREE.Color(0, 0, 0), 0) }}
      shadows
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneLights scrollRef={scrollRef} heroAnchorRef={heroAnchorRef} />
      <Environment preset="studio" environmentIntensity={0.85} />
      <SpeakerModel scrollRef={scrollRef} mouseRef={mouseRef} colorRef={colorRef} heroAnchorRef={heroAnchorRef} />
    </Canvas>
  )
}

export default function AetherScene({ scrollRef, mouseRef, colorRef, heroAnchorRef, className = '', style }: AetherSceneProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <AetherCanvasInner scrollRef={scrollRef} mouseRef={mouseRef} colorRef={colorRef} heroAnchorRef={heroAnchorRef} />
    </div>
  )
}
