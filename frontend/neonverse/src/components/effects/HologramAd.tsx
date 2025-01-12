import React, { useRef, useState, useCallback } from 'react'
import { Mesh, Vector3, MeshStandardMaterial, Euler, Color } from 'three'
import { useFrame } from '@react-three/fiber'
import { Plane } from '@react-three/drei'

interface HologramAdProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

export function HologramAd({ 
  position,
  rotation = [0, 0, 0],
  scale = [2, 3, 1]
}: HologramAdProps) {
  const meshRef = useRef<Mesh>(null)
  const [isEnergized, setIsEnergized] = useState(false)
  const timeOffset = useRef(Math.random() * Math.PI * 2)

  const handleClick = useCallback(() => {
    setIsEnergized(prev => !prev)
  }, [])

  useFrame((state) => {
    if (meshRef.current && meshRef.current.material instanceof MeshStandardMaterial) {
      const time = state.clock.elapsedTime + timeOffset.current
      const flicker = 0.8 + Math.sin(time * 2) * 0.2

      if (isEnergized) {
        // Energized state with color cycling
        const hue = (time * 0.2) % 1
        const energyColor = new Color().setHSL(hue, 1, 0.6)
        meshRef.current.material.color.copy(energyColor)
        meshRef.current.material.emissive.copy(energyColor)
        meshRef.current.material.opacity = 0.9 * flicker
        meshRef.current.material.emissiveIntensity = 2 * flicker
      } else {
        // Normal hologram state
        meshRef.current.material.color.setStyle('#40ffff')
        meshRef.current.material.emissive.setStyle('#40ffff')
        meshRef.current.material.opacity = 0.7 * flicker
        meshRef.current.material.emissiveIntensity = flicker
      }
    }
  })

  return (
    <Plane
      ref={meshRef}
      position={new Vector3(...position)}
      rotation={new Euler(...rotation)}
      scale={new Vector3(...scale)}
      onClick={handleClick}
    >
      <meshStandardMaterial
        color="#40ffff"
        emissive="#40ffff"
        emissiveIntensity={1}
        transparent
        opacity={0.8}
      />
    </Plane>
  )
}
