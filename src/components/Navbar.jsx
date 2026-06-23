import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../context/AudioContext'

const navLinks = [
  { label: 'Core', to: '/' },
  { label: 'Showroom', to: '/portfolio' },
  { label: 'The Lab', to: '/services' },
  { label: 'Playground', to: '/playground' },
  { label: 'Story', to: '/about' }
]

export default function Navbar() {
  const { playTick, playClick } = useAudio()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Detect any scroll past 1px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 1)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ── Fixed bar ───────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(5, 5, 7, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(245, 245, 247, 0.05)' : 'none',
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Left — Logo (glowing inline SVG K Stencil) */}
          <Link 
            to="/" 
            onMouseEnter={playTick}
            className="flex items-center gap-3 shrink-0 group focus:outline-none"
          >
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 48 48" 
              fill="none" 
              className="text-[#f5f5f7] group-hover:text-[#00f0ff] transition-colors duration-300"
            >
              {/* Custom Crystalline Stencil K Path */}
              <rect x="6" y="6" width="6" height="36" rx="1.5" fill="currentColor" />
              <polygon points="12,24 34,6 40,6 18,24" fill="currentColor" />
              <polygon points="12,24 18,24 40,42 34,42" fill="currentColor" />
            </svg>
            <span className="font-['Syne'] font-black text-white text-lg tracking-tight group-hover:text-[#00f0ff] transition-colors duration-300">
              KREIDO
            </span>
          </Link>

          {/* Centre — desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onMouseEnter={playTick}
                  className={({ isActive }) =>
                    `font-mono text-xxs tracking-widest uppercase transition-colors duration-200 flex flex-col gap-1 ${
                      isActive ? 'text-[#00f0ff]' : 'text-[#8e8e93] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      <span
                        className="h-[1px] bg-[#00f0ff] transition-all duration-300"
                        style={{ width: isActive ? '100%' : '0' }}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right — Technical Contact CTA */}
          <div className="flex items-center gap-4">
            <Link
              to="/about#contact"
              onClick={playClick}
              onMouseEnter={playTick}
              className="hidden md:inline-flex items-center font-mono text-xxs tracking-widest uppercase text-white bg-transparent border border-zinc-800 hover:border-white px-5 py-2.5 rounded transition-all duration-300"
            >
              [ INTAKE_SIGNAL ]
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
              onClick={() => { playClick(); setMobileOpen(v => !v); }}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <span
                className="block w-full h-0.5 bg-white rounded transition-all duration-300 origin-center"
                style={mobileOpen ? { transform: 'translateY(7px) rotate(45deg)' } : {}}
              />
              <span
                className="block w-full h-0.5 bg-white rounded transition-all duration-300"
                style={mobileOpen ? { opacity: 0, transform: 'scaleX(0)' } : {}}
              />
              <span
                className="block w-full h-0.5 bg-white rounded transition-all duration-300 origin-center"
                style={mobileOpen ? { transform: 'translateY(-7px) rotate(-45deg)' } : {}}
              />
            </button>
          </div>

        </nav>
      </header>

      {/* ── Mobile full-screen overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.35 } }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#050507] flex flex-col items-center justify-center"
          >
            <ul className="flex flex-col items-center gap-7 mb-12">
              {navLinks.map(({ label, to }, i) => (
                <motion.li
                  key={to}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.1, duration: 0.4, ease: 'easeOut' } }}
                  exit={{ opacity: 0, y: 16, transition: { delay: (navLinks.length - 1 - i) * 0.05, duration: 0.2 } }}
                >
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `font-['Syne'] font-black text-4xl uppercase tracking-tighter transition-colors duration-200 ${
                        isActive ? 'text-[#00f0ff]' : 'text-white hover:text-[#00f0ff]'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.43, duration: 0.4 }}
            >
              <Link
                to="/about#contact"
                onClick={() => { playClick(); setMobileOpen(false); }}
                className="font-mono text-xxs tracking-widest uppercase text-zinc-950 bg-white px-8 py-3.5 rounded hover:bg-[#00f0ff] transition-all duration-300"
              >
                [ INTAKE_SIGNAL ]
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
