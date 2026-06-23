import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import FadeUp from '../components/FadeUp'
import FloatingSymbols from '../components/FloatingSymbols'

// ─── About page stat counter ───────────────────────────────────────────────────
function AboutStat({ value, isNumber, label, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView || !isNumber) return
    const target = parseInt(value, 10)
    const duration = 1800
    const start = performance.now()
    let rafId
    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(target * eased))
      if (progress < 1) rafId = requestAnimationFrame(tick)
      else setCount(target)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isInView, isNumber, value])

  const display = isNumber ? count + (value.toString().includes('%') ? '%' : value.toString().replace(/[0-9]/g, '')) : value

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="bg-[#222222] rounded-lg p-8 text-center border border-[#6B8A3A]/10 hover:border-[#6B8A3A]/30 transition-all duration-300 stat-item cursor-default select-none"
    >
      <p className="font-['Syne'] font-black text-[#A8E8D0] mb-3" style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)' }}>
        {display}
      </p>
      <p className="font-['DM_Sans'] text-[#959C8A] text-xs font-semibold uppercase tracking-widest">{label}</p>
      <span className="stat-underline" />
    </motion.div>
  )
}

const coreValues = [
  {
    title: 'Quality first',
    desc: 'We never ship mediocre work. Every pixel and every line of code is held to the highest standard before it reaches a client.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    title: 'Vision-driven',
    desc: 'Your idea is the north star. We build around your specific vision and goals — not a generic template or cookie-cutter approach.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="2"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
  },
  {
    title: 'Forward thinking',
    desc: 'Technology moves fast and we stay ahead of it — so the solutions we build today scale with where your business is going tomorrow.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: 'Real results',
    desc: 'We measure success by your outcomes — more clients, a stronger brand, faster growth. Impact is the only metric that matters.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
]

export default function About() {
  useEffect(() => {
    document.title = 'About — Kreido'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Learn about Kreido — a premium digital solutions studio built to empower anyone with a vision. Based in Pretoria, South Africa.')
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'About — Kreido')
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'Learn about Kreido — a premium digital solutions studio built to empower anyone with a vision. Based in Pretoria, South Africa.')
  }, [])

  return (
    <PageTransition>
      {/* ── PAGE HERO ──────────────────────────────────────────────────────── */}
      <section className="pt-40 pb-14 px-6 bg-[#1A1A1A] relative overflow-hidden">
        <FloatingSymbols />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(107,138,58,0.08) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-7xl mx-auto text-center">
          <FadeUp>
            <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4">
              Our story
            </p>
            <h1 className="font-['Syne'] font-extrabold text-white mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              About Kreido
            </h1>
            <p className="font-['DM_Sans'] text-[#B3B5B0] text-lg leading-relaxed text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
              A premium digital studio born from a passion for technology, design and helping visionaries build what matters.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── WHO WE ARE — reduced top gap (23% less than section-padding) ── */}
      <section className="section-content-gap bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div>
              <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4">
                Who we are
              </p>
              <h2 className="font-['Syne'] font-bold text-white mb-6"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.75rem)' }}>
                Built for visionaries.
              </h2>
              <div className="space-y-4 font-['DM_Sans'] text-[#B3B5B0] leading-relaxed">
                <p>
                  Kreido is a premium digital solutions studio based in Pretoria, South Africa — built from a genuine passion for technology, design and the belief that every great idea deserves a world-class digital presence.
                </p>
                <p>
                  We work with entrepreneurs, startups and established businesses who refuse to settle for mediocre. Our clients come to us because they want something exceptional — and we deliver exactly that, every time.
                </p>
                <p>
                  From custom websites, brand identities and graphic design to social media management, Google Business setup, WhatsApp Business and content strategy — we take your vision and turn it into something that performs, impresses and lasts. No templates. No shortcuts. Just craft.
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            {/* Decorative stat block */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '100%', label: 'Custom builds — zero templates' },
                { value: '24h',  label: 'Response time on every enquiry' },
                { value: 'ZA',   label: 'Based in Pretoria, serving Africa & beyond' },
                { value: '∞',    label: 'Commitment to your long-term growth' },
              ].map((item, i) => (
                <div key={i} className="bg-[#222222] rounded-lg p-6 border border-[#6B8A3A]/10">
                  <p className="font-['Syne'] font-extrabold text-[#A8E8D0] text-3xl mb-2">{item.value}</p>
                  <p className="font-['DM_Sans'] text-[#B3B5B0] text-xs leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── MISSION & VISION ───────────────────────────────────────────────── */}
      <section className="section-padding bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <FadeUp>
            <div className="bg-[#222222] rounded-lg p-8 h-full relative overflow-hidden border-t-2 border-[#6B8A3A]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#6B8A3A]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="font-['DM_Sans'] text-xs tracking-[0.3em] uppercase text-[#A8E8D0] mb-4">Our mission</p>
              <h2 className="font-['Syne'] font-bold text-white text-2xl mb-5">Why we exist</h2>
              <p className="font-['DM_Sans'] text-[#B3B5B0] leading-relaxed">
                To empower anyone with a vision by delivering premium digital solutions that are built to perform, designed to impress, and engineered to last. We believe that exceptional digital work should not be reserved for the biggest budgets — anyone with drive and a vision deserves world-class execution.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="bg-[#222222] rounded-lg p-8 h-full relative overflow-hidden border-t-2 border-[#A8E8D0]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#A8E8D0]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="font-['DM_Sans'] text-xs tracking-[0.3em] uppercase text-[#A8E8D0] mb-4">Our vision</p>
              <h2 className="font-['Syne'] font-bold text-white text-2xl mb-5">Where we're going</h2>
              <p className="font-['DM_Sans'] text-[#B3B5B0] leading-relaxed">
                To become Africa's most trusted digital partner — a powerhouse studio where technology, creativity and innovation converge. We are building towards a future where Kreido is synonymous with quality, ambition and transformative digital experiences across the continent and beyond.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CORE VALUES ────────────────────────────────────────────────────── */}
      <section className="section-padding bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4 text-center">
              What drives us
            </p>
            <h2 className="font-['Syne'] font-bold text-white text-center mb-10"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}>
              Our core values
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="bg-[#222222] rounded-lg p-6 h-full border border-[#6B8A3A]/0 hover:border-[#6B8A3A]/30 service-card-glow transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-[#A8E8D0]/10 flex items-center justify-center text-[#A8E8D0] mb-5">
                    {v.icon}
                  </div>
                  <h3 className="font-['Syne'] font-bold text-white text-lg mb-3">{v.title}</h3>
                  <p className="font-['DM_Sans'] text-[#B3B5B0] text-sm leading-relaxed">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE KREIDO ──────────────────────────────────────────────── */}
      <section className="section-padding bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4 text-center">
              Our difference
            </p>
            <h2 className="font-['Syne'] font-bold text-white text-center mb-10"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}>
              Why choose Kreido?
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ),
                title: 'Premium quality',
                desc: "We treat every project like it's our own business. No shortcuts, no templates, no compromises.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                ),
                title: 'Fast delivery',
                desc: "We move with urgency. Your vision doesn't wait and neither do we.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="2"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                  </svg>
                ),
                title: 'Vision first',
                desc: 'We start with your goals and work backwards. Every decision serves your vision.',
              },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="glass-service-card rounded-lg p-8 h-full">
                  <div className="w-11 h-11 rounded-lg bg-[#A8E8D0]/10 flex items-center justify-center text-[#A8E8D0] mb-6">
                    {item.icon}
                  </div>
                  <h3 className="font-['Syne'] font-bold text-white text-xl mb-3">{item.title}</h3>
                  <p className="font-['DM_Sans'] text-[#959C8A] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── NUMBERS ────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4 text-center">
              By the numbers
            </p>
            <h2 className="font-['Syne'] font-bold text-white text-center mb-12"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}>
              The numbers behind the work
            </h2>
          </FadeUp>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <AboutStat value="2"    isNumber={true}  label="Live websites delivered"  delay={0}    />
            <AboutStat value="100%" isNumber={false} label="Client satisfaction"       delay={0.1}  />
            <AboutStat value="24"   isNumber={true}  label="Avg. response time (hrs)"  delay={0.2}  />
            <AboutStat value="2025" isNumber={true}  label="Year founded"              delay={0.3}  />
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────────────────── */}
      <section className="section-padding bg-[#1A1A1A] border-t border-[#6B8A3A]/30">
        <div className="max-w-7xl mx-auto text-center">
          <FadeUp>
            <h2 className="font-['Syne'] font-bold text-white mb-4"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}>
              Ready to work with us?
            </h2>
            <p className="font-['DM_Sans'] text-[#B3B5B0] text-lg mb-10 text-center" style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Let's take your vision from idea to reality. We'd love to hear what you're building.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#A8E8D0] text-[#1A1A1A] font-['DM_Sans'] font-semibold px-10 py-4 rounded hover:bg-white hover:shadow-[0_0_30px_rgba(168,232,208,0.3)] transition-all duration-300"
            >
              Start a project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </FadeUp>
        </div>
      </section>
    </PageTransition>
  )
}
