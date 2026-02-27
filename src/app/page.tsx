export const dynamic = 'force-dynamic';

import { fetchListings } from '@/lib/airtable';
import { DashboardClient } from '@/components/pages/DashboardClient';

export default async function DashboardPage() {
  const { records: listings } = await fetchListings({ date: 'today' });

  // Compute stats
  const goListings = listings.filter((l) => l.status === 'GO');
  const stats = {
    totalToday: listings.length,
    goCount: goListings.length,
    pruefenCount: listings.filter((l) => l.status === 'PRÜFEN').length,
    bestYield: goListings.reduce<number | null>((best, l) => {
      if (l.yield_pct == null) return best;
      return best == null ? l.yield_pct : Math.max(best, l.yield_pct);
    }, null),
  };

  // Top picks: GO first, then PRÜFEN, sorted by yield_pct descending (nulls last)
  const topPicks = listings
    .filter((l) => l.status === 'GO' || l.status === 'PRÜFEN')
    .sort((a, b) => {
      const statusOrder = { GO: 0, 'PRÜFEN': 1 };
      const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 2;
      const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 2;
      if (aOrder !== bOrder) return aOrder - bOrder;
      const aYield = a.yield_pct ?? -Infinity;
      const bYield = b.yield_pct ?? -Infinity;
      return bYield - aYield;
    })
    .slice(0, 4);

  return <DashboardClient listings={listings} stats={stats} topPicks={topPicks} />;
}
