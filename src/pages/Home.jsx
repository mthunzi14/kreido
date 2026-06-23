import React, { useEffect } from 'react'
import PageTransition from '../components/PageTransition'
import KLogoThree from '../components/KLogoThree'

export default function Home() {
  useEffect(() => {
    document.title = 'Kreido — Creative Engineering Studio'
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Kreido is a custom creative engineering studio building high-fidelity digital assets, custom web systems, and brand environments.'
    )
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
            background: 'radial-gradient(circle, rgba(120,75,255,0.18) 0%, rgba(0,240,255,0.08) 100%)' 
          }}
        />

        {/* Outer Blueprint grid lines (ambient background) */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(245, 245, 247, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 245, 247, 0.02) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />

        {/* Full-screen 3D Canvas */}
        <div className="absolute inset-0 w-full h-full z-10">
          <KLogoThree />
        </div>
      </div>
    </PageTransition>
  )
}
