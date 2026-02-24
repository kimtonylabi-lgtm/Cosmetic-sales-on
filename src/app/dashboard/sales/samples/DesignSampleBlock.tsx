"use client";

import React, { useState, useCallback } from "react";
import { Plus, Trash2, Palette, Upload, FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { useBomMaster, BomMasterCategory } from "@/lib/hooks/useBomMaster";
import { Textarea } from "@/components/ui/textarea";

// ─── BOM 행 타입 ──────────────────────────────────────────────────
export interface BomRow {
    id: string;
    partName: string;       // 부품명
    materialName: string;   // 원료명
    color: string;          // 색상
    deposition: string;     // 증착
    coating: string;        // 코팅
    printing: string;       // 인쇄 및 박
}

function createEmptyRow(): BomRow {
    return {
        id: Math.random().toString(36).slice(2),
        partName: "",
        materialName: "",
        color: "",
        deposition: "",
        coating: "",
        printing: "",
    };
}

// ─── 드래그앤드롭 원고 업로더 ─────────────────────────────────────
function ArtworkUploader({
    value,
    onChange,
}: {
    value: string;
    onChange: (fileName: string) => void;
}) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) onChange(file.name);
        },
        [onChange]
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onChange(file.name);
    };

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
                "relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer",
                isDragging
                    ? "border-purple-500 bg-purple-500/10"
                    : value
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-slate-300 dark:border-slate-600 hover:border-purple-400 hover:bg-purple-500/5"
            )}
        >
            <input
                type="file"
                accept=".ai,.pdf,.psd,.png,.jpg,.svg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
            />
            {value ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <FileCheck2 className="w-4 h-4" />
                    <span className="text-xs font-semibold truncate max-w-[260px]">{value}</span>
                </div>
            ) : (
                <div className="space-y-1">
                    <Upload className="w-5 h-5 mx-auto text-slate-400" />
                    <p className="text-[11px] font-semibold text-slate-500">파일 드래그 또는 클릭</p>
                    <p className="text-[10px] text-slate-400">AI, PDF, PSD, PNG 지원</p>
                </div>
            )}
        </div>
    );
}

// ─── BOM 테이블 셀 래퍼 ──────────────────────────────────────────
function Td({
    children,
    className,
    header,
    rowSpan,
    colSpan,
}: {
    children: React.ReactNode;
    className?: string;
    header?: boolean;
    rowSpan?: number;
    colSpan?: number;
}) {
    const Tag = header ? "th" : "td";
    return (
        <Tag
            rowSpan={rowSpan}
            colSpan={colSpan}
            className={cn(
                "border border-slate-200 dark:border-slate-700 text-xs",
                header
                    ? "bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 text-center py-1.5 px-1"
                    : "p-0 align-middle",
                className
            )}
        >
            {children}
        </Tag>
    );
}

// ─── BOM 셀 자동완성 래퍼 ────────────────────────────────────────
function BomCell({
    value,
    onChange,
    category,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    category: BomMasterCategory;
    placeholder?: string;
}) {
    const { getSuggestions } = useBomMaster();
    const suggestions = getSuggestions(category, value);
    return (
        <AutocompleteInput
            value={value}
            onChange={onChange}
            suggestions={suggestions}
            placeholder={placeholder}
        />
    );
}

// ─── 디자인 샘플 전용 폼 블록 ─────────────────────────────────────
interface DesignSampleBlockProps {
    artworkFileName: string;
    onArtworkChange: (name: string) => void;
    bomRows: BomRow[];
    onBomChange: (rows: BomRow[]) => void;
    // 상단 메타 정보
    requestDate: string;
    onRequestDateChange: (v: string) => void;
    sampleNo: string;
    onSampleNoChange: (v: string) => void;
    vendorName: string;
    onVendorNameChange: (v: string) => void;
    requiredQty: string;
    onRequiredQtyChange: (v: string) => void;
    requestedDate: string;
    onRequestedDateChange: (v: string) => void;
    specimenColor: string;
    onSpecimenColorChange: (v: string) => void;
    film: string;
    onFilmChange: (v: string) => void;
    lava: string;
    onLavaChange: (v: string) => void;
    catNo: string;
    onCatNoChange: (v: string) => void;
    specialNote: string;
    onSpecialNoteChange: (v: string) => void;
}

