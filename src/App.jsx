import React from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAudio } from './context/AudioContext'

import ScrollProgressBar from './components/ScrollProgressBar'
import ScrollToTop      from './components/ScrollToTop'
import CustomCursor     from './components/CustomCursor'

import Home      from './pages/Home'
import Services  from './pages/Services'
import Portfolio from './pages/Portfolio'
import About     from './pages/About'
import Contact   from './pages/Contact'
import Playground from './pages/Playground'
import NotFound  from './pages/NotFound'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<Home />}      />
        <Route path="/services"  element={<Services />}  />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/about"     element={<About />}     />
        <Route path="/contact"   element={<Contact />}   />
        <Route path="/playground" element={<Playground />} />
        <Route path="*"          element={<NotFound />}  />
      </Routes>
    </AnimatePresence>
  )
}

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { playClick, playTick } = useAudio()

  return (
    <>
      {location.pathname !== '/' && <ScrollProgressBar />}
      <ScrollToTop />
      <CustomCursor />

      {/* Floating High-Tech Back Button (replacing navbar on subpages) */}
      {location.pathname !== '/' && (
        <button
          onClick={() => { playClick(); navigate('/'); }}
          onMouseEnter={playTick}
          className="fixed top-6 left-6 z-50 font-mono text-[9px] uppercase tracking-widest text-[#00f0ff] bg-[#050507]/90 backdrop-blur border border-zinc-900 hover:border-[#00f0ff] hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] px-4 py-2.5 rounded transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          <span>←</span> [ BACK_TO_CORE ]
        </button>
      )}

      <main>
        <AppContentLayout>
          <AnimatedRoutes />
        </AppContentLayout>
      </main>
    </>
  )
}

// Layout wrapper to inject min-height and handle general page layout
function AppContentLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-[#00f0ff]/20 selection:text-white">
      {children}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
