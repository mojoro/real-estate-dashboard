export const dynamic = 'force-dynamic';

import { fetchListings } from '@/lib/airtable';
import { HistoryClient } from '@/components/pages/HistoryClient';

export default async function HistoryPage() {
  const { records: listings } = await fetchListings({ date: 'all' });

  return <HistoryClient listings={listings} />;
}
