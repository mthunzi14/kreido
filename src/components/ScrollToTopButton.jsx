import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <div style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 999 }}>
          {/* Tooltip */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: 'absolute',
                  bottom: '62px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                <span
                  className="font-['DM_Sans']"
                  style={{
                    fontSize: '11px',
                    color: '#959C8A',
                    backgroundColor: '#222222',
                    border: '1px solid rgba(107,138,58,0.25)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    letterSpacing: '0.05em',
                    display: 'block',
                  }}
                >
                  Back to top
                </span>
                {/* Tooltip arrow */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid rgba(107,138,58,0.25)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            onMouseEnter={() => {
              setHovered(true)
            }}
            onMouseLeave={() => {
              setHovered(false)
            }}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#6B8A3A',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              boxShadow: hovered ? '0 0 20px rgba(168,232,208,0.3)' : 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 11l5-5 5 5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  )
}
