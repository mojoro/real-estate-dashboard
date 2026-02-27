'use client';

import { useState } from 'react';
import { Listing, PipelineStage } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { YieldDisplay } from '@/components/ui/YieldDisplay';
import { DetailDrawer } from '@/components/ui/DetailDrawer';

interface PipelineClientProps {
  listings: Listing[];
}

const PIPELINE_COLUMNS: { stage: PipelineStage; label: string; color: string }[] = [
  { stage: 'NEW', label: 'Neu', color: 'border-t-blue-500' },
  { stage: 'CONTACTED', label: 'Kontaktiert', color: 'border-t-amber-500' },
  { stage: 'VIEWING', label: 'Besichtigung', color: 'border-t-purple-500' },
  { stage: 'OFFER', label: 'Angebot', color: 'border-t-emerald-500' },
  { stage: 'PASSED', label: 'Abgelehnt', color: 'border-t-red-500' },
];

export function PipelineClient({ listings }: PipelineClientProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (listing: Listing) => {
    setSelectedListing(listing);
    setDrawerOpen(true);
  };

  const getListingsForStage = (stage: PipelineStage) =>
    listings.filter((l) => l['Pipeline Stage'] === stage);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pipeline</h1>
        <p className="text-sm text-gray-400 mt-1">
          Deal-Übersicht nach Status
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map((col) => {
          const columnListings = getListingsForStage(col.stage);
          return (
            <div
              key={col.stage}
              className={cn(
                'min-w-[280px] flex-1 bg-gray-900 rounded-xl border border-gray-800 border-t-2',
                col.color
              )}
            >
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-200">
                    {col.label}
                  </h3>
                  <span className="text-xs bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">
                    {columnListings.length}
                  </span>
                </div>
              </div>

              <div className="p-3 space-y-3">
                {columnListings.length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-8">
                    Keine Einträge
                  </p>
                )}
                {columnListings.map((listing) => (
                  <button
                    key={listing.id}
                    onClick={() => openDrawer(listing)}
                    className="w-full bg-gray-800/50 border border-gray-800 rounded-lg p-3 text-left hover:border-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <StatusBadge status={listing.status} />
                      <YieldDisplay
                        yieldPct={listing.yield_pct}
                        yieldRating={listing.yield_rating}
                        size="sm"
                      />
                    </div>
                    <p className="text-sm text-gray-200 font-medium leading-tight">
                      {listing.address}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatPrice(listing.purchase_price)}
                    </p>
                    {listing.Notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        {listing.Notes}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <DetailDrawer
        listing={selectedListing}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
