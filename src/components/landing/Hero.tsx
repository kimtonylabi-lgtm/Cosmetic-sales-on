"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative w-full h-screen overflow-hidden flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/hero-beauty.png"
                    alt="Luxury Beauty Background"
                    fill
                    className="object-cover transition-scale duration-[20s] hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-black/5" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-2xl bg-white/70 backdrop-blur-md p-10 md:p-16 border border-white/20"
                >
                    <span className="text-xs uppercase tracking-[0.3em] font-medium mb-6 block text-neutral-500">
                        Monthly Update — February 2026
                    </span>
                    <h1 className="font-serif text-4xl md:text-6xl leading-[1.2] mb-8 text-black">
                        The New Era of <br />
                        Sustainable Luxury <br />
                        in K-Beauty.
                    </h1>
                    <div className="font-serif text-lg text-neutral-800 mb-10 leading-relaxed border-l-2 border-black pl-6">
                        <p>
                            이번 달 뷰티 업계는 &apos;미니멀리즘&apos;과 &apos;지속가능성&apos;의 완벽한 조화를 추구하고 있습니다.
                            내용물부터 용기까지, 환경을 생각하는 혁신적인 공법이 도입된 최신 트렌드를 확인해 보십시오.
                            매월 업데이트되는 산업 인사이트를 통해 비즈니스 기회를 발견하세요.
                        </p>
                    </div>
                    <button className="bg-black text-white px-10 py-4 uppercase tracking-[0.2em] text-sm hover:bg-neutral-800 transition-colors">
                        More
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
