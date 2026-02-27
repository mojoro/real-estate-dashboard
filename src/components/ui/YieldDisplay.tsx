import { cn } from '@/lib/utils';

interface YieldDisplayProps {
  yieldPct: number | null;
  yieldRating: string;
  size?: 'sm' | 'md' | 'lg';
}

export function YieldDisplay({ yieldPct, yieldRating, size = 'md' }: YieldDisplayProps) {
  if (yieldPct == null) {
    return (
      <span className={cn(
        'text-gray-500',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-lg',
      )}>
        {yieldRating || 'n/a'}
      </span>
    );
  }

  const color =
    yieldPct >= 5.5
      ? 'text-emerald-400'
      : yieldPct >= 4
        ? 'text-amber-400'
        : 'text-red-400';

  return (
    <span className={cn(
      'font-semibold',
      color,
      size === 'sm' && 'text-xs',
      size === 'md' && 'text-sm',
      size === 'lg' && 'text-lg font-bold',
    )}>
      {yieldPct.toFixed(2)}%
    </span>
  );
}
