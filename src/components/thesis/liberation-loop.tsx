import { ArrowDown, ArrowRight } from 'lucide-react';
import { LOOP_FLOWS, LOOP_NODES } from '@/content/media-action';
import { PILLAR_STYLE } from '@/lib/pillar-styles';

// Three stations on a turning wheel. Desktop shows the circle; phones get a stacked loop.
const POSITIONS = [
  { left: '50%', top: '9%' },
  { left: '77%', top: '76%' },
  { left: '23%', top: '76%' },
];

export function LiberationLoop() {
  return (
    <div className="grid lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-6">
        {/* Desktop: the wheel */}
        <div className="hidden md:block relative aspect-square w-full max-w-[520px] mx-auto">
          <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" aria-hidden>
            <g className="orbit" style={{ ['--orbit-duration' as string]: '30s', transformOrigin: '200px 200px' }}>
              <circle cx="200" cy="200" r="150" fill="none" stroke="#0E0D0C" strokeWidth="3" className="dash-flow" />
              {[0, 120, 240].map((a) => (
                <g key={a} transform={`rotate(${a + 60} 200 200)`}>
                  <path d="M200 44 l12 6 -12 6 z" fill="#E0263F" stroke="#0E0D0C" strokeWidth="2" />
                </g>
              ))}
            </g>
          </svg>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="display block text-[2rem] leading-none text-ink">The</span>
            <span className="display block text-[2.6rem] leading-none text-defender-red">Liberation</span>
            <span className="display block text-[2rem] leading-none text-ink">Loop</span>
          </div>

          {LOOP_NODES.map((n, i) => (
            <div
              key={n.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-[42%] border-2 border-ink shadow-[5px_5px_0_0_#0E0D0C] p-3 text-center ${PILLAR_STYLE[n.pillar].fill}`}
              style={POSITIONS[i]}
            >
              <span className="display block text-[1.5rem] leading-none">{n.name}</span>
              <span className="block text-[12px] font-semibold mt-1 leading-tight">{n.role}</span>
            </div>
          ))}
        </div>

        {/* Phones: a stacked loop */}
        <ol className="md:hidden space-y-3">
          {LOOP_NODES.map((n, i) => (
            <li key={n.id}>
              <div className={`border-2 border-ink p-4 ${PILLAR_STYLE[n.pillar].fill}`}>
                <span className="display block text-[1.8rem] leading-none">{n.name}</span>
                <span className="block text-[13px] font-semibold mt-1">{n.role}</span>
              </div>
              <div className="flex justify-center py-1" aria-hidden>
                <ArrowDown size={22} strokeWidth={2.5} className="float-y" />
              </div>
              {i === LOOP_NODES.length - 1 && (
                <p className="text-center kicker text-ink-3">And back to journalism</p>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="lg:col-span-6">
        <h3 className="display text-[2.4rem] md:text-[3rem] text-ink">Each part makes the others stronger</h3>
        <p className="mt-4 font-serif text-[1.15rem] leading-relaxed text-ink-2">
          Our journalism, our mutual aid, and our arts and culture are not separate departments. They are one loop, and every
          turn brings more people in and sends them back out with more power.
        </p>
        <ol className="mt-6 space-y-3">
          {LOOP_FLOWS.map((f) => (
            <li key={f.from} className="border-2 border-ink bg-card p-4">
              <span className="kicker inline-flex items-center gap-1.5 text-ink">
                {f.from} <ArrowRight size={13} className="float-x" /> {f.to}
              </span>
              <p className="mt-1.5 text-[14.5px] text-ink-2 leading-relaxed">{f.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid grid-cols-3 gap-[2px] bg-ink border-2 border-ink">
          {LOOP_NODES.map((n) => (
            <div key={n.id} className="bg-paper px-3 py-3">
              <span className={`kicker block ${PILLAR_STYLE[n.pillar].text}`}>{n.name}</span>
              <span className="block text-[13px] font-semibold text-ink mt-1 leading-snug">{n.stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
