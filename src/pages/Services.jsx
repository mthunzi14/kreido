import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import FadeUp from '../components/FadeUp'
import MagneticButton from '../components/MagneticButton'
import FloatingSymbols from '../components/FloatingSymbols'

// ─── Category background icons ────────────────────────────────────────────────
const WebIcon = () => (
  <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
)
const BrandIcon = () => (
  <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
  </svg>
)
const SocialIcon = () => (
  <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
    <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2"/>
  </svg>
)

// ─── Active service categories ────────────────────────────────────────────────
const categories = [
  {
    id: 'web',
    label: 'Category 01',
    heading: 'Web & Digital Development',
    desc: 'From your first website to a full e-commerce platform — we build custom digital solutions that perform, convert and grow with your business.',
    BgIcon: WebIcon,
    services: [
      {
        name: 'Website Design & Development',
        desc: 'Fully custom websites built from scratch — no templates. Business sites, portfolios, event sites, booking platforms and e-commerce, all engineered to perform.',
        includes: [
          'Business & portfolio websites',
          'E-commerce & online stores',
          'Event & booking platforms',
          'Custom web app development',
          'Mobile-responsive builds',
          'SEO-optimised structure',
        ],
      },
      {
        name: 'Landing Pages',
        desc: 'High-converting single-page sites for campaigns, product launches and lead generation. Built to turn visitors into customers, fast.',
        includes: [
          'Campaign & promotion pages',
          'Lead capture & sign-up pages',
          'Product launch pages',
          'Clear conversion focus',
          'Fast load optimisation',
          'Mobile-first design',
        ],
      },
      {
        name: 'Google Business Profile Setup',
        desc: 'Get found on Google Maps and Search. We set up and optimise your Google Business Profile so local customers can discover you instantly.',
        includes: [
          'Profile creation & verification',
          'Category & service setup',
          'Photo & branding upload',
          'Business hours & contact info',
          'Review management guidance',
          'Google Maps optimisation',
        ],
      },
      {
        name: 'WhatsApp Business Setup',
        desc: 'Turn WhatsApp into a professional sales and support channel with a catalogue, auto-replies and a fully optimised business profile.',
        includes: [
          'Business account setup',
          'Product catalogue creation',
          'Auto-reply & away messages',
          'Business profile optimisation',
          'Quick reply templates',
          'WA link & QR code generation',
        ],
      },
      {
        name: 'Basic SEO Setup',
        desc: 'Get your website indexed and discoverable on Google with the technical fundamentals that make search engines rank and trust your site.',
        includes: [
          'Page titles & meta descriptions',
          'Google Search Console setup',
          'Sitemap & indexing submission',
          'Keyword research basics',
          'On-page SEO implementation',
          'Search visibility report',
        ],
      },
    ],
  },
  {
    id: 'brand',
    label: 'Category 02',
    heading: 'Brand & Design',
    desc: 'Your brand is your first impression — and your most powerful asset. We craft identities and design assets that set you apart and stay memorable.',
    BgIcon: BrandIcon,
    services: [
      {
        name: 'Logo Design & Brand Identity',
        desc: 'Complete brand identity systems — logos, colour palettes, typography and brand guidelines that communicate who you are across every touchpoint.',
        includes: [
          'Primary & alternate logo versions',
          'Colour palette & typography',
          'Brand style guide',
          'Logo usage guidelines',
          'SVG, PNG & PDF file formats',
          'Social media profile kit',
        ],
      },
      {
        name: 'Flyer & Poster Design',
        desc: 'Eye-catching print and digital flyers for events, promotions and marketing campaigns that get noticed and drive action.',
        includes: [
          'Event & promotional flyers',
          'Digital social flyers',
          'Print-ready artwork files',
          'Multiple size formats',
          'Brand-consistent design',
          'Up to 2 revision rounds',
        ],
      },
      {
        name: 'Business Card & Stationery Design',
        desc: 'Professional stationery that makes every touchpoint memorable — cards, letterheads, invoice templates and email signatures.',
        includes: [
          'Business card design',
          'Letterhead design',
          'Invoice & quote templates',
          'Email signature design',
          'Envelope design',
          'Print-ready artwork',
        ],
      },
      {
        name: 'Presentation & Pitch Deck Design',
        desc: 'Professionally designed decks that tell your story with impact — for investor pitches, client proposals and business presentations.',
        includes: [
          'Custom slide design',
          'Canva or PowerPoint format',
          'Data visualisation',
          'Branded slide templates',
          'Storytelling structure',
          'Up to 20 slides',
        ],
      },
      {
        name: 'YouTube Thumbnail Design',
        desc: 'Scroll-stopping thumbnails that boost click-through rates and build a consistent visual brand for your YouTube channel.',
        includes: [
          'Custom thumbnail design',
          'Consistent visual style',
          'Text overlay & composition',
          'High-res PNG export',
          'Batch packages available',
          'Brand-aligned visuals',
        ],
      },
      {
        name: 'CV & Resume Design',
        desc: 'Premium designed CVs that stand out in the pile — professionally formatted, visually impressive and ATS-friendly.',
        includes: [
          'Custom CV design',
          'Professional layout & typography',
          'Word & PDF formats',
          'LinkedIn banner included',
          'ATS-friendly version',
          '1 revision round',
        ],
      },
    ],
  },
  {
    id: 'social',
    label: 'Category 03',
    heading: 'Social Media & Content',
    desc: 'A strong social presence is not optional anymore. We create content and manage platforms so you can focus on running your business.',
    BgIcon: SocialIcon,
    services: [
      {
        name: 'Social Media Content Creation',
        desc: 'Professionally designed posts, stories and reels covers for Instagram, Facebook and TikTok — on-brand, scroll-stopping content delivered monthly.',
        includes: [
          'Designed posts & carousels',
          'Story & reels cover designs',
          'Caption copywriting',
          'Hashtag research',
          'Monthly content calendar',
          'Brand-consistent visuals',
        ],
      },
      {
        name: 'Social Media Management',
        desc: 'Full monthly management of your social channels — content creation, scheduling, engagement and growth strategy, all handled for you.',
        includes: [
          'Strategy & content planning',
          'Content creation & scheduling',
          'Community engagement',
          'Monthly analytics report',
          'Profile optimisation',
          'Growth strategy',
        ],
      },
      {
        name: 'Email Marketing Setup',
        desc: 'Launch your email channel with Mailchimp — branded newsletters, subscriber management and welcome automation sequences.',
        includes: [
          'Mailchimp account setup',
          'Branded newsletter template',
          'Subscriber list setup',
          'Welcome email sequence',
          'Sign-up form design',
          'Campaign analytics guidance',
        ],
      },
      {
        name: 'Content Strategy & Planning',
        desc: 'A 30-day content roadmap tailored to your brand — monthly calendars, caption writing, hashtag research and posting schedules.',
        includes: [
          'Monthly content calendar',
          'Post captions & copy',
          'Hashtag strategy',
          'Platform-specific guidance',
          'Content theme planning',
          'Posting schedule',
        ],
      },
    ],
  },
]

