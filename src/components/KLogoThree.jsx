import React, { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../context/AudioContext'
import * as THREE from 'three'

// Custom GLSL shaders for individual star twinkling and drifting
const starVertexShader = `
  uniform float uTime;
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aDrift;
  varying vec3 vColor;
  varying float vPhase;

  void main() {
    vColor = color;
    vPhase = aPhase;

    // Apply individual slow wave drift/sway to each star in space
    vec3 driftedPosition = position + aDrift * sin(uTime * aSpeed + aPhase);

    vec4 mvPosition = modelViewMatrix * vec4(driftedPosition, 1.0);
    
    // Scale size with a breathing pulse (twinkling)
    float pulse = 0.7 + 0.3 * sin(uTime * (aSpeed * 1.8) + aPhase);
    gl_PointSize = aSize * pulse * (300.0 / -mvPosition.z);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`

const starFragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  varying vec3 vColor;
  varying float vPhase;

  void main() {
    // Map soft circular shape using the generated texture
    vec4 texColor = texture2D(uTexture, gl_PointCoord);
    if (texColor.a < 0.05) discard;

    // Apply soft brightness breathing over time
    float pulse = 0.75 + 0.25 * sin(uTime * 2.2 + vPhase);
    gl_FragColor = vec4(vColor * pulse, texColor.a);
  }
`

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

// Galaxy background starfield (white, titanium gray, and icy light blue stars)
function Starfield({ circleTexture }) {
  const starsRef = useRef()
  const count = 2800

  // 1. Generate coordinates, colors, sizes, phases, speeds, and drift vectors for stars
  const [positions, colors, sizes, phases, speeds, drifts] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)
    const drifts = new Float32Array(count * 3)

    // Palette: Pure White, Titanium Gray, Ice Blue (extremely light blue/cyan)
    const themeColors = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#7e7e83'), // Titanium Gray
      new THREE.Color('#e0f7ff'), // Icy Blue-White
      new THREE.Color('#cceeff')  // Light Pastel Blue
    ]

    for (let i = 0; i < count; i++) {
      let x, y, z
      
      if (i < 1300) {
        // Layer A: Spiral Disc
        const r = Math.random() * 8.0 + 1.2
        const arm = Math.random() < 0.5 ? 0 : Math.PI
        const spin = r * 0.6
        const angle = arm + spin + (Math.random() - 0.5) * 0.35
        
        x = Math.cos(angle) * r
        z = Math.sin(angle) * r
        y = (Math.random() - 0.5) * 1.1 * Math.exp(-r / 3.0)
      } else {
        // Layer B: Spherical Background envelope (makes sure stars are always visible from any angle)
        const r = Math.random() * 9.5 + 6.5
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

      // Twinkle & Drift attributes
      sizes[i] = Math.random() * 0.08 + 0.045
      phases[i] = Math.random() * Math.PI * 2
      speeds[i] = Math.random() * 0.8 + 0.3
      
      // Individual drift vectors (wobble amplitude in space)
      drifts[i * 3] = (Math.random() - 0.5) * 0.25
      drifts[i * 3 + 1] = (Math.random() - 0.5) * 0.25
      drifts[i * 3 + 2] = (Math.random() - 0.5) * 0.25
    }

    return [positions, colors, sizes, phases, speeds, drifts]
  }, [])

  // 2. Update shader uniforms (uTime) and rotate the galaxy group slowly
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (starsRef.current) {
      starsRef.current.material.uniforms.uTime.value = time
      starsRef.current.rotation.y = time * 0.008
    }
  })

  // Shader material uniforms configuration
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uTexture: { value: circleTexture }
  }), [circleTexture])

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attribute="aSize" attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attribute="aPhase" attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attribute="aSpeed" attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attribute="aDrift" attach="attributes-aDrift" args={[drifts, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
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

  const nodeRefs = useRef([])
  const nodeMeshRefs = useRef([])
  const [hoveredNode, setHoveredNode] = useState(null)

  const circleTexture = useCircleTexture()

  // Construct solid K geometry
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
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02
  }), [])

  const nodes = useMemo(() => [
    { label: 'SHOWROOM', path: '/portfolio', key: 'showroom', angle: 0 },
    { label: 'THE LAB', path: '/services', key: 'lab', angle: (2 * Math.PI) / 5 },
    { label: 'PLAYGROUND', path: '/playground', key: 'playground', angle: (4 * Math.PI) / 5 },
    { label: 'STORY', path: '/about', key: 'story', angle: (6 * Math.PI) / 5 },
    { label: 'CONTACT', path: '/contact', key: 'contact', angle: (8 * Math.PI) / 5 }
  ], [])

  const orbitRadius = 2.4

  // Single render loop handles rotations, light sweeping, and node orbits for maximum efficiency
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Rotate Logo
    if (kRef.current) {
      kRef.current.rotation.y = time * 0.16
      kRef.current.rotation.x = Math.sin(time * 0.25) * 0.06
    }

    // Rotate Spotlight
    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(time * 1.4) * 2.3
      lightRef.current.position.y = Math.sin(time * 1.4) * 2.3
    }

    // Rotate Satellite Star Nodes and apply slight individual drift sways
    nodes.forEach((node, idx) => {
      const angle = node.angle + time * 0.05
      const group = nodeRefs.current[idx]
      const mesh = nodeMeshRefs.current[idx]
      
      if (group) {
        group.position.x = Math.cos(angle) * orbitRadius
        group.position.y = Math.sin(angle) * orbitRadius
        // Floating wave offset + small physical coordinate drift
        group.position.z = Math.sin(angle * 2.0) * 0.16 + Math.cos(time * 0.8 + node.angle) * 0.05
      }
      
      if (mesh) {
        // Slowly spin individual stars
        mesh.rotation.y = time * 0.5
      }
    })
  })

  const handleNodeClick = (path) => {
    playClick()
    navigate(path)
  }

  return (
    <>
      {/* Light Rigging */}
      <pointLight ref={lightRef} intensity={3.5} color="#00f0ff" distance={8} />
      <pointLight position={[-3, -3, 3]} intensity={2.0} color="#ffffff" distance={10} />
      <directionalLight position={[0, 4, 4]} intensity={1.2} color="#ffffff" />

      {/* Universe star background */}
      <Starfield circleTexture={circleTexture} />

      {/* Central Solid Obsidian K Logo (The original glowing black K) */}
      <group 
        ref={kRef}
        onPointerOver={() => setLogoHovered(true)}
        onPointerOut={() => setLogoHovered(false)}
      >
        {/* Solid highly-polished obsidian crystal K */}
        <mesh>
          <extrudeGeometry args={[kShape, extrudeSettings]} />
          <meshStandardMaterial
            color="#040407" // Deep obsidian black
            metalness={0.96}
            roughness={0.07} // High shine/polish
            emissive="#000000"
          />
        </mesh>
        
        {/* Wireframe blueprints contour overlay */}
        <mesh>
          <extrudeGeometry args={[kShape, extrudeSettings]} />
          <meshStandardMaterial
            wireframe
            color={logoHovered ? '#00f0ff' : '#ffffff'}
            emissive={logoHovered ? '#00f0ff' : '#111111'}
            emissiveIntensity={logoHovered ? 2.5 : 0.4}
            transparent
            opacity={0.35}
          />
        </mesh>
      </group>

      {/* Orbiting Satellite Star Nodes */}
      {nodes.map((node, idx) => {
        const isHovered = hoveredNode === node.key
        return (
          <group 
            key={node.key}
            ref={(el) => (nodeRefs.current[idx] = el)}
          >
            {/* The Node itself is a bright glowing star sphere */}
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
