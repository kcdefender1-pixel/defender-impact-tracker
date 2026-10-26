'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Printer } from 'lucide-react';

const STAFF_ITEMS = [
  { href: '/admin', label: 'Command Center' },
  { href: '/admin/impacts', label: 'Impacts' },
  { href: '/admin/stories', label: 'Stories' },
  { href: '/admin/metrics', label: 'Metrics' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/share', label: 'Share' },
];

// Sections of the public impact page, in scroll order
export const PUBLIC_SECTIONS = [
  { id: 'power', label: 'Our Power' },
  { id: 'year', label: 'The Year' },
  { id: 'areas', label: 'Impact Areas' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'how', label: 'The Thesis' },
  { id: 'willas', label: 'Willa’s' },
  { id: 'doors', label: 'Your Door' },
  { id: 'give', label: 'Why Give' },
  { id: 'next', label: '2027' },
  { id: 'thanks', label: 'Thank You' },
];

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const els = PUBLIC_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Current section = the last one whose top has scrolled past the line under the header
        const line = 180;
        let current: string | null = null;
        for (const el of els) {
          if (el.getBoundingClientRect().top <= line) current = el.id;
        }
        setActive(current);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [enabled]);

  return active;
}

export function Masthead() {
  const pathname = usePathname();
  const isPublic = pathname === '/';
  const isLogin = pathname === '/staff';
  const active = useActiveSection(isPublic);

  // Keep the current section's pill in view in the scrolling mobile strip
  useEffect(() => {
    if (!active) return;
    const pill = document.querySelector<HTMLElement>(`[data-section-pill="${active}"]`);
    const strip = pill?.closest('nav');
    if (pill && strip) {
      strip.scrollTo({ left: pill.offsetLeft - strip.clientWidth / 2 + pill.clientWidth / 2, behavior: 'smooth' });
    }
  }, [active]);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <header data-print-hide className="sticky top-0 z-40">
      {/* Dateline strip */}
      <div className="bg-ink">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 h-8 flex items-center justify-between kicker text-paper/70">
          <span>
            The Kansas City Defender
            <span className="hidden sm:inline"> &middot; Reporting to the movement</span>
          </span>
          {isPublic ? (
            <Link href="/admin" className="hover:text-paper transition-colors">
              Staff
            </Link>
          ) : (
            <span className="flex items-center gap-4">
              <Link href="/" className="hover:text-paper transition-colors">
                View public page &rarr;
              </Link>
              {!isLogin && (
                <button
                  onClick={async () => {
                    await fetch('/api/staff-login', { method: 'DELETE' });
                    window.location.assign('/');
                  }}
                  className="hover:text-paper transition-colors uppercase"
                >
                  Sign out
                </button>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Wordmark + nav */}
      <div className="bg-paper/90 backdrop-blur-md border-b-2 border-ink">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 h-16 flex items-center gap-6">
          <Link
            href={isPublic ? '#top' : '/admin'}
            className="flex items-baseline gap-1.5 shrink-0"
            aria-label="Defender Impact home"
          >
            <span className="display text-[2rem] text-ink">Defender</span>
            <span className="display text-[2rem] text-defender-red">Impact</span>
          </Link>

          {isPublic ? (
            <>
              <nav className="hidden xl:flex items-center gap-1 flex-1 min-w-0" aria-label="Sections">
                {PUBLIC_SECTIONS.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`px-2.5 py-1.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                      active === id ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-ink/[0.06] hover:text-ink'
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </nav>
              <button
                onClick={() => window.print()}
                className="ml-auto inline-flex items-center gap-1.5 bg-ink text-paper rounded-button pl-3 pr-4 py-2 text-[13px] font-bold hover:bg-defender-red transition-colors"
              >
                <Printer size={15} strokeWidth={2.2} />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
            </>
          ) : isLogin ? null : (
            <>
              <nav className="hidden md:flex items-center gap-1 flex-1 min-w-0">
                {STAFF_ITEMS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                      isActive(href) ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-ink/[0.06] hover:text-ink'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/report"
                className="hidden md:inline-flex ml-auto items-center gap-1.5 bg-defender-red text-white rounded-button pl-3 pr-4 py-2 text-[13px] font-bold hover:bg-ink transition-colors"
              >
                <Plus size={15} strokeWidth={2.6} />
                Report Impact
              </Link>
            </>
          )}
        </div>

        {/* Section nav for smaller screens: a horizontal strip that scrolls */}
        {isPublic && (
          <nav
            className="xl:hidden border-t border-line overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Sections"
          >
            <div className="flex gap-1 px-4 md:px-8 py-2 w-max">
              {PUBLIC_SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  data-section-pill={id}
                  className={`px-3 py-1 text-[12.5px] font-semibold whitespace-nowrap rounded-full transition-colors ${
                    active === id ? 'bg-ink text-paper' : 'text-ink-2 bg-ink/[0.05]'
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
