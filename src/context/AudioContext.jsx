import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

const AudioContext = createContext()

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem('kreido_audio_muted') === 'true'
    } catch {
      return false
    }
  })

  const audioCtxRef = useRef(null)
  const masterGainRef = useRef(null)
  const musicGainRef = useRef(null)
  const voiceGainRef = useRef(null)
  
  // Track last voice plays for cooldown state machine (1 play per 5 minutes per clip)
  const voiceCooldowns = useRef({})

  // Initialize Audio Context on first user interaction to bypass browser autoplay blocks
  const initAudio = () => {
    if (audioCtxRef.current) return

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    audioCtxRef.current = ctx

    // Setup Gain Nodes for volume control and ducking
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(isMuted ? 0 : 0.4, ctx.currentTime)
    masterGain.connect(ctx.destination)
    masterGainRef.current = masterGain

    // Secondary gain nodes
    const musicGain = ctx.createGain()
    musicGain.gain.setValueAtTime(1.0, ctx.currentTime)
    musicGain.connect(masterGain)
    musicGainRef.current = musicGain

    const voiceGain = ctx.createGain()
    voiceGain.gain.setValueAtTime(1.0, ctx.currentTime)
    voiceGain.connect(masterGain)
    voiceGainRef.current = voiceGain

  }

  // Synthesize a high-frequency glass tap ("tink") for node and button hovers
  const playTick = () => {
    initAudio()
    if (isMuted || !audioCtxRef.current) return

    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'sine'
    // Ultra high frequency sweep representing crystal glass
    osc.frequency.setValueAtTime(2800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.04)

    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1000, ctx.currentTime)

    gainNode.gain.setValueAtTime(0.015, ctx.currentTime) // Soft
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04)

    osc.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(masterGainRef.current)

    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  }

  // Synthesize a double mechanical click-clack for button clicks
  const playClick = () => {
    initAudio()
    if (isMuted || !audioCtxRef.current) return

    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    // Double short click-clack pulse
    const playClickPulse = (delay = 0, volume = 0.08) => {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(120, ctx.currentTime + delay)
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + delay + 0.015)

      gainNode.gain.setValueAtTime(volume, ctx.currentTime + delay)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.015)

      osc.connect(gainNode)
      gainNode.connect(masterGainRef.current)

      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.02)
    }

    playClickPulse(0, 0.08)
    playClickPulse(0.008, 0.05) // Second bounce
  }

  // Synthesize a low mechanical relay switch click and sweep for Developer Mode toggles
  const playToggle = () => {
    initAudio()
    if (isMuted || !audioCtxRef.current) return

    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(80, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.15) // sweep up

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)

    osc.connect(gainNode)
    gainNode.connect(masterGainRef.current)

    osc.start()
    osc.stop(ctx.currentTime + 0.2)
  }

  // Synthesize a soft glass chime chord on success
  const playSuccess = () => {
    initAudio()
    if (isMuted || !audioCtxRef.current) return

    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const chime = (freq, delay) => {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
      gainNode.gain.setValueAtTime(0.02, ctx.currentTime + delay)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.8)
      osc.connect(gainNode)
      gainNode.connect(masterGainRef.current)
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.9)
    }

    // Play major triad chimes (C6 -> E6 -> G6)
    chime(1046.5, 0)
    chime(1318.5, 0.08)
    chime(1568.0, 0.16)
  }

  // Fetch, process, and play Shaun's voice lines with custom ducking & cooldowns
  const playVoice = (clipName) => {
    initAudio()
    if (isMuted || !audioCtxRef.current) return

    const now = Date.now()
    const lastPlayed = voiceCooldowns.current[clipName] || 0
    // 5-minute cooldown (300,000 ms) to avoid spamming the audio
    if (now - lastPlayed < 300000) {
      return false // Cooldown active, show text bubble only
    }

    voiceCooldowns.current[clipName] = now

    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    // Duck the background music gain by 80% dynamically
    if (musicGainRef.current) {
      musicGainRef.current.gain.cancelScheduledValues(ctx.currentTime)
      musicGainRef.current.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.2)
    }

    // Fetch and decode the custom audio file placed in /public/audios/
    const filePath = `/audios/${clipName}.mp3`
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error(`Audio file not found: ${filePath}`)
        return res.arrayBuffer()
      })
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        const source = ctx.createBufferSource()
        source.buffer = audioBuffer

        // Create vocal processing chain
        const hpFilter = ctx.createBiquadFilter()
        hpFilter.type = 'highpass'
        hpFilter.frequency.setValueAtTime(120, ctx.currentTime) // cut low end room rumble

        const compressor = ctx.createDynamicsCompressor()
        compressor.threshold.setValueAtTime(-24, ctx.currentTime)
        compressor.knee.setValueAtTime(30, ctx.currentTime)
        compressor.ratio.setValueAtTime(12, ctx.currentTime)
        compressor.attack.setValueAtTime(0.003, ctx.currentTime)
        compressor.release.setValueAtTime(0.25, ctx.currentTime)

        source.connect(hpFilter)
        hpFilter.connect(compressor)
        compressor.connect(voiceGainRef.current)

        source.start(ctx.currentTime)

        // Restore background music gain after vocal clip completes
        source.onended = () => {
          if (musicGainRef.current) {
            musicGainRef.current.gain.cancelScheduledValues(ctx.currentTime)
            musicGainRef.current.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.5)
          }
        }
      })
      .catch((err) => {
        console.warn(`Vocal clip play failed: ${filePath}. Restoring music.`, err)
        if (musicGainRef.current) {
          musicGainRef.current.gain.cancelScheduledValues(ctx.currentTime)
          musicGainRef.current.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.1)
        }
      })

    return true // Successfully triggered audio playback
  }

  // Toggle Mute setting and store in local storage
  const toggleMute = () => {
    initAudio()
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    try {
      localStorage.setItem('kreido_audio_muted', String(nextMuted))
    } catch {}

    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime)
      masterGainRef.current.gain.linearRampToValueAtTime(nextMuted ? 0 : 0.4, audioCtxRef.current.currentTime + 0.15)
    }
  }

  // Automatically initialize Audio on mousemove or click
  useEffect(() => {
    const handleInteraction = () => {
      initAudio()
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('mousemove', handleInteraction)
    }
    window.addEventListener('click', handleInteraction)
    window.addEventListener('mousemove', handleInteraction)

    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('mousemove', handleInteraction)
    }
  }, [isMuted])

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        toggleMute,
        playTick,
        playClick,
        playToggle,
        playSuccess,
        playVoice,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
