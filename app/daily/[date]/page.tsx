import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDailyQuestion, getDailyQuestionArchive, getDailyQuestionExchanges } from '@/lib/queries';
import CollageBackground from '@/components/CollageBackground';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  const dq = await getDailyQuestion(date);
  if (!dq) return { title: 'Not Found — MIA' };
  return {
    title: `${date} Daily Question — MIA`,
    description: dq.question_text.slice(0, 160),
  };
}

export async function generateStaticParams() {
  const archive = await getDailyQuestionArchive();
  return archive.map((q) => ({ date: q.date }));
}

export default async function DailyDatePage({ params }: PageProps) {
  const { date } = await params;
  const [dq, archive] = await Promise.all([
    getDailyQuestion(date),
    getDailyQuestionArchive(),
  ]);

  if (!dq) notFound();

  const exchanges = await getDailyQuestionExchanges(date);

  // Find prev/next dates
  const archiveDates = archive.map(q => q.date);
  const idx = archiveDates.indexOf(date);
  const prevDate = idx >= 0 && idx < archiveDates.length - 1 ? archiveDates[idx + 1] : null;
  const nextDate = idx > 0 ? archiveDates[idx - 1] : null;

  const displayDate = new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <CollageBackground seed={`daily-${date}`} density="medium" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <Link href="/daily" className="pixel-text text-gray-600 hover:text-accent-bright transition-colors mb-4 inline-block">
          &larr; Daily
        </Link>

        <h1 className="font-sans text-3xl sm:text-5xl font-bold uppercase tracking-tighter text-white mb-1">
          {displayDate}
        </h1>

        {/* Question */}
        <section className="mb-8">
          <div className="max-w-3xl mb-6 px-8 py-6" style={{ background: '#0000aa' }}>
            <div className="pixel-text text-white/60 mb-2">QUESTION — {dq.question_id}</div>
            <p className="font-mono text-base sm:text-lg leading-relaxed text-white">
              {dq.question_text}
            </p>
          </div>

          <div className="glass p-4 max-w-3xl">
            <div className="pixel-text text-gray-600 mb-1">WHY THIS QUESTION</div>
            <p className="font-mono text-sm text-foreground leading-relaxed">
              {dq.reason}
            </p>
          </div>
        </section>

        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          {prevDate ? (
            <Link
              href={`/daily/${prevDate}`}
              className="glass pixel-text px-3 py-1.5 text-gray-600 hover:text-accent-bright transition-colors"
            >
              &larr; Previous
            </Link>
          ) : (
            <span className="pixel-text px-3 py-1.5 text-gray-600/30">&larr; Previous</span>
          )}
          {nextDate ? (
            <Link
              href={`/daily/${nextDate}`}
              className="glass pixel-text px-3 py-1.5 text-gray-600 hover:text-accent-bright transition-colors"
            >
              Next &rarr;
            </Link>
          ) : (
            <Link
              href="/daily"
              className="glass pixel-text px-3 py-1.5 text-gray-600 hover:text-accent-bright transition-colors"
            >
              Latest &rarr;
            </Link>
          )}
        </div>

        {/* Model Responses */}
        {exchanges.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">MODEL RESPONSES</div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className="pixel-text text-gray-600">{exchanges.length}</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {exchanges.map((exchange) => {
                const isAnswer = exchange.id === dq.answer_of_the_day_id;
                return (
                  <Link
                    key={exchange.id}
                    href={`/exchange/${exchange.id}`}
                    className={`group block glass hover:bg-gray-100 transition-all p-4 sm:p-5 ${
                      isAnswer ? 'border-l-4 border-l-accent-bright' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="font-sans text-base font-bold text-accent-bright tracking-tight">
                        {exchange.model_name}
                      </span>
                      {isAnswer && (
                        <span className="inline-block px-2 py-0.5 text-xs font-mono border bg-accent-bright/10 text-accent-bright border-accent-bright/30">
                          ANSWER OF THE DAY
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-sm leading-relaxed text-gray-400 group-hover:text-foreground transition-colors line-clamp-6">
                      {exchange.response_text}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="pixel-text text-gray-600">
                        {exchange.token_count.toLocaleString()} TKN
                      </span>
                      <span className="text-gray-600">|</span>
                      <span className="pixel-text text-gray-600">
                        T={exchange.analysis.coherence_score}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Tweet Suggestion */}
        {dq.tweet_suggestion && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">TWEET SUGGESTION</div>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="glass p-4 max-w-2xl">
              <p className="font-mono text-sm text-foreground leading-relaxed whitespace-pre-line">
                {dq.tweet_suggestion}
              </p>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
