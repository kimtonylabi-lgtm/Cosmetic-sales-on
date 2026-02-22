'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
    id: string;
    title: string;
    count: number;
    children: React.ReactNode;
}

export const KanbanColumn = ({ id, title, count, children }: KanbanColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex-shrink-0 w-80 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-4 flex flex-col transition-colors",
                isOver && "bg-ocean-teal/10 dark:bg-ocean-teal/10 ring-2 ring-ocean-teal/20"
            )}
        >
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h3>
                    <span className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                        {count}
                    </span>
                </div>
            </div>
            <div className="flex-1 min-h-[200px]">
                {children}
            </div>
        </div>
    );
};
