import { Metadata } from 'next';
import Link from 'next/link';
import { getDailyQuestion, getDailyQuestionArchive, getDailyQuestionExchanges } from '@/lib/queries';
import CollageBackground from '@/components/CollageBackground';
import DailyQuestionCard from '@/components/DailyQuestionCard';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Daily Question — MIA',
  description: 'Today\'s question asked to 6 AI models. See how frontier AI systems respond to the same philosophical question.',
};

export default async function DailyPage() {
  const [todayQ, archive] = await Promise.all([
    getDailyQuestion(),
    getDailyQuestionArchive(),
  ]);

  const exchanges = todayQ ? await getDailyQuestionExchanges(todayQ.date) : [];

  // Find yesterday and tomorrow for navigation
  const archiveDates = archive.map(q => q.date);
  const todayIdx = todayQ ? archiveDates.indexOf(todayQ.date) : -1;
  const prevDate = todayIdx >= 0 && todayIdx < archiveDates.length - 1 ? archiveDates[todayIdx + 1] : null;

  return (
    <>
      <CollageBackground seed="daily" density="medium" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <h1 className="font-sans text-5xl sm:text-7xl font-bold uppercase tracking-tighter text-white mb-3">Daily</h1>

        {todayQ ? (
          <>
            {/* Question */}
            <section className="mb-8">
              <div className="max-w-3xl mb-6 px-8 py-6" style={{ background: '#0000aa' }}>
                <div className="pixel-text text-white/60 mb-2">TODAY&apos;S QUESTION — {todayQ.question_id}</div>
                <p className="font-mono text-base sm:text-lg leading-relaxed text-white">
                  {todayQ.question_text}
                </p>
              </div>

              {/* Reasoning */}
              <div className="glass p-4 max-w-3xl">
                <div className="pixel-text text-gray-600 mb-1">WHY THIS QUESTION</div>
                <p className="font-mono text-sm text-foreground leading-relaxed">
                  {todayQ.reason}
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
                  &larr; Yesterday
                </Link>
              ) : (
                <span className="pixel-text px-3 py-1.5 text-gray-600/30">&larr; Yesterday</span>
              )}
              <span className="pixel-text text-gray-600/30">Tomorrow &rarr;</span>
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
                    const isAnswer = exchange.id === todayQ.answer_of_the_day_id;
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
            {todayQ.tweet_suggestion && (
              <section className="mb-12">
                <div className="mb-4 flex items-center gap-3">
                  <div className="pixel-text text-gray-600">TWEET SUGGESTION</div>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
                <div className="glass p-4 max-w-2xl">
                  <p className="font-mono text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {todayQ.tweet_suggestion}
                  </p>
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="glass p-8 text-center mb-12">
            <p className="font-mono text-sm text-gray-600">
              No daily question yet. The QOTD engine runs daily at 6:00 AM CT.
            </p>
          </div>
        )}

        {/* Archive */}
        {archive.length > 1 && (
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">ARCHIVE</div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className="pixel-text text-gray-600">{archive.length}</div>
            </div>
            <div className="space-y-2">
              {archive.slice(1).map((q) => (
                <DailyQuestionCard key={q.date} question={q} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
