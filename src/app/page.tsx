import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/landing/Hero";
import { Trends } from "@/components/landing/Trends";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-black selection:text-white">
            <Header />

            {/* Spacer for fixed header */}
            <div className="h-20" />

            <Hero />

            <Trends />

            {/* Final CTA Section - Minimalist Redesign */}
            <section className="py-40 px-6 bg-white border-t border-black/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-serif text-4xl md:text-6xl mb-10 text-black tracking-tight leading-tight">
                        Elevate Your Beauty <br />
                        Business Logistics.
                    </h2>
                    <p className="text-neutral-500 mb-16 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
                        국내 1위 뷰티 B2B 통합 플랫폼에서 새로운 비즈니스 기회를 발견하고 <br className="hidden md:block" />
                        운영 효율성을 극대화하십시오.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <button className="w-full sm:w-auto bg-black text-white px-12 py-5 uppercase tracking-[0.2em] text-sm font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 group">
                            Get Started
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full sm:w-auto bg-white text-black border border-black/10 px-12 py-5 uppercase tracking-[0.2em] text-sm font-bold hover:bg-neutral-50 transition-all">
                            Inquiry
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer Branding */}
            <footer className="py-20 border-t border-black/5 bg-white">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-sm font-bold uppercase tracking-tighter font-sans">
                        COSMETIC-SALES ON
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-sans">
                        © 2026 Cosmetic Sales On. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </main>
    );
}
