import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../context/AudioContext'
import * as THREE from 'three'

// Helper to generate a soft circular particle texture dynamically (100% reliable, zero network requests)
function createCircleTexture() {
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
}

// Galaxy background starfield (white, titanium gray, and icy light blue stars)
function Starfield({ circleTexture }) {
  const starsRef = useRef()
  const count = 2800

  // 1. Generate positions, colors, phases, speeds, and drift vectors
  const [positions, basePositions, colors, baseColors, phases, speeds, drifts] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const basePositions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const baseColors = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)
    const drifts = new Float32Array(count * 3)

    // Palette: Pure White, Titanium Gray, Ice Blue, Soft Cyan
    const themeColors = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#8e8e93'), // Titanium Gray
      new THREE.Color('#e5f7ff'), // Ice Blue
      new THREE.Color('#d0f0ff')  // Soft Cyan
    ]

    for (let i = 0; i < count; i++) {
      let x, y, z
      
      if (i < 1300) {
        // Layer A: Spiral Disc
        const r = Math.random() * 8.0 + 1.2
        const arm = Math.random() < 0.5 ? 0 : Math.PI
        const spin = r * 0.65
        const angle = arm + spin + (Math.random() - 0.5) * 0.35
        
        x = Math.cos(angle) * r
        z = Math.sin(angle) * r
        y = (Math.random() - 0.5) * 1.1 * Math.exp(-r / 3.0)
      } else {
        // Layer B: Spherical Envelope (Background stars surrounding everything)
        const r = Math.random() * 9.5 + 6.5
        const u = Math.random()
        const v = Math.random()
        const theta = u * 2.0 * Math.PI
        const phi = Math.acos(2.0 * v - 1.0)
        
        x = r * Math.sin(phi) * Math.cos(theta)
        y = r * Math.sin(phi) * Math.sin(theta)
        z = r * Math.cos(phi)
      }

      const idx = i * 3
      positions[idx] = x
      positions[idx + 1] = y
      positions[idx + 2] = z

      basePositions[idx] = x
      basePositions[idx + 1] = y
      basePositions[idx + 2] = z

      const color = themeColors[Math.floor(Math.random() * themeColors.length)]
      colors[idx] = color.r
      colors[idx + 1] = color.g
      colors[idx + 2] = color.b

      baseColors[idx] = color.r
      baseColors[idx + 1] = color.g
      baseColors[idx + 2] = color.b

      // Twinkle & Drift attributes
      phases[i] = Math.random() * Math.PI * 2
      speeds[i] = Math.random() * 0.9 + 0.3
      
      // Individual drift vectors
      drifts[idx] = (Math.random() - 0.5) * 0.3
      drifts[idx + 1] = (Math.random() - 0.5) * 0.3
      drifts[idx + 2] = (Math.random() - 0.5) * 0.3
    }

    return [positions, basePositions, colors, baseColors, phases, speeds, drifts]
  }, [])

  // 2. High-Performance CPU Animation: update positions & colors in real-time
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (!starsRef.current) return

    const geo = starsRef.current.geometry
    const posAttr = geo.attributes.position
    const colorAttr = geo.attributes.color

    const arr = posAttr.array
    const colArr = colorAttr.array

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const phase = phases[i]
      const speed = speeds[i]

      // Apply slow, organic drift/sway to each star
      arr[idx] = basePositions[idx] + drifts[idx] * Math.sin(time * speed + phase)
      arr[idx + 1] = basePositions[idx + 1] + drifts[idx + 1] * Math.cos(time * speed + phase)
      arr[idx + 2] = basePositions[idx + 2] + drifts[idx + 2] * Math.sin(time * speed * 0.5 + phase)

      // Individual twinkling: modulate color brightness
      const pulse = 0.65 + 0.35 * Math.sin(time * (speed * 1.6) + phase)
      colArr[idx] = baseColors[idx] * pulse
      colArr[idx + 1] = baseColors[idx + 1] * pulse
      colArr[idx + 2] = baseColors[idx + 2] * pulse
    }

    posAttr.needsUpdate = true
    colorAttr.needsUpdate = true

    // Slow group rotation
    starsRef.current.rotation.y = time * 0.008
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065} // Large circular particles
        vertexColors
        transparent
        opacity={0.8}
        map={circleTexture}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending} // Glowing overlaps
      />
    </points>
  )
}

