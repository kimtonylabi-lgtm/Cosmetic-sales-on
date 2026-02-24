"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    CheckCircle2,
    AlertTriangle,
    FileText,
    FileDown,
    Search,
    TrendingUp,
} from "lucide-react";
import {
    MOCK_TAX_INVOICES,
    calcRevenueSummary,
    TaxInvoice,
    PaymentStatus,
} from "@/lib/mock/supportRevenue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── 숫자 포맷 헬퍼 ──────────────────────────────────────────────
function formatKRW(value: number): string {
    if (value >= 100000000) {
        return (value / 100000000).toFixed(1) + "억원";
    }
    if (value >= 10000) {
        return (value / 10000).toFixed(0) + "만원";
    }
    return value.toLocaleString("ko-KR") + "원";
}

function formatKRWFull(value: number): string {
    return value.toLocaleString("ko-KR") + "원";
}

// ─── 수금 상태 스타일 ─────────────────────────────────────────────
const PAYMENT_STATUS_STYLE: Record<PaymentStatus, string> = {
    수금완료: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    미수금: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    부분수금: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
};

// ─── 요약 카드 ────────────────────────────────────────────────────
type SummaryCardProps = {
    label: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    index: number;
};

function SummaryCard({ label, value, sub, icon: Icon, iconColor, iconBg, index }: SummaryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
                    {sub && (
                        <p className="text-xs text-slate-400">{sub}</p>
                    )}
                </div>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
                    <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
            </div>
        </motion.div>
    );
}

