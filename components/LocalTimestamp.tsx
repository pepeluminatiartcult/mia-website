'use client';

export default function LocalTimestamp({ iso, className }: { iso: string; className?: string }) {
  const dt = new Date(iso);
  const date = dt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const time = dt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });

  return <span className={className}>{date} {time}</span>;
}
