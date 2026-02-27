import { cn } from '@/lib/utils';

const ENERGY_STYLES: Record<string, string> = {
  A_PLUS: 'bg-green-900/50 text-green-300 border-green-800',
  A: 'bg-green-900/50 text-green-400 border-green-800',
  B: 'bg-green-900/40 text-green-400 border-green-800',
  C: 'bg-lime-900/40 text-lime-400 border-lime-800',
  D: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  E: 'bg-orange-900/40 text-orange-400 border-orange-800',
  F: 'bg-red-900/40 text-red-400 border-red-800',
  G: 'bg-red-900/50 text-red-400 border-red-800',
  H: 'bg-red-900/60 text-red-300 border-red-700',
  'not stated': 'bg-gray-800 text-gray-500 border-gray-700',
};

export function EnergyBadge({ energyClass }: { energyClass: string }) {
  const label = energyClass === 'A_PLUS' ? 'A+' : energyClass;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        ENERGY_STYLES[energyClass] || ENERGY_STYLES['not stated']
      )}
    >
      {label}
    </span>
  );
}
