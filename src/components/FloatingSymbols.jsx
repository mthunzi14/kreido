import React from 'react'

const SYMBOLS = [
  { sym: '</>',  x:  7, y: 14, size: 18, dur: 13, delay:  0, opacity: 0.06, alt: false },
  { sym: '{}',   x: 22, y: 71, size: 14, dur: 17, delay:  2, opacity: 0.05, alt: true  },
  { sym: '#',    x: 46, y:  8, size: 26, dur: 11, delay:  1, opacity: 0.07, alt: false },
  { sym: '()',   x: 75, y: 22, size: 15, dur: 15, delay:  3, opacity: 0.05, alt: true  },
  { sym: '=>',   x: 88, y: 62, size: 16, dur: 19, delay:  0, opacity: 0.06, alt: false },
  { sym: '[]',   x: 61, y: 78, size: 13, dur: 14, delay:  4, opacity: 0.05, alt: true  },
  { sym: '/*',   x: 33, y: 42, size: 20, dur: 16, delay:  1, opacity: 0.04, alt: false },
  { sym: '01',   x: 13, y: 88, size: 12, dur: 18, delay:  2, opacity: 0.05, alt: true  },
  { sym: '&&',   x: 55, y: 55, size: 14, dur: 12, delay:  3, opacity: 0.04, alt: false },
  { sym: '~~',   x: 80, y: 38, size: 17, dur: 20, delay:  0, opacity: 0.05, alt: true  },
  { sym: '::',   x: 40, y: 92, size: 13, dur: 15, delay:  2, opacity: 0.04, alt: false },
  { sym: '%%',   x: 92, y: 85, size: 11, dur: 22, delay:  1, opacity: 0.04, alt: true  },
]

export default function FloatingSymbols() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {SYMBOLS.map((s, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontFamily: 'monospace',
            fontSize: `${s.size}px`,
            color: '#A8E8D0',
            '--sym-opacity': s.opacity,
            opacity: s.opacity,
            userSelect: 'none',
            animation: `${s.alt ? 'floatSymbolAlt' : 'floatSymbol'} ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          {s.sym}
        </span>
      ))}
    </div>
  )
}
