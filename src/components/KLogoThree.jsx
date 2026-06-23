import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function GyroscopeCore() {
  const torusKnotRef = useRef()
  const outerSphereRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Rotate layers in opposite directions to create a high-tech mechanical gyroscope effect
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (torusKnotRef.current) {
      // Internal core rotates on multiple axes
      torusKnotRef.current.rotation.x = time * (hovered ? 0.6 : 0.25)
      torusKnotRef.current.rotation.y = time * (hovered ? 0.7 : 0.3)
    }

    if (outerSphereRef.current) {
      // Outer orbital ring rotates in reverse
      outerSphereRef.current.rotation.y = -time * 0.15
      outerSphereRef.current.rotation.z = time * 0.1
    }
  })

  return (
    <group 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
    >
      {/* 1. Inner Core: Glowing Wireframe Torus Knot */}
      <mesh ref={torusKnotRef}>
        <torusKnotGeometry args={[0.75, 0.2, 100, 16]} />
        <meshStandardMaterial
          wireframe
          color={hovered ? '#00f0ff' : '#ffffff'}
          emissive={hovered ? '#00bbff' : '#222222'}
          emissiveIntensity={hovered ? 2.5 : 0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* 2. Outer Orbital Ring: Wireframe Sphere */}
      <mesh ref={outerSphereRef}>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshStandardMaterial
          wireframe
          color={hovered ? '#005588' : '#333333'}
          transparent
          opacity={0.3}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
    </group>
  )
}

export default function KLogoThree() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing relative z-10">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lights catching the wireframe dimensions */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
        
        <GyroscopeCore />
        
        {/* Allow users to grab, drag, and throw the rotation */}
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
