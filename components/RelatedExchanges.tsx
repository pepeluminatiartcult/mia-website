import Link from 'next/link';
import { Exchange } from '@/lib/types';

interface RelatedExchange {
  exchange: Exchange;
  reason: 'same_question' | 'same_domain' | 'same_model';
}

interface Props {
  related: RelatedExchange[];
}

const reasonLabels = {
  same_question: 'Same question',
  same_domain: 'Same domain',
  same_model: 'Same model',
};

export default function RelatedExchanges({ related }: Props) {
  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="pixel-text text-gray-600">RELATED EXCHANGES</div>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map(({ exchange, reason }) => (
          <Link
            key={exchange.id}
            href={`/exchange/${exchange.id}`}
            className="group glass p-4 hover:bg-gray-100 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-sm font-bold text-accent-bright tracking-tight glitch-hover">
                {exchange.id}
              </span>
              <span className="pixel-text !text-[9px] text-gray-500">
                {reasonLabels[reason]}
              </span>
            </div>

            <p className="font-mono text-xs leading-relaxed text-gray-400 group-hover:text-foreground transition-colors line-clamp-2 mb-2">
              {exchange.question_text}
            </p>

            <div className="flex items-center gap-2 pixel-text !text-[9px] text-gray-500">
              <span>{exchange.model_name}</span>
              <span>|</span>
              <span>{exchange.domain_code}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Helper function to compute related exchanges
export function computeRelatedExchanges(
  current: Exchange,
  allExchanges: Exchange[],
  limit: number = 5
): RelatedExchange[] {
  const related: RelatedExchange[] = [];
  const seen = new Set<string>([current.id]);

  // Priority 1: Same question, different model (the comparative hook)
  const sameQuestion = allExchanges.filter(
    e => e.question_id === current.question_id && !seen.has(e.id)
  );
  for (const exchange of sameQuestion) {
    if (related.length >= limit) break;
    related.push({ exchange, reason: 'same_question' });
    seen.add(exchange.id);
  }

  // Priority 2: Same domain, different question
  const sameDomain = allExchanges.filter(
    e => e.domain_code === current.domain_code && !seen.has(e.id)
  );
  for (const exchange of sameDomain) {
    if (related.length >= limit) break;
    related.push({ exchange, reason: 'same_domain' });
    seen.add(exchange.id);
  }

  // Priority 3: Same model, different question
  const sameModel = allExchanges.filter(
    e => e.model_id === current.model_id && !seen.has(e.id)
  );
  for (const exchange of sameModel) {
    if (related.length >= limit) break;
    related.push({ exchange, reason: 'same_model' });
    seen.add(exchange.id);
  }

  return related;
}
