import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  const location = useLocation()

  // Reset to 0 on every page change
  useEffect(() => {
    setProgress(0)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#00f0ff',
          transition: 'width 80ms linear',
        }}
      />
    </div>
  )
}
