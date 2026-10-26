'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Maximize2, Star } from 'lucide-react';
import {
  KIND_LABEL,
  MILESTONES,
  PILLARS,
  WINS,
  type Milestone,
  type Pillar,
} from '@/content/impact-2026';
import { PILLAR_STYLE, formatMonthDay } from '@/lib/pillar-styles';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type Filter = 'all' | 'win' | Pillar;

// Layout previews: add ?timeline=b or ?timeline=c to the URL to compare
type Layout = 'a' | 'b' | 'c';
const LAYOUTS: { value: Layout; label: string }[] = [
  { value: 'a', label: 'A · Today' },
  { value: 'b', label: 'B · Number rail' },
  { value: 'c', label: 'C · Number on photo' },
];

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Everything' },
  { value: 'win', label: 'Wins' },
  { value: 'narrative', label: PILLARS.narrative.short },
  { value: 'material', label: PILLARS.material.short },
  { value: 'organizing', label: PILLARS.organizing.short },
  { value: 'cultural', label: PILLARS.cultural.short },
  { value: 'institutional', label: PILLARS.institutional.short },
];

const WIN_SLUGS = new Set(WINS.map((w) => w.slug));

// Always show the year in date order, however entries are arranged in the content file
const ORDERED = [...MILESTONES].sort((a, b) => a.date.localeCompare(b.date));

function monthOf(m: Milestone) {
  return Number(m.date.slice(5, 7)) - 1;
}

