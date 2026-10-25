'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, Zap, BarChart2, Share2 } from 'lucide-react';

const BOTTOM_ITEMS = [
  { href: '/admin', label: 'Home', icon: Home },
  { href: '/admin/impacts', label: 'Impacts', icon: Zap },
  { href: '/report', label: 'Report', icon: Plus },
  { href: '/admin/metrics', label: 'Metrics', icon: BarChart2 },
  { href: '/share', label: 'Share', icon: Share2 },
];

export function NavBottom() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  // The public impact page has its own section nav
  if (pathname === '/' || pathname === '/staff' || pathname === '/lab') return null;

  return (
    <nav data-print-hide className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-ink rounded-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around px-2 py-1.5">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          const isReport = href === '/report';
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-colors ${
                isReport
                  ? 'bg-defender-red text-white'
                  : active
                  ? 'text-defender-gold'
                  : 'text-paper/60'
              }`}
            >
              <Icon size={19} strokeWidth={active || isReport ? 2.4 : 1.8} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