// ─── 세금계산서 행 ────────────────────────────────────────────────
function InvoiceRow({ invoice, index }: { invoice: TaxInvoice; index: number }) {
    const isUncollected = invoice.paymentStatus === "미수금";
    const remainingAmount = invoice.totalAmount - invoice.collectedAmount;

    return (
        <motion.tr
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className={cn(
                "border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
                isUncollected && "bg-amber-50/40 dark:bg-amber-950/10"
            )}
        >
            <td className="py-3 px-4 text-xs font-mono text-slate-400">
                {invoice.invoiceNo}
            </td>
            <td className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200">
                {invoice.customerName}
            </td>
            <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                {invoice.issuedDate}
            </td>
            <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                {invoice.dueDate}
            </td>
            <td className="py-3 px-4 text-xs text-right font-semibold text-slate-800 dark:text-slate-100">
                {formatKRWFull(invoice.totalAmount)}
            </td>
            <td className="py-3 px-4 text-xs text-right text-slate-500 dark:text-slate-400">
                {invoice.collectedAmount > 0 ? formatKRWFull(invoice.collectedAmount) : "-"}
            </td>
            <td className="py-3 px-4 text-xs text-right font-bold">
                {remainingAmount > 0 ? (
                    <span className="text-amber-600 dark:text-amber-400">
                        {formatKRWFull(remainingAmount)}
                    </span>
                ) : "-"}
            </td>
            <td className="py-3 px-4">
                <Badge
                    variant="outline"
                    className={cn(
                        "text-[10px] font-bold px-2 h-5",
                        PAYMENT_STATUS_STYLE[invoice.paymentStatus]
                    )}
                >
                    {invoice.paymentStatus}
                </Badge>
            </td>
        </motion.tr>
    );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
export default function SupportRevenuePage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("전체");

    const summary = useMemo(() => calcRevenueSummary(MOCK_TAX_INVOICES), []);

    const filteredInvoices = useMemo(() => {
        return MOCK_TAX_INVOICES.filter((inv) => {
            const matchesSearch =
                inv.customerName.includes(search) ||
                inv.invoiceNo.includes(search);
            const matchesStatus =
                statusFilter === "전체" || inv.paymentStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

    const handleExcelDownload = () => {
        alert("엑셀 파일 다운로드 기능은 서버 연동 후 활성화됩니다.");
    };

    const STATUS_FILTERS = ["전체", "수금완료", "미수금", "부분수금"];

    return (
        <div className="space-y-8 pb-12">
            {/* 헤더 */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        매출관리
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">
                        세금계산서 발행 현황과 미수금을 실시간으로 관리합니다.
                    </p>
                </div>
                <Button
                    onClick={handleExcelDownload}
                    variant="outline"
                    className="gap-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:text-emerald-400 transition-colors"
                >
                    <FileDown className="w-4 h-4" />
                    엑셀 다운로드
                </Button>
            </div>

            {/* 요약 카드 4개 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    index={0}
                    label="총 매출액"
                    value={formatKRW(summary.totalRevenue)}
                    sub={`${MOCK_TAX_INVOICES.length}건 발행`}
                    icon={TrendingUp}
                    iconColor="text-teal-600"
                    iconBg="bg-teal-500/10"
                />
                <SummaryCard
                    index={1}
                    label="수금 완료"
                    value={formatKRW(summary.collectedAmount)}
                    sub={`수금률 ${((summary.collectedAmount / summary.totalRevenue) * 100).toFixed(1)}%`}
                    icon={CheckCircle2}
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-500/10"
                />
                <SummaryCard
                    index={2}
                    label="미수금"
                    value={formatKRW(summary.uncollected)}
                    sub={`${MOCK_TAX_INVOICES.filter((i) => i.paymentStatus !== "수금완료").length}건 미완료`}
                    icon={AlertTriangle}
                    iconColor="text-amber-500"
                    iconBg="bg-amber-500/10"
                />
                <SummaryCard
                    index={3}
                    label="세금계산서"
                    value={`${summary.invoiceCount}건`}
                    sub="2025년 2월 누계"
                    icon={FileText}
                    iconColor="text-blue-600"
                    iconBg="bg-blue-500/10"
                />
            </div>

            {/* 테이블 카드 */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
                {/* 테이블 헤더 툴바 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <h2 className="text-sm font-bold text-slate-800 dark:text-white">
                            세금계산서 목록
                        </h2>
                        <span className="text-xs text-slate-400">({filteredInvoices.length}건)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {/* 상태 필터 */}
                        <div className="flex gap-1">
                            {STATUS_FILTERS.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={cn(
                                        "px-3 py-1 text-[11px] font-bold rounded-lg transition-colors",
                                        statusFilter === status
                                            ? "bg-ocean-teal text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        {/* 검색 */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <Input
                                className="pl-8 h-8 text-xs w-48 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                placeholder="거래처, 계산서 번호..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* 테이블 */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
                                {["계산서 번호", "거래처명", "발행일", "수금 예정일", "합계금액", "수금액", "미수금", "상태"].map((col) => (
                                    <th
                                        key={col}
                                        className="py-2.5 px-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left last:text-center"
                                        style={{ textAlign: ["합계금액", "수금액", "미수금"].includes(col) ? "right" : "left" }}
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((invoice, index) => (
                                <InvoiceRow key={invoice.id} invoice={invoice} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredInvoices.length === 0 && (
                    <div className="flex flex-col items-center py-16 text-slate-400">
                        <Search className="w-10 h-10 mb-3 text-slate-200" />
                        <p className="text-sm font-medium">검색 결과가 없습니다.</p>
                    </div>
                )}

                {/* 합계 행 */}
                {filteredInvoices.length > 0 && (
                    <div className="flex items-center justify-end gap-8 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-xs text-slate-500">
                            합계:{" "}
                            <span className="font-bold text-slate-800 dark:text-white">
                                {formatKRWFull(filteredInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0))}
                            </span>
                        </div>
                        <div className="text-xs text-amber-600 dark:text-amber-400">
                            미수금 합계:{" "}
                            <span className="font-bold">
                                {formatKRWFull(filteredInvoices.reduce((acc, inv) => acc + (inv.totalAmount - inv.collectedAmount), 0))}
                            </span>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* 미수금 안내 */}
            <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                    <strong>미수금 관리 안내:</strong> 수금 예정일이 경과한 미수금 항목은 별도 수금 독촉 절차를 진행해 주세요.
                    부분수금 항목도 잔여 미수금 확인 후 후속 조치가 필요합니다.
                </p>
            </div>
        </div>
    );
}
