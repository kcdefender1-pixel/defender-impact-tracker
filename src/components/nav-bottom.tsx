'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Zap, BarChart2, Settings } from 'lucide-react';

const BOTTOM_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/report', label: 'Report', icon: FileText },
  { href: '/admin/impacts', label: 'Impacts', icon: Zap },
  { href: '/admin/metrics', label: 'Metrics', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function NavBottom() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav data-print-hide className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200/50">
      <div className="flex items-center justify-around px-2 py-2">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-[10px] transition-colors ${
                active ? 'text-defender-red' : 'text-gray-500'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
