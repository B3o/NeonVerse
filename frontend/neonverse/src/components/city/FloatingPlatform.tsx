import React, { useRef } from 'react'
import { Mesh, Vector3, MeshStandardMaterial } from 'three'
import { useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'

interface FloatingPlatformProps {
  position: [number, number, number]
  scale?: [number, number, number]
  color?: string
  emissiveColor?: string
  emissiveIntensity?: number
  oscillationSpeed?: number
  oscillationHeight?: number
}

export function FloatingPlatform({
  position,
  scale = [2, 0.2, 2],
  color = '#304050',
  emissiveColor = '#40a0ff',
  emissiveIntensity = 0.5,
  oscillationSpeed = 1,
  oscillationHeight = 0.5
}: FloatingPlatformProps) {
  const meshRef = useRef<Mesh>(null)
  const initialY = position[1]

  useFrame((state) => {
    if (meshRef.current) {
      // Oscillating movement
      const time = state.clock.elapsedTime
      const newY = initialY + Math.sin(time * oscillationSpeed) * oscillationHeight
      meshRef.current.position.setY(newY)

      // Rotate slowly
      meshRef.current.rotation.y += 0.001

      if (meshRef.current.material instanceof MeshStandardMaterial) {
        // Animate emissive intensity
        meshRef.current.material.emissiveIntensity = 
          emissiveIntensity * (0.8 + 0.2 * Math.sin(time * 2))
      }
    }
  })

  return (
    <Box
      ref={meshRef}
      position={new Vector3(...position)}
      scale={new Vector3(...scale)}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1.5}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
      />
    </Box>
  )
}
