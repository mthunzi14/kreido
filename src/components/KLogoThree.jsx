import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, useTexture } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../context/AudioContext'
import * as THREE from 'three'

// GPU Shaders for high-performance pulsing & drifting star particles with smooth near-camera fade and radial gradients
const vertexShader = `
  attribute vec3 aColor;
  uniform float uTime;
  uniform vec3 uCoreColor;
  uniform vec3 uOuterColor;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // Floating cosmic drift (drift positions slowly in 3D wave space)
    vec3 pos = position;
    pos.x += sin(uTime * 0.2 + aPhase) * 0.3;
    pos.y += cos(uTime * 0.15 + aPhase) * 0.3;
    pos.z += sin(uTime * 0.25 + aPhase) * 0.3;
    
    // GPU-based gradient color interpolation based on distance from center
    float dist = length(pos);
    vec3 gradientColor = mix(uCoreColor, uOuterColor, clamp(dist / 9.5, 0.0, 1.0));
    
    // Maintain the star-class variations from the original attribute color
    float intensity = 0.35 + 0.65 * ((aColor.r + aColor.g + aColor.b) / 3.0);
    vColor = gradientColor * intensity;
    
    // Twinkling pulse on GPU (unique frequency and offset per star)
    float speed = 1.0 + mod(aPhase, 1.5);
    vTwinkle = max(0.0, 0.4 + 0.6 * sin(uTime * speed + aPhase));
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Calculate distance to camera
    float cameraDist = -mvPosition.z;
    
    // Smooth near-plane camera fade-out (smooth transition from 0.4 to 1.2 distance)
    float nearFade = smoothstep(0.4, 1.2, cameraDist);
    
    // Attenuate point size by camera distance
    float sizeFactor = 0.5 + mod(aPhase * 0.1, 1.5);
    gl_PointSize = clamp((18.0 * vTwinkle * sizeFactor * nearFade) / cameraDist, 1.0, 32.0);
    
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

// GPU Shaders for volumetric Milky Way gaseous core particles
const coreVertexShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uCoreColor;
  uniform vec3 uOuterColor;
  attribute float aPhase;
  attribute float aSize;
  varying vec3 vColor;
  varying float vFade;

  void main() {
    vec3 pos = position;
    float dist = length(pos.xz);
    
    // Slow galactic core swirl rotation
    float angle = uTime * 0.04 * (1.5 / (dist + 0.8));
    float cosA = cos(angle);
    float sinA = sin(angle);
    float newX = pos.x * cosA - pos.z * sinA;
    float newZ = pos.x * sinA + pos.z * cosA;
    pos.x = newX;
    pos.z = newZ;
    
    // Color gradient mixing core & outer colors based on local distance
    vColor = mix(uCoreColor, uOuterColor, clamp(dist / 3.0, 0.0, 1.0));
    
    // Slowly pulsating gaseous transparency waves
    vFade = uIntensity * (0.35 + 0.65 * sin(uTime * 0.2 + aPhase));
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    float cameraDist = -mvPosition.z;
    
    // Calculate point size, making them larger at the center, scaled by camera distance
    gl_PointSize = clamp((aSize * 45.0 * (1.3 - dist * 0.22)) / cameraDist, 10.0, 380.0);
  }
`

const coreFragmentShader = `
  varying vec3 vColor;
  varying float vFade;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    if (dist > 0.5) {
      discard;
    }
    
    // Exponential radial decay creates a fluffy, glowing gas cloud look when points overlap
    float gasDensity = exp(-dist * 6.8);
    gl_FragColor = vec4(vColor, gasDensity * vFade * 0.18);
  }
`

const GALAXY_THEMES = {
  silver: {
    coreColor: new THREE.Color('#ffffff'),
    outerColor: new THREE.Color('#3f3f46'), // Zinc-700
    glowColor: '#ffffff',
    bgColor: '#050507',
    label: 'Silver Mono',
    accentClass: 'border-zinc-300 text-zinc-300 shadow-[0_0_10px_rgba(244,244,245,0.2)] bg-zinc-800/40'
  },
  gold: {
    coreColor: new THREE.Color('#ffe066'), // Soft premium gold
    outerColor: new THREE.Color('#92400e'), // Amber-800
    glowColor: '#eab308',
    bgColor: '#090704',
    label: 'Cosmic Gold',
    accentClass: 'border-amber-400/80 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.25)] bg-amber-950/20'
  },
  violet: {
    coreColor: new THREE.Color('#fda4af'), // Rose-300
    outerColor: new THREE.Color('#581c87'), // Purple-900
    glowColor: '#ec4899',
    bgColor: '#070408',
    label: 'Nebula Violet',
    accentClass: 'border-pink-400/80 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.25)] bg-pink-950/20'
  },
  aurora: {
    coreColor: new THREE.Color('#99f6e4'), // Teal-200
    outerColor: new THREE.Color('#1e3a8a'), // Blue-900
    glowColor: '#06b6d4',
    bgColor: '#04070a',
    label: 'Aurora Teal',
    accentClass: 'border-cyan-400/80 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)] bg-cyan-950/20'
  }
}

