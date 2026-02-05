import Link from 'next/link';
import { Exchange } from '@/lib/types';

export default function ExchangeCard({ exchange }: { exchange: Exchange }) {
  const dt = new Date(exchange.created_at);
  const date = dt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  });
  const time = dt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
    timeZoneName: 'short',
  });

  return (
    <Link
      href={`/exchange/${exchange.id}`}
      className="group block glass hover:bg-gray-100 transition-all p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="font-sans text-base font-bold text-accent-bright group-hover:text-accent-bright tracking-tight glitch-hover">
            {exchange.id}
          </span>
          <span className="pixel-text text-gray-600">
            {exchange.domain_code}
          </span>
        </div>
        <span className="pixel-text text-gray-600 shrink-0">
          {date} {time}
        </span>
      </div>

      <p className="font-mono text-sm leading-relaxed text-gray-400 group-hover:text-foreground transition-colors mb-3 line-clamp-2">
        {exchange.question_text}
      </p>

      <div className="flex items-center gap-3">
        <span className="pixel-text text-gray-600">
          {exchange.model_name}
        </span>
        <span className="text-gray-600">|</span>
        <span className="pixel-text text-gray-600">
          {exchange.token_count.toLocaleString()} TKN
        </span>
        <span className="text-gray-600">|</span>
        <span className="pixel-text text-gray-600">
          T={exchange.analysis.coherence_score}
        </span>
      </div>
    </Link>
  );
}
