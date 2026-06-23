import React, { createContext, useContext, useState, useEffect } from 'react'

const NavigationContext = createContext()

export function NavigationProvider({ children }) {
  const [activeTab, setActiveTabState] = useState('home')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState('forward')

  // List of valid tabs in our 3D Command Center
  const validTabs = ['home', 'showroom', 'lab', 'pitch', 'playground', 'story']

  const setActiveTab = (tab) => {
    if (!validTabs.includes(tab) || tab === activeTab || isTransitioning) return

    setTransitionDirection(validTabs.indexOf(tab) > validTabs.indexOf(activeTab) ? 'forward' : 'backward')
    setIsTransitioning(true)

    // Ultra-snappy 200ms galactic transition
    setTimeout(() => {
      setActiveTabState(tab)
    }, 100)

    setTimeout(() => {
      setIsTransitioning(false)
    }, 200)
  }

  return (
    <NavigationContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isTransitioning,
        transitionDirection,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
