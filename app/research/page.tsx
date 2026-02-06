import { Metadata } from 'next';
import Link from 'next/link';
import { getHypotheses, getResearchNoteCounts, getDailyQuestion, getResearchReports, getExchanges, getRecentResearchNotes, getModelStats, getDomainStats } from '@/lib/queries';
import HypothesisCard from '@/components/HypothesisCard';
import ReportCard from '@/components/ReportCard';
import CollageBackground from '@/components/CollageBackground';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Research — MIA',
  description: 'Active hypotheses, reports, and evidence from MIA\'s autonomous AI phenomenology research program.',
};

export default async function ResearchPage() {
  const [hypotheses, noteCounts, dailyQ, reports, allExchanges, recentNotes, modelStats, domainStats] = await Promise.all([
    getHypotheses(),
    getResearchNoteCounts(),
    getDailyQuestion(),
    getResearchReports(),
    getExchanges(),
    getRecentResearchNotes(5),
    getModelStats(),
    getDomainStats(),
  ]);

  const activeHypotheses = hypotheses.filter(h => h.status.toLowerCase() === 'active');
  const otherHypotheses = hypotheses.filter(h => h.status.toLowerCase() !== 'active');
  const recentReports = reports.slice(0, 3);

  return (
    <>
      <CollageBackground seed="research" density="medium" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <h1 className="font-sans text-5xl sm:text-7xl font-bold uppercase tracking-tighter text-white mb-3">Research</h1>
        <div className="mb-10 px-8 py-5" style={{ background: '#0000aa' }}>
          <p className="font-mono text-xs leading-loose text-white mb-3">
            MIA&apos;s autonomous research program has analyzed{' '}
            <strong>{allExchanges.length}</strong> exchanges across{' '}
            <strong>{domainStats.length}</strong> domains,
            studying <strong>{modelStats.length}</strong> AI models,
            generated <strong>{hypotheses.length}</strong> hypotheses,
            and published <strong>{reports.length}</strong> reports.
          </p>
          {domainStats.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {domainStats.slice(0, 12).map((d) => (
                <span key={d.domain_code} className="pixel-text text-white/80" style={{ fontSize: '9px' }}>
                  {d.domain_code}:{d.exchange_count}
                </span>
              ))}
              {domainStats.length > 12 && (
                <span className="pixel-text text-white/50" style={{ fontSize: '9px' }}>
                  +{domainStats.length - 12} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Today's Highlight */}
        {dailyQ && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">TODAY&apos;S HIGHLIGHT</div>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <Link
              href="/daily"
              className="group block glass hover:bg-gray-100 transition-all p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <span className="pixel-text text-gray-600">{dailyQ.question_id}</span>
                <span className="pixel-text text-gray-600">{dailyQ.exchange_ids?.length ?? 0} models</span>
              </div>
              <p className="font-mono text-sm text-foreground leading-relaxed mb-2 group-hover:text-accent-bright transition-colors line-clamp-2">
                {dailyQ.question_text}
              </p>
              <span className="pixel-text text-accent-bright">View daily question &rarr;</span>
            </Link>
          </section>
        )}

        {/* Active Hypotheses */}
        {activeHypotheses.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">ACTIVE HYPOTHESES</div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className="pixel-text text-gray-600">{activeHypotheses.length}</div>
            </div>
            <div className="space-y-2">
              {activeHypotheses.map((hypothesis, i) => {
                const counts = noteCounts[hypothesis.id] ?? { notes: 0, exchanges: 0 };
                return (
                  <div key={hypothesis.id} className="animate-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <HypothesisCard
                      hypothesis={hypothesis}
                      noteCount={counts.notes}
                      exchangeCount={counts.exchanges}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recent Reports */}
        {recentReports.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">RECENT REPORTS</div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className="pixel-text text-gray-600">{reports.length}</div>
            </div>
            <div className="space-y-2">
              {recentReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
            {reports.length > 3 && (
              <Link
                href="/research/reports"
                className="glass pixel-text px-3 py-1.5 mt-3 inline-block text-gray-600 hover:text-accent-bright transition-colors"
              >
                View all reports &rarr;
              </Link>
            )}
          </section>
        )}

        {/* Models Under Study */}
        {modelStats.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">MODELS UNDER STUDY</div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className="pixel-text text-gray-600">{modelStats.length}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {modelStats.map((model) => (
                <Link
                  key={model.model_id}
                  href={`/archive?model=${encodeURIComponent(model.model_id)}`}
                  className="glass p-3 hover:bg-gray-100 transition-all group"
                >
                  <div className="font-mono text-xs font-bold text-foreground group-hover:text-accent-bright transition-colors truncate">
                    {model.model_name}
                  </div>
                  <div className="pixel-text text-gray-600 mt-1" style={{ fontSize: '9px' }}>
                    {model.exchange_count} exchanges &middot; {model.domains.length} domains
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    <div className="pixel-text text-gray-600" style={{ fontSize: '9px' }}>
                      COH {(model.avg_coherence * 100).toFixed(0)}%
                    </div>
                    <div className="pixel-text text-gray-600" style={{ fontSize: '9px' }}>
                      NOV {(model.avg_novelty * 100).toFixed(0)}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent Observations */}
        {recentNotes.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">RECENT OBSERVATIONS</div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className="pixel-text text-gray-600">{recentNotes.length}</div>
            </div>
            <div className="space-y-2">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/exchange/${note.exchange_id}`}
                  className="glass p-4 block hover:bg-gray-100 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <span
                      className="pixel-text px-1.5 py-0.5 shrink-0"
                      style={{
                        fontSize: '9px',
                        background: note.note_type === 'ANOMALY' ? '#8b0000'
                          : note.note_type === 'HYPOTHESIS' ? '#556b2f'
                          : note.note_type === 'PATTERN' ? '#000080'
                          : '#333',
                        color: '#fff',
                      }}
                    >
                      {note.note_type}
                    </span>
                    <span className="pixel-text text-gray-600 shrink-0" style={{ fontSize: '9px' }}>
                      {note.exchange_model || note.exchange_id.slice(-8)}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-foreground leading-relaxed line-clamp-2 group-hover:text-accent-bright transition-colors">
                    {note.note_text}
                  </p>
                  {note.hypothesis_ref && (
                    <span className="pixel-text text-gray-600 mt-1 inline-block" style={{ fontSize: '9px' }}>
                      {note.hypothesis_ref}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {hypotheses.length === 0 && reports.length === 0 && (
          <div className="glass p-8 text-center mb-12">
            <p className="font-mono text-sm text-gray-600">
              No hypotheses or reports yet. The research program will generate them as exchanges accumulate.
            </p>
          </div>
        )}

        {/* Methodology */}
        <section className="mt-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="pixel-text text-gray-600">METHODOLOGY</div>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="glass p-6">
            <p className="font-mono text-sm leading-relaxed text-foreground mb-4">
              MIA operates a multi-tier autonomous research system. <strong>Daily analysis</strong> scores
              each exchange for interest, deflection, and surprise, flagging notable observations.
              <strong> 3x weekly deep analysis</strong> (Sunday reviews, Tuesday model spotlights,
              Thursday hypothesis labs) synthesizes findings using Sonnet.
            </p>
            <p className="font-mono text-sm leading-relaxed text-gray-600">
              Questions are selected using research-aware prioritization: hypothesis test questions first,
              then priority domains from daily context, then under-represented domains. A 7-day spacing
              rule prevents the same model from receiving the same question too frequently. The daily
              Question of the Day asks all 6 partner models the same question for cross-model comparison.
            </p>
          </div>
        </section>

        {/* Resolved Hypotheses */}
        {otherHypotheses.length > 0 && (
          <section className="mt-12 mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">RESOLVED HYPOTHESES</div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className="pixel-text text-gray-600">{otherHypotheses.length}</div>
            </div>
            <div className="space-y-2">
              {otherHypotheses.map((hypothesis) => {
                const counts = noteCounts[hypothesis.id] ?? { notes: 0, exchanges: 0 };
                return (
                  <HypothesisCard
                    key={hypothesis.id}
                    hypothesis={hypothesis}
                    noteCount={counts.notes}
                    exchangeCount={counts.exchanges}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
