"use client";

import React, { useState } from "react";
import { Plus, Package, AlertTriangle } from "lucide-react";
import { MOCK_SAMPLE_REQUESTS, SAMPLE_STEPS, SampleRequest, SampleStatus, SampleType } from "@/lib/mock/sampleRequests";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ─── 상태 색상 ────────────────────────────────────────────────────
const STATUS_COLOR: Record<SampleStatus, string> = {
    대기: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    제작중: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    발송완료: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
};

const STEP_INDEX: Record<SampleStatus, number> = { 대기: 0, 제작중: 1, 발송완료: 2 };

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
                            <div className={cn("h-0.5 w-8 mb-3.5 transition-colors", i < current ? "bg-ocean-teal" : "bg-slate-200 dark:bg-slate-700")} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

// ─── 샘플 카드 ───────────────────────────────────────────────────
function SampleCard({ req }: { req: SampleRequest }) {
    const isPaid = req.sampleType === "유상";
    const isHighQty = req.quantity >= 50;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
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
                <div className="flex items-center gap-3">
                    <span><span className="font-semibold">수량:</span> {req.quantity}개</span>
                    <Badge variant="outline" className={cn("text-[10px]", isPaid ? "border-rose-500/30 text-rose-400" : "border-emerald-500/30 text-emerald-400")}>
                        {req.sampleType}
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
        </div>
    );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
export default function SalesSamplesPage() {
    const [requests] = useState<SampleRequest[]>(MOCK_SAMPLE_REQUESTS);
    const [qty, setQty] = useState(0);

    return (
        <div className="space-y-6 pb-10">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">샘플요청</h1>
                    <p className="text-slate-400 mt-1 text-sm">샘플 진행 단계를 한눈에 확인하세요.</p>
                </div>
                {/* 신규 요청 Sheet */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="bg-ocean-teal hover:bg-ocean-dark gap-2">
                            <Plus className="w-4 h-4" /> 샘플 신청
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[500px]">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-ocean-teal" />
                                샘플 신청
                            </SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                            <div><Label>고객사</Label><Input className="mt-1" placeholder="고객사명" /></div>
                            <div><Label>제품명</Label><Input className="mt-1" placeholder="샘플 제품명" /></div>
                            <div>
                                <Label>수량</Label>
                                <Input
                                    className="mt-1" type="number" min={1}
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    placeholder="수량 입력"
                                />
                                {qty >= 50 && (
                                    <div className="flex items-center gap-1.5 text-amber-500 text-xs mt-2">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        수량 50개 이상 — 유상 검토가 필요합니다.
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label>구분</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="선택" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="무상">무상</SelectItem>
                                        <SelectItem value="유상">유상</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div><Label>비고</Label><Input className="mt-1" placeholder="특이사항" /></div>
                            <Button className="w-full bg-ocean-teal hover:bg-ocean-dark mt-2">신청서 제출</Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {requests.map((req) => (
                    <SampleCard key={req.id} req={req} />
                ))}
            </div>
        </div>
    );
}
