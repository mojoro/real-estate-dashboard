'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { Listing, PipelineStage } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { YieldDisplay } from '@/components/ui/YieldDisplay';
import { KanbanColumn } from '@/components/ui/KanbanColumn';
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

const STAGE_SET = new Set<string>(PIPELINE_COLUMNS.map((c) => c.stage));

export function PipelineClient({ listings: initialListings }: PipelineClientProps) {
  const [listings, setListings] = useState(initialListings);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const activeListing = activeId ? listings.find((l) => l.id === activeId) : null;

  const getListingsForStage = useCallback(
    (stage: PipelineStage) => listings.filter((l) => l['Pipeline Stage'] === stage),
    [listings]
  );

  const resolveTargetStage = useCallback(
    (overId: string | number): PipelineStage | null => {
      const id = String(overId);
      // If dropped on a column directly
      if (STAGE_SET.has(id)) return id as PipelineStage;
      // If dropped on a card, find which stage that card is in
      const targetListing = listings.find((l) => l.id === id);
      if (targetListing) return targetListing['Pipeline Stage'] || null;
      return null;
    },
    [listings]
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const targetStage = resolveTargetStage(over.id);
    if (!targetStage) return;

    const listing = listings.find((l) => l.id === active.id);
    if (!listing || listing['Pipeline Stage'] === targetStage) return;

    // Optimistic update
    const previous = listings;
    setListings((prev) =>
      prev.map((l) =>
        l.id === active.id ? { ...l, 'Pipeline Stage': targetStage } : l
      )
    );

    // Persist to API
    try {
      const res = await fetch(`/api/listings/${active.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'Pipeline Stage': targetStage }),
      });
      if (!res.ok) throw new Error('Update failed');
    } catch {
      setListings(previous); // revert on error
    }
  }

  const openDrawer = (listing: Listing) => {
    setSelectedListing(listing);
    setDrawerOpen(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pipeline</h1>
        <p className="text-sm text-gray-400 mt-1">
          Deal-Übersicht nach Status — Karten per Drag & Drop verschieben
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none">
          {PIPELINE_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.stage}
              stage={col.stage}
              label={col.label}
              color={col.color}
              items={getListingsForStage(col.stage)}
              onCardClick={openDrawer}
            />
          ))}
        </div>

        <DragOverlay>
          {activeListing && (
            <div className="bg-gray-800 border border-blue-500 rounded-lg p-3 shadow-2xl w-[280px] rotate-2 opacity-90">
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status={activeListing.status} />
                <YieldDisplay
                  yieldPct={activeListing.yield_pct}
                  yieldRating={activeListing.yield_rating}
                  size="sm"
                />
              </div>
              <p className="text-sm text-gray-200 font-medium leading-tight">
                {activeListing.address}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatPrice(activeListing.purchase_price)}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <DetailDrawer
        listing={selectedListing}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
