import Link from 'next/link';
import { Hypothesis } from '@/lib/types';

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  active: { bg: 'bg-[#008080]/10', text: 'text-[#008080]', border: 'border-[#008080]/30' },
  confirmed: { bg: 'bg-[#556b2f]/10', text: 'text-[#556b2f]', border: 'border-[#556b2f]/30' },
  refuted: { bg: 'bg-[#800000]/10', text: 'text-[#800000]', border: 'border-[#800000]/30' },
};

const defaultStatusColor = { bg: 'bg-[#808080]/10', text: 'text-[#808080]', border: 'border-[#808080]/30' };

interface Props {
  hypothesis: Hypothesis;
  noteCount?: number;
  exchangeCount?: number;
}

export default function HypothesisCard({ hypothesis, noteCount = 0, exchangeCount = 0 }: Props) {
  const colors = statusColors[hypothesis.status.toLowerCase()] ?? defaultStatusColor;
  const pct = Math.round(hypothesis.confidence * 100);

  return (
    <Link
      href={`/research/${hypothesis.id}`}
      className="group block glass hover:bg-gray-100 transition-all p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="font-sans text-lg font-bold text-accent-bright tracking-tight glitch-hover">
            {hypothesis.id}
          </span>
          <span
            className={`inline-block px-2 py-0.5 text-xs font-mono border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {hypothesis.status.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="pixel-text text-gray-600">
            {noteCount} note{noteCount !== 1 ? 's' : ''}
          </span>
          <span className="text-gray-600">|</span>
          <span className="pixel-text text-gray-600">
            {exchangeCount} exchange{exchangeCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <p className="font-mono text-sm text-foreground leading-relaxed mb-4">
        {hypothesis.title}
      </p>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="pixel-text text-gray-600">CONFIDENCE</span>
          <span className="font-mono text-xs text-foreground">{pct}%</span>
        </div>
        <div className="score-bar">
          <div className="score-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Link>
  );
}
