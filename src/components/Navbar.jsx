import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home',      to: '/' },
  { label: 'Services',  to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'About',     to: '/about' },
  { label: 'Contact',   to: '/contact' },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
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

  // Lock body scroll when mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* ── Fixed bar ───────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(26,26,26,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '0.5px solid rgba(107,138,58,0.5)' : 'none',
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Left — logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/Kreido_Logo.png"
              alt="Kreido"
              style={{ maxHeight: '44px', width: 'auto', display: 'block', animation: 'logoSpin 8s linear infinite' }}
            />
            <span className="kreido-name">Kreido</span>
          </Link>

          {/* Centre — desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, to }) => (
              <li key={to} className="nav-link-item">
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `font-['DM_Sans'] text-sm font-medium tracking-wide transition-colors duration-200 flex flex-col gap-0.5 ${
                      isActive ? 'text-white' : 'text-[#B3B5B0] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      <span
                        className="nav-underline block h-px bg-[#A8E8D0] transition-all duration-300"
                        style={{ width: isActive ? '100%' : '0' }}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right — CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center font-['DM_Sans'] font-medium text-sm text-[#1A1A1A] bg-[#A8E8D0] px-6 py-2.5 rounded-full hover:bg-[#8FD9BC] transition-all duration-300"
            >
              Let's talk
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
              onClick={() => setMobileOpen(v => !v)}
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
            className="fixed inset-0 z-40 bg-[#1A1A1A] flex flex-col items-center justify-center"
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
                      `font-['Syne'] font-bold text-4xl transition-colors duration-200 ${
                        isActive ? 'text-[#A8E8D0]' : 'text-white hover:text-[#A8E8D0]'
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
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="font-['DM_Sans'] font-semibold text-[#1A1A1A] bg-[#A8E8D0] px-10 py-4 rounded-full text-base hover:bg-white transition-all duration-300"
              >
                Let's talk
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
