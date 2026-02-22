"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";

interface AuthGuardProps {
    children: React.ReactNode;
}

/**
 * 인증 가드 컴포넌트
 * - 로그인되지 않은 사용자를 /login으로 리다이렉트
 * - 인증 로딩 중에는 스피너 표시
 */
export const AuthGuard = ({ children }: AuthGuardProps) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-4 border-ocean-teal/30 border-t-ocean-teal animate-spin" />
                    <p className="text-slate-400 text-sm">로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // 리다이렉트 중 화면 깜빡임 방지
        return null;
    }

    return <>{children}</>;
};
