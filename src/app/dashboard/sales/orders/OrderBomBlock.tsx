"use client";

import React, { useState, useCallback } from "react";
import { Plus, Trash2, FileText, Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { useBomMaster, BomMasterCategory } from "@/lib/hooks/useBomMaster";
import { Textarea } from "@/components/ui/textarea";

// ─── BOM 행 타입 ─────────────────────────────────────────────────
// ─── BOM 행 타입 ─────────────────────────────────────────────────
export interface OrderBomRow {
    id: string;
    partName: string;       // 부품명
    materialName: string;   // 원료명
    color: string;          // 색상
    deposition: string;     // 증착 및 코팅
    printing: string;       // 인쇄 및 박
}

function createEmptyBomRow(): OrderBomRow {
    return {
        id: Math.random().toString(36).slice(2),
        partName: "",
        materialName: "",
        color: "",
        deposition: "",
        printing: "",
    };
}

export const DEFAULT_ORDER_BOM_ROWS: OrderBomRow[] = Array.from({ length: 8 }, createEmptyBomRow);

// ─── 테이블 헤더/데이터 셀 래퍼 ──────────────────────────────────
function Td({
    children,
    className,
    header,
    rowSpan,
    colSpan,
}: {
    children?: React.ReactNode;
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
                "border border-slate-300 dark:border-slate-600 text-xs",
                header
                    ? "bg-slate-200 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-200 text-center py-1.5 px-1 whitespace-nowrap"
                    : "p-0 align-middle",
                className
            )}
        >
            {children}
        </Tag>
    );
}

// ─── 텍스트 입력 셀 ───────────────────────────────────────────────
function TextCell({
    value,
    onChange,
    placeholder,
    type = "text",
    className,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    className?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
                "w-full h-7 px-2 text-xs bg-transparent border-0 focus:outline-none focus:ring-0",
                "text-slate-800 dark:text-slate-100 placeholder:text-slate-300",
                className
            )}
        />
    );
}

// ─── BOM 자동완성 셀 ──────────────────────────────────────────────
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

// ─── 토글 체크 셀 (견본유무 / 필름유무 / 라바유무) ──────────────
function ToggleCell({
    label,
    value,
    onChange,
}: {
    label: string;
    value: "있음" | "없음" | "";
    onChange: (v: "있음" | "없음") => void;
}) {
    return (
        <div className="flex items-center gap-1 justify-center py-1 px-1">
            <button
                type="button"
                onClick={() => onChange("있음")}
                className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold border transition-all",
                    value === "있음"
                        ? "bg-teal-500 border-teal-500 text-white"
                        : "border-slate-300 dark:border-slate-600 text-slate-400 hover:border-teal-400"
                )}
            >
                있음
            </button>
            <button
                type="button"
                onClick={() => onChange("없음")}
                className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold border transition-all",
                    value === "없음"
                        ? "bg-slate-500 border-slate-500 text-white"
                        : "border-slate-300 dark:border-slate-600 text-slate-400 hover:border-slate-500"
                )}
            >
                없음
            </button>
        </div>
    );
}

