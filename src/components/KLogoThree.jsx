import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Module-level flag — stays true after first mount so navigating back to Home skips animation
let hasAnimatedOnce = false

export default function KLogoHero() {
  const [shouldAnimate] = useState(!hasAnimatedOnce)

  useEffect(() => {
    hasAnimatedOnce = true
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Framer Motion wrapper handles the reveal entrance (scale + opacity).
          The inner img handles the continuous rotateY spin via CSS keyframes.
          Separating these avoids transform conflicts. */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, scale: 0.5 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <img
          src="/Kreido_Logo.png"
          alt="Kreido"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            animation: 'heroLogoSpin 8s linear infinite',
          }}
        />
      </motion.div>

      <style>{`
        @keyframes heroLogoSpin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  )
}
