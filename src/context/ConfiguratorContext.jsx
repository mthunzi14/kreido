import React, { createContext, useContext, useState, useEffect } from 'react'

const ConfiguratorContext = createContext()

export function ConfiguratorProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('kreido_galaxy_theme') || 'silver'
    } catch {
      return 'silver'
    }
  })

  const [nebulaIntensity, setNebulaIntensity] = useState(() => {
    try {
      const saved = localStorage.getItem('kreido_nebula_intensity')
      return saved !== null ? parseFloat(saved) : 0.05
    } catch {
      return 0.05
    }
  })

  const [deckOpen, setDeckOpen] = useState(false)
  const starDensity = 70000

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem('kreido_galaxy_theme', theme)
    } catch {}
  }, [theme])

  // Persist nebula intensity
  useEffect(() => {
    try {
      localStorage.setItem('kreido_nebula_intensity', String(nebulaIntensity))
    } catch {}
  }, [nebulaIntensity])

  return (
    <ConfiguratorContext.Provider
      value={{
        theme,
        setTheme,
        nebulaIntensity,
        setNebulaIntensity,
        starDensity,
        deckOpen,
        setDeckOpen
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  )
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext)
  if (!context) {
    throw new Error('useConfigurator must be used within a ConfiguratorProvider')
  }
  return context
}
