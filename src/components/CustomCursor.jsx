import React, { useEffect, useRef } from 'react'
import { useAudio } from '../context/AudioContext'

const TRAIL_COUNT = 3

export default function CustomCursor() {
  const { playTick, playClick } = useAudio()
  const cursorRef = useRef(null)
  const trailRefs = useRef([])

  useEffect(() => {
    // Only show custom cursor on pointer devices
    if (window.matchMedia('(hover: none)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0
    let mouseY = 0

    // Trail state — each entry lags behind the previous
    const positions = Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }))

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = mouseX + 'px'
      cursor.style.top  = mouseY + 'px'
    }

    // RAF loop: interpolate trail positions toward the preceding one
    let rafId
    const animate = () => {
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const targetX = i === 0 ? mouseX : positions[i - 1].x
        const targetY = i === 0 ? mouseY : positions[i - 1].y
        const lag = 0.35 + i * 0.1          // more lag for further dots
        positions[i].x += (targetX - positions[i].x) * lag
        positions[i].y += (targetY - positions[i].y) * lag

        const el = trailRefs.current[i]
        if (el) {
          el.style.left = positions[i].x + 'px'
          el.style.top  = positions[i].y + 'px'
        }
      }
      rafId = requestAnimationFrame(animate)
    }

    animate()
    document.addEventListener('mousemove', onMouseMove)

    // Play click sound on mouse press
    const onMouseDown = () => {
      playClick()
    }
    document.addEventListener('mousedown', onMouseDown)

    // Play high-frequency tap on link hover
    const onMouseEnterLink = () => {
      cursor.classList.add('cursor-hover')
      playTick()
    }
    const onMouseLeaveLink = () => {
      cursor.classList.remove('cursor-hover')
    }

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach(el => {
        // Prevent duplicate listeners if this function is called multiple times
        el.removeEventListener('mouseenter', onMouseEnterLink)
        el.removeEventListener('mouseleave', onMouseLeaveLink)
        
        el.addEventListener('mouseenter', onMouseEnterLink)
        el.addEventListener('mouseleave', onMouseLeaveLink)
      })
    }

    addHoverListeners()

    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', onMouseDown)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [playTick, playClick])

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
      {/* Trailing echo dots — each smaller + more transparent */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={el => { trailRefs.current[i] = el }}
          className="cursor-trail"
          style={{
            width:   `${9 - i * 2.5}px`,
            height:  `${9 - i * 2.5}px`,
            opacity: 0.35 - i * 0.1,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  )
}
