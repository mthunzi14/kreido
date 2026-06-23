import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import FadeUp from '../components/FadeUp'
import ParticleBackground from '../components/ParticleBackground'
import KLogoThree from '../components/KLogoThree'
import FloatingSymbols from '../components/FloatingSymbols'
import MagneticButton from '../components/MagneticButton'

// ─── Service preview data ──────────────────────────────────────────────────────
const previewServices = [
  {
    id: 1,
    name: 'Website Design & Development',
    desc: 'Fully custom websites — business sites, portfolios, e-commerce and booking platforms built to perform and convert.',
    anchor: 'web',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Logo Design & Brand Identity',
    desc: 'Complete brand identity systems — logos, colour palettes, typography and brand guidelines that set you apart.',
    anchor: 'brand',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Social Media Content Creation',
    desc: 'Scroll-stopping posts, stories and reels covers for Instagram, Facebook and TikTok — designed and delivered monthly.',
    anchor: 'social',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Social Media Management',
    desc: 'Full monthly management — content creation, scheduling, engagement and growth strategy, all handled for you.',
    anchor: 'social',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
]

// ─── Value props ────────────────────────────────────────────────────────────────
const valueProps = [
  {
    title: 'Quality first',
    desc: 'We never ship mediocre. Every pixel, every line of code is held to the highest standard.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    title: 'Vision-driven',
    desc: 'Your idea is the north star. We build around your vision, not a generic template.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
  },
  {
    title: 'Forward thinking',
    desc: 'Technology moves fast. We stay ahead so the solutions we build scale with tomorrow.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: 'Real results',
    desc: 'We measure success by your outcomes — more clients, stronger brand, faster growth.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
]

// ─── Animated stats counter ────────────────────────────────────────────────────
function StatCounter({ number, suffix, label, sub, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const start = performance.now()
    let rafId

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(number * eased))
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setCount(number)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isInView, number])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className="stat-item text-center px-6 py-6 cursor-default select-none"
    >
      <p className="font-['Syne'] font-black text-white mb-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.25rem)' }}>
        {count}{suffix}
      </p>
      <p className="font-['DM_Sans'] text-[#959C8A] font-semibold text-sm mb-1 uppercase tracking-widest">{label}</p>
      <p className="font-['DM_Sans'] text-[#959C8A]/70 text-xs">{sub}</p>
      <span className="stat-underline" />
    </motion.div>
  )
}

// ─── Typewriter headline — gradient reveals on completion ──────────────────────
const LINES = ['Vision,', 'engineered.']
const TYPING_MS = LINES.join('\n').length * 55 // ~1045ms — used to sequence post-typewriter animations

