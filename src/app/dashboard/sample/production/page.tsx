"use client";

import React, { useState } from "react";
import {
    FileUp,
    Package,
    Beaker,
    Trash2,
    CheckCircle2,
    Truck,
    ExternalLink,
    ChevronRight,
    Info,
    Archive,
    FlaskConical,
    ClipboardList
} from "lucide-react";
import {
    MOCK_PRODUCTION_DATA,
    SampleProduction,
    ProductionStep
} from "@/lib/mock/sampleProduction";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── 스텝퍼 설정 ──────────────────────────────────────────────────
const STEPS: ProductionStep[] = ["준비", "제작", "QC", "완료", "발송완료"];
const STEP_ICONS: Record<ProductionStep, React.ElementType> = {
    준비: Archive,
    제작: Beaker,
    QC: FlaskConical,
    완료: CheckCircle2,
    발송완료: Truck
};

// ─── 파일 업로더 컴포넌트 ───────────────────────────────────────────
function FileDropZone({
    onFilesDrop
}: {
    onFilesDrop: (files: File[]) => void
}) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setIsDragOver(true);
        else if (e.type === "dragleave") setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesDrop(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={cn(
                "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer",
                isDragOver
                    ? "border-ocean-teal bg-ocean-teal/5 scale-[0.99]"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
            )}
        >
            <div className="w-12 h-12 rounded-full bg-ocean-teal/10 flex items-center justify-center mb-4">
                <FileUp className="w-6 h-6 text-ocean-teal" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">레시피 또는 스펙시트를 업로드하세요</p>
            <p className="text-xs text-slate-400 mt-1">파일을 이 화면으로 끌어다 놓거나 클릭하여 선택</p>
        </div>
    );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────
