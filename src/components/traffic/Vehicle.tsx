import { useRef } from 'react'
import { Mesh, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'

interface VehicleProps {
  startPosition: [number, number, number]
  speed?: number
}

export function Vehicle({ 
  startPosition,
  speed = 2
}: VehicleProps) {
  const meshRef = useRef<Mesh>(null)
  const positionRef = useRef({
    x: startPosition[0],
    y: startPosition[1],
    z: startPosition[2]
  })

  useFrame((state) => {
    if (meshRef.current) {
      // Move vehicle in a loop around the city
      positionRef.current.x = startPosition[0] + Math.sin(state.clock.elapsedTime * speed) * 10
      positionRef.current.z = startPosition[2] + Math.cos(state.clock.elapsedTime * speed) * 10
      
      meshRef.current.position.set(
        positionRef.current.x,
        positionRef.current.y,
        positionRef.current.z
      )
    }
  })

  return (
    <Box
      ref={meshRef}
      position={new Vector3(...startPosition)}
      scale={new Vector3(0.5, 0.2, 1)}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color="#60a0ff"
        emissive="#4080ff"
        emissiveIntensity={1}
        metalness={1}
        roughness={0.1}
        envMapIntensity={2}
      />
    </Box>
  )
}
