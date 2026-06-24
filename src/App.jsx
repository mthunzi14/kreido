import React from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAudio } from './context/AudioContext'

import ScrollProgressBar from './components/ScrollProgressBar'
import ScrollToTop      from './components/ScrollToTop'
import CustomCursor     from './components/CustomCursor'
import KConfigurator    from './components/KConfigurator'

import { ConfiguratorProvider } from './context/ConfiguratorContext'

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
      <KConfigurator />

      {/* Global Brand Header Logo (Top-Left Home link present on all pages) */}
      <div 
        onClick={() => { playClick(); navigate('/'); }}
        onMouseEnter={playTick}
        className="fixed top-4 left-4 sm:top-5 sm:left-5 z-50 select-none cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <img 
          src="/logo-text-silver.png?v=8" 
          alt="KREIDO — Your Vision, Engineered" 
          className="w-[132px] sm:w-[158px] h-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
        />
      </div>

      {/* Floating High-Tech Back Button (shifted right to avoid logo collision on subpages) */}
      {location.pathname !== '/' && (
        <button
          onClick={() => { playClick(); navigate('/'); }}
          onMouseEnter={playTick}
          className="fixed top-5 left-36 sm:left-40 z-50 font-mono text-[9px] uppercase tracking-widest text-[#bfeeff] bg-[#050507]/95 backdrop-blur border border-zinc-900 hover:border-[#bfeeff] hover:shadow-[0_0_12px_rgba(191,238,255,0.25)] px-4 py-2.5 rounded transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          <span>←</span> [ BACK ]
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
    <div className="min-h-screen bg-[#050507] text-white selection:bg-[#bfeeff]/20 selection:text-white">
      {children}
    </div>
  )
}

export default function App() {
  return (
    <ConfiguratorProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ConfiguratorProvider>
  )
}
