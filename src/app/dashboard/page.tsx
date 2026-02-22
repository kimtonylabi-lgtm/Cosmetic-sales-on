'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Briefcase,
    Beaker,
    TrendingUp,
    Clock,
    ArrowUpRight,
    Search,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const stats = [
        { label: '신규 리드', value: '12', change: '+2.5%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: '진행중인 딜', value: '8', change: '+12%', icon: Briefcase, color: 'text-ocean-teal', bg: 'bg-ocean-teal/10' },
        { label: '샘플 요청건', value: '5', change: '-2%', icon: Beaker, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: '예상 매출액', value: '₩4.2B', change: '+18%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">대시보드</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">실시간 영업 현황과 주요 지표를 확인하세요.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="빠른 검색..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-ocean-teal outline-none transition-all w-64"
                        />
                    </div>
                    <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                    <button className="bg-ocean-teal hover:bg-ocean-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-ocean-teal/20 active:scale-95">
                        + 새 프로젝트
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-start justify-between">
                            <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </div>
                            <span className={cn(
                                "text-xs font-bold px-2 py-1 rounded-full",
                                stat.change.startsWith('+') ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
                            )}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">최근 활동</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">업데이트된 실물 및 데이터 이력</p>
                        </div>
                        <button className="text-sm text-ocean-teal font-semibold hover:underline">모두 보기</button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { title: '새로운 샘플 요청', company: '태성산업', time: '2시간 전', type: 'sample' },
                            { title: '딜 단계 변경: 제안 단계로 이동', company: 'LG생활건강', time: '5시간 전', type: 'deal' },
                            { title: '신규 리드 유입', company: '아모레퍼시픽', time: '어제', type: 'lead' },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-5 items-start">
                                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 font-bold text-slate-400">
                                    {activity.company[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-slate-900 dark:text-white font-semibold">{activity.title}</p>
                                        <div className="flex items-center text-xs text-slate-400">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {activity.time}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">{activity.company}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions & Insight */}
                <div className="space-y-8">
                    {/* Insight Card */}
                    <div className="bg-gradient-to-br from-ocean-dark to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold">AI 분석 리포트</h4>
                            <p className="text-sm text-ocean-light/80 mt-2 leading-relaxed">
                                이번 달 &apos;샘플 요청&apos;이 지난 달 대비 24% 증가했습니다. 생산 라인 부하를 확인하세요.
                            </p>
                            <button className="mt-6 flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
                                자세히 읽기 <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <TrendingUp size={100} />
                        </div>
                    </div>

                    {/* Quick Task Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">주요 할일</h3>
                        <div className="space-y-3">
                            {[
                                { label: '주간 리포트 작성', color: 'border-blue-500' },
                                { label: '신규 샘플 발송 확인', color: 'border-ocean-teal' },
                                { label: '클라이언트 미팅 준비', color: 'border-amber-500' },
                            ].map((task) => (
                                <div key={task.label} className={cn("px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between", task.color)}>
                                    {task.label}
                                    <input type="checkbox" className="w-4 h-4 rounded-full border-slate-300 text-ocean-teal focus:ring-ocean-teal" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
