"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lock,
    Unlock,
    CheckCircle2,
    AlertTriangle,
    Calendar,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShieldCheck,
} from "lucide-react";
import {
    MOCK_CLOSING_DATA,
    ClosingItem,
    ClosingStatus,
} from "@/lib/mock/supportClosing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── 숫자 포맷 헬퍼 ──────────────────────────────────────────────
function formatKRW(value: number): string {
    if (value >= 100000000) return (value / 100000000).toFixed(1) + "억원";
    if (value >= 10000) return Math.round(value / 10000) + "만원";
    return value.toLocaleString("ko-KR") + "원";
}

// ─── 잠김 입력 필드 ───────────────────────────────────────────────
type LockedInputProps = {
    label: string;
    value: number;
    isLocked: boolean;
    onChange: (value: number) => void;
    icon: React.ElementType;
    iconColor: string;
};

function LockedInput({ label, value, isLocked, onChange, icon: Icon, iconColor }: LockedInputProps) {
    return (
        <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                <Icon className={cn("w-3.5 h-3.5", iconColor)} />
                {label}
                {isLocked && <Lock className="w-3 h-3 text-slate-400 ml-auto" />}
            </Label>
            <div className="relative">
                <Input
                    type="number"
                    value={value}
                    readOnly={isLocked}
                    disabled={isLocked}
                    onChange={(e) => !isLocked && onChange(Number(e.target.value))}
                    className={cn(
                        "h-10 font-mono text-sm font-semibold transition-all",
                        isLocked
                            ? "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed border-slate-200 dark:border-slate-700 select-none"
                            : "bg-white dark:bg-slate-900 focus-visible:ring-ocean-teal"
                    )}
                />
                {isLocked && (
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
                {formatKRW(value)}
            </p>
        </div>
    );
}

// ─── 월별 마감 아이템 행 ──────────────────────────────────────────
function ClosingHistoryRow({ item, isSelected, onClick }: {
    item: ClosingItem;
    isSelected: boolean;
    onClick: () => void;
}) {
    const isClosed = item.status === "마감완료";

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left",
                isSelected
                    ? "border-ocean-teal bg-teal-50/60 dark:bg-teal-950/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-2 h-2 rounded-full",
                    isClosed ? "bg-emerald-400" : "bg-amber-400"
                )} />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {item.label}
                </span>
            </div>
            <Badge
                variant="outline"
                className={cn(
                    "text-[10px] font-bold",
                    isClosed
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                )}
            >
                {isClosed ? (
                    <><CheckCircle2 className="w-2.5 h-2.5 mr-1" />{item.status}</>
                ) : (
                    <><AlertTriangle className="w-2.5 h-2.5 mr-1" />{item.status}</>
                )}
            </Badge>
        </button>
    );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
