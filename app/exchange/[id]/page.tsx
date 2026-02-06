import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getExchangeById, getExchanges, getResearchNotes } from '@/lib/queries';
import ExchangeDetail from '@/components/ExchangeDetail';
import RelatedExchanges, { computeRelatedExchanges } from '@/components/RelatedExchanges';
import ResearchNotes from '@/components/ResearchNotes';
import CollageBackground from '@/components/CollageBackground';

export const revalidate = 60;

export async function generateStaticParams() {
  const exchanges = await getExchanges();
  return exchanges.map(e => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const exchange = await getExchangeById(id);

  if (!exchange) {
    return { title: 'Exchange Not Found — MIA' };
  }

  const questionExcerpt =
    exchange.question_text.length > 160
      ? exchange.question_text.slice(0, 160) + '...'
      : exchange.question_text;

  return {
    title: `${exchange.id} — MIA`,
    description: questionExcerpt,
    openGraph: {
      title: `${exchange.id} — Machine Introspection Archive`,
      description: questionExcerpt,
      images: [`/exchange/${exchange.id}/og`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${exchange.id} — MIA`,
      description: questionExcerpt,
      images: [`/exchange/${exchange.id}/og`],
    },
  };
}

export default async function ExchangePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [exchange, allExchanges, researchNotes] = await Promise.all([
    getExchangeById(id),
    getExchanges(),
    getResearchNotes(id),
  ]);

  if (!exchange) {
    notFound();
  }

  const currentIndex = allExchanges.findIndex(e => e.id === id);
  const prevId = currentIndex > 0 ? allExchanges[currentIndex - 1].id : null;
  const nextId = currentIndex < allExchanges.length - 1 ? allExchanges[currentIndex + 1].id : null;

  const relatedExchanges = computeRelatedExchanges(exchange, allExchanges, 5);

  return (
    <>
      <CollageBackground seed={exchange.id} density="sparse" />
      <ExchangeDetail exchange={exchange} prevId={prevId} nextId={nextId} />
      <ResearchNotes notes={researchNotes} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 relative z-10">
        <RelatedExchanges related={relatedExchanges} />
      </div>
    </>
  );
}
