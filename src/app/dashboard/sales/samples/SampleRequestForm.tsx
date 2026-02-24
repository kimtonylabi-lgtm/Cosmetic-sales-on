"use client";

import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertTriangle,
    Sparkles,
    ChevronDown,
    Package,
    FileEdit,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
    SampleRequest,
    SampleKind,
    DesignSpecs,
} from "@/lib/mock/sampleRequests";
import { useBomMaster } from "@/lib/hooks/useBomMaster";
import { DesignSampleBlock, BomRow, DEFAULT_BOM_ROWS } from "./DesignSampleBlock";

// ─── Zod 스키마 정의 ─────────────────────────────────────────────
const sampleFormSchema = z
    .object({
        customerName: z.string().min(1, "고객사를 입력해주세요."),
        productName: z.string().min(1, "제품명을 입력해주세요."),
        quantity: z.number().int().positive("수량은 1 이상이어야 합니다."),
        sampleType: z.enum(["무상", "유상"]),
        sampleKind: z.enum(["랜덤", "CT", "디자인"]),
        note: z.string().optional(),
    });

type SampleFormValues = z.infer<typeof sampleFormSchema>;

// ─── 샘플 종류 라디오 버튼 옵션 ──────────────────────────────────
const SAMPLE_KIND_OPTIONS: Array<{
    value: SampleKind;
    label: string;
    desc: string;
    color: string;
}> = [
        { value: "랜덤", label: "랜덤", desc: "일반 제형 샘플", color: "border-blue-500 bg-blue-500/10 text-blue-600" },
        { value: "CT", label: "CT", desc: "처방 확인용 샘플", color: "border-amber-500 bg-amber-500/10 text-amber-600" },
        { value: "디자인", label: "디자인", desc: "패키징 전용", color: "border-purple-500 bg-purple-500/10 text-purple-600" },
    ];

// ─── 폼 컴포넌트 Props ────────────────────────────────────────────
interface SampleRequestFormProps {
    onSubmitSuccess: (
        newRequest: Omit<SampleRequest, "id" | "requestNo" | "requestedAt" | "status" | "requestedBy">
    ) => void;
    onClose: () => void;
}

// ─── 디자인 메타 상태 타입 ────────────────────────────────────────
interface DesignMeta {
    requestDate: string;
    sampleNo: string;
    vendorName: string;
    requiredQty: string;
    requestedDate: string;
    specimenColor: string;
    film: string;
    lava: string;
    catNo: string;
    specialNote: string;
    artworkFileName: string;
    bomRows: BomRow[];
}

const INITIAL_DESIGN_META: DesignMeta = {
    requestDate: new Date().toISOString().slice(0, 10),
    sampleNo: "",
    vendorName: "",
    requiredQty: "",
    requestedDate: "",
    specimenColor: "",
    film: "",
    lava: "",
    catNo: "",
    specialNote: "",
    artworkFileName: "",
    bomRows: DEFAULT_BOM_ROWS,
};

// ─── 디자인 의뢰서 요약 배지 ──────────────────────────────────────
function DesignSpecSummary({ meta, onEdit }: { meta: DesignMeta; onEdit: () => void }) {
    const filledBomCount = meta.bomRows.filter((r) => r.partName.trim()).length;
    const hasFilled = filledBomCount > 0 || meta.vendorName || meta.artworkFileName;

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "rounded-xl border-2 p-3 flex items-center justify-between gap-3 cursor-pointer group transition-all",
                hasFilled
                    ? "border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500"
                    : "border-purple-300/60 bg-purple-50/50 dark:bg-purple-950/20 hover:border-purple-400 border-dashed"
            )}
            onClick={onEdit}
        >
            <div className="flex items-center gap-2.5">
                {hasFilled ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                    <FileEdit className="w-5 h-5 text-purple-400 shrink-0" />
                )}
                <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {hasFilled ? "의뢰서 작성됨" : "의뢰서 미작성"}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {hasFilled
                            ? `BOM ${filledBomCount}개 입력 · 업체: ${meta.vendorName || "미입력"}`
                            : "클릭하여 디자인 의뢰서 작성"}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-300 group-hover:gap-2 transition-all">
                {hasFilled ? "수정" : "입력"}
                <ArrowRight className="w-3.5 h-3.5" />
            </div>
        </motion.div>
    );
}

