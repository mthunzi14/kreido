import React, { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, useTexture } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../context/AudioContext'
import * as THREE from 'three'

// Helper to generate a soft circular particle texture dynamically
function useCircleTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 16
    const ctx = canvas.getContext('2d')

    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 16, 16)

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])
}

// Galaxy background starfield (pink, light blue, and gray stars)
function Starfield() {
  const starsRef = useRef()
  const circleTexture = useCircleTexture()
  
  // 1. Generate two layers of stars: Central Spiral Disc & Spherical Outer Envelope
  const count = 3000 // 1,500 disk stars + 1,500 sphere stars

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    const themeColors = [
      new THREE.Color('#ff4499'), // Neon Pink
      new THREE.Color('#00eeff'), // Cyber Cyan
      new THREE.Color('#7e7e83'), // Titanium Gray
      new THREE.Color('#ececf0')  // Platinum Silver
    ]

    for (let i = 0; i < count; i++) {
      let x, y, z
      
      if (i < 1500) {
        // Layer A: Spiral Disc (Concentrated in center, thin disk)
        const r = Math.random() * 8.0 + 1.2
        const arm = Math.random() < 0.5 ? 0 : Math.PI
        const spin = r * 0.6
        const angle = arm + spin + (Math.random() - 0.5) * 0.35
        
        x = Math.cos(angle) * r
        z = Math.sin(angle) * r
        y = (Math.random() - 0.5) * 1.2 * Math.exp(-r / 3.0)
      } else {
        // Layer B: Spherical Envelope (Background stars surrounding everything)
        const r = Math.random() * 10.0 + 7.0 // Outer sphere shell
        const u = Math.random()
        const v = Math.random()
        const theta = u * 2.0 * Math.PI
        const phi = Math.acos(2.0 * v - 1.0)
        
        x = r * Math.sin(phi) * Math.cos(theta)
        y = r * Math.sin(phi) * Math.sin(theta)
        z = r * Math.cos(phi)
      }

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
      // Slow rotation of the background universe
      starsRef.current.rotation.y = time * 0.01
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
        size={0.075} // Larger glowing particles
        vertexColors
        transparent
        opacity={0.8}
        map={circleTexture}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending} // Additive glow
      />
    </points>
  )
}

