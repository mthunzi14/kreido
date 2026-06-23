import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { useAudio } from '../context/AudioContext'
import Footer from '../components/Footer'

export default function Portfolio() {
  const { playTick, playClick } = useAudio()
  const [activeProject, setActiveProject] = useState(null)

  const projects = [
    {
      id: 'msangambe',
      num: '01',
      title: 'Msangambe Studio',
      type: 'High-Fashion Editorial Platform',
      desc: 'Bespoke custom-coded front-end lookbook for an elite fashion label. Engineered to feature high-resolution model imagery loading instantly over mobile connections.',
      speed: '0.4s',
      bundleSize: '312KB',
      lighthouse: '100 / 100 / 100',
      url: 'https://msangambe.com',
      codeSnippet: `// GPU-Accelerated Asset Streaming
const streamAsset = async (uri) => {
  const cache = await caches.open('msangambe-v1');
  const cachedResponse = await cache.match(uri);
  if (cachedResponse) return cachedResponse.blob();
  
  const res = await fetch(uri, { priority: 'high' });
  cache.put(uri, res.clone());
  return res.blob();
};`,
      image: '/Kenala%20Health%20Hub%20Screenshot.png' // Fallback image placeholder
    },
    {
      id: 'residency',
      num: '02',
      title: 'The Residency on 8th Street',
      type: 'Spatial Sound & Brand Platform',
      desc: 'An immersive digital house interface for DJ Resident SVR. Exposes spatial navigation nodes, context-driven voice lines, and live interactive audio ducking.',
      speed: '0.5s',
      bundleSize: '415KB',
      lighthouse: '99 / 100 / 100',
      url: 'https://theresidencyon8.com',
      codeSnippet: `// Web Audio API Ducking Chain
const triggerVoiceLine = (gainNode, musicNode) => {
  const now = audioCtx.currentTime;
  musicNode.gain.setValueAtTime(1.0, now);
  musicNode.gain.linearRampToValueAtTime(0.2, now + 0.2); // Duck
  
  voiceNode.start(now);
  voiceNode.onended = () => {
    musicNode.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 0.5); // Swell
  };
};`,
      image: '/Kenala%20Health%20Hub%20Screenshot.png'
    },
    {
      id: 'kenala',
      num: '03',
      title: 'Kenala Health Hub',
      type: 'Premium Medical & Wellness Platform',
      desc: 'A robust digital booking and information platform built for a health practice. Featuring automated appointment systems and clean clinical directories.',
      speed: '0.6s',
      bundleSize: '290KB',
      lighthouse: '100 / 98 / 100',
      url: 'https://kenalahealthhub.co.za',
      codeSnippet: `// Automated Calendar Booking Sync
const syncBooking = async (appointment) => {
  const dbRef = doc(db, "bookings", appointment.id);
  await setDoc(dbRef, {
    ...appointment,
    status: "confirmed",
    timestamp: serverTimestamp()
  });
  triggerSMSAlert(appointment.clientPhone);
};`,
      image: '/Kenala%20Health%20Hub%20Screenshot.png'
    }
  ]

  const openSpecDrawer = (project) => {
    playClick()
    setActiveProject(activeProject?.id === project.id ? null : project)
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col justify-center">
        {/* Prismatic ambient glow in background */}
        <div 
          className="prismatic-glow w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] opacity-10"
          style={{ 
            top: '40%', 
            left: '10%', 
            background: `radial-gradient(circle, rgba(120,75,255,0.2) 0%, rgba(0,240,255,0.1) 100%)`
          }}
        />

        <div className="relative z-10 text-center mb-16">
          <span className="tech-label">[ SHOWROOM // SELECTED DIGITAL ASSETS ]</span>
          <h1 className="text-4xl sm:text-6xl font-black mt-4 uppercase tracking-tighter">
            Selected Works
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-4 max-w-xl mx-auto">
            We don't build generic pages. We custom-code high-performance systems. Click the spec link on any project to view its technical blueprints.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 w-full">
          {projects.map((project) => (
            <div key={project.id} className="glass-panel flex flex-col justify-between h-full">
              {/* Silver corner pin rivets */}
              <span className="silver-pin pin-tl"></span>
              <span className="silver-pin pin-tr"></span>
              <span className="silver-pin pin-bl"></span>
              <span className="silver-pin pin-br"></span>

              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xxs text-[#00f0ff] block mb-2">[ PROJECT_{project.num} ]</span>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-1">{project.title}</h3>
                  <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block mb-4">{project.type}</span>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {project.desc}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-zinc-900 mt-auto">
                  <button 
                    onClick={() => openSpecDrawer(project)}
                    onMouseEnter={playTick}
                    className="text-[10px] font-mono uppercase text-[#00f0ff] hover:text-white transition-colors duration-300"
                  >
                    [ View Technical Spec ]
                  </button>
                  <a 
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playTick}
                    className="text-[10px] font-mono uppercase text-zinc-500 hover:text-white transition-colors duration-300"
                  >
                    Launch ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blueprint Specs Slide-out Drawer */}
        <AnimatePresence>
          {activeProject && (
            <motion.div 
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0b0b0e] border-l border-zinc-800 z-50 p-8 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-mono text-xs text-[#00f0ff]">[ TECHNICAL_SPECIFICATION ]</span>
                  <button 
                    onClick={() => { playClick(); setActiveProject(null); }}
                    onMouseEnter={playTick}
                    className="text-xs font-mono text-zinc-500 hover:text-white uppercase"
                  >
                    [ Close ]
                  </button>
                </div>

                <h3 className="text-2xl font-black uppercase text-white tracking-tight mb-2">
                  {activeProject.title}
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-8">
                  {activeProject.type}
                </span>

                {/* Metrics Table */}
                <div className="border border-zinc-900 rounded p-4 mb-8 space-y-4 bg-zinc-950/40">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-xxs font-mono text-zinc-500">LOAD_LATENCY</span>
                    <span className="text-xs font-mono text-white">{activeProject.speed}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-xxs font-mono text-zinc-500">COMPILED_BUNDLE_SIZE</span>
                    <span className="text-xs font-mono text-white">{activeProject.bundleSize}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-xxs font-mono text-zinc-500">GOOGLE_LIGHTHOUSE_INDEX</span>
                    <span className="text-xs font-mono text-white text-[#00f0ff]">{activeProject.lighthouse}</span>
                  </div>
                </div>

                {/* Code highlight */}
                <div>
                  <span className="text-xxs font-mono text-zinc-500 block mb-3">[ CORE_CODE_INJECTION ]</span>
                  <pre className="p-4 bg-zinc-950 border border-zinc-900 rounded text-[10px] font-mono text-zinc-400 overflow-x-auto leading-relaxed">
                    <code>{activeProject.codeSnippet}</code>
                  </pre>
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-900 mt-8">
                <a 
                  href={activeProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={playTick}
                  className="w-full py-4 bg-[#f5f5f7] text-[#050507] font-mono font-bold text-center block rounded uppercase text-xs hover:bg-[#00f0ff] transition-all duration-300"
                >
                  [ Launch Live Core Platform ]
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Footer />
      </div>
    </PageTransition>
  )
}
