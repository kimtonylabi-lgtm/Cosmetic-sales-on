"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Settings, UserCircle, LogOut } from 'lucide-react';
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { SeedButton } from "@/components/dashboard/SeedButton";
import { AuthGuard } from "@/components/providers/AuthGuard";
import { logout } from "@/lib/firebase/auth";
import { useAuth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

function DashboardHeader() {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-ocean-teal to-blue-600 bg-clip-text text-transparent">
                    Overview
                </h2>
            </div>
            <div className="flex items-center gap-4">
                <SeedButton />
                <ThemeToggle />

                {/* 사용자 정보 */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-ocean-teal/20 border border-ocean-teal/30 flex items-center justify-center">
                        <UserCircle className="w-5 h-5 text-ocean-teal" />
                    </div>
                    {user?.displayName && (
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:block">
                            {user.displayName}
                        </span>
                    )}
                    <button
                        onClick={handleLogout}
                        title="로그아웃"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
                {/* 사이드바 */}
                <Sidebar />

                {/* 메인 콘텐츠 */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <DashboardHeader />

                    {/* 콘텐츠 영역 */}
                    <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
