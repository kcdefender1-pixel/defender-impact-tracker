import { ArrowDown } from 'lucide-react';
import { GIVE, PILLARS } from '@/content/impact-2026';
import { PILLAR_STYLE } from '@/lib/pillar-styles';

// Every dollar fans out into an outcome on every pillar, with Hamer as the worked example.
// Desktop draws flowing lines from the core to each return; phones stack it top to bottom.
const ROW = 92; // card height + gap, in px, so the lines meet each card's middle
const CARD = 80;

export function Give() {
  const n = GIVE.outcomes.length;
  const height = n * ROW - (ROW - CARD);
  const mid = height / 2;

  return (
    <div>
      <div className="grid lg:grid-cols-[300px_110px_1fr] items-center gap-y-4">
        {/* The dollar */}
        <div className="flex flex-col items-center text-center">
          <div className="btn-glow rounded-full w-64 h-64 bg-defender-gold border-[3px] border-ink flex flex-col items-center justify-center p-6 shadow-[6px_6px_0_0_#0E0D0C]">
            <span className="star-pulse flex items-center justify-center w-11 h-11 rounded-full bg-ink text-defender-gold border-2 border-ink display text-[1.7rem] leading-none mb-2" aria-hidden>
              $
            </span>
            <span className="kicker text-ink/70">{GIVE.exampleLabel}</span>
            <span className="display text-[2.4rem] md:text-[2.8rem] leading-none mt-2 text-ink">{GIVE.center}</span>
            <span className="mt-2 text-[13px] font-bold text-ink">in {GIVE.example}</span>
          </div>
          <p className="mt-5 text-[13.5px] text-ink-2 leading-snug max-w-[17rem]">{GIVE.exampleNote}</p>
        </div>

        {/* Lines fanning out (desktop) */}
        <svg viewBox={`0 0 110 ${height}`} className="hidden lg:block w-full" style={{ height }} aria-hidden>
          {GIVE.outcomes.map((_, i) => {
            const y = i * ROW + CARD / 2;
            const d = `M0 ${mid} C 55 ${mid}, 55 ${y}, 110 ${y}`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="#0E0D0C" strokeWidth="3" className="dash-flow" />
                {/* A dollar coin traveling out to each pillar */}
                <g className="flow-dollar">
                  <circle r="10" fill="#FFC229" stroke="#0E0D0C" strokeWidth="2" />
                  <text textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="800" fill="#0E0D0C">
                    $
                  </text>
                  <animateMotion dur="2.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={d} />
                </g>
              </g>
            );
          })}
        </svg>
        <div className="lg:hidden flex justify-center items-center gap-2" aria-hidden>
          <span className="float-y flex items-center justify-center w-8 h-8 rounded-full bg-defender-gold border-2 border-ink display text-[1.2rem] leading-none">$</span>
          <ArrowDown size={26} strokeWidth={2.5} className="float-y" />
        </div>

        {/* The outcomes */}
        <ol className="space-y-3 lg:space-y-0 lg:grid" style={{ rowGap: ROW - CARD }}>
          {GIVE.outcomes.map((o) => (
            <li
              key={o.label}
              className="flex items-stretch border-2 border-ink bg-card lg:h-[80px] overflow-hidden"
            >
              <span className={`flex items-center justify-center shrink-0 w-24 md:w-28 border-r-2 border-ink ${PILLAR_STYLE[o.pillar].fill}`}>
                <span className="display text-[1.9rem] md:text-[2.2rem] leading-none">{o.value}</span>
              </span>
              <span className="flex flex-col justify-center px-4 py-2.5">
                <span className={`kicker ${PILLAR_STYLE[o.pillar].text}`}>{'tag' in o ? o.tag : PILLARS[o.pillar].label}</span>
                <span className="text-[13px] font-semibold text-ink leading-tight mt-0.5">{o.label}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Siloed funding vs. the Defender */}
      <div className="mt-14 grid md:grid-cols-2 gap-5">
        {GIVE.compare.map((c, i) => (
          <div
            key={c.title}
            className={`border-2 border-ink p-6 md:p-7 ${i === 0 ? 'bg-paper-2 text-ink-2' : 'bg-ink text-paper shadow-[6px_6px_0_0_#E0263F]'}`}
          >
            <span className={`display block text-[2rem] md:text-[2.3rem] ${i === 0 ? 'text-ink-3' : 'text-defender-gold'}`}>{c.title}</span>
            <ul className="mt-4 space-y-2.5">
              {c.points.map((p, j) => (
                <li
                  key={p}
                  className={`flex gap-3 text-[15px] leading-snug ${j === c.points.length - 1 ? 'font-bold' : ''} ${
                    i === 0 ? '' : 'text-paper'
                  }`}
                >
                  <span className={`mt-[7px] w-2 h-2 shrink-0 ${i === 0 ? 'bg-ink-4' : 'bg-defender-red'}`} aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* How people give */}
      <div className="mt-14 grid md:grid-cols-3 gap-[2px] bg-ink border-2 border-ink">
        {GIVE.ways.map((w, i) => (
          <div key={w.title} className={`p-6 md:p-7 ${i === 0 ? 'bg-defender-gold' : 'bg-card'}`}>
            <span className="display block text-[1.7rem] md:text-[1.9rem] leading-[1] text-ink">{w.title}</span>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{w.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[14px] font-semibold text-ink-3">{GIVE.independence}</p>

      <p className="mt-10 font-serif italic text-[1.5rem] md:text-[2rem] leading-snug text-ink max-w-4xl border-l-4 border-defender-red pl-5">
        {GIVE.closer}
      </p>
    </div>
  );
}
