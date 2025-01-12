import { useMemo } from 'react'
import { Building } from './Building'
import { FloatingPlatform } from './FloatingPlatform'
import { HologramAd } from '../effects/HologramAd'
import { Vehicle } from '../traffic/Vehicle'
import { Drone } from '../traffic/Drone'
import { MagTrain } from '../traffic/MagTrain'
import { CircuitPattern } from '../effects/CircuitPattern'

export function CityGrid() {
  const buildings = useMemo(() => {
    const buildingData = []
    const gridSize = 5
    const spacing = 3.5

    for (let x = -gridSize; x <= gridSize; x++) {
      for (let z = -gridSize; z <= gridSize; z++) {
        const height = Math.random() * 8 + 4 // Random height between 4 and 12
        const position: [number, number, number] = [
          x * spacing,
          height / 2,
          z * spacing
        ]
        const scale: [number, number, number] = [1, height, 1]
        
        // Enhanced cyberpunk color palette
        const colors = ['#101020', '#151525', '#201530']
        const emissiveColors = ['#00ffff', '#ff00ff', '#ff40a0', '#40ff80']
        
        // Randomly select building shape
        const shapes = ['box', 'cylinder', 'sphere'] as const
        const shape = shapes[Math.floor(Math.random() * (x % 2 === 0 ? 2 : 3))] // More varied shapes on even rows

        buildingData.push({
          position,
          scale,
          color: colors[Math.floor(Math.random() * colors.length)],
          emissiveColor: emissiveColors[Math.floor(Math.random() * emissiveColors.length)],
          emissiveIntensity: Math.random() * 0.6 + 0.4,
          shape
        })
      }
    }
    return buildingData
  }, [])

  return (
    <group>
      {buildings.map((building, index) => (
        <Building key={index} {...building} />
      ))}

      {/* Hologram advertisements */}
      <HologramAd position={[5, 4, 5]} rotation={[0, Math.PI / 4, 0]} />
      <HologramAd position={[-5, 3, -5]} rotation={[0, -Math.PI / 4, 0]} />
      <HologramAd position={[8, 6, -3]} rotation={[0, Math.PI / 6, 0]} />
      <HologramAd position={[-8, 5, 3]} rotation={[0, -Math.PI / 6, 0]} />
      <HologramAd position={[0, 8, 0]} rotation={[0, Math.PI / 2, 0]} />
      <HologramAd position={[3, 7, -8]} rotation={[0, -Math.PI / 3, 0]} />
      
      {/* Vehicles */}
      <Vehicle startPosition={[0, 0.2, 0]} speed={1} />
      <Vehicle startPosition={[5, 0.2, 5]} speed={1.5} />
      <Vehicle startPosition={[-5, 0.2, -5]} speed={2} />
      
      {/* Drones */}
      <Drone startPosition={[0, 10, 0]} speed={0.5} />
      <Drone startPosition={[5, 8, 5]} speed={0.7} />
      <Drone startPosition={[-5, 12, -5]} speed={0.3} />
      
      {/* Magnetic Trains */}
      <MagTrain startPosition={[0, 5, 0]} speed={0.2} />
      <MagTrain startPosition={[0, 8, 0]} speed={0.15} />
      
      {/* Floating Platforms */}
      <FloatingPlatform 
        position={[0, 8, 0]} 
        scale={[4, 0.2, 4]}
        oscillationHeight={0.8}
        oscillationSpeed={0.5}
      />
      <FloatingPlatform 
        position={[6, 6, 6]} 
        scale={[3, 0.2, 3]}
        oscillationHeight={0.6}
        oscillationSpeed={0.7}
      />
      <FloatingPlatform 
        position={[-6, 10, -6]} 
        scale={[3, 0.2, 3]}
        oscillationHeight={1}
        oscillationSpeed={0.3}
      />
      
      {/* Ground plane with animated circuit pattern */}
      <CircuitPattern />
    </group>
  )
}