function Starfield({ count, coreColor, outerColor }) {
  const starsRef = useRef()

  const [positions, colors, phases] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    
    const themeColors = [
      new THREE.Color('#ffffff'), // Pure White
      new THREE.Color('#e2e8f0'), // Light Silver
      new THREE.Color('#8e8e93'), // Medium Slate Gray
      new THREE.Color('#555558'), // Titanium Gray
      new THREE.Color('#2c2c2e')  // Dark Graphite
    ]

    for (let i = 0; i < count; i++) {
      let x, y, z
      
      if (i < count / 2) {
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

      phases[i] = Math.random() * 1000.0
    }

    return [positions, colors, phases]
  }, [count])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uCoreColor: { value: new THREE.Color() },
    uOuterColor: { value: new THREE.Color() }
  }), [])

  // Update uniforms when props change
  useEffect(() => {
    uniforms.uCoreColor.value.copy(coreColor)
    uniforms.uOuterColor.value.copy(outerColor)
  }, [coreColor, outerColor, uniforms])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    uniforms.uTime.value = time
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.015
    }
  })

  return (
    <points ref={starsRef} rotation={[0.4, 0, 0.1]} key={count}>
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

function MilkyWayCore({ coreColor, outerColor, intensity }) {
  const coreRef = useRef()
  
  // Optimized core gas particle count for 360 FPS / 240 Hz performance
  const count = 1200 

  const [positions, phases, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.8) * 3.2
      const theta = Math.random() * 2.0 * Math.PI
      const phi = Math.acos(2.0 * Math.random() - 1.0)

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.25
      positions[i * 3 + 2] = r * Math.cos(phi)

      phases[i] = Math.random() * 1000.0
      sizes[i] = 1.0 + Math.random() * 3.0
    }

    return [positions, phases, sizes]
  }, [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIntensity: { value: 0 },
    uCoreColor: { value: new THREE.Color() },
    uOuterColor: { value: new THREE.Color() }
  }), [])

  // Sync uniforms
  useEffect(() => {
    uniforms.uIntensity.value = intensity
    uniforms.uCoreColor.value.copy(coreColor)
    uniforms.uOuterColor.value.copy(outerColor)
  }, [intensity, coreColor, outerColor, uniforms])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    uniforms.uTime.value = time
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.015
    }
  })

  return (
    <points ref={coreRef} rotation={[0.4, 0, 0.1]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={coreVertexShader}
        fragmentShader={coreFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Scene({ theme, coreColor, outerColor, starCount, nebulaIntensity }) {
  const kRef = useRef()
  const coreMeshRef = useRef()
  const lightRef = useRef()
  const navigate = useNavigate()
  const { playTick, playClick } = useAudio()

  const nodeRefs = useRef([])
  const meshRefs = useRef([])
  const [hoveredNode, setHoveredNode] = useState(null)
  const [coreHovered, setCoreHovered] = useState(false)

  // Load the system core logo and custom node textures
  const logoTexture = useTexture('/logo-core-v5.png?v=8')
  const portfolioTexture = useTexture('/node-portfolio.png?v=8')
  const blueprintsTexture = useTexture('/node-blueprints.png?v=8')
  const playgroundTexture = useTexture('/node-playground.png?v=8')
  const contactTexture = useTexture('/node-contact.png?v=8')

  // Shader uniforms to dynamically color the white core logo center
  const coreLogoUniforms = useMemo(() => ({
    uMap: { value: null },
    uSystemColor: { value: new THREE.Color() }
  }), [])

  // Sync core texture and theme color tinting to replace white center glow
  useEffect(() => {
    coreLogoUniforms.uMap.value = logoTexture
    if (theme === 'silver') {
      coreLogoUniforms.uSystemColor.value.set('#ffffff')
    } else {
      coreLogoUniforms.uSystemColor.value.copy(GALAXY_THEMES[theme].coreColor)
    }
  }, [theme, logoTexture, coreLogoUniforms])

  const nodes = useMemo(() => [
    { label: 'PORTFOLIO', path: '/portfolio', key: 'portfolio', texture: portfolioTexture },
    { label: 'BLUEPRINTS', path: '/services', key: 'blueprints', texture: blueprintsTexture },
    { label: 'PLAYGROUND', path: '/playground', key: 'playground', texture: playgroundTexture },
    { label: "LET'S CREATE", path: '/contact', key: 'lets-create', texture: contactTexture }
  ], [portfolioTexture, blueprintsTexture, playgroundTexture, contactTexture])

  const [initialStates] = useMemo(() => {
    const states = []
    const k = 0.04
    const R = 1.35
    const angles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]
    
    for (let i = 0; i < 4; i++) {
      const theta = angles[i]
      const pos = new THREE.Vector3(
        R * Math.cos(theta),
        R * Math.sin(theta),
        (Math.random() - 0.5) * 0.1
      )
      
      const speed = Math.sqrt(k) * R
      const vel = new THREE.Vector3(
        -speed * Math.sin(theta) + (Math.random() - 0.5) * 0.02,
        speed * Math.cos(theta) + (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      )
      states.push({ pos, vel })
    }
    return [states]
  }, [])

  const positionsRef = useRef(initialStates.map(s => s.pos.clone()))
  const velocitiesRef = useRef(initialStates.map(s => s.vel.clone()))
  const lastTimeRef = useRef(0)

  const lightColor = theme === 'silver' ? '#bfeeff' : GALAXY_THEMES[theme].glowColor

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time
    }
    const delta = Math.min(time - lastTimeRef.current, 0.1)
    lastTimeRef.current = time
    
    if (kRef.current) {
      kRef.current.quaternion.copy(state.camera.quaternion)
    }
    if (coreMeshRef.current) {
      const targetCoreScale = coreHovered ? 0.52 : 0.45
      const currentScale = coreMeshRef.current.scale.x
      const newScale = THREE.MathUtils.lerp(currentScale, targetCoreScale, 0.15)
      coreMeshRef.current.scale.set(newScale, newScale, 1)
      coreMeshRef.current.rotation.z = time * 0.15
    }

    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(time * 1.5) * 2.3
      lightRef.current.position.y = Math.sin(time * 1.5) * 2.3
    }

    nodes.forEach((node, idx) => {
      const group = nodeRefs.current[idx]
      const mesh = meshRefs.current[idx]
      
      if (group) {
        if (hoveredNode !== node.key) {
          const pos = positionsRef.current[idx]
          const vel = velocitiesRef.current[idx]
          
          const k = 0.04
          const ax = -k * pos.x
          const ay = -k * pos.y
          const az = -k * pos.z
          
          vel.x += ax * delta
          vel.y += ay * delta
          vel.z += az * delta
          
          pos.x += vel.x * delta
          pos.y += vel.y * delta
          pos.z += vel.z * delta
          
          const aspect = state.size.width / state.size.height
          const viewportHeight = 2 * Math.tan((45 * Math.PI) / 360) * 3.6
          const viewportWidth = viewportHeight * aspect
          
          const padding = 0.35
          const limitX = viewportWidth / 2 - padding
          const limitY = viewportHeight / 2 - padding
          
          if (pos.x > limitX) {
            pos.x = limitX
            vel.x = -Math.abs(vel.x)
          } else if (pos.x < -limitX) {
            pos.x = -limitX
            vel.x = Math.abs(vel.x)
          }
          
          if (pos.y > limitY) {
            pos.y = limitY
            vel.y = -Math.abs(vel.y)
          } else if (pos.y < -limitY) {
            pos.y = -limitY
            vel.y = Math.abs(vel.y)
          }
          
          group.position.copy(pos)
        } else {
          positionsRef.current[idx].copy(group.position)
        }
        
        group.quaternion.copy(state.camera.quaternion)

        if (mesh) {
          const isHovered = hoveredNode === node.key
          const targetScale = isHovered ? 0.6 : 0.45
          mesh.scale.setScalar(targetScale)

          if (mesh.material) {
            if (isHovered) {
              mesh.material.emissive.set('#ffffff')
              mesh.material.emissiveIntensity = 0.15
            } else {
              const cycle = (time + idx * 6.0) % 24.0
              let emissiveIntensity = 0.0
              if (cycle < 2.0) {
                emissiveIntensity = 0.06 * Math.sin((cycle / 2.0) * Math.PI)
              }
              mesh.material.emissive.set('#d5e2e6')
              mesh.material.emissiveIntensity = emissiveIntensity
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
      <pointLight ref={lightRef} intensity={4.0} color={lightColor} distance={8} />
      <pointLight position={[-3, -3, 3]} intensity={2.0} color="#ffffff" distance={10} />
      <directionalLight position={[0, 4, 4]} intensity={1.2} color="#ffffff" />

      {/* Starfield Background */}
      <Starfield count={starCount} coreColor={coreColor} outerColor={outerColor} />

      {/* Volumetric Milky Way Gaseous Core */}
      <MilkyWayCore coreColor={coreColor} outerColor={outerColor} intensity={nebulaIntensity} />

      {/* Central System Core Assembly */}
      <group ref={kRef}>
        <mesh 
          ref={coreMeshRef} 
          scale={[0.45, 0.45, 1]}
          onPointerOver={() => setCoreHovered(true)}
          onPointerOut={() => setCoreHovered(false)}
        >
          <planeGeometry />
          <shaderMaterial 
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform sampler2D uMap;
              uniform vec3 uSystemColor;
              varying vec2 vUv;
              void main() {
                vec4 texColor = texture2D(uMap, vUv);
                float brightness = (texColor.r + texColor.g + texColor.b) / 3.0;
                // High brightness white core detection to replace with active system color
                float whiteWeight = smoothstep(0.7, 0.98, brightness);
                vec3 finalRGB = mix(texColor.rgb, uSystemColor, whiteWeight);
                gl_FragColor = vec4(finalRGB, texColor.a);
              }
            `}
            uniforms={coreLogoUniforms}
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

            <Html distanceFactor={6} center position={[0, 0.45, 0]}>
              <div
                onClick={() => handleNodeClick(node.path)}
                onMouseEnter={() => {
                  setHoveredNode(node.key)
                  playTick()
                }}
                onMouseLeave={() => setHoveredNode(null)}
                className={`font-mono text-[9px] px-2.5 py-0.5 rounded bg-[#050507]/95 border border-zinc-700 text-[#f5f5f7] uppercase tracking-widest transition-all duration-300 select-none cursor-pointer shadow-[0_0_12px_rgba(245,245,247,0.15)] ${
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
  const [showHint, setShowHint] = useState(true)
  
  // Settings Deck States
  const [theme, setTheme] = useState('silver')
  // Default star count is 50,000
  const [starDensity, setStarDensity] = useState(50000)
  // Default gas core density is 5% (0.05)
  const [nebulaIntensity, setNebulaIntensity] = useState(0.05)
  const [deckOpen, setDeckOpen] = useState(false)
  const deckRef = useRef(null)

  // Click outside to close the configurator deck
  useEffect(() => {
    function handleClickOutside(event) {
      if (deckOpen && deckRef.current && !deckRef.current.contains(event.target)) {
        setDeckOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
    }
  }, [deckOpen])

  const activeTheme = GALAXY_THEMES[theme]

  // Dispatch custom theme change events to synchronize the global header logo
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('galaxy-theme-change', { detail: { theme } }))
  }, [theme])

  useEffect(() => {
    // Initial fade out after 7 seconds
    const initialTimer = setTimeout(() => {
      setShowHint(false)
    }, 7000)

    // Repeat every 30 seconds: pop up for 5 seconds and fade away
    const interval = setInterval(() => {
      setShowHint(true)
      setTimeout(() => {
        setShowHint(false)
      }, 5000)
    }, 30000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  // Generate dynamic classes for Drag to Explore elements based on the active theme
  const getDragHintStyles = () => {
    return "w-[144px] sm:w-[175px] h-auto object-contain transition-all duration-300 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]"
  }

  const getDragSymbolStyles = () => {
    return "w-[21px] h-[21px] sm:w-[25px] sm:h-[25px] object-contain transition-all duration-300 animate-pulse filter drop-shadow-[0_0_6px_rgba(255,255,255,0.25)] brightness-110"
  }

  return (
    <div 
      className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 transition-colors duration-1000"
      onPointerDown={() => setShowHint(false)}
      style={{ backgroundColor: activeTheme.bgColor }}
    >
      {/* Dynamic ambient radial gradient glow layer */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{ 
          background: `radial-gradient(circle at center, ${activeTheme.glowColor}0a 0%, transparent 75%)`,
          mixBlendMode: 'screen'
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 3.6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        
        <Suspense fallback={null}>
          <Scene 
            theme={theme}
            coreColor={activeTheme.coreColor} 
            outerColor={activeTheme.outerColor} 
            starCount={starDensity} 
            nebulaIntensity={nebulaIntensity} 
          />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          dampingFactor={0.05} 
          rotateSpeed={0.5}
          autoRotate={true}
          autoRotateSpeed={0.25}
        />
      </Canvas>

      {/* Floating instructional drag-hint in the bottom center */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none flex flex-col items-center gap-3.5 transition-all duration-1000 ${
          showHint ? 'opacity-95 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
        }`}
      >
        <img 
          src="/drag-hint-silver.png?v=8" 
          alt="Drag to explore KREIDO" 
          className={getDragHintStyles()}
        />
        {/* Drag Symbol (positioned below the text, rescaled and pulsing slowly) */}
        <img 
          src="/drag-symbol-silver.png?v=8" 
          alt="Drag icon" 
          className={getDragSymbolStyles()}
        />
      </div>

      {/* Collapsible Glassmorphic Interactive Control Deck using transitions.dev morphing design */}
      <div 
        ref={deckRef}
        className="t-morph shadow-[0_10px_35px_rgba(0,0,0,0.6)]" 
        data-open={deckOpen ? "true" : "false"}
        style={deckOpen ? {
          background: 'linear-gradient(135deg, rgba(39,39,42,0.98) 0%, rgba(24,24,27,0.98) 50%, rgba(9,9,11,0.98) 100%)',
          borderColor: 'rgba(161, 161, 170, 0.35)'
        } : {}}
      >
        {/* Toggle Settings Icon button (Enlarged by 20%, borderless and transparent when closed) */}
        <button 
          onClick={() => setDeckOpen(true)}
          className="t-morph-toggle-btn group pointer-events-auto"
          title="CREATOR CONFIGURATOR"
        >
          <img 
            src="/toggle-symbol-silver.png?v=8" 
            alt="Toggle Settings"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain filter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
          />
        </button>

        {/* Settings panel contents (slid-in and revealed smoothly upon expansion) */}
        <div className="t-morph-deck flex flex-col gap-4.5">
          <div className="flex justify-between items-center border-b border-zinc-700/50 pb-2">
            <span className="font-mono text-[9px] tracking-widest text-zinc-300 uppercase select-none font-bold">CREATOR CONFIGURATOR</span>
            <button 
              onClick={() => setDeckOpen(false)}
              className="text-zinc-400 hover:text-zinc-200 font-mono text-[8px] uppercase tracking-wider transition-colors duration-200 cursor-pointer"
            >
              [ Close ]
            </button>
          </div>
          
          {/* Theme selection */}
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[8px] tracking-wider text-zinc-500 uppercase select-none">Gradient Colorway</span>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(GALAXY_THEMES).map(([key, t]) => {
                const isSelected = theme === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`font-mono text-[8px] py-1.5 px-2 rounded border uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected 
                        ? 'bg-gradient-to-b from-[#18181b] to-[#27272a] border-zinc-400 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.85),0_1px_1px_rgba(255,255,255,0.12)] font-semibold' 
                        : 'bg-gradient-to-b from-[#2a2a30] to-[#161619] border-zinc-800/85 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 shadow-[0_1.5px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)]'
                    }`}
                    style={isSelected ? { borderColor: activeTheme.glowColor } : {}}
                  >
                    {isSelected && (
                      <span 
                        className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor] animate-pulse"
                        style={{ 
                          backgroundColor: activeTheme.glowColor,
                          color: activeTheme.glowColor 
                        }}
                      />
                    )}
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Nebula density */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[8px] tracking-wider text-zinc-500 uppercase select-none">Nebular Gas Core</span>
              <span className="font-mono text-[8px] text-zinc-400 select-none font-bold">{Math.round(nebulaIntensity * 100)}%</span>
            </div>
            <div className="relative flex items-center bg-zinc-950/80 border border-zinc-800/85 rounded-full px-2.5 py-1.5 h-6">
              <input 
                type="range" 
                min="0" 
                max="1.0" 
                step="0.02"
                value={nebulaIntensity} 
                onChange={(e) => setNebulaIntensity(parseFloat(e.target.value))}
                className="w-full cursor-pointer metallic-slider"
                style={{
                  accentColor: activeTheme.glowColor
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