function Scene() {
  const kRef = useRef()
  const lightRef = useRef()
  const navigate = useNavigate()
  const { playTick, playClick } = useAudio()

  const nodeRefs = useRef([])
  const nodeMeshRefs = useRef([])
  const [hoveredNode, setHoveredNode] = useState(null)

  // Asynchronously load the flat Diamond K texture using TextureLoader to prevent Suspense blank screens
  const [logoTexture, setLogoTexture] = useState(null)
  
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load('/logo-flat.png', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      setLogoTexture(texture)
    })
  }, [])

  // Create circle texture for the stars and halos
  const circleTexture = useMemo(() => createCircleTexture(), [])

  // Satellite node details
  const nodes = useMemo(() => [
    { label: 'SHOWROOM', path: '/portfolio', key: 'showroom', angle: 0 },
    { label: 'THE LAB', path: '/services', key: 'lab', angle: (2 * Math.PI) / 5 },
    { label: 'PLAYGROUND', path: '/playground', key: 'playground', angle: (4 * Math.PI) / 5 },
    { label: 'STORY', path: '/about', key: 'story', angle: (6 * Math.PI) / 5 },
    { label: 'CONTACT', path: '/contact', key: 'contact', angle: (8 * Math.PI) / 5 }
  ], [])

  const orbitRadius = 2.4

  // Unified Frame Loop: updates central K rotation, light orbits, and node positions
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Rotate K Logo
    if (kRef.current) {
      kRef.current.rotation.y = time * 0.16
      kRef.current.rotation.x = Math.sin(time * 0.25) * 0.06
    }

    // Rotate Spotlight
    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(time * 1.4) * 2.3
      lightRef.current.position.y = Math.sin(time * 1.4) * 2.3
    }

    // Orbit Satellite Nodes
    nodes.forEach((node, idx) => {
      const angle = node.angle + time * 0.05
      const group = nodeRefs.current[idx]
      const mesh = nodeMeshRefs.current[idx]
      
      if (group) {
        group.position.x = Math.cos(angle) * orbitRadius
        group.position.y = Math.sin(angle) * orbitRadius
        // Floating wave offset + drift sway
        group.position.z = Math.sin(angle * 2.2) * 0.15 + Math.cos(time * 0.8 + node.angle) * 0.05
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
      <directionalLight position={[0, 4, 4]} intensity={1.2} color="#ffffff" />

      {/* Universe star background */}
      <Starfield circleTexture={circleTexture} />

      {/* Central Diamond K Logo Assembly */}
      {logoTexture && (
        <group ref={kRef}>
          {/* Double-crossed planes displaying transparent Diamond K texture */}
          {/* depthWrite={false} resolves transparency clipping blocks completely */}
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
        </group>
      )}

      {/* Orbiting Satellite Star Nodes */}
      {nodes.map((node, idx) => {
        const isHovered = hoveredNode === node.key
        return (
          <group 
            key={node.key}
            ref={(el) => (nodeRefs.current[idx] = el)}
          >
            {/* Satellite core sphere (star center) */}
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
              scale={isHovered ? 1.4 : 1.0}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial
                color={isHovered ? '#00f0ff' : '#ffffff'}
              />
            </mesh>

            {/* Glowing star flare halo surrounding the sphere */}
            <mesh scale={[0.42, 0.42, 1]}>
              <planeGeometry />
              <meshBasicMaterial
                map={circleTexture}
                transparent={true}
                depthWrite={false}
                color={isHovered ? '#00f0ff' : '#ffffff'}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Local point light glowing outwards from each node star */}
            <pointLight
              intensity={isHovered ? 3.0 : 1.2}
              color={isHovered ? '#00f0ff' : '#ffffff'}
              distance={2.5}
            />

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
                {node.label}
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
        
        <Scene />

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
