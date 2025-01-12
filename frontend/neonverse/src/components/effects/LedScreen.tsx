import { useRef, useState, useCallback } from 'react'
import { Mesh, Vector3, MeshStandardMaterial, Color } from 'three'
import { useFrame } from '@react-three/fiber'
import { Plane, Text } from '@react-three/drei'

interface LedScreenProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  color?: string
  text?: string // Optional Chinese text
}

export function LedScreen({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#40ffff',
  text
}: LedScreenProps) {
  // Chinese neon text options
  const neonTexts = [
    '未来', '科技', '霓虹', '夜城',
    '龙腾', '飞跃', '繁华', '梦幻'
  ]
  const displayText = text || neonTexts[Math.floor(Math.random() * neonTexts.length)]
  const meshRef = useRef<Mesh>(null)
  const [isActive, setIsActive] = useState(false)
  const [baseColor] = useState(new Color(color))
  const timeOffset = useRef(Math.random() * Math.PI * 2)

  const handleClick = useCallback(() => {
    setIsActive(prev => !prev)
  }, [])

  useFrame((state) => {
    if (meshRef.current && meshRef.current.material instanceof MeshStandardMaterial) {
      const time = state.clock.elapsedTime + timeOffset.current
      
      if (isActive) {
        // Color cycling animation when active
        const hue = (time * 0.3) % 1
        const activeColor = new Color().setHSL(hue, 1, 0.5)
        meshRef.current.material.emissive.copy(activeColor)
        meshRef.current.material.emissiveIntensity = 2 * (0.8 + Math.sin(time * 3) * 0.2)
      } else {
        // Normal pulsing animation
        const brightness = 0.8 + Math.sin(time * 2) * 0.2
        meshRef.current.material.emissive.copy(baseColor)
        meshRef.current.material.emissiveIntensity = brightness
      }
    }
  })

  return (
    <Plane
      ref={meshRef}
      position={new Vector3(...position)}
      rotation={rotation}
      scale={new Vector3(...scale)}
      onClick={handleClick}
    >
      <>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          metalness={0.8}
          roughness={0.2}
        />
        {/* Text overlay */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={scale[1] * 0.8}
          font="/fonts/NotoSansSC-Bold.ttf"
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {displayText}
        </Text>
      </>
    </Plane>
  )
}
