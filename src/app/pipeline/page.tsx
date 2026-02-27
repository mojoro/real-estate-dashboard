export const dynamic = 'force-dynamic';

import { fetchListings } from '@/lib/airtable';
import { PipelineClient } from '@/components/pages/PipelineClient';

export default async function PipelinePage() {
  const { records: listings } = await fetchListings();

  // Only show listings with a pipeline stage set
  const pipelineListings = listings.filter((l) => l['Pipeline Stage'] !== '');

  return <PipelineClient listings={pipelineListings} />;
}
