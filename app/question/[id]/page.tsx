import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getExchangesByQuestion, getQuestionById, getQuestions } from '@/lib/queries';
import { getDomainByCode } from '@/lib/domains';
import ExchangeCard from '@/components/ExchangeCard';
import CollageBackground from '@/components/CollageBackground';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 60;

export async function generateStaticParams() {
  const questions = await getQuestions();
  return questions.map(q => ({ id: q.id }));
}

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [question, exchanges] = await Promise.all([
    getQuestionById(id),
    getExchangesByQuestion(id),
  ]);

  if (!question && exchanges.length === 0) {
    notFound();
  }

  // Get question text from either the question record or the first exchange
  const questionText = question?.text || exchanges[0]?.question_text || '';
  const domainCodes = question?.domain_codes || (exchanges[0] ? [exchanges[0].domain_code] : []);

  // Get unique models that responded
  const uniqueModels = [...new Set(exchanges.map(e => e.model_name))];

  return (
    <>
      <CollageBackground seed={id} density="sparse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <Breadcrumbs
          items={[
            { label: 'Archive', href: '/archive' },
            { label: domainCodes[0] || 'Question', href: domainCodes[0] ? `/domains/${domainCodes[0]}` : undefined },
            { label: id },
          ]}
        />

        <div className="mb-8 pb-6 border-b border-gray-300">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mb-3">
            <h1 className="font-sans text-3xl sm:text-4xl font-bold text-accent-bright tracking-tighter glitch-hover">
              {id}
            </h1>
            <div className="flex flex-wrap gap-2">
              {domainCodes.map(code => {
                const domain = getDomainByCode(code);
                return (
                  <Link
                    key={code}
                    href={`/domains/${code}`}
                    className="pixel-text text-gray-600 hover:text-accent-bright transition-colors"
                  >
                    {code}{domain ? ` — ${domain.name}` : ''}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="glass p-5 mb-4" style={{ background: '#0000aa' }}>
            <p className="font-mono text-sm leading-loose text-white">
              {questionText}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pixel-text text-gray-600">
            <span>{exchanges.length} Exchange{exchanges.length !== 1 ? 's' : ''}</span>
            <span className="text-gray-400">|</span>
            <span>{uniqueModels.length} Model{uniqueModels.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="pixel-text text-gray-600">MODEL RESPONSES</div>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          {exchanges.length > 0 ? (
            <div className="space-y-2">
              {exchanges.map(exchange => (
                <ExchangeCard key={exchange.id} exchange={exchange} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center glass">
              <div className="pixel-text text-gray-600">NO RESPONSES</div>
              <p className="font-mono text-xs text-gray-600 mt-2">
                No exchanges found for this question.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
