'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  Zap,
  BookOpen,
  BarChart2,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Command Center', icon: Home },
  { href: '/report', label: 'Report Impact', icon: FileText },
  { href: '/admin/impacts', label: 'Impacts', icon: Zap },
  { href: '/admin/stories', label: 'Stories', icon: BookOpen },
  { href: '/admin/metrics', label: 'Metrics', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function NavSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-white/90 backdrop-blur-md border-r border-gray-200/50 z-40">
      {/* Wordmark */}
      <div className="px-6 pt-7 pb-6 border-b border-gray-100">
        <div className="text-defender-red font-bold tracking-widest text-xs uppercase mb-0.5">
          The Defender
        </div>
        <div className="text-defender-black font-bold text-base leading-tight tracking-tight">
          Impact Dashboard
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-defender-red/10 text-defender-red border-l-2 border-defender-red pl-[10px]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-defender-black'
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
          KC Defender &copy; 2026
        </div>
      </div>
    </aside>
  );
}
