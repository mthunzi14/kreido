import React, { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, useTexture } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../context/AudioContext'
import * as THREE from 'three'

// GPU Shaders for high-performance pulsing & drifting star particles
const vertexShader = `
  attribute vec3 color;
  uniform float uTime;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vColor = color;
    
    // Twinkling pulse on GPU (unique frequency and offset per star)
    float speed = 2.2 + mod(aPhase, 2.8);
    vTwinkle = 0.38 + 0.62 * sin(uTime * speed + aPhase);
    
    // Floating cosmic drift (drift positions slowly in 3D wave space)
    vec3 pos = position;
    pos.x += sin(uTime * 0.45 + aPhase) * 0.18;
    pos.y += cos(uTime * 0.35 + aPhase) * 0.18;
    pos.z += sin(uTime * 0.55 + aPhase) * 0.18;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation: scale point sizes based on perspective depth and twinkle pulse
    gl_PointSize = (15.0 * vTwinkle) / -mvPosition.z;
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // Mathematically render a soft circle inside the point square
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    if (dist > 0.5) {
      discard;
    }
    
    // Soft exponential radial falloff representing a shining star
    float alpha = smoothstep(0.5, 0.04, dist) * vTwinkle * 0.9;
    
    gl_FragColor = vec4(vColor, alpha);
  }
`

function Starfield() {
  const starsRef = useRef()
  const count = 3000 // 1,500 disk stars + 1,500 sphere stars

  // Generate coordinates, colors, and random phases
  const [positions, colors, phases] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    
    // Colors: Pure White, Cyber Light Blue, Titanium Gray, Platinum Silver
    const themeColors = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#bfeeff'), // Very Light Blue
      new THREE.Color('#5e5e63'), // Titanium Gray
      new THREE.Color('#d5d5d9')  // Platinum Silver
    ]

    for (let i = 0; i < count; i++) {
      let x, y, z
      
      if (i < 1500) {
        // Layer A: Spiral Disc
        const r = Math.random() * 8.0 + 1.2
        const arm = Math.random() < 0.5 ? 0 : Math.PI
        const spin = r * 0.55
        const angle = arm + spin + (Math.random() - 0.5) * 0.35
        
        x = Math.cos(angle) * r
        z = Math.sin(angle) * r
        y = (Math.random() - 0.5) * 1.2 * Math.exp(-r / 3.0)
      } else {
        // Layer B: Spherical Envelope (twinkles everywhere when camera rotates)
        const r = Math.random() * 10.0 + 7.0
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

      phases[i] = Math.random() * 1000.0 // Phase offsets
    }

    return [positions, colors, phases]
  }, [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Update shader clock
    uniforms.uTime.value = time
    if (starsRef.current) {
      // Slow rotation of the background universe
      starsRef.current.rotation.y = time * 0.008
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
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
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

  // Cache buster by referencing the renamed transparent v4 logo file
  const logoTexture = useTexture('/logo-flat-v4.png')

  // Satellite node configuration
  const nodes = useMemo(() => [
    { label: 'SHOWROOM', path: '/portfolio', key: 'showroom', angle: 0 },
    { label: 'THE LAB', path: '/services', key: 'lab', angle: (2 * Math.PI) / 5 },
    { label: 'PLAYGROUND', path: '/playground', key: 'playground', angle: (4 * Math.PI) / 5 },
    { label: 'STORY', path: '/about', key: 'story', angle: (6 * Math.PI) / 5 },
    { label: 'CONTACT', path: '/contact', key: 'contact', angle: (8 * Math.PI) / 5 }
  ], [])

  const orbitRadius = 2.3

  // Single Frame Loop: updates logo rotation, sweeping pointlight, and orbiting node groups
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Rotate K Logo
    if (kRef.current) {
      kRef.current.rotation.y = time * 0.15
      kRef.current.rotation.x = Math.sin(time * 0.35) * 0.05
    }

    // Rotate Spotlight
    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(time * 1.4) * 2.2
      lightRef.current.position.y = Math.sin(time * 1.4) * 2.2
    }

    // Rotate Node Groups
    nodes.forEach((node, idx) => {
      const angle = node.angle + time * 0.05
      const group = nodeRefs.current[idx]
      const mesh = nodeMeshRefs.current[idx]
      
      if (group) {
        group.position.x = Math.cos(angle) * orbitRadius
        group.position.y = Math.sin(angle) * orbitRadius
        group.position.z = Math.sin(angle * 2.4) * 0.12
      }
      
      if (mesh) {
        mesh.rotation.y = time * 0.3
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

      {/* Galaxy Starfield */}
      <Starfield />

      {/* Central Diamond K Assembly */}
      <group 
        ref={kRef}
        onPointerOver={() => setLogoHovered(true)}
        onPointerOut={() => setLogoHovered(false)}
      >
        {/* Double-crossed planes displaying transparent Diamond K texture */}
        {/* Using meshStandardMaterial reacts to lights so specular sweeps illuminate chrome/glass blocks */}
        <mesh scale={[1.3, 1.85, 1]}>
          <planeGeometry />
          <meshStandardMaterial 
            map={logoTexture} 
            transparent={true} 
            depthWrite={false} 
            side={THREE.DoubleSide}
            roughness={0.1}
            metalness={0.8}
            emissive={logoHovered ? '#003344' : '#000000'}
            emissiveIntensity={logoHovered ? 0.4 : 0.0}
          />
        </mesh>
        
        <mesh scale={[1.3, 1.85, 1]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry />
          <meshStandardMaterial 
            map={logoTexture} 
            transparent={true} 
            depthWrite={false} 
            side={THREE.DoubleSide}
            roughness={0.1}
            metalness={0.8}
            emissive={logoHovered ? '#003344' : '#000000'}
            emissiveIntensity={logoHovered ? 0.4 : 0.0}
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
