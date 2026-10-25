'use client';

import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { DOOR_PATHS } from '@/content/media-action';

const STEP_TONES = ['bg-card text-ink', 'bg-ink text-paper', 'bg-defender-red text-white', 'bg-defender-gold text-ink'];

export function ChooseDoor() {
  const [active, setActive] = useState(0);
  const path = DOOR_PATHS[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Choose a person">
        {DOOR_PATHS.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`text-left border-2 px-4 py-3 transition-all ${
              active === i
                ? 'bg-ink border-ink text-paper shadow-[5px_5px_0_0_#E0263F]'
                : 'bg-card border-ink/20 text-ink hover:border-ink'
            }`}
          >
            <span className="display block text-[1.3rem] leading-none">{p.who}</span>
            <span className={`block text-[12px] mt-1 ${active === i ? 'text-paper/70' : 'text-ink-3'}`}>{p.door}</span>
          </button>
        ))}
      </div>

      {/* Steps appear one after another each time you pick someone */}
      <ol key={path.id} className="grid lg:grid-cols-4 gap-4 lg:gap-0">
        {path.steps.map((st, i) => (
          <li key={st} className="relative flex lg:block flex-col">
            <div
              className={`rise h-full border-2 border-ink p-5 lg:mr-10 ${STEP_TONES[i % STEP_TONES.length]}`}
              style={{ animationDelay: `${i * 260}ms` }}
            >
              <span className="display block text-[2.4rem] leading-none opacity-80">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-3 font-serif text-[1.12rem] leading-snug">{st}</p>
            </div>
            {i < path.steps.length - 1 && (
              <>
                <span className="hidden lg:flex absolute right-1 top-1/2 -translate-y-1/2 rise" style={{ animationDelay: `${i * 260 + 130}ms` }} aria-hidden>
                  <ArrowRight size={26} strokeWidth={2.5} className="float-x" />
                </span>
                <span className="lg:hidden flex justify-center pt-3" aria-hidden>
                  <ArrowDown size={24} strokeWidth={2.5} className="float-y" />
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-6 kicker text-ink-3">Composite paths, drawn from real Defender programs and stories.</p>
    </div>
  );
}
