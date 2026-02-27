'use client';

import { useState } from 'react';
import { Listing, DashboardStats } from '@/lib/types';
import { StatsCard } from '@/components/ui/StatsCard';
import { ListingCard } from '@/components/ui/ListingCard';
import { ListingTable } from '@/components/ui/ListingTable';
import { DetailDrawer } from '@/components/ui/DetailDrawer';

interface DashboardClientProps {
  listings: Listing[];
  stats: DashboardStats;
  topPicks: Listing[];
}

export function DashboardClient({ listings, stats, topPicks }: DashboardClientProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (listing: Listing) => {
    setSelectedListing(listing);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Tagesübersicht</h1>
        <p className="text-sm text-gray-400 mt-1">
          {new Date().toLocaleDateString('de-DE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Heute analysiert" value={stats.totalToday} />
        <StatsCard label="GO" value={stats.goCount} color="emerald" />
        <StatsCard label="PRÜFEN" value={stats.pruefenCount} color="amber" />
        <StatsCard
          label="Beste Rendite"
          value={stats.bestYield != null ? `${stats.bestYield.toFixed(2)}%` : 'N/A'}
          color="blue"
        />
      </div>

      {/* Top Picks */}
      {topPicks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Top Picks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topPicks.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onClick={() => openDrawer(listing)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Listings Table */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Alle Einträge heute</h2>
        <ListingTable listings={listings} onSelectListing={openDrawer} />
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        listing={selectedListing}
        isOpen={drawerOpen}
        onClose={closeDrawer}
      />
    </div>
  );
}
