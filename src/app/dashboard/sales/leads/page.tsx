'use client';

import React, { useState } from 'react';
import { useLeads } from '@/features/leads/hooks/useLeads';
import { LeadTable } from '@/features/leads/components/LeadTable';
import {
    Search,
    Filter,
    Download,
    Plus,
    RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/Skeleton';

export default function LeadsPage() {
    const { leads, isLoading, isError } = useLeads();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = leads.filter(lead =>
        lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">리드 관리</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">잠재 고객 발굴 및 파이프라인 초기 단계를 관리합니다.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-ocean-teal hover:bg-ocean-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-ocean-teal/20 active:scale-95 flex items-center gap-2">
                        <Plus size={18} /> 새 리드 등록
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="기업명, 담당자 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-ocean-teal outline-none transition-all"
                        />
                    </div>
                    <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-ocean-teal transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-slate-400">
                    <button className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors" title="새로고침">
                        <RefreshCw size={18} />
                    </button>
                    <button className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors" title="내보내기">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {isLoading ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="space-y-4 p-6">
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-1/4" />
                            <Skeleton className="h-10 w-1/4" />
                            <Skeleton className="h-10 w-1/4" />
                            <Skeleton className="h-10 w-1/4 text-right" />
                        </div>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-4 items-center pt-4">
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : isError ? (
                <div className="bg-rose-50 dark:bg-rose-500/10 p-8 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-center">
                    <p className="text-rose-600 dark:text-rose-400 font-medium">데이터를 불러오는데 실패했습니다.</p>
                    <button className="mt-4 text-sm font-bold text-rose-700 dark:text-rose-300 underline">다시 시도</button>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <LeadTable leads={filteredLeads} />
                </motion.div>
            )}
        </div>
    );
}
