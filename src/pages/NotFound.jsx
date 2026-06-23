import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FloatingSymbols from '../components/FloatingSymbols'

export default function NotFound() {
  useEffect(() => { document.title = '404 — Kreido' }, [])

  return (
    <div className="relative min-h-screen bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
      <FloatingSymbols />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(107,138,58,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-6"
        >
          Error
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-text font-['Syne'] font-extrabold leading-none mb-6"
          style={{ fontSize: 'clamp(6rem, 20vw, 14rem)' }}
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="font-['Syne'] font-bold text-white mb-4 text-center"
          style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
        >
          Looks like this page got lost in the void.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="font-['DM_Sans'] text-[#B3B5B0] text-lg max-w-md mx-auto mb-10 text-center"
        >
          The page you're looking for doesn't exist or may have moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#A8E8D0] text-[#1A1A1A] font-['DM_Sans'] font-semibold px-8 py-3.5 rounded hover:bg-white hover:shadow-[0_0_30px_rgba(168,232,208,0.3)] transition-all duration-300"
          >
            Back to home
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
