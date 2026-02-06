import Link from 'next/link';
import { ResearchNote } from '@/lib/types';

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  IDENTITY: { bg: 'bg-[#000080]/10', text: 'text-[#000080]', border: 'border-[#000080]/30' },
  PATTERN: { bg: 'bg-[#556b2f]/10', text: 'text-[#556b2f]', border: 'border-[#556b2f]/30' },
  ANOMALY: { bg: 'bg-[#800000]/10', text: 'text-[#800000]', border: 'border-[#800000]/30' },
  HYPOTHESIS: { bg: 'bg-[#008080]/10', text: 'text-[#008080]', border: 'border-[#008080]/30' },
  OBSERVATION: { bg: 'bg-[#808080]/10', text: 'text-[#808080]', border: 'border-[#808080]/30' },
  CONTRADICTION: { bg: 'bg-[#8B0000]/10', text: 'text-[#8B0000]', border: 'border-[#8B0000]/30' },
  LONGITUDINAL: { bg: 'bg-[#4B0082]/10', text: 'text-[#4B0082]', border: 'border-[#4B0082]/30' },
};

const defaultColor = { bg: 'bg-[#808080]/10', text: 'text-[#808080]', border: 'border-[#808080]/30' };

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ResearchNotes({ notes }: { notes: ResearchNote[] }) {
  if (notes.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 relative z-10">
      <div className="flex items-center gap-3 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/notepad.png" alt="" width={16} height={16} style={{ imageRendering: 'pixelated' }} />
        <div className="pixel-text text-gray-600">RESEARCH NOTES</div>
        <div className="flex-1 h-px bg-gray-300" />
      </div>
      <div className="space-y-3">
        {notes.map((note) => {
          const colors = typeColors[note.note_type] ?? defaultColor;
          return (
            <div key={note.id} className="glass p-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-mono border ${colors.bg} ${colors.text} ${colors.border}`}
                >
                  {note.note_type}
                </span>
                {note.hypothesis_ref && (
                  <Link
                    href={`/research/${note.hypothesis_ref}`}
                    className="inline-block px-2 py-0.5 text-xs font-mono border border-gray-300 text-gray-400 hover:border-accent-bright hover:text-accent-bright transition-colors"
                  >
                    {note.hypothesis_ref}
                  </Link>
                )}
                <span className="ml-auto text-xs font-mono text-gray-600">
                  {formatDate(note.created_at)}
                </span>
              </div>
              <p className="font-mono text-sm leading-relaxed text-foreground">
                {note.note_text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
