"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    Filter,
    Search,
    MoreVertical,
    PauseCircle,
    Undo2
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { logActivity } from "@/lib/logger";
import {
    MOCK_INTAKE_DATA,
    SampleIntake,
    ReceptionStatus,
    Urgency,
    URGENCY_SCORE
} from "@/lib/mock/sampleIntake";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── 상태 색상 및 아이콘 ───────────────────────────────────────────
const STATUS_CONFIG: Record<ReceptionStatus, { color: string; bg: string; icon: React.ElementType }> = {
    대기: { color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", icon: Clock },
    승인: { color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
    보류: { color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20", icon: PauseCircle },
    반려: { color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20", icon: XCircle },
};

const URGENCY_STYLE: Record<Urgency, string> = {
    긴급: "bg-rose-500 text-white border-rose-600 shadow-rose-500/20",
    높음: "bg-orange-500 text-white border-orange-600",
    보통: "bg-blue-500 text-white border-blue-600",
    낮음: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
};

// ─── 개별 요청 카드 ───────────────────────────────────────────────
function IntakeCard({
    item,
    onAction
}: {
    item: SampleIntake;
    onAction: (id: string, status: ReceptionStatus) => void
}) {
    const statusCfg = STATUS_CONFIG[item.receptionStatus];
    const StatusIcon = statusCfg.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "group bg-white dark:bg-slate-900 rounded-2xl border p-5 transition-all hover:shadow-lg",
                item.urgency === "긴급" && item.receptionStatus === "대기"
                    ? "border-rose-500/50 shadow-rose-500/5"
                    : "border-slate-200 dark:border-slate-800"
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Badge className={cn("text-[10px] px-2 py-0 h-5 font-bold uppercase", URGENCY_STYLE[item.urgency])}>
                            {item.urgency}
                        </Badge>
                        <span className="text-[11px] font-mono text-slate-400">{item.requestNo}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-ocean-teal transition-colors">
                        {item.productName}
                    </h3>
                    <p className="text-xs text-ocean-teal font-medium">{item.customerName}</p>
                </div>
                <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider", statusCfg.bg, statusCfg.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {item.receptionStatus}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 text-[11px]">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                    <p className="text-slate-400 mb-0.5">요청 수량</p>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{item.quantity}개 ({item.sampleType})</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                    <p className="text-slate-400 mb-0.5">요청 일시</p>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{item.requestedAt}</p>
                </div>
            </div>

            {item.note && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-5 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-2 rounded-lg italic">
                    &quot;{item.note}&quot;
                </p>
            )}

            {/* 액션 버튼 섹션 */}
            {item.receptionStatus === "대기" || item.receptionStatus === "보류" ? (
                <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAction(item.id, "승인")}
                        className="flex-1 text-[11px] h-8 gap-1.5 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                    >
                        <CheckCircle2 className="w-3.5 h-3.5" /> 승인
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAction(item.id, "보류")}
                        className="flex-1 text-[11px] h-8 gap-1.5"
                    >
                        <PauseCircle className="w-3.5 h-3.5" /> 보류
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAction(item.id, "반려")}
                        className="flex-1 text-[11px] h-8 gap-1.5 border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white"
                    >
                        <XCircle className="w-3.5 h-3.5" /> 반려
                    </Button>
                </div>
            ) : (
                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAction(item.id, "대기")}
                        className="text-[10px] text-slate-400 gap-1.5 hover:text-ocean-teal"
                    >
                        <Undo2 className="w-3 h-3" /> 처리 취소
                    </Button>
                </div>
            )}
        </motion.div>
    );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
