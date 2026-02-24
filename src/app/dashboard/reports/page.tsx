"use client";

import React, { useState, useEffect } from "react";
import {
    FileText,
    Sparkles,
    Calendar,
    ChevronRight,
    CheckCircle2,
    Users,
    Clock,
    MessageSquare,
    RefreshCw,
    TrendingUp,
    Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useUserRole } from "@/hooks/useUserRole";
import { generateAIReport } from "@/lib/gemini";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createDocument, queryWorkLogs, WorkLog, getAllDocuments, Report, updateDocument, queryReports } from "@/lib/firebase/db";

export default function ReportsPage() {
    const { profile, isDeptHead } = useUserRole();
    const [logs, setLogs] = useState<WorkLog[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState("my");

    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [feedback, setFeedback] = useState("");
    const [savingFeedback, setSavingFeedback] = useState(false);

    useEffect(() => {
        if (profile) {
            fetchData();
        }
    }, [profile]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [fetchedLogs, userReports] = await Promise.all([
                queryWorkLogs(profile!.uid),
                queryReports(profile!.uid)
            ]);

            let allReports = [...userReports];
            if (isDeptHead) {
                const teamReports = await queryReports("", profile!.team);
                // 중복 제거 (본인 보고서가 포함될 수 있음)
                const teamFiltered = teamReports.filter(tr => !userReports.find(ur => ur.id === tr.id));
                allReports = [...allReports, ...teamFiltered];
            }

            setLogs(fetchedLogs);
            setReports(allReports);
        } catch (error: any) {
            console.error("Error fetching report data:", error);
            alert(`데이터 로딩 실패: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 내 보고서: 최신순 정렬
    const myReports = reports
        .filter(r => r.userId === profile?.uid)
        .sort((a, b) => {
            const timeA = (a.createdAt as any)?.seconds || 0;
            const timeB = (b.createdAt as any)?.seconds || 0;
            return timeB - timeA;
        });

    const teamReports = reports
        .filter(r => r.team === profile?.team && r.userId !== profile?.uid)
        .sort((a, b) => {
            const timeA = (a.createdAt as any)?.seconds || 0;
            const timeB = (b.createdAt as any)?.seconds || 0;
            return timeB - timeA;
        });

    const handleGenerate = async (type: 'DAILY' | 'WEEKLY') => {
        if (!logs.length) {
            alert("분석할 활동 로그가 없습니다.");
            return;
        }

        setGenerating(true);
        try {
            // Firestore Timestamp 등 직렬화가 불가능한 객체를 제거하고 필요한 필드만 추출
            const analysisLogs = logs.slice(0, 20).map(log => ({
                action: log.action,
                content: log.content,
                userName: log.userName,
                team: log.team,
                // metadata가 있으면 단순 객체로 변환 시도
                metadata: log.metadata ? JSON.parse(JSON.stringify(log.metadata)) : undefined,
                createdAt: (log.createdAt as any)?.toDate
                    ? (log.createdAt as any).toDate().toLocaleString()
                    : String(log.createdAt)
            }));

            const content = await generateAIReport(analysisLogs, type);

            const summaryMatch = content.match(/Summary:?\s*(.*)/i) || content.match(/요약:?\s*(.*)/);
            const summary = summaryMatch ? summaryMatch[1] : `${type === 'DAILY' ? '일간' : '주간'} 업무 분석 결과입니다.`;

            const newReport: Partial<Report> = {
                userId: profile!.uid,
                userName: profile!.displayName || "Unknown",
                team: profile!.team,
                type,
                targetDate: new Date().toISOString().slice(0, 10),
                content,
                summary,
                status: 'TEMP'
            };

            await createDocument("reports", newReport);

            // 데이터 갱신을 위해 약간의 지연 후 호출 (Firestore 인덱싱 대기)
            setTimeout(async () => {
                await fetchData();
                setGenerating(false);
                alert("AI 보고서 생성 및 저장이 완료되었습니다. 목록에서 확인해 보세요!");
            }, 1000);
        } catch (error: any) {
            alert(`보고서 생성 오류: ${error.message}`);
            setGenerating(false);
        }
    };

    const handleSaveFeedback = async () => {
        if (!selectedReport) return;
        setSavingFeedback(true);
        try {
            await updateDocument("reports", selectedReport.id, {
                feedback,
                status: 'FINAL'
            });
            await fetchData();
            setSelectedReport(null);
            setFeedback("");
            alert("피드백이 저장되었습니다.");
        } catch (error) {
            alert("피드백 저장 실패");
        } finally {
            setSavingFeedback(false);
        }
    };

    const openReport = (report: Report) => {
        setSelectedReport(report);
        setFeedback(report.feedback || "");
    };

    return (
        <div className="space-y-8 pb-20">
            {/* 상단 헤더 */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-ocean-teal" /> AI 보고서 관리
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">활동 로그를 분석하여 AI가 작성한 보고서를 확인하세요.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={async () => {
                            try {
                                const { diagGeminiModels } = await import('./diag-action');
                                const res = await diagGeminiModels();
                                console.log("SERVER_DIAG_RESULT:", res);
                                if (res.success) {
                                    const successModels = res.testResults ? res.testResults.filter((r: any) => r.success).map((r: any) => r.name) : [];
                                    let msg = `✅ 진단 완료 (Key: ${res.apiKeyPrefix})\n\n`;

                                    if (res.availableFromList && res.availableFromList.length > 0) {
                                        msg += `[API 가용 목록]\n- ${res.availableFromList.join("\n- ")}\n\n`;
                                    }

                                    if (successModels.length > 0) {
                                        msg += `[작동 확인됨]\n- ${successModels.join("\n- ")}\n\n`;
                                    } else {
                                        msg += `❌ 테스트 성공한 모델이 없습니다.\n\n`;
                                        if (res.error) {
                                            msg += `[에러]: ${res.error}\n\n`;
                                        }
                                    }

                                    const failModels = res.testResults ? res.testResults.filter((r: any) => !r.success) : [];
                                    if (failModels.length > 0 && successModels.length === 0) {
                                        msg += `[상세]: ${failModels[0].error}`;
                                    }
                                    alert(msg);
                                } else {
                                    alert(`❌ API 연결 실패\n\n오류: ${res.error}\n키 접두어: ${res.apiKeyPrefix}`);
                                }
                            } catch (e: any) {
                                alert(`시스템 오류: ${e.message}`);
                            }
                        }}
                        variant="outline"
                        className="text-[10px] h-8"
                    >
                        API 진단
                    </Button>
                    <Button
                        onClick={() => handleGenerate('DAILY')}
                        disabled={generating || loading}
                        className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 gap-2 shadow-sm"
                    >
                        <Clock className="w-4 h-4 text-amber-500" /> 일간 보고서 생성
                    </Button>
                    <Button
                        onClick={() => handleGenerate('WEEKLY')}
                        disabled={generating || loading}
                        className="bg-ocean-teal hover:bg-ocean-dark text-white gap-2 shadow-lg shadow-ocean-teal/20"
                    >
                        <Sparkles className="w-4 h-4" /> 주간 보고서 생성
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 h-12 rounded-xl">
                    <TabsTrigger value="my" className="px-8 text-sm font-bold rounded-lg border-none">나의 보고서</TabsTrigger>
                    {isDeptHead && <TabsTrigger value="team" className="px-8 text-sm font-bold rounded-lg border-none">팀 보고서 현황</TabsTrigger>}
                </TabsList>

                <TabsContent value="my" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 왼쪽: 최근 활동 요약 */}
                        <div className="lg:col-span-1 space-y-4">
                            <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> 최근 활동 로그
                            </h2>
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden h-[600px] flex flex-col">
                                <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                                    {logs.map((log, i) => (
                                        <div key={log.id} className="flex gap-4 relative">
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-white dark:border-slate-900 z-10">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                </div>
                                                {i < logs.length - 1 && <div className="w-px flex-1 bg-slate-100 dark:bg-slate-800 my-1" />}
                                            </div>
                                            <div className="pb-4">
                                                <p className="text-xs font-bold text-ocean-teal mb-0.5">{log.action}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{log.content}</p>
                                                <p className="text-[10px] text-slate-300 mt-1 uppercase">
                                                    {(log.createdAt as any)?.toDate ? (log.createdAt as any).toDate().toLocaleTimeString() : "방금 전"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {logs.length === 0 && !loading && <p className="text-center text-slate-400 py-10 text-sm">기록된 활동이 없습니다.</p>}
                                </div>
                            </div>
                        </div>

                        {/* 오른쪽: 보고서 이력 */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">생성된 보고서 이력</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {myReports.map(report => (
                                    <div
                                        key={report.id}
                                        onClick={() => openReport(report)}
                                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between group hover:border-ocean-teal/30 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                report.type === 'DAILY' ? "bg-amber-500/10 text-amber-500" : "bg-ocean-teal/10 text-ocean-teal"
                                            )}>
                                                {report.type === 'DAILY' ? <Clock className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h3 className="font-bold text-slate-900 dark:text-white">
                                                        {report.type === 'DAILY' ? '일간' : '주간'} 업무 보고서
                                                    </h3>
                                                    <Badge variant="outline" className="text-[10px] h-4">{report.targetDate}</Badge>
                                                </div>
                                                <p className="text-xs text-slate-400 line-clamp-1">{report.summary}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {report.status === 'FINAL' && (
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1 px-3">
                                                    <CheckCircle2 className="w-3 h-3" /> 승인됨
                                                </Badge>
                                            )}
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-ocean-teal transition-colors" />
                                        </div>
                                    </div>
                                ))}
                                {myReports.length === 0 && !loading && (
                                    <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed">
                                        <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 text-sm">아직 생성된 보고서가 없습니다.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {isDeptHead && (
                    <TabsContent value="team" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {teamReports.map(report => (
                                <div
                                    key={report.id}
                                    onClick={() => openReport(report)}
                                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between group hover:border-ocean-teal/30 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Users className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="font-bold text-slate-900 dark:text-white">{report.userName}</h3>
                                                <Badge variant="secondary" className="text-[10px]">{report.type === 'DAILY' ? '일간' : '주간'}</Badge>
                                                <span className="text-xs text-slate-400">{report.targetDate}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 line-clamp-1">{report.summary}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {report.status === 'TEMP' ? (
                                            <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5">검토 대기</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5">검토 완료</Badge>
                                        )}
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-ocean-teal transition-colors" />
                                    </div>
                                </div>
                            ))}
                            {teamReports.length === 0 && !loading && (
                                <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed">
                                    <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 text-sm">제출된 팀 보고서가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                )}
            </Tabs>

            {/* 상세 보기 모달 */}
            <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none bg-slate-50 dark:bg-slate-950">
                    <DialogHeader className="p-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <Badge className="mb-2 bg-ocean-teal/10 text-ocean-teal border-none">
                                    {selectedReport?.type === 'DAILY' ? '일간 보고서' : '주간 보고서'}
                                </Badge>
                                <DialogTitle className="text-2xl font-bold">
                                    {selectedReport?.userName}의 업무 보고서 ({selectedReport?.targetDate})
                                </DialogTitle>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 보고서 본문 */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:pro-p:text-slate-300">
                                <ReactMarkdown>
                                    {selectedReport?.content || ""}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* 피드백 영역 */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-ocean-teal/5 dark:bg-ocean-teal/10 rounded-2xl p-6 border border-ocean-teal/20">
                                <h4 className="text-sm font-bold text-ocean-teal flex items-center gap-2 mb-4">
                                    <MessageSquare className="w-4 h-4" /> 부서장 피드백
                                </h4>
                                {isDeptHead ? (
                                    <div className="space-y-4">
                                        <Textarea
                                            placeholder="팀원의 보고서에 대한 피드백을 남겨주세요."
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            className="min-h-[200px] bg-white dark:bg-slate-900 border-slate-200 focus:ring-ocean-teal rounded-xl text-sm"
                                        />
                                        <Button
                                            onClick={handleSaveFeedback}
                                            disabled={savingFeedback}
                                            className="w-full bg-ocean-teal hover:bg-ocean-dark text-white font-bold gap-2"
                                        >
                                            <Send className="w-4 h-4" /> 피드백 저장 및 승인
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                        {selectedReport?.feedback || "아직 등록된 피드백이 없습니다."}
                                    </div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                                <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 보고서 상태
                                </h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">최종 진행 상태</span>
                                    <Badge variant={selectedReport?.status === 'FINAL' ? "default" : "secondary"}>
                                        {selectedReport?.status === 'FINAL' ? "승인 완료" : "검토 중"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* AI 생성 로딩 오버레이 */}
            <AnimatePresence>
                {generating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center space-y-6">
                            <div className="w-20 h-20 bg-ocean-teal/20 rounded-full flex items-center justify-center mx-auto relative">
                                <RefreshCw className="w-10 h-10 text-ocean-teal animate-spin" />
                                <Sparkles className="w-6 h-6 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold tracking-tight">AI 보고서 작성 중</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    최근 활동 로그를 기반으로 전문적인 비즈니스 문서를 생성하고 있습니다.
                                </p>
                            </div>
                            <div className="flex justify-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-ocean-teal animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-ocean-teal animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-ocean-teal animate-bounce" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
