import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

function DiamondCoreMesh() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate and float the geometry in 3D space
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      // Continuous rotation
      meshRef.current.rotation.x = time * 0.25
      meshRef.current.rotation.y = time * 0.3

      // Slow floating translation (sinusoidal)
      meshRef.current.position.y = Math.sin(time * 1.5) * 0.15
    }
  })

  return (
    <mesh
      ref={meshRef}
      scale={hovered ? 1.45 : 1.3}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Dynamic 3D Torus Knot representing the complex mathematical stencil core */}
      <torusKnotGeometry args={[0.9, 0.24, 120, 16]} />
      
      {/* High-fidelity glass-refraction material (Diamondmorphic) */}
      <MeshTransmissionMaterial
        backside
        backsideThickness={0.2}
        thickness={0.5}
        chromaticAberration={0.06} // chromatic prism refraction
        anisotropicFiltering={3}
        distortion={0.3}
        distortionScale={0.5}
        temporalDistortion={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        roughness={0.05}
        metalness={0.1}
        ior={1.5} // Index of Refraction matching real diamond/glass
        color={hovered ? '#00f0ff' : '#ffffff'}
      />
    </mesh>
  )
}

export default function KLogoThree() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing relative z-10">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        
        {/* Spotlighting to capture glass gloss & reflections */}
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1.5} 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <DiamondCoreMesh />
        
        {/* Orbit controls allow the client to rotate, tilt, and interact with the mesh */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          dampingFactor={0.05} 
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  )
}
