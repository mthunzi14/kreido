import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { useAudio } from '../context/AudioContext'
import Footer from '../components/Footer'

export default function Services() {
  const { playTick, playClick } = useAudio()
  const [expandedTier, setExpandedTier] = useState(null)

  const tiers = [
    {
      id: 1,
      num: '01',
      name: 'The Quick Launch',
      price: 'R5,000',
      tag: 'Startup Essentials',
      desc: 'A stunning, high-conversion single-page site (one-pager). Engineered to establish your brand online instantly.',
      retainer: 'No monthly retainer required. You own the files completely.',
      specs: [
        'Custom coded single-page layout (Vite/React)',
        'Full mobile responsiveness & speed optimization',
        'Basic SEO indexing setup (Google Search Console)',
        'WhatsApp Business & Google Maps integration',
        'CDN server deployment (Free hosting forever)'
      ]
    },
    {
      id: 2,
      num: '02',
      name: 'The Business Engine',
      price: 'R15,000',
      tag: 'Boutique Operations',
      desc: 'A premium multi-page website built for growing businesses. Optimized to drive leads and convert visitors.',
      retainer: 'Optional R1,500/month Technical Care. Includes high-speed hosting maintenance, security sweeps, and up to 2 hours of copy/image updates.',
      specs: [
        'Custom multi-page system (up to 5 pages)',
        'Fluid animations & interactive contact portals',
        'Complete Technical SEO audit & optimization',
        'Social media feed integration',
        'Free CDN hosting setup'
      ]
    },
    {
      id: 3,
      num: '03',
      name: 'The Editorial Showcase',
      price: 'R45,000',
      tag: 'Creative Showpiece',
      desc: 'Bespoke high-end digital spaces (fashion portfolios, artist lookbooks, luxury galleries). Coded entirely from scratch.',
      retainer: 'Optional R2,500/month Optimization Retainer. Includes continuous speed monitoring, asset-streaming updates (video/photo compression), and up to 5 hours of updates.',
      specs: [
        '100% custom creative framework (no templates)',
        'Premium front-end visual physics & glassmorphism',
        'Fluid media players and asymmetrical lookbooks',
        'Sub-second image/video asset streaming',
        'Custom cursor systems and spatial page warps'
      ]
    },
    {
      id: 4,
      num: '04',
      name: 'Enterprise E-Commerce',
      price: 'Custom Spec',
      tag: 'Bespoke Store',
      desc: 'Custom-engineered digital commerce platform. Fully scalable, transaction-optimized, and built to capture revenue.',
      retainer: 'Required R4,500/month Operations Retainer. Covers payment gateway PCI monitoring, automated invoicing, inventory database syncs, and up to 10 hours of updates.',
      specs: [
        'Custom checkout flows & persistent shopping carts',
        'Payment gateway integration (Yoco, PayFast, Peach Payments)',
        'Inventory database setup & email receipt automation',
        'Serverless back-end integrations',
        'High-security compliance shields'
      ]
    },
    {
      id: 5,
      num: '05',
      name: 'Bespoke Web Application',
      price: 'Custom Spec',
      tag: 'Dynamic Platform',
      desc: 'Full-stack software platforms (SaaS portals, database engines, client dashboards, interactive spatial apps).',
      retainer: 'Required R8,500/month Enterprise Care. Covers active database shielding, 24/7 priority SLA support, server resource scaling, and up to 20 hours of updates.',
      specs: [
        'Full-stack custom React database integration',
        'Interactive client portals & user authorization',
        'Complex business logic & custom API pipelines',
        'VPS backend hosting coordination',
        'Encrypted user data security shields'
      ]
    }
  ]

  const toggleTier = (id) => {
    playClick()
    setExpandedTier(expandedTier === id ? null : id)
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col justify-center">
        {/* Prismatic ambient glow in background */}
        <div 
          className="prismatic-glow w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] opacity-10"
          style={{ 
            top: '10%', 
            right: '20%', 
            background: `radial-gradient(circle, rgba(213,213,217,0.12) 0%, rgba(191,238,255,0.06) 100%)`
          }}
        />

        <div className="relative z-10 text-center mb-16">
          <span className="tech-label">[ BLUEPRINTS // ARCHITECTURAL TIERS ]</span>
          <h1 className="text-4xl sm:text-6xl font-black mt-4 uppercase tracking-tighter">
            System Packaging
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-4 max-w-xl mx-auto">
            Explore our custom engineering configurations. Click a system tier to expand the full specifications, retainer details, and payment structures.
          </p>
        </div>

        {/* Tiers List */}
        <div className="space-y-6 relative z-10 max-w-4xl mx-auto w-full">
          {tiers.map((tier) => {
            const isExpanded = expandedTier === tier.id
            const isBespoke = tier.price === 'Custom Spec'

            return (
              <div 
                key={tier.id} 
                className={`glass-panel overflow-hidden transition-all duration-300 ${isExpanded ? 'border-zinc-500' : 'border-zinc-900'}`}
              >
                {/* Silver corner pin rivets */}
                <span className="silver-pin pin-tl"></span>
                <span className="silver-pin pin-tr"></span>
                <span className="silver-pin pin-bl"></span>
                <span className="silver-pin pin-br"></span>

                {/* Tier Header */}
                <div 
                  onClick={() => toggleTier(tier.id)}
                  onMouseEnter={playTick}
                  className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-xs text-[#00f0ff]">[ TIER_{tier.num} ]</span>
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-tight text-white">{tier.name}</h3>
                      <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">{tier.tag}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="font-mono text-lg text-white font-bold block">{tier.price}</span>
                    <span className="text-[9px] font-mono uppercase text-zinc-500">
                      {isBespoke ? '[ Spec Inquiry ]' : '[ Initial Build ]'}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 sm:px-8 border-t border-zinc-900 pt-6">
                        <p className="text-sm text-zinc-400 mb-6 max-w-2xl leading-relaxed">
                          {tier.desc}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          {/* System Specifications */}
                          <div>
                            <h4 className="text-xs font-mono uppercase text-zinc-500 mb-4 tracking-wider">[ SYSTEM_SPECIFICATIONS ]</h4>
                            <ul className="space-y-3">
                              {tier.specs.map((spec, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs text-[#f5f5f7]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] mt-1.5 shrink-0" />
                                  <span>{spec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Technical Retainer details */}
                          <div>
                            <h4 className="text-xs font-mono uppercase text-zinc-500 mb-4 tracking-wider">[ MONTHLY_RETAINER ]</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed font-mono bg-zinc-950/40 p-4 border border-zinc-900 rounded">
                              {tier.retainer}
                            </p>

                            <h4 className="text-xs font-mono uppercase text-zinc-500 mt-6 mb-4 tracking-wider">[ PAYMENT_FLOW ]</h4>
                            <p className="text-xs text-zinc-400 font-mono">
                              50% deposit to initiate scoping and design layout. 50% upon final client sign-off and deployment. All pricing is custom-quoted depending on specific asset integrations.
                            </p>
                          </div>
                        </div>

                        {/* CTA button inside drawer */}
                        <div className="flex justify-end pt-6 border-t border-zinc-900">
                          {isBespoke ? (
                            <a 
                              href="/about#contact"
                              onMouseEnter={playTick}
                              className="px-6 py-3 bg-[#00f0ff] text-zinc-950 text-xxs font-mono font-bold uppercase rounded hover:bg-[#f5f5f7] transition-all duration-300"
                            >
                              [ Initiate Spec Conversation ]
                            </a>
                          ) : (
                            <a 
                              href="/about#contact"
                              onMouseEnter={playTick}
                              className="px-6 py-3 bg-zinc-900 text-white text-xxs font-mono font-bold uppercase rounded border border-zinc-800 hover:border-white transition-all duration-300"
                            >
                              [ Order Spec Config ]
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
        <Footer />
      </div>
    </PageTransition>
  )
}
