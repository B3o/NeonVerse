import React, { useRef } from 'react'
import { Group, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'

interface MagTrainProps {
  startPosition: [number, number, number]
  speed?: number
}

export function MagTrain({
  startPosition,
  speed = 1
}: MagTrainProps) {
  const trainRef = useRef<Group>(null)
  const timeOffset = useRef(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (trainRef.current) {
      // Move train in a rectangular path
      const time = state.clock.elapsedTime + timeOffset.current
      const pathSize = 15
      const x = Math.cos(time * speed) * pathSize
      const z = Math.sin(time * speed) * pathSize
      
      trainRef.current.position.set(x, startPosition[1], z)
      trainRef.current.rotation.y = Math.atan2(
        Math.cos(time * speed),
        -Math.sin(time * speed)
      )
    }
  })

  return (
    <group ref={trainRef} position={new Vector3(...startPosition)}>
      {/* Train body */}
      <Box scale={[3, 0.5, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#40a0ff"
          emissive="#4080ff"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      
      {/* Train windows */}
      <Box scale={[2, 0.3, 0.82]} position={[0, 0.1, 0]}>
        <meshStandardMaterial
          color="#80c0ff"
          emissive="#80c0ff"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      
      {/* Energy effect under train */}
      <Box scale={[2.5, 0.1, 0.6]} position={[0, -0.3, 0]}>
        <meshStandardMaterial
          color="#40ffff"
          emissive="#40ffff"
          emissiveIntensity={2}
          transparent
          opacity={0.7}
        />
      </Box>
    </group>
  )
}
