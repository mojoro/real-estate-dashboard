'use client';

import { useState, useMemo } from 'react';
import { Listing, ListingStatus, SortField, SortDirection } from '@/lib/types';
import { formatPrice, formatArea, formatDate, cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { YieldDisplay } from './YieldDisplay';
import { EnergyBadge } from './EnergyBadge';

interface ListingTableProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
}

const STATUS_FILTERS: { label: string; value: ListingStatus | 'ALL' }[] = [
  { label: 'Alle', value: 'ALL' },
  { label: 'GO', value: 'GO' },
  { label: 'PRÜFEN', value: 'PRÜFEN' },
  { label: 'NO-GO', value: 'NO-GO' },
];

export function ListingTable({ listings, onSelectListing }: ListingTableProps) {
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<SortField>('purchase_price');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [search, setSearch] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...listings];

    if (statusFilter !== 'ALL') {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.address.toLowerCase().includes(q) ||
          l.title.toLowerCase().includes(q) ||
          l.postcode.includes(q)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortField] ?? -Infinity;
      const bVal = b[sortField] ?? -Infinity;
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [listings, statusFilter, sortField, sortDir, search]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-600 ml-1">↕</span>;
    }
    return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                statusFilter === f.value
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Adresse suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gray-600 w-full sm:w-64"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900 text-left text-xs text-gray-400 uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Adresse</th>
              <th
                className="px-4 py-3 font-medium cursor-pointer hover:text-gray-200 whitespace-nowrap"
                onClick={() => handleSort('purchase_price')}
              >
                Preis <SortIcon field="purchase_price" />
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer hover:text-gray-200 whitespace-nowrap"
                onClick={() => handleSort('yield_pct')}
              >
                Rendite <SortIcon field="yield_pct" />
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer hover:text-gray-200 whitespace-nowrap"
                onClick={() => handleSort('living_area')}
              >
                Fläche <SortIcon field="living_area" />
              </th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Energie</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Analysiert</th>
              <th className="px-4 py-3 font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filtered.map((listing) => (
              <tr
                key={listing.id}
                onClick={() => onSelectListing(listing)}
                className="hover:bg-gray-900/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <StatusBadge status={listing.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-gray-200 font-medium whitespace-nowrap">
                        {listing.address}
                      </p>
                      {listing.flagged_potential_duplicate && (
                        <span className="text-amber-500 text-xs" title="Mögliches Duplikat">
                          ⚠ Duplikat?
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-200 font-medium whitespace-nowrap">
                  {formatPrice(listing.purchase_price)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <YieldDisplay
                    yieldPct={listing.yield_pct}
                    yieldRating={listing.yield_rating}
                    size="sm"
                  />
                </td>
                <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                  {formatArea(listing.living_area)}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <EnergyBadge energyClass={listing.energy_class} />
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap hidden md:table-cell">
                  {formatDate(listing.analyzed_at)}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-400 hover:text-blue-300 text-xs font-medium whitespace-nowrap"
                  >
                    Inserat ↗
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                  Keine Einträge gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        {filtered.length} von {listings.length} Einträgen
      </p>
    </div>
  );
}