function TypewriterHeadline({ startDelay = 0 }) {
  const fullText = LINES.join('\n')
  const [displayed, setDisplayed]   = useState('')
  const [showCursor, setShowCursor] = useState(false)
  const [typingDone, setTypingDone] = useState(false)

  useEffect(() => {
    let intervalId
    const delayTimer = setTimeout(() => {
      setShowCursor(true)
      let i = 0
      intervalId = setInterval(() => {
        i++
        setDisplayed(fullText.slice(0, i))
        if (i >= fullText.length) {
          clearInterval(intervalId)
          setTypingDone(true)
          setTimeout(() => setShowCursor(false), 2000)
        }
      }, 55)
    }, startDelay)
    return () => {
      clearTimeout(delayTimer)
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  const parts = displayed.split('\n')

  return (
    <h1
      className="font-['Syne'] font-extrabold text-white leading-[1.05] mb-6"
      style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
    >
      {parts[0]}
      {parts.length > 1 && (
        <>
          <br />
          {/* Two overlapping spans — white fades out, gradient fades in */}
          <span style={{ position: 'relative', display: 'inline' }}>
            {/* Base white — visible during typing, fades when done */}
            <span
              aria-hidden={typingDone ? 'true' : undefined}
              style={{
                color: '#ffffff',
                opacity: typingDone ? 0 : 1,
                transition: 'opacity 0.6s ease',
                display: 'inline',
              }}
            >
              {parts[1]}
            </span>
            {/* Gradient overlay — fades in when typing completes */}
            <span
              className="gradient-text"
              aria-hidden={typingDone ? undefined : 'true'}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: typingDone ? 1 : 0,
                transition: 'opacity 0.6s ease',
              }}
            >
              {parts[1]}
            </span>
          </span>
        </>
      )}
      {showCursor && (
        <span style={{ animation: 'cursorBlink 0.8s step-start infinite', color: '#A8E8D0' }}>|</span>
      )}
    </h1>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  // Sync with preloader: on first visit delay hero until preloader fully disappears
  const isFirstVisit = (() => {
    try { return !sessionStorage.getItem('kreido_loaded') } catch { return false }
  })()
  const heroOffsetMs = isFirstVisit ? 2400 : 0   // 1500ms display + 600ms fade + 300ms buffer
  const heroOffsetS  = heroOffsetMs / 1000

  useEffect(() => {
    document.title = 'Kreido — Vision, engineered.'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Kreido is a premium digital solutions studio offering web development, brand design, graphic design and social media content creation. Vision, engineered.')
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Kreido — Vision, engineered.')
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'Premium digital solutions for anyone with a vision. Web development, brand design, graphic design and social media.')
  }, [])

  return (
    <PageTransition>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#1A1A1A] pt-20">
        <ParticleBackground />
        <FloatingSymbols />

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(107,138,58,0.08) 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 40% 60% at 0% 50%, rgba(168,232,208,0.05) 0%, transparent 65%)' }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left — copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: heroOffsetS }}
              className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-5"
            >
              Kreido
            </motion.p>

            <TypewriterHeadline startDelay={heroOffsetMs} />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: heroOffsetS + TYPING_MS / 1000 + 0.2 }}
              className="font-['DM_Sans'] text-[#B3B5B0] text-lg leading-relaxed max-w-lg mb-10"
            >
              Premium digital solutions — websites, branding, design, social media and more. For anyone with a vision and a budget.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: heroOffsetS + TYPING_MS / 1000 + 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-[#A8E8D0] text-[#1A1A1A] font-['DM_Sans'] font-semibold px-7 py-3.5 rounded hover:bg-white hover:shadow-[0_0_30px_rgba(168,232,208,0.3)] transition-all duration-300"
                >
                  Start a project
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 border border-[#6B8A3A] text-[#B3B5B0] font-['DM_Sans'] font-medium px-7 py-3.5 rounded hover:border-[#A8E8D0] hover:text-white transition-all duration-300"
                >
                  View our work
                </Link>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right — spinning logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: heroOffsetS + 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-72 sm:h-96 lg:h-[500px]"
          >
            <KLogoThree />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: heroOffsetS + TYPING_MS / 1000 + 0.8 }}
          onClick={() => document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 bg-transparent border-none outline-none cursor-pointer"
          aria-label="Scroll to next section"
        >
          <span className="font-['DM_Sans'] text-[10px] tracking-[0.25em] uppercase text-[#959C8A]">Scroll</span>
          <svg
            width="18" height="18" viewBox="0 0 18 18" fill="none"
            style={{ animation: 'chevronBounce 1.5s ease-in-out infinite', color: '#A8E8D0' }}
          >
            <path d="M3 6l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </section>

      {/* ── MARQUEE TICKER ───────────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-[#161616]" style={{ borderTop: '1px solid rgba(107,138,58,0.3)', borderBottom: '1px solid rgba(107,138,58,0.3)' }}>
        <div className="marquee-track py-3">
          {[0, 1].map(copy => (
            <span key={copy} className="inline-flex items-center gap-0 shrink-0" aria-hidden={copy === 1 ? 'true' : undefined}>
              {['Web Development', 'Brand Design', 'Graphic Design', 'Social Media Content', 'Premium Solutions', 'Vision, Engineered', 'Based in Pretoria', 'kreido.co.za'].map((item, i) => (
                <span key={i} className="inline-flex items-center">
                  <span className="font-['DM_Sans'] text-xs font-medium tracking-[0.2em] uppercase text-[#959C8A] px-6">
                    {item}
                  </span>
                  <span className="text-[#A8E8D0] text-xs select-none">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="section-divider" />

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <section id="stats-section" className="bg-[#1e1e1e] border-y border-[#6B8A3A]/20">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y-2 lg:divide-y-0 lg:divide-x divide-[#6B8A3A]/30">
            <StatCounter number={100} suffix="%" label="Custom Builds"    sub="Zero templates, ever."     delay={0}   />
            <StatCounter number={24}  suffix="hr" label="Response Time"   sub="On every enquiry."         delay={0.1} />
            <StatCounter number={2}   suffix=""   label="Live Projects"   sub="And growing fast."          delay={0.2} />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="stat-item text-center px-6 py-6 cursor-default select-none"
            >
              <p className="font-['Syne'] font-black text-white mb-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.25rem)' }}>∞</p>
              <p className="font-['DM_Sans'] text-[#959C8A] font-semibold text-sm mb-1 uppercase tracking-widest">Vision Potential</p>
              <p className="font-['DM_Sans'] text-[#959C8A]/70 text-xs">Yours is waiting.</p>
              <span className="stat-underline" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="section-divider" />

      {/* ── SERVICES PREVIEW ─────────────────────────────────────────────────── */}
      <section className="section-padding bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4 text-center">
              Our services
            </p>
            <h2 className="font-['Syne'] font-bold text-white text-center mb-10"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              What we do
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {previewServices.map((s, i) => (
              <FadeUp key={s.id} delay={i * 0.1}>
                <div className="glass-service-card group rounded-lg p-7 relative overflow-hidden">
                  <div className="text-[#6B8A3A] mb-4"><span className="icon-spin-wrapper">{s.icon}</span></div>
                  <h3 className="font-['Syne'] font-bold text-white text-xl mb-3">{s.name}</h3>
                  <p className="font-['DM_Sans'] text-[#B3B5B0] text-sm leading-relaxed mb-5">{s.desc}</p>
                  <Link to={`/services#${s.anchor}`} className="learn-more-btn">
                    Learn more
                    <svg className="learn-more-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp className="text-center mt-12">
            <MagneticButton>
              <Link to="/services" className="btn-pill-outline">
                View all services
              </Link>
            </MagneticButton>
          </FadeUp>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="section-divider" />

      {/* ── PORTFOLIO PREVIEW ─────────────────────────────────────────────────── */}
      <section className="section-content-gap bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4 text-center">
              Selected work
            </p>
            <h2 className="font-['Syne'] font-bold text-white text-center mb-10"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Our work
            </h2>
          </FadeUp>

          {/* Single Kenala Health Hub card — real screenshot */}
          <FadeUp delay={0.1}>
            <div className="group max-w-xl mx-auto bg-[#222222] rounded-lg overflow-hidden service-card-glow hover:-translate-y-1 transition-all duration-300 mb-6">
              {/* Real screenshot thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden kenala-thumb-bg">
                <img
                  src="/Kenala%20Health%20Hub%20Screenshot.png"
                  alt="Kenala Health Hub website screenshot"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{ maxWidth: '800px' }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#6B8A3A]/0 group-hover:bg-[#6B8A3A]/75 transition-all duration-300 flex items-center justify-center">
                  <a
                    href="https://kenalahealthhub.co.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 font-['DM_Sans'] font-semibold text-white text-sm tracking-wide border border-white/60 px-5 py-2.5 rounded hover:bg-white/10"
                  >
                    View project
                  </a>
                </div>
              </div>
              <div className="p-5">
                <span className="font-['DM_Sans'] text-xs tracking-widest uppercase text-[#6B8A3A] mb-2 block">
                  Web Development
                </span>
                <h3 className="font-['Syne'] font-bold text-white text-lg mb-2">Kenala Health Hub</h3>
                <p className="font-['DM_Sans'] text-[#B3B5B0] text-sm leading-relaxed mb-4">
                  A premium health and wellness platform for Kenala Health Hub — designed and built from the ground up.
                </p>
                <a
                  href="https://kenalahealthhub.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#A8E8D0] font-['DM_Sans'] text-sm font-medium hover:text-white transition-colors duration-200"
                >
                  View project
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </FadeUp>

          {/* More projects coming soon */}
          <FadeUp delay={0.15}>
            <div className="relative rounded-lg overflow-hidden border border-[#A8E8D0]/20 bg-[#1e1e1e]" style={{ minHeight: '200px' }}>
              <FloatingSymbols />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(168,232,208,0.04) 0%, transparent 70%)' }}
              />
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-14">
                <div className="w-8 h-px bg-[#A8E8D0]/30 mb-5" />
                <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-3">
                  More coming
                </p>
                <h3 className="font-['Syne'] font-bold text-white mb-3" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}>
                  More projects coming soon
                </h3>
                <p className="font-['DM_Sans'] text-[#B3B5B0] text-sm leading-relaxed" style={{ maxWidth: '460px' }}>
                  Exciting new projects in the works. Check back soon.
                </p>
                <div className="w-8 h-px bg-[#A8E8D0]/30 mt-5" />
              </div>
            </div>
          </FadeUp>

          <FadeUp className="text-center mt-10">
            <MagneticButton>
              <Link to="/portfolio" className="btn-pill-outline">
                View all work
              </Link>
            </MagneticButton>
          </FadeUp>
        </div>
      </section>

      {/* ── WHY KREIDO ────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4 text-center">
              Why choose us
            </p>
            <h2 className="font-['Syne'] font-bold text-white text-center mb-10"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              What sets us apart
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valueProps.map((v, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-[#222222] rounded-lg p-6 h-full border border-[#6B8A3A]/0 hover:border-[#6B8A3A]/30 service-card-glow transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-[#A8E8D0]/10 flex items-center justify-center text-[#A8E8D0] mb-4">
                    {v.icon}
                  </div>
                  <h3 className="font-['Syne'] font-bold text-white text-base mb-2">{v.title}</h3>
                  <p className="font-['DM_Sans'] text-[#B3B5B0] text-sm leading-relaxed">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="section-divider" />

      {/* ── HOW WE WORK ───────────────────────────────────────────────────────── */}
      <section className="section-padding bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4 text-center">
              The process
            </p>
            <h2 className="font-['Syne'] font-bold text-white text-center mb-14"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              How we bring your vision to life
            </h2>
          </FadeUp>

          {/* Steps — horizontal on desktop, vertical on mobile */}
          <div className="flex flex-col lg:flex-row items-start gap-0">
            {[
              { num: '01', title: 'Discovery',  desc: 'We learn your business, goals and vision inside out.' },
              { num: '02', title: 'Strategy',   desc: 'We map out the solution before writing a single line of code.' },
              { num: '03', title: 'Build',      desc: 'We design and develop your solution to premium standard.' },
              { num: '04', title: 'Refine',     desc: 'You review, we refine. Until it\'s exactly right.' },
              { num: '05', title: 'Launch',     desc: 'We go live and hand over everything with full support.' },
            ].map((step, i) => (
              <React.Fragment key={step.num}>
                <FadeUp delay={i * 0.1} className="flex-1 flex flex-col items-center text-center px-4 mb-8 lg:mb-0">
                  <div className="w-10 h-10 rounded-full border border-[#6B8A3A]/50 flex items-center justify-center text-[#A8E8D0] font-['DM_Sans'] text-xs font-bold mb-4 relative z-10 bg-[#1e1e1e] shrink-0">
                    {step.num}
                  </div>
                  <h3 className="font-['Syne'] font-bold text-white text-base mb-2">{step.title}</h3>
                  <p className="font-['DM_Sans'] text-[#959C8A] text-sm leading-relaxed max-w-[160px]">{step.desc}</p>
                </FadeUp>
                {i < 4 && <div className="process-connector hidden lg:block shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="section-divider" />

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────────── */}
      <section className="section-padding bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4 text-center">
              Client feedback
            </p>
            <h2 className="font-['Syne'] font-bold text-white text-center mb-12"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              What our clients say
            </h2>
          </FadeUp>

          {/* TODO: Replace with real client testimonials */}
          <FadeUp delay={0.1}>
            <div className="max-w-2xl mx-auto glass-service-card rounded-xl p-10 relative">
              <div
                className="absolute top-8 left-10 font-serif text-[#A8E8D0] select-none pointer-events-none"
                style={{ fontSize: '5rem', lineHeight: 1, opacity: 0.15 }}
                aria-hidden="true"
              >
                "
              </div>
              <div className="relative z-10">
                <p className="font-['DM_Sans'] text-[#B3B5B0] text-lg leading-relaxed mb-8 italic">
                  "Working with Kreido transformed our online presence completely. Professional, fast and the results exceeded every expectation."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-[#A8E8D0]/40" />
                  <p className="font-['DM_Sans'] text-[#A8E8D0] text-sm font-medium tracking-wide">
                    Kenala Health Hub · Web Development Client
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="section-divider" />

      {/* ── CTA BANNER ────────────────────────────────────────────────────────── */}
      <section className="bg-[#1e1e1e] border-t border-[#6B8A3A]/40">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <FadeUp>
            <h2 className="font-['Syne'] font-extrabold text-white mb-5"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
              Have a vision? Let's build it.
            </h2>
            {/* Force center alignment explicitly — override any inherited layout */}
            <p
              className="font-['DM_Sans'] text-[#B3B5B0] text-lg mb-10"
              style={{
                textAlign: 'center',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%',
              }}
            >
              Tell us about your project and we'll get back to you within 24 hours.
            </p>
            <MagneticButton>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#A8E8D0] text-[#1A1A1A] font-['DM_Sans'] font-semibold px-10 py-4 rounded hover:bg-white hover:shadow-[0_0_30px_rgba(168,232,208,0.35)] transition-all duration-300 text-base"
              >
                Start a project
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </MagneticButton>
          </FadeUp>
        </div>
      </section>
    </PageTransition>
  )
}
