"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    Factory,
    Calendar,
    ArrowRight,
    Search,
    Package,
    Globe
} from "lucide-react";
import { industryData } from "@/lib/mock-data";

export function HeroSection() {
    const news = industryData?.news || [];

    return (
        <section className="relative pt-24 pb-32 overflow-hidden bg-slate-50">
            {/* News Ticker */}
            <div className="absolute top-0 w-full bg-white border-b border-slate-100 py-2 overflow-hidden">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap gap-8"
                >
                    {[...news, ...news].map((n, idx) => (
                        <div key={`${n.id}-${idx}`} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <span className="bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded text-[10px] font-bold">INFO</span>
                            {n.title}
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="container mx-auto px-4 mt-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                            트렌드부터 제조까지, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                                뷰티 비즈니스의 시작
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                            국내 No.1 뷰티 B2B 통합 솔루션으로 리드 관리부터 발주까지 모든 프로세스를 자동화하십시오.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 group">
                                지금 무료로 시작하기
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                                데모 신청하기
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Subtle background elements */}
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-teal-100/30 blur-[120px] rounded-full" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-100/30 blur-[120px] rounded-full" />
        </section>
    );
}

export function BentoTrends() {
    const trends = industryData?.trends || [];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">2025 K-Beauty Trends</h2>
                    <p className="text-slate-500">AI가 분석한 최신 시장 트렌드와 인사이트</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {trends.map((trend, idx) => (
                        <motion.div
                            key={trend.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-8 hover:shadow-xl transition-all"
                        >
                            <div className="relative z-10">
                                <TrendingUp className="w-8 h-8 text-teal-600 mb-6" />
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{trend.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{trend.description}</p>
                            </div>
                            <div className="absolute -bottom-12 -right-12 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingUp className="w-48 h-48" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ManufacturerInsights() {
    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">제조사 네트워크 인사이트</h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            한국콜마, 코스맥스 등 주요 OEM/ODM 제휴사의 생산 케파와 최신 공법 데이터를 기반으로 최적의 매칭을 제안합니다.
                        </p>
                        <div className="space-y-4">
                            {[
                                { icon: Globe, text: "글로벌 생산 라인 실시간 현황" },
                                { icon: Package, text: "친환경 패키지 솔루션 가이드" },
                                { icon: Search, text: "AI 성분 분석 및 제형 추천" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-500/20 rounded-lg">
                                        <item.icon className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <span className="font-medium text-slate-200">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/2 relative">
                        <div className="aspect-square bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full blur-[100px] absolute inset-0" />
                        <div className="relative border border-white/10 p-8 rounded-3xl bg-white/5 backdrop-blur-sm">
                            <Factory className="w-12 h-12 text-teal-400 mb-6" />
                            <div className="space-y-6">
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-teal-400" />
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-1/2 h-full bg-emerald-400" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                                        <div className="text-2xl font-bold text-teal-400">800+</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Partners</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                                        <div className="text-2xl font-bold text-emerald-400">95%</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Accuracy</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ExhibitionCarousel() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-[40px] p-8 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-600 rounded-full font-bold text-sm mb-6">
                                <Calendar className="w-4 h-4" />
                                2026 전시회 일정
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
                                전 세계 뷰티 박람회 정보를 <br />하나의 캘린더에서 확인하세요.
                            </h2>
                            <p className="text-slate-600 mb-8">
                                Cosmoprof Worldwide Bologna부터 K-Beauty Expo까지, 중요한 비즈니스 기회를 놓치지 않도록 관리해 드립니다.
                            </p>
                            <button className="flex items-center gap-2 font-bold text-teal-600 hover:text-teal-700 transition-colors">
                                전체 일정 보기 <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="w-full md:w-64 aspect-square bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center">
                            <Calendar className="w-24 h-24 text-slate-200" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
