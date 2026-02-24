"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Filter, Search, ArrowRightCircle, FileEdit, CheckCircle2 } from "lucide-react";
import { MOCK_ORDERS, Order, OrderStatus } from "@/lib/mock/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { OrderBomBlock, OrderBomBlockMeta, INITIAL_ORDER_BOM_META } from "./OrderBomBlock";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { logActivity } from "@/lib/logger";

const STATUS_STYLE: Record<OrderStatus, string> = {
    검토중: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    확정: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    생산중: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    납품완료: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
};

const fmt = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

type SortKey = "orderNo" | "amount" | "confirmedAt" | "deliveryDue";
type SortDir = "asc" | "desc";

export default function SalesOrdersPage() {
    const { profile } = useUserRole();
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [sortKey, setSortKey] = useState<SortKey>("confirmedAt");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    // BOM 관련 상태
    const [bomSheetOpen, setBomSheetOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [bomMeta, setBomMeta] = useState<OrderBomBlockMeta>(INITIAL_ORDER_BOM_META);

    // ─── 정렬 토글 ──────────────────────────────────────────────
    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortKey(key); setSortDir("asc"); }
    };

    // ─── 필터 + 정렬 ────────────────────────────────────────────
    const filtered = useMemo(() => {
        return orders
            .filter((o) =>
                (statusFilter === "ALL" || o.status === statusFilter) &&
                (o.customerName.includes(search) || o.orderNo.includes(search) || o.productName.includes(search))
            )
            .sort((a, b) => {
                const va = a[sortKey]?.toString() ?? "";
                const vb = b[sortKey]?.toString() ?? "";
                return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
            });
    }, [orders, search, statusFilter, sortKey, sortDir]);

    const totalAmount = filtered.reduce((s, o) => s + o.amount, 0);

    // ─── 견적 → 수주 원클릭 (데모: 상태 검토중 → 확정) ─────────
    const confirmOrder = async (id: string) => {
        const order = orders.find(o => o.id === id);
        if (!order) return;

        setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "확정" } : o));

        if (profile) {
            await logActivity(
                { uid: profile.uid, displayName: profile.displayName, team: profile.team },
                "수주 확정",
                `${order.customerName}의 ${order.productName} 수주(${order.orderNo})를 확정했습니다.`,
                "System",
                { orderId: id, amount: order.amount }
            );
        }
    };

    const SortIcon = ({ k }: { k: SortKey }) =>
        sortKey === k
            ? sortDir === "asc" ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />
            : null;

    const openBomSheet = (order: Order) => {
        setSelectedOrderId(order.id);
        // 실제 앱에서는 API로 데이터를 가져오겠지만, 여기서는 초기화
        setBomMeta({
            ...INITIAL_ORDER_BOM_META,
            orderNo: order.orderNo,
            clientName: order.customerName,
            productNameTaesung: order.productName,
            orderQty: order.amount.toString() // 예시로 소계 사용
        });
        setBomSheetOpen(true);
    };

    const updateBomMeta = useCallback(<K extends keyof OrderBomBlockMeta>(key: K, value: OrderBomBlockMeta[K]) => {
        setBomMeta((prev) => ({ ...prev, [key]: value }));
    }, []);

    return (
        <div className="space-y-6 pb-10">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">수주관리</h1>
                    <p className="text-slate-400 mt-1 text-sm">수주 현황을 필터·정렬로 확인하세요.</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">필터 결과 합계</p>
                    <p className="text-xl font-bold text-ocean-teal">{fmt(totalAmount)} 원</p>
                </div>
            </div>

            {/* 필터 바 */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        className="pl-9"
                        placeholder="고객사, 수주번호, 제품명 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36">
                        <Filter className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        <SelectValue placeholder="상태" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">전체</SelectItem>
                        <SelectItem value="검토중">검토중</SelectItem>
                        <SelectItem value="확정">확정</SelectItem>
                        <SelectItem value="생산중">생산중</SelectItem>
                        <SelectItem value="납품완료">납품완료</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* 데이터 테이블 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("orderNo")}>
                                수주번호 <SortIcon k="orderNo" />
                            </TableHead>
                            <TableHead>고객사</TableHead>
                            <TableHead>제품명</TableHead>
                            <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("amount")}>
                                금액 (원) <SortIcon k="amount" />
                            </TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("deliveryDue")}>
                                납기일 <SortIcon k="deliveryDue" />
                            </TableHead>
                            <TableHead className="text-right">액션</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((o) => (
                            <TableRow key={o.id}>
                                <TableCell className="font-mono text-sm">{o.orderNo}</TableCell>
                                <TableCell className="font-semibold">{o.customerName}</TableCell>
                                <TableCell className="text-slate-500">{o.productName}</TableCell>
                                <TableCell className="text-right font-bold text-ocean-teal">{fmt(o.amount)}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("text-xs", STATUS_STYLE[o.status])}>
                                        {o.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-slate-400">{o.deliveryDue}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            size="sm" variant="ghost"
                                            onClick={() => openBomSheet(o)}
                                            className="gap-1 text-xs text-slate-500 hover:text-ocean-teal"
                                        >
                                            <FileEdit className="w-3.5 h-3.5" /> 발주상세
                                        </Button>
                                        {o.status === "검토중" && (
                                            <Button
                                                size="sm" variant="outline"
                                                onClick={() => confirmOrder(o.id)}
                                                className="gap-1 text-xs border-ocean-teal/30 text-ocean-teal hover:bg-ocean-teal/10"
                                            >
                                                <ArrowRightCircle className="w-3.5 h-3.5" /> 수주 확정
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-slate-400 py-10">
                                    검색 결과가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 발주 상세 Sheet (수주관리 전용) */}
            <Sheet open={bomSheetOpen} onOpenChange={setBomSheetOpen}>
                <SheetContent side="right" className="w-full max-w-3xl sm:max-w-3xl p-0 flex flex-col">
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
                        <OrderBomBlock meta={bomMeta} onChange={updateBomMeta} />
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-900 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setBomSheetOpen(false)}>취소</Button>
                        <Button type="button" className="flex-1 bg-ocean-teal hover:bg-teal-700 text-white font-bold gap-2" onClick={() => {
                            alert("발주 상세가 저장되었습니다.");
                            setBomSheetOpen(false);
                        }}>
                            <CheckCircle2 className="w-4 h-4" /> 발주 상세 저장
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
