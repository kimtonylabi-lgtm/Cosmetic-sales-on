"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Users, FileText, CheckSquare, Square, CalendarDays, Plus, Clock } from "lucide-react";
import { MOCK_ACTIVITIES, MOCK_TODOS, Activity, ActivityType } from "@/lib/mock/activities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// ─── 타입별 아이콘/색상 ───────────────────────────────────────────
const ACTIVITY_CONFIG: Record<ActivityType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
    MEETING: { icon: Users, color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/30", label: "미팅" },
    EMAIL: { icon: Mail, color: "text-violet-400", bg: "bg-violet-500/15 border-violet-500/30", label: "이메일" },
    CALL: { icon: Phone, color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30", label: "전화" },
    NOTE: { icon: FileText, color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30", label: "메모" },
};

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

// ─── 타임라인 아이템 ──────────────────────────────────────────────
function TimelineItem({ activity, index }: { activity: Activity; index: number }) {
    const cfg = ACTIVITY_CONFIG[activity.type];
    const Icon = cfg.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4"
        >
            {/* 아이콘 + 선 */}
            <div className="flex flex-col items-center">
                <div className={cn("w-9 h-9 rounded-full border flex items-center justify-center shrink-0", cfg.bg)}>
                    <Icon className={cn("w-4 h-4", cfg.color)} />
                </div>
                <div className="w-px flex-1 bg-slate-200 dark:bg-slate-800 mt-2" />
            </div>

            {/* 내용 */}
            <div className="pb-6 flex-1">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={cn("text-[10px]", cfg.bg, cfg.color)}>
                                    {cfg.label}
                                </Badge>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {formatDate(activity.date)}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{activity.title}</p>
                            <p className="text-xs text-ocean-teal mt-0.5">{activity.customerName}</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{activity.description}</p>
                    {activity.nextAction && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">다음 액션</span>
                            <span className="text-xs font-semibold text-amber-500">{activity.nextAction}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
export default function SalesActivitiesPage() {
    const [todos, setTodos] = useState(MOCK_TODOS);
    const today = new Date();

    const todayTodos = todos.filter((t) => t.dueDate === today.toISOString().slice(0, 10));
    const weekTodos = todos.filter((t) => t.dueDate > today.toISOString().slice(0, 10));

    const toggleTodo = (id: string) =>
        setTodos((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));

    return (
        <div className="space-y-6 pb-10">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">영업활동</h1>
                    <p className="text-slate-400 mt-1 text-sm">미팅, 이메일, 전화 기록을 타임라인으로 확인하세요.</p>
                </div>
                <Button className="bg-ocean-teal hover:bg-ocean-dark gap-2">
                    <Plus className="w-4 h-4" /> 활동 기록
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 수직 타임라인 */}
                <div className="lg:col-span-2 space-y-1">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">최근 활동 기록</h2>
                    {MOCK_ACTIVITIES.map((act, i) => (
                        <TimelineItem key={act.id} activity={act} index={i} />
                    ))}
                </div>

                {/* 우측 패널 */}
                <div className="space-y-6">
                    {/* 캘린더 대체 — 활동 날짜 mini 달력 */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <CalendarDays className="w-4 h-4 text-ocean-teal" />
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">2월 활동 일정</h3>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                                <div key={d} className="text-slate-400 font-semibold py-1">{d}</div>
                            ))}
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={`empty-${i}`} className="py-1" />
                            ))}
                            {Array.from({ length: 28 }).map((_, i) => {
                                const day = i + 1;
                                const hasActivity = MOCK_ACTIVITIES.some(
                                    (a) => new Date(a.date).getDate() === day
                                );
                                const isToday = day === today.getDate();
                                return (
                                    <div
                                        key={day}
                                        className={cn(
                                            "py-1.5 rounded-lg text-xs relative font-medium cursor-default",
                                            isToday ? "bg-ocean-teal text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        {day}
                                        {hasActivity && !isToday && (
                                            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ocean-teal" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 다음 할 일 */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">다음 할 일</h3>
                        <Tabs defaultValue="today">
                            <TabsList className="w-full mb-4">
                                <TabsTrigger value="today" className="flex-1">오늘</TabsTrigger>
                                <TabsTrigger value="week" className="flex-1">이번 주</TabsTrigger>
                            </TabsList>
                            {[{ value: "today", items: todayTodos }, { value: "week", items: weekTodos }].map(({ value, items }) => (
                                <TabsContent key={value} value={value} className="space-y-2 mt-0">
                                    {items.length === 0 ? (
                                        <p className="text-xs text-slate-400 text-center py-4">할 일이 없습니다 🎉</p>
                                    ) : items.map((todo) => (
                                        <button
                                            key={todo.id}
                                            onClick={() => toggleTodo(todo.id)}
                                            className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                                        >
                                            {todo.done
                                                ? <CheckSquare className="w-4 h-4 text-ocean-teal shrink-0 mt-0.5" />
                                                : <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                            }
                                            <span className={cn("text-xs", todo.done && "line-through text-slate-400")}>
                                                {todo.label}
                                            </span>
                                        </button>
                                    ))}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
