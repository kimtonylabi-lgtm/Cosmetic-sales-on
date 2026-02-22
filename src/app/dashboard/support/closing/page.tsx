"use client";
import { CalendarCheck, Construction } from "lucide-react";

export default function SupportClosingPage() {
    return <ComingSoon icon={CalendarCheck} title="마감관리" description="월마감 체크리스트, 정산 데이터 취합, 마감 보고서 생성 기능을 개발 중입니다." />;
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
