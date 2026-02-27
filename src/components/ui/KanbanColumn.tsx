'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Listing, PipelineStage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  stage: PipelineStage;
  label: string;
  color: string;
  items: Listing[];
  onCardClick: (listing: Listing) => void;
}

export function KanbanColumn({ stage, label, color, items, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      className={cn(
        'min-w-[280px] flex-1 bg-gray-900 rounded-xl border border-gray-800 border-t-2 transition-all snap-start',
        color,
        isOver && 'ring-2 ring-blue-500/50 border-gray-700'
      )}
    >
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-200">
            {label}
          </h3>
          <span className="text-xs bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">
            {items.length}
          </span>
        </div>
      </div>

      <div ref={setNodeRef} className="p-3 space-y-3 min-h-[100px]">
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-8">
              Keine Einträge
            </p>
          )}
          {items.map((listing) => (
            <KanbanCard
              key={listing.id}
              listing={listing}
              onClick={() => onCardClick(listing)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
