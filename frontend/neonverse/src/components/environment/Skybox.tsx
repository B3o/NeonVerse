import { useRef } from 'react'
import { Mesh, BackSide, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'

export function Skybox() {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation of the skybox
      meshRef.current.rotation.y += 0.0001
    }
  })

  return (
    <Sphere
      ref={meshRef}
      args={[100, 64, 64]} // Large sphere to contain the scene
      position={new Vector3(0, 0, 0)}
    >
      <meshBasicMaterial
        side={BackSide}
        color="#000020"
        transparent
        opacity={1}
      >
        <gradientTexture
          stops={[0, 0.2, 0.8, 1]} // Position of color stops
          colors={['#000030', '#000040', '#100030', '#000020']} // Gradient colors
        />
      </meshBasicMaterial>
    </Sphere>
  )
}
