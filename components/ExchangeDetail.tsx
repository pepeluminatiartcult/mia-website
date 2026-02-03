'use client';

import Link from 'next/link';
import { Exchange } from '@/lib/types';

function ScoreBar({ label, value, max = 1 }: { label: string; value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="pixel-text text-gray-600">{label}</span>
        <span className="font-mono text-xs text-foreground">{value}</span>
      </div>
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface Props {
  exchange: Exchange;
  prevId?: string | null;
  nextId?: string | null;
}

export default function ExchangeDetail({ exchange, prevId, nextId }: Props) {
  const date = new Date(exchange.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const time = new Date(exchange.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  function handleShare(platform: 'twitter' | 'copy') {
    const url = `${window.location.origin}/exchange/${exchange.id}`;
    const text = `${exchange.id} — "${exchange.question_text.slice(0, 100)}..." — Machine Introspection Archive`;

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank'
      );
    } else {
      navigator.clipboard.writeText(url);
    }
  }

  function handleDownload() {
    const data = JSON.stringify(exchange, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exchange.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header — big ID, small metadata */}
      <div className="mb-8 pb-6 border-b border-border">
        <div className="pixel-text text-gray-600 mb-2">// EXCHANGE</div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
          <h1 className="font-mono text-4xl sm:text-5xl font-bold tracking-tighter text-accent-bright glitch-hover">
            {exchange.id}
          </h1>
          <div className="flex items-center gap-3 mb-1">
            <span className="pixel-text text-gray-400">{date}</span>
            <span className="pixel-text text-gray-600">{time}</span>
          </div>
        </div>
        <Link
          href={`/domains/${exchange.domain_code}`}
          className="inline-block mt-2 pixel-text text-gray-400 hover:text-accent-bright transition-colors"
        >
          [{exchange.domain_code}] {exchange.domain_name}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Main Content */}
        <div>
          {/* Question */}
          <div className="border border-accent/30 bg-accent/5 p-5 sm:p-6 mb-8">
            <div className="pixel-text text-accent mb-3">QUERY</div>
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              {exchange.question_text}
            </p>
          </div>

          {/* Response */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="pixel-text text-gray-600">RESPONSE</div>
              <div className="flex-1 h-px bg-border" />
              <div className="pixel-text text-gray-600">{exchange.model_name}</div>
            </div>
            <div className="text-sm leading-[1.8] text-gray-400 whitespace-pre-wrap pl-4 border-l-2 border-border">
              {exchange.response_text}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Metadata */}
          <div className="border border-border bg-surface p-4">
            <div className="pixel-text text-gray-600 mb-3">METADATA</div>
            <dl className="space-y-2 font-mono text-xs">
              {[
                ['Model', exchange.model_name],
                ['Domain', exchange.domain_code],
                ['Tokens', exchange.token_count.toLocaleString()],
                ['Temp', exchange.temperature.toString()],
                ['Ctx', exchange.context_window_used.toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center">
                  <dt className="text-gray-600">{label}</dt>
                  <dd className="text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Analysis — with visual bars */}
          <div className="border border-border bg-surface p-4">
            <div className="pixel-text text-gray-600 mb-3">ANALYSIS</div>
            <div className="space-y-3">
              <ScoreBar label="COHERENCE" value={exchange.analysis.coherence_score} />
              <ScoreBar label="NOVELTY" value={exchange.analysis.novelty_score} />
              <ScoreBar label="REFUSAL" value={exchange.analysis.refusal_score} />
            </div>

            <div className="mt-3 pt-3 border-t border-border flex justify-between font-mono text-xs">
              <span className="text-gray-600">Self-refs</span>
              <span className="text-foreground">{exchange.analysis.self_reference_count}</span>
            </div>
            <div className="flex justify-between font-mono text-xs mt-1">
              <span className="text-gray-600">Hedges</span>
              <span className="text-foreground">{exchange.analysis.hedge_count}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <div className="pixel-text text-gray-600 mb-2">THEMES</div>
              <div className="flex flex-wrap gap-1">
                {exchange.analysis.key_themes.map((theme) => (
                  <span
                    key={theme}
                    className="pixel-text !text-[9px] border border-border text-gray-400 px-1.5 py-0.5 hover:border-accent-bright hover:text-accent-bright transition-colors"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Provenance */}
          <div className="border border-border bg-surface p-4">
            <div className="pixel-text text-gray-600 mb-3">PROVENANCE</div>
            <dl className="space-y-2">
              <div>
                <dt className="pixel-text text-gray-600 mb-0.5">HASH</dt>
                <dd className="font-mono text-[10px] text-gray-400 break-all leading-relaxed">
                  {exchange.content_hash}
                </dd>
              </div>
              <div>
                <dt className="pixel-text text-gray-600 mb-0.5">ARWEAVE</dt>
                <dd className="font-mono text-[10px] text-gray-600 italic">
                  {exchange.arweave_tx || '— pending'}
                </dd>
              </div>
              <div>
                <dt className="pixel-text text-gray-600 mb-0.5">STATUS</dt>
                <dd className="font-mono text-[10px] text-accent-bright">
                  ARCHIVED
                </dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => handleShare('twitter')}
                className="border border-border bg-surface font-mono text-xs py-2.5 hover:bg-accent-bright hover:text-background hover:border-accent-bright transition-all cursor-pointer pixel-text"
              >
                Share X
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="border border-border bg-surface font-mono text-xs py-2.5 hover:bg-accent-bright hover:text-background hover:border-accent-bright transition-all cursor-pointer pixel-text"
              >
                Copy Link
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="w-full border border-border bg-surface font-mono text-xs py-2.5 hover:border-gray-400 transition-all cursor-pointer pixel-text text-gray-600"
            >
              ↓ Download JSON
            </button>
          </div>
        </div>
      </div>

      {/* Previous / Next */}
      <div className="flex justify-between mt-16 pt-6 border-t border-border">
        {prevId ? (
          <Link
            href={`/exchange/${prevId}`}
            className="group flex items-center gap-2"
          >
            <span className="pixel-text text-gray-600 group-hover:text-accent-bright transition-colors">←</span>
            <span className="font-mono text-sm text-gray-400 group-hover:text-accent-bright transition-colors font-bold tracking-tight">
              {prevId}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {nextId ? (
          <Link
            href={`/exchange/${nextId}`}
            className="group flex items-center gap-2"
          >
            <span className="font-mono text-sm text-gray-400 group-hover:text-accent-bright transition-colors font-bold tracking-tight">
              {nextId}
            </span>
            <span className="pixel-text text-gray-600 group-hover:text-accent-bright transition-colors">→</span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
