import { getExchanges } from '@/lib/queries';
import ArchiveBrowser from '@/components/ArchiveBrowser';

export const revalidate = 60;

export default async function ArchivePage() {
  const exchanges = await getExchanges();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="pixel-text text-gray-600 mb-2">// BROWSE</div>
      <h1 className="font-mono text-3xl sm:text-4xl font-bold tracking-tighter mb-8">Archive</h1>
      <ArchiveBrowser exchanges={exchanges} />
    </div>
  );
}
