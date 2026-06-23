import React, { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, useTexture } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../context/AudioContext'
import * as THREE from 'three'

// Galaxy background starfield (pink, light blue, and gray stars)
function Starfield() {
  const starsRef = useRef()
  const count = 1600

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    // Locked color system: Neon Pink, Cyber Cyan, Titanium Gray, Platinum Silver
    const themeColors = [
      new THREE.Color('#ff55aa'), // Pink
      new THREE.Color('#00e0ff'), // Cyan/Light Blue
      new THREE.Color('#7e7e83'), // Titanium Gray
      new THREE.Color('#d5d5d9')  // Platinum Silver
    ]

    for (let i = 0; i < count; i++) {
      // Create spiral galaxy arm distribution
      const r = Math.random() * 8.5 + 1.5
      const arm = Math.random() < 0.5 ? 0 : Math.PI
      const spin = r * 0.55
      const angle = arm + spin + (Math.random() - 0.5) * 0.35
      
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      const y = (Math.random() - 0.5) * 1.6 * Math.exp(-r / 3.5)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const color = themeColors[Math.floor(Math.random() * themeColors.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return [positions, colors]
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (starsRef.current) {
      // Extremely slow cosmic rotation
      starsRef.current.rotation.y = time * 0.012
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  )
}

// Orbiting Node representing navigation tabs
function OrbitingNode({ label, path, baseAngle, radius }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const navigate = useNavigate()
  const { playTick, playClick } = useAudio()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Orbit around the center
    const angle = baseAngle + time * 0.05
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * radius
      groupRef.current.position.y = Math.sin(angle) * radius
      // Gentle floating sine-wave motion
      groupRef.current.position.z = Math.sin(angle * 2.5) * 0.12
    }

    if (meshRef.current) {
      // Slow spin of the satellite itself
      meshRef.current.rotation.y = time * 0.4
    }
  })

  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    playTick()
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    setHovered(false)
  }

  const handleClick = (e) => {
    e.stopPropagation()
    playClick()
    navigate(path)
  }

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        scale={hovered ? 1.35 : 1.0}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial
          roughness={0.05}
          metalness={0.9}
          color={hovered ? '#00f0ff' : '#ffffff'}
          transmission={0.75}
          thickness={0.6}
          clearcoat={1.0}
        />
      </mesh>

      {/* HTML badge overlay tracking the node coordinate */}
      <Html distanceFactor={6} center>
        <div
          onClick={handleClick}
          onMouseEnter={handlePointerOver}
          onMouseLeave={handlePointerOut}
          className={`font-mono text-[9px] px-2.5 py-0.5 rounded bg-[#050507]/90 border border-zinc-900 text-[#8e8e93] uppercase tracking-widest transition-all duration-300 select-none cursor-pointer hover:text-[#00f0ff] hover:border-[#00f0ff] hover:shadow-[0_0_12px_rgba(0,240,255,0.45)] hover:scale-105 ${
            hovered ? 'text-[#00f0ff] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.45)] scale-105 z-20' : 'z-10'
          }`}
          style={{ whiteSpace: 'nowrap' }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}

function Scene() {
  const kRef = useRef()
  const lightRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Load flat Crystal Diamond K logo texture (pre-rendered transparent png)
  const logoTexture = useTexture('/logo-flat.png')

  // Setup extruded wireframe K geometry (for internal technical depth)
  const kShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-0.4, 0.8)
    shape.lineTo(-0.2, 0.8)
    shape.lineTo(-0.2, 0.15)
    shape.lineTo(0.35, 0.8)
    shape.lineTo(0.65, 0.8)
    shape.lineTo(0.1, 0.0)
    shape.lineTo(0.65, -0.8)
    shape.lineTo(0.35, -0.8)
    shape.lineTo(-0.2, -0.15)
    shape.lineTo(-0.2, -0.8)
    shape.lineTo(-0.4, -0.8)
    shape.closePath()
    return shape
  }, [])

  const extrudeSettings = useMemo(() => ({
    depth: 0.15,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02
  }), [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (kRef.current) {
      // Rotation in response to time
      kRef.current.rotation.y = time * 0.18
      kRef.current.rotation.x = Math.sin(time * 0.3) * 0.06
    }
    if (lightRef.current) {
      // Orbiting spotlight sweeps facet reflections
      lightRef.current.position.x = Math.cos(time * 1.5) * 2.3
      lightRef.current.position.y = Math.sin(time * 1.5) * 2.3
    }
  })

  // Satellite configuration
  const satelliteNodes = [
    { label: 'SHOWROOM', path: '/portfolio', angle: 0 },
    { label: 'THE LAB', path: '/services', angle: (2 * Math.PI) / 5 },
    { label: 'PLAYGROUND', path: '/playground', angle: (4 * Math.PI) / 5 },
    { label: 'STORY', path: '/about', angle: (6 * Math.PI) / 5 },
    { label: 'CONTACT', path: '/contact', angle: (8 * Math.PI) / 5 }
  ]

  return (
    <>
      {/* Light rigging */}
      <pointLight ref={lightRef} intensity={3.0} color="#00f0ff" distance={8} />
      <pointLight position={[-3, -3, 3]} intensity={2.0} color="#ffffff" distance={10} />
      <directionalLight position={[0, 4, 4]} intensity={1} color="#ffffff" />

      {/* Starfield Background */}
      <Starfield />

      {/* Central Diamond K Assembly */}
      <group 
        ref={kRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Double-crossed planes displaying transparent Diamond K texture (gives 3D volumetric view) */}
        <mesh scale={[1.25, 1.8, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={logoTexture} transparent={true} alphaTest={0.05} side={THREE.DoubleSide} depthWrite={true} />
        </mesh>
        
        <mesh scale={[1.25, 1.8, 1]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry />
          <meshBasicMaterial map={logoTexture} transparent={true} alphaTest={0.05} side={THREE.DoubleSide} depthWrite={true} />
        </mesh>

        {/* Crystalline wireframe K outline (inside the crossed planes) */}
        <mesh>
          <extrudeGeometry args={[kShape, extrudeSettings]} />
          <meshStandardMaterial
            wireframe
            color={hovered ? '#00f0ff' : '#ffffff'}
            emissive={hovered ? '#00f0ff' : '#222222'}
            emissiveIntensity={hovered ? 2.2 : 0.6}
            transparent
            opacity={0.45}
          />
        </mesh>
      </group>

      {/* Satellite orbit path rendering */}
      {satelliteNodes.map((node, i) => (
        <OrbitingNode
          key={i}
          label={node.label}
          path={node.path}
          baseAngle={node.angle}
          radius={2.3}
        />
      ))}
    </>
  )
}

export default function KLogoThree() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing relative z-10">
      <Canvas
        camera={{ position: [0, 0, 3.6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        
        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          dampingFactor={0.05} 
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
