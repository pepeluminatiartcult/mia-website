import Link from 'next/link';
import { getQuestions, getExchanges } from '@/lib/queries';
import { getDomainByCode } from '@/lib/domains';
import CollageBackground from '@/components/CollageBackground';

export const revalidate = 60;

export default async function QuestionsPage() {
  const [questions, exchanges] = await Promise.all([
    getQuestions(),
    getExchanges(),
  ]);

  // Count responses per question
  const responseCounts: Record<string, number> = {};
  exchanges.forEach(e => {
    responseCounts[e.question_id] = (responseCounts[e.question_id] || 0) + 1;
  });

  // Sort questions by times_asked descending
  const sortedQuestions = [...questions].sort((a, b) => b.times_asked - a.times_asked);

  return (
    <>
      <CollageBackground seed="questions" density="medium" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <h1 className="font-sans text-5xl sm:text-7xl font-bold uppercase tracking-tighter text-white mb-3">Questions</h1>
        <div className="max-w-md mb-10 px-8 py-5" style={{ background: '#0000aa' }}>
          <p className="font-mono text-xs leading-loose text-white">
            The question bank used by MIA to probe machine consciousness.
            Each question targets specific aspects of artificial introspection
            across philosophical and cognitive domains.
          </p>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="pixel-text text-gray-600">{questions.length} QUESTIONS</div>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="space-y-2">
          {sortedQuestions.map((question, i) => {
            const responseCount = responseCounts[question.id] || 0;
            return (
              <Link
                key={question.id}
                href={`/question/${question.id}`}
                className="block glass p-4 hover:border-accent-bright transition-colors animate-in"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-sans text-lg font-bold text-accent-bright tracking-tight">
                        {question.id}
                      </span>
                      {question.domain_codes.map(code => {
                        const domain = getDomainByCode(code);
                        return (
                          <span
                            key={code}
                            className="pixel-text !text-[9px] border border-gray-300 text-gray-500 px-1.5 py-0.5"
                          >
                            {code}{domain ? ` — ${domain.name}` : ''}
                          </span>
                        );
                      })}
                    </div>
                    <p className="font-mono text-sm text-foreground leading-relaxed">
                      {question.text}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 pixel-text text-gray-600 whitespace-nowrap">
                    <span>{responseCount} response{responseCount !== 1 ? 's' : ''}</span>
                    <span className="text-gray-400 sm:hidden">|</span>
                    <span>asked {question.times_asked}x</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
