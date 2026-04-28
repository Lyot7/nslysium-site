'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import Image from 'next/image'

function RotatingCone() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <coneGeometry args={[1.2, 2.5, 64]} />
      <meshPhysicalMaterial
        color="#C4622D"
        metalness={0.3}
        roughness={0.4}
        reflectivity={0.8}
        envMapIntensity={1}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} color="#FAF7F2" />
      <pointLight position={[3, 5, 3]} intensity={2} color="#C4622D" />
      <pointLight position={[-3, -2, -3]} intensity={0.8} color="#D4773F" />
      <pointLight position={[0, -4, 2]} intensity={0.5} color="#FAF7F2" />
      <RotatingCone />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  )
}

function ConeLoader() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Image
        src="/images/cone/cone-orange.jpeg"
        alt="NSLysium Aether"
        width={200}
        height={250}
        className="object-contain rounded-xl opacity-50"
      />
    </div>
  )
}

export default function ConeScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
