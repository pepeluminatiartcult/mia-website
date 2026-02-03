import Link from 'next/link';
import { Domain } from '@/lib/types';

export default function DomainCard({ domain }: { domain: Domain }) {
  return (
    <Link
      href={`/domains/${domain.code}`}
      className="group block border border-border hover:border-gray-400 bg-surface hover:bg-background transition-all p-4"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-lg font-bold text-accent-bright tracking-tight group-hover:text-accent-bright glitch-hover">
          {domain.code}
        </span>
        <span className="text-sm text-foreground">{domain.name}</span>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
        {domain.description}
      </p>
      <div className="pixel-text text-gray-600 mt-3">
        {domain.exchange_count} exchange{domain.exchange_count !== 1 ? 's' : ''}
      </div>
    </Link>
  );
}
