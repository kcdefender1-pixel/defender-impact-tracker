import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import {
  DOORS,
  FUNDERS,
  FUNDERS_THANKS,
  HEADLINE_STATS,
  IMPACT_AREAS,
  IMPACT_AREAS_INTRO,
  MORE_STATS,
  NEXT,
  NARRATIVE,
  PARTNERS,
  PATHWAY,
  PILLARS,
  PULL_QUOTE,
  RECOGNITION,
  SPOTLIGHT,
  TEAM,
  TEAM_THANKS,
  TESTIMONIALS,
  THESIS,
  WHO_FOR,
  WHY_NOW,
  WILLAS,
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
            <a
              href="#spotlight"
              className="rise mt-3 self-end inline-flex items-center gap-2.5 bg-ink text-paper pl-2.5 pr-4 py-2 border-2 border-ink hover:bg-paper hover:text-ink transition-colors"
              style={{ animationDelay: '600ms' }}
            >
              <Star size={22} strokeWidth={1.5} className="star-pulse fill-defender-gold text-defender-gold shrink-0" aria-hidden />
              <span className="text-[12.5px] font-bold leading-tight">
                Selected by Columbia Journalism School&apos;s Lipman Center
              </span>
            </a>
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

        {/* ── Willa's Books x Defender Liberation Hub ──────────── */}
        <section id="willas" className="py-16 md:py-20 border-t-2 border-ink">
          <div className="glow-card border-2 border-ink bg-ink text-paper overflow-hidden">
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-7 p-6 md:p-10">
                <span className="kicker inline-flex items-center gap-2 text-defender-gold">
                  <Star size={16} strokeWidth={1.5} className="star-pulse fill-defender-gold text-defender-gold" aria-hidden />
                  {WILLAS.kicker}
                </span>
                <h2 className="display text-[clamp(2.6rem,5.5vw,4.6rem)] mt-4">{WILLAS.headline}</h2>
                <p className="mt-4 font-serif italic text-[1.35rem] text-paper/85">{WILLAS.dek}</p>

                {/* The shelf: hover a spine */}
                <div className="mt-8 flex items-end gap-2 h-[190px]" aria-label="Authors in the Willa’s collection">
                  {WILLAS.shelf.map((name, i) => (
                    <div
                      key={name}
                      className={`group relative flex-1 max-w-[74px] border-2 border-paper flex items-end justify-center pb-3 transition-transform duration-300 hover:-translate-y-3 ${
                        ['bg-defender-red', 'bg-defender-gold text-ink', 'bg-defender-green', 'bg-defender-violet text-ink'][i % 4]
                      }`}
                      style={{ height: `${[100, 88, 94, 82][i % 4]}%` }}
                    >
                      <span className="display text-[1.05rem] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
                        {name}
                      </span>
                    </div>
                  ))}
                  <div className="flex-1 max-w-[120px] h-[70%] border-2 border-dashed border-paper/50 flex items-center justify-center text-center px-2">
                    <span className="display text-[1.5rem] leading-none text-defender-gold">
                      +10,000
                      <span className="block text-[0.8rem] text-paper/70 mt-1">volumes</span>
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-paper/80 mt-0" aria-hidden />
                <p className="mt-4 text-[14.5px] text-paper/80 leading-relaxed max-w-xl">{WILLAS.shelfNote}</p>
              </div>
              <div className="lg:col-span-5 relative min-h-[18rem] border-t-2 lg:border-t-0 lg:border-l-2 border-paper/30">
                <Image src={WILLAS.image} alt={WILLAS.imageAlt} fill sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" />
              </div>
            </div>

            <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-[2px] bg-paper/25 border-t-2 border-paper/30">
              {WILLAS.steps.map((st, i) => (
                <li key={st.title} className={`p-5 md:p-6 ${i === WILLAS.steps.length - 1 ? 'bg-defender-gold text-ink' : 'bg-ink'}`}>
                  <span className={`display block text-[2.2rem] ${i === WILLAS.steps.length - 1 ? 'text-ink' : 'text-defender-red'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-serif font-semibold text-[1.2rem] block mt-1">{st.title}</span>
                  <p className={`mt-2 text-[14px] leading-relaxed ${i === WILLAS.steps.length - 1 ? 'text-ink/80' : 'text-paper/75'}`}>
                    {st.text}
                  </p>
                </li>
              ))}
            </ol>
            <p className="kicker text-paper/60 px-6 md:px-10 py-4 border-t-2 border-paper/30">{WILLAS.credit}</p>
          </div>
        </section>

        {/* ── Impact areas ──────────────────────────────────────── */}
        <section id="areas" className="py-16 md:py-20 border-t-2 border-ink">
          <SectionHead title="Impact Areas" dek={IMPACT_AREAS_INTRO} />
          <div className="grid md:grid-cols-2 gap-5">
            {IMPACT_AREAS.map((a, i) => {
              const style = PILLAR_STYLE[a.pillar];
              const wide = IMPACT_AREAS.length % 2 === 1 && i === IMPACT_AREAS.length - 1;
              return (
                <article key={a.id} className={`border-2 border-ink bg-card flex flex-col ${wide ? 'md:col-span-2' : ''}`}>
                  <div className={`px-6 py-4 border-b-2 border-ink ${style.fill}`}>
                    <h3 className="display text-[2rem] md:text-[2.3rem]">{a.name}</h3>
                    <p className="kicker mt-1 opacity-80">Speaks to: {a.speaksTo.join(' · ')}</p>
                  </div>
                  <div className="p-6">
                    <p className="font-serif font-semibold text-[1.3rem] leading-snug">{a.claim}</p>
                    <ul className={`mt-5 grid gap-3 ${wide ? 'md:grid-cols-2 md:gap-x-8' : ''}`}>
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

        {/* ── In their words ───────────────────────────────────── */}
        <section className="py-16 md:py-20 border-t-2 border-ink" aria-labelledby="words-title">
          <h2 id="words-title" className="slab mb-10">In Their Words</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.quote}
                className={`border-2 border-ink p-7 md:p-8 flex flex-col justify-between ${
                  i % 3 === 0 ? 'bg-defender-gold' : i % 3 === 1 ? 'bg-card' : 'bg-ink text-paper'
                }`}
              >
                <blockquote className="font-serif italic text-[1.6rem] md:text-[1.9rem] leading-[1.18]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className={`kicker mt-6 ${i % 3 === 2 ? 'text-paper/70' : 'text-ink-3'}`}>
                  {t.who}
                </figcaption>
              </figure>
            ))}
          </div>
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
          <a
            id="spotlight"
            href={SPOTLIGHT.href}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-card scroll-mt-40 group mb-8 grid md:grid-cols-[auto_1fr] gap-6 items-center border-2 border-ink bg-defender-gold p-6 md:p-8"
          >
            <Star size={72} strokeWidth={1.25} className="star-pulse fill-ink text-ink" aria-hidden />
            <div>
              <span className="kicker text-ink/70">{SPOTLIGHT.kicker}</span>
              <span className="display block text-[1.9rem] md:text-[2.5rem] mt-1 text-ink">{SPOTLIGHT.title}</span>
              <p className="mt-2 text-[15.5px] text-ink/85 leading-relaxed max-w-3xl">{SPOTLIGHT.text}</p>
              <p className="mt-4 font-serif italic text-[1.15rem] text-ink">
                &ldquo;{SPOTLIGHT.quote}&rdquo;
                <span className="not-italic font-sans text-[12px] font-semibold text-ink/70 block mt-1">{SPOTLIGHT.quoteBy}</span>
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-ink border-b-2 border-ink group-hover:gap-2 transition-all">
                Read Columbia&apos;s announcement <ArrowUpRight size={14} />
              </span>
            </div>
          </a>
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

      {/* ── What's next ──────────────────────────────────────── */}
      <section id="next" className="bg-defender-red border-t-2 border-ink">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <span className="kicker inline-block bg-ink text-paper px-2.5 py-1 mb-6">What&apos;s next</span>
          <h2 className="display text-[clamp(3rem,7vw,6rem)] text-ink max-w-4xl">
            {NEXT.headline.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-paper">{NEXT.headline.split(' ').slice(-1)}</span>
          </h2>
          <p className="mt-6 display text-[2.2rem] md:text-[2.8rem] text-paper">{NEXT.lead}</p>
          <p className="mt-3 max-w-3xl text-[17px] md:text-[18px] font-medium text-ink/85 leading-relaxed">{NEXT.dek}</p>

          {/* Reach, widening ring by ring: KC to the world */}
          <ol className="mt-12 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {NEXT.reach.map((r, i) => (
              <li
                key={r.scope}
                className="relative border-2 border-ink bg-ink text-paper p-6 md:p-7 shadow-[6px_6px_0_0_#0E0D0C] overflow-hidden"
              >
                <span
                  aria-hidden
                  className="absolute -right-10 -top-10 rounded-full border-[3px] border-defender-red/60"
                  style={{ width: `${90 + i * 45}px`, height: `${90 + i * 45}px` }}
                />
                <span className="kicker text-defender-gold">{String(i + 1).padStart(2, '0')} · {r.scope}</span>
                <span className="display block text-[2rem] md:text-[2.3rem] mt-3 relative">{r.title}</span>
                <p className="mt-3 text-[14.5px] text-paper/80 leading-relaxed relative">{r.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="kicker text-ink mr-1">Across every medium:</span>
            {NEXT.mediums.map((m) => (
              <span key={m} className="text-[13px] font-bold bg-paper text-ink border-2 border-ink rounded-full px-3 py-1">
                {m}
              </span>
            ))}
          </div>

          <h3 className="display text-[2.2rem] md:text-[2.6rem] text-ink mt-16 mb-6">{NEXT.powerHeadline}</h3>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-ink border-2 border-ink">
            {NEXT.goals.map((g, i) => (
              <li key={g.title} className="bg-paper p-5 md:p-6">
                <span className="display block text-[2.6rem] text-defender-red">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-serif font-semibold text-[1.2rem] leading-snug block mt-2">{g.title}</span>
                <p className="mt-2 text-[14px] text-ink-2 leading-relaxed">{g.text}</p>
              </li>
            ))}
          </ol>

          <h3 className="display text-[2.2rem] md:text-[2.6rem] text-ink mt-16 mb-6">Get involved</h3>
          <div className="grid md:grid-cols-3 gap-4" data-print-hide>
            {NEXT.ways.map((w, i) => (
              <a
                key={w.label}
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group border-2 border-ink p-6 flex flex-col shadow-[6px_6px_0_0_#0E0D0C] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_#0E0D0C] ${
                  i === 0 ? 'bg-ink text-paper' : 'bg-paper text-ink'
                }`}
              >
                <span className="display text-[2rem]">{w.label}</span>
                <span className={`mt-2 text-[14.5px] ${i === 0 ? 'text-paper/80' : 'text-ink-2'}`}>{w.text}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold group-hover:gap-2.5 transition-all">
                  Go <ArrowUpRight size={15} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Thank you ────────────────────────────────────────── */}
      <section id="thanks" className="max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <SectionHead title="Thank You" dek="None of this happens alone." />

        <h3 className="display text-[2rem] md:text-[2.4rem] mb-6">Our team</h3>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM.map((t) => (
            <li key={t.name} className={`border-2 border-ink p-5 ${t.note ? 'bg-card' : 'bg-paper'}`}>
              <span className="font-serif font-semibold text-[1.25rem] block leading-tight">{t.name}</span>
              <span className="kicker text-defender-red block mt-1.5">{t.role}</span>
              {t.note && <p className="mt-3 text-[13.5px] text-ink-2 leading-relaxed">{t.note}</p>}
            </li>
          ))}
        </ul>
        <p className="mt-6 font-serif text-[1.2rem] leading-relaxed text-ink-2 max-w-3xl">{TEAM_THANKS}</p>

        <h3 className="display text-[2rem] md:text-[2.4rem] mt-16 mb-6">Our funders</h3>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-ink border-2 border-ink">
          {FUNDERS.map((f) => (
            <li key={f} className="bg-card px-5 py-4 font-serif font-semibold text-[1.15rem] flex items-center">{f}</li>
          ))}
          <li className="bg-defender-gold px-5 py-4 font-serif font-semibold text-[1.15rem] flex items-center">
            Every monthly and one-time Defender
          </li>
        </ul>
        <p className="mt-6 font-serif text-[1.2rem] leading-relaxed text-ink-2 max-w-3xl">{FUNDERS_THANKS}</p>
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
        {door.stats && (
          <dl className="mt-5 grid grid-cols-3 gap-[2px] bg-ink border-2 border-ink">
            {door.stats.map((st) => (
              <div key={st.label} className="bg-paper px-3 py-3">
                <dt className="sr-only">{st.label}</dt>
                <dd className="display text-[2rem] tabular-nums">{st.value}</dd>
                <dd className="text-[11.5px] font-semibold text-ink-3 leading-snug mt-1">{st.label}</dd>
              </div>
            ))}
          </dl>
        )}
        {door.link && (
          <a
            href={door.link}
            {...(door.link.startsWith('#') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            className="mt-auto pt-5 inline-flex items-center gap-1 text-[13px] font-bold text-ink hover:text-defender-red transition-colors self-start"
          >
            Learn more <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
