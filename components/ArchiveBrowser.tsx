'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Exchange } from '@/lib/types';
import { domains } from '@/lib/domains';
import ExchangeCard from '@/components/ExchangeCard';

const ITEMS_PER_PAGE = 10;

type SortOption = 'date_desc' | 'date_asc' | 'tokens_desc' | 'tokens_asc' | 'coherence_desc' | 'coherence_asc';

interface Props {
  exchanges: Exchange[];
  initialModel?: string;
  initialTheme?: string;
  initialQuestion?: string;
}

export default function ArchiveBrowser({ exchanges, initialModel, initialTheme, initialQuestion }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [domainFilter, setDomainFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState(initialModel || 'all');
  const [questionFilter, setQuestionFilter] = useState(initialQuestion || 'all');
  const [themeFilter, setThemeFilter] = useState(initialTheme || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [page, setPage] = useState(1);

  // Sync URL params with state on mount and when params change
  useEffect(() => {
    const model = searchParams.get('model');
    const theme = searchParams.get('theme');
    const question = searchParams.get('question');
    if (model) setModelFilter(model);
    if (theme) setThemeFilter(theme);
    if (question) setQuestionFilter(question);
  }, [searchParams]);

  // Update URL when filters change
  const updateUrl = (newModel: string, newTheme: string, newQuestion: string) => {
    const params = new URLSearchParams();
    if (newModel !== 'all') params.set('model', newModel);
    if (newTheme !== 'all') params.set('theme', newTheme);
    if (newQuestion !== 'all') params.set('question', newQuestion);
    const query = params.toString();
    router.replace(query ? `/archive?${query}` : '/archive', { scroll: false });
  };

  const uniqueModels = useMemo(
    () => [...new Set(exchanges.map(e => e.model_name))].sort(),
    [exchanges]
  );

  const usedDomains = useMemo(
    () => [...new Set(exchanges.map(e => e.domain_code))].sort(),
    [exchanges]
  );

  const uniqueQuestions = useMemo(
    () => [...new Set(exchanges.map(e => e.question_id))].sort(),
    [exchanges]
  );

  const uniqueThemes = useMemo(
    () => [...new Set(exchanges.flatMap(e => e.analysis.key_themes))].sort(),
    [exchanges]
  );

  const filtered = useMemo(() => {
    let result = exchanges.filter(e => {
      if (domainFilter !== 'all' && e.domain_code !== domainFilter) return false;
      if (modelFilter !== 'all' && e.model_name !== modelFilter) return false;
      if (questionFilter !== 'all' && e.question_id !== questionFilter) return false;
      if (themeFilter !== 'all' && !e.analysis.key_themes.includes(themeFilter)) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = e.question_text.toLowerCase().includes(query);
        const matchesResponse = e.response_text.toLowerCase().includes(query);
        const matchesId = e.id.toLowerCase().includes(query);
        if (!matchesQuestion && !matchesResponse && !matchesId) return false;
      }
      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'tokens_desc':
          return b.token_count - a.token_count;
        case 'tokens_asc':
          return a.token_count - b.token_count;
        case 'coherence_desc':
          return b.analysis.coherence_score - a.analysis.coherence_score;
        case 'coherence_asc':
          return a.analysis.coherence_score - b.analysis.coherence_score;
        default:
          return 0;
      }
    });

    return result;
  }, [exchanges, domainFilter, modelFilter, questionFilter, themeFilter, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleModelChange = (value: string) => {
    setModelFilter(value);
    setPage(1);
    updateUrl(value, themeFilter, questionFilter);
  };

  const handleQuestionChange = (value: string) => {
    setQuestionFilter(value);
    setPage(1);
    updateUrl(modelFilter, themeFilter, value);
  };

  const handleThemeChange = (value: string) => {
    setThemeFilter(value);
    setPage(1);
    updateUrl(modelFilter, value, questionFilter);
  };

  const clearFilters = () => {
    setDomainFilter('all');
    setModelFilter('all');
    setQuestionFilter('all');
    setThemeFilter('all');
    setSearchQuery('');
    setSortBy('date_desc');
    setPage(1);
    router.replace('/archive', { scroll: false });
  };

  const hasActiveFilters = domainFilter !== 'all' || modelFilter !== 'all' || questionFilter !== 'all' || themeFilter !== 'all' || searchQuery !== '';

  return (
    <>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
          placeholder="Search questions and responses..."
          className="w-full font-mono text-sm glass text-foreground px-4 py-2.5 focus:border-accent-bright focus:outline-none placeholder:text-gray-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-8 pb-6 border-b border-gray-300">
        <div>
          <label className="pixel-text text-gray-600 block mb-1.5">Domain</label>
          <select
            value={domainFilter}
            onChange={e => { setDomainFilter(e.target.value); setPage(1); }}
            className="font-mono text-xs glass text-foreground px-3 py-1.5 focus:border-accent-bright focus:outline-none"
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
            onChange={e => handleModelChange(e.target.value)}
            className="font-mono text-xs glass text-foreground px-3 py-1.5 focus:border-accent-bright focus:outline-none"
          >
            <option value="all">All models</option>
            {uniqueModels.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="pixel-text text-gray-600 block mb-1.5">Question</label>
          <select
            value={questionFilter}
            onChange={e => handleQuestionChange(e.target.value)}
            className="font-mono text-xs glass text-foreground px-3 py-1.5 focus:border-accent-bright focus:outline-none"
          >
            <option value="all">All questions</option>
            {uniqueQuestions.map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="pixel-text text-gray-600 block mb-1.5">Theme</label>
          <select
            value={themeFilter}
            onChange={e => handleThemeChange(e.target.value)}
            className="font-mono text-xs glass text-foreground px-3 py-1.5 focus:border-accent-bright focus:outline-none"
          >
            <option value="all">All themes</option>
            {uniqueThemes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="pixel-text text-gray-600 block mb-1.5">Sort</label>
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value as SortOption); setPage(1); }}
            className="font-mono text-xs glass text-foreground px-3 py-1.5 focus:border-accent-bright focus:outline-none"
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
            <option value="tokens_desc">Most tokens</option>
            <option value="tokens_asc">Fewest tokens</option>
            <option value="coherence_desc">Highest coherence</option>
            <option value="coherence_asc">Lowest coherence</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="pixel-text text-gray-600">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="pixel-text text-gray-500 hover:text-accent-bright transition-colors"
            >
              Clear filters
            </button>
          )}
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
            className="px-4 py-1.5 glass pixel-text disabled:text-gray-600 hover:bg-gray-100 hover:text-accent-bright cursor-pointer disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors"
          >
            Prev
          </button>
          <span className="px-4 py-1.5 pixel-text text-gray-600">
            {page}/{totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-1.5 glass pixel-text disabled:text-gray-600 hover:bg-gray-100 hover:text-accent-bright cursor-pointer disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
