import React, { useRef, useState, useCallback } from 'react'
import { Mesh, Vector3, MeshStandardMaterial, Color } from 'three'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Cylinder } from '@react-three/drei'
import { LedScreen } from '../effects/LedScreen'

interface BuildingProps {
  position: [number, number, number]
  scale: [number, number, number]
  color?: string
  emissiveColor?: string
  emissiveIntensity?: number
  shape?: 'box' | 'cylinder' | 'sphere'
}

export function Building({ 
  position, 
  scale, 
  color = '#303040',
  emissiveColor = '#4060ff',
  emissiveIntensity = 0.5,
  shape = 'box'
}: BuildingProps) {
  const meshRef = useRef<Mesh>(null)
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [baseColor] = useState(new Color(emissiveColor))
  const timeOffset = useRef(Math.random() * Math.PI * 2)
  
  const handleClick = useCallback(() => {
    setIsHighlighted(prev => !prev)
  }, [])
  
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material instanceof MeshStandardMaterial) {
      const time = state.clock.elapsedTime + timeOffset.current
      
      // Base pulse animation
      const pulseIntensity = 0.8 + 0.2 * Math.sin(time + position[0] + position[2])
      
      if (isHighlighted) {
        // Color cycling when highlighted
        const hue = (time * 0.2) % 1
        const highlightColor = new Color().setHSL(hue, 1, 0.5)
        meshRef.current.material.emissive.copy(highlightColor)
        meshRef.current.material.emissiveIntensity = emissiveIntensity * 2 * pulseIntensity
      } else {
        // Normal state
        meshRef.current.material.emissive.copy(baseColor)
        meshRef.current.material.emissiveIntensity = emissiveIntensity * pulseIntensity
      }
    }
  })

  return (
    <group position={new Vector3(...position)}>
      {(() => {
        const MaterialComponent = (
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1.5}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
          />
        )

        switch (shape) {
          case 'box':
            return (
              <Box
                ref={meshRef}
                scale={new Vector3(...scale)}
                castShadow
                receiveShadow
                onClick={handleClick}
              >
                {MaterialComponent}
              </Box>
            )
          case 'cylinder':
            return (
              <Cylinder
                ref={meshRef}
                scale={new Vector3(...scale)}
                castShadow
                receiveShadow
                onClick={handleClick}
              >
                {MaterialComponent}
              </Cylinder>
            )
          case 'sphere':
            return (
              <Sphere
                ref={meshRef}
                scale={new Vector3(...scale)}
                castShadow
                receiveShadow
                onClick={handleClick}
              >
                {MaterialComponent}
              </Sphere>
            )
          default:
            return null
        }
      })()}
      
      {/* LED screens on building */}
      {scale[1] > 3 && Math.random() > 0.5 && (
        <>
          <LedScreen
            position={[0.51, scale[1] * 0.3, 0]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[scale[1] * 0.4, scale[1] * 0.2, 1]}
            color={emissiveColor}
          />
          <LedScreen
            position={[0, scale[1] * 0.3, 0.51]}
            rotation={[0, 0, 0]}
            scale={[scale[1] * 0.4, scale[1] * 0.2, 1]}
            color={emissiveColor}
          />
        </>
      )}
    </group>
  )
}
