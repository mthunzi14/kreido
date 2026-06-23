import React, { useEffect } from 'react'
import PageTransition from '../components/PageTransition'
import FadeUp from '../components/FadeUp'
import FloatingSymbols from '../components/FloatingSymbols'

export default function Portfolio() {
  useEffect(() => {
    document.title = 'Portfolio — Kreido'
    document.querySelector('meta[name="description"]')?.setAttribute('content', "View Kreido's work — premium websites and digital solutions built for real clients. See what we've engineered.")
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Portfolio — Kreido')
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', "View Kreido's work — premium websites and digital solutions built for real clients.")
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
              Selected projects
            </p>
            <h1 className="font-['Syne'] font-extrabold text-white mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              Our work
            </h1>
            <p className="font-['DM_Sans'] text-[#B3B5B0] text-lg leading-relaxed text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
              A curated selection of projects we've built, designed and launched for our clients.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── PROJECT GRID — reduced top gap (23% less than section-padding) ─── */}
      <section className="portfolio-gap bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">

          {/* ── Kenala Health Hub ── */}
          <FadeUp>
            <div className="group bg-[#222222] rounded-lg overflow-hidden border border-[#6B8A3A]/0 hover:border-[#6B8A3A]/30 service-card-glow hover:-translate-y-1 transition-all duration-300 max-w-xl mx-auto mb-6">
              {/* Real screenshot thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden kenala-thumb-bg">
                <img
                  src="/Kenala%20Health%20Hub%20Screenshot.png"
                  alt="Kenala Health Hub website screenshot"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{ maxWidth: '800px' }}
                />
                {/* Hover overlay with View project */}
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
              <div className="p-6">
                <span className="font-['DM_Sans'] text-xs tracking-widest uppercase text-[#6B8A3A] mb-2 block">
                  Web Development
                </span>
                <h3 className="font-['Syne'] font-bold text-white text-xl mb-3">Kenala Health Hub</h3>
                <p className="font-['DM_Sans'] text-[#B3B5B0] text-sm leading-relaxed mb-5">
                  A premium health and wellness platform for Kenala Health Hub — designed and built from the ground up.
                </p>
                <a
                  href="https://kenalahealthhub.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#6B8A3A]/20 border border-[#6B8A3A]/40 text-[#A8E8D0] font-['DM_Sans'] text-sm font-medium px-5 py-2.5 rounded hover:bg-[#6B8A3A]/30 transition-all duration-300"
                >
                  View project
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </FadeUp>

          {/* ── More projects coming soon ── */}
          <FadeUp delay={0.1}>
            <div className="relative rounded-lg overflow-hidden border border-[#A8E8D0]/20 bg-[#222222]" style={{ minHeight: '240px' }}>
              <FloatingSymbols />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(168,232,208,0.04) 0%, transparent 70%)' }}
              />
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-16">
                <div className="w-10 h-px bg-[#A8E8D0]/30 mb-6" />
                <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4">
                  More coming
                </p>
                <h3 className="font-['Syne'] font-bold text-white mb-4" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
                  More projects coming soon
                </h3>
                <p className="font-['DM_Sans'] text-[#B3B5B0] text-base leading-relaxed" style={{ maxWidth: '480px' }}>
                  Exciting new projects in the works. Check back soon.
                </p>
                <div className="w-10 h-px bg-[#A8E8D0]/30 mt-6" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </PageTransition>
  )
}
