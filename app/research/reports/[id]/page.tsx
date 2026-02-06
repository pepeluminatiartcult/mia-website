import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getResearchReportById, getResearchReports } from '@/lib/queries';
import CollageBackground from '@/components/CollageBackground';
import LocalTimestamp from '@/components/LocalTimestamp';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const report = await getResearchReportById(id);
  if (!report) return { title: 'Not Found — MIA' };
  return {
    title: `${report.title} — MIA Research`,
    description: report.summary.slice(0, 160),
  };
}

export async function generateStaticParams() {
  const reports = await getResearchReports();
  return reports.map((r) => ({ id: r.id }));
}

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  review: { bg: 'bg-[#000080]/10', text: 'text-[#000080]', border: 'border-[#000080]/30' },
  spotlight: { bg: 'bg-[#008080]/10', text: 'text-[#008080]', border: 'border-[#008080]/30' },
  hypothesis: { bg: 'bg-[#556b2f]/10', text: 'text-[#556b2f]', border: 'border-[#556b2f]/30' },
};

const defaultTypeColor = { bg: 'bg-[#808080]/10', text: 'text-[#808080]', border: 'border-[#808080]/30' };

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const report = await getResearchReportById(id);
  if (!report) notFound();

  const colors = typeColors[report.report_type.toLowerCase()] ?? defaultTypeColor;

  // Simple markdown-to-JSX: split by paragraphs, handle headers and bold
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={i} className="font-sans text-lg font-bold text-foreground mt-6 mb-2">
            {trimmed.slice(4)}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={i} className="font-sans text-xl font-bold text-foreground mt-8 mb-3">
            {trimmed.slice(3)}
          </h2>
        );
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={i} className="font-sans text-2xl font-bold text-foreground mt-8 mb-3">
            {trimmed.slice(2)}
          </h2>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter(l => l.trim());
        return (
          <ul key={i} className="list-disc list-inside space-y-1 my-3">
            {items.map((item, j) => (
              <li key={j} className="font-mono text-sm text-foreground leading-relaxed">
                {item.replace(/^[-*]\s+/, '')}
              </li>
            ))}
          </ul>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-4 border-accent-bright pl-4 my-4">
            <p className="font-mono text-sm text-foreground/80 italic leading-relaxed">
              {trimmed.replace(/^>\s*/gm, '')}
            </p>
          </blockquote>
        );
      }

      return (
        <p key={i} className="font-mono text-sm text-foreground leading-relaxed my-3">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <>
      <CollageBackground seed={`report-${id}`} density="medium" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <Link href="/research/reports" className="pixel-text text-gray-600 hover:text-accent-bright transition-colors mb-4 inline-block">
          &larr; Reports
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <span
            className={`inline-block px-2 py-0.5 text-xs font-mono border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {report.report_type.toUpperCase()}
          </span>
          {report.model_focus && (
            <span className="pixel-text text-gray-600">{report.model_focus}</span>
          )}
          {report.hypothesis_focus && (
            <span className="pixel-text text-gray-600">{report.hypothesis_focus}</span>
          )}
        </div>

        <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          {report.title}
        </h1>

        <LocalTimestamp iso={report.created_at} className="pixel-text text-gray-600 mb-8 block" />

        {/* Report Content */}
        <article className="glass p-6 sm:p-8 mb-8">
          {renderContent(report.content)}
        </article>

        {/* Social Thread */}
        {report.social_thread && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">SOCIAL THREAD DRAFT</div>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="glass p-4">
              <p className="font-mono text-sm text-foreground leading-relaxed whitespace-pre-line">
                {report.social_thread}
              </p>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
