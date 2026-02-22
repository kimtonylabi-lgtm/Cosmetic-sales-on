'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Deal } from '@/lib/firebase/db';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    Clock,
    MoreHorizontal,
    DollarSign
} from 'lucide-react';

interface DealCardProps {
    deal: Deal;
    isOverlay?: boolean;
}

export const DealCard = ({ deal, isOverlay }: DealCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: deal.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-grab active:cursor-grabbing transition-shadow group relative",
                isDragging && "opacity-50 grayscale ring-2 ring-ocean-teal ring-offset-2 dark:ring-offset-slate-900 z-50",
                isOverlay && "shadow-2xl ring-2 ring-ocean-teal cursor-grabbing transform scale-105"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-ocean-teal bg-ocean-teal/10 px-2 py-0.5 rounded uppercase">
                    화장품 유통
                </span>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <MoreHorizontal size={14} />
                </button>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                {/* We'd normally have companyName here, but Deal doesn't have it. 
                   In a real app, we'd join with Lead or have it in the Deal object.
                */}
                샘플 발송 프로젝트
            </h4>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <DollarSign size={12} className="text-emerald-500" />
                        {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(deal.amount)}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock size={10} />
                        2026.03.15
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border border-white dark:border-slate-800" />
                </div>
            </div>
        </motion.div>
    );
};
