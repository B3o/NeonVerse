import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import { CityGrid } from './components/city/CityGrid'
import { ParticleField } from './components/effects/ParticleField'
import { Skybox } from './components/environment/Skybox'
import './App.css'

function App() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[20, 20, 30]} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={10}
          maxDistance={50}
        />
        
        {/* Ambient light for base illumination */}
        <ambientLight intensity={0.1} />
        
        {/* Main directional light with shadows */}
        <directionalLight
          position={[10, 15, 10]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        
        {/* Post-processing effects */}
        <EffectComposer>
          <DepthOfField
            focusDistance={0.035}
            focalLength={0.02}
            bokehScale={4}
          />
          <Bloom
            intensity={2}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            kernelSize={5}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new Vector2(0.004, 0.004)}
            radialModulation={true}
            modulationOffset={0.5}
          />
        </EffectComposer>
        
        {/* City Scene */}
        <CityGrid />
        <ParticleField />
        
        {/* Environment for reflections */}
        <Environment
          preset="night"
          background={false}
          blur={0.8}
        />
        
        {/* Fog for depth and atmosphere */}
        {/* Skybox */}
        <Skybox />
        
        {/* Enhanced fog for depth */}
        <fog attach="fog" args={['#000020', 1, 50]} />
      </Canvas>
    </div>
  )
}

export default App
