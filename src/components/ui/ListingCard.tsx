import { Listing } from '@/lib/types';
import { formatPrice, formatArea, truncate } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { YieldDisplay } from './YieldDisplay';
import { EnergyBadge } from './EnergyBadge';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-left hover:border-gray-700 transition-colors w-full cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <StatusBadge status={listing.status} />
        <EnergyBadge energyClass={listing.energy_class} />
      </div>

      <h3 className="text-sm font-semibold text-white mb-1 leading-tight">
        {listing.address}
      </h3>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-xs">
        <div>
          <span className="text-gray-500">Preis</span>
          <p className="text-white font-medium">{formatPrice(listing.purchase_price)}</p>
        </div>
        <div>
          <span className="text-gray-500">Rendite</span>
          <p>
            <YieldDisplay
              yieldPct={listing.yield_pct}
              yieldRating={listing.yield_rating}
              size="sm"
            />
          </p>
        </div>
        <div>
          <span className="text-gray-500">Fläche</span>
          <p className="text-white font-medium">{formatArea(listing.living_area)}</p>
        </div>
        <div>
          <span className="text-gray-500">Zimmer</span>
          <p className="text-white font-medium">{listing.rooms ?? '—'}</p>
        </div>
      </div>

      {listing.summary && (
        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
          {truncate(listing.summary, 120)}
        </p>
      )}

      <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-600">
          {listing.listing_id.split('_')[0] === listing.listing_id
            ? 'ImmoScout24'
            : listing.listing_id.split('_')[0]}
        </span>
        <span className="text-xs text-blue-400 font-medium">Details &rarr;</span>
      </div>
    </button>
  );
}
