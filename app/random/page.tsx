import { redirect } from 'next/navigation';
import { getExchanges } from '@/lib/queries';
import RandomExchange from '@/components/RandomExchange';
import CollageBackground from '@/components/CollageBackground';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Random Exchange — MIA',
  description: 'View a random introspective exchange from the Machine Introspection Archive',
};

export default async function RandomPage() {
  const exchanges = await getExchanges();

  if (exchanges.length === 0) {
    redirect('/archive');
  }

  const randomIndex = Math.floor(Math.random() * exchanges.length);
  const initialExchange = exchanges[randomIndex];

  return (
    <>
      <CollageBackground seed="random" density="sparse" />
      <RandomExchange initialExchange={initialExchange} allExchanges={exchanges} />
    </>
  );
}
