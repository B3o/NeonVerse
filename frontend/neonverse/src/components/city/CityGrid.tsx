import React, { useMemo } from 'react'
import { Building } from './Building'
import { FloatingPlatform } from './FloatingPlatform'
import { HologramAd } from '../effects/HologramAd'
import { Vehicle } from '../traffic/Vehicle'
import { Drone } from '../traffic/Drone'
import { MagTrain } from '../traffic/MagTrain'
import { CircuitPattern } from '../effects/CircuitPattern'
import { generateCityPositions } from '../utils/PoissonDiskSampling'

interface BuildingData {
  position: [number, number, number]
  scale: [number, number, number]
  color: string
  emissiveColor: string
  emissiveIntensity: number
  shape: 'box' | 'cylinder' | 'sphere'
}

export function CityGrid() {
  const buildings = useMemo(() => {
    const buildingData: BuildingData[] = []
    const buildingCount = 30 // Reduced from previous grid-based approach
    const positions = generateCityPositions(buildingCount, 6) // Minimum distance of 6 units between buildings
    
    // Define districts (center, outer)
    const centerRadius = 15
    const getDistrict = (x: number, z: number): 'center' | 'outer' => {
      const distanceFromCenter = Math.sqrt(x * x + z * z)
      return distanceFromCenter <= centerRadius ? 'center' : 'outer'
    }

    positions.forEach(({ x, z }: { x: number; z: number }) => {
      const district = getDistrict(x, z)
      
      // Adjust building properties based on district
      const baseHeight = district === 'center' ? 8 : 4
      const heightVariation = district === 'center' ? 8 : 4
      const height = baseHeight + Math.random() * heightVariation
      
      // Vary building footprint
      const footprintBase = district === 'center' ? 1.5 : 1
      const footprintVariation = 0.5
      const footprint = footprintBase + Math.random() * footprintVariation
      
      const position: [number, number, number] = [x, height / 2, z]
      const scale: [number, number, number] = [footprint, height, footprint]
      
      // Enhanced cyberpunk color palette with district variation
      const colors = district === 'center' 
        ? ['#101020', '#151525', '#201530'] // Dark, sleek colors for center
        : ['#202040', '#252535', '#303040'] // Slightly lighter for outer areas
      
      const emissiveColors = district === 'center'
        ? ['#00ffff', '#ff00ff', '#ff40a0', '#40ff80'] // Bright neon for center
        : ['#4080ff', '#40ff40', '#ff8040', '#8040ff'] // More subdued for outer
      
      // Vary shapes based on district
      const shapes = ['box', 'cylinder', 'sphere'] as const
      const shape = shapes[Math.floor(Math.random() * (district === 'center' ? 3 : 2))]

      buildingData.push({
        position,
        scale,
        color: colors[Math.floor(Math.random() * colors.length)],
        emissiveColor: emissiveColors[Math.floor(Math.random() * emissiveColors.length)],
        emissiveIntensity: district === 'center' 
          ? Math.random() * 0.8 + 0.6 // Brighter in center
          : Math.random() * 0.4 + 0.3, // Dimmer in outer areas
        shape
      })
    })
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
