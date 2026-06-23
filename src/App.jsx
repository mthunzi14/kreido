import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Navbar           from './components/Navbar'
import Footer           from './components/Footer'
import CustomCursor     from './components/CustomCursor'
import ScrollProgressBar from './components/ScrollProgressBar'
import WhatsAppButton   from './components/WhatsAppButton'
import ScrollToTop      from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'
import FloatingActionBar from './components/FloatingActionBar'
import Preloader        from './components/Preloader'

import Home      from './pages/Home'
import Services  from './pages/Services'
import Portfolio from './pages/Portfolio'
import About     from './pages/About'
import Contact   from './pages/Contact'
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
        <Route path="*"          element={<NotFound />}  />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Preloader />
      {/* Progress bar must be inside BrowserRouter for useLocation */}
      <ScrollProgressBar />
      <ScrollToTop />
      <CustomCursor />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTopButton />
      <FloatingActionBar />
    </BrowserRouter>
  )
}
