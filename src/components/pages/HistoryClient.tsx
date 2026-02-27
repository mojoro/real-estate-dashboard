'use client';

import { useState, useMemo } from 'react';
import { Listing, ListingStatus } from '@/lib/types';
import { ListingTable } from '@/components/ui/ListingTable';
import { DetailDrawer } from '@/components/ui/DetailDrawer';
import { StatsCard } from '@/components/ui/StatsCard';

interface HistoryClientProps {
  listings: Listing[];
}

export function HistoryClient({ listings }: HistoryClientProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('7d');

  const filtered = useMemo(() => {
    if (dateRange === 'all') return listings;

    const days = dateRange === '7d' ? 7 : 30;
    const cutoff = new Date(Date.now() - days * 86400000);

    return listings.filter((l) => {
      if (!l.analyzed_at) return false;
      return new Date(l.analyzed_at) >= cutoff;
    });
  }, [listings, dateRange]);

  const stats = useMemo(() => {
    const go = filtered.filter((l) => l.status === 'GO').length;
    const pruefen = filtered.filter((l) => l.status === 'PRÜFEN').length;
    const nogo = filtered.filter((l) => l.status === 'NO-GO').length;
    return { total: filtered.length, go, pruefen, nogo };
  }, [filtered]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Verlauf</h1>
        <p className="text-sm text-gray-400 mt-1">Alle analysierten Objekte</p>
      </div>

      {/* Date range filter */}
      <div className="flex gap-2 mb-6">
        {([
          { label: '7 Tage', value: '7d' as const },
          { label: '30 Tage', value: '30d' as const },
          { label: 'Alle', value: 'all' as const },
        ]).map((option) => (
          <button
            key={option.value}
            onClick={() => setDateRange(option.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              dateRange === option.value
                ? 'bg-gray-700 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatsCard label="Gesamt" value={stats.total} />
        <StatsCard label="GO" value={stats.go} color="emerald" />
        <StatsCard label="PRÜFEN" value={stats.pruefen} color="amber" />
        <StatsCard label="NO-GO" value={stats.nogo} color="red" />
      </div>

      <ListingTable
        listings={filtered}
        onSelectListing={(listing) => {
          setSelectedListing(listing);
          setDrawerOpen(true);
        }}
      />

      <DetailDrawer
        listing={selectedListing}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
