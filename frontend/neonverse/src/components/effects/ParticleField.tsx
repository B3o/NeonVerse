import React, { useMemo } from 'react'
import { Points } from '@react-three/drei'

export function ParticleField() {
  const count = 2000
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40     // x
      pos[i * 3 + 1] = Math.random() * 20 + 0.5   // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 // z
    }
    return pos
  }, [])

  return (
    <Points positions={positions}>
      <pointsMaterial
        size={0.15}
        color="#80ffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={2}
      />
    </Points>
  )
}
