'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const SPEAKER_HEIGHT_M = 0.213
const DISPLAY_SCALE = 8 // dézoomé (était 14 sur la home pour fullscreen scroll)

useGLTF.preload('/models/speaker.glb')

// ─── Modèle 3D statique (pas de scroll, pas de mouvement) ────────────────────

interface SpeakerStaticProps {
  colorHex: string // hex de la couleur cible (ou '__original__' pour la couleur native du GLB)
}

function SpeakerStatic({ colorHex }: SpeakerStaticProps) {
  const { scene } = useGLTF('/models/speaker.glb') as unknown as { scene: THREE.Group }
  const targetCol = useRef(new THREE.Color())
  const colorableMats = useRef<
    Array<{ mat: THREE.MeshStandardMaterial; orig: THREE.Color }>
  >([])

  useEffect(() => {
    const seen = new Set<string>()
    colorableMats.current = []
    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return
      const mesh = obj as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (!mat || seen.has(mat.uuid)) return
      seen.add(mat.uuid)
      const n = mat.name.toLowerCase()
      if (n.includes('white') || n.includes('blanc') || n.includes('tip')) {
        mat.roughness = 0.35
        mat.envMapIntensity = 1.5
      } else {
        const fabric = n.includes('fabric') || n.includes('tissu') || n.includes('grille')
        mat.roughness = fabric ? 0.85 : 0.45
        mat.envMapIntensity = fabric ? 1.2 : 2.0
        colorableMats.current.push({ mat, orig: mat.color.clone() })
      }
      mat.needsUpdate = true
    })
  }, [scene])

  // Lerp doux vers la couleur cible (transition entre coloris)
  useFrame(() => {
    if (colorableMats.current.length === 0) return
    const useOrig = colorHex === '__original__'
    if (!useOrig) targetCol.current.set(colorHex)
    for (const { mat, orig } of colorableMats.current) {
      mat.color.lerp(useOrig ? orig : targetCol.current, 0.08)
    }
  })

  return (
    <group scale={DISPLAY_SCALE} position={[0, -0.1, 0]}>
      <group position={[0, -SPEAKER_HEIGHT_M / 2, 0]} rotation={[0, -Math.PI / 2.4, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

// ─── Canvas + export ─────────────────────────────────────────────────────────

export default function ProductCone3D({ colorHex }: { colorHex: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  return (
    <Canvas
      camera={{ position: [0, 0.05, 6.2], fov: 30 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0, 0, 0), 0)
      }}
      shadows
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} color="#FFF3E0" />
      <directionalLight
        position={[3, 6, 4]}
        intensity={1.4}
        color="#FFEDD0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-4, 2, 3]} intensity={1.0} color="#E8DFFF" />
      <pointLight position={[0, 4, -3]} intensity={1.3} color="#FFB070" />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#FFE4C4" />
      <pointLight position={[0, 0.5, 5]} intensity={0.9} color="#FFFFFF" />
      <Environment preset="studio" environmentIntensity={0.9} />
      <SpeakerStatic colorHex={colorHex} />
    </Canvas>
  )
}
