import { getExchanges } from '@/lib/queries';
import ArchiveBrowser from '@/components/ArchiveBrowser';
import CollageBackground from '@/components/CollageBackground';

export const revalidate = 60;

export default async function ArchivePage() {
  const exchanges = await getExchanges();

  return (
    <>
      <CollageBackground seed="archive" density="medium" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <h1 className="font-sans text-5xl sm:text-7xl font-bold uppercase tracking-tighter text-white mb-8">Archive</h1>
        <ArchiveBrowser exchanges={exchanges} />
      </div>
    </>
  );
}