export default function SupportClosingPage() {
    const [closingData, setClosingData] = useState<ClosingItem[]>(MOCK_CLOSING_DATA);
    const [selectedId, setSelectedId] = useState<string>("CL-2025-02");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // 편집용 로컬 상태 (미마감 항목 수정 시 사용)
    const [editRevenue, setEditRevenue] = useState<number>(0);
    const [editCollected, setEditCollected] = useState<number>(0);
    const [editCost, setEditCost] = useState<number>(0);

    const selectedItem = useMemo(() => {
        return closingData.find((d) => d.id === selectedId);
    }, [closingData, selectedId]);

    const isLocked = selectedItem?.status === "마감완료";

    // 항목 선택 시 로컬 편집 상태 초기화
    const handleSelectItem = (item: ClosingItem) => {
        setSelectedId(item.id);
        setEditRevenue(item.totalRevenue);
        setEditCollected(item.collectedAmount);
        setEditCost(item.totalCost);
    };

    // 초기 선택 항목 로드
    useMemo(() => {
        const item = closingData.find((d) => d.id === selectedId);
        if (item) {
            setEditRevenue(item.totalRevenue);
            setEditCollected(item.collectedAmount);
            setEditCost(item.totalCost);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    const computedProfit = editRevenue - editCost;

    // 마감 확정 처리
    const handleConfirmClosing = () => {
        if (!selectedItem) return;
        setClosingData((prev) =>
            prev.map((d) =>
                d.id === selectedId
                    ? {
                        ...d,
                        totalRevenue: editRevenue,
                        collectedAmount: editCollected,
                        totalCost: editCost,
                        operatingProfit: editRevenue - editCost,
                        status: "마감완료" as ClosingStatus,
                        closedAt: new Date().toLocaleString("ko-KR"),
                        closedBy: "현재 사용자",
                    }
                    : d
            )
        );
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-8 pb-12">
            {/* 헤더 */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        마감관리
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">
                        월말 마감을 확정하고 확정된 데이터를 보호합니다.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {isLocked
                        ? <Lock className="w-4 h-4 text-slate-400" />
                        : <Unlock className="w-4 h-4 text-amber-500" />
                    }
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {isLocked ? "마감 완료 — 편집 잠김" : "마감 전 — 편집 가능"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 좌측: 월 목록 */}
                <div className="lg:col-span-1 space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                        <Calendar className="w-3.5 h-3.5" /> 마감 현황
                    </p>
                    {closingData.map((item) => (
                        <ClosingHistoryRow
                            key={item.id}
                            item={item}
                            isSelected={item.id === selectedId}
                            onClick={() => handleSelectItem(item)}
                        />
                    ))}
                </div>

                {/* 우측: 상세 편집 폼 */}
                <AnimatePresence mode="wait">
                    {selectedItem && (
                        <motion.div
                            key={selectedItem.id}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6"
                        >
                            {/* 타이틀 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-800 dark:text-white">
                                            {selectedItem.label} 마감 명세
                                        </h2>
                                        {isLocked && (
                                            <p className="text-[11px] text-slate-400">
                                                마감 처리: {selectedItem.closedAt} · {selectedItem.closedBy}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {isLocked && (
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 gap-1.5 text-xs">
                                        <Lock className="w-3 h-3" /> 마감 완료
                                    </Badge>
                                )}
                            </div>

                            {/* 마감 잠금 안내 배너 */}
                            {isLocked && (
                                <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        마감이 확정된 데이터는 수정할 수 없습니다. 수정이 필요한 경우 관리자에게 문의하세요.
                                    </p>
                                </div>
                            )}

                            {/* 입력 폼 그리드 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <LockedInput
                                    label="총 매출액 (원)"
                                    value={isLocked ? selectedItem.totalRevenue : editRevenue}
                                    isLocked={isLocked}
                                    onChange={setEditRevenue}
                                    icon={TrendingUp}
                                    iconColor="text-teal-500"
                                />
                                <LockedInput
                                    label="수금액 (원)"
                                    value={isLocked ? selectedItem.collectedAmount : editCollected}
                                    isLocked={isLocked}
                                    onChange={setEditCollected}
                                    icon={DollarSign}
                                    iconColor="text-emerald-500"
                                />
                                <LockedInput
                                    label="총 비용 (원)"
                                    value={isLocked ? selectedItem.totalCost : editCost}
                                    isLocked={isLocked}
                                    onChange={setEditCost}
                                    icon={TrendingDown}
                                    iconColor="text-rose-500"
                                />
                                {/* 영업이익 (계산값) */}
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                        영업이익 (자동 계산)
                                        <Lock className="w-3 h-3 text-slate-400 ml-auto" />
                                    </Label>
                                    <div className="relative h-10 flex items-center px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                        <span className={cn(
                                            "font-mono text-sm font-bold",
                                            (isLocked ? selectedItem.operatingProfit : computedProfit) < 0
                                                ? "text-red-500"
                                                : "text-teal-600 dark:text-teal-400"
                                        )}>
                                            {(isLocked ? selectedItem.operatingProfit : computedProfit).toLocaleString("ko-KR")}
                                        </span>
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium">
                                        {formatKRW(isLocked ? selectedItem.operatingProfit : computedProfit)}
                                    </p>
                                </div>
                            </div>

                            {/* 마감 확정 버튼 (미마감 상태에서만) */}
                            {!isLocked && (
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                className="w-full gap-2 bg-ocean-teal hover:bg-teal-700 text-white font-bold h-11"
                                            >
                                                <Lock className="w-4 h-4" />
                                                {selectedItem.label} 마감 확정
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="max-w-md">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                                                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                                                    마감 확정하시겠습니까?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription className="text-slate-500 leading-relaxed">
                                                    <strong className="text-slate-700 dark:text-slate-200">
                                                        {selectedItem.label}
                                                    </strong> 데이터를 마감 확정합니다.
                                                    <br />
                                                    <span className="text-amber-600 dark:text-amber-400 font-bold mt-2 block">
                                                        ⚠️ 이 작업은 되돌릴 수 없습니다.
                                                    </span>
                                                    마감이 확정된 후에는 모든 수치가 잠기며 수정이 불가능합니다.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>

                                            {/* 확정 전 요약 */}
                                            <div className="my-2 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">총 매출액</span>
                                                    <span className="font-bold text-slate-700 dark:text-slate-200">{formatKRW(editRevenue)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">수금액</span>
                                                    <span className="font-bold text-slate-700 dark:text-slate-200">{formatKRW(editCollected)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">총 비용</span>
                                                    <span className="font-bold text-slate-700 dark:text-slate-200">{formatKRW(editCost)}</span>
                                                </div>
                                                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                                                    <span className="font-bold text-slate-600 dark:text-slate-300">영업이익</span>
                                                    <span className={cn(
                                                        "font-black",
                                                        computedProfit < 0 ? "text-red-500" : "text-teal-600 dark:text-teal-400"
                                                    )}>
                                                        {formatKRW(computedProfit)}
                                                    </span>
                                                </div>
                                            </div>

                                            <AlertDialogFooter>
                                                <AlertDialogCancel>취소</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleConfirmClosing}
                                                    className="bg-ocean-teal hover:bg-teal-700 text-white gap-2"
                                                >
                                                    <Lock className="w-3.5 h-3.5" />
                                                    마감 확정
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <p className="text-[11px] text-slate-400 text-center mt-2">
                                        마감 확정 후 데이터가 잠기며 수정이 불가능합니다.
                                    </p>
                                </div>
                            )}

                            {/* 마감 완료 표시 */}
                            {isLocked && (
                                <div className="flex items-center justify-center gap-2.5 px-4 py-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                        {selectedItem.label} 마감이 완료되었습니다
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
