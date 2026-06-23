import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { useAudio } from '../context/AudioContext'
import Footer from '../components/Footer'

export default function Playground() {
  const { playTick, playToggle } = useAudio()
  
  // Playground state parameters
  const [gravity, setGravity] = useState(50)
  const [dispersion, setDispersion] = useState(30)
  const [hudActive, setHudActive] = useState(false)
  const [developerMode, setDeveloperMode] = useState(false)

  // Web Audio Synth pad interaction
  const handleSynthPad = (e) => {
    // Basic synth trigger for demo
    playTick()
  }

  const toggleDevMode = () => {
    playToggle()
    const nextMode = !developerMode
    setDeveloperMode(nextMode)
    if (nextMode) {
      document.body.classList.add('developer-mode')
    } else {
      document.body.classList.remove('developer-mode')
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col justify-center">
        {/* Prismatic ambient glow in background */}
        <div 
          className="prismatic-glow w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] opacity-15"
          style={{ 
            top: '20%', 
            left: '30%', 
            background: `radial-gradient(circle, rgba(255, 60, 172, 0.4) 0%, rgba(0, 240, 255, 0.3) 100%)`
          }}
        />

        <div className="relative z-10 text-center mb-16">
          <span className="tech-label">[ SYSTEM PLAYGROUND // STENCIL CORE ]</span>
          <h1 className="text-4xl sm:text-6xl font-black mt-4 uppercase tracking-tighter">
            Creative Physics Lab
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-4 max-w-xl mx-auto">
            Interact directly with the layout mechanics, modify render physics, and trigger sound synthesis nodes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Controllers Panel */}
          <div className="glass-panel p-8">
            <span className="silver-pin pin-tl"></span>
            <span className="silver-pin pin-tr"></span>
            <span className="silver-pin pin-bl"></span>
            <span className="silver-pin pin-br"></span>

            <h3 className="text-xl font-bold uppercase tracking-wider mb-8 font-mono">
              [ Parameters HUD ]
            </h3>

            {/* Slider 1: Particle Gravity */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2 font-mono text-xs text-zinc-500">
                <span>GRAVITY_SCALE</span>
                <span className="text-white">{gravity}m/s²</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={gravity}
                onChange={(e) => { setGravity(e.target.value); playTick(); }}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#f5f5f7]"
              />
            </div>

            {/* Slider 2: Chromatic Dispersion */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2 font-mono text-xs text-zinc-500">
                <span>CHROMATIC_DISPERSION</span>
                <span className="text-white">{dispersion}px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={dispersion}
                onChange={(e) => { setDispersion(e.target.value); playTick(); }}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#f5f5f7]"
              />
            </div>

            {/* Toggle: Developer Outlines */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-zinc-500">XRAY_DEVELOPER_MODE</span>
                <span className="text-xs text-zinc-400 mt-1">Expose technical structural boundaries</span>
              </div>
              <button 
                onClick={toggleDevMode}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${developerMode ? 'bg-[#00f0ff]' : 'bg-zinc-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${developerMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Interactive Pad Panel */}
          <div className="glass-panel p-8 flex flex-col justify-between">
            <span className="silver-pin pin-tl"></span>
            <span className="silver-pin pin-tr"></span>
            <span className="silver-pin pin-bl"></span>
            <span className="silver-pin pin-br"></span>

            <div className="mb-6">
              <h3 className="text-xl font-bold uppercase tracking-wider font-mono">
                [ Web Audio Synth Pad ]
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Drag your cursor over the grid below to modulate pitch and frequency in real-time
              </p>
            </div>

            {/* The Interactive Grid Area */}
            <div 
              onMouseMove={handleSynthPad}
              className="w-full aspect-[4/3] rounded border border-zinc-800 flex items-center justify-center relative cursor-crosshair overflow-hidden group hover:border-[#00f0ff]/30 transition-all duration-300"
              style={{
                backgroundImage: `linear-gradient(rgba(245, 245, 247, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 245, 247, 0.03) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="absolute inset-0 bg-[#00f0ff]/0 group-hover:bg-[#00f0ff]/2 transition-all duration-300" />
              <span className="font-mono text-[10px] text-zinc-600 tracking-wider select-none pointer-events-none group-hover:text-[#00f0ff] transition-colors duration-300">
                [ ACTIVE AUDIO SYNTH ZONE ]
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  )
}
