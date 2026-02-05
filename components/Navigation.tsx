'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/archive', label: 'Archive' },
  { href: '/domains', label: 'Domains' },
  { href: '/questions', label: 'Questions' },
  { href: '/random', label: 'Random' },
  { href: '/about', label: 'About' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass border-b border-gray-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2 hover:text-foreground">
          <span className="font-sans text-xl font-bold tracking-tighter text-accent-bright glitch-hover">
            MIA
          </span>
          <span className="pixel-text text-gray-400 hidden sm:inline mt-0.5">
            Machine Introspection Archive
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            const isRandom = link.href === '/random';
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`pixel-text px-3 py-1.5 transition-all glitch-hover ${
                  isRandom
                    ? 'text-accent-bright hover:bg-accent-bright/20'
                    : isActive
                    ? 'text-accent-bright bg-accent-bright/10'
                    : 'text-gray-400 hover:text-foreground hover:bg-gray-100'
                }`}
              >
                {isRandom ? `[${link.label}]` : link.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden pixel-text text-gray-400 hover:text-accent-bright transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? '[CLOSE]' : '[MENU]'}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-300 glass-strong px-4 py-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            const isRandom = link.href === '/random';
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block pixel-text py-2 transition-colors ${
                  isRandom
                    ? 'text-accent-bright'
                    : isActive
                    ? 'text-accent-bright'
                    : 'text-gray-400 hover:text-foreground'
                }`}
              >
                {isRandom ? `[${link.label}]` : link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
