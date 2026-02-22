"use client";

import React, { useState } from "react";
import {
    Plus, Trash2, FileText, Eye, X, Printer
} from "lucide-react";
import { MOCK_QUOTES, Quote, QuoteItem, QuoteStatus } from "@/lib/mock/quotes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── 상태 배지 ────────────────────────────────────────────────────
const STATUS_STYLE: Record<QuoteStatus, string> = {
    작성중: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    발송: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    승인: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    반려: "bg-red-500/15 text-red-400 border-red-500/30",
};

const fmt = (n: number) => new Intl.NumberFormat("ko-KR").format(n);
const calcTotal = (items: QuoteItem[]) =>
    items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

// ─── PDF 미리보기 모달 내용 ───────────────────────────────────────
function QuotePreview({ quote }: { quote: Quote }) {
    const total = calcTotal(quote.items);

    return (
        <div className="bg-white text-slate-900 p-8 rounded-lg print:p-0">
            {/* 헤더 */}
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

            {/* 고객 정보 */}
            <div className="mb-6">
                <p className="text-lg font-bold">{quote.customerName} 귀중</p>
                <p className="text-sm text-slate-500 mt-1">아래와 같이 견적서를 제출합니다.</p>
            </div>

            {/* 품목 테이블 */}
            <table className="w-full text-sm mb-6 border-collapse">
                <thead>
                    <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-3 py-2 text-left">제품명</th>
                        <th className="border border-slate-300 px-3 py-2 text-left">규격</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">단가 (원)</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">수량</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">금액 (원)</th>
                    </tr>
                </thead>
                <tbody>
                    {quote.items.map((item) => (
                        <tr key={item.id}>
                            <td className="border border-slate-300 px-3 py-2">{item.productName}</td>
                            <td className="border border-slate-300 px-3 py-2 text-slate-500">{item.spec}</td>
                            <td className="border border-slate-300 px-3 py-2 text-right">{fmt(item.unitPrice)}</td>
                            <td className="border border-slate-300 px-3 py-2 text-right">{fmt(item.quantity)}</td>
                            <td className="border border-slate-300 px-3 py-2 text-right font-semibold">{fmt(item.unitPrice * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-slate-50">
                        <td colSpan={4} className="border border-slate-300 px-3 py-2 text-right font-bold">합계</td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-black text-ocean-teal">{fmt(total)}</td>
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

// ─── 동적 폼 행 ───────────────────────────────────────────────────
function QuoteFormRow({
    item,
    onChange,
    onDelete,
}: {
    item: QuoteItem;
    onChange: (field: keyof QuoteItem, value: string | number) => void;
    onDelete: () => void;
}) {
    const lineTotal = item.unitPrice * item.quantity;

    return (
        <tr>
            <td className="py-2 pr-2">
                <Input value={item.productName} onChange={(e) => onChange("productName", e.target.value)} placeholder="제품명" className="h-8 text-sm" />
            </td>
            <td className="py-2 pr-2">
                <Input value={item.spec} onChange={(e) => onChange("spec", e.target.value)} placeholder="규격" className="h-8 text-sm" />
            </td>
            <td className="py-2 pr-2">
                <Input type="number" value={item.unitPrice} onChange={(e) => onChange("unitPrice", Number(e.target.value))} className="h-8 text-sm text-right" />
            </td>
            <td className="py-2 pr-2">
                <Input type="number" value={item.quantity} onChange={(e) => onChange("quantity", Number(e.target.value))} className="h-8 text-sm text-right" />
            </td>
            <td className="py-2 pr-2 text-right text-sm font-semibold text-ocean-teal whitespace-nowrap">
                {fmt(lineTotal)}
            </td>
            <td className="py-2">
                <button onClick={onDelete} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
export default function SalesQuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
    const [previewQuote, setPreviewQuote] = useState<Quote | null>(null);
    const [editItems, setEditItems] = useState<QuoteItem[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const openCreate = () => {
        setEditItems([{ id: `qi-${Date.now()}`, productName: "", spec: "", unitPrice: 0, quantity: 0 }]);
        setIsCreateOpen(true);
    };

    const addRow = () =>
        setEditItems((prev) => [...prev, { id: `qi-${Date.now()}`, productName: "", spec: "", unitPrice: 0, quantity: 0 }]);

    const updateRow = (id: string, field: keyof QuoteItem, value: string | number) =>
        setEditItems((prev) => prev.map((i) => i.id === id ? { ...i, [field]: value } : i));

    const deleteRow = (id: string) =>
        setEditItems((prev) => prev.filter((i) => i.id !== id));

    const grandTotal = editItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

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

            {/* 견적 목록 테이블 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>견적번호</TableHead>
                            <TableHead>고객사</TableHead>
                            <TableHead className="text-right">합계 (원)</TableHead>
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
                                <TableCell className="text-right font-bold text-ocean-teal">{fmt(calcTotal(q.items))}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("text-xs", STATUS_STYLE[q.status])}>
                                        {q.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-slate-400">{q.createdAt}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setPreviewQuote(q)}
                                        className="gap-1 text-xs">
                                        <Eye className="w-3 h-3" /> 미리보기
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* PDF 미리보기 다이얼로그 */}
            <Dialog open={!!previewQuote} onOpenChange={(o) => !o && setPreviewQuote(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

            {/* 새 견적서 작성 다이얼로그 */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>새 견적서 작성</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>고객사</Label><Input className="mt-1" placeholder="고객사명" /></div>
                            <div><Label>유효기간</Label><Input className="mt-1" type="date" /></div>
                        </div>

                        {/* 동적 품목 테이블 */}
                        <div>
                            <Label className="mb-2 block">품목</Label>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                        <th className="pb-2 text-left font-semibold">제품명</th>
                                        <th className="pb-2 text-left font-semibold">규격</th>
                                        <th className="pb-2 text-right font-semibold">단가</th>
                                        <th className="pb-2 text-right font-semibold">수량</th>
                                        <th className="pb-2 text-right font-semibold">금액</th>
                                        <th className="pb-2" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {editItems.map((item) => (
                                        <QuoteFormRow
                                            key={item.id}
                                            item={item}
                                            onChange={(f, v) => updateRow(item.id, f, v)}
                                            onDelete={() => deleteRow(item.id)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={addRow} className="mt-3 flex items-center gap-1.5 text-xs text-ocean-teal hover:underline font-semibold">
                                <Plus className="w-3.5 h-3.5" /> 행 추가
                            </button>
                        </div>

                        {/* 합계 */}
                        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-right">
                                <p className="text-xs text-slate-400">총 합계</p>
                                <p className="text-2xl font-black text-ocean-teal">{fmt(grandTotal)} 원</p>
                            </div>
                        </div>

                        <div><Label>비고</Label><Input className="mt-1" placeholder="특이사항, 조건 등" /></div>
                        <div className="flex justify-end">
                            <Button className="bg-ocean-teal hover:bg-ocean-dark">견적서 저장</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