export default function SampleReceptionPage() {
    const { profile } = useUserRole();
    const [data, setData] = useState<SampleIntake[]>(MOCK_INTAKE_DATA);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("전체");
    const [rejectionTarget, setRejectionTarget] = useState<string | null>(null);
    const [reason, setReason] = useState("");

    const unhandledCount = data.filter(d => d.receptionStatus === "대기").length;
    const urgentCount = data.filter(d => d.urgency === "긴급" && d.receptionStatus === "대기").length;

    const handleAction = async (id: string, status: ReceptionStatus) => {
        if (status === "반려") {
            setRejectionTarget(id);
            return;
        }

        const item = data.find(d => d.id === id);
        if (!item) return;

        setData(prev => prev.map(d => d.id === id ? { ...d, receptionStatus: status } : d));

        if (profile) {
            await logActivity(
                { uid: profile.uid, displayName: profile.displayName, team: profile.team },
                `샘플 ${status}`,
                `${item.customerName}의 ${item.productName} 샘플 요청(${item.requestNo})을 ${status} 처리했습니다.`,
                "System",
                { requestId: id, status }
            );
        }
    };

    const confirmRejection = async () => {
        if (!rejectionTarget) return;

        const item = data.find(d => d.id === rejectionTarget);
        if (!item) return;

        setData(prev => prev.map(d =>
            d.id === rejectionTarget
                ? { ...d, receptionStatus: "반려", rejectionReason: reason }
                : d
        ));

        if (profile) {
            await logActivity(
                { uid: profile.uid, displayName: profile.displayName, team: profile.team },
                "샘플 반려",
                `${item.customerName}의 ${item.productName} 샘플 요청(${item.requestNo})을 반려했습니다. (사유: ${reason})`,
                "System",
                { requestId: rejectionTarget, status: "반려", reason }
            );
        }

        setRejectionTarget(null);
        setReason("");
    };

    // 📝 필터링 및 긴급도 자동 정렬 로직
    const filteredData = useMemo(() => {
        let result = data.filter(d =>
            d.productName.toLowerCase().includes(search.toLowerCase()) ||
            d.customerName.toLowerCase().includes(search.toLowerCase()) ||
            d.requestNo.toLowerCase().includes(search.toLowerCase())
        );

        if (filter === "대기") result = result.filter(d => d.receptionStatus === "대기");
        if (filter === "완료") result = result.filter(d => d.receptionStatus !== "대기");

        // 긴급도 정렬: 긴급(100) > 높음(50) > 보통(20) > 낮음(0)
        return result.sort((a, b) => URGENCY_SCORE[b.urgency] - URGENCY_SCORE[a.urgency]);
    }, [data, search, filter]);

    return (
        <div className="space-y-6 pb-12">
            {/* 헤더 섹션 */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">샘플접수관리</h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">영업팀의 샘플 요청을 검토하고 제작 프로세스로 전달합니다.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 flex items-center gap-4 shadow-sm">
                        <div className="text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">대기 중</p>
                            <p className="text-lg font-black text-amber-500">{unhandledCount}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
                        <div className="text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">긴급 요청</p>
                            <p className="text-lg font-black text-rose-500">{urgentCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 필터 및 검색 바 */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-ocean-teal transition-colors" />
                    <Input
                        className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-ocean-teal"
                        placeholder="제품명, 고객사, 요청번호 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
                    <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 h-11">
                        <TabsTrigger value="전체" className="px-5 text-xs font-bold">전체</TabsTrigger>
                        <TabsTrigger value="대기" className="px-5 text-xs font-bold relative">
                            대기
                            {unhandledCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] text-white font-black">
                                    {unhandledCount}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="완료" className="px-5 text-xs font-bold">처리완료</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* 리스트 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredData.map((item) => (
                        <IntakeCard
                            key={item.id}
                            item={item}
                            onAction={handleAction}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Filter className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium">검색 결과가 없습니다.</p>
                </div>
            )}

            {/* 반려 사유 입력 모달 */}
            <AlertDialog open={!!rejectionTarget} onOpenChange={(o) => !o && setRejectionTarget(null)}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-rose-500 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> 요청 반려
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            이 요청을 반려하시겠습니까? 반려 사유를 입력하여 영업 담당자에게 전달하세요.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">
                        <Textarea
                            className="min-h-[120px] focus-visible:ring-rose-500"
                            placeholder="반려 사유를 입력하세요 (예: 원료 수급 불가, 일정 상 불가 등)"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setReason("")}>취소</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmRejection}
                            className="bg-rose-500 hover:bg-rose-600 focus:ring-rose-500"
                            disabled={!reason.trim()}
                        >
                            반려 처리
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
