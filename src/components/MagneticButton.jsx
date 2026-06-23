import React, { useRef } from 'react'

/**
 * Wrapper that gives its child a subtle magnetic pull toward the cursor.
 * Max movement 8px in any direction. Snaps back smoothly on mouse leave.
 */
export default function MagneticButton({ children, style, className }) {
  const ref = useRef(null)

  const onMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    const dx   = (e.clientX - cx) * 0.35
    const dy   = (e.clientY - cy) * 0.35
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
    el.style.transition = 'transform 0.1s ease'
    el.style.transform  = `translate(${clamp(dx, -8, 8)}px, ${clamp(dy, -8, 8)}px)`
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.5s ease'
    el.style.transform  = 'translate(0, 0)'
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ display: 'inline-flex', ...style }}
      className={className}
    >
      {children}
    </span>
  )
}
