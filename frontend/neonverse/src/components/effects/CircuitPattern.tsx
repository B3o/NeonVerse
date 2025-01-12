import React, { useRef } from 'react'
import { Mesh, Vector3, MeshStandardMaterial } from 'three'
import { useFrame } from '@react-three/fiber'
import { Plane } from '@react-three/drei'

interface CircuitPatternProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

export function CircuitPattern({
  position = [0, 0, 0],
  rotation = [-Math.PI / 2, 0, 0],
  scale = [50, 50, 1]
}: CircuitPatternProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current && meshRef.current.material instanceof MeshStandardMaterial) {
      // Animate circuit pattern glow
      const time = state.clock.elapsedTime
      meshRef.current.material.emissiveIntensity = 
        0.2 + Math.sin(time * 0.5) * 0.1 + Math.sin(time * 0.2) * 0.1
    }
  })

  return (
    <Plane
      ref={meshRef}
      position={new Vector3(...position)}
      rotation={rotation}
      scale={new Vector3(...scale)}
    >
      <meshStandardMaterial
        color="#101020"
        metalness={0.9}
        roughness={0.2}
        emissive="#40a0ff"
        emissiveIntensity={0.4}
        transparent
        opacity={0.9}
      />
    </Plane>
  )
}
