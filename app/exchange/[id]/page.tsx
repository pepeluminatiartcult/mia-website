import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getExchangeById, getExchanges } from '@/lib/queries';
import ExchangeDetail from '@/components/ExchangeDetail';
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
  const [exchange, allExchanges] = await Promise.all([
    getExchangeById(id),
    getExchanges(),
  ]);

  if (!exchange) {
    notFound();
  }

  const currentIndex = allExchanges.findIndex(e => e.id === id);
  const prevId = currentIndex > 0 ? allExchanges[currentIndex - 1].id : null;
  const nextId = currentIndex < allExchanges.length - 1 ? allExchanges[currentIndex + 1].id : null;

  return (
    <>
      <CollageBackground seed={exchange.id} density="sparse" />
      <ExchangeDetail exchange={exchange} prevId={prevId} nextId={nextId} />
    </>
  );
}
