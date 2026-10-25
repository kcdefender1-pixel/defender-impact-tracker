'use client';

import { useState } from 'react';
import { ORBIT_STAGES } from '@/content/media-action';

// Rings from the outside in. Sizes are a share of the square; dots circle each ring
// at their own speed, and a few drift from the edge toward the core.
const RINGS = [
  { size: 100, border: 'border-2 border-dashed border-ink/35', dot: 'bg-ink/50', dots: 7, duration: '70s', fill: '' },
  { size: 75, border: 'border-2 border-ink', dot: 'bg-defender-red', dots: 5, duration: '50s', fill: '' },
  { size: 50, border: 'border-[3px] border-defender-red', dot: 'bg-defender-gold', dots: 4, duration: '34s', fill: 'bg-defender-red/[0.07]' },
  { size: 26, border: 'border-[3px] border-ink', dot: '', dots: 0, duration: '0s', fill: 'bg-defender-gold' },
];

const DRIFTERS = [
  { angle: 20, delay: '0s', duration: '7s' },
  { angle: 140, delay: '2.3s', duration: '8s' },
  { angle: 250, delay: '4.6s', duration: '7.5s' },
  { angle: 315, delay: '1.2s', duration: '9s' },
];

export function Orbit() {
  const [active, setActive] = useState(0);
  const stage = ORBIT_STAGES[active];

  return (
    <div className="grid lg:grid-cols-12 gap-10 items-center">
      {/* The rings */}
      <div className="lg:col-span-6">
        <div className="relative aspect-square w-full max-w-[540px] mx-auto overflow-hidden">
          <div className="absolute inset-[3%]">
          {RINGS.map((r, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={ORBIT_STAGES[i].ring}
              aria-pressed={active === i}
              className={`absolute rounded-full transition-shadow ${r.border} ${r.fill} ${
                active === i ? 'shadow-[0_0_0_6px_rgba(255,194,41,0.55)]' : 'hover:shadow-[0_0_0_4px_rgba(14,13,12,0.12)]'
              }`}
              style={{
                width: `${r.size}%`,
                height: `${r.size}%`,
                left: `${(100 - r.size) / 2}%`,
                top: `${(100 - r.size) / 2}%`,
              }}
            />
          ))}

          {/* Circling dots */}
          {RINGS.map((r, i) =>
            Array.from({ length: r.dots }).map((_, d) => (
              <div
                key={`${i}-${d}`}
                aria-hidden
                className="absolute pointer-events-none"
                style={{
                  width: `${r.size}%`,
                  height: `${r.size}%`,
                  left: `${(100 - r.size) / 2}%`,
                  top: `${(100 - r.size) / 2}%`,
                  transform: `rotate(${(360 / r.dots) * d}deg)`,
                }}
              >
                <div
                  className={i % 2 === 0 ? 'orbit absolute inset-0' : 'orbit-reverse absolute inset-0'}
                  style={{ ['--orbit-duration' as string]: r.duration }}
                >
                  <span className={`absolute left-1/2 -top-[6px] -translate-x-1/2 w-3 h-3 rounded-full border-2 border-ink ${r.dot}`} />
                </div>
              </div>
            ))
          )}

          {/* Dots drifting from the edge to the core */}
          {DRIFTERS.map((d, i) => (
            <div
              key={i}
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{ transform: `rotate(${d.angle}deg)` }}
            >
              <span
                className="drift-in absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-defender-red"
                style={{ animationDelay: d.delay, ['--drift-duration' as string]: d.duration }}
              />
            </div>
          ))}

          {/* Ring labels */}
          {ORBIT_STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`absolute left-1/2 -translate-x-1/2 kicker px-2 py-1 whitespace-nowrap transition-colors ${
                active === i ? 'bg-ink text-paper' : 'bg-paper text-ink border border-ink/30 hover:bg-ink hover:text-paper'
              }`}
              style={{ top: i === 3 ? '50%' : `${(100 - RINGS[i].size) / 2 + 2.5}%`, transform: i === 3 ? 'translate(-50%,-50%)' : undefined }}
            >
              {s.ring}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* The stage you tapped */}
      <div className="lg:col-span-6">
        <div className="flex flex-wrap gap-1.5 mb-6" role="tablist" aria-label="Stages">
          {ORBIT_STAGES.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-bold border-2 transition-colors ${
                active === i ? 'bg-ink border-ink text-paper' : 'bg-card border-ink/15 text-ink-2 hover:border-ink'
              }`}
            >
              {String(i + 1).padStart(2, '0')} {s.ring}
            </button>
          ))}
        </div>

        <div key={stage.id} className="rise">
          <h3 className="display text-[2.4rem] md:text-[3rem] text-ink">{stage.title}</h3>
          <p className="mt-4 font-serif text-[1.15rem] leading-relaxed text-ink-2">{stage.text}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {stage.chips.map((c) => (
              <li key={c} className="text-[12.5px] font-semibold border-2 border-ink bg-card px-2.5 py-1">
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-[2px] bg-ink border-2 border-ink">
            {stage.proof.map((p) => (
              <div key={p.label} className="flex-1 min-w-[9rem] bg-defender-gold px-4 py-3">
                <span className="display block text-[2.2rem] text-ink">{p.value}</span>
                <span className="block text-[12px] font-semibold text-ink/80 leading-snug">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
