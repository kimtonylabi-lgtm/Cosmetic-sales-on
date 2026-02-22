"use client";

import { motion } from "framer-motion";
import { Factory, Package, Calendar as CalendarIcon, ChevronRight } from "lucide-react";

export function Trends() {
    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-24">
                    <h2 className="font-serif text-4xl md:text-5xl text-black mb-4 uppercase tracking-widest">
                        Industry Trends
                    </h2>
                    <div className="w-20 h-px bg-black mx-auto mt-8" />
                </div>

                <div className="grid md:grid-cols-3 gap-16 md:gap-8">
                    {/* Column 1: Manufacturing Tech */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col h-full border border-black/5 p-8 hover:bg-neutral-50 transition-colors"
                    >
                        <div className="mb-8">
                            <Factory className="w-8 h-8 text-black" />
                        </div>
                        <h3 className="font-serif text-2xl mb-6 text-black">Manufacturing Tech</h3>
                        <div className="text-sm text-neutral-600 leading-relaxed mb-8 flex-grow">
                            <p className="mb-4">
                                <strong>삼화/연우/펌텍:</strong> 초소형 정밀 사출 및 친환경 소재(PCR) 펌프 양산 체계 구축.
                                재사용 가능한 리필 구조 설계 트렌드 강화.
                            </p>
                            <p>
                                <strong>한국콜마/코스맥스:</strong> AI 기반 맞춤형 제형 최적화 및
                                마이크로바이옴 기반 고효율 원료 생산 기술 고도화 (v2.6 업데이트 완료).
                            </p>
                        </div>
                        <a href="#" className="inline-flex items-center text-xs uppercase tracking-widest font-bold group">
                            View Detailed Insight <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>

                    {/* Column 2: Packaging Trends */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col h-full border border-black/5 p-8 hover:bg-neutral-50 transition-colors"
                    >
                        <div className="mb-8">
                            <Package className="w-8 h-8 text-black" />
                        </div>
                        <h3 className="font-serif text-2xl mb-6 text-black">Packaging Trends</h3>
                        <div className="text-sm text-neutral-600 leading-relaxed mb-8 flex-grow">
                            <p className="mb-4">
                                <strong>Smart Packaging:</strong> NFC 칩이 내장된 인터랙티브 용기를 통한
                                정품 인증 및 사용 이력 추적 기술 보편화.
                            </p>
                            <p>
                                <strong>Zero-Waste:</strong> 플라스틱 비중을 90% 이상 줄인 종이 기반 압축 튜브 및
                                식물성 바이오 폴리머 소재 도입 가속화.
                            </p>
                        </div>
                        <a href="#" className="inline-flex items-center text-xs uppercase tracking-widest font-bold group">
                            View Detailed Insight <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>

                    {/* Column 3: Exhibitions & Calendar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col h-full border border-black/5 p-8 hover:bg-neutral-50 transition-colors"
                    >
                        <div className="mb-8">
                            <CalendarIcon className="w-8 h-8 text-black" />
                        </div>
                        <h3 className="font-serif text-2xl mb-6 text-black">Global Events</h3>
                        <div className="text-sm text-neutral-600 leading-relaxed mb-8 flex-grow">
                            <div className="bg-black/5 p-4 rounded-lg mb-4">
                                <div className="font-bold text-black mb-1">March 2026</div>
                                <div className="grid grid-cols-7 gap-1 text-[10px] text-center opacity-50">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                        <div key={`cal-header-${day}-${idx}`}>{day}</div>
                                    ))}
                                    {Array.from({ length: 31 }).map((_, i) => (
                                        <div key={i} className={i === 19 ? "bg-black text-white rounded-full" : ""}>
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex justify-between border-b border-black/5 pb-1">
                                    <span>Cosmoprof Bologna</span>
                                    <span className="font-bold text-black">03.20</span>
                                </li>
                                <li className="flex justify-between border-b border-black/5 pb-1">
                                    <span>K-Beauty Seoul</span>
                                    <span className="font-bold text-black">10.15</span>
                                </li>
                            </ul>
                        </div>
                        <a href="#" className="inline-flex items-center text-xs uppercase tracking-widest font-bold group">
                            Full Calendar <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