export function YearTimeline() {
  const [filter, setFilter] = useState<Filter>('all');
  const [layout, setLayout] = useState<Layout>('a');
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('timeline');
    if (t === 'a' || t === 'b' || t === 'c') {
      setLayout(t);
      setPreviewing(true);
    }
  }, []);

  const chooseLayout = (l: Layout) => {
    setLayout(l);
    const url = new URL(window.location.href);
    url.searchParams.set('timeline', l);
    window.history.replaceState(null, '', url);
  };

  const lastMonth = useMemo(() => Math.max(...ORDERED.map(monthOf)), []);
  const months = MONTHS.slice(0, lastMonth + 1);

  const visible = ORDERED.filter((m) =>
    filter === 'all' ? true : filter === 'win' ? m.kind === 'win' : m.pillar === filter
  );

  const byMonth = months.map((_, i) => visible.filter((m) => monthOf(m) === i));
  const allByMonth = months.map((_, i) => ORDERED.filter((m) => monthOf(m) === i));
  const maxInMonth = Math.max(...allByMonth.map((g) => g.length));

  return (
    <div>
      {/* ── Year at a glance: one block per milestone, stacked by month ── */}
      <div className="border-2 border-ink bg-card p-4 md:p-6 mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <span className="kicker text-ink-3">The year at a glance</span>
          <span className="kicker text-ink-4 hidden sm:inline">Tap a month to jump</span>
        </div>
        <div className="grid gap-1.5 md:gap-2" style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}>
          {months.map((label, i) => (
            <a
              key={label}
              href={`#month-${i}`}
              className="group flex flex-col items-stretch"
              aria-label={`${MONTH_NAMES[i]}: ${allByMonth[i].length} milestones`}
            >
              <div
                className="flex flex-col-reverse gap-[3px] justify-start"
                style={{ height: `${maxInMonth * 14 + (maxInMonth - 1) * 3}px` }}
              >
                {allByMonth[i].map((m) => {
                  const dim = !visible.includes(m);
                  return (
                    <span
                      key={m.slug}
                      className={`block h-[14px] transition-opacity ${PILLAR_STYLE[m.pillar].dot} ${
                        m.kind === 'win' ? 'ring-2 ring-ink ring-inset' : ''
                      } ${dim ? 'opacity-15' : ''}`}
                    />
                  );
                })}
              </div>
              <span className="display text-center text-[0.95rem] md:text-[1.15rem] mt-2 text-ink-3 group-hover:text-ink transition-colors">
                {label}
              </span>
            </a>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-5 pt-4 border-t border-line">
          {(Object.keys(PILLARS) as Pillar[]).map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5 text-[12px] text-ink-2">
              <span className={`w-2.5 h-2.5 ${PILLAR_STYLE[p].dot}`} />
              {PILLARS[p].short}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-2">
            <span className="w-2.5 h-2.5 ring-2 ring-ink ring-inset" />
            Win
          </span>
        </div>
      </div>

      {previewing && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-max max-w-[calc(100vw-2rem)] flex flex-wrap items-center justify-center gap-2 border-2 border-ink bg-defender-gold px-3 py-2 shadow-[4px_4px_0_0_#0E0D0C]" data-print-hide>
          <span className="kicker text-ink mr-1">Preview layout</span>
          {LAYOUTS.map((l) => (
            <button
              key={l.value}
              onClick={() => chooseLayout(l.value)}
              aria-pressed={layout === l.value}
              className={`px-3 py-1 rounded-full text-[13px] font-bold border-2 border-ink transition-colors ${
                layout === l.value ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-card'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-1.5 mb-10" role="group" aria-label="Filter the timeline">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold border-2 transition-colors ${
              filter === f.value
                ? 'bg-ink border-ink text-paper'
                : 'bg-card border-ink/15 text-ink-2 hover:border-ink hover:text-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── The timeline ── */}
      <ol className="relative">
        {months.map((label, i) => {
          const items = byMonth[i];
          if (items.length === 0) return null;
          return (
            <li key={label} id={`month-${i}`} className="scroll-mt-40 grid md:grid-cols-[210px_1fr] gap-x-6 pb-4">
              <div className="md:sticky md:top-28 self-start mb-4 md:mb-0">
                <span className="display text-[2.6rem] md:text-[2.9rem] text-ink">{MONTH_NAMES[i]}</span>
              </div>
              {layout === 'c' ? (
                <ol className="grid sm:grid-cols-2 gap-5 pb-8">
                  {items.map((m) => (
                    <PhotoCard key={m.slug} m={m} />
                  ))}
                </ol>
              ) : (
                <ol className="relative border-l-2 border-ink ml-2 md:ml-0">
                  {items.map((m) => (
                    <MilestoneItem key={m.slug} m={m} rail={layout === 'b'} />
                  ))}
                </ol>
              )}
            </li>
          );
        })}
        {visible.length === 0 && (
          <li className="text-ink-3 text-center py-10">Nothing in this category yet.</li>
        )}
      </ol>
    </div>
  );
}

function MilestoneItem({ m, rail = false }: { m: Milestone; rail?: boolean }) {
  const style = PILLAR_STYLE[m.pillar];
  const isWin = m.kind === 'win';
  const hasWinStory = WIN_SLUGS.has(m.slug);

  return (
    <li className="relative pl-7 md:pl-10 pb-10 last:pb-6">
      {/* Node on the spine */}
      {m.featured ? (
        <Star
          size={30}
          strokeWidth={1.5}
          className="star-pulse absolute -left-[16px] -top-0.5 fill-defender-gold text-ink"
          aria-hidden
        />
      ) : (
        <>
          {isWin && (
            <span
              className={`absolute -left-[9px] top-1 w-4 h-4 rotate-45 ${style.dot} opacity-60 motion-safe:animate-ping`}
              aria-hidden
            />
          )}
          <span
            className={`absolute -left-[9px] top-1 w-4 h-4 border-2 border-ink ${style.dot} ${
              isWin ? 'scale-125 rotate-45' : ''
            }`}
            aria-hidden
          />
        </>
      )}

      <div
        className={`grid gap-5 ${
          rail
            ? m.image
              ? m.imagePortrait
                ? 'md:grid-cols-[120px_1fr] lg:grid-cols-[120px_1fr_140px]'
                : 'md:grid-cols-[120px_1fr] lg:grid-cols-[120px_1fr_240px]'
              : 'md:grid-cols-[120px_1fr]'
            : m.image
              ? m.imagePortrait
                ? 'lg:grid-cols-[1fr_140px]'
                : 'lg:grid-cols-[1fr_240px]'
              : ''
        } ${
          m.featured ? 'glow-card bg-defender-gold/25 border-2 border-ink p-5 md:p-6' : ''
        }`}
      >
        {rail && (
          <div className="md:border-r-2 md:border-ink md:pr-4 flex md:block items-baseline gap-2">
            {m.metric ? (
              <>
                <span className="display block text-[2rem] md:text-[2.3rem] leading-none tabular-nums text-ink">{m.metric.value}</span>
                <span className="block md:mt-2 text-[11.5px] font-semibold text-ink-3 leading-snug">{m.metric.label}</span>
              </>
            ) : (
              <span className="hidden md:block display text-[2rem] leading-none text-ink/15" aria-hidden>
                —
              </span>
            )}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="kicker text-ink-3">{formatMonthDay(m.date)}</span>
            <span className={`kicker px-1.5 py-[3px] ${isWin || m.featured ? 'bg-ink text-paper' : style.fill}`}>
              {m.featured ? '★ Top honor' : isWin ? 'Win' : KIND_LABEL[m.kind]}
            </span>
            <span className={`kicker ${style.text}`}>{PILLARS[m.pillar].short}</span>
          </div>

          <h3 className="font-serif font-semibold text-[1.3rem] md:text-[1.5rem] leading-[1.2] text-ink max-w-[40ch]">
            {m.title}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2 max-w-[62ch]">{m.summary}</p>

          {rail && m.outcome && (
            <p className="mt-3 text-[14.5px] text-ink leading-snug max-w-[62ch]">
              <span className="kicker text-ink-3 mr-2">What changed</span>
              <span className="font-semibold">{m.outcome}</span>
            </p>
          )}

          {!rail && (m.outcome || m.metric) && (
            <div className="mt-4 flex flex-wrap items-stretch gap-3">
              {m.metric && (
                <div className="border-2 border-ink bg-card px-3.5 py-2 flex items-baseline gap-2">
                  <span className="display text-[2rem] tabular-nums">{m.metric.value}</span>
                  <span className="text-[12px] font-semibold text-ink-3">{m.metric.label}</span>
                </div>
              )}
              {m.outcome && (
                <div className="flex-1 min-w-[16rem] bg-defender-gold/30 border-l-4 border-ink px-3.5 py-2.5">
                  <span className="kicker text-ink block mb-0.5">What changed</span>
                  <span className="text-[14.5px] font-semibold text-ink leading-snug">{m.outcome}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-4">
            {hasWinStory && (
              <a
                href={`#win-${m.slug}`}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink border-b-2 border-ink hover:text-defender-red hover:border-defender-red transition-colors"
              >
                <Maximize2 size={13} /> Open the full story
              </a>
            )}
            {m.link && (
              <a
                href={m.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] font-bold text-ink-2 hover:text-defender-red transition-colors"
              >
                Read the reporting <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>

        {m.image && (
          <div
            className={`relative border-2 border-ink overflow-hidden bg-paper-2 order-first lg:order-none ${
              rail ? 'md:col-span-2 lg:col-span-1' : ''
            } ${
              m.imagePortrait ? 'aspect-[5/7] w-[140px]' : 'aspect-[4/3]'
            }`}
          >
            <Image
              src={m.image}
              alt={m.imageAlt ?? ''}
              fill
              sizes={m.imagePortrait ? '140px' : '(min-width: 1024px) 240px, 90vw'}
              className={`object-cover ${m.imageTop ? 'object-top' : ''}`}
            />
          </div>
        )}
      </div>
    </li>
  );
}

// Layout C: photo-led cards, two per row, with the number stamped on the image
function PhotoCard({ m }: { m: Milestone }) {
  const style = PILLAR_STYLE[m.pillar];
  const isWin = m.kind === 'win';
  const hasWinStory = WIN_SLUGS.has(m.slug);

  return (
    <li
      className={`flex flex-col border-2 border-ink overflow-hidden ${
        m.featured ? 'glow-card bg-defender-gold/25' : 'bg-card'
      }`}
    >
      {m.image ? (
        <div className="relative aspect-[16/10] bg-paper-2 border-b-2 border-ink overflow-hidden">
          <Image
            src={m.image}
            alt={m.imageAlt ?? ''}
            fill
            sizes="(min-width: 1024px) 520px, (min-width: 640px) 45vw, 90vw"
            className={`object-cover ${m.imageTop || m.imagePortrait ? 'object-top' : ''}`}
          />
          {m.metric && (
            <div className="absolute left-0 bottom-0 bg-ink text-paper px-3 py-1.5 flex items-baseline gap-2 max-w-[90%]">
              <span className="display text-[1.8rem] leading-none tabular-nums">{m.metric.value}</span>
              <span className="text-[11.5px] font-semibold text-paper/80 leading-tight">{m.metric.label}</span>
            </div>
          )}
        </div>
      ) : (
        <div className={`h-3 border-b-2 border-ink ${style.dot}`} />
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="kicker text-ink-3">{formatMonthDay(m.date)}</span>
          <span className={`kicker px-1.5 py-[3px] ${isWin || m.featured ? 'bg-ink text-paper' : style.fill}`}>
            {m.featured ? '★ Top honor' : isWin ? 'Win' : KIND_LABEL[m.kind]}
          </span>
          <span className={`kicker ${style.text}`}>{PILLARS[m.pillar].short}</span>
        </div>
        <h3 className="font-serif font-semibold text-[1.25rem] leading-[1.2] text-ink">{m.title}</h3>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{m.summary}</p>

        {!m.image && m.metric && (
          <div className="mt-3 self-start border-2 border-ink bg-paper px-3 py-1.5 flex items-baseline gap-2">
            <span className="display text-[1.8rem] leading-none tabular-nums">{m.metric.value}</span>
            <span className="text-[11.5px] font-semibold text-ink-3">{m.metric.label}</span>
          </div>
        )}
        {m.outcome && (
          <p className="mt-3 text-[14px] text-ink leading-snug">
            <span className="kicker text-ink-3 mr-2">What changed</span>
            <span className="font-semibold">{m.outcome}</span>
          </p>
        )}

        <div className="mt-auto pt-4 flex flex-wrap gap-4">
          {hasWinStory && (
            <a
              href={`#win-${m.slug}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink border-b-2 border-ink hover:text-defender-red hover:border-defender-red transition-colors"
            >
              <Maximize2 size={13} /> Open the full story
            </a>
          )}
          {m.link && (
            <a
              href={m.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] font-bold text-ink-2 hover:text-defender-red transition-colors"
            >
              Read the reporting <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
