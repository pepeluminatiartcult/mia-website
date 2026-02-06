import Link from 'next/link';
import { ResearchReport } from '@/lib/types';
import LocalTimestamp from '@/components/LocalTimestamp';

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  review: { bg: 'bg-[#000080]/10', text: 'text-[#000080]', border: 'border-[#000080]/30' },
  spotlight: { bg: 'bg-[#008080]/10', text: 'text-[#008080]', border: 'border-[#008080]/30' },
  hypothesis: { bg: 'bg-[#556b2f]/10', text: 'text-[#556b2f]', border: 'border-[#556b2f]/30' },
};

const defaultTypeColor = { bg: 'bg-[#808080]/10', text: 'text-[#808080]', border: 'border-[#808080]/30' };

export default function ReportCard({ report }: { report: ResearchReport }) {
  const colors = typeColors[report.report_type.toLowerCase()] ?? defaultTypeColor;

  return (
    <Link
      href={`/research/reports/${report.id}`}
      className="group block glass hover:bg-gray-100 transition-all p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
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
        <LocalTimestamp iso={report.created_at} className="pixel-text text-gray-600 shrink-0" />
      </div>

      <p className="font-mono text-sm text-foreground leading-relaxed mb-2 group-hover:text-accent-bright transition-colors">
        {report.title}
      </p>

      <p className="font-mono text-xs text-gray-600 line-clamp-2">
        {report.summary}
      </p>
    </Link>
  );
}
