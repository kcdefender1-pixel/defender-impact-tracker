'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { WINS, PILLARS, type Win } from '@/content/impact-2026';
import { PILLAR_STYLE, formatMonthDay } from '@/lib/pillar-styles';

// Each win opens in a dialog. The open win lives in the URL hash (#win-<slug>)
// so a specific win can be linked to directly, and the timeline can open one.
const HASH_PREFIX = '#win-';

// Board order follows the calendar; year-long totals carry a late date so they close the run
const ORDERED_WINS = [...WINS].sort((a, b) => a.date.localeCompare(b.date));

function slugFromHash() {
  if (typeof window === 'undefined') return null;
  const h = window.location.hash;
  return h.startsWith(HASH_PREFIX) ? h.slice(HASH_PREFIX.length) : null;
}

export function WinsBoard() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sync = () => setOpenSlug(slugFromHash());
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const index = ORDERED_WINS.findIndex((w) => w.slug === openSlug);
  const win = index >= 0 ? ORDERED_WINS[index] : null;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (win && !d.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      d.showModal();
    } else if (!win && d.open) {
      d.close();
    }
  }, [win]);

  const open = (slug: string) => {
    // replaceState keeps the page from jumping; we update state ourselves
    history.replaceState(null, '', `${HASH_PREFIX}${slug}`);
    setOpenSlug(slug);
  };

  const close = useCallback(() => {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    setOpenSlug(null);
    returnFocusRef.current?.focus?.();
  }, []);

  const step = (dir: 1 | -1) => {
    const next = ORDERED_WINS[(index + dir + ORDERED_WINS.length) % ORDERED_WINS.length];
    open(next.slug);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ORDERED_WINS.map((w, i) => (
          <WinCard key={w.slug} win={w} index={i} onOpen={() => open(w.slug)} />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes it
          if (e.target === dialogRef.current) close();
        }}
        aria-labelledby="win-title"
        className="backdrop:bg-ink/70 backdrop:backdrop-blur-sm bg-transparent p-0 m-auto w-[min(860px,calc(100vw-24px))] max-h-[calc(100dvh-24px)] open:animate-[fadeSlideIn_0.25s_ease-out]"
      >
        {win && <WinDetail win={win} onClose={close} onPrev={() => step(-1)} onNext={() => step(1)} position={`${index + 1} of ${ORDERED_WINS.length}`} />}
      </dialog>
    </>
  );
}

const TONES = [
  { card: 'bg-defender-red text-white', metric: 'text-ink', muted: 'text-white/80', badge: 'bg-ink text-paper', rule: 'border-ink/70' },
  { card: 'bg-ink text-paper', metric: 'text-defender-red', muted: 'text-paper/65', badge: 'bg-defender-red text-white', rule: 'border-paper/25' },
  { card: 'bg-card text-ink', metric: 'text-defender-red', muted: 'text-ink-3', badge: 'bg-ink text-paper', rule: 'border-ink' },
];
const MATERIAL_TONE = { card: 'bg-defender-green text-white', metric: 'text-ink', muted: 'text-white/80', badge: 'bg-ink text-paper', rule: 'border-ink/70' };
const ORGANIZING_TONE = { card: 'bg-defender-gold text-ink', metric: 'text-ink', muted: 'text-ink/70', badge: 'bg-ink text-paper', rule: 'border-ink/70' };

function toneFor(win: Win, index: number) {
  if (win.pillar === 'material') return MATERIAL_TONE;
  if (win.pillar === 'organizing') return ORGANIZING_TONE;
  return TONES[index % TONES.length];
}

