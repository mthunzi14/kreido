import React, { useEffect } from 'react'
import PageTransition from '../components/PageTransition'
import KLogoThree from '../components/KLogoThree'

export default function Home() {
  useEffect(() => {
    document.title = 'Kreido — Your Vision, Engineered.'
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Kreido is a custom creative engineering studio building high-fidelity digital assets, custom web systems, and brand environments.'
    )

    // Disable scrolling and hide scrollbars completely when Home is mounted
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      // Re-enable scrolling when unmounting
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <PageTransition>
      <div className="relative w-screen h-screen bg-[#050507] overflow-hidden">
        {/* Prismatic glow in background */}
        <div 
          className="absolute prismatic-glow w-[600px] h-[600px] sm:w-[1000px] sm:h-[1000px] opacity-10 pointer-events-none"
          style={{ 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(213,213,217,0.12) 0%, rgba(191,238,255,0.04) 100%)' 
          }}
        />

        {/* Outer Blueprint grid lines (ambient background) */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(245, 245, 247, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 245, 247, 0.02) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />

        {/* Brand Header Overlay */}
        <div className="absolute top-0 left-0 z-30 select-none cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95">
          <img 
            src="/logo-text-silver.png" 
            alt="KREIDO — Your Vision, Engineered" 
            className="w-48 sm:w-56 h-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
          />
        </div>

        {/* Full-screen 3D Canvas */}
        <div className="absolute inset-0 w-full h-full z-10">
          <KLogoThree />
        </div>
      </div>
    </PageTransition>
  )
}
