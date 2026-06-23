import React from 'react'
import { Link } from 'react-router-dom'

const quickLinks = [
  { label: 'Home',      to: '/' },
  { label: 'Services',  to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'About',     to: '/about' },
  { label: 'Contact',   to: '/contact' },
]

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded border border-[#6B8A3A]/30 flex items-center justify-center text-[#959C8A] hover:text-[#A8E8D0] hover:border-[#A8E8D0]/50 transition-all duration-300"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="footer-texture bg-[#1A1A1A]" style={{ borderTop: '1px solid rgba(168,232,208,0.08)' }}>
      <div style={{ borderTop: '1px solid rgba(107,138,58,0.4)' }} />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

          {/* Column 1 — Brand */}
          <div>
            <Link to="/" className="inline-block mb-2">
              <img
                src="/Kreido Logo.png"
                alt="Kreido"
                className="h-10 w-auto object-contain"
                style={{ animation: 'logoSpin 8s linear infinite' }}
              />
            </Link>
            <p className="kreido-name mb-1">Kreido</p>
            <p className="font-['DM_Sans'] text-sm font-medium tracking-[0.2em] uppercase text-[#959C8A] mb-3">
              Vision, engineered.
            </p>
            <p className="font-['DM_Sans'] text-sm text-[#B3B5B0] leading-relaxed max-w-xs">
              Websites, branding, graphic design, social media, Google setup and more — premium digital solutions for anyone with a vision.
            </p>

            {/* Social icons — Instagram only */}
            <div className="flex gap-3 mt-6">
              <SocialLink href="https://www.instagram.com/kreidosa" label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Column 2 — Quick links */}
          <div>
            <h4 className="font-['Syne'] text-white font-bold text-base mb-6 tracking-wide">
              Quick links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-['DM_Sans'] text-sm text-[#B3B5B0] hover:text-[#A8E8D0] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-[#6B8A3A] group-hover:w-5 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h4 className="font-['Syne'] text-white font-bold text-base mb-6 tracking-wide">
              Get in touch
            </h4>
            <ul className="space-y-4">

              {/* Email */}
              <li className="flex items-start gap-3">
                <svg className="shrink-0 mt-0.5 text-[#6B8A3A]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a
                  href="mailto:info@kreido.co.za"
                  className="font-['DM_Sans'] text-sm text-[#B3B5B0] transition-colors duration-200"
                  onMouseEnter={e => e.currentTarget.style.color = '#A8E8D0'}
                  onMouseLeave={e => e.currentTarget.style.color = ''}
                >
                  info@kreido.co.za
                </a>
              </li>

              {/* WhatsApp */}
              <li className="flex items-start gap-3">
                <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div>
                  <p className="font-['DM_Sans'] text-[10px] text-[#959C8A] mb-0.5 uppercase tracking-wider">WhatsApp</p>
                  <a
                    href="https://wa.me/27659968015"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['DM_Sans'] text-sm text-[#B3B5B0] hover:text-[#A8E8D0] transition-colors duration-200"
                  >
                    +27 65 996 8015
                  </a>
                </div>
              </li>

              {/* Call us */}
              <li className="flex items-start gap-3">
                <svg className="shrink-0 mt-0.5 text-[#A8E8D0]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.13.97.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.09-1.09a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.81.72A2 2 0 0 1 22 16.92z"/>
                </svg>
                <div>
                  <p className="font-['DM_Sans'] text-[10px] text-[#959C8A] mb-0.5 uppercase tracking-wider">Call us</p>
                  <a
                    href="tel:+27659968015"
                    className="font-['DM_Sans'] text-sm text-[#B3B5B0] hover:text-[#A8E8D0] transition-colors duration-200"
                  >
                    +27 65 996 8015
                  </a>
                </div>
              </li>

              {/* Location */}
              <li className="flex items-start gap-3">
                <svg className="shrink-0 mt-0.5 text-[#6B8A3A]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="font-['DM_Sans'] text-sm text-[#B3B5B0]">Pretoria, South Africa</span>
              </li>

              {/* Response time */}
              <li className="flex items-start gap-3">
                <svg className="shrink-0 mt-0.5 text-[#6B8A3A]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span className="font-['DM_Sans'] text-sm text-[#B3B5B0]">Response within 24 hours</span>
              </li>
            </ul>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-6 bg-[#6B8A3A]/20 border border-[#6B8A3A]/40 text-[#A8E8D0] font-['DM_Sans'] text-sm font-medium px-5 py-2.5 rounded hover:bg-[#6B8A3A]/30 transition-all duration-300"
            >
              Start a project
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#6B8A3A]/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col items-center gap-1.5 text-center">
          <p className="font-['DM_Sans'] text-xs text-[#B3B5B0]/50">
            © {new Date().getFullYear()} Kreido. All rights reserved. · Pretoria, South Africa
          </p>
          <p className="font-['DM_Sans'] text-[10px] text-[#B3B5B0]/25 tracking-widest">
            Built by Kreido
          </p>
        </div>
      </div>
    </footer>
  )
}
