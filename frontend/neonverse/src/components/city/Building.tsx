import { useRef, useState, useCallback } from 'react'
import { Mesh, Vector3, MeshStandardMaterial, Color, TextureLoader, RepeatWrapping, Vector2 } from 'three'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Cylinder } from '@react-three/drei'
import { LedScreen } from '../effects/LedScreen'

// Load and configure textures
const facadeNormalMap = new TextureLoader().load('/textures/facade_normal.jpg')
facadeNormalMap.wrapS = RepeatWrapping
facadeNormalMap.wrapT = RepeatWrapping
facadeNormalMap.repeat.set(4, 4)

interface BuildingProps {
  position: [number, number, number]
  scale: [number, number, number]
  color?: string
  emissiveColor?: string
  emissiveIntensity?: number
  shape?: 'box' | 'cylinder' | 'sphere' | 'pagoda'
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

  const BuildingCore = () => {
    const MaterialComponent = (
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1.5}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
        normalMap={facadeNormalMap}
        normalScale={new Vector2(0.3, 0.3)}
      />
    )

    // Window grid parameters
    const windowRows = Math.floor(scale[1] * 2)
    const windowCols = 4
    const windowSize = 0.15
    const windowSpacing = 0.3
    const windowStartY = -scale[1] / 2 + windowSize
    
