import { ArrowDown, ArrowRight } from 'lucide-react';
import { FORK, PARTNERS_SHORT } from './fork-data';

// Many doors narrow into one path, which splits at the end: out into the movement,
// or in to the Defender. Dashed lines flow along the route.
function Flow({ vertical = false }: { vertical?: boolean }) {
  return vertical ? (
    <svg viewBox="0 0 20 48" className="w-5 h-12 mx-auto" aria-hidden>
      <line x1="10" y1="0" x2="10" y2="48" stroke="#0E0D0C" strokeWidth="3" className="dash-flow" />
    </svg>
  ) : (
    <svg viewBox="0 0 64 20" className="w-full h-5" aria-hidden preserveAspectRatio="none">
      <line x1="0" y1="10" x2="64" y2="10" stroke="#0E0D0C" strokeWidth="3" className="dash-flow" />
    </svg>
  );
}

export function Fork() {
  return (
    <div>
      {/* Desktop: left to right */}
      <div className="hidden lg:grid grid-cols-[1.1fr_56px_0.8fr_56px_0.8fr_72px_1.4fr] items-center">
        <div className="border-2 border-ink bg-card p-4">
          <span className="kicker text-ink-3 block mb-2">Many doors</span>
          <ul className="space-y-1.5">
            {FORK.doors.map((d) => (
              <li key={d} className="text-[13px] font-semibold text-ink border-l-4 border-defender-red pl-2">
                {d}
              </li>
            ))}
          </ul>
        </div>
        <Flow />
        <div className="border-2 border-ink bg-ink text-paper p-4 text-center">
          <span className="display block text-[1.7rem] leading-none">{FORK.orbit}</span>
          <span className="block text-[12px] text-paper/75 mt-2">{FORK.orbitNote}</span>
        </div>
        <Flow />
        <div className="border-2 border-ink bg-defender-red text-white p-4 text-center">
          <span className="display block text-[1.7rem] leading-none">{FORK.act}</span>
          <span className="block text-[12px] text-white/85 mt-2">{FORK.actNote}</span>
        </div>

        {/* The split */}
        <svg viewBox="0 0 72 240" className="w-full h-[240px]" aria-hidden preserveAspectRatio="none">
          <path d="M0 120 C 36 120, 36 40, 72 40" fill="none" stroke="#0E0D0C" strokeWidth="3" className="dash-flow" />
          <path d="M0 120 C 36 120, 36 200, 72 200" fill="none" stroke="#0E0D0C" strokeWidth="3" className="dash-flow" />
        </svg>

        <div className="space-y-4">
          <Branch title={FORK.movement.title} tone="gold" items={FORK.movement.items} note={PARTNERS_SHORT} />
          <Ladder title={FORK.defender.title} steps={FORK.defender.steps} />
        </div>
      </div>

      {/* Phones and tablets: top to bottom */}
      <div className="lg:hidden">
        <div className="border-2 border-ink bg-card p-4">
          <span className="kicker text-ink-3 block mb-2">Many doors</span>
          <ul className="flex flex-wrap gap-1.5">
            {FORK.doors.map((d) => (
              <li key={d} className="text-[12.5px] font-semibold border border-ink px-2 py-0.5">{d}</li>
            ))}
          </ul>
        </div>
        <Flow vertical />
        <div className="border-2 border-ink bg-ink text-paper p-4 text-center">
          <span className="display block text-[1.7rem] leading-none">{FORK.orbit}</span>
          <span className="block text-[12px] text-paper/75 mt-1">{FORK.orbitNote}</span>
        </div>
        <Flow vertical />
        <div className="border-2 border-ink bg-defender-red text-white p-4 text-center">
          <span className="display block text-[1.7rem] leading-none">{FORK.act}</span>
          <span className="block text-[12px] text-white/85 mt-1">{FORK.actNote}</span>
        </div>
        <div className="flex justify-around py-1" aria-hidden>
          <ArrowDown size={22} strokeWidth={2.5} className="float-y -rotate-[30deg]" />
          <ArrowDown size={22} strokeWidth={2.5} className="float-y rotate-[30deg]" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Branch title={FORK.movement.title} tone="gold" items={FORK.movement.items} note={PARTNERS_SHORT} />
          <Ladder title={FORK.defender.title} steps={FORK.defender.steps} />
        </div>
      </div>
    </div>
  );
}

function Branch({ title, items, note }: { title: string; tone: 'gold'; items: string[]; note: string }) {
  return (
    <div className="border-2 border-ink bg-defender-gold p-4 shadow-[5px_5px_0_0_#0E0D0C]">
      <span className="display block text-[1.7rem] leading-none text-ink">{title}</span>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
        {items.map((it) => (
          <li key={it} className="text-[13px] font-semibold text-ink">• {it}</li>
        ))}
      </ul>
      <p className="mt-3 text-[12px] text-ink/75 leading-snug">{note}</p>
    </div>
  );
}

function Ladder({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="border-2 border-ink bg-defender-green text-white p-4 shadow-[5px_5px_0_0_#0E0D0C]">
      <span className="display block text-[1.7rem] leading-none">{title}</span>
      <ol className="mt-3 flex flex-wrap items-center gap-1.5">
        {steps.map((st, i) => (
          <li key={st} className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold bg-ink text-paper px-2 py-1">{st}</span>
            {i < steps.length - 1 && <ArrowRight size={14} className="float-x" aria-hidden />}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[12px] text-white/85 leading-snug">Most people come in through our mutual aid team.</p>
    </div>
  );
}
