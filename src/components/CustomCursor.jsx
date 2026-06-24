import React, { useEffect, useRef } from 'react'
import { useAudio } from '../context/AudioContext'

export default function CustomCursor() {
  const { playTick, playClick } = useAudio()
  const cursorRef = useRef(null)

  useEffect(() => {
    // Only show custom cursor on pointer devices
    if (window.matchMedia('(hover: none)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    const onMouseMove = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
    }

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
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, canvas, [onClick]').forEach(el => {
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
      observer.disconnect()
    }
  }, [playTick, playClick])

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
}
