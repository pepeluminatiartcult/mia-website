import { domainCategories, getDomainsByCategory } from '@/lib/domains';
import { getExchanges } from '@/lib/queries';
import DomainCard from '@/components/DomainCard';

export const revalidate = 60;

export default async function DomainsPage() {
  const exchanges = await getExchanges();
  const exchangeCounts: Record<string, number> = {};
  exchanges.forEach(e => {
    exchangeCounts[e.domain_code] = (exchangeCounts[e.domain_code] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="pixel-text text-gray-600 mb-2">// TAXONOMY</div>
      <h1 className="font-mono text-3xl sm:text-4xl font-bold tracking-tighter mb-3">Domains</h1>
      <p className="text-sm text-gray-400 mb-10 max-w-2xl">
        22 domains organized into four categories. Each domain represents
        a distinct axis of machine introspection — from consciousness and selfhood to
        ethics, knowledge, and the boundaries of artificial existence.
      </p>

      {domainCategories.map((category, ci) => {
        const categoryDomains = getDomainsByCategory(category.name).map(d => ({
          ...d,
          exchange_count: exchangeCounts[d.code] || 0,
        }));

        return (
          <section key={category.name} className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-lg font-bold text-accent-bright tracking-tight">
                0{ci + 1}
              </span>
              <h2 className="pixel-text text-gray-400 mt-0.5">
                {category.name}
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {categoryDomains.map(domain => (
                <DomainCard key={domain.code} domain={domain} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
