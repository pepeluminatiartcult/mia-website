import Link from 'next/link';
import { Exchange } from '@/lib/types';
import LocalTimestamp from '@/components/LocalTimestamp';

export default function ExchangeCard({ exchange, showResponse }: { exchange: Exchange; showResponse?: boolean }) {
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
        <LocalTimestamp iso={exchange.created_at} className="pixel-text text-gray-600 shrink-0" />
      </div>

      <p className="font-mono text-sm leading-relaxed text-gray-400 group-hover:text-foreground transition-colors mb-3 line-clamp-3 sm:line-clamp-2">
        {showResponse ? exchange.response_text : exchange.question_text}
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
