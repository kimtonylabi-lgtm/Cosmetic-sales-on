"use client";

import React, { useState, useCallback } from "react";
import {
    Plus, Trash2, FileText, Eye, Printer, FileEdit, CheckCircle2, ArrowRight,
} from "lucide-react";
import { MOCK_QUOTES, Quote, QuoteItem, PostProcessing, QuoteStatus } from "@/lib/mock/quotes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { cn } from "@/lib/utils";
import { useBomMaster } from "@/lib/hooks/useBomMaster";
import { QuoteBomBlock, QuoteBomBlockMeta, INITIAL_QUOTE_BOM_META } from "./QuoteBomBlock";

// ─── 유틸 ────────────────────────────────────────────────────────
const STATUS_STYLE: Record<QuoteStatus, string> = {
    작성중: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    발송: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    승인: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    반려: "bg-red-500/15 text-red-400 border-red-500/30",
};

const fmtNum = (n: number) => new Intl.NumberFormat("ko-KR").format(n);
const stripCom = (s: string) => s.replace(/,/g, "");
const addCom = (s: string) => { const n = parseInt(stripCom(s), 10); return isNaN(n) ? "" : fmtNum(n); };
const toNum = (v: number | "") => (v === "" ? 0 : v);

/** 총 단가 합계 = Σ(단가) + Σ(후가공단가) */
const calcTotal = (items: QuoteItem[]) =>
    items.reduce((s, i) => s + toNum(i.unitPrice) + toNum(i.postProcessing.postPrice), 0);

// ─── 단가 입력 훅 (빈 셀 시작 + 천단위 콤마) ─────────────────────
function usePriceInput(initial: number | "") {
    const [display, setDisplay] = useState<string>(
        initial === "" ? "" : fmtNum(initial as number)
    );

    const handleChange = (val: string, onUpdate: (v: number | "") => void) => {
        const raw = stripCom(val);
        setDisplay(val);
        if (raw === "") { onUpdate(""); return; }
        const n = parseInt(raw, 10);
        if (!isNaN(n)) onUpdate(n);
    };

    const handleBlur = (current: number | "") => {
        setDisplay(current === "" ? "" : fmtNum(current as number));
    };

    return { display, handleChange, handleBlur };
}

// ─── 단가 셀 컴포넌트 ─────────────────────────────────────────────
function PriceCell({
    value,
    onChange,
    placeholder = "단가",
    className,
}: {
    value: number | "";
    onChange: (v: number | "") => void;
    placeholder?: string;
    className?: string;
}) {
    const [display, setDisplay] = useState<string>(value === "" ? "" : fmtNum(value as number));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = stripCom(e.target.value);
        setDisplay(e.target.value);
        if (raw === "") { onChange(""); return; }
        const n = parseInt(raw, 10);
        if (!isNaN(n)) onChange(n);
    };

    const handleBlur = () => {
        setDisplay(value === "" ? "" : fmtNum(value as number));
    };

    return (
        <Input
            value={display}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={cn("h-8 text-sm text-right", className)}
        />
    );
}

// ─── 빈 후가공 생성 ───────────────────────────────────────────────
const emptyPost = (): PostProcessing => ({ deposition: "", coating: "", printing: "", postPrice: "" });

