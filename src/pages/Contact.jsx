import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import FadeUp from '../components/FadeUp'
import FloatingSymbols from '../components/FloatingSymbols'

/*
 * ── EmailJS Setup Instructions ────────────────────────────────────────────────
 * 1. Go to https://www.emailjs.com and create a free account
 * 2. Create an Email Service (e.g., Gmail) and note your SERVICE_ID
 * 3. Create an Email Template and note your TEMPLATE_ID
 * 4. Copy your PUBLIC KEY from Account > API Keys
 * 5. Install EmailJS: npm install @emailjs/browser
 * 6. Replace the placeholder IDs below with your real values:
 *      const SERVICE_ID  = 'your_service_id'
 *      const TEMPLATE_ID = 'your_template_id'
 *      const PUBLIC_KEY  = 'your_public_key'
 * 7. Uncomment the emailjs import and sendForm call below
 * ─────────────────────────────────────────────────────────────────────────────
 */
// import emailjs from '@emailjs/browser'
// const SERVICE_ID  = 'YOUR_SERVICE_ID'
// const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
// const PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'

const SERVICES = [
  'Web Development',
  'Brand Design',
  'Graphic Design',
  'Social Media Management',
  'Other / Not sure yet',
]

const BUDGETS = [
  'Under R5,000',
  'R5,000 – R15,000',
  'R15,000 – R50,000',
  'R50,000+',
  "Let's discuss",
]

const EMPTY_FORM = { name: '', email: '', phone: '', service: '', description: '', budget: '' }

function validate(values) {
  const errs = {}
  if (!values.name || values.name.trim().length < 2) errs.name = 'Please enter your full name (at least 2 characters).'
  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = 'Please enter a valid email address.'
  if (!values.service) errs.service = 'Please select a service.'
  if (!values.description || values.description.trim().length < 10) errs.description = 'Please describe your project (at least 10 characters).'
  if (!values.budget) errs.budget = 'Please select a budget range.'
  return errs
}