function Scene() {
  const kRef = useRef()
  const lightRef = useRef()
  const [logoHovered, setLogoHovered] = useState(false)
  const navigate = useNavigate()
  const { playTick, playClick } = useAudio()

  // References to the 5 orbiting node groups for performance optimization
  const nodeRefs = useRef([])
  const nodeMeshRefs = useRef([])
  const [hoveredNode, setHoveredNode] = useState(null)

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
    depth: 0.14,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02
  }), [])

  // Satellite node details
  const nodes = useMemo(() => [
    { label: 'SHOWROOM', path: '/portfolio', key: 'showroom', angle: 0 },
    { label: 'THE LAB', path: '/services', key: 'lab', angle: (2 * Math.PI) / 5 },
    { label: 'PLAYGROUND', path: '/playground', key: 'playground', angle: (4 * Math.PI) / 5 },
    { label: 'STORY', path: '/about', key: 'story', angle: (6 * Math.PI) / 5 },
    { label: 'CONTACT', path: '/contact', key: 'contact', angle: (8 * Math.PI) / 5 }
  ], [])

  const orbitRadius = 2.3

  // Unified Frame Loop: single loop updates K logo, lights, and all 5 orbiting nodes
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // 1. Rotate Central Logo
    if (kRef.current) {
      kRef.current.rotation.y = time * 0.15
      kRef.current.rotation.x = Math.sin(time * 0.3) * 0.06
    }

    // 2. Rotate Spotlight
    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(time * 1.5) * 2.3
      lightRef.current.position.y = Math.sin(time * 1.5) * 2.3
    }

    // 3. Rotate Orbiting Satellite Nodes
    nodes.forEach((node, idx) => {
      const angle = node.angle + time * 0.055
      const group = nodeRefs.current[idx]
      const mesh = nodeMeshRefs.current[idx]
      
      if (group) {
        group.position.x = Math.cos(angle) * orbitRadius
        group.position.y = Math.sin(angle) * orbitRadius
        group.position.z = Math.sin(angle * 2.2) * 0.15
      }
      
      if (mesh) {
        mesh.rotation.y = time * 0.4
      }
    })
  })

  const handleNodeClick = (path) => {
    playClick()
    navigate(path)
  }

  return (
    <>
      {/* Light rigging */}
      <pointLight ref={lightRef} intensity={3.5} color="#00f0ff" distance={8} />
      <pointLight position={[-3, -3, 3]} intensity={2.0} color="#ffffff" distance={10} />
      <directionalLight position={[0, 4, 4]} intensity={1} color="#ffffff" />

      {/* Starfield Background */}
      <Starfield />

      {/* Central Diamond K Assembly */}
      <group 
        ref={kRef}
        onPointerOver={() => setLogoHovered(true)}
        onPointerOut={() => setLogoHovered(false)}
      >
        {/* Crossed planes displaying transparent Diamond K texture */}
        {/* CRITICAL FIX: depthWrite={false} prevents transparent edges from clipping the background and other planes */}
        <mesh scale={[1.3, 1.85, 1]}>
          <planeGeometry />
          <meshBasicMaterial 
            map={logoTexture} 
            transparent={true} 
            depthWrite={false} 
            side={THREE.DoubleSide} 
          />
        </mesh>
        
        <mesh scale={[1.3, 1.85, 1]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry />
          <meshBasicMaterial 
            map={logoTexture} 
            transparent={true} 
            depthWrite={false} 
            side={THREE.DoubleSide} 
          />
        </mesh>

        {/* Crystalline wireframe K outline */}
        <mesh>
          <extrudeGeometry args={[kShape, extrudeSettings]} />
          <meshStandardMaterial
            wireframe
            color={logoHovered ? '#00f0ff' : '#ffffff'}
            emissive={logoHovered ? '#00f0ff' : '#222222'}
            emissiveIntensity={logoHovered ? 2.5 : 0.6}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>

      {/* Orbiting Satellite Nodes */}
      {nodes.map((node, idx) => {
        const isHovered = hoveredNode === node.key
        return (
          <group 
            key={node.key}
            ref={(el) => (nodeRefs.current[idx] = el)}
          >
            <mesh
              ref={(el) => (nodeMeshRefs.current[idx] = el)}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHoveredNode(node.key)
                playTick()
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                setHoveredNode(null)
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleNodeClick(node.path)
              }}
              scale={isHovered ? 1.35 : 1.0}
            >
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshPhysicalMaterial
                roughness={0.05}
                metalness={0.9}
                color={isHovered ? '#00f0ff' : '#ffffff'}
                transmission={0.8}
                thickness={0.6}
                clearcoat={1.0}
              />
            </mesh>

            {/* HTML label badge */}
            <Html distanceFactor={6} center>
              <div
                onClick={() => handleNodeClick(node.path)}
                onMouseEnter={() => {
                  setHoveredNode(node.key)
                  playTick()
                }}
                onMouseLeave={() => setHoveredNode(null)}
                className={`font-mono text-[9px] px-2.5 py-0.5 rounded bg-[#050507]/90 border border-zinc-900 text-[#8e8e93] uppercase tracking-widest transition-all duration-300 select-none cursor-pointer hover:text-[#00f0ff] hover:border-[#00f0ff] hover:shadow-[0_0_12px_rgba(0,240,255,0.45)] hover:scale-105 ${
                  isHovered ? 'text-[#00f0ff] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.45)] scale-105 z-20' : 'z-10'
                }`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {label}
              </div>
            </Html>
          </group>
        )
      })}
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
