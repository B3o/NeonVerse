import React, { useRef } from 'react'
import { Vector3, Group } from 'three'
import { useFrame } from '@react-three/fiber'
import { Sphere, Box } from '@react-three/drei'

interface DroneProps {
  startPosition: [number, number, number]
  speed?: number
}

export function Drone({ 
  startPosition,
  speed = 1
}: DroneProps) {
  const droneRef = useRef<Group>(null)
  const timeOffset = useRef(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (droneRef.current) {
      // Complex flight pattern
      const time = state.clock.elapsedTime + timeOffset.current
      const x = startPosition[0] + Math.sin(time * speed) * 5
      const y = startPosition[1] + Math.cos(time * speed * 0.5) * 2
      const z = startPosition[2] + Math.cos(time * speed) * 5
      
      droneRef.current.position.set(x, y, z)
      droneRef.current.rotation.y = Math.atan2(
        Math.cos(time * speed),
        Math.sin(time * speed)
      )
    }
  })

  return (
    <group ref={droneRef} position={new Vector3(...startPosition)}>
      {/* Drone body */}
      <Sphere scale={[0.3, 0.1, 0.3]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#40a0ff"
          emissive="#4080ff"
          emissiveIntensity={1}
          metalness={1}
          roughness={0.1}
          envMapIntensity={2}
        />
      </Sphere>
      
      {/* Drone lights */}
      <Box scale={[0.1, 0.1, 0.1]} position={[0.2, 0, 0.2]}>
        <meshStandardMaterial
          color="#ff4040"
          emissive="#ff4040"
          emissiveIntensity={2}
        />
      </Box>
      <Box scale={[0.1, 0.1, 0.1]} position={[-0.2, 0, 0.2]}>
        <meshStandardMaterial
          color="#40ff40"
          emissive="#40ff40"
          emissiveIntensity={2}
        />
      </Box>
    </group>
  )
}
