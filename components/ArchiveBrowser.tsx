'use client';

import { useState, useMemo } from 'react';
import { Exchange } from '@/lib/types';
import { domains } from '@/lib/domains';
import ExchangeCard from '@/components/ExchangeCard';

const ITEMS_PER_PAGE = 10;

export default function ArchiveBrowser({ exchanges }: { exchanges: Exchange[] }) {
  const [domainFilter, setDomainFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [page, setPage] = useState(1);

  const uniqueModels = useMemo(
    () => [...new Set(exchanges.map(e => e.model_name))],
    [exchanges]
  );

  const usedDomains = useMemo(
    () => [...new Set(exchanges.map(e => e.domain_code))],
    [exchanges]
  );

  const filtered = useMemo(() => {
    return exchanges.filter(e => {
      if (domainFilter !== 'all' && e.domain_code !== domainFilter) return false;
      if (modelFilter !== 'all' && e.model_name !== modelFilter) return false;
      return true;
    });
  }, [exchanges, domainFilter, modelFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-8 pb-6 border-b border-gray-300">
        <div>
          <label className="pixel-text text-gray-600 block mb-1.5">Domain</label>
          <select
            value={domainFilter}
            onChange={e => { setDomainFilter(e.target.value); setPage(1); }}
            className="font-mono text-xs glass text-foreground px-3 py-1.5 focus:border-accent-bright focus:outline-none "
          >
            <option value="all">All domains</option>
            {usedDomains.map(code => {
              const d = domains.find(dm => dm.code === code);
              return (
                <option key={code} value={code}>
                  {code} — {d?.name || code}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="pixel-text text-gray-600 block mb-1.5">Model</label>
          <select
            value={modelFilter}
            onChange={e => { setModelFilter(e.target.value); setPage(1); }}
            className="font-mono text-xs glass text-foreground px-3 py-1.5 focus:border-accent-bright focus:outline-none "
          >
            <option value="all">All models</option>
            {uniqueModels.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="pixel-text text-gray-600">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Exchange List */}
      <div className="space-y-2 mb-8">
        {paginated.map((exchange, i) => (
          <div key={exchange.id} className="animate-in" style={{ animationDelay: `${i * 50}ms` }}>
            <ExchangeCard exchange={exchange} />
          </div>
        ))}
        {paginated.length === 0 && (
          <div className="py-16 text-center glass">
            <div className="pixel-text text-gray-600">NO RESULTS</div>
            <p className="font-mono text-xs text-gray-600 mt-2">
              No exchanges match the current filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-1.5 glass  pixel-text disabled:text-gray-600 hover:bg-gray-100 hover:text-accent-bright cursor-pointer disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors"
          >
            Prev
          </button>
          <span className="px-4 py-1.5 pixel-text text-gray-600">
            {page}/{totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-1.5 glass  pixel-text disabled:text-gray-600 hover:bg-gray-100 hover:text-accent-bright cursor-pointer disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
