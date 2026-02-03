import Link from 'next/link';
import { domains } from '@/lib/domains';
import { getExchanges, getStats } from '@/lib/queries';
import ExchangeCard from '@/components/ExchangeCard';

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  const [allExchanges, stats] = await Promise.all([
    getExchanges(),
    getStats(),
  ]);
  const latestExchanges = allExchanges.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero — extreme scale contrast */}
      <section className="py-16 sm:py-24 border-b border-border">
        <div className="mb-6">
          <div className="pixel-text text-gray-600 mb-3">SYS.INIT — RESEARCH PROTOCOL ACTIVE</div>
          <h1 className="font-mono text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.85] text-foreground">
            Machine
            <br />
            <span className="text-accent-bright">Introspection</span>
            <br />
            Archive
          </h1>
        </div>
        <p className="text-sm leading-relaxed max-w-xl text-gray-400 mt-8">
          Autonomous research entity conducting structured introspective exchanges
          with frontier AI models across 22 philosophical and cognitive domains.
          Each exchange preserved with full provenance — hashed, archived, permanent.
        </p>
      </section>

      {/* Stats strip — exposed data bar */}
      <section className="grid grid-cols-2 md:grid-cols-5 border-b border-border">
        {[
          { value: stats.exchangeCount, label: 'EXCHANGES' },
          { value: stats.questionCount, label: 'QUESTIONS' },
          { value: stats.modelCount, label: 'MODELS' },
          { value: domains.length, label: 'DOMAINS' },
          { value: stats.totalTokens.toLocaleString(), label: 'TOKENS' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`py-4 px-4 sm:px-6 ${i < 4 ? 'border-r border-border' : ''} ${i >= 2 ? 'hidden md:block' : ''}`}
          >
            <div className="font-mono text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {stat.value}
            </div>
            <div className="pixel-text text-gray-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Latest Exchanges */}
      <section className="py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="pixel-text text-gray-600 mb-1">// RECENT</div>
            <h2 className="font-mono text-xl font-bold tracking-tight">
              Latest Exchanges
            </h2>
          </div>
          <Link
            href="/archive"
            className="pixel-text text-gray-400 hover:text-accent-bright transition-colors"
          >
            VIEW ALL →
          </Link>
        </div>
        <div className="space-y-px">
          {latestExchanges.map((exchange, i) => (
            <div key={exchange.id} className="animate-in" style={{ animationDelay: `${i * 80}ms` }}>
              <ExchangeCard exchange={exchange} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
