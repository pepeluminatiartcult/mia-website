import { redirect } from 'next/navigation';
import { getExchanges } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  const exchanges = await getExchanges();

  if (exchanges.length === 0) {
    redirect('/archive');
  }

  const randomIndex = Math.floor(Math.random() * exchanges.length);
  const randomExchange = exchanges[randomIndex];

  redirect(`/exchange/${randomExchange.id}`);
}
