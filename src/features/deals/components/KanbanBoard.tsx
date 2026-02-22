'use client';

import React from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Deal, DealStage } from '@/lib/firebase/db';
import { useDeals } from '../hooks/useDeals';
import { KanbanColumn } from './KanbanColumn';
import { DealCard } from './DealCard';
import { motion } from 'framer-motion';

const STAGES: DealStage[] = ['PROSPECTING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
const STAGE_LABELS: Record<DealStage, string> = {
    PROSPECTING: '영업 시작',
    PROPOSAL: '제안 완료',
    NEGOTIATION: '협상 중',
    WON: '계약 완료',
    LOST: '실패',
};

export const KanbanBoard = () => {
    const { deals, isLoading, updateDealStage } = useDeals();
    const [activeId, setActiveId] = React.useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const dealId = active.id as string;
        const newStage = over.id as DealStage;

        const deal = deals.find(d => d.id === dealId);
        if (deal && deal.stage !== newStage && STAGES.includes(newStage)) {
            await updateDealStage({ id: dealId, stage: newStage });
        }
    };

    if (isLoading) {
        return <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-ocean-teal border-t-transparent rounded-full animate-spin" />
        </div>;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                {STAGES.map(stage => {
                    const stageDeals = deals.filter(d => d.stage === stage);
                    return (
                        <KanbanColumn
                            key={stage}
                            id={stage}
                            title={STAGE_LABELS[stage]}
                            count={stageDeals.length}
                        >
                            <SortableContext items={stageDeals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-3">
                                    {stageDeals.map(deal => (
                                        <DealCard key={deal.id} deal={deal} />
                                    ))}
                                </div>
                            </SortableContext>
                        </KanbanColumn>
                    );
                })}
            </div>
            <DragOverlay>
                {activeId ? (
                    <DealCard deal={deals.find(d => d.id === activeId)!} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};
