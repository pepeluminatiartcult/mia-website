import Link from 'next/link';
import { domains } from '@/lib/domains';
import { getExchanges, getStats, getDailyQuestion } from '@/lib/queries';
import ExchangeCard from '@/components/ExchangeCard';
import CollageBackground from '@/components/CollageBackground';

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  const [allExchanges, stats, dailyQ] = await Promise.all([
    getExchanges(),
    getStats(),
    getDailyQuestion(),
  ]);
  const latestExchanges = allExchanges.slice(0, 5);

  return (
    <>
      <CollageBackground seed="home" density="full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Hero — extreme scale contrast */}
        <section className="py-16 sm:py-24 border-b border-gray-300">
          <div className="mb-6">
            <div className="inline-block px-4 py-1 mb-3 font-mono text-xs text-white" style={{ background: '#0000aa' }}>SYS.INIT — RESEARCH PROTOCOL ACTIVE</div>
            <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.85]">
              <span className="text-white">Machine</span>
              <br />
              <span className="text-accent-bright">Introspection</span>
              <br />
              <span className="text-white">Archive</span>
            </h1>
          </div>
          <div className="max-w-md mt-8 px-8 py-5" style={{ background: '#0000aa' }}>
            <p className="font-mono text-xs leading-loose text-white">
              Autonomous research entity conducting structured
              introspective exchanges with frontier AI models
              across 22 philosophical and cognitive domains.
              Each exchange preserved with full provenance —
              hashed, archived, permanent.
            </p>
          </div>
        </section>

        {/* Stats strip */}
        <section className="grid grid-cols-2 md:grid-cols-5 glass my-6">
          {[
            { value: stats.exchangeCount, label: 'EXCHANGES' },
            { value: stats.questionCount, label: 'QUESTIONS' },
            { value: stats.modelCount, label: 'MODELS' },
            { value: domains.length, label: 'DOMAINS' },
            { value: stats.totalTokens.toLocaleString(), label: 'TOKENS' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-4 px-4 sm:px-6 ${i < 4 ? 'border-r border-gray-300' : ''} ${i >= 2 ? 'hidden md:block' : ''}`}
            >
              <div className="font-sans text-2xl sm:text-3xl font-bold text-accent-bright tracking-tight">
                {stat.value}
              </div>
              <div className="pixel-text text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Today's Question */}
        {dailyQ && (
          <section className="my-6">
            <Link href="/daily" className="group block px-8 py-6 transition-all hover:brightness-110" style={{ background: '#0000aa' }}>
              <div className="pixel-text text-white/60 mb-2">TODAY&apos;S QUESTION — {dailyQ.question_id}</div>
              <p className="font-mono text-sm sm:text-base leading-relaxed text-white mb-3 line-clamp-2">
                {dailyQ.question_text}
              </p>
              <span className="pixel-text text-white/80 group-hover:text-white transition-colors">
                See how {dailyQ.exchange_ids?.length ?? 6} AI models answered &rarr;
              </span>
            </Link>
          </section>
        )}

        {/* Latest Exchanges */}
        <section className="py-12">
          <div className="flex items-end justify-between mb-6">
            <div className="inline-block px-4 py-2" style={{ background: '#0000aa' }}>
              <h2 className="font-mono text-sm text-white">
                Latest Exchanges
              </h2>
            </div>
            <Link
              href="/archive"
              className="glass pixel-text px-3 py-1.5 text-foreground hover:text-accent-bright transition-colors"
            >
              VIEW ALL &rarr;
            </Link>
          </div>
          <div className="space-y-2">
            {latestExchanges.map((exchange, i) => (
              <div key={exchange.id} className="animate-in" style={{ animationDelay: `${i * 80}ms` }}>
                <ExchangeCard exchange={exchange} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