// ─── 빈 품목 행 생성 ─────────────────────────────────────────────
function createEmptyItem(): QuoteItem {
    return {
        id: `qi-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        partName: "", material: "", color: "",
        postProcessing: emptyPost(),
        unitPrice: "",
    };
}

// ─── 품목 행 컴포넌트 ─────────────────────────────────────────────
function QuoteFormRow({
    item, onChange, onDelete,
}: {
    item: QuoteItem;
    onChange: (updated: QuoteItem) => void;
    onDelete: () => void;
}) {
    const { getSuggestions } = useBomMaster();

    const set = <K extends keyof QuoteItem>(field: K, val: QuoteItem[K]) =>
        onChange({ ...item, [field]: val });

    const setPost = <K extends keyof PostProcessing>(field: K, val: PostProcessing[K]) =>
        onChange({ ...item, postProcessing: { ...item.postProcessing, [field]: val } });

    // AutocompleteInput 공통 스타일
    const acCls = "h-8 text-sm px-2 border border-input rounded-md w-full bg-background focus:ring-1 focus:ring-ring";

    return (
        <tr className="group border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
            {/* 부품명 */}
            <td className="py-1.5 pr-1.5 min-w-[100px]">
                <AutocompleteInput value={item.partName} onChange={(v) => set("partName", v)}
                    suggestions={getSuggestions("부품명", item.partName)} placeholder="부품명" inputClassName={acCls} />
            </td>
            {/* 재질 */}
            <td className="py-1.5 pr-1.5 min-w-[80px]">
                <AutocompleteInput value={item.material} onChange={(v) => set("material", v)}
                    suggestions={getSuggestions("원료명", item.material)} placeholder="재질" inputClassName={acCls} />
            </td>
            {/* 색상 */}
            <td className="py-1.5 pr-1.5 min-w-[70px]">
                <AutocompleteInput value={item.color} onChange={(v) => set("color", v)}
                    suggestions={getSuggestions("색상명", item.color)} placeholder="색상" inputClassName={acCls} />
            </td>
            {/* 증착 */}
            <td className="py-1.5 pr-1.5 min-w-[90px]">
                <AutocompleteInput value={item.postProcessing.deposition} onChange={(v) => setPost("deposition", v)}
                    suggestions={getSuggestions("증착명", item.postProcessing.deposition)} placeholder="증착" inputClassName={acCls} />
            </td>
            {/* 코팅 */}
            <td className="py-1.5 pr-1.5 min-w-[90px]">
                <AutocompleteInput value={item.postProcessing.coating} onChange={(v) => setPost("coating", v)}
                    suggestions={getSuggestions("코팅명", item.postProcessing.coating)} placeholder="코팅" inputClassName={acCls} />
            </td>
            {/* 인쇄 */}
            <td className="py-1.5 pr-1.5 min-w-[90px]">
                <AutocompleteInput value={item.postProcessing.printing} onChange={(v) => setPost("printing", v)}
                    suggestions={getSuggestions("인쇄명", item.postProcessing.printing)} placeholder="인쇄" inputClassName={acCls} />
            </td>
            {/* 후가공 단가 */}
            <td className="py-1.5 pr-1.5 min-w-[90px]">
                <PriceCell value={item.postProcessing.postPrice} onChange={(v) => setPost("postPrice", v)} placeholder="후가공 단가" />
            </td>
            {/* 단가 */}
            <td className="py-1.5 pr-1.5 min-w-[90px]">
                <PriceCell value={item.unitPrice} onChange={(v) => set("unitPrice", v)} placeholder="단가" />
            </td>
            {/* 삭제 */}
            <td className="py-1.5 text-center">
                <button onClick={onDelete}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </td>
        </tr>
    );
}

// ─── PDF 미리보기 ─────────────────────────────────────────────────
function QuotePreview({ quote }: { quote: Quote }) {
    const total = calcTotal(quote.items);
    return (
        <div className="bg-white text-slate-900 p-8 rounded-lg print:p-0">
            <div className="border-b-2 border-slate-900 pb-6 mb-6 flex justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">견 적 서</h2>
                    <p className="text-sm text-slate-500 mt-1">COSMETIC SALES ON</p>
                </div>
                <div className="text-right text-sm text-slate-600 space-y-0.5">
                    <p><span className="font-semibold">견적번호:</span> {quote.quoteNo}</p>
                    <p><span className="font-semibold">작성일:</span> {quote.createdAt}</p>
                    <p><span className="font-semibold">유효기간:</span> {quote.validUntil}</p>
                </div>
            </div>
            <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
                <div><p className="text-slate-500 text-xs font-semibold mb-0.5">수신</p><p className="text-base font-bold">{quote.customerName} 귀중</p></div>
                <div><p className="text-slate-500 text-xs font-semibold mb-0.5">제품명</p><p className="font-semibold">{quote.productName || "—"}</p></div>
                <div><p className="text-slate-500 text-xs font-semibold mb-0.5">MOQ</p><p className="font-semibold">{quote.moq ? `${quote.moq} 개` : "—"}</p></div>
            </div>
            <p className="text-sm text-slate-500 mb-4">아래와 같이 견적서를 제출합니다.</p>
            <table className="w-full text-sm mb-6 border-collapse">
                <thead>
                    <tr className="bg-slate-100">
                        <th rowSpan={2} className="border border-slate-300 px-2 py-1.5 text-left">부품명</th>
                        <th rowSpan={2} className="border border-slate-300 px-2 py-1.5 text-left">재질</th>
                        <th rowSpan={2} className="border border-slate-300 px-2 py-1.5 text-left">색상</th>
                        <th colSpan={4} className="border border-slate-300 px-2 py-1.5 text-center">후가공</th>
                        <th rowSpan={2} className="border border-slate-300 px-2 py-1.5 text-right">단가</th>
                    </tr>
                    <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-2 py-1 text-center text-xs">증착</th>
                        <th className="border border-slate-300 px-2 py-1 text-center text-xs">코팅</th>
                        <th className="border border-slate-300 px-2 py-1 text-center text-xs">인쇄</th>
                        <th className="border border-slate-300 px-2 py-1 text-right text-xs">후가공단가</th>
                    </tr>
                </thead>
                <tbody>
                    {quote.items.map((item) => (
                        <tr key={item.id}>
                            <td className="border border-slate-300 px-2 py-1.5">{item.partName}</td>
                            <td className="border border-slate-300 px-2 py-1.5 text-slate-500">{item.material}</td>
                            <td className="border border-slate-300 px-2 py-1.5 text-slate-500">{item.color}</td>
                            <td className="border border-slate-300 px-2 py-1.5 text-slate-500 text-xs">{item.postProcessing.deposition || "—"}</td>
                            <td className="border border-slate-300 px-2 py-1.5 text-slate-500 text-xs">{item.postProcessing.coating || "—"}</td>
                            <td className="border border-slate-300 px-2 py-1.5 text-slate-500 text-xs">{item.postProcessing.printing || "—"}</td>
                            <td className="border border-slate-300 px-2 py-1.5 text-right text-xs">
                                {item.postProcessing.postPrice !== "" ? fmtNum(item.postProcessing.postPrice as number) : "—"}
                            </td>
                            <td className="border border-slate-300 px-2 py-1.5 text-right font-semibold">
                                {item.unitPrice !== "" ? fmtNum(item.unitPrice as number) : "—"}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-slate-50">
                        <td colSpan={7} className="border border-slate-300 px-2 py-2 text-right font-bold">총 단가 합계 (단가 + 후가공단가)</td>
                        <td className="border border-slate-300 px-2 py-2 text-right font-black text-ocean-teal">{fmtNum(total)}</td>
                    </tr>
                </tfoot>
            </table>
            {quote.note && (
                <div className="text-sm text-slate-600 border-t pt-4">
                    <span className="font-semibold">비고:</span> {quote.note}
                </div>
            )}
        </div>
    );
}

// ─── 발주 상세 배지 ───────────────────────────────────────────────
function BomSpecSummary({ meta, onEdit }: { meta: QuoteBomBlockMeta; onEdit: () => void }) {
    const filledRows = meta.bomRows.filter((r) => r.partName.trim()).length;
    const hasFilled = filledRows > 0 || meta.clientName || meta.productNameTaesung;
    return (
        <div onClick={onEdit} className={cn(
            "rounded-xl border-2 p-3 flex items-center justify-between gap-3 cursor-pointer group transition-all",
            hasFilled
                ? "border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500"
                : "border-teal-300/60 bg-teal-50/50 dark:bg-teal-950/20 hover:border-teal-400 border-dashed"
        )}>
            <div className="flex items-center gap-2.5">
                {hasFilled ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <FileEdit className="w-5 h-5 text-teal-400 shrink-0" />}
                <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{hasFilled ? "발주 상세 작성됨" : "발주 상세 미작성"}</p>
                    <p className="text-[11px] text-slate-500">
                        {hasFilled ? `BOM ${filledRows}개 · 발주처: ${meta.clientName || "미입력"} · 사진 ${meta.workPhotos.length}장` : "클릭하여 발주 BOM 상세 입력"}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-300 group-hover:gap-2 transition-all">
                {hasFilled ? "수정" : "입력"}<ArrowRight className="w-3.5 h-3.5" />
            </div>
        </div>
    );
}

// ─── MOQ 입력 ─────────────────────────────────────────────────────
function MoqInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [raw, setRaw] = useState(value);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const s = stripCom(e.target.value);
        setRaw(s);
        const n = parseInt(s, 10);
        onChange(isNaN(n) ? "" : fmtNum(n));
    };
    const handleBlur = () => {
        const n = parseInt(stripCom(raw), 10);
        setRaw(isNaN(n) ? "" : fmtNum(n));
    };
    return <Input value={raw} onChange={handleChange} onBlur={handleBlur} placeholder="예: 30,000" className="mt-1" />;
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
export default function SalesQuotesPage() {
    const { bulkSaveToMaster, getSuggestions } = useBomMaster();
    const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
    const [previewQuote, setPreviewQuote] = useState<Quote | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [productName, setProductName] = useState("");
    const [moq, setMoq] = useState("");
    const [validUntil, setValidUntil] = useState("");
    const [note, setNote] = useState("");
    const [editItems, setEditItems] = useState<QuoteItem[]>([createEmptyItem()]);
    const [bomSheetOpen, setBomSheetOpen] = useState(false);
    const [bomMeta, setBomMeta] = useState<QuoteBomBlockMeta>(INITIAL_QUOTE_BOM_META);

    const openCreate = () => {
        setEditItems([createEmptyItem()]);
        setBomMeta({ ...INITIAL_QUOTE_BOM_META, orderDate: new Date().toISOString().slice(0, 10) });
        setCustomerName(""); setProductName(""); setMoq(""); setValidUntil(""); setNote("");
        setIsCreateOpen(true);
    };

    const addRow = () => setEditItems((p) => [...p, createEmptyItem()]);
    const updateRow = (id: string, updated: QuoteItem) =>
        setEditItems((p) => p.map((i) => i.id === id ? updated : i));
    const deleteRow = (id: string) => setEditItems((p) => p.filter((i) => i.id !== id));

    const priceTotal = calcTotal(editItems);

    const updateBomMeta = useCallback(<K extends keyof QuoteBomBlockMeta>(key: K, value: QuoteBomBlockMeta[K]) => {
        setBomMeta((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSave = () => {
        bulkSaveToMaster({ 발주처: [bomMeta.clientName], 입고처: [bomMeta.receivingPlace], 제품명: [productName, bomMeta.productNameTaesung, bomMeta.productNameClient] });
        editItems.forEach((item) => {
            bulkSaveToMaster({
                부품명: [item.partName], 원료명: [item.material], 색상명: [item.color],
                증착명: [item.postProcessing.deposition],
                코팅명: [item.postProcessing.coating],
                인쇄명: [item.postProcessing.printing],
            });
        });
        bomMeta.bomRows.forEach((row) => {
            bulkSaveToMaster({ 부품명: [row.partName], 원료명: [row.materialName], 색상명: [row.color], 증착명: [row.deposition], 인쇄명: [row.printing] });
        });
        const newQuote: Quote = {
            id: `q${Date.now()}`,
            quoteNo: `QT-2026-${String(quotes.length + 43).padStart(4, "0")}`,
            customerName: customerName || bomMeta.clientName || "미입력",
            productName, moq, status: "작성중", items: editItems, note,
            createdAt: new Date().toISOString().slice(0, 10), validUntil,
        };
        setQuotes((p) => [newQuote, ...p]);
        setIsCreateOpen(false);
    };

    return (
        <div className="space-y-6 pb-10">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">견적관리</h1>
                    <p className="text-slate-400 mt-1 text-sm">견적서를 작성하고 PDF로 미리봅니다.</p>
                </div>
                <Button onClick={openCreate} className="bg-ocean-teal hover:bg-ocean-dark gap-2">
                    <Plus className="w-4 h-4" /> 새 견적서
                </Button>
            </div>

            {/* 목록 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>견적번호</TableHead>
                            <TableHead>고객사</TableHead>
                            <TableHead>제품명</TableHead>
                            <TableHead>MOQ</TableHead>
                            <TableHead>총 단가 합계</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead>작성일</TableHead>
                            <TableHead className="text-right">보기</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quotes.map((q) => (
                            <TableRow key={q.id}>
                                <TableCell className="font-mono text-sm">{q.quoteNo}</TableCell>
                                <TableCell className="font-semibold">{q.customerName}</TableCell>
                                <TableCell className="text-sm text-slate-500">{q.productName || "—"}</TableCell>
                                <TableCell className="text-sm">{q.moq ? `${q.moq} 개` : "—"}</TableCell>
                                <TableCell className="font-bold text-ocean-teal">{fmtNum(calcTotal(q.items))} 원</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("text-xs", STATUS_STYLE[q.status])}>{q.status}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-slate-400">{q.createdAt}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setPreviewQuote(q)} className="gap-1 text-xs">
                                        <Eye className="w-3 h-3" /> 미리보기
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* PDF 미리보기 */}
            <Dialog open={!!previewQuote} onOpenChange={(o) => !o && setPreviewQuote(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-ocean-teal" />
                            견적서 미리보기 — {previewQuote?.quoteNo}
                        </DialogTitle>
                    </DialogHeader>
                    {previewQuote && <QuotePreview quote={previewQuote} />}
                    <div className="flex justify-end pt-2">
                        <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                            <Printer className="w-4 h-4" /> 인쇄
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 좌측 BOM Sheet */}
            <Sheet open={bomSheetOpen} onOpenChange={setBomSheetOpen}>
                <SheetContent side="left" className="w-full max-w-3xl sm:max-w-3xl p-0 flex flex-col">
                    <SheetHeader className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-teal-50 to-slate-50 dark:from-teal-950/30 dark:to-slate-900">
                        <SheetTitle className="flex items-center gap-2.5 text-base font-bold">
                            <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center">
                                <FileEdit className="w-4 h-4 text-teal-600" />
                            </div>
                            발주 상세 입력
                            <span className="text-xs font-normal text-slate-400 ml-1">— BOM / 특이사항 / 작업사진</span>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <QuoteBomBlock meta={bomMeta} onChange={updateBomMeta} />
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-900 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setBomSheetOpen(false)}>취소</Button>
                        <Button type="button" className="flex-1 bg-ocean-teal hover:bg-teal-700 text-white font-bold gap-2" onClick={() => setBomSheetOpen(false)}>
                            <CheckCircle2 className="w-4 h-4" /> 발주 상세 저장
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* 새 견적서 Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-ocean-teal" />
                            새 견적서 작성
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5">
                        {/* 기본 정보 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-bold">고객사</Label>
                                <Input className="mt-1" placeholder="고객사명" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                            </div>
                            <div>
                                <Label className="text-xs font-bold">유효기간</Label>
                                <Input className="mt-1" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                            </div>
                            <div>
                                <Label className="text-xs font-bold">제품명</Label>
                                <div className="mt-1">
                                    <AutocompleteInput
                                        value={productName} onChange={setProductName}
                                        suggestions={getSuggestions("제품명", productName)}
                                        placeholder="제품명 입력"
                                        inputClassName="h-9 text-sm px-3 border border-input rounded-md w-full bg-background focus:ring-1 focus:ring-ring"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs font-bold">MOQ</Label>
                                <MoqInput value={moq} onChange={setMoq} />
                            </div>
                        </div>

                        {/* 품목 테이블 — 2행 헤더 */}
                        <div>
                            <Label className="mb-2 block text-xs font-bold">품목</Label>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm min-w-[760px]">
                                    <thead>
                                        {/* 헤더 1행 */}
                                        <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                            <th rowSpan={2} className="pb-2 pt-2 px-1.5 text-left font-semibold border-r border-slate-200 dark:border-slate-700 align-middle">부품명</th>
                                            <th rowSpan={2} className="pb-2 pt-2 px-1.5 text-left font-semibold border-r border-slate-200 dark:border-slate-700 align-middle">재질</th>
                                            <th rowSpan={2} className="pb-2 pt-2 px-1.5 text-left font-semibold border-r border-slate-200 dark:border-slate-700 align-middle">색상</th>
                                            <th colSpan={4} className="py-1.5 px-1.5 text-center font-semibold border-r border-b border-slate-200 dark:border-slate-700">
                                                <span className="text-purple-600 dark:text-purple-400">후 가 공</span>
                                            </th>
                                            <th rowSpan={2} className="pb-2 pt-2 px-1.5 text-right font-semibold align-middle">단가 (원)</th>
                                            <th rowSpan={2} className="w-8 align-middle" />
                                        </tr>
                                        {/* 헤더 2행 — 후가공 서브컬럼 */}
                                        <tr className="text-xs text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                            <th className="py-1 px-1.5 text-left font-medium">증착</th>
                                            <th className="py-1 px-1.5 text-left font-medium">코팅</th>
                                            <th className="py-1 px-1.5 text-left font-medium">인쇄</th>
                                            <th className="py-1 px-1.5 text-right font-medium border-r border-slate-200 dark:border-slate-700">후가공 단가</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {editItems.map((item) => (
                                            <QuoteFormRow
                                                key={item.id}
                                                item={item}
                                                onChange={(updated) => updateRow(item.id, updated)}
                                                onDelete={() => deleteRow(item.id)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button onClick={addRow} className="mt-3 flex items-center gap-1.5 text-xs text-ocean-teal hover:underline font-semibold">
                                <Plus className="w-3.5 h-3.5" /> 행 추가
                            </button>
                        </div>

                        {/* 총 단가 합계 */}
                        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-right">
                                <p className="text-xs text-slate-400">총 단가 합계 (단가 + 후가공 단가)</p>
                                <p className="text-2xl font-black text-ocean-teal">{fmtNum(priceTotal)} 원</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{editItems.length}개 부품</p>
                            </div>
                        </div>

                        {/* 비고 */}
                        <div>
                            <Label className="text-xs font-bold">비고</Label>
                            <Input className="mt-1" placeholder="특이사항, 조건 등" value={note} onChange={(e) => setNote(e.target.value)} />
                        </div>

                        {/* 발주 상세 BOM */}
                        <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">발주 상세 (BOM / 작업사진)</p>
                            <BomSpecSummary meta={bomMeta} onEdit={() => setBomSheetOpen(true)} />
                            <Button type="button" variant="outline"
                                className="w-full border-teal-300 text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/30 font-semibold gap-2 h-9"
                                onClick={() => setBomSheetOpen(true)}>
                                <FileEdit className="w-3.5 h-3.5" /> 발주 상세 전체 입력 →
                            </Button>
                        </div>

                        {/* 저장 */}
                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSave} className="bg-ocean-teal hover:bg-ocean-dark gap-2">
                                <CheckCircle2 className="w-4 h-4" /> 견적서 저장
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
