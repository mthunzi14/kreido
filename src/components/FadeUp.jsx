import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function FadeUp({ children, delay = 0, className = '' }) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: prefersReduced ? 0 : 0.7, delay: prefersReduced ? 0 : delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
