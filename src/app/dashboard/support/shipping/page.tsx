"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Truck,
    Package,
    CheckCircle2,
    Clock,
    CalendarDays,
    Search,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import {
    MOCK_SHIPMENTS,
    ShipmentItem,
    ShippingStatus,
    SHIPPING_STATUS_ORDER,
} from "@/lib/mock/supportShipping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

// ─── 배송 상태 스타일 ─────────────────────────────────────────────
const STATUS_STYLE: Record<ShippingStatus, { badge: string; step: string; line: string; icon: React.ElementType }> = {
    준비중: { badge: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400", step: "border-slate-300 bg-white text-slate-400 dark:bg-slate-900 dark:border-slate-700", line: "bg-slate-200 dark:bg-slate-700", icon: Package },
    출고완료: { badge: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400", step: "border-blue-500 bg-blue-500 text-white", line: "bg-blue-300 dark:bg-blue-700", icon: Truck },
    배송중: { badge: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400", step: "border-amber-500 bg-amber-500 text-white", line: "bg-amber-300 dark:bg-amber-700", icon: Truck },
    배송완료: { badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400", step: "border-emerald-500 bg-emerald-500 text-white", line: "bg-emerald-400 dark:bg-emerald-600", icon: CheckCircle2 },
};

// ─── 배송 상태 트래커 (Step/Timeline UI) ─────────────────────────
function ShipmentTracker({ shipment }: { shipment: ShipmentItem }) {
    const currentIndex = SHIPPING_STATUS_ORDER.indexOf(shipment.status);

    return (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                배송 현황
            </p>
            <div className="flex items-center gap-0">
                {SHIPPING_STATUS_ORDER.map((step, idx) => {
                    const isDone = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    const isLast = idx === SHIPPING_STATUS_ORDER.length - 1;
                    const StepIcon = isDone ? (isCurrent ? STATUS_STYLE[step].icon : CheckCircle2) : Clock;

                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                                        isDone
                                            ? isCurrent
                                                ? STATUS_STYLE[shipment.status].step
                                                : "border-teal-500 bg-teal-500 text-white"
                                            : STATUS_STYLE["준비중"].step
                                    )}
                                >
                                    <StepIcon className="w-3.5 h-3.5" />
                                </div>
                                <p className={cn(
                                    "text-[10px] font-bold whitespace-nowrap",
                                    isCurrent ? "text-teal-600 dark:text-teal-400" : isDone ? "text-slate-500" : "text-slate-300 dark:text-slate-600"
                                )}>
                                    {step}
                                </p>
                            </div>
                            {!isLast && (
                                <div
                                    className={cn(
                                        "h-0.5 flex-1 mx-1 mb-5 transition-colors",
                                        idx < currentIndex ? "bg-teal-400 dark:bg-teal-600" : "bg-slate-200 dark:bg-slate-700"
                                    )}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

// ─── 출고 상세 확장 패널 ──────────────────────────────────────────
function ShipmentRow({ shipment, index }: { shipment: ShipmentItem; index: number }) {
    const [expanded, setExpanded] = useState(false);
    const style = STATUS_STYLE[shipment.status];

    return (
        <>
            <motion.tr
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => setExpanded(!expanded)}
                className="border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
                <td className="py-3 px-4 text-xs font-mono text-slate-400">
                    {shipment.shipmentNo}
                </td>
                <td className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {shipment.customerName}
                </td>
                <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                    {shipment.productName}
                </td>
                <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                    {shipment.shippedDate}
                </td>
                <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                    {shipment.estimatedDelivery}
                </td>
                <td className="py-3 px-4">
                    <Badge variant="outline" className={cn("text-[10px] font-bold px-2 h-5", style.badge)}>
                        {shipment.status}
                    </Badge>
                </td>
                <td className="py-3 px-4 text-xs">
                    {expanded
                        ? <ChevronDown className="w-4 h-4 text-slate-400" />
                        : <ChevronRight className="w-4 h-4 text-slate-300" />
                    }
                </td>
            </motion.tr>

            {/* 확장 트래커 */}
            <AnimatePresence>
                {expanded && (
                    <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <td colSpan={7} className="px-6 pb-4 bg-slate-50/60 dark:bg-slate-800/30">
                            <ShipmentTracker shipment={shipment} />
                            <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                                <div>
                                    <span className="text-slate-400">운송장 번호: </span>
                                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                                        {shipment.trackingNo}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400">택배사: </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                                        {shipment.carrier}
                                    </span>
                                </div>
                            </div>
                        </td>
                    </motion.tr>
                )}
            </AnimatePresence>
        </>
    );
}

// ─── 날짜 범위 선택기 ─────────────────────────────────────────────
function DateRangePicker({
    dateRange,
    onSelect,
}: {
    dateRange: DateRange | undefined;
    onSelect: (range: DateRange | undefined) => void;
}) {
    const [open, setOpen] = useState(false);

    const displayText = useMemo(() => {
        if (!dateRange?.from) return "기간 선택";
        if (!dateRange.to) return format(dateRange.from, "yyyy.MM.dd", { locale: ko });
        return `${format(dateRange.from, "yyyy.MM.dd", { locale: ko })} ~ ${format(dateRange.to, "yyyy.MM.dd", { locale: ko })}`;
    }, [dateRange]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "gap-2 h-9 text-xs font-medium min-w-[200px] justify-start",
                        dateRange?.from ? "text-slate-700 dark:text-slate-200" : "text-slate-400"
                    )}
                >
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    {displayText}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={onSelect}
                    numberOfMonths={2}
                    locale={ko}
                />
                <div className="flex justify-end gap-2 p-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => { onSelect(undefined); setOpen(false); }}
                    >
                        초기화
                    </Button>
                    <Button size="sm" className="text-xs bg-ocean-teal hover:bg-teal-700 text-white" onClick={() => setOpen(false)}>
                        적용
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
export default function SupportShippingPage() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<string>("전체");

    const STATUS_FILTERS: Array<{ label: string; value: string }> = [
        { label: "전체", value: "전체" },
        { label: "준비중", value: "준비중" },
        { label: "출고완료", value: "출고완료" },
        { label: "배송중", value: "배송중" },
        { label: "배송완료", value: "배송완료" },
    ];

    const filteredShipments = useMemo(() => {
        return MOCK_SHIPMENTS.filter((s) => {
            const matchesSearch =
                s.customerName.includes(search) ||
                s.shipmentNo.includes(search) ||
                s.productName.includes(search);

            const matchesStatus = statusFilter === "전체" || s.status === statusFilter;

            let matchesDate = true;
            if (dateRange?.from) {
                const shipDate = parseISO(s.shippedDate);
                const from = startOfDay(dateRange.from);
                const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
                matchesDate = isWithinInterval(shipDate, { start: from, end: to });
            }

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [search, statusFilter, dateRange]);

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { 전체: MOCK_SHIPMENTS.length };
        SHIPPING_STATUS_ORDER.forEach((s) => {
            counts[s] = MOCK_SHIPMENTS.filter((item) => item.status === s).length;
        });
        return counts;
    }, []);

    return (
        <div className="space-y-8 pb-12">
            {/* 헤더 */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    출고관리
                </h1>
                <p className="text-slate-400 mt-1 text-sm font-medium">
                    기간별 출고 현황을 조회하고 실시간 배송 상태를 추적합니다.
                </p>
            </div>

            {/* 필터 바 */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* 날짜 범위 선택기 */}
                <DateRangePicker dateRange={dateRange} onSelect={setDateRange} />

                {/* 상태 필터 */}
                <div className="flex gap-1 flex-wrap">
                    {STATUS_FILTERS.map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => setStatusFilter(value)}
                            className={cn(
                                "px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors",
                                statusFilter === value
                                    ? "bg-ocean-teal text-white"
                                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            {label}
                            <span className="ml-1 opacity-60">({statusCounts[value]})</span>
                        </button>
                    ))}
                </div>

                {/* 검색 */}
                <div className="relative ml-auto">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <Input
                        className="pl-8 h-9 text-xs w-52 bg-white dark:bg-slate-900"
                        placeholder="출고번호, 거래처, 제품명..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* 메인 테이블 */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <h2 className="text-sm font-bold text-slate-800 dark:text-white">
                            출고 내역
                        </h2>
                        <span className="text-xs text-slate-400">({filteredShipments.length}건)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                        행 클릭 시 배송 추적 정보가 펼쳐집니다.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
                                {["출고 번호", "거래처명", "제품명", "출고일", "배송 예정일", "상태", ""].map((col, i) => (
                                    <th
                                        key={i}
                                        className="py-2.5 px-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filteredShipments.map((shipment, index) => (
                                    <ShipmentRow key={shipment.id} shipment={shipment} index={index} />
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredShipments.length === 0 && (
                    <div className="flex flex-col items-center py-16 text-slate-400">
                        <Truck className="w-12 h-12 mb-3 text-slate-200" />
                        <p className="text-sm font-medium">해당 조건의 출고 내역이 없습니다.</p>
                        <p className="text-xs text-slate-300 mt-1">날짜 범위 또는 필터를 조정해 보세요.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
