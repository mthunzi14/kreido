import React, { useRef, useEffect } from 'react'
import { useConfigurator } from '../context/ConfiguratorContext'

const GALAXY_THEMES = {
  silver: { label: 'Silver Mono', glowColor: '#ffffff' },
  gold: { label: 'Cosmic Gold', glowColor: '#eab308' },
  violet: { label: 'Nebula Violet', glowColor: '#ec4899' },
  aurora: { label: 'Aurora Teal', glowColor: '#06b6d4' }
}

export default function KConfigurator() {
  const { theme, setTheme, nebulaIntensity, setNebulaIntensity, deckOpen, setDeckOpen } = useConfigurator()
  const deckRef = useRef(null)

  const activeTheme = GALAXY_THEMES[theme]

  // Dispatch custom theme change events to synchronize the global header logo
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('galaxy-theme-change', { detail: { theme } }))
  }, [theme])

  // Click outside to close the configurator deck
  useEffect(() => {
    function handleClickOutside(event) {
      if (deckOpen && deckRef.current && !deckRef.current.contains(event.target)) {
        setDeckOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
    }
  }, [deckOpen, setDeckOpen])

  return (
    <div 
      ref={deckRef}
      className="t-morph shadow-[0_10px_35px_rgba(0,0,0,0.6)]" 
      data-open={deckOpen ? "true" : "false"}
      style={deckOpen ? {
        background: 'linear-gradient(135deg, rgba(39,39,42,0.98) 0%, rgba(24,24,27,0.98) 50%, rgba(9,9,11,0.98) 100%)',
        borderColor: 'rgba(161, 161, 170, 0.35)'
      } : {}}
    >
      {/* Toggle Settings Icon button (Enlarged, borderless and transparent when closed, shrunk by 10%) */}
      <button 
        onClick={() => setDeckOpen(true)}
        className="t-morph-toggle-btn group pointer-events-auto"
        title="KREIDO CONFIGURATOR"
      >
        <img 
          src="/toggle-symbol-silver.png?v=8" 
          alt="Toggle Settings"
          className="w-9 h-9 sm:w-10 sm:h-10 object-contain filter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
        />
      </button>

      {/* Settings panel contents (slid-in and revealed smoothly upon expansion) */}
      <div className="t-morph-deck flex flex-col gap-4.5">
        <div className="flex justify-between items-center border-b border-zinc-700/50 pb-2">
          <span className="font-mono text-[9px] tracking-widest text-zinc-300 uppercase select-none font-bold">KREIDO CONFIGURATOR</span>
          <button 
            onClick={() => setDeckOpen(false)}
            className="text-zinc-400 hover:text-zinc-200 font-mono text-[8px] uppercase tracking-wider transition-colors duration-200 cursor-pointer"
          >
            [ Close ]
          </button>
        </div>
        
        {/* Theme selection */}
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[8px] tracking-wider text-zinc-500 uppercase select-none">Gradient Colorway</span>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(GALAXY_THEMES).map(([key, t]) => {
              const isSelected = theme === key;
              return (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`font-mono text-[8px] py-1.5 px-2 rounded border uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected 
                      ? 'bg-gradient-to-b from-[#18181b] to-[#27272a] border-zinc-400 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.85),0_1px_1px_rgba(255,255,255,0.12)] font-semibold' 
                      : 'bg-gradient-to-b from-[#2a2a30] to-[#161619] border-zinc-800/85 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 shadow-[0_1.5px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)]'
                  }`}
                  style={isSelected ? { borderColor: activeTheme.glowColor } : {}}
                >
                  {isSelected && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor] animate-pulse"
                      style={{ 
                        backgroundColor: activeTheme.glowColor,
                        color: activeTheme.glowColor 
                      }}
                    />
                  )}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Nebula density */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[8px] tracking-wider text-zinc-500 uppercase select-none">Nebular Gas Core</span>
            <span className="font-mono text-[8px] text-zinc-400 select-none font-bold">{Math.round(nebulaIntensity * 100)}%</span>
          </div>
          <div className="relative flex items-center bg-zinc-950/80 border border-zinc-800/85 rounded-full px-2.5 py-1.5 h-6">
            <input 
              type="range" 
              min="0" 
              max="1.0" 
              step="0.02"
              value={nebulaIntensity} 
              onChange={(e) => setNebulaIntensity(parseFloat(e.target.value))}
              className="w-full cursor-pointer metallic-slider"
              style={{
                accentColor: activeTheme.glowColor
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
