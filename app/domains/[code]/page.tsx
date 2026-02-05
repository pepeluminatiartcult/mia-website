import { notFound } from 'next/navigation';
import { domains, getDomainByCode } from '@/lib/domains';
import { getExchangesByDomain } from '@/lib/queries';
import ExchangeCard from '@/components/ExchangeCard';
import CollageBackground from '@/components/CollageBackground';
import Breadcrumbs from '@/components/Breadcrumbs';

export function generateStaticParams() {
  return domains.map(d => ({ code: d.code }));
}

export default async function DomainPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const domain = getDomainByCode(code);

  if (!domain) {
    notFound();
  }

  const domainExchanges = await getExchangesByDomain(code);

  return (
    <>
      <CollageBackground seed={code} density="sparse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <Breadcrumbs
          items={[
            { label: 'Domains', href: '/domains' },
            { label: domain.code },
          ]}
        />

        <div className="mb-8 pb-6 border-b border-gray-300">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mb-2">
            <h1 className="font-sans text-4xl sm:text-5xl font-bold text-accent-bright tracking-tighter glitch-hover">
              {domain.code}
            </h1>
            <span className="font-mono text-lg text-foreground mb-1">{domain.name}</span>
          </div>
          <div className="pixel-text text-gray-600 mb-3">{domain.category}</div>
          <p className="font-mono text-sm text-gray-400 max-w-2xl leading-relaxed">
            {domain.description}
          </p>
        </div>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="pixel-text text-gray-600">EXCHANGES</div>
            <div className="flex-1 h-px bg-gray-300" />
            <div className="pixel-text text-gray-600">{domainExchanges.length}</div>
          </div>
          {domainExchanges.length > 0 ? (
            <div className="space-y-2">
              {domainExchanges.map(exchange => (
                <ExchangeCard key={exchange.id} exchange={exchange} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center glass">
              <div className="pixel-text text-gray-600">EMPTY</div>
              <p className="font-mono text-xs text-gray-600 mt-2">
                No exchanges in this domain yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