export function DesignSampleBlock({
    artworkFileName,
    onArtworkChange,
    bomRows,
    onBomChange,
    requestDate,
    onRequestDateChange,
    sampleNo,
    onSampleNoChange,
    vendorName,
    onVendorNameChange,
    requiredQty,
    onRequiredQtyChange,
    requestedDate,
    onRequestedDateChange,
    specimenColor,
    onSpecimenColorChange,
    film,
    onFilmChange,
    lava,
    onLavaChange,
    catNo,
    onCatNoChange,
    specialNote,
    onSpecialNoteChange,
}: DesignSampleBlockProps) {
    const { getSuggestions } = useBomMaster();

    // BOM 행 업데이트 헬퍼
    const updateRow = (idx: number, field: keyof BomRow, val: string) => {
        const next = bomRows.map((row, i) =>
            i === idx ? { ...row, [field]: val } : row
        );
        onBomChange(next);
    };

    const addRow = () => onBomChange([...bomRows, createEmptyRow()]);
    const removeRow = (idx: number) =>
        onBomChange(bomRows.filter((_, i) => i !== idx));

    return (
        <div className="space-y-3 border border-purple-200 dark:border-purple-800/50 bg-purple-50/30 dark:bg-purple-950/10 rounded-2xl p-4">
            {/* 블록 헤더 */}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Palette className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                    디자인 샘플 의뢰서
                </p>
            </div>

            {/* ─── 원고 첨부 */}
            <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
                    디자인 원고 첨부
                </label>
                <ArtworkUploader value={artworkFileName} onChange={onArtworkChange} />
            </div>

            {/* ─── 상단 메타 테이블 (이미지 서식 상단부) ──────────── */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                    <tbody>
                        {/* Row 1: 의뢰일 */}
                        <tr>
                            <Td header className="w-20 whitespace-nowrap">의뢰일</Td>
                            <td colSpan={5} className="border border-slate-200 dark:border-slate-700 p-0">
                                <input
                                    type="date"
                                    value={requestDate}
                                    onChange={(e) => onRequestDateChange(e.target.value)}
                                    className="w-full h-7 px-2 text-xs bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200"
                                />
                            </td>
                        </tr>
                        {/* Row 2: 샘플No. */}
                        <tr>
                            <Td header className="whitespace-nowrap">샘플No.</Td>
                            <td colSpan={5} className="border border-slate-200 dark:border-slate-700 p-0">
                                <input
                                    type="text"
                                    value={sampleNo}
                                    onChange={(e) => onSampleNoChange(e.target.value)}
                                    placeholder="자동생성 또는 직접입력"
                                    className="w-full h-7 px-2 text-xs bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
                                />
                            </td>
                        </tr>
                        {/* Row 3: 업체명 | 필요수량 | 요청일 | 견본/색상 */}
                        <tr>
                            <Td header className="whitespace-nowrap">업체명</Td>
                            <td className="border border-slate-200 dark:border-slate-700 p-0 w-32">
                                <AutocompleteInput
                                    value={vendorName}
                                    onChange={onVendorNameChange}
                                    suggestions={getSuggestions("업체명", vendorName)}
                                    placeholder="업체명"
                                />
                            </td>
                            <Td header className="whitespace-nowrap">필요수량</Td>
                            <td className="border border-slate-200 dark:border-slate-700 p-0 w-20">
                                <input
                                    type="number"
                                    value={requiredQty}
                                    onChange={(e) => onRequiredQtyChange(e.target.value)}
                                    placeholder="수량"
                                    className="w-full h-7 px-2 text-xs bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
                                />
                            </td>
                            <Td header className="whitespace-nowrap">요청일</Td>
                            <td className="border border-slate-200 dark:border-slate-700 p-0 w-32">
                                <input
                                    type="date"
                                    value={requestedDate}
                                    onChange={(e) => onRequestedDateChange(e.target.value)}
                                    className="w-full h-7 px-2 text-xs bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200"
                                />
                            </td>
                        </tr>
                        {/* Row 4: 제품명 | Cat No. | 견본/색상 / 필름 / 라바 */}
                        <tr>
                            <Td header className="whitespace-nowrap">제품명</Td>
                            <td className="border border-slate-200 dark:border-slate-700 p-0" colSpan={1}>
                                <input
                                    type="text"
                                    value=""
                                    readOnly
                                    placeholder="(위 제품명 자동 연결)"
                                    className="w-full h-7 px-2 text-xs bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-400 placeholder:text-slate-300"
                                />
                            </td>
                            <Td header className="whitespace-nowrap">Cat No.</Td>
                            <td className="border border-slate-200 dark:border-slate-700 p-0">
                                <input
                                    type="text"
                                    value={catNo}
                                    onChange={(e) => onCatNoChange(e.target.value)}
                                    placeholder="카탈로그 번호"
                                    className="w-full h-7 px-2 text-xs bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
                                />
                            </td>
                            <Td header className="whitespace-nowrap">견본/색상</Td>
                            <td className="border border-slate-200 dark:border-slate-700 p-0">
                                <AutocompleteInput
                                    value={specimenColor}
                                    onChange={onSpecimenColorChange}
                                    suggestions={getSuggestions("색상명", specimenColor)}
                                    placeholder="견본 색상"
                                />
                            </td>
                        </tr>
                        {/* Row 5: 필름 / 라바 */}
                        <tr>
                            <Td header className="whitespace-nowrap">필름</Td>
                            <td className="border border-slate-200 dark:border-slate-700 p-0" colSpan={2}>
                                <input
                                    type="text"
                                    value={film}
                                    onChange={(e) => onFilmChange(e.target.value)}
                                    placeholder="필름 정보"
                                    className="w-full h-7 px-2 text-xs bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
                                />
                            </td>
                            <Td header className="whitespace-nowrap">라바</Td>
                            <td className="border border-slate-200 dark:border-slate-700 p-0" colSpan={2}>
                                <input
                                    type="text"
                                    value={lava}
                                    onChange={(e) => onLavaChange(e.target.value)}
                                    placeholder="라바 정보"
                                    className="w-full h-7 px-2 text-xs bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ─── BOM 테이블 (이미지 서식 하단부) ──────────────────── */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs min-w-[560px]">
                    <thead>
                        {/* 헤더 Row 1: 그룹 */}
                        <tr>
                            <Td header rowSpan={2} className="w-24">부품명</Td>
                            <Td header colSpan={2} className="text-center">사 출</Td>
                            <Td header rowSpan={2} className="w-32 text-center">증착 및 코팅</Td>
                            <Td header rowSpan={2} className="w-28 text-center">인쇄 및 박</Td>
                            <Td header rowSpan={2} className="w-8 text-center">-</Td>
                        </tr>
                        {/* 헤더 Row 2: 서브 컬럼 */}
                        <tr>
                            <Td header className="w-24 text-center">원 료 명</Td>
                            <Td header className="w-20 text-center">색 상</Td>
                        </tr>
                    </thead>
                    <tbody>
                        {bomRows.map((row, idx) => (
                            <tr key={row.id} className="group hover:bg-purple-50/50 dark:hover:bg-purple-950/20">
                                {/* 부품명 */}
                                <Td>
                                    <BomCell
                                        value={row.partName}
                                        onChange={(v) => updateRow(idx, "partName", v)}
                                        category="부품명"
                                        placeholder="부품명"
                                    />
                                </Td>
                                {/* 원료명 */}
                                <Td>
                                    <BomCell
                                        value={row.materialName}
                                        onChange={(v) => updateRow(idx, "materialName", v)}
                                        category="원료명"
                                        placeholder="원료명"
                                    />
                                </Td>
                                {/* 색상 */}
                                <Td>
                                    <BomCell
                                        value={row.color}
                                        onChange={(v) => updateRow(idx, "color", v)}
                                        category="색상명"
                                        placeholder="색상"
                                    />
                                </Td>
                                {/* 증착 및 코팅 */}
                                <Td>
                                    <BomCell
                                        value={row.deposition}
                                        onChange={(v) => updateRow(idx, "deposition", v)}
                                        category="증착명"
                                        placeholder="증착/코팅"
                                    />
                                </Td>
                                {/* 인쇄 및 박 */}
                                <Td>
                                    <BomCell
                                        value={row.printing}
                                        onChange={(v) => updateRow(idx, "printing", v)}
                                        category="인쇄명"
                                        placeholder="인쇄/박"
                                    />
                                </Td>
                                {/* 삭제 버튼 */}
                                <Td className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => removeRow(idx)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-rose-100 dark:hover:bg-rose-900"
                                    >
                                        <Trash2 className="w-3 h-3 text-rose-400" />
                                    </button>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 행 추가 버튼 */}
            <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-500 hover:text-purple-700 transition-colors"
            >
                <Plus className="w-3.5 h-3.5" />
                BOM 행 추가
            </button>

            {/* ─── 특이사항 */}
            <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
                    특이사항
                </label>
                <Textarea
                    value={specialNote}
                    onChange={(e) => onSpecialNoteChange(e.target.value)}
                    placeholder="특이사항을 입력하세요. (로고 위치, 폰트 규정, 조색 기준 등)"
                    className="min-h-[80px] text-xs resize-none bg-white dark:bg-slate-900"
                />
            </div>
        </div>
    );
}

// ─── 기본 BOM 행 세트 익스포트 ───────────────────────────────────
export const DEFAULT_BOM_ROWS: BomRow[] = Array.from({ length: 6 }, createEmptyRow);
