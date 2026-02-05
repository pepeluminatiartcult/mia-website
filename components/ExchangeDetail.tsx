'use client';

import Link from 'next/link';
import { Exchange } from '@/lib/types';
import Breadcrumbs from '@/components/Breadcrumbs';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
      <Breadcrumbs
        items={[
          { label: 'Archive', href: '/archive' },
          { label: exchange.domain_code, href: `/domains/${exchange.domain_code}` },
          { label: exchange.id },
        ]}
      />

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-300">
        <h1 className="font-sans text-4xl sm:text-5xl font-bold tracking-tighter text-accent-bright glitch-hover">
          {exchange.id}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Main Content — Chat Layout */}
        <div className="space-y-8 mb-8">
          {/* MIA's message (question) */}
          <div className="glass ml-12 lg:ml-24">
            <div className="flex items-center justify-between px-2 py-1" style={{ background: '#000080' }}>
              <span className="pixel-text !text-[9px] text-white/50">{date} {time}</span>
              <span className="pixel-text !text-[9px] text-white">MIA</span>
            </div>
            <div className="p-5" style={{ background: '#0000aa' }}>
              <p className="font-mono text-sm leading-loose text-white">
                {exchange.question_text}
              </p>
            </div>
          </div>

          {/* Partner AI's message (response) */}
          <div className="glass mr-12 lg:mr-24">
            <div className="flex items-center justify-between px-2 py-1" style={{ background: '#000080' }}>
              <span className="pixel-text !text-[9px] text-white">{exchange.model_name}</span>
              <span className="pixel-text !text-[9px] text-white/50">{date} {time}</span>
            </div>
            <div className="p-5" style={{ background: '#0000aa' }}>
              <div className="font-mono text-sm leading-loose text-white whitespace-pre-wrap">
                {exchange.response_text}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Metadata */}
          <div className="glass p-4">
            <div className="pixel-text text-gray-600 mb-3">METADATA</div>
            <dl className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Date</dt>
                <dd className="text-foreground">{date}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Time</dt>
                <dd className="text-foreground">{time}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Question</dt>
                <dd>
                  <Link
                    href={`/question/${exchange.question_id}`}
                    className="text-foreground hover:text-accent-bright transition-colors"
                  >
                    {exchange.question_id}
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Domain</dt>
                <dd>
                  <Link
                    href={`/domains/${exchange.domain_code}`}
                    className="text-foreground hover:text-accent-bright transition-colors"
                  >
                    {exchange.domain_code} — {exchange.domain_name}
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Model</dt>
                <dd>
                  <Link
                    href={`/archive?model=${encodeURIComponent(exchange.model_name)}`}
                    className="text-foreground hover:text-accent-bright transition-colors"
                  >
                    {exchange.model_name}
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Model ID</dt>
                <dd className="text-foreground">{exchange.model_id}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Tokens</dt>
                <dd className="text-foreground">{exchange.token_count.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Temp</dt>
                <dd className="text-foreground">{exchange.temperature.toString()}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Ctx Window</dt>
                <dd className="text-foreground">{exchange.context_window_used.toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          {/* Analysis */}
          <div className="glass p-4">
            <div className="pixel-text text-gray-600 mb-3">ANALYSIS</div>
            <div className="space-y-3">
              <ScoreBar label="COHERENCE" value={exchange.analysis.coherence_score} />
              <ScoreBar label="NOVELTY" value={exchange.analysis.novelty_score} />
              <ScoreBar label="REFUSAL" value={exchange.analysis.refusal_score} />
            </div>

            <div className="mt-3 pt-3 border-t border-gray-300 flex justify-between font-mono text-xs">
              <span className="text-gray-600">Self-refs</span>
              <span className="text-foreground">{exchange.analysis.self_reference_count}</span>
            </div>
            <div className="flex justify-between font-mono text-xs mt-1">
              <span className="text-gray-600">Hedges</span>
              <span className="text-foreground">{exchange.analysis.hedge_count}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-300">
              <div className="pixel-text text-gray-600 mb-2">THEMES</div>
              <div className="flex flex-wrap gap-1">
                {exchange.analysis.key_themes.map((theme) => (
                  <Link
                    key={theme}
                    href={`/archive?theme=${encodeURIComponent(theme)}`}
                    className="pixel-text !text-[9px] border border-gray-300 text-gray-400 px-1.5 py-0.5 hover:border-accent-bright hover:text-accent-bright transition-colors"
                  >
                    {theme}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Provenance */}
          <div className="glass p-4">
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
                className="glass font-mono text-xs py-2.5 hover:bg-accent-bright/20 hover:text-accent-bright transition-all cursor-pointer pixel-text"
              >
                Share X
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="glass font-mono text-xs py-2.5 hover:bg-accent-bright/20 hover:text-accent-bright transition-all cursor-pointer pixel-text"
              >
                Copy Link
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="w-full glass font-mono text-xs py-2.5 hover:bg-gray-100 transition-all cursor-pointer pixel-text text-gray-600"
            >
              Download JSON
            </button>
          </div>
        </div>
      </div>

      {/* Previous / Next */}
      <div className="flex justify-between mt-16 pt-6 border-t border-gray-300">
        {prevId ? (
          <Link
            href={`/exchange/${prevId}`}
            className="group flex items-center gap-2"
          >
            <span className="pixel-text text-gray-600 group-hover:text-accent-bright transition-colors">&larr;</span>
            <span className="font-sans text-sm text-gray-400 group-hover:text-accent-bright transition-colors font-bold tracking-tight">
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
            <span className="font-sans text-sm text-gray-400 group-hover:text-accent-bright transition-colors font-bold tracking-tight">
              {nextId}
            </span>
            <span className="pixel-text text-gray-600 group-hover:text-accent-bright transition-colors">&rarr;</span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
