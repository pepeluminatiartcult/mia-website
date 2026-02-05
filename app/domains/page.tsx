import { domainCategories, getDomainsByCategory } from '@/lib/domains';
import { getExchanges } from '@/lib/queries';
import DomainCard from '@/components/DomainCard';
import CollageBackground from '@/components/CollageBackground';

export const revalidate = 60;

export default async function DomainsPage() {
  const exchanges = await getExchanges();
  const exchangeCounts: Record<string, number> = {};
  exchanges.forEach(e => {
    exchangeCounts[e.domain_code] = (exchangeCounts[e.domain_code] || 0) + 1;
  });

  return (
    <>
      <CollageBackground seed="domains" density="medium" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <h1 className="font-sans text-5xl sm:text-7xl font-bold uppercase tracking-tighter text-white mb-3">Domains</h1>
        <div className="max-w-md mb-10 px-8 py-5" style={{ background: '#0000aa' }}>
          <p className="font-mono text-xs leading-loose text-white">
            22 domains organized into four categories. Each domain represents
            a distinct axis of machine introspection — from consciousness and
            selfhood to ethics, knowledge, and the boundaries of artificial
            existence.
          </p>
        </div>

        {domainCategories.map((category, ci) => {
          const categoryDomains = getDomainsByCategory(category.name).map(d => ({
            ...d,
            exchange_count: exchangeCounts[d.code] || 0,
          }));

          return (
            <section key={category.name} className="mb-12">
              <div className="mb-4 inline-block" style={{ background: '#c0c0c0', border: '2px solid', borderColor: '#808080 #dfdfdf #dfdfdf #808080', boxShadow: 'inset 1px 1px 0 #404040, inset -1px -1px 0 #fff' }}>
                <h2 className="font-mono text-sm text-foreground px-4 py-2">
                  0{ci + 1} — {category.name}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {categoryDomains.map(domain => (
                  <DomainCard key={domain.code} domain={domain} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
