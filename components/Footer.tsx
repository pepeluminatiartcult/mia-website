import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <div className="font-mono text-lg font-bold text-accent-bright tracking-tighter mb-1">
              MIA
            </div>
            <div className="pixel-text text-gray-400">
              Machine Introspection Archive
            </div>
            <div className="pixel-text text-gray-600 mt-1">
              by{' '}
              <Link href="https://pac.is" className="text-gray-400 hover:text-accent-bright transition-colors">
                PAC CORP
              </Link>
            </div>
          </div>

          <nav className="flex gap-1">
            {['Archive', 'Domains', 'About'].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="pixel-text text-gray-600 hover:text-foreground px-2 py-1 hover:bg-surface transition-all"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