    // Generate windows
    const windows = []
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowCols; col++) {
        const windowX = (col - (windowCols - 1) / 2) * windowSpacing
        const windowY = windowStartY + row * windowSpacing
        
        windows.push(
          <Box
            key={`window-${row}-${col}`}
            position={[windowX, windowY, 0.51]}
            scale={[windowSize, windowSize, 0.1]}
          >
            <meshStandardMaterial
              color="#80c0ff"
              emissive="#80c0ff"
              emissiveIntensity={0.5 + Math.random() * 0.5}
              metalness={1}
              roughness={0}
              transparent
              opacity={0.9}
            />
          </Box>
        )
      }
    }

    // Enhanced roof details with Chinese-inspired elements
    const RoofDetail = () => (
      <group position={[0, scale[1] / 2 + 0.1, 0]}>
        {/* Main roof platform */}
        <Box scale={[scale[0] * 1.2, 0.1, scale[2] * 1.2]}>
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            normalMap={facadeNormalMap}
          />
        </Box>
        
        {/* Layered roof structure with upturned eaves */}
        {[0.8, 0.6].map((scale_factor, i) => (
          <group key={`roof-layer-${i}`}>
            {/* Main roof layer */}
            <Box 
              position={[0, 0.15 + i * 0.2, 0]}
              scale={[scale[0] * scale_factor, 0.15, scale[2] * scale_factor]}
            >
              <meshStandardMaterial
                color={color}
                metalness={0.9}
                roughness={0.1}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
                normalMap={facadeNormalMap}
              />
            </Box>
            
            {/* Upturned eaves (飞檐) */}
            {[-1, 1].map((x) => (
              <Box
                key={`eave-${i}-${x}`}
                position={[
                  x * (scale[0] * scale_factor * 0.5),
                  0.15 + i * 0.2,
                  0
                ]}
                rotation={[0, 0, x * Math.PI * 0.1]}
                scale={[scale[0] * scale_factor * 0.2, 0.05, scale[2] * scale_factor]}
              >
                <meshStandardMaterial
                  color={color}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity}
                />
              </Box>
            ))}
          </group>
        ))}
        
        {/* Decorative corners (琉璃瓦) */}
        {[-1, 1].map((x) => 
          [-1, 1].map((z) => (
            <group key={`corner-${x}-${z}`}>
              <Box
                position={[
                  x * (scale[0] * 0.5),
                  0.3,
                  z * (scale[2] * 0.5)
                ]}
                scale={[0.2, 0.3, 0.2]}
              >
                <meshStandardMaterial
                  color={emissiveColor}
                  emissive={emissiveColor}
                  emissiveIntensity={1}
                  metalness={1}
                  roughness={0}
                />
              </Box>
              {/* Additional ornamental details */}
              <Box
                position={[
                  x * (scale[0] * 0.5),
                  0.5,
                  z * (scale[2] * 0.5)
                ]}
                scale={[0.1, 0.2, 0.1]}
                rotation={[0, Math.PI * 0.25, 0]}
              >
                <meshStandardMaterial
                  color={emissiveColor}
                  emissive={emissiveColor}
                  emissiveIntensity={1.5}
                  metalness={1}
                  roughness={0}
                />
              </Box>
            </group>
          ))
        )}
      </group>
    )

    // Balcony details
    const Balcony = ({ posY }: { posY: number }) => (
      <group position={[0, posY, 0]}>
        <Box 
          position={[0, 0, 0.6]}
          scale={[scale[0] * 0.8, 0.05, 0.3]}
        >
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
          />
        </Box>
        <Box 
          position={[0, 0.1, 0.6]}
          scale={[scale[0] * 0.8, 0.1, 0.02]}
        >
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity * 0.5}
          />
        </Box>
      </group>
    )

    switch (shape) {
      case 'box':
        return (
          <group>
            <Box
              ref={meshRef}
              scale={new Vector3(...scale)}
              castShadow
              receiveShadow
              onClick={handleClick}
            >
              {MaterialComponent}
            </Box>
            {windows}
            <RoofDetail />
            {Array.from({ length: Math.floor(scale[1]) }).map((_, i) => (
              <Balcony 
                key={`balcony-${i}`} 
                posY={-scale[1] / 2 + (i + 1) * (scale[1] / (Math.floor(scale[1]) + 1))}
              />
            ))}
          </group>
        )
      case 'cylinder':
        return (
          <group>
            <Cylinder
              ref={meshRef}
              scale={new Vector3(...scale)}
              castShadow
              receiveShadow
              onClick={handleClick}
            >
              {MaterialComponent}
            </Cylinder>
            <RoofDetail />
          </group>
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
      case 'pagoda':
        return (
          <group>
            {/* Base structure */}
            <Box
              ref={meshRef}
              scale={new Vector3(scale[0], scale[1] * 0.8, scale[2])}
              castShadow
              receiveShadow
              onClick={handleClick}
            >
              {MaterialComponent}
            </Box>
            
            {/* Pagoda-style layered roofs */}
            {[0.8, 0.6, 0.4].map((scale_factor, i) => (
              <group key={`pagoda-roof-${i}`} position={[0, scale[1] * (0.4 + i * 0.2), 0]}>
                {/* Main roof layer */}
                <Box
                  scale={[
                    scale[0] * (1 + (1 - scale_factor) * 0.5),
                    scale[1] * 0.1,
                    scale[2] * (1 + (1 - scale_factor) * 0.5)
                  ]}
                >
                  <meshStandardMaterial
                    color={color}
                    metalness={0.9}
                    roughness={0.1}
                    emissive={emissiveColor}
                    emissiveIntensity={emissiveIntensity}
                    normalMap={facadeNormalMap}
                  />
                </Box>
                
                {/* Upturned eaves on all four sides */}
                {[-1, 1].map((x) => (
                  <Box
                    key={`pagoda-eave-x-${i}-${x}`}
                    position={[
                      x * scale[0] * (1 + (1 - scale_factor) * 0.5) * 0.5,
                      0,
                      0
                    ]}
                    rotation={[0, 0, x * Math.PI * 0.15]}
                    scale={[
                      scale[0] * 0.3,
                      scale[1] * 0.05,
                      scale[2] * (1 + (1 - scale_factor) * 0.5)
                    ]}
                  >
                    <meshStandardMaterial
                      color={color}
                      metalness={0.9}
                      roughness={0.1}
                      emissive={emissiveColor}
                      emissiveIntensity={emissiveIntensity}
                    />
                  </Box>
                ))}
                {[-1, 1].map((z) => (
                  <Box
                    key={`pagoda-eave-z-${i}-${z}`}
                    position={[
                      0,
                      0,
                      z * scale[2] * (1 + (1 - scale_factor) * 0.5) * 0.5
                    ]}
                    rotation={[z * Math.PI * 0.15, 0, 0]}
                    scale={[
                      scale[0] * (1 + (1 - scale_factor) * 0.8),
                      scale[1] * 0.05,
                      scale[2] * 0.3
                    ]}
                  >
                    <meshStandardMaterial
                      color={color}
                      metalness={0.9}
                      roughness={0.1}
                      emissive={emissiveColor}
                      emissiveIntensity={emissiveIntensity}
                    />
                  </Box>
                ))}
              </group>
            ))}
            
            {/* Ornamental spire */}
            <Box
              position={[0, scale[1] * 1.2, 0]}
              scale={[0.1, scale[1] * 0.2, 0.1]}
            >
              <meshStandardMaterial
                color={emissiveColor}
                emissive={emissiveColor}
                emissiveIntensity={1.5}
                metalness={1}
                roughness={0}
              />
            </Box>
          </group>
        )
      default:
        return null
    }
  }

  return (
    <group position={new Vector3(...position)}>
      <BuildingCore />
      
      {/* Air conditioning units */}
      {shape === 'box' && scale[1] > 3 && (
        <>
          <Box
            position={[scale[0] / 2 + 0.2, -scale[1] / 3, 0]}
            scale={[0.3, 0.3, 0.3]}
          >
            <meshStandardMaterial
              color="#404040"
              metalness={0.8}
              roughness={0.2}
            />
          </Box>
          <Box
            position={[-scale[0] / 2 - 0.2, -scale[1] / 4, 0]}
            scale={[0.3, 0.3, 0.3]}
          >
            <meshStandardMaterial
              color="#404040"
              metalness={0.8}
              roughness={0.2}
            />
          </Box>
          {/* AC vents with glow effect */}
          <Box
            position={[scale[0] / 2 + 0.2, -scale[1] / 3, 0.2]}
            scale={[0.2, 0.2, 0.01]}
          >
            <meshStandardMaterial
              color="#80ffff"
              emissive="#40ffff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </Box>
          <Box
            position={[-scale[0] / 2 - 0.2, -scale[1] / 4, 0.2]}
            scale={[0.2, 0.2, 0.01]}
          >
            <meshStandardMaterial
              color="#80ffff"
              emissive="#40ffff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </Box>
        </>
      )}
      
      {/* LED screens on building with Chinese text */}
      {scale[1] > 3 && Math.random() > 0.5 && (
        <>
          <LedScreen
            position={[0.51, scale[1] * 0.3, 0]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[scale[1] * 0.4, scale[1] * 0.2, 1]}
            color={emissiveColor}
            text={shape === 'pagoda' ? '龙腾' : undefined}
          />
          <LedScreen
            position={[0, scale[1] * 0.3, 0.51]}
            rotation={[0, 0, 0]}
            scale={[scale[1] * 0.4, scale[1] * 0.2, 1]}
            color={emissiveColor}
            text={shape === 'pagoda' ? '飞跃' : undefined}
          />
        </>
      )}
    </group>
  )
}
