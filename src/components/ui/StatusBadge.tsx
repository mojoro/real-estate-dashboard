import { ListingStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  GO: 'bg-emerald-900/50 text-emerald-400 border-emerald-800',
  'PRÜFEN': 'bg-amber-900/50 text-amber-400 border-amber-800',
  'NO-GO': 'bg-red-900/50 text-red-400 border-red-800',
  '': 'bg-gray-800 text-gray-500 border-gray-700',
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        STATUS_STYLES[status] || STATUS_STYLES['']
      )}
    >
      {status || 'Pending'}
    </span>
  );
}
