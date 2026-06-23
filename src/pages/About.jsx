import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { useAudio } from '../context/AudioContext'
import Footer from '../components/Footer'

export default function About() {
  const { playTick, playClick, playSuccess } = useAudio()

  useEffect(() => {
    document.title = 'Story — Kreido'
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Learn the story behind Kreido and the Creative Engineering philosophy.'
    )
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    playSuccess()
    alert('System Signal Transmitted. Mthunzi will contact you within 24 hours.')
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col justify-center">
        {/* Prismatic ambient glow in background */}
        <div 
          className="prismatic-glow w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] opacity-10"
          style={{ 
            top: '30%', 
            right: '10%', 
            background: `radial-gradient(circle, rgba(120,75,255,0.2) 0%, rgba(0,240,255,0.1) 100%)`
          }}
        />

        <div className="relative z-10 text-center mb-16">
          <span className="tech-label">[ THE CREDENTIALS // AN AGENCY MANIFESTO ]</span>
          <h1 className="text-4xl sm:text-6xl font-black mt-4 uppercase tracking-tighter">
            Our Story
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-4 max-w-xl mx-auto">
            Kreido was founded to challenge the commodity of web builders. We do not rent layouts. We engineer assets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          
          {/* Left Column: The Manifesto (8 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="glass-panel p-8">
              {/* Silver corner pin rivets */}
              <span className="silver-pin pin-tl"></span>
              <span className="silver-pin pin-tr"></span>
              <span className="silver-pin pin-bl"></span>
              <span className="silver-pin pin-br"></span>

              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6 font-mono">[ The Formula 1 Analogy ]</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                If you want a standard car to drive to the grocery store, you buy a Toyota. That’s Wix or WordPress. It’s mass-produced, templated, and average.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                But if you want to win a Formula 1 race, you hire engineers to build a custom race car specifically optimized for the track, the tires, and the engine.
              </p>
              <blockquote className="border-l-2 border-[#00f0ff] pl-4 italic text-sm text-[#f5f5f7] font-mono py-2">
                "Wix builds Toyotas. Kreido builds Formula 1 digital assets."
              </blockquote>
            </div>

            <div className="glass-panel p-8">
              {/* Silver corner pin rivets */}
              <span className="silver-pin pin-tl"></span>
              <span className="silver-pin pin-tr"></span>
              <span className="silver-pin pin-bl"></span>
              <span className="silver-pin pin-br"></span>

              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6 font-mono">[ Renting vs. Owning ]</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                When you build on page-builders, you are a tenant renting space. You do not own the website code, and you cannot export it. If they raise their monthly prices, you must pay.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                With Kreido, you own the asset. The compiled static code is 100% portable, completely immune to standard database hacks, and hosted globally for free on high-speed serverless networks.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Terminal (5 Cols) */}
          <div id="contact" className="lg:col-span-5">
            <div className="glass-panel p-8">
              {/* Silver corner pin rivets */}
              <span className="silver-pin pin-tl"></span>
              <span className="silver-pin pin-tr"></span>
              <span className="silver-pin pin-bl"></span>
              <span className="silver-pin pin-br"></span>

              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6 font-mono">[ Contact Terminal ]</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-2">CLIENT_NAME</label>
                  <input 
                    type="text" 
                    required
                    onFocus={playTick}
                    placeholder="Enter your name"
                    className="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-xs text-white focus:outline-none focus:border-[#00f0ff] font-mono transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-2">EMAIL_ADDRESS</label>
                  <input 
                    type="email" 
                    required
                    onFocus={playTick}
                    placeholder="Enter your email"
                    className="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-xs text-white focus:outline-none focus:border-[#00f0ff] font-mono transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-2">SYSTEM_REQUIREMENTS</label>
                  <textarea 
                    rows="4"
                    required
                    onFocus={playTick}
                    placeholder="Describe your digital system vision"
                    className="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-xs text-white focus:outline-none focus:border-[#00f0ff] font-mono transition-colors duration-300"
                  />
                </div>

                <button 
                  type="submit"
                  onClick={playClick}
                  onMouseEnter={playTick}
                  className="w-full py-4 bg-[#f5f5f7] text-[#050507] font-mono font-bold text-center block rounded uppercase text-xs hover:bg-[#00f0ff] transition-all duration-300 cursor-none"
                >
                  [ Transmit Signal ]
                </button>
              </form>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </PageTransition>
  )
}
