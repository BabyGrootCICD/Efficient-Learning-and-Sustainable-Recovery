'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '首頁' },
  { href: '/diagnostic/', label: '診斷' },
  { href: '/results/', label: '結果' },
  { href: '/habits/', label: '習慣' },
  { href: '/checklist/', label: '週清單' },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-sl-border bg-sl-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-white text-lg tracking-tight">
          systematic<span className="text-sl-accent">.</span>life
        </Link>
        <div className="flex gap-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href.replace(/\/$/, ''));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-sl-accent/20 text-sl-accent'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
