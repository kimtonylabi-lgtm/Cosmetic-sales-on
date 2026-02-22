'use client';

import React from 'react';
import { KanbanBoard } from '@/features/deals/components/KanbanBoard';
import {
    Search,
    Filter,
    Plus,
    LayoutGrid,
    List
} from 'lucide-react';

export default function KanbanPage() {
    return (
        <div className="max-w-[1600px] mx-auto space-y-6 pb-10 h-full flex flex-col">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">영업 파이프라인</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">드래그 앤 드롭으로 딜의 진행 단계를 관리하세요.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                        <button className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white">
                            <LayoutGrid size={18} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <List size={18} />
                        </button>
                    </div>
                    <button className="bg-ocean-teal hover:bg-ocean-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-ocean-teal/20 active:scale-95 flex items-center gap-2">
                        <Plus size={18} /> 새 딜 생성
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="딜 제목 검색..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-ocean-teal outline-none transition-all"
                        />
                    </div>
                    <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-ocean-teal transition-colors flex items-center gap-2 text-sm font-semibold">
                        <Filter size={16} /> 필터
                    </button>
                </div>
                <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    전체 딜: <span className="text-ocean-teal">...</span> 건
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <KanbanBoard />
            </div>
        </div>
    );
}
