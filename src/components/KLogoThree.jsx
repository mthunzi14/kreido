import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, useTexture } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../context/AudioContext'
import * as THREE from 'three'

// GPU Shaders for high-performance pulsing & drifting star particles with smooth near-camera fade
const vertexShader = `
  attribute vec3 aColor;
  uniform float uTime;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vColor = aColor;
    
    // Twinkling pulse on GPU (unique frequency and offset per star, slightly slower for premium feel)
    float speed = 1.0 + mod(aPhase, 1.5);
    vTwinkle = max(0.0, 0.4 + 0.6 * sin(uTime * speed + aPhase));
    
    // Floating cosmic drift (drift positions slowly in 3D wave space)
    vec3 pos = position;
    pos.x += sin(uTime * 0.2 + aPhase) * 0.3;
    pos.y += cos(uTime * 0.15 + aPhase) * 0.3;
    pos.z += sin(uTime * 0.25 + aPhase) * 0.3;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Calculate distance to camera
    float cameraDist = -mvPosition.z;
    
    // Smooth near-plane camera fade-out (smooth transition from 0.4 to 1.2 distance) to prevent sudden pop-outs
    float nearFade = smoothstep(0.4, 1.2, cameraDist);
    
    // Attenuate point size by camera distance, and clamp to prevent screen-blocking spikes
    float sizeFactor = 0.5 + mod(aPhase * 0.1, 1.5);
    gl_PointSize = clamp((18.0 * vTwinkle * sizeFactor * nearFade) / cameraDist, 1.0, 32.0);
    
    // Multiply twinkle by near-plane fade for correct opacity in fragment shader
    vTwinkle = vTwinkle * nearFade;
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // Mathematically render a soft radial glow inside the point square
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    if (dist > 0.5) {
      discard;
    }
    
    // Soft quadratic radial falloff representing a shining star halo
    float glow = pow(1.0 - (dist * 2.0), 2.0);
    float alpha = glow * vTwinkle * 0.9;
    
    gl_FragColor = vec4(vColor, alpha);
  }
`

