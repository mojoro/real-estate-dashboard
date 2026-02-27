import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  color?: 'default' | 'emerald' | 'amber' | 'red' | 'blue';
}

const VALUE_COLORS = {
  default: 'text-white',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  red: 'text-red-400',
  blue: 'text-blue-400',
};

const BORDER_COLORS = {
  default: 'border-t-gray-600',
  emerald: 'border-t-emerald-500',
  amber: 'border-t-amber-500',
  red: 'border-t-red-500',
  blue: 'border-t-blue-500',
};

export function StatsCard({ label, value, color = 'default' }: StatsCardProps) {
  return (
    <div className={cn('bg-gray-900 border border-gray-800 border-t-2 rounded-xl p-5', BORDER_COLORS[color])}>
      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
        {label}
      </p>
      <p className={cn('text-2xl font-bold', VALUE_COLORS[color])}>
        {value}
      </p>
    </div>
  );
}