function WinCard({ win, index, onOpen }: { win: Win; index: number; onOpen: () => void }) {
  const t = toneFor(win, index);
  return (
    <button
      onClick={onOpen}
      aria-haspopup="dialog"
      className={`group text-left relative flex flex-col border-2 border-ink p-6 min-h-[18rem] shadow-[6px_6px_0_0_#0E0D0C] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_#0E0D0C] focus-visible:-translate-y-0.5 ${t.card}`}
    >
      <div className="flex items-center justify-between gap-2 mb-5">
        <span className={`kicker px-2 py-1 ${t.badge}`}>{win.label} win</span>
        <span className={`kicker shrink-0 ${t.muted}`}>{win.dateLabel ?? formatMonthDay(win.date)}</span>
      </div>
      <p className="font-serif font-semibold text-[1.4rem] leading-[1.18] mb-6">{win.title}</p>
      <div className={`mt-auto flex items-end justify-between gap-3 pt-4 border-t-2 ${t.rule}`}>
        <div className="min-w-0">
          <span className={`display block text-[3.2rem] tabular-nums ${t.metric}`}>{win.metric.value}</span>
          <span className={`block text-[12px] font-semibold mt-1 ${t.muted}`}>{win.metric.label}</span>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 text-[12px] font-bold pb-1 group-hover:gap-2 transition-all">
          Read more <ArrowRight size={14} />
        </span>
      </div>
    </button>
  );
}

function WinDetail({
  win,
  onClose,
  onPrev,
  onNext,
  position,
}: {
  win: Win;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  position: string;
}) {
  const style = PILLAR_STYLE[win.pillar];
  return (
    <div className="bg-paper border-2 border-ink shadow-[10px_10px_0_0_#0E0D0C] max-h-[calc(100dvh-24px)] overflow-y-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-ink text-paper px-4 py-2.5">
        <span className="kicker text-paper/70">{position}</span>
        <div className="flex items-center gap-1">
          <button onClick={onPrev} className="p-1.5 hover:bg-paper/10" aria-label="Previous win">
            <ArrowLeft size={17} />
          </button>
          <button onClick={onNext} className="p-1.5 hover:bg-paper/10" aria-label="Next win">
            <ArrowRight size={17} />
          </button>
          <button onClick={onClose} className="p-1.5 ml-1 hover:bg-defender-red" aria-label="Close">
            <X size={18} />
          </button>
        </div>
      </div>

      {win.image && (
        <div className="relative aspect-[16/8] border-b-2 border-ink bg-paper-2">
          <Image src={win.image} alt={win.imageAlt ?? ''} fill sizes="860px" className={`object-cover ${win.imageTop ? 'object-top' : ''}`} />
        </div>
      )}

      <div className="p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`kicker px-2 py-1 ${style.fill}`}>{win.label} win</span>
          <span className="kicker text-ink-3">
            {win.dateLabel ?? `${formatMonthDay(win.date)}, 2026`} &middot; {PILLARS[win.pillar].label}
          </span>
        </div>

        <h2 id="win-title" className="font-serif font-semibold text-[1.9rem] md:text-[2.4rem] leading-[1.1] text-ink">
          {win.title}
        </h2>

        <div className="mt-6 grid md:grid-cols-[1fr_200px] gap-8">
          <div className="space-y-4 font-serif text-[1.12rem] leading-[1.65] text-ink-2">
            {win.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="md:border-l-2 md:border-ink md:pl-6">
            <span className={`display block text-[3.6rem] tabular-nums ${style.text}`}>{win.metric.value}</span>
            <span className="block text-[13px] font-semibold text-ink-3 mt-1">{win.metric.label}</span>
            {win.partners && (
              <div className="mt-6">
                <span className="kicker text-ink-3 block mb-2">Alongside</span>
                <ul className="space-y-1 text-[13px] font-semibold text-ink">
                  {win.partners.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-defender-gold/35 border-l-4 border-ink px-5 py-4">
          <span className="kicker text-ink block mb-1">What changed</span>
          <p className="text-[16px] font-semibold text-ink leading-snug">{win.outcome}</p>
        </div>

        {win.link && (
          <a
            href={win.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 bg-ink text-paper rounded-button px-5 py-2.5 text-[14px] font-bold hover:bg-defender-red transition-colors"
          >
            Read the reporting <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
