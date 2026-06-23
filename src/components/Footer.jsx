import React from 'react'
import { Link } from 'react-router-dom'
import { useAudio } from '../context/AudioContext'

const quickLinks = [
  { label: 'Core', to: '/' },
  { label: 'Showroom', to: '/portfolio' },
  { label: 'The Lab', to: '/services' },
  { label: 'Playground', to: '/playground' },
  { label: 'Story', to: '/about' }
]

export default function Footer() {
  const { playTick, playClick } = useAudio()

  return (
    <footer className="relative bg-[#050507] border-t border-zinc-900 mt-20 overflow-hidden">
      {/* Corner Silver Rivet Pins */}
      <span className="silver-pin pin-tl"></span>
      <span className="silver-pin pin-tr"></span>

      {/* Blueprint Grid Lines (Ambient background) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(245, 245, 247, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 245, 247, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Left Column — Brand & Stencil Logo (5 Cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" className="text-white">
                  <rect x="6" y="6" width="6" height="36" rx="1.5" fill="currentColor" />
                  <polygon points="12,24 34,6 40,6 18,24" fill="currentColor" />
                  <polygon points="12,24 18,24 40,42 34,42" fill="currentColor" />
                </svg>
                <span className="font-['Syne'] font-black text-white text-base tracking-tight">
                  KREIDO
                </span>
              </div>
              <p className="font-mono text-xxs text-[#00f0ff] uppercase tracking-widest mb-4">
                [ creative engineering studio ]
              </p>
              <p className="font-['DM_Sans'] text-sm text-[#8e8e93] leading-relaxed max-w-sm">
                We custom-code high-performance systems from scratch. No builders. Zero bloat. Sub-second load times. Built for high-fidelity clients.
              </p>
            </div>
            
            <div className="mt-8 font-mono text-[9px] text-zinc-600 tracking-wider">
              <span>CORE_ENGINE_STATUS // FULL_SYSTEM_OK</span>
            </div>
          </div>

          {/* Center Column — System Nav (3 Cols) */}
          <div className="md:col-span-3">
            <span className="font-mono text-xxs text-zinc-500 uppercase tracking-widest block mb-6">
              [ SYSTEM_CORE_NAV ]
            </span>
            <ul className="space-y-3">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={playClick}
                    onMouseEnter={playTick}
                    className="font-mono text-xxs uppercase text-[#8e8e93] hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-px bg-zinc-800 hover:bg-[#00f0ff]" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column — Intake Channels (4 Cols) */}
          <div className="md:col-span-4">
            <span className="font-mono text-xxs text-zinc-500 uppercase tracking-widest block mb-6">
              [ INTAKE_CHANNELS ]
            </span>
            <ul className="space-y-4">
              {/* Email */}
              <li className="flex flex-col">
                <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider mb-1">EMAIL_LINK</span>
                <a
                  href="mailto:info@kreido.co.za"
                  onMouseEnter={playTick}
                  className="font-['DM_Sans'] text-sm text-white hover:text-[#00f0ff] transition-colors duration-200"
                >
                  info@kreido.co.za
                </a>
              </li>

              {/* WhatsApp */}
              <li className="flex flex-col">
                <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider mb-1">DIRECT_COMMS</span>
                <a
                  href="https://wa.me/27659968015"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={playTick}
                  className="font-['DM_Sans'] text-sm text-white hover:text-[#00f0ff] transition-colors duration-200"
                >
                  +27 65 996 8015 [ WhatsApp ]
                </a>
              </li>

              {/* Location */}
              <li className="flex flex-col">
                <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider mb-1">OPERATIONS_BASE</span>
                <span className="font-['DM_Sans'] text-sm text-[#8e8e93]">
                  Pretoria, South Africa
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Micro-bar */}
        <div className="border-t border-zinc-900 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] text-zinc-600 tracking-wider">
            © {new Date().getFullYear()} KREIDO. ALL RIGHTS PORTED.
          </p>
          <p className="font-mono text-[9px] text-[#8e8e93]/30 tracking-widest uppercase">
            [ HAND-CODED IN SOUTH AFRICA ]
          </p>
        </div>

      </div>
    </footer>
  )
}