// ─── 메인 폼 컴포넌트 ─────────────────────────────────────────────
export function SampleRequestForm({ onSubmitSuccess, onClose }: SampleRequestFormProps) {
    const { bulkSaveToMaster } = useBomMaster();

    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SampleFormValues>({
        resolver: zodResolver(sampleFormSchema),
        defaultValues: {
            sampleKind: "랜덤",
            sampleType: "무상",
            quantity: 1,
        },
    });

    const sampleKind = watch("sampleKind");
    const quantity = watch("quantity");
    const isDesign = sampleKind === "디자인";

    // 디자인 전용 상태
    const [designMeta, setDesignMeta] = useState<DesignMeta>(INITIAL_DESIGN_META);
    // 좌측 디자인 의뢰서 패널 열림 상태
    const [designSheetOpen, setDesignSheetOpen] = useState(false);

    const updateDesignMeta = useCallback(
        <K extends keyof DesignMeta>(key: K, value: DesignMeta[K]) => {
            setDesignMeta((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    // ─── 제출 처리 ────────────────────────────────────────────────
    const onSubmit = async (data: SampleFormValues) => {
        let designSpecs: DesignSpecs | null = null;

        if (data.sampleKind === "디자인") {
            const { bomRows, vendorName, specimenColor, artworkFileName, specialNote, ...rest } = designMeta;

            // 신규 BOM 데이터 마스터에 저장
            bulkSaveToMaster({ 업체명: [vendorName] });
            bomRows.forEach((row) => {
                bulkSaveToMaster({
                    부품명: [row.partName],
                    원료명: [row.materialName],
                    색상명: [row.color],
                    증착명: [row.deposition],
                    인쇄명: [row.printing],
                });
            });

            designSpecs = {
                material: bomRows.map((r) => r.materialName).filter(Boolean).join(", "),
                finishings: bomRows.map((r) => r.printing).filter(Boolean),
                pantoneColor: specimenColor,
                designNotes: specialNote,
                artworkFileName,
                bom: bomRows,
                meta: rest,
                vendorName,
            } as any;
        }

        const payload = {
            customerName: data.customerName,
            productName: data.productName,
            quantity: data.quantity,
            sampleType: data.sampleType,
            sampleKind: data.sampleKind,
            note: data.note ?? "",
            specs: designSpecs,
        };

        console.log("[Server Action Mock] 샘플 신청 제출:", JSON.stringify(payload, null, 2));
        onSubmitSuccess(payload);
        onClose();
    };

    return (
        <>
            {/* ─────────────────────────────────────────────────────
                좌측 디자인 의뢰서 전용 Sheet (넓은 패널)
            ───────────────────────────────────────────────────── */}
            <Sheet open={designSheetOpen} onOpenChange={setDesignSheetOpen}>
                <SheetContent
                    side="left"
                    className="w-full max-w-3xl sm:max-w-3xl p-0 flex flex-col"
                >
                    {/* 헤더 */}
                    <SheetHeader className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-slate-50 dark:from-purple-950/30 dark:to-slate-900">
                        <SheetTitle className="flex items-center gap-2.5 text-base font-bold">
                            <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <FileEdit className="w-4 h-4 text-purple-600" />
                            </div>
                            디자인 샘플 의뢰서
                            <span className="text-xs font-normal text-slate-400 ml-1">
                                — 상세 스펙 입력
                            </span>
                        </SheetTitle>
                    </SheetHeader>

                    {/* 스크롤 가능한 내용 */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <DesignSampleBlock
                            artworkFileName={designMeta.artworkFileName}
                            onArtworkChange={(v) => updateDesignMeta("artworkFileName", v)}
                            bomRows={designMeta.bomRows}
                            onBomChange={(rows) => updateDesignMeta("bomRows", rows)}
                            requestDate={designMeta.requestDate}
                            onRequestDateChange={(v) => updateDesignMeta("requestDate", v)}
                            sampleNo={designMeta.sampleNo}
                            onSampleNoChange={(v) => updateDesignMeta("sampleNo", v)}
                            vendorName={designMeta.vendorName}
                            onVendorNameChange={(v) => updateDesignMeta("vendorName", v)}
                            requiredQty={designMeta.requiredQty}
                            onRequiredQtyChange={(v) => updateDesignMeta("requiredQty", v)}
                            requestedDate={designMeta.requestedDate}
                            onRequestedDateChange={(v) => updateDesignMeta("requestedDate", v)}
                            specimenColor={designMeta.specimenColor}
                            onSpecimenColorChange={(v) => updateDesignMeta("specimenColor", v)}
                            film={designMeta.film}
                            onFilmChange={(v) => updateDesignMeta("film", v)}
                            lava={designMeta.lava}
                            onLavaChange={(v) => updateDesignMeta("lava", v)}
                            catNo={designMeta.catNo}
                            onCatNoChange={(v) => updateDesignMeta("catNo", v)}
                            specialNote={designMeta.specialNote}
                            onSpecialNoteChange={(v) => updateDesignMeta("specialNote", v)}
                        />
                    </div>

                    {/* 하단 저장 버튼 */}
                    <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-900 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setDesignSheetOpen(false)}
                        >
                            취소
                        </Button>
                        <Button
                            type="button"
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2"
                            onClick={() => setDesignSheetOpen(false)}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            의뢰서 저장
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* ─────────────────────────────────────────────────────
                기본 신청 폼 (오른쪽 Sheet 내부)
            ───────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-6">

                {/* ─── 고객사 */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        고객사 <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        {...register("customerName")}
                        placeholder="예: 아모레퍼시픽"
                        className={cn(errors.customerName && "border-rose-500")}
                    />
                    {errors.customerName && (
                        <p className="text-[11px] text-rose-500">{errors.customerName.message}</p>
                    )}
                </div>

                {/* ─── 제품명 */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        제품명 <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        {...register("productName")}
                        placeholder="예: 수분 크림 OEM 프로토타입"
                        className={cn(errors.productName && "border-rose-500")}
                    />
                    {errors.productName && (
                        <p className="text-[11px] text-rose-500">{errors.productName.message}</p>
                    )}
                </div>

                {/* ─── 수량 + 구분 (2열) */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            수량 <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            type="number"
                            min={1}
                            {...register("quantity", { valueAsNumber: true })}
                            className={cn(errors.quantity && "border-rose-500")}
                        />
                        {errors.quantity && (
                            <p className="text-[11px] text-rose-500">{errors.quantity.message}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            구분 <span className="text-rose-500">*</span>
                        </Label>
                        <Controller
                            name="sampleType"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="무상">무상</SelectItem>
                                        <SelectItem value="유상">유상</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>

                {/* 수량 50개 이상 경고 */}
                <AnimatePresence>
                    {quantity >= 50 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-1.5 text-amber-500 text-xs bg-amber-500/10 px-3 py-2 rounded-lg"
                        >
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            수량 50개 이상 — 유상 검토가 필요합니다.
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── 샘플 종류 라디오 */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        샘플 종류 <span className="text-rose-500">*</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                        {SAMPLE_KIND_OPTIONS.map(({ value, label, desc, color }) => {
                            const isSelected = sampleKind === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() =>
                                        setValue("sampleKind", value as SampleKind, { shouldValidate: true })
                                    }
                                    className={cn(
                                        "relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-bold transition-all",
                                        isSelected
                                            ? color
                                            : "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300"
                                    )}
                                >
                                    {value === "디자인" && isSelected && (
                                        <Sparkles className="w-3.5 h-3.5 absolute top-1.5 right-1.5 text-purple-500" />
                                    )}
                                    <span className="text-sm">{label}</span>
                                    <span className="font-normal text-[10px] opacity-70">{desc}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ─── 디자인 의뢰서 입력 영역 (조건부) ──────────── */}
                <AnimatePresence>
                    {isDesign && (
                        <motion.div
                            key="design-entry"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden space-y-2"
                        >
                            {/* 의뢰서 상태 요약 + 입력 버튼 */}
                            <DesignSpecSummary
                                meta={designMeta}
                                onEdit={() => setDesignSheetOpen(true)}
                            />

                            {/* 빠른 열기 버튼 */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-semibold gap-2 h-9"
                                onClick={() => setDesignSheetOpen(true)}
                            >
                                <FileEdit className="w-3.5 h-3.5" />
                                디자인 의뢰서 전체 입력 →
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── 비고 (비-디자인 종류 시) */}
                {!isDesign && (
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">비고</Label>
                        <Textarea
                            {...register("note")}
                            placeholder="기타 특이사항을 입력하세요."
                            className="min-h-[60px] text-sm resize-none"
                        />
                    </div>
                )}

                {/* ─── 구분선 */}
                {isDesign && <div className="border-t border-slate-200 dark:border-slate-700" />}

                {/* ─── 제출 버튼 */}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-ocean-teal hover:bg-teal-700 text-white font-bold h-11 gap-2"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <ChevronDown className="w-4 h-4" />
                            </motion.div>
                            제출 중...
                        </span>
                    ) : (
                        <>
                            <Package className="w-4 h-4" />
                            신청서 제출
                        </>
                    )}
                </Button>
            </form>
        </>
    );
}
