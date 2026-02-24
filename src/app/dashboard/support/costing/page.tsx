"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    ResponsiveContainer,
} from "recharts";
import {
    TrendingDown,
    TrendingUp,
    AlertCircle,
    BarChart3,
    Calculator as CalcIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    MATERIAL_TREND_DATA,
    COST_BREAKDOWN_DATA,
    CostBreakdown,
} from "@/lib/mock/supportCosting";
import { cn } from "@/lib/utils";

// ─── 숫자 포맷 헬퍼 ──────────────────────────────────────────────
function formatKRW(value: number): string {
    return value.toLocaleString("ko-KR") + "원";
}

function formatPercent(value: number): string {
    return (value > 0 ? "+" : "") + value.toFixed(1) + "%";
}

// ─── 차트 커스텀 툴팁 ────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl text-xs">
            <p className="font-bold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
            {payload.map((entry: any) => (
                <div key={entry.name} className="flex items-center gap-2 mb-1">
                    <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-500">{entry.name}:</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                        {entry.name === "마진율"
                            ? formatPercent(entry.value)
                            : formatKRW(entry.value)}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── 마진율 커스텀 도트 (적자 시 빨강) ───────────────────────────
function MarginDot(props: any) {
    const { cx, cy, payload } = props;
    const isNegative = payload.marginRate < 0;

    return (
        <circle
            cx={cx}
            cy={cy}
            r={5}
            fill={isNegative ? "#ef4444" : "#0d9488"}
            stroke="white"
            strokeWidth={2}
        />
    );
}

// ─── 원가 테이블 행 ───────────────────────────────────────────────
function CostRow({ item, index }: { item: CostBreakdown; index: number }) {
    const isLoss = item.marginRate < 0;

    return (
        <motion.tr
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50",
                isLoss && "bg-red-50/60 dark:bg-red-950/20"
            )}
        >
            <td className="py-3 px-4 text-xs font-medium text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2">
                    {isLoss && <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                    {item.productName}
                </div>
            </td>
            <td className="py-3 px-4 text-xs text-right text-slate-600 dark:text-slate-400">
                {formatKRW(item.rawMaterial)}
            </td>
            <td className="py-3 px-4 text-xs text-right text-slate-600 dark:text-slate-400">
                {formatKRW(item.subMaterial)}
            </td>
            <td className="py-3 px-4 text-xs text-right text-slate-600 dark:text-slate-400">
                {formatKRW(item.laborCost)}
            </td>
            <td className="py-3 px-4 text-xs text-right text-slate-600 dark:text-slate-400">
                {formatKRW(item.overhead)}
            </td>
            <td className="py-3 px-4 text-xs text-right font-semibold text-slate-800 dark:text-slate-100">
                {formatKRW(item.totalCost)}
            </td>
            <td className="py-3 px-4 text-xs text-right text-slate-600 dark:text-slate-400">
                {formatKRW(item.sellPrice)}
            </td>
            <td className="py-3 px-4 text-xs text-right font-bold">
                <span className={cn(isLoss ? "text-red-500" : "text-teal-600 dark:text-teal-400")}>
                    {formatPercent(item.marginRate)}
                </span>
            </td>
        </motion.tr>
    );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
import { DetailedCostCalcSheet } from "./DetailedCostCalcSheet";
import { Calculator, Plus } from "lucide-react";

export default function SupportCostingPage() {
    const [isCalcOpen, setIsCalcOpen] = useState(false);
    const lossCount = COST_BREAKDOWN_DATA.filter((d) => d.marginRate < 0).length;

    return (
        <div className="space-y-8 pb-12">
            {/* 헤더 */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        원가관리
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">
                        원부자재 가격 변동 추이와 제품별 마진율을 분석합니다.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {lossCount > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                적자 제품 {lossCount}건 감지
                            </span>
                        </div>
                    )}
                    <Button
                        onClick={() => setIsCalcOpen(true)}
                        className="bg-ocean-teal hover:bg-ocean-dark gap-2"
                    >
                        <Plus className="w-4 h-4" /> 신규 원가 산출
                    </Button>
                </div>
            </div>

            {/* 차트 카드 */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 dark:text-white">
                            원부자재 단가 &amp; 마진율 추이
                        </h2>
                        <p className="text-xs text-slate-400">최근 6개월 기준</p>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={320}>
                    <ComposedChart data={MATERIAL_TREND_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />

                        {/* 원자재 단가 막대 */}
                        <Bar yAxisId="left" dataKey="rawMaterial" name="원자재 단가(원/kg)" radius={[4, 4, 0, 0]}>
                            {MATERIAL_TREND_DATA.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.marginRate < 0 ? "#fca5a5" : "#99f6e4"}
                                />
                            ))}
                        </Bar>

                        {/* 마진율 꺾은선 */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="marginRate"
                            name="마진율"
                            strokeWidth={2.5}
                            stroke="#0d9488"
                            dot={<MarginDot />}
                        />
                    </ComposedChart>
                </ResponsiveContainer>

                {/* 범례 보조 설명 */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="w-3 h-3 rounded-sm bg-red-300 inline-block" />
                        적자 구간 (마진율 &lt; 0%)
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="w-3 h-3 rounded-sm bg-teal-200 inline-block" />
                        정상 구간 (마진율 ≥ 0%)
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-red-500">
                        <TrendingDown className="w-3.5 h-3.5" />
                        마진율 음수 = 적자
                    </div>
                </div>
            </motion.div>

            {/* 원가 구성 테이블 */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-teal-600" />
                        <h2 className="text-sm font-bold text-slate-800 dark:text-white">
                            제품별 원가 구성 명세
                        </h2>
                    </div>
                    <span className="text-xs text-slate-400">
                        {COST_BREAKDOWN_DATA.length}개 제품
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
                                {["제품명", "원자재비", "부자재비", "인건비", "간접비", "총원가", "판매가", "마진율"].map((col) => (
                                    <th key={col} className="py-2.5 px-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right first:text-left">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {COST_BREAKDOWN_DATA.map((item, index) => (
                                <CostRow key={item.id} item={item} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 적자 안내 */}
                {lossCount > 0 && (
                    <div className="px-6 py-3 bg-red-50/50 dark:bg-red-950/10 border-t border-red-100 dark:border-red-900/30">
                        <p className="text-xs text-red-500 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            빨간색으로 표시된 제품은 현재 판매가가 원가보다 낮아 손실이 발생하고 있습니다. 가격 조정이 필요합니다.
                        </p>
                    </div>
                )}
            </motion.div>

            <DetailedCostCalcSheet
                open={isCalcOpen}
                onOpenChange={setIsCalcOpen}
                onApply={(data) => {
                    console.log("Calculated Cost Applied:", data);
                    alert(`신규 산출 단가: ${data.unitPrice.toLocaleString()}원이 적용되었습니다.`);
                }}
            />
        </div>
    );
}
