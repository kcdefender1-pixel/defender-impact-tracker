import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  DOORS,
  HEADLINE_STATS,
  IMPACT_AREAS,
  MORE_STATS,
  NARRATIVE,
  PARTNERS,
  PATHWAY,
  PILLARS,
  PULL_QUOTE,
  RECOGNITION,
  THESIS,
  WHO_FOR,
  WHY_NOW,
} from '@/content/impact-2026';
import { PILLAR_STYLE } from '@/lib/pillar-styles';
import { YearTimeline } from '@/components/public/year-timeline';
import { WinsBoard } from '@/components/public/wins-board';

export default function ImpactPage() {
  return (
    <div>
      {/* ── Cover ─────────────────────────────────────────────── */}
      <section className="bg-defender-red text-ink relative overflow-hidden border-b-2 border-ink">
        <div
          aria-hidden
          className="display absolute -right-6 -bottom-10 md:-bottom-16 text-[14rem] md:text-[24rem] leading-none text-ink/[0.07] select-none pointer-events-none"
        >
          2026
        </div>

        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 pt-10 pb-12 md:pt-14 md:pb-16 grid md:grid-cols-12 gap-10 md:gap-8 items-end">
          <div className="md:col-span-7 rise">
            <span className="kicker inline-block bg-ink text-paper px-2.5 py-1 mb-6">{THESIS.kicker}</span>
            <h1 className="display text-[clamp(3.6rem,10vw,9rem)] text-ink">
              Media that <span className="text-paper">builds power.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[17px] md:text-[18px] font-medium text-ink/85 leading-relaxed">
              {THESIS.dek}
            </p>
            <a
              href="#power"
              className="mt-8 inline-flex items-center gap-2 bg-ink text-paper rounded-button px-5 py-3 text-[14px] font-bold hover:bg-paper hover:text-ink transition-colors"
            >
              Read our story <ArrowRight size={16} />
            </a>
          </div>

          <div className="md:col-span-5 flex flex-col gap-2.5">
            {HEADLINE_STATS.map((s, i) => (
              <CoverStat key={s.label} value={s.value} label={s.label} index={i} />
            ))}
            <span className="kicker text-ink/70 mt-2 text-right">In 2026 alone</span>
          </div>
        </div>
      </section>

      {/* ── Why now ───────────────────────────────────────────── */}
      <section className="bg-ink text-paper border-b-2 border-ink" aria-label="Why now">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-10 md:py-12 grid md:grid-cols-12 gap-8 items-start">
          <h2 className="md:col-span-3 display text-[2.4rem] md:text-[2.8rem] text-defender-gold">
            The old press is going dark.
          </h2>
          <div className="md:col-span-9 grid sm:grid-cols-3 gap-6 md:gap-8">
            {WHY_NOW.map((w) => (
              <div key={w.stat} className="border-t-2 border-paper/25 pt-4">
                <span className="display block text-[1.9rem] text-defender-red">{w.stat}</span>
                <p className="mt-2 text-[14.5px] leading-relaxed text-paper/80">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Power: the narrative ──────────────────────────── */}
      <section id="power" className="max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10">
          <aside className="md:col-span-3">
            <div className="md:sticky md:top-32">
              <p className="kicker text-defender-red mb-3">Our Power</p>
              <h2 className="display text-[2.6rem] md:text-[3.1rem] text-ink">
                Where they tune out, we tune in.
              </h2>
            </div>
          </aside>

          <article className="md:col-span-8 md:col-start-5 font-serif text-ink">
            {NARRATIVE.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'dropcap text-[1.45rem] md:text-[1.7rem] leading-[1.42] mb-7'
                    : 'text-[1.15rem] md:text-[1.28rem] leading-[1.65] text-ink-2 mb-6'
                }
              >
                {p}
              </p>
            ))}
            <blockquote className="mt-12 pt-8 border-t-2 border-ink">
              <p className="italic text-[1.9rem] md:text-[2.6rem] leading-[1.12] tracking-[-0.01em]">
                {PULL_QUOTE}
              </p>
            </blockquote>
          </article>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 md:px-8">
        {/* ── How it fits ───────────────────────────────────────── */}
        <section id="how" className="py-16 md:py-20 border-t-2 border-ink">
          <SectionHead
            title="How It Fits"
            dek="Journalism, mutual aid, political education, and culture are not separate programs. They are one path, and every step builds power."
          />

          {/* The path */}
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[2px] bg-ink border-2 border-ink mb-14">
            {PATHWAY.map((p, i) => (
              <li key={p.step} className={`relative p-5 md:p-6 ${i === PATHWAY.length - 1 ? 'bg-defender-red text-white sm:col-span-2 lg:col-span-1' : 'bg-card'}`}>
                <span className={`kicker block mb-2 ${i === PATHWAY.length - 1 ? 'text-white/80' : 'text-ink-4'}`}>
                  Step {i + 1}
                </span>
                <span className="display block text-[2.4rem]">{p.step}</span>
                <p className={`mt-2 text-[14px] leading-snug ${i === PATHWAY.length - 1 ? 'text-white/90' : 'text-ink-2'}`}>
                  {p.text}
                </p>
                {i < PATHWAY.length - 1 && (
                  <ArrowRight
                    size={22}
                    strokeWidth={2.5}
                    className="hidden lg:block absolute -right-[13px] top-1/2 -translate-y-1/2 z-10 bg-paper border-2 border-ink rounded-full p-0.5"
                    aria-hidden
                  />
                )}
              </li>
            ))}
          </ol>

          {/* Who it is for */}
          <h3 className="display text-[2rem] md:text-[2.4rem] mb-6">Who the Defender is for</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {WHO_FOR.map((w) => (
              <div key={w.who} className="border-2 border-ink bg-card p-5">
                <span className="font-serif font-semibold text-[1.3rem] block">{w.who}</span>
                <p className="mt-1.5 text-[14.5px] text-ink-2 leading-relaxed">{w.why}</p>
              </div>
            ))}
          </div>

          {/* Into the movement */}
          <div className="bg-ink text-paper p-6 md:p-8 border-2 border-ink">
            <span className="kicker text-defender-gold block mb-3">Into the movement</span>
            <p className="font-serif text-[1.25rem] md:text-[1.45rem] leading-snug max-w-3xl">
              The Defender is the media arm of a broader movement. The people we reach go on to join and
              build alongside organizations across the region.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {PARTNERS.map((p) => (
                <li key={p} className="text-[13px] font-semibold border border-paper/30 rounded-full px-3 py-1">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Impact areas ──────────────────────────────────────── */}
        <section id="areas" className="py-16 md:py-20 border-t-2 border-ink">
          <SectionHead
            title="Impact Areas"
            dek="Where the work moves the needle, with the receipts."
          />
          <div className="grid md:grid-cols-2 gap-5">
            {IMPACT_AREAS.map((a) => {
              const style = PILLAR_STYLE[a.pillar];
              return (
                <article key={a.id} className="border-2 border-ink bg-card flex flex-col">
                  <div className={`px-6 py-4 border-b-2 border-ink ${style.fill}`}>
                    <h3 className="display text-[2rem] md:text-[2.3rem]">{a.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="font-serif font-semibold text-[1.3rem] leading-snug">{a.claim}</p>
                    <ul className="mt-5 space-y-3">
                      {a.proof.map((p) => (
                        <li key={p} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-2">
                          <span className={`mt-[7px] w-2 h-2 shrink-0 ${style.dot} ring-1 ring-ink`} aria-hidden />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── The Year ──────────────────────────────────────────── */}
        <section id="year" className="py-16 md:py-20 border-t-2 border-ink">
          <SectionHead
            title="The Year"
            dek="From January to now, in order. Filter by type of work, or open any win for the full story."
          />
          <YearTimeline />
        </section>

        {/* ── Wins ──────────────────────────────────────────────── */}
        <section id="wins" className="py-16 md:py-20 border-t-2 border-ink">
          <SectionHead title="Victory Board" dek="The wins of 2026. Open any card for the full story and what changed." />
          <WinsBoard />
        </section>

        {/* ── Programs ──────────────────────────────────────────── */}
        <section id="programs" className="py-16 md:py-20 border-t-2 border-ink">
          <SectionHead title="The Doors" dek="Every program is a way in. Each one leads to the same home." />
          <div className="grid md:grid-cols-2 gap-5">
            {DOORS.map((d, i) => (
              <DoorCard key={d.name} door={d} wide={DOORS.length % 2 === 1 && i === DOORS.length - 1} />
            ))}
          </div>
        </section>

        {/* ── By the numbers ────────────────────────────────────── */}
        <section id="numbers" className="py-16 md:py-20 border-t-2 border-ink">
          <SectionHead title="By the Numbers" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[2px] bg-ink border-2 border-ink">
            {[...HEADLINE_STATS, ...MORE_STATS].map((s) => (
              <div key={s.label} className="bg-card p-5 md:p-6">
                <span className="display block text-[2.8rem] md:text-[3.4rem] tabular-nums text-ink">{s.value}</span>
                <span className="block mt-2 text-[13px] font-semibold text-ink-2 leading-snug">{s.label}</span>
              </div>
            ))}
          </div>

          <h3 className="display text-[2rem] md:text-[2.4rem] mt-14 mb-6">Recognition</h3>
          <ul className="grid sm:grid-cols-2 gap-4">
            {RECOGNITION.map((r) => (
              <li key={r.who} className="border-l-4 border-defender-red pl-4 py-1">
                <span className="kicker text-ink-3 block">{r.date}</span>
                <span className="font-serif font-semibold text-[1.2rem] block mt-1">{r.who}</span>
                <span className="text-[14.5px] text-ink-2">{r.what}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ── Close ─────────────────────────────────────────────── */}
      <section className="bg-defender-red border-t-2 border-ink" data-print-hide>
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-20 grid md:grid-cols-12 gap-8 items-end">
          <h2 className="md:col-span-7 display text-[clamp(3rem,7vw,6rem)] text-ink">
            Build the house <span className="text-paper">with us.</span>
          </h2>
          <div className="md:col-span-5 flex flex-wrap gap-3 md:justify-end">
            <a
              href="https://kansascitydefender.com/support-us/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-ink text-paper rounded-button px-5 py-3 text-[14px] font-bold hover:bg-paper hover:text-ink transition-colors"
            >
              Support the Defender <ArrowUpRight size={16} />
            </a>
            <a
              href="https://kansascitydefender.com/join/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border-2 border-ink text-ink rounded-button px-5 py-[10px] text-[14px] font-bold hover:bg-ink hover:text-paper transition-colors"
            >
              Become a member <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Sub-components ---

function SectionHead({ title, dek }: { title: string; dek?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <h2 className="slab">{title}</h2>
      {dek && <p className="mt-4 text-[16px] md:text-[17px] text-ink-2 leading-relaxed">{dek}</p>}
    </div>
  );
}

const COVER_STAT_STYLES = [
  { bar: 'bg-ink', value: 'text-defender-red', label: 'text-paper', tilt: 'md:-rotate-[1.2deg]' },
  { bar: 'bg-paper', value: 'text-defender-red', label: 'text-ink', tilt: 'md:rotate-[0.8deg]' },
  { bar: 'bg-ink', value: 'text-defender-gold', label: 'text-paper', tilt: 'md:-rotate-[0.5deg]' },
  { bar: 'bg-paper', value: 'text-ink', label: 'text-ink', tilt: 'md:rotate-[1deg]' },
];

function CoverStat({ value, label, index }: { value: string; label: string; index: number }) {
  const s = COVER_STAT_STYLES[index % COVER_STAT_STYLES.length];
  return (
    <div
      className={`rise ${s.bar} ${s.tilt} flex items-center justify-between gap-4 px-5 py-3 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]`}
      style={{ animationDelay: `${150 + index * 90}ms` }}
    >
      <span className={`display text-[clamp(2.6rem,4.6vw,3.8rem)] tabular-nums ${s.value}`}>{value}</span>
      <span className={`display text-right text-[clamp(1.05rem,1.8vw,1.4rem)] leading-[0.95] ${s.label}`}>
        {label}
      </span>
    </div>
  );
}

function DoorCard({ door, wide }: { door: (typeof DOORS)[number]; wide?: boolean }) {
  const style = PILLAR_STYLE[door.pillar];
  return (
    <article className={`flex flex-col border-2 border-ink bg-card overflow-hidden ${wide ? 'md:col-span-2 md:flex-row' : ''}`}>
      {door.image ? (
        <div className={`relative aspect-[16/9] border-ink bg-paper-2 ${wide ? 'border-b-2 md:border-b-0 md:border-r-2 md:w-1/2 md:aspect-auto md:min-h-[22rem]' : 'border-b-2'}`}>
          <Image src={door.image} alt={door.name} fill sizes="(min-width: 768px) 640px, 100vw" className="object-cover" />
        </div>
      ) : (
        <div className={`h-3 ${style.dot}`} />
      )}
      <div className={`p-6 flex flex-col flex-1 ${wide ? 'md:p-10 md:justify-center' : ''}`}>
        <span className={`kicker ${style.text} mb-2`}>{PILLARS[door.pillar].label}</span>
        <h3 className="display text-[2rem] md:text-[2.3rem]">{door.name}</h3>
        <p className="mt-3 text-[15px] text-ink-2 leading-relaxed">{door.what}</p>
        <p className="mt-4 font-serif font-semibold text-[1.12rem] text-ink leading-snug border-l-4 border-ink pl-3">
          {door.proof}
        </p>
        {door.link && (
          <a
            href={door.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto pt-5 inline-flex items-center gap-1 text-[13px] font-bold text-ink hover:text-defender-red transition-colors self-start"
          >
            Learn more <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
