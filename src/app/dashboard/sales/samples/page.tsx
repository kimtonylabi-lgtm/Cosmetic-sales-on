"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Package,
    AlertTriangle,
    Sparkles,
    Layers,
} from "lucide-react";
import {
    MOCK_SAMPLE_REQUESTS,
    SampleRequest,
    SampleStatus,
    SampleKind,
    SAMPLE_STEPS,
    DesignSpecs,
} from "@/lib/mock/sampleRequests";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SampleRequestForm } from "./SampleRequestForm";

// ─── 상태 색상 ────────────────────────────────────────────────────
const STATUS_COLOR: Record<SampleStatus, string> = {
    대기: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    제작중: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    발송완료: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
};

const STEP_INDEX: Record<SampleStatus, number> = { 대기: 0, 제작중: 1, 발송완료: 2 };

// 샘플 종류 배지 색상
const KIND_COLOR: Record<SampleKind, string> = {
    랜덤: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    CT: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    디자인: "bg-purple-500/10 text-purple-500 border-purple-500/30",
};

// ─── 스텝퍼 컴포넌트 ─────────────────────────────────────────────
function Stepper({ status }: { status: SampleStatus }) {
    const current = STEP_INDEX[status];

    return (
        <div className="flex items-center gap-0">
            {SAMPLE_STEPS.map((step, i) => {
                const done = i < current;
                const active = i === current;
                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-colors",
                                done ? "bg-ocean-teal border-ocean-teal text-white"
                                    : active ? "bg-white dark:bg-slate-900 border-ocean-teal text-ocean-teal"
                                        : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400"
                            )}>
                                {done ? "✓" : i + 1}
                            </div>
                            <span className={cn(
                                "text-[9px] mt-1 whitespace-nowrap font-medium",
                                active ? "text-ocean-teal" : done ? "text-ocean-teal/70" : "text-slate-400"
                            )}>
                                {step}
                            </span>
                        </div>
                        {i < SAMPLE_STEPS.length - 1 && (
                            <div className={cn(
                                "h-0.5 w-8 mb-3.5 transition-colors",
                                i < current ? "bg-ocean-teal" : "bg-slate-200 dark:bg-slate-700"
                            )} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

// ─── 디자인 스펙 요약 뱃지 ───────────────────────────────────────
function DesignSpecsSummary({ specs }: { specs: DesignSpecs }) {
    return (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 디자인 스펙
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                <div>
                    <span className="text-slate-400">재질: </span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{specs.material}</span>
                </div>
                {specs.pantoneColor && (
                    <div>
                        <span className="text-slate-400">팬톤: </span>
                        <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">{specs.pantoneColor}</span>
                    </div>
                )}
                {specs.finishings.length > 0 && (
                    <div className="col-span-2 flex flex-wrap gap-1 mt-0.5">
                        {specs.finishings.map((f) => (
                            <span key={f} className="px-1.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-[10px] font-medium">
                                {f}
                            </span>
                        ))}
                    </div>
                )}
                {specs.artworkFileName && (
                    <div className="col-span-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        📎 {specs.artworkFileName}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── 샘플 카드 ───────────────────────────────────────────────────
function SampleCard({ req }: { req: SampleRequest }) {
    const isPaid = req.sampleType === "유상";
    const isHighQty = req.quantity >= 50;
    const isDesign = req.sampleKind === "디자인";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow"
        >
            {isHighQty && isPaid && (
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold mb-3 bg-amber-500/10 px-3 py-1.5 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    수량 50개 이상 — 유상 검토 필요
                </div>
            )}

            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-xs text-slate-400 font-mono">{req.requestNo}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{req.productName}</p>
                    <p className="text-xs text-ocean-teal">{req.customerName}</p>
                </div>
                <Badge variant="outline" className={cn("text-[10px]", STATUS_COLOR[req.status])}>
                    {req.status}
                </Badge>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span><span className="font-semibold">수량:</span> {req.quantity}개</span>
                    <Badge variant="outline" className={cn("text-[10px]", isPaid ? "border-rose-500/30 text-rose-400" : "border-emerald-500/30 text-emerald-400")}>
                        {req.sampleType}
                    </Badge>
                    <Badge variant="outline" className={cn("text-[10px]", KIND_COLOR[req.sampleKind])}>
                        {isDesign && <Sparkles className="w-2.5 h-2.5 mr-0.5" />}
                        {req.sampleKind}
                    </Badge>
                </div>
                <span>{req.requestedAt}</span>
            </div>

            <Stepper status={req.status} />

            {req.note && (
                <p className="text-xs text-slate-400 mt-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                    {req.note}
                </p>
            )}

            {/* 디자인 스펙 요약 */}
            {isDesign && req.specs && (
                <DesignSpecsSummary specs={req.specs} />
            )}
        </motion.div>
    );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
export default function SalesSamplesPage() {
    const [requests, setRequests] = useState<SampleRequest[]>(MOCK_SAMPLE_REQUESTS);
    const [sheetOpen, setSheetOpen] = useState(false);

    // 새 샘플 요청 추가
    const handleSubmitSuccess = (
        newData: Omit<SampleRequest, "id" | "requestNo" | "requestedAt" | "status" | "requestedBy">
    ) => {
        const newItem: SampleRequest = {
            id: `s${Date.now()}`,
            requestNo: `SR-2026-${String(requests.length + 22).padStart(4, "0")}`,
            requestedAt: new Date().toISOString().slice(0, 10),
            requestedBy: "현재 사용자",
            status: "대기",
            ...newData,
        };
        setRequests((prev) => [newItem, ...prev]);
    };

    const designCount = requests.filter((r) => r.sampleKind === "디자인").length;

    return (
        <div className="space-y-6 pb-10">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        샘플요청
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm flex items-center gap-2">
                        샘플 진행 단계를 한눈에 확인하세요.
                        {designCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-purple-500 text-xs font-semibold">
                                <Sparkles className="w-3 h-3" />
                                디자인 {designCount}건
                            </span>
                        )}
                    </p>
                </div>

                {/* 신규 요청 Sheet */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="bg-ocean-teal hover:bg-teal-700 gap-2">
                            <Plus className="w-4 h-4" /> 샘플 신청
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[440px] sm:w-[520px] overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-ocean-teal" />
                                샘플 신청서
                            </SheetTitle>
                            <p className="text-xs text-slate-400 mt-1">
                                <span className="text-purple-500 font-semibold">디자인 샘플</span> 선택 시 패키징 세부 스펙 입력란이 나타납니다.
                            </p>
                        </SheetHeader>

                        <SampleRequestForm
                            onSubmitSuccess={handleSubmitSuccess}
                            onClose={() => setSheetOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* 포인트 범례 */}
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <Layers className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> 랜덤
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> CT
                </span>
                <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-purple-400" /> 디자인 (패키징 스펙 포함)
                </span>
            </div>

            {/* 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {requests.map((req) => (
                        <SampleCard key={req.id} req={req} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
