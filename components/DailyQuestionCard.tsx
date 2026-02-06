import Link from 'next/link';
import { DailyQuestion } from '@/lib/types';

export default function DailyQuestionCard({ question }: { question: DailyQuestion }) {
  const dateStr = new Date(question.date + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={`/daily/${question.date}`}
      className="group block glass hover:bg-gray-100 transition-all p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="font-sans text-base font-bold text-accent-bright tracking-tight glitch-hover">
            {dateStr}
          </span>
          <span className="pixel-text text-gray-600">
            {question.question_id}
          </span>
        </div>
        <span className="pixel-text text-gray-600 shrink-0">
          {question.exchange_ids?.length ?? 0} models
        </span>
      </div>

      <p className="font-mono text-sm leading-relaxed text-gray-400 group-hover:text-foreground transition-colors mb-3 line-clamp-2">
        {question.question_text}
      </p>

      <p className="font-mono text-xs text-gray-600 line-clamp-1">
        {question.reason}
      </p>
    </Link>
  );
}