// ─── Coming soon ──────────────────────────────────────────────────────────────
const comingSoon = [
  {
    id: 1,
    name: 'Video Editing & Short Form Content',
    desc: 'Reels, TikToks, YouTube Shorts and long-form video editing that captures attention and drives engagement.',
  },
  {
    id: 2,
    name: 'Mobile App Development',
    desc: 'Native and cross-platform apps for iOS and Android — from concept to the App Store.',
  },
  {
    id: 3,
    name: 'AI-Powered Business Tools',
    desc: 'Custom chatbots, automation workflows and AI integrations that work for your business 24/7.',
  },
  {
    id: 4,
    name: 'Billboard & Large Format Design',
    desc: 'Outdoor advertising, building wraps, vehicle branding and large-format print materials.',
  },
  {
    id: 5,
    name: 'SEO Management Packages',
    desc: 'Ongoing monthly SEO — content, backlinks, technical health and sustained Google ranking growth.',
  },
  {
    id: 6,
    name: 'Google Ads Management',
    desc: 'Paid search campaigns that put you in front of buyers at the exact moment they\'re searching.',
  },
]

export default function Services() {
  useEffect(() => {
    document.title = 'Services — Kreido'
    document.querySelector('meta[name="description"]')?.setAttribute('content', "Explore Kreido's premium digital services — web development, brand design, graphic design and social media content. Custom solutions for any vision.")
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Services — Kreido')
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', "Explore Kreido's premium digital services — web development, brand design, social media and more.")

    // Smooth scroll to anchor if URL hash is present on load
    const hash = window.location.hash
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400)
      }
    }
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
              What we offer
            </p>
            <h1 className="font-['Syne'] font-extrabold text-white mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              What we do
            </h1>
            <p className="font-['DM_Sans'] text-[#B3B5B0] text-lg leading-relaxed text-center" style={{ maxWidth: '640px', margin: '0 auto' }}>
              Three active disciplines, one unified goal — taking your vision from idea to reality. Websites, branding, design, social media and more.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── ACTIVE SERVICE CATEGORIES ─────────────────────────────────────── */}
      {categories.map((cat, catIdx) => (
        <section
          key={cat.id}
          id={cat.id}
          className={`section-padding relative overflow-hidden ${catIdx % 2 === 0 ? 'bg-[#1A1A1A]' : 'bg-[#1e1e1e]'}`}
          style={{ scrollMarginTop: '80px' }}
        >
          {/* Subtle background icon */}
          <div
            className="absolute top-8 right-8 pointer-events-none select-none"
            style={{ color: '#6B8A3A', opacity: 0.04 }}
            aria-hidden="true"
          >
            <cat.BgIcon />
          </div>

          <div className="max-w-7xl mx-auto relative">
            {/* Category heading */}
            <FadeUp>
              <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-3">
                {cat.label}
              </p>
              <h2
                className="font-['Syne'] font-extrabold text-white mb-4"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}
              >
                {cat.heading}
              </h2>
              <p className="font-['DM_Sans'] text-[#959C8A] text-base leading-relaxed mb-10" style={{ maxWidth: '600px' }}>
                {cat.desc}
              </p>
            </FadeUp>

            {/* Service cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.services.map((s, i) => (
                <FadeUp key={s.name} delay={i * 0.07}>
                  <div className="bg-[#222222] rounded-lg p-7 h-full relative overflow-hidden border border-[#6B8A3A]/0 hover:border-[#6B8A3A]/30 service-card-glow transition-all duration-400 group flex flex-col">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6B8A3A] to-transparent" />

                    <h3 className="font-['Syne'] font-bold text-white text-lg mb-3">{s.name}</h3>
                    <p className="font-['DM_Sans'] text-[#B3B5B0] text-sm leading-relaxed mb-5">{s.desc}</p>

                    <ul className="space-y-2 mb-6 flex-1">
                      {s.includes.map((item) => (
                        <li key={item} className="flex items-center gap-3 font-['DM_Sans'] text-sm text-[#B3B5B0]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A8E8D0] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <Link to="/contact" className="btn-quote mt-auto">
                      Get a quote
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── COMING SOON ────────────────────────────────────────────────────── */}
      <section className="section-padding bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#959C8A] mb-4 text-center">
              Coming soon
            </p>
            <h2 className="font-['Syne'] font-bold text-white text-center mb-10"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}>
              What's coming
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {comingSoon.map((s, i) => (
              <FadeUp key={s.id} delay={i * 0.07}>
                <div className="bg-[#222222]/60 rounded-lg p-6 relative border border-[#959C8A]/10 opacity-70">
                  <div className="absolute top-4 right-4">
                    <span className="font-['DM_Sans'] text-[10px] tracking-widest uppercase bg-[#959C8A]/15 text-[#959C8A] px-2.5 py-1 rounded-full">
                      Soon
                    </span>
                  </div>
                  <div className="w-8 h-px bg-[#959C8A]/30 mb-5" />
                  <h3 className="font-['Syne'] font-bold text-[#959C8A] text-base mb-3 pr-14">{s.name}</h3>
                  <p className="font-['DM_Sans'] text-[#959C8A]/60 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS CALLOUT ───────────────────────────────────────────── */}
      <section className="px-6 pb-0 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="rounded-lg p-8 md:p-10 relative"
              style={{ background: '#222222', border: '1px solid rgba(107,138,58,0.2)', borderLeft: '4px solid #6B8A3A' }}>
              <p className="font-['DM_Sans'] text-[10px] font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-4">
                How it works
              </p>
              <p className="font-['DM_Sans'] text-[#B3B5B0] text-base leading-relaxed mb-6 max-w-3xl">
                Every project starts with a conversation. We understand your vision, scope the work, send a detailed quote and get building.{' '}
                <span className="text-[#A8E8D0]">50% deposit to start — 50% on completion.</span>{' '}
                Fast turnaround, premium output, no surprises.
              </p>
              <Link to="/contact"
                className="inline-flex items-center gap-2 border border-[#6B8A3A] text-[#A8E8D0] font-['DM_Sans'] font-semibold px-6 py-3 rounded hover:bg-[#6B8A3A]/20 hover:border-[#A8E8D0] transition-all duration-300 text-sm">
                Start a conversation
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────────────────── */}
      <section className="section-padding bg-[#1e1e1e] border-t border-[#6B8A3A]/30">
        <div className="max-w-7xl mx-auto text-center">
          <FadeUp>
            <h2 className="font-['Syne'] font-bold text-white mb-4"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}>
              Not sure what you need?
            </h2>
            <p className="font-['DM_Sans'] text-[#B3B5B0] text-lg text-center mb-10" style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Let's figure it out together. Tell us about your goals and we'll recommend the right solution.
            </p>
            <MagneticButton>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#A8E8D0] text-[#1A1A1A] font-['DM_Sans'] font-semibold px-10 py-4 rounded hover:bg-white hover:shadow-[0_0_30px_rgba(168,232,208,0.3)] transition-all duration-300"
              >
                Let's talk
              </Link>
            </MagneticButton>
          </FadeUp>
        </div>
      </section>
    </PageTransition>
  )
}
