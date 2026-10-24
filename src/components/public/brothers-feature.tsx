'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, X } from 'lucide-react';
import { BROTHERS } from '@/content/impact-2026';

// The new B-REAL cohort for young Black men: a feature card that opens the full story.
// The open state lives in the hash (#brothers) so the story can be linked to directly.
const HASH = '#brothers';

export function BrothersFeature() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === HASH);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const show = () => {
    history.replaceState(null, '', HASH);
    setOpen(true);
  };
  const hide = () => {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      <div className="glow-card border-2 border-ink bg-ink text-paper overflow-hidden grid lg:grid-cols-12">
        <div className="lg:col-span-6 relative min-h-[18rem] lg:min-h-[28rem] border-b-2 lg:border-b-0 lg:border-r-2 border-paper/30">
          <Image src={BROTHERS.image} alt={BROTHERS.imageAlt} fill sizes="(min-width: 1024px) 660px, 100vw" className="object-cover" />
        </div>
        <div className="lg:col-span-6 p-6 md:p-10 flex flex-col justify-center">
          <span className="kicker text-defender-gold">{BROTHERS.kicker}</span>
          <h2 className="display text-[clamp(2.4rem,4.6vw,4rem)] mt-4">{BROTHERS.headline}</h2>
          <p className="mt-5 text-[16px] md:text-[17px] text-paper/85 leading-relaxed max-w-xl">{BROTHERS.teaser}</p>
          <p className="mt-6 font-serif italic text-[1.3rem] md:text-[1.5rem] leading-snug text-paper">
            &ldquo;{BROTHERS.closer}&rdquo;
          </p>
          <button
            ref={buttonRef}
            onClick={show}
            aria-haspopup="dialog"
            className="mt-8 self-start inline-flex items-center gap-2 bg-defender-gold text-ink rounded-button px-5 py-3 text-[14px] font-bold hover:bg-paper transition-colors btn-glow"
          >
            Read why this matters <ArrowRight size={16} className="float-x" />
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={hide}
        onClick={(e) => {
          if (e.target === dialogRef.current) hide();
        }}
        aria-labelledby="brothers-title"
        className="backdrop:bg-ink/75 backdrop:backdrop-blur-sm bg-transparent p-0 m-auto w-[min(880px,calc(100vw-24px))] max-h-[calc(100dvh-24px)] open:animate-[fadeSlideIn_0.25s_ease-out]"
      >
        <div className="bg-paper border-2 border-ink shadow-[10px_10px_0_0_#0E0D0C] max-h-[calc(100dvh-24px)] overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-ink text-paper px-4 py-2.5">
            <span className="kicker text-defender-gold">{BROTHERS.kicker}</span>
            <button onClick={hide} className="p-1.5 hover:bg-defender-red" aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="relative aspect-[16/8] border-b-2 border-ink bg-ink">
            <Image src={BROTHERS.storyImage} alt={BROTHERS.storyImageAlt} fill sizes="880px" className="object-cover" />
          </div>

          <div className="p-6 md:p-10">
            <h2 id="brothers-title" className="display text-[2.4rem] md:text-[3.2rem] text-ink">
              {BROTHERS.headline}
            </h2>

            <div className="mt-6 space-y-5 font-serif text-[1.12rem] md:text-[1.2rem] leading-[1.65] text-ink-2">
              {BROTHERS.paragraphs.slice(0, 3).map((p, i) => (
                <p key={i} className={i === 1 ? 'text-ink font-semibold' : ''}>
                  {p}
                </p>
              ))}
            </div>

            <h3 className="kicker text-ink mt-10 mb-4">Who leads it</h3>
            <ul className="grid md:grid-cols-3 gap-[2px] bg-ink border-2 border-ink">
              {BROTHERS.leaders.map((l) => (
                <li key={l.name} className="bg-card p-5">
                  <span className="font-serif font-semibold text-[1.2rem] block">{l.name}</span>
                  <span className="kicker text-defender-red block mt-1">{l.role}</span>
                  <p className="mt-2 text-[14px] text-ink-2 leading-relaxed">{l.note}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 font-serif text-[1.12rem] md:text-[1.2rem] leading-[1.65] text-ink-2">
              {BROTHERS.paragraphs.slice(3).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <blockquote className="mt-10 pt-8 border-t-2 border-ink">
              <p className="font-serif italic text-[1.8rem] md:text-[2.4rem] leading-[1.12] text-ink">{BROTHERS.closer}</p>
            </blockquote>
          </div>
        </div>
      </dialog>
    </>
  );
}
