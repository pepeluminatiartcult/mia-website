import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getHypothesisById,
  getHypotheses,
  getResearchNotesByHypothesis,
  getExchangesByIds,
  getQuestionsByIds,
} from '@/lib/queries';
import { ResearchNote, Exchange, Question } from '@/lib/types';
import Breadcrumbs from '@/components/Breadcrumbs';
import CollageBackground from '@/components/CollageBackground';
import LocalTimestamp from '@/components/LocalTimestamp';

export const revalidate = 60;

export async function generateStaticParams() {
  const hypotheses = await getHypotheses();
  return hypotheses.map(h => ({ id: h.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const hypothesis = await getHypothesisById(id);

  if (!hypothesis) {
    return { title: 'Hypothesis Not Found — MIA' };
  }

  return {
    title: `${hypothesis.id} — Research — MIA`,
    description: hypothesis.title,
  };
}

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  IDENTITY: { bg: 'bg-[#000080]/10', text: 'text-[#000080]', border: 'border-[#000080]/30' },
  PATTERN: { bg: 'bg-[#556b2f]/10', text: 'text-[#556b2f]', border: 'border-[#556b2f]/30' },
  ANOMALY: { bg: 'bg-[#800000]/10', text: 'text-[#800000]', border: 'border-[#800000]/30' },
  HYPOTHESIS: { bg: 'bg-[#008080]/10', text: 'text-[#008080]', border: 'border-[#008080]/30' },
  OBSERVATION: { bg: 'bg-[#808080]/10', text: 'text-[#808080]', border: 'border-[#808080]/30' },
  CONTRADICTION: { bg: 'bg-[#8B0000]/10', text: 'text-[#8B0000]', border: 'border-[#8B0000]/30' },
  LONGITUDINAL: { bg: 'bg-[#4B0082]/10', text: 'text-[#4B0082]', border: 'border-[#4B0082]/30' },
};
const defaultColor = { bg: 'bg-[#808080]/10', text: 'text-[#808080]', border: 'border-[#808080]/30' };

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  active: { bg: 'bg-[#008080]/10', text: 'text-[#008080]', border: 'border-[#008080]/30' },
  confirmed: { bg: 'bg-[#556b2f]/10', text: 'text-[#556b2f]', border: 'border-[#556b2f]/30' },
  refuted: { bg: 'bg-[#800000]/10', text: 'text-[#800000]', border: 'border-[#800000]/30' },
};
const defaultStatusColor = { bg: 'bg-[#808080]/10', text: 'text-[#808080]', border: 'border-[#808080]/30' };

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function HypothesisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [hypothesis, notes] = await Promise.all([
    getHypothesisById(id),
    getResearchNotesByHypothesis(id),
  ]);

  if (!hypothesis) {
    notFound();
  }

  // Get unique exchange IDs from notes
  const exchangeIds = [...new Set(notes.map(n => n.exchange_id))];
  const exchanges = await getExchangesByIds(exchangeIds);

  // Get test question details
  const testQuestionIds = hypothesis.test_questions?.map(tq => tq.question_id) ?? [];
  const testQuestions = await getQuestionsByIds(testQuestionIds);
  const questionMap = new Map(testQuestions.map(q => [q.id, q]));

  // Group notes by exchange
  const notesByExchange = new Map<string, ResearchNote[]>();
  for (const note of notes) {
    const existing = notesByExchange.get(note.exchange_id) ?? [];
    existing.push(note);
    notesByExchange.set(note.exchange_id, existing);
  }

  // Map exchanges for lookup
  const exchangeMap = new Map<string, Exchange>(exchanges.map(e => [e.id, e]));

  const statusColor = statusColors[hypothesis.status.toLowerCase()] ?? defaultStatusColor;
  const pct = Math.round(hypothesis.confidence * 100);

  return (
    <>
      <CollageBackground seed={hypothesis.id} density="sparse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <Breadcrumbs
          items={[
            { label: 'Research', href: '/research' },
            { label: hypothesis.id },
          ]}
        />

        <h1 className="font-sans text-4xl sm:text-5xl font-bold tracking-tighter text-accent-bright mb-8 glitch-hover">
          {hypothesis.id}
        </h1>

        {/* Hypothesis details */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="pixel-text text-gray-600">HYPOTHESIS</div>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="glass p-6">
            <p className="font-mono text-sm font-bold text-foreground leading-relaxed mb-4">
              {hypothesis.title}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="pixel-text text-gray-600">Status</span>
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-mono border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}
                >
                  {hypothesis.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2 min-w-[200px]">
                <span className="pixel-text text-gray-600">Confidence</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="score-bar flex-1">
                    <div className="score-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="font-mono text-xs text-foreground">{pct}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="pixel-text text-gray-600">Proposed</span>
                <span className="font-mono text-xs text-foreground">{formatDate(hypothesis.created_at)}</span>
              </div>
            </div>

            <p className="font-mono text-sm leading-relaxed text-foreground">
              {hypothesis.rationale}
            </p>
          </div>
        </section>

        {/* Evidence */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="pixel-text text-gray-600">EVIDENCE</div>
            <div className="flex-1 h-px bg-gray-300" />
            <div className="pixel-text text-gray-600">
              {exchangeIds.length} exchange{exchangeIds.length !== 1 ? 's' : ''}, {notes.length} note{notes.length !== 1 ? 's' : ''}
            </div>
          </div>

          {exchangeIds.length === 0 ? (
            <div className="glass p-6 text-center">
              <p className="font-mono text-sm text-gray-600">
                No evidence exchanges yet. Notes will appear here as the research program generates observations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {exchangeIds.map((exchangeId) => {
                const exchange = exchangeMap.get(exchangeId);
                const exchangeNotes = notesByExchange.get(exchangeId) ?? [];
                if (!exchange) return null;

                return (
                  <div key={exchangeId} className="glass p-4 sm:p-5">
                    {/* Exchange header */}
                    <Link
                      href={`/exchange/${exchange.id}`}
                      className="group flex items-start justify-between gap-4 mb-4 pb-3 border-b border-gray-300"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-base font-bold text-accent-bright tracking-tight group-hover:text-accent-bright glitch-hover">
                          {exchange.id}
                        </span>
                        <span className="pixel-text text-gray-600">
                          {exchange.domain_code}
                        </span>
                        <span className="pixel-text text-gray-600">
                          {exchange.model_name}
                        </span>
                      </div>
                      <LocalTimestamp iso={exchange.created_at} className="pixel-text text-gray-600 shrink-0" />
                    </Link>

                    {/* Question excerpt */}
                    <p className="font-mono text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                      {exchange.question_text}
                    </p>

                    {/* Inline research notes */}
                    <div className="space-y-2">
                      {exchangeNotes.map((note) => {
                        const colors = typeColors[note.note_type] ?? defaultColor;
                        return (
                          <div key={note.id} className="glass p-3">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span
                                className={`inline-block px-2 py-0.5 text-xs font-mono border ${colors.bg} ${colors.text} ${colors.border}`}
                              >
                                {note.note_type}
                              </span>
                              <span className="ml-auto text-xs font-mono text-gray-600">
                                {formatDate(note.created_at)}
                              </span>
                            </div>
                            <p className="font-mono text-sm leading-relaxed text-foreground">
                              {note.note_text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Test Questions */}
        {hypothesis.test_questions && hypothesis.test_questions.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">TEST QUESTIONS</div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className="pixel-text text-gray-600">{hypothesis.test_questions.length}</div>
            </div>
            <div className="space-y-2">
              {hypothesis.test_questions.map((tq) => {
                const question = questionMap.get(tq.question_id);
                return (
                  <div key={tq.question_id} className="glass p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <Link
                        href={`/question/${tq.question_id}`}
                        className="font-sans text-base font-bold text-accent-bright tracking-tight hover:text-accent-bright shrink-0"
                      >
                        {tq.question_id}
                      </Link>
                      {question && (
                        <p className="font-mono text-sm text-foreground leading-relaxed line-clamp-2">
                          {question.text}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="pixel-text text-gray-600">Targets:</span>
                      {tq.target_models.map(model => (
                        <span
                          key={model}
                          className="pixel-text !text-[9px] border border-gray-300 text-gray-500 px-1.5 py-0.5"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                    {tq.purpose && (
                      <p className="font-mono text-xs text-gray-600 leading-relaxed mt-2">
                        {tq.purpose}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
