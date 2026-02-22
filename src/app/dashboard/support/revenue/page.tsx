"use client";
import { TrendingUp, Construction } from "lucide-react";

export default function SupportRevenuePage() {
    return <ComingSoon icon={TrendingUp} title="매출관리" description="월별 매출 실적, 팀별·고객별 집계, 목표 달성률 차트 기능을 개발 중입니다." />;
}

function ComingSoon({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-ocean-teal/10 flex items-center justify-center mb-2">
                <Icon className="w-8 h-8 text-ocean-teal" />
            </div>
            <div className="flex items-center gap-2 text-amber-400">
                <Construction className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">개발 중</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">{description}</p>
        </div>
    );
}
