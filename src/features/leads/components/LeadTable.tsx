'use client';

import React from 'react';
import { Lead, LeadStatus } from '@/lib/firebase/db';
import { cn } from '@/lib/utils';
import {
    MoreHorizontal,
    ChevronRight,
    Star,
    Building2,
    User,
    Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string }> = {
    COLD: { label: '관심 없음', color: 'text-slate-500', bg: 'bg-slate-500/10' },
    WARM: { label: '관심 있음', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    HOT: { label: '매우 높음', color: 'text-rose-500', bg: 'bg-rose-500/10' },
};

interface LeadTableProps {
    leads: Lead[];
    onEdit?: (lead: Lead) => void;
}

export const LeadTable = ({ leads, onEdit }: LeadTableProps) => {
    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Building2 className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">등록된 리드가 없습니다.</p>
                <button className="mt-4 text-ocean-teal font-semibold hover:underline">+ 첫 리드 추가하기</button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">기업 정보</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">담당자</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">상태</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI 스코어</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">등록일</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {leads.map((lead, idx) => (
                            <motion.tr
                                key={lead.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center text-ocean-teal font-bold group-hover:scale-110 transition-transform">
                                            {lead.companyName[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">{lead.companyName}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">화장품 유통</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <User size={14} className="text-slate-400" />
                                        {lead.contactPerson}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight",
                                        STATUS_CONFIG[lead.status].bg,
                                        STATUS_CONFIG[lead.status].color
                                    )}>
                                        {STATUS_CONFIG[lead.status].label}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-ocean-teal rounded-full"
                                                style={{ width: `${lead.score}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{lead.score}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <Calendar size={12} />
                                        {/* Simplified date format for demo */}
                                        2026.02.22
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onEdit?.(lead)}
                                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">전체 리드: <b>{leads.length}</b>건</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">이전</button>
                    <button className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">다음</button>
                </div>
            </div>
        </div>
    );
};