export default function SampleProductionPage() {
    const [productions, setProductions] = useState<SampleProduction[]>(MOCK_PRODUCTION_DATA);
    const [selected, setSelected] = useState<SampleProduction | null>(null);
    const [notes, setNotes] = useState("");

    const handleStepChange = (id: string, step: ProductionStep) => {
        setProductions(prev => prev.map(p => p.id === id ? { ...p, currentStep: step } : p));
    };

    return (
        <div className="space-y-6 pb-20">
            {/* 헤더 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">샘플제작관리</h1>
                    <p className="text-slate-400 mt-1 text-sm">확정된 샘플의 R&D 진행 상황과 스펙을 관리합니다.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* 리스트 섹션 */}
                <div className="xl:col-span-2 space-y-4">
                    <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest pl-1">제작 진행 목록</h2>
                    {productions.map((prod) => (
                        <div
                            key={prod.id}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                        >
                            {/* 스텝퍼 */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-0">
                                    {STEPS.map((step, i) => {
                                        const currentIdx = STEPS.indexOf(prod.currentStep);
                                        const isDone = i < currentIdx;
                                        const isActive = i === currentIdx;
                                        const Icon = STEP_ICONS[step];

                                        return (
                                            <React.Fragment key={step}>
                                                <div className="flex flex-col items-center relative group">
                                                    <button
                                                        onClick={() => handleStepChange(prod.id, step)}
                                                        disabled={step === "발송완료" && prod.currentStep !== "완료"}
                                                        className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 border-4",
                                                            isDone ? "bg-ocean-teal border-white dark:border-slate-900 text-white shadow-lg shadow-ocean-teal/20"
                                                                : isActive ? "bg-white dark:bg-slate-900 border-ocean-teal text-ocean-teal scale-110"
                                                                    : "bg-slate-100 dark:bg-slate-800 border-white dark:border-slate-900 text-slate-400 opacity-40 hover:opacity-100"
                                                        )}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                    </button>
                                                    <span className={cn(
                                                        "absolute -bottom-6 text-[10px] font-black uppercase whitespace-nowrap tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity",
                                                        isActive ? "opacity-100 text-ocean-teal" : "text-slate-400"
                                                    )}>
                                                        {step}
                                                    </span>
                                                </div>
                                                {i < STEPS.length - 1 && (
                                                    <div className={cn("h-1 w-8 sm:w-16 mx-[-2px] mb-0 rounded-full", i < currentIdx ? "bg-ocean-teal" : "bg-slate-100 dark:bg-slate-800")} />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold py-1 px-3 border-ocean-teal/30 text-ocean-teal bg-ocean-teal/5">
                                    STEP {STEPS.indexOf(prod.currentStep) + 1}: {prod.currentStep}
                                </Badge>
                            </div>

                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{prod.productName}</h3>
                                    <p className="text-sm text-ocean-teal font-semibold">{prod.customerName}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelected(prod)}
                                    className="rounded-full h-10 w-10 p-0 text-slate-400 hover:bg-ocean-teal/10 hover:text-ocean-teal"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="mt-6 flex items-center gap-4 text-xs text-slate-400 border-t border-slate-50 dark:border-slate-800 pt-5">
                                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                    <Package className="w-3 h-3" /> 파일 {prod.files.length}개
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                    <ClipboardList className="w-3 h-3" /> 스펙 3개 항목
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 제작 도구 섹션 */}
                <div className="space-y-6">
                    <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest pl-1">R&D 리소르 업로드</h2>
                    <FileDropZone onFilesDrop={(f) => console.log(f)} />

                    <div className="bg-ocean-dark text-white rounded-3xl p-6 shadow-xl shadow-ocean-teal/10">
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-lg">
                            <Info className="w-5 h-5" /> 제작 가이드
                        </h3>
                        <ul className="space-y-3 text-sm text-ocean-teal/30 leading-snug">
                            <li className="flex gap-2">
                                <span className="text-white font-bold">•</span>
                                스펙 변경 시 반드시 영업팀과 협의 후 업데이트 하십시오.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-white font-bold">•</span>
                                내용물은 3회 이상의 안정성 테스트를 거쳐야 QC 통과가 가능합니다.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-white font-bold">•</span>
                                발송 완료 시 송장 번호 대신 제작 특이사항을 영업팀에 공유하십시오.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 우측 상세 패널 (Sheet) */}
            <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    {selected && (
                        <>
                            <SheetHeader className="pb-6 border-b">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-ocean-teal border-ocean-teal/30 bg-ocean-teal/5">
                                        {selected.id}
                                    </Badge>
                                    <Badge className="bg-amber-500">{selected.currentStep}</Badge>
                                </div>
                                <SheetTitle className="text-2xl font-black text-slate-900 dark:text-white">
                                    {selected.productName}
                                </SheetTitle>
                                <SheetDescription className="text-ocean-teal font-bold py-1">
                                    고객사: {selected.customerName}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="py-8 space-y-8">
                                {/* 📝 아코디언 섹션 */}
                                <div>
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <ClipboardList className="w-3.5 h-3.5" /> 제작 세부 스펙
                                    </h4>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="container" className="border-slate-100 dark:border-slate-800">
                                            <AccordionTrigger className="hover:no-underline hover:text-ocean-teal font-bold py-4">
                                                용기 정보 (Container)
                                            </AccordionTrigger>
                                            <AccordionContent className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pb-6">
                                                {selected.spec.container}
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="content" className="border-slate-100 dark:border-slate-800">
                                            <AccordionTrigger className="hover:no-underline hover:text-ocean-teal font-bold py-4">
                                                내용물 정보 (Content)
                                            </AccordionTrigger>
                                            <AccordionContent className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pb-6">
                                                {selected.spec.content}
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="formula" className="border-none">
                                            <AccordionTrigger className="hover:no-underline hover:text-ocean-teal font-bold py-4">
                                                처방 정보 (Formula)
                                            </AccordionTrigger>
                                            <AccordionContent className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pb-6">
                                                {selected.spec.formula}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>

                                {/* 📎 파일 목록 */}
                                <div>
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Archive className="w-3.5 h-3.5" /> 관련 문서 및 자료
                                    </h4>
                                    <div className="grid gap-2">
                                        {selected.files.map((file, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group transition-colors hover:border-ocean-teal/30"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-[10px] text-slate-400">
                                                        {file.type.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{file.name}</p>
                                                        <p className="text-[10px] text-slate-400">{file.size}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 🚀 완료 및 발송 처리 (제작완료/QC통과 시에만 강조) */}
                                <div className={cn(
                                    "p-6 rounded-2xl border-2 transition-all",
                                    selected.currentStep === "완료"
                                        ? "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/5"
                                        : "border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 opacity-60"
                                )}>
                                    <h5 className="font-black text-sm mb-3 text-slate-900 dark:text-white flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-emerald-500" /> 완료 및 발송 처리
                                    </h5>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase flex items-center justify-between">
                                                제작 특이사항 (이슈/메모)
                                                <span className="text-emerald-500">필수 입력</span>
                                            </label>
                                            <Textarea
                                                disabled={selected.currentStep !== "완료"}
                                                className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-emerald-500 min-h-[100px] text-sm"
                                                placeholder="제작 과정에서 발생한 이슈나 고객 전달 사항을 입력하세요..."
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            disabled={selected.currentStep !== "완료" || !notes.trim()}
                                            className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 font-bold text-sm gap-2 shadow-lg shadow-emerald-500/20"
                                            onClick={() => {
                                                handleStepChange(selected.id, "발송완료");
                                                setSelected(null);
                                                setNotes("");
                                            }}
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> 발송 처리 및 작업 종료
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
