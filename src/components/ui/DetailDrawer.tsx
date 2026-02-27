'use client';

import { useEffect } from 'react';
import { Listing } from '@/lib/types';
import { formatPrice, formatArea, formatDate, parseRisks, cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { EnergyBadge } from './EnergyBadge';
import { YieldDisplay } from './YieldDisplay';

interface DetailDrawerProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DetailDrawer({ listing, isOpen, onClose }: DetailDrawerProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[520px] max-w-[90vw] bg-gray-900 border-l border-gray-800 z-50 overflow-y-auto transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {listing && (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={listing.status} />
                  <YieldDisplay
                    yieldPct={listing.yield_pct}
                    yieldRating={listing.yield_rating}
                    size="lg"
                  />
                </div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {listing.title}
                </h2>
                <p className="text-sm text-gray-400 mt-1">{listing.address}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-300 transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">Kaufpreis</p>
                <p className="text-sm font-bold text-white">{formatPrice(listing.purchase_price)}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">€/m²</p>
                <p className="text-sm font-bold text-white">
                  {listing.price_per_sqm ? `${listing.price_per_sqm.toLocaleString('de-DE')} €` : '—'}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">Fläche</p>
                <p className="text-sm font-bold text-white">{formatArea(listing.living_area)}</p>
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                Objektdaten
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <Detail label="Zimmer" value={listing.rooms?.toString() ?? '—'} />
                <Detail label="Baujahr" value={listing.year_built?.toString() ?? '—'} />
                <Detail label="Typ" value={listing.building_type.replace(/_/g, ' ')} />
                <Detail label="Vermietet" value={listing.is_rented === 'y' ? 'Ja' : listing.is_rented === 'n' ? 'Nein' : 'Unbekannt'} />
                <Detail label="Heizung" value={listing.heating_type.replace(/_/g, ' ')} />
                <Detail label="Brennstoff" value={listing.firing_type.replace(/_/g, ' ')} />
                <Detail
                  label="Energie"
                  value={<EnergyBadge energyClass={listing.energy_class} />}
                />
                <Detail label="Letzte Sanierung" value={listing.last_refurbish ?? '—'} />
              </div>
            </div>

            {/* AI Analysis */}
            {listing.summary && (
              <div className="mb-6">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                  AI-Analyse
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {listing.summary}
                </p>
              </div>
            )}

            {/* Risks */}
            {parseRisks(listing.risks).length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                  Risiken
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parseRisks(listing.risks).map((risk, i) => (
                    <span
                      key={i}
                      className="bg-red-900/30 text-red-400 border border-red-800/50 rounded-full px-3 py-1 text-xs"
                    >
                      {risk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reason */}
            {listing.reason && (
              <div className="mb-6">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                  Begründung
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {listing.reason}
                </p>
              </div>
            )}

            {/* Agent Info */}
            {(listing['Agent Name'] || listing['Agent Email'] || listing['Agent Phone']) && (
              <div className="mb-6">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                  Makler
                </h3>
                <div className="text-sm text-gray-300 space-y-1">
                  {listing['Agent Name'] && <p>{listing['Agent Name']}</p>}
                  {listing['Agent Email'] && <p className="text-blue-400">{listing['Agent Email']}</p>}
                  {listing['Agent Phone'] && <p>{listing['Agent Phone']}</p>}
                </div>
              </div>
            )}

            {/* Pipeline & Meta */}
            <div className="mb-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                Status & Meta
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <Detail label="Pipeline" value={listing['Pipeline Stage'] || '—'} />
                <Detail label="Analysiert" value={formatDate(listing.analyzed_at)} />
                <Detail label="Listing ID" value={listing.listing_id} />
                <Detail label="Tage online" value={listing.days_since_listed?.toString() ?? '—'} />
              </div>
            </div>

            {/* Notes */}
            {listing.Notes && (
              <div className="mb-6">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                  Notizen
                </h3>
                <p className="text-sm text-gray-400 bg-gray-800/50 rounded-lg p-3">
                  {listing.Notes}
                </p>
              </div>
            )}

            {/* Action Button */}
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Zum Inserat ↗
            </a>
          </div>
        )}
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <div className="text-gray-200">{value}</div>
    </div>
  );
}
