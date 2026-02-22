"use client";

import React, { useState } from "react";
import { Search, Building2, User, Phone, Mail, ShoppingCart, Package, Star } from "lucide-react";
import { MOCK_CUSTOMERS, Customer, CustomerGrade } from "@/lib/mock/customers";
import { MOCK_ORDERS } from "@/lib/mock/orders";
import { MOCK_SAMPLE_REQUESTS } from "@/lib/mock/sampleRequests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── 등급 배지 ────────────────────────────────────────────────────
const GRADE_STYLE: Record<CustomerGrade, string> = {
    VIP: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    일반: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    신규: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};
const fmt = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

// ─── 고객 상세 뷰 ─────────────────────────────────────────────────
function CustomerDetail({ customer }: { customer: Customer }) {
    const orders = MOCK_ORDERS.filter((o) => customer.orderIds.includes(o.id));
    const samples = MOCK_SAMPLE_REQUESTS.filter((s) => customer.sampleIds.includes(s.id));

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* 고객 헤더 */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-ocean-teal/5 to-transparent">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-ocean-teal/15 flex items-center justify-center font-black text-ocean-teal text-2xl">
                            {customer.companyName[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{customer.companyName}</h2>
                                <Badge variant="outline" className={cn("text-[10px]", GRADE_STYLE[customer.grade])}>
                                    {customer.grade === "VIP" && <Star className="w-2.5 h-2.5 mr-1" />}
                                    {customer.grade}
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-400">{customer.industry} | 담당: {customer.assignee}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 탭 */}
            <Tabs defaultValue="info" className="p-6">
                <TabsList className="mb-6">
                    <TabsTrigger value="info">기본정보</TabsTrigger>
                    <TabsTrigger value="orders">수주이력 ({orders.length})</TabsTrigger>
                    <TabsTrigger value="samples">샘플이력 ({samples.length})</TabsTrigger>
                    <TabsTrigger value="contacts">담당자 ({customer.contacts.length})</TabsTrigger>
                </TabsList>

                {/* 기본정보 */}
                <TabsContent value="info" className="space-y-4 mt-0">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">주력 제품군</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{customer.industry}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">등록일</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{customer.registeredAt}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                                <Phone className="w-3 h-3" /> 대표 전화
                            </p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{customer.phone}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">주소</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{customer.address}</p>
                        </div>
                    </div>
                    {customer.memo && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">메모</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{customer.memo}</p>
                        </div>
                    )}
                </TabsContent>

                {/* 수주이력 */}
                <TabsContent value="orders" className="mt-0">
                    {orders.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">수주 이력이 없습니다.</p>
                    ) : (
                        <div className="space-y-3">
                            {orders.map((o) => (
                                <div key={o.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <ShoppingCart className="w-4 h-4 text-ocean-teal" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{o.productName}</p>
                                            <p className="text-xs text-slate-400">{o.orderNo} · {o.confirmedAt}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-ocean-teal">{fmt(o.amount)}원</p>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* 샘플이력 */}
                <TabsContent value="samples" className="mt-0">
                    {samples.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">샘플 이력이 없습니다.</p>
                    ) : (
                        <div className="space-y-3">
                            {samples.map((s) => (
                                <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Package className="w-4 h-4 text-amber-400" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.productName}</p>
                                            <p className="text-xs text-slate-400">{s.requestNo} · {s.requestedAt} · {s.sampleType}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">{s.status}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* 담당자 */}
                <TabsContent value="contacts" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {customer.contacts.map((c, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-ocean-teal/15 flex items-center justify-center font-bold text-ocean-teal text-sm">
                                        {c.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</p>
                                        <p className="text-xs text-slate-400">{c.position}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 pl-12">
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                        <Phone className="w-3 h-3" /> {c.phone}
                                    </p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                        <Mail className="w-3 h-3" /> {c.email}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
export default function SalesCustomersPage() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Customer>(MOCK_CUSTOMERS[0]);

    const filtered = MOCK_CUSTOMERS.filter((c) =>
        c.companyName.includes(search) || c.industry.includes(search) || c.assignee.includes(search)
    );

    return (
        <div className="space-y-6 pb-10">
            {/* 헤더 */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">고객관리</h1>
                <p className="text-slate-400 mt-1 text-sm">고객사 360도 뷰 — 담당자, 수주·샘플 이력을 한 곳에서.</p>
            </div>

            <div className="flex gap-6 min-h-[70vh]">
                {/* 왼쪽 — 검색 + 목록 */}
                <div className="w-64 shrink-0 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            className="pl-9 text-sm"
                            placeholder="고객사 검색..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        {filtered.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setSelected(c)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors",
                                    selected.id === c.id
                                        ? "bg-ocean-teal/10 border border-ocean-teal/30"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                            >
                                <div className="w-9 h-9 rounded-xl bg-ocean-teal/15 flex items-center justify-center font-bold text-ocean-teal shrink-0">
                                    {c.companyName[0]}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{c.companyName}</p>
                                    <p className="text-xs text-slate-400 truncate">{c.industry}</p>
                                </div>
                                <Badge variant="outline" className={cn("text-[10px] ml-auto shrink-0", GRADE_STYLE[c.grade])}>
                                    {c.grade}
                                </Badge>
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <p className="text-xs text-slate-400 text-center py-6">검색 결과 없음</p>
                        )}
                    </div>
                </div>

                {/* 오른쪽 — 상세 뷰 */}
                <div className="flex-1 min-w-0">
                    <CustomerDetail customer={selected} />
                </div>
            </div>
        </div>
    );
}
