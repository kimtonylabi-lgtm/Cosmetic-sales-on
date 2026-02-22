"use client";

import React, { useState } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    Plus,
    TrendingUp,
    User,
    GripVertical,
} from "lucide-react";
import {
    useSalesStore,
    KanbanDeal,
    DealStage,
    isStagnant,
} from "@/lib/stores/salesStore";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── 금액 포맷 ────────────────────────────────────────────────────
const formatAmount = (n: number) =>
    n >= 100_000_000
        ? `${(n / 100_000_000).toFixed(1)}억`
        : `${(n / 10_000).toFixed(0)}만`;

// ─── 우선순위 색상 ────────────────────────────────────────────────
const PRIORITY_COLOR = {
    HIGH: "bg-red-500/15 text-red-400 border-red-500/30",
    MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    LOW: "bg-slate-500/15 text-slate-400 border-slate-600",
};

// ─── 단계별 테마 ──────────────────────────────────────────────────
const STAGE_THEME: Record<DealStage, { bg: string; accent: string; label: string }> = {
    발굴: { bg: "bg-blue-500/10", accent: "border-t-blue-500", label: "🔍 발굴" },
    제안: { bg: "bg-violet-500/10", accent: "border-t-violet-500", label: "📄 제안" },
    협상: { bg: "bg-amber-500/10", accent: "border-t-amber-500", label: "🤝 협상" },
    수주: { bg: "bg-emerald-500/10", accent: "border-t-emerald-500", label: "✅ 수주" },
};

// ─── 딜 카드 ─────────────────────────────────────────────────────
function DealCard({ deal, isDragging = false }: { deal: KanbanDeal; isDragging?: boolean }) {
    const stagnant = isStagnant(deal.lastUpdated);

    return (
        <div
            className={cn(
                "bg-white dark:bg-slate-900 rounded-xl border p-4 shadow-sm cursor-grab active:cursor-grabbing transition-shadow",
                stagnant
                    ? "border-amber-500/60 shadow-amber-500/10 shadow-md"
                    : "border-slate-200 dark:border-slate-800 hover:shadow-md",
                isDragging && "opacity-50"
            )}
        >
            {stagnant && (
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold mb-2.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    7일 이상 정체
                </div>
            )}
            <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {deal.customerName}
                </p>
                <Badge variant="outline" className={cn("text-[10px] shrink-0", PRIORITY_COLOR[deal.priority])}>
                    {deal.priority}
                </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-ocean-teal" />
                    <span className="font-semibold text-ocean-teal">{formatAmount(deal.amount)}</span>
                </span>
                <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {deal.assignee}
                </span>
            </div>
            {deal.tags.length > 0 && (
                <div className="flex gap-1 mt-2.5 flex-wrap">
                    {deal.tags.map((t) => (
                        <span key={t} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full">
                            {t}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Sortable 카드 래퍼 ───────────────────────────────────────────
function SortableDealCard({ deal }: { deal: KanbanDeal }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: deal.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <DealCard deal={deal} isDragging={isDragging} />
        </div>
    );
}

// ─── 칸반 컬럼 ───────────────────────────────────────────────────
function KanbanColumn({ stage, deals, total }: { stage: DealStage; deals: KanbanDeal[]; total: number }) {
    const theme = STAGE_THEME[stage];

    return (
        <div className={cn("rounded-2xl border-t-4 p-4 flex flex-col gap-3 min-w-[280px] flex-1", theme.bg, theme.accent, "border border-slate-200/50 dark:border-slate-800/50")}>
            {/* 컬럼 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{theme.label}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{deals.length}건</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">합계</p>
                    <p className="text-sm font-bold text-ocean-teal">{formatAmount(total)}</p>
                </div>
            </div>

            {/* 딜 카드 목록 */}
            <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3 flex-1 min-h-[80px]">
                    {deals.map((deal) => (
                        <SortableDealCard key={deal.id} deal={deal} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
export default function SalesPlanningPage() {
    const { columns, moveDeal, getColumnTotal } = useSalesStore();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const totalPipeline = columns.reduce((s, c) => s + c.deals.reduce((ss, d) => ss + d.amount, 0), 0);

    const findStageByDealId = (id: string): DealStage | null => {
        for (const col of columns) {
            if (col.deals.find((d) => d.id === id)) return col.id;
        }
        return null;
    };

    const activeDeal = activeId
        ? columns.flatMap((c) => c.deals).find((d) => d.id === activeId) ?? null
        : null;

    const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

    const handleDragEnd = (e: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = e;
        if (!over) return;
        const fromStage = findStageByDealId(String(active.id));
        // over.id가 컬럼 id거나 딜 id일 수 있음
        const toStage =
            (columns.find((c) => c.id === over.id)?.id as DealStage) ??
            (findStageByDealId(String(over.id)) as DealStage);
        if (fromStage && toStage && fromStage !== toStage) {
            moveDeal(String(active.id), fromStage, toStage);
        }
    };

    return (
        <div className="space-y-6 pb-10">
            {/* 페이지 헤더 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">영업기획</h1>
                    <p className="text-slate-400 mt-1 text-sm">딜 파이프라인을 드래그로 관리하세요.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-400">전체 파이프라인</p>
                        <p className="text-xl font-bold text-ocean-teal">{formatAmount(totalPipeline)}</p>
                    </div>
                    <Button className="bg-ocean-teal hover:bg-ocean-dark gap-2">
                        <Plus className="w-4 h-4" /> 딜 추가
                    </Button>
                </div>
            </div>

            {/* 칸반 보드 */}
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {columns.map((col) => (
                        <KanbanColumn
                            key={col.id}
                            stage={col.id}
                            deals={col.deals}
                            total={getColumnTotal(col.id)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeDeal && <DealCard deal={activeDeal} />}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
