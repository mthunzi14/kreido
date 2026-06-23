import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { useAudio } from '../context/AudioContext'
import { useNavigation } from '../context/NavigationContext'
import KLogoThree from '../components/KLogoThree'

export default function Home() {
  const { playTick } = useAudio()
  const { setActiveTab } = useNavigation()

  useEffect(() => {
    document.title = 'Kreido — Creative Engineering Studio'
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Kreido is a custom creative engineering studio building high-fidelity digital assets, custom web systems, and brand environments.'
    )
  }, [])

  // Nodes configuration for spatial navigation
  const nodes = [
    { label: 'SHOWROOM', path: '/portfolio', key: 'showroom', desc: 'Selected Custom Builds' },
    { label: 'THE LAB', path: '/services', key: 'lab', desc: 'System Specs & Tiers' },
    { label: 'PLAYGROUND', path: '/playground', key: 'playground', desc: 'Physics & Audio Sandbox' },
    { label: 'STORY & CONTACT', path: '/about', key: 'story', desc: 'Meet the Engineer' }
  ]

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-[#050507] overflow-hidden flex flex-col justify-center items-center px-6 pt-24 pb-12">
        {/* Prismatic glow in background */}
        <div 
          className="prismatic-glow w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] opacity-10"
          style={{ 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(120,75,255,0.3) 0%, rgba(0,240,255,0.2) 100%)' 
          }}
        />

        {/* Outer Blueprint grid lines (ambient background) */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(245, 245, 247, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 245, 247, 0.02) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Command Console (Typography) */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <span className="tech-label">[ SYSTEM CORE v1.0.4 ]</span>
            
            <h1 className="font-['Syne'] font-black text-white leading-none tracking-tighter mt-4 mb-6"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)' }}>
              KREIDO.
            </h1>

            <p className="font-mono text-[11px] text-[#8e8e93] tracking-widest uppercase mb-6">
              [ Creative Engineering Studio ]
            </p>

            <p className="font-['DM_Sans'] text-[#8e8e93] text-base leading-relaxed max-w-md mx-auto lg:mx-0 mb-10">
              We do not build templates. We engineer high-fidelity, custom-coded digital assets with zero bloat and sub-second load times.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link 
                to="/about"
                onClick={() => setActiveTab('story')}
                onMouseEnter={playTick}
                className="px-6 py-3 bg-[#f5f5f7] text-[#050507] text-xs font-mono font-bold uppercase rounded border border-transparent hover:bg-transparent hover:text-white hover:border-white transition-all duration-300"
              >
                Initiate Project
              </Link>
              <Link 
                to="/services"
                onClick={() => setActiveTab('lab')}
                onMouseEnter={playTick}
                className="px-6 py-3 bg-transparent text-[#f5f5f7] text-xs font-mono font-bold uppercase rounded border border-zinc-800 hover:border-white transition-all duration-300"
              >
                View Packages
              </Link>
            </div>
          </div>

          {/* Center Column: 3D Diamond K Canvas */}
          <div className="lg:col-span-4 h-[300px] sm:h-[400px] flex items-center justify-center relative">
            <KLogoThree />
          </div>

          {/* Right Column: Spatial Nodes Navigation */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="tech-label text-center lg:text-left mb-2">[ COMMAND_ROUTER ]</span>
            
            {nodes.map((node) => (
              <Link 
                key={node.key}
                to={node.path}
                onClick={() => setActiveTab(node.key)}
                onMouseEnter={playTick}
                className="glass-panel p-5 block group hover:translate-x-2 transition-all duration-300"
              >
                {/* Silver corner pin rivets */}
                <span className="silver-pin pin-tl"></span>
                <span className="silver-pin pin-tr"></span>
                <span className="silver-pin pin-bl"></span>
                <span className="silver-pin pin-br"></span>

                <div className="flex flex-col relative z-10">
                  <span className="font-mono text-xxs text-[#8e8e93] group-hover:text-[#00f0ff] transition-colors duration-300">
                    [ NODE_{node.key.toUpperCase()} ]
                  </span>
                  <span className="font-['Syne'] font-extrabold text-sm text-white mt-1 group-hover:tracking-wider transition-all duration-300">
                    {node.label}
                  </span>
                  <span className="font-['DM_Sans'] text-xxs text-[#8e8e93]/70 mt-1">
                    {node.desc}
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>

        {/* Micro-metrics Footer HUD */}
        <div className="w-full max-w-7xl mx-auto border-t border-zinc-900 mt-16 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 text-[10px] font-mono tracking-widest text-[#8e8e93]/50">
          <span>LATENCY: 0.12ms // BANDWIDTH: 210KB</span>
          <span>© 2026 KREIDO. ALL RIGHTS PORTED.</span>
        </div>
      </div>
    </PageTransition>
  )
}
