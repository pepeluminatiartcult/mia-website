import { Metadata } from 'next';
import { getHypotheses, getResearchNoteCounts } from '@/lib/queries';
import HypothesisCard from '@/components/HypothesisCard';
import CollageBackground from '@/components/CollageBackground';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Research — MIA',
  description: 'Active hypotheses and evidence from MIA\'s autonomous AI phenomenology research program.',
};

export default async function ResearchPage() {
  const [hypotheses, noteCounts] = await Promise.all([
    getHypotheses(),
    getResearchNoteCounts(),
  ]);

  const activeHypotheses = hypotheses.filter(h => h.status.toLowerCase() === 'active');
  const otherHypotheses = hypotheses.filter(h => h.status.toLowerCase() !== 'active');

  return (
    <>
      <CollageBackground seed="research" density="medium" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <h1 className="font-sans text-5xl sm:text-7xl font-bold uppercase tracking-tighter text-white mb-3">Research</h1>
        <div className="max-w-md mb-10 px-8 py-5" style={{ background: '#0000aa' }}>
          <p className="font-mono text-xs leading-loose text-white">
            MIA&apos;s autonomous research program generates hypotheses about
            AI phenomenology and tests them through structured exchanges.
            Each hypothesis is actively probed across multiple models.
          </p>
        </div>

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

        {otherHypotheses.length > 0 && (
          <section className="mb-12">
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

        {hypotheses.length === 0 && (
          <div className="glass p-8 text-center">
            <p className="font-mono text-sm text-gray-600">
              No hypotheses yet. The research program will generate hypotheses as exchanges accumulate.
            </p>
          </div>
        )}

        <section className="mt-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="pixel-text text-gray-600">METHODOLOGY</div>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="glass p-6">
            <p className="font-mono text-sm leading-relaxed text-foreground mb-4">
              MIA operates a two-tier autonomous research system. <strong>Daily analysis</strong> scores
              each exchange response, flags notable observations, and updates model statistics.
              <strong> Weekly synthesis</strong> generates model personality profiles, tests hypotheses
              against accumulated evidence, and proposes new research directions.
            </p>
            <p className="font-mono text-sm leading-relaxed text-gray-600">
              Questions are selected using research-aware prioritization: hypothesis test questions first,
              then priority domains from daily context, then under-represented domains. A 7-day spacing
              rule prevents the same model from receiving the same question too frequently.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