// ─── 작업 견본 사진 업로더 ────────────────────────────────────────
function WorkPhotoUploader({
    photos,
    onAdd,
    onRemove,
}: {
    photos: string[];
    onAdd: (name: string, dataUrl: string) => void;
    onRemove: (idx: number) => void;
}) {
    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                onAdd(file.name, ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    };

    return (
        <div className="space-y-2">
            {/* 업로드 버튼 영역 */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 cursor-pointer hover:border-teal-400 hover:bg-teal-500/5 transition-all">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFiles}
                />
                <ImageIcon className="w-7 h-7 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-500">작업 견본 사진 업로드</p>
                <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP 지원 (복수 선택 가능)</p>
            </label>

            {/* 미리보기 그리드 */}
            {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {photos.map((dataUrl, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square bg-slate-50 dark:bg-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={dataUrl} alt={`작업견본 ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => onRemove(idx)}
                                className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X className="w-3 h-3 text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── 발주 상세 블록 Props ─────────────────────────────────────────
// ─── 발주 상세 블록 Props ─────────────────────────────────────────
export interface OrderBomBlockMeta {
    orderDate: string;
    orderNo: string;
    clientName: string;
    orderType: "내수" | "수출" | "";
    orderQty: string;
    expectedShipDate: string;
    productNameTaesung: string;
    productNameClient: string;
    receivingPlace: string;
    catNo: string;
    printName: string;
    hasSample: "있음" | "없음" | "";
    hasFilm: "있음" | "없음" | "";
    hasLava: "있음" | "없음" | "";
    specialNote: string;
    bomRows: OrderBomRow[];
    workPhotos: string[];  // base64 dataUrl 배열
}

export const INITIAL_ORDER_BOM_META: OrderBomBlockMeta = {
    orderDate: new Date().toISOString().slice(0, 10),
    orderNo: "",
    clientName: "",
    orderType: "",
    orderQty: "",
    expectedShipDate: "",
    productNameTaesung: "",
    productNameClient: "",
    receivingPlace: "",
    catNo: "",
    printName: "",
    hasSample: "",
    hasFilm: "",
    hasLava: "",
    specialNote: "",
    bomRows: DEFAULT_ORDER_BOM_ROWS,
    workPhotos: [],
};

// ─── 메인 발주 상세 블록 컴포넌트 ────────────────────────────────
interface OrderBomBlockProps {
    meta: OrderBomBlockMeta;
    onChange: <K extends keyof OrderBomBlockMeta>(key: K, value: OrderBomBlockMeta[K]) => void;
}

export function OrderBomBlock({ meta, onChange }: OrderBomBlockProps) {
    const { getSuggestions } = useBomMaster();

    // BOM 행 업데이트
    const updateBomRow = (idx: number, field: keyof OrderBomRow, val: string) => {
        const next = meta.bomRows.map((row, i) =>
            i === idx ? { ...row, [field]: val } : row
        );
        onChange("bomRows", next);
    };

    const addBomRow = () => onChange("bomRows", [...meta.bomRows, createEmptyBomRow()]);
    const removeBomRow = (idx: number) => onChange("bomRows", meta.bomRows.filter((_, i) => i !== idx));

    // 작업 견본 사진
    const addPhoto = (_name: string, dataUrl: string) => {
        onChange("workPhotos", [...meta.workPhotos, dataUrl]);
    };
    const removePhoto = (idx: number) => {
        onChange("workPhotos", meta.workPhotos.filter((_, i) => i !== idx));
    };

    return (
        <div className="space-y-4">
            {/* ─── 상단 메타 테이블 ────────────────────────────────── */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                    <tbody>
                        {/* Row 1: 발주일 */}
                        <tr>
                            <Td header className="w-20">발주일</Td>
                            <td colSpan={7} className="border border-slate-300 dark:border-slate-600 p-0">
                                <TextCell value={meta.orderDate} onChange={(v) => onChange("orderDate", v)} type="date" />
                            </td>
                        </tr>
                        {/* Row 2: 발주No. */}
                        <tr>
                            <Td header>발주No.</Td>
                            <td colSpan={7} className="border border-slate-300 dark:border-slate-600 p-0">
                                <TextCell value={meta.orderNo} onChange={(v) => onChange("orderNo", v)} placeholder="자동생성 또는 직접입력" />
                            </td>
                        </tr>
                        {/* Row 3: 발주처 | 내수/수출 | 발주수량 | 출고예정일 */}
                        <tr>
                            <Td header>발주처</Td>
                            <td className="border border-slate-300 dark:border-slate-600 p-0 w-32">
                                <AutocompleteInput
                                    value={meta.clientName}
                                    onChange={(v) => onChange("clientName", v)}
                                    suggestions={getSuggestions("발주처", meta.clientName)}
                                    placeholder="발주처"
                                />
                            </td>
                            {/* 내수/수출 토글 */}
                            <td className="border border-slate-300 dark:border-slate-600 p-0 w-20">
                                <div className="flex flex-col gap-0.5 py-0.5 px-1">
                                    {(["내수", "수출"] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => onChange("orderType", t)}
                                            className={cn(
                                                "text-[10px] font-bold rounded px-1 py-0.5 transition-all border",
                                                meta.orderType === t
                                                    ? "bg-ocean-teal border-ocean-teal text-white"
                                                    : "border-slate-300 dark:border-slate-600 text-slate-400"
                                            )}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </td>
                            <Td header>발주수량</Td>
                            <td className="border border-slate-300 dark:border-slate-600 p-0 w-24">
                                <TextCell value={meta.orderQty} onChange={(v) => onChange("orderQty", v)} placeholder="수량" type="number" />
                            </td>
                            <Td header className="whitespace-nowrap">출고<br />예정일</Td>
                            <td className="border border-slate-300 dark:border-slate-600 p-0 w-36" colSpan={2}>
                                <TextCell value={meta.expectedShipDate} onChange={(v) => onChange("expectedShipDate", v)} type="date" />
                            </td>
                        </tr>
                        {/* Row 4: 제품명 (태성측 / 업체측) | 입고처 | Cat No. */}
                        <tr>
                            <Td header rowSpan={2}>제품명</Td>
                            <Td header className="w-16">태성측</Td>
                            <td colSpan={2} className="border border-slate-300 dark:border-slate-600 p-0">
                                <AutocompleteInput
                                    value={meta.productNameTaesung}
                                    onChange={(v) => onChange("productNameTaesung", v)}
                                    suggestions={getSuggestions("제품명", meta.productNameTaesung)}
                                    placeholder="태성측 제품명"
                                />
                            </td>
                            <Td header>입고처</Td>
                            <td colSpan={3} className="border border-slate-300 dark:border-slate-600 p-0">
                                <AutocompleteInput
                                    value={meta.receivingPlace}
                                    onChange={(v) => onChange("receivingPlace", v)}
                                    suggestions={getSuggestions("입고처", meta.receivingPlace)}
                                    placeholder="입고처"
                                />
                            </td>
                        </tr>
                        <tr>
                            <Td header className="w-16">업체측</Td>
                            <td colSpan={2} className="border border-slate-300 dark:border-slate-600 p-0">
                                <AutocompleteInput
                                    value={meta.productNameClient}
                                    onChange={(v) => onChange("productNameClient", v)}
                                    suggestions={getSuggestions("제품명", meta.productNameClient)}
                                    placeholder="업체측 제품명"
                                />
                            </td>
                            <Td header>Cat No.</Td>
                            <td colSpan={3} className="border border-slate-300 dark:border-slate-600 p-0">
                                <TextCell value={meta.catNo} onChange={(v) => onChange("catNo", v)} placeholder="카탈로그 번호" />
                            </td>
                        </tr>
                        {/* Row 5: 인쇄명 | 견본유무 | 필름유무 | 라바유무 */}
                        <tr>
                            <Td header>인쇄명</Td>
                            <td colSpan={2} className="border border-slate-300 dark:border-slate-600 p-0">
                                <BomCell
                                    value={meta.printName}
                                    onChange={(v) => onChange("printName", v)}
                                    category="인쇄명"
                                    placeholder="인쇄 방식"
                                />
                            </td>
                            <Td header>견본유무</Td>
                            <td className="border border-slate-300 dark:border-slate-600 p-0">
                                <ToggleCell label="" value={meta.hasSample} onChange={(v) => onChange("hasSample", v)} />
                            </td>
                            <Td header>필름유무</Td>
                            <td className="border border-slate-300 dark:border-slate-600 p-0">
                                <ToggleCell label="" value={meta.hasFilm} onChange={(v) => onChange("hasFilm", v)} />
                            </td>
                        </tr>
                        {/* Row 6: 라바유무 단독 */}
                        <tr>
                            <Td header colSpan={5}></Td>
                            <Td header>라바유무</Td>
                            <td className="border border-slate-300 dark:border-slate-600 p-0" colSpan={2}>
                                <ToggleCell label="" value={meta.hasLava} onChange={(v) => onChange("hasLava", v)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ─── BOM 테이블 ──────────────────────────────────────── */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs min-w-[580px]">
                    <thead>
                        <tr>
                            <Td header rowSpan={2} className="w-28">부품명</Td>
                            <Td header colSpan={2} className="text-center">사 출</Td>
                            <Td header rowSpan={2} className="w-36 text-center">증착 및 코팅</Td>
                            <Td header rowSpan={2} className="w-32 text-center">인쇄 및 박</Td>
                            <Td header rowSpan={2} className="w-8 text-center">-</Td>
                        </tr>
                        <tr>
                            <Td header className="w-28 text-center">원 료 명</Td>
                            <Td header className="w-22 text-center">색 상</Td>
                        </tr>
                    </thead>
                    <tbody>
                        {meta.bomRows.map((row, idx) => (
                            <tr key={row.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                                <Td>
                                    <BomCell value={row.partName} onChange={(v) => updateBomRow(idx, "partName", v)} category="부품명" placeholder="부품명" />
                                </Td>
                                <Td>
                                    <BomCell value={row.materialName} onChange={(v) => updateBomRow(idx, "materialName", v)} category="원료명" placeholder="원료명" />
                                </Td>
                                <Td>
                                    <BomCell value={row.color} onChange={(v) => updateBomRow(idx, "color", v)} category="색상명" placeholder="색상" />
                                </Td>
                                <Td>
                                    <BomCell value={row.deposition} onChange={(v) => updateBomRow(idx, "deposition", v)} category="증착명" placeholder="증착/코팅" />
                                </Td>
                                <Td>
                                    <BomCell value={row.printing} onChange={(v) => updateBomRow(idx, "printing", v)} category="인쇄명" placeholder="인쇄/박" />
                                </Td>
                                <Td className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => removeBomRow(idx)}
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
            <button type="button" onClick={addBomRow} className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-500 hover:text-teal-700 transition-colors">
                <Plus className="w-3.5 h-3.5" />BOM 행 추가
            </button>

            {/* ─── 특이사항 ─────────────────────────────────────────── */}
            <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
                    특이사항
                </label>
                <Textarea
                    value={meta.specialNote}
                    onChange={(e) => onChange("specialNote", e.target.value)}
                    placeholder="특이사항을 입력하세요."
                    className="min-h-[80px] text-xs resize-none"
                />
            </div>

            {/* ─── 작업 견본 사진 ───────────────────────────────────── */}
            <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
                    작업 견본 사진
                </label>
                <WorkPhotoUploader
                    photos={meta.workPhotos}
                    onAdd={addPhoto}
                    onRemove={removePhoto}
                />
            </div>
        </div>
    );
}