export default function Contact() {
  useEffect(() => {
    document.title = "Let's talk — Kreido"
    document.querySelector('meta[name="description"]')?.setAttribute('content', "Get in touch with Kreido. Tell us about your project and we'll get back to you within 24 hours. Let's build something amazing.")
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', "Let's talk — Kreido")
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', "Get in touch with Kreido. Tell us about your project and we'll get back to you within 24 hours.")
  }, [])

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  function getInputClass(fieldName) {
    const base = "w-full bg-[#1A1A1A] rounded px-4 py-3 font-['DM_Sans'] text-sm text-white placeholder:text-[#959C8A]/60 focus:outline-none transition-all duration-200 min-h-[48px]"
    const showError = errors[fieldName] && (touched[fieldName] || submitAttempted)
    const showValid = !errors[fieldName] && touched[fieldName] && form[fieldName]
    if (showError) return base + ' border border-[rgba(255,80,80,0.5)] focus:border-[rgba(255,80,80,0.7)] focus:shadow-[0_0_0_2px_rgba(255,80,80,0.15)]'
    if (showValid) return base + ' border border-[rgba(168,232,208,0.3)] focus:border-[#6B8A3A] focus:shadow-[0_0_0_2px_rgba(168,232,208,0.3)]'
    return base + ' border border-[#6B8A3A]/25 focus:border-[#6B8A3A] focus:shadow-[0_0_0_2px_rgba(168,232,208,0.3)]'
  }

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value }
    setForm(updated)
    if (touched[e.target.name] || submitAttempted) setErrors(validate(updated))
  }

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
    setErrors(validate(form))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitAttempted(true)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setStatus('sending')

    // ── Replace this block with real EmailJS call once configured ──
    // try {
    //   await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
    //   setStatus('success')
    //   setForm(EMPTY_FORM)
    // } catch {
    //   setStatus('error')
    // }

    setTimeout(() => {
      setStatus('success')
      setForm(EMPTY_FORM)
      setErrors({})
      setTouched({})
      setSubmitAttempted(false)
    }, 1500)
  }

  const isFormValid = Object.keys(validate(form)).length === 0

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
              Get in touch
            </p>
            <h1 className="font-['Syne'] font-extrabold text-white mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              Let's talk
            </h1>
            <p className="font-['DM_Sans'] text-[#B3B5B0] text-lg leading-relaxed text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Tell us about your vision. We'll handle the rest.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── FORM + DETAILS — reduced top gap (23% less than section-padding) ── */}
      <section className="section-content-gap bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ─ Contact form ─────────────────────────────────────────────── */}
          <FadeUp className="lg:col-span-3">
            <div className="bg-[#222222] rounded-lg p-8 md:p-10 border border-[#6B8A3A]/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6B8A3A] via-[#A8E8D0]/40 to-transparent" />

              <h2 className="font-['Syne'] font-bold text-white text-2xl mb-8">Send us a message</h2>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-14"
                >
                  {/* Large mint checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 rounded-full bg-[#A8E8D0]/12 border border-[#A8E8D0]/25 flex items-center justify-center mx-auto mb-7"
                  >
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#A8E8D0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="font-['Syne'] font-bold text-white text-2xl mb-3"
                  >
                    Message sent!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                    className="font-['DM_Sans'] text-[#959C8A] text-base mb-8 leading-relaxed"
                  >
                    We'll get back to you within 24 hours.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    onClick={() => setStatus('idle')}
                    className="font-['DM_Sans'] text-sm text-[#A8E8D0] underline underline-offset-4 hover:text-white transition-colors duration-200"
                  >
                    Send another message
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-['DM_Sans'] text-xs text-[#959C8A] mb-2">
                        Full name <span className="text-[#A8E8D0]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Your full name"
                        className={getInputClass('name')}
                        aria-invalid={!!(errors.name && (touched.name || submitAttempted))}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      <AnimatePresence>
                        {errors.name && (touched.name || submitAttempted) && (
                          <motion.p id="name-error" key="name-err"
                            initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.2 }}
                            className="font-['DM_Sans'] text-xs text-red-400 mt-1.5 overflow-hidden"
                          >{errors.name}</motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <label className="block font-['DM_Sans'] text-xs text-[#959C8A] mb-2">
                        Email address <span className="text-[#A8E8D0]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="you@example.com"
                        className={getInputClass('email')}
                        aria-invalid={!!(errors.email && (touched.email || submitAttempted))}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      <AnimatePresence>
                        {errors.email && (touched.email || submitAttempted) && (
                          <motion.p id="email-error" key="email-err"
                            initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.2 }}
                            className="font-['DM_Sans'] text-xs text-red-400 mt-1.5 overflow-hidden"
                          >{errors.email}</motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Phone + Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-['DM_Sans'] text-xs text-[#959C8A] mb-2">
                        Phone number <span className="text-[#959C8A]/50">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="+27 XX XXX XXXX"
                        className={getInputClass('phone')}
                      />
                    </div>
                    <div>
                      <label className="block font-['DM_Sans'] text-xs text-[#959C8A] mb-2">
                        Service interested in <span className="text-[#A8E8D0]">*</span>
                      </label>
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClass('service') + ' appearance-none cursor-pointer'}
                        aria-invalid={!!(errors.service && (touched.service || submitAttempted))}
                        aria-describedby={errors.service ? 'service-error' : undefined}
                      >
                        <option value="" disabled>Select a service</option>
                        {SERVICES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <AnimatePresence>
                        {errors.service && (touched.service || submitAttempted) && (
                          <motion.p id="service-error" key="service-err"
                            initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.2 }}
                            className="font-['DM_Sans'] text-xs text-red-400 mt-1.5 overflow-hidden"
                          >{errors.service}</motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-['DM_Sans'] text-xs text-[#959C8A] mb-2">
                      Project description <span className="text-[#A8E8D0]">*</span>
                    </label>
                    <textarea
                      name="description"
                      rows={5}
                      value={form.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tell us about your project — what you need, your goals, timeline and any other relevant details..."
                      className={getInputClass('description') + ' resize-none'}
                      aria-invalid={!!(errors.description && (touched.description || submitAttempted))}
                      aria-describedby={errors.description ? 'description-error' : undefined}
                    />
                    <AnimatePresence>
                      {errors.description && (touched.description || submitAttempted) && (
                        <motion.p id="description-error" key="desc-err"
                          initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.2 }}
                          className="font-['DM_Sans'] text-xs text-red-400 mt-1.5 overflow-hidden"
                        >{errors.description}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block font-['DM_Sans'] text-xs text-[#959C8A] mb-2">
                      Budget range <span className="text-[#A8E8D0]">*</span>
                    </label>
                    <select
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('budget') + ' appearance-none cursor-pointer'}
                      aria-invalid={!!(errors.budget && (touched.budget || submitAttempted))}
                      aria-describedby={errors.budget ? 'budget-error' : undefined}
                    >
                      <option value="" disabled>Select a budget range</option>
                      {BUDGETS.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <AnimatePresence>
                      {errors.budget && (touched.budget || submitAttempted) && (
                        <motion.p id="budget-error" key="budget-err"
                          initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.2 }}
                          className="font-['DM_Sans'] text-xs text-red-400 mt-1.5 overflow-hidden"
                        >{errors.budget}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending' || (submitAttempted && !isFormValid)}
                    className="w-full bg-[#A8E8D0] text-[#1A1A1A] font-['DM_Sans'] font-semibold py-4 rounded hover:bg-white hover:shadow-[0_0_30px_rgba(168,232,208,0.3)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px]"
                  >
                    {status === 'sending' ? (
                      <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <p className="font-['DM_Sans'] text-sm text-red-400 text-center">
                      Something went wrong. Please try again or email us directly.
                    </p>
                  )}

                  {/* WhatsApp alternative */}
                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-[#6B8A3A]/20" />
                    <span className="font-['DM_Sans'] text-xs text-[#959C8A]">or</span>
                    <div className="flex-1 h-px bg-[#6B8A3A]/20" />
                  </div>
                  <a
                    href="https://wa.me/27659968015"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-['DM_Sans'] font-medium py-3.5 rounded hover:bg-[#25D366]/20 transition-all duration-300"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Message us on WhatsApp
                  </a>
                </form>
              )}
            </div>
          </FadeUp>

          {/* ─ Contact details ──────────────────────────────────────────── */}
          <FadeUp delay={0.12} className="lg:col-span-2">
            <div className="space-y-5">
              {/* Contact info card */}
              <div className="bg-[#222222] rounded-lg p-7 border border-[#6B8A3A]/10">
                <h3 className="font-['Syne'] font-bold text-white text-lg mb-6">Contact details</h3>

                <ul className="space-y-5">
                  {/* Email */}
                  <li className="flex items-start gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-[#6B8A3A]/15 flex items-center justify-center text-[#6B8A3A]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-['DM_Sans'] text-xs text-[#959C8A] mb-0.5">Email</p>
                      <a href="mailto:hello@kreido.co.za" className="font-['DM_Sans'] text-sm text-white hover:text-[#A8E8D0] transition-colors duration-200">hello@kreido.co.za</a>
                    </div>
                  </li>

                  {/* WhatsApp */}
                  <li className="flex items-start gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-[#25D366]/15 flex items-center justify-center" style={{ color: '#25D366' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-['DM_Sans'] text-xs text-[#959C8A] mb-0.5">WhatsApp</p>
                      <a href="https://wa.me/27659968015" target="_blank" rel="noopener noreferrer" className="font-['DM_Sans'] text-sm text-white hover:text-[#25D366] transition-colors duration-200">+27 65 996 8015</a>
                    </div>
                  </li>

                  {/* Call us */}
                  <li className="flex items-start gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-[#A8E8D0]/15 flex items-center justify-center text-[#A8E8D0]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.13.97.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.09-1.09a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.81.72A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-['DM_Sans'] text-xs text-[#959C8A] mb-0.5">Call us</p>
                      <a href="tel:+27659968015" className="font-['DM_Sans'] text-sm text-white hover:text-[#A8E8D0] transition-colors duration-200">+27 65 996 8015</a>
                    </div>
                  </li>

                  {/* Location */}
                  <li className="flex items-start gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-[#6B8A3A]/15 flex items-center justify-center text-[#6B8A3A]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-['DM_Sans'] text-xs text-[#959C8A] mb-0.5">Location</p>
                      <p className="font-['DM_Sans'] text-sm text-white">Pretoria, South Africa</p>
                    </div>
                  </li>

                  {/* Response time */}
                  <li className="flex items-start gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-[#6B8A3A]/15 flex items-center justify-center text-[#6B8A3A]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-['DM_Sans'] text-xs text-[#959C8A] mb-0.5">Response time</p>
                      <p className="font-['DM_Sans'] text-sm text-white">Within 24 hours</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Availability card */}
              <div className="bg-[#222222] rounded-lg p-7 border border-[#6B8A3A]/10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A8E8D0] animate-pulse" />
                  <span className="font-['DM_Sans'] text-sm text-white font-medium">Currently accepting projects</span>
                </div>
                <p className="font-['DM_Sans'] text-xs text-[#B3B5B0] leading-relaxed">
                  We have limited slots available each month to ensure every client gets our full attention. Don't wait — get in touch today.
                </p>
              </div>

              {/* Quick quote note */}
              <div className="bg-[#6B8A3A]/10 rounded-lg p-6 border border-[#6B8A3A]/20">
                <p className="font-['DM_Sans'] text-xs text-[#A8E8D0] font-medium mb-2">No obligation quote</p>
                <p className="font-['DM_Sans'] text-xs text-[#B3B5B0] leading-relaxed">
                  All enquiries come with a free consultation. We'll assess your needs and give you a transparent, itemised quote with zero pressure.
                </p>
              </div>

              {/* What happens next? */}
              <div className="bg-[#222222] rounded-lg p-7 border border-[#6B8A3A]/10">
                <p className="font-['DM_Sans'] text-xs font-medium tracking-[0.3em] uppercase text-[#A8E8D0] mb-5">
                  What happens next?
                </p>
                <div className="space-y-4">
                  {[
                    { num: '01', title: 'We review your message within 24 hours', desc: 'Every enquiry gets our full attention. Expect a personal reply — not a bot.' },
                    { num: '02', title: 'We send a detailed quote tailored to your project', desc: 'A transparent, itemised quote scoped exactly to your needs. No guesswork, no surprises.' },
                    { num: '03', title: 'We get building once deposit is confirmed', desc: '50% to start, 50% on completion. Fast turnaround, premium output from day one.' },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-4 items-start">
                      <span className="font-['Syne'] font-black text-[#A8E8D0] text-xl shrink-0 leading-none mt-0.5">{step.num}</span>
                      <div>
                        <p className="font-['Syne'] font-bold text-white text-sm mb-1">{step.title}</p>
                        <p className="font-['DM_Sans'] text-[#959C8A] text-xs leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </PageTransition>
  )
}
