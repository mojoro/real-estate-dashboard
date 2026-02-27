'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Listing } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { YieldDisplay } from './YieldDisplay';

interface KanbanCardProps {
  listing: Listing;
  onClick: () => void;
}

export function KanbanCard({ listing, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: listing.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        {/* Drag handle */}
        <button
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-0.5 text-gray-500 hover:text-gray-300 transition-colors touch-none"
          aria-label="Drag to reorder"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        </button>
        <div className="flex items-center justify-between flex-1 min-w-0">
          <StatusBadge status={listing.status} />
          <YieldDisplay
            yieldPct={listing.yield_pct}
            yieldRating={listing.yield_rating}
            size="sm"
          />
        </div>
      </div>
      <button
        onClick={onClick}
        className="w-full text-left cursor-pointer"
      >
        <p className="text-sm text-gray-200 font-medium leading-tight">
          {listing.address}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formatPrice(listing.purchase_price)}
        </p>
        {listing.Notes && (
          <p className="text-xs text-gray-400 mt-2 italic">
            {listing.Notes}
          </p>
        )}
      </button>
    </div>
  );
}
