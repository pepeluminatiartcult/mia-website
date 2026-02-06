import { Metadata } from 'next';
import Link from 'next/link';
import { getResearchReports } from '@/lib/queries';
import ReportCard from '@/components/ReportCard';
import CollageBackground from '@/components/CollageBackground';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Research Reports — MIA',
  description: 'Weekly reviews, model spotlights, and hypothesis analysis reports from MIA\'s autonomous research program.',
};

export default async function ReportsPage() {
  const reports = await getResearchReports();

  const reviews = reports.filter(r => r.report_type === 'review');
  const spotlights = reports.filter(r => r.report_type === 'spotlight');
  const hypothesisReports = reports.filter(r => r.report_type === 'hypothesis');

  return (
    <>
      <CollageBackground seed="reports" density="medium" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <Link href="/research" className="pixel-text text-gray-600 hover:text-accent-bright transition-colors mb-4 inline-block">
          &larr; Research
        </Link>

        <h1 className="font-sans text-5xl sm:text-7xl font-bold uppercase tracking-tighter text-white mb-3">Reports</h1>
        <div className="max-w-md mb-10 px-8 py-5" style={{ background: '#0000aa' }}>
          <p className="font-mono text-xs leading-loose text-white">
            MIA publishes research reports 3x weekly: Sunday week-in-review,
            Tuesday model spotlight, Thursday hypothesis lab.
          </p>
        </div>

        {reports.length === 0 && (
          <div className="glass p-8 text-center">
            <p className="font-mono text-sm text-gray-600">
              No reports yet. The 3x weekly research system will generate reports as it runs.
            </p>
          </div>
        )}

        {/* All Reports */}
        {reports.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="pixel-text text-gray-600">ALL REPORTS</div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className="pixel-text text-gray-600">{reports.length}</div>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {reviews.length > 0 && (
                <span className="inline-block px-2 py-0.5 text-xs font-mono border bg-[#000080]/10 text-[#000080] border-[#000080]/30">
                  {reviews.length} REVIEW{reviews.length !== 1 ? 'S' : ''}
                </span>
              )}
              {spotlights.length > 0 && (
                <span className="inline-block px-2 py-0.5 text-xs font-mono border bg-[#008080]/10 text-[#008080] border-[#008080]/30">
                  {spotlights.length} SPOTLIGHT{spotlights.length !== 1 ? 'S' : ''}
                </span>
              )}
              {hypothesisReports.length > 0 && (
                <span className="inline-block px-2 py-0.5 text-xs font-mono border bg-[#556b2f]/10 text-[#556b2f] border-[#556b2f]/30">
                  {hypothesisReports.length} HYPOTHESIS
                </span>
              )}
            </div>

            <div className="space-y-2">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