function Starfield() {
  const starsRef = useRef()
  // Increase to 20,000 for a dense, high-fidelity galactic canopy
  const count = 20000 

  const [positions, colors, phases] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    
    // Strictly monochromatic color palette: White, Platinum/Silver, Medium Slate, Titanium Gray, Dark Graphite (no blues or pinks)
    const themeColors = [
      new THREE.Color('#ffffff'), // Pure White
      new THREE.Color('#e2e8f0'), // Light Silver
      new THREE.Color('#8e8e93'), // Medium Slate Gray
      new THREE.Color('#555558'), // Titanium Gray
      new THREE.Color('#2c2c2e')  // Dark Graphite
    ]

    for (let i = 0; i < count; i++) {
      let x, y, z
      
      if (i < 10000) {
        // Layer A: Spiral Disc
        const r = Math.random() * 9.5 + 1.2
        const arm = Math.random() < 0.5 ? 0 : Math.PI
        const spin = r * 0.5
        const angle = arm + spin + (Math.random() - 0.5) * 0.38
        
        x = Math.cos(angle) * r
        z = Math.sin(angle) * r
        y = (Math.random() - 0.5) * 1.4 * Math.exp(-r / 3.2)
      } else {
        // Layer B: Spherical Envelope (Background stars surrounding everything)
        const r = Math.random() * 12.0 + 8.0
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
    uniforms.uTime.value = time
    if (starsRef.current) {
      // Slow, majestic spin on the tilted axis
      starsRef.current.rotation.y = time * 0.015
    }
  })

  return (
    <points ref={starsRef} rotation={[0.4, 0, 0.1]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aColor"
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

function RocketShip() {
  const meshRef = useRef()
  const texture = useTexture('/node-rocket.png')
  const [active, setActive] = useState(false)
  const startTimeRef = useRef(0)
  
  const [path, setPath] = useState({
    start: new THREE.Vector3(-6, -3, -1),
    end: new THREE.Vector3(6, 3, 1)
  })

  // Schedule flights periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Define randomized fly-by paths across the screen plane
      const paths = [
        { start: new THREE.Vector3(-7, -3.5, -1), end: new THREE.Vector3(7, 3.5, 1) },
        { start: new THREE.Vector3(7, -2.5, 0.5), end: new THREE.Vector3(-7, 2.5, -0.5) },
        { start: new THREE.Vector3(-6.5, 3.5, -1.5), end: new THREE.Vector3(6.5, -3.5, 1.5) }
      ]
      const chosen = paths[Math.floor(Math.random() * paths.length)]
      setPath(chosen)
      setActive(true)
      startTimeRef.current = -1
    }, 22000) // triggers roughly every 22 seconds
    return () => clearInterval(interval)
  }, [])

  useFrame((state) => {
    if (!active) return
    
    const time = state.clock.getElapsedTime()
    if (startTimeRef.current === -1) {
      startTimeRef.current = time
    }

    const duration = 4.5 // 4.5 seconds to glide across the viewport
    const elapsed = time - startTimeRef.current
    const progress = elapsed / duration

    if (progress >= 1.0) {
      setActive(false)
      return
    }

    if (meshRef.current) {
      meshRef.current.position.lerpVectors(path.start, path.end, progress)
      
      // Calculate travel direction in 2D projection
      const dx = path.end.x - path.start.x
      const dy = path.end.y - path.start.y
      const angle = Math.atan2(dy, dx)

      // Billboard to face the camera, and rotate on local Z to match travel direction
      meshRef.current.quaternion.copy(state.camera.quaternion)
      const localRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle - Math.PI / 2)
      meshRef.current.quaternion.multiply(localRotation)
    }
  })

  if (!active) return null

  return (
    <mesh ref={meshRef} scale={[0.42, 0.42, 1]}>
      <planeGeometry />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Scene() {
  const kRef = useRef()
  const coreMeshRef = useRef()
  const lightRef = useRef()
  const navigate = useNavigate()
  const { playTick, playClick } = useAudio()

  const nodeRefs = useRef([])
  const meshRefs = useRef([])
  const [hoveredNode, setHoveredNode] = useState(null)

  // Load the system core logo and custom node textures
  const logoTexture = useTexture('/logo-core-v5.png')
  const portfolioTexture = useTexture('/node-portfolio.png')
  const blueprintsTexture = useTexture('/node-blueprints.png')
  const playgroundTexture = useTexture('/node-playground.png')
  const contactTexture = useTexture('/node-contact.png')

  // Satellite node configuration: 4 nodes symmetrically arranged in a 90-degree cross
  const nodes = useMemo(() => [
    { label: 'PORTFOLIO', path: '/portfolio', key: 'portfolio', texture: portfolioTexture },
    { label: 'BLUEPRINTS', path: '/services', key: 'blueprints', texture: blueprintsTexture },
    { label: 'PLAYGROUND', path: '/playground', key: 'playground', texture: playgroundTexture },
    { label: "LET'S CREATE", path: '/contact', key: 'lets-create', texture: contactTexture }
  ], [portfolioTexture, blueprintsTexture, playgroundTexture, contactTexture])

  // Track the orbital angles of each node independently (spaced exactly at 90 deg / Math.PI/2 intervals)
  const initialAngles = useMemo(() => [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2], [])
  const anglesRef = useRef([...initialAngles])
  const lastTimeRef = useRef(0)

  // Single Frame Loop: updates core rotation, sweeping pointlight, and orbiting node positions/billboarding
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Initialize lastTimeRef on the first frame
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time
    }
    const delta = time - lastTimeRef.current
    lastTimeRef.current = time
    
    // Billboard central core to face the camera, and spin on its local Z-axis (vortex/turbine effect)
    if (kRef.current) {
      kRef.current.quaternion.copy(state.camera.quaternion)
    }
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.z = time * 0.15
    }

    // Rotate Spotlight sweep
    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(time * 1.5) * 2.3
      lightRef.current.position.y = Math.sin(time * 1.5) * 2.3
    }

    // Orbit & Billboard Satellite Nodes along the exact same tilted galactic plane (0.4 X, 0.1 Z)
    nodes.forEach((node, idx) => {
      const group = nodeRefs.current[idx]
      const mesh = meshRefs.current[idx]
      
      if (group) {
        // If this specific node is NOT hovered, increment its angle
        if (hoveredNode !== node.key) {
          anglesRef.current[idx] += delta * 0.035
        }
        
        const angle = anglesRef.current[idx]
        
        // Calculate responsive orbitRadius dynamically so nodes always stay on screen
        const aspect = state.size.width / state.size.height
        const orbitRadius = aspect < 1.0 ? Math.max(0.8, 1.25 * aspect) : 1.35
        
        const rawX = Math.cos(angle) * orbitRadius
        const rawY = Math.sin(angle) * orbitRadius
        
        // Rotate local disc coordinate by matched tilt angles:
        // 1. Tilt X-axis by 0.4 radians
        const y1 = rawY * Math.cos(0.4)
        const z1 = rawY * Math.sin(0.4)
        
        // 2. Tilt Z-axis by 0.1 radians
        const x2 = rawX * Math.cos(0.1) - y1 * Math.sin(0.1)
        const y2 = rawX * Math.sin(0.1) + y1 * Math.cos(0.1)
        
        group.position.set(x2, y2, z1)
        
        // Force nodes to always face the camera viewport (billboard effect)
        group.quaternion.copy(state.camera.quaternion)

        // Interpolate scale and apply cyan pulsing effect on the mesh
        if (mesh) {
          const isHovered = hoveredNode === node.key
          const targetScale = isHovered ? 1.38 : 1.05
          mesh.scale.setScalar(targetScale)

          if (mesh.material) {
            if (isHovered) {
              mesh.material.emissive.set('#bfeeff')
              mesh.material.emissiveIntensity = 0.8
            } else {
              mesh.material.emissive.set('#00f0ff')
              mesh.material.emissiveIntensity = 0.15 + 0.15 * Math.sin(time * 3.0 + idx * 1.5)
            }
          }
        }
      }
    })
  })

  const handleNodeClick = (path) => {
    playClick()
    navigate(path)
  }

  return (
    <>
      {/* Light rigging - using light cyber blue (#bfeeff) and clean white */}
      <pointLight ref={lightRef} intensity={4.0} color="#bfeeff" distance={8} />
      <pointLight position={[-3, -3, 3]} intensity={2.0} color="#ffffff" distance={10} />
      <directionalLight position={[0, 4, 4]} intensity={1.2} color="#ffffff" />

      {/* Starfield Background */}
      <Starfield />

      {/* Randomized Flying Rocket Ship */}
      <RocketShip />

      {/* Central System Core Assembly (Basic material to prevent turning black, Z-axis spin, billboarded) */}
      <group ref={kRef}>
        <mesh ref={coreMeshRef} scale={[0.45, 0.45, 1]}>
          <planeGeometry />
          <meshBasicMaterial 
            map={logoTexture} 
            transparent={true} 
            depthWrite={false} 
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Orbiting Satellite Planet Nodes */}
      {nodes.map((node, idx) => {
        const isHovered = hoveredNode === node.key
        return (
          <group 
            key={node.key}
            ref={(el) => (nodeRefs.current[idx] = el)}
          >
            {/* Node Mesh Sprite (Standard material reacting to lights) */}
            <mesh
              ref={(el) => (meshRefs.current[idx] = el)}
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
            >
              <planeGeometry />
              <meshStandardMaterial
                map={node.texture}
                transparent={true}
                depthWrite={false}
                side={THREE.DoubleSide}
                roughness={0.5}
                metalness={0.0}
              />
            </mesh>

            {/* HTML label badge (Fades in dynamically on hover, offset y = 0.45 above the node) */}
            <Html distanceFactor={6} center position={[0, 0.45, 0]}>
              <div
                onClick={() => handleNodeClick(node.path)}
                onMouseEnter={() => {
                  setHoveredNode(node.key)
                  playTick()
                }}
                onMouseLeave={() => setHoveredNode(null)}
                className={`font-mono text-[9px] px-2.5 py-0.5 rounded bg-[#050507]/95 border border-[#bfeeff]/80 text-[#bfeeff] uppercase tracking-widest transition-all duration-300 select-none cursor-pointer shadow-[0_0_12px_rgba(191,238,255,0.35)] ${
                  isHovered ? 'opacity-100 scale-105 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
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
        <ambientLight intensity={1.2} />
        
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

