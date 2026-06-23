import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem('kreido_loaded')
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => {
      setShow(false)
      try { sessionStorage.setItem('kreido_loaded', '1') } catch {}
    }, 1500)
    return () => clearTimeout(timer)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          <img
            src="/Kreido_Logo.png"
            alt="Kreido"
            style={{
              width: '72px',
              height: 'auto',
              animation: 'logoSpin 1s linear infinite',
            }}
          />
          {/* Mint progress bar */}
          <div style={{
            width: '160px',
            height: '2px',
            background: 'rgba(168,232,208,0.12)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ height: '100%', background: '#A8E8D0', borderRadius: '2px' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
