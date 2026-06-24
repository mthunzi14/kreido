import React, { useEffect } from 'react'
import PageTransition from '../components/PageTransition'
import { useAudio } from '../context/AudioContext'
import Footer from '../components/Footer'

export default function Contact() {
  const { playTick, playClick, playSuccess } = useAudio()

  useEffect(() => {
    document.title = "Let's Create — Kreido"
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Transmit your system requirements to Mthunzi at Kreido.'
    )
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    playSuccess()
    alert('System Request Transmitted. Mthunzi will contact you within 24 hours.')
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 max-w-lg mx-auto flex flex-col justify-center">
        {/* Prismatic ambient glow in background */}
        <div 
          className="prismatic-glow w-[300px] h-[300px] opacity-15"
          style={{ 
            top: '40%', 
            left: '50%', 
            transform: 'translateX(-50%)',
            background: `radial-gradient(circle, rgba(213,213,217,0.12) 0%, rgba(191,238,255,0.06) 100%)`
          }}
        />

        <div className="relative z-10 text-center mb-8">
          <span className="tech-label">[ CREATE TERMINAL // SYSTEM INTAKE ]</span>
          <h1 className="text-3xl sm:text-4xl font-black mt-2 uppercase tracking-tighter">
            Let's Create
          </h1>
        </div>

        <div className="glass-panel p-8 relative z-10">
          {/* Silver corner pin rivets */}
          <span className="silver-pin pin-tl"></span>
          <span className="silver-pin pin-tr"></span>
          <span className="silver-pin pin-bl"></span>
          <span className="silver-pin pin-br"></span>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-2">CLIENT_NAME</label>
              <input 
                type="text" 
                required
                onFocus={playTick}
                placeholder="Enter your name"
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-xs text-white focus:outline-none focus:border-[#bfeeff] font-mono transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-2">EMAIL_ADDRESS</label>
              <input 
                type="email" 
                required
                onFocus={playTick}
                placeholder="Enter your email"
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-xs text-white focus:outline-none focus:border-[#bfeeff] font-mono transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-2">SYSTEM_REQUIREMENTS</label>
              <textarea 
                rows="5"
                required
                onFocus={playTick}
                placeholder="Describe your digital system vision"
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-xs text-white focus:outline-none focus:border-[#bfeeff] font-mono transition-colors duration-300"
              />
            </div>

            <button 
              type="submit"
              onClick={playClick}
              onMouseEnter={playTick}
              className="w-full py-4 bg-[#f5f5f7] text-[#050507] font-mono font-bold text-center block rounded uppercase text-xs hover:bg-[#bfeeff] transition-all duration-300 cursor-none"
            >
              [ Transmit Request ]
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </PageTransition>
  )
}
