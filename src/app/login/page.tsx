"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { loginWithEmail, signUpWithEmail } from "@/lib/firebase/auth";
import type { UserTeam } from "@/lib/firebase/db";
import { TEAM_LABELS } from "@/lib/firebase/db";

type Tab = "login" | "signup";

const TEAMS: { value: UserTeam; label: string }[] = [
    { value: "Sales", label: "영업팀" },
    { value: "Sample", label: "샘플팀" },
    { value: "Support", label: "판매지원팀" },
];

export default function LoginPage() {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // 로그인 필드
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // 회원가입 필드
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirm, setSignupConfirm] = useState("");
    const [signupTeam, setSignupTeam] = useState<UserTeam>("Sales");

    const clearError = () => setError("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await loginWithEmail(loginEmail, loginPassword);
            router.replace("/dashboard");
        } catch (err: any) {
            setError(mapFirebaseError(err.code));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!signupName.trim()) {
            setError("이름을 입력해주세요.");
            return;
        }
        if (signupPassword.length < 6) {
            setError("비밀번호는 6자 이상이어야 합니다.");
            return;
        }
        if (signupPassword !== signupConfirm) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        setIsLoading(true);
        try {
            await signUpWithEmail(signupEmail, signupPassword, signupName, signupTeam);
            router.replace("/dashboard");
        } catch (err: any) {
            setError(mapFirebaseError(err.code));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* 배경 글로우 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-ocean-teal/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* 로고 */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-teal to-ocean-dark flex items-center justify-center shadow-xl shadow-ocean-teal/20 mb-4">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">COSMETIC SALES ON</h1>
                    <p className="text-slate-400 text-sm mt-1">뷰티 B2B 영업 통합 플랫폼</p>
                </div>

                {/* 카드 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* 탭 */}
                    <div className="flex border-b border-slate-800">
                        {(["login", "signup"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); clearError(); }}
                                className={`flex-1 py-4 text-sm font-semibold transition-colors ${tab === t
                                        ? "text-ocean-teal border-b-2 border-ocean-teal bg-ocean-teal/5"
                                        : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                {t === "login" ? "로그인" : "회원가입"}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {/* 에러 메시지 */}
                        {error && (
                            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* ── 로그인 폼 ── */}
                        {tab === "login" && (
                            <form onSubmit={handleLogin} className="space-y-5">
                                <Field label="이메일">
                                    <input
                                        id="login-email"
                                        type="email"
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        placeholder="example@company.com"
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="비밀번호">
                                    <PasswordInput
                                        id="login-password"
                                        value={loginPassword}
                                        onChange={setLoginPassword}
                                        show={showPassword}
                                        onToggle={() => setShowPassword(!showPassword)}
                                    />
                                </Field>
                                <SubmitButton loading={isLoading} label="로그인" />
                            </form>
                        )}

                        {/* ── 회원가입 폼 ── */}
                        {tab === "signup" && (
                            <form onSubmit={handleSignup} className="space-y-4">
                                <Field label="이름">
                                    <input
                                        id="signup-name"
                                        type="text"
                                        required
                                        value={signupName}
                                        onChange={(e) => setSignupName(e.target.value)}
                                        placeholder="홍길동"
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="이메일">
                                    <input
                                        id="signup-email"
                                        type="email"
                                        required
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        placeholder="example@company.com"
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="소속 팀">
                                    <select
                                        id="signup-team"
                                        value={signupTeam}
                                        onChange={(e) => setSignupTeam(e.target.value as UserTeam)}
                                        className={inputCls}
                                    >
                                        {TEAMS.map((t) => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="비밀번호 (6자 이상)">
                                    <PasswordInput
                                        id="signup-password"
                                        value={signupPassword}
                                        onChange={setSignupPassword}
                                        show={showPassword}
                                        onToggle={() => setShowPassword(!showPassword)}
                                    />
                                </Field>
                                <Field label="비밀번호 확인">
                                    <input
                                        id="signup-confirm"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={signupConfirm}
                                        onChange={(e) => setSignupConfirm(e.target.value)}
                                        placeholder="비밀번호 재입력"
                                        className={inputCls}
                                    />
                                </Field>
                                <SubmitButton loading={isLoading} label="회원가입" />
                            </form>
                        )}
                    </div>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    © 2026 Cosmetic Sales On. All Rights Reserved.
                </p>
            </div>
        </div>
    );
}

// ─── 서브 컴포넌트 ───────────────────────────────────────────────

const inputCls =
    "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:border-transparent transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {label}
            </label>
            {children}
        </div>
    );
}

function PasswordInput({
    id,
    value,
    onChange,
    show,
    onToggle,
}: {
    id: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="relative">
            <input
                id={id}
                type={show ? "text" : "password"}
                required
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="••••••••"
                className={inputCls + " pr-12"}
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-ocean-teal hover:bg-ocean-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-ocean-teal/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    처리 중...
                </>
            ) : (
                label
            )}
        </button>
    );
}

// ─── Firebase 에러 코드 → 한국어 메시지 ──────────────────────────
function mapFirebaseError(code: string): string {
    const map: Record<string, string> = {
        "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
        "auth/invalid-email": "올바른 이메일 형식이 아닙니다.",
        "auth/weak-password": "비밀번호는 6자 이상이어야 합니다.",
        "auth/user-not-found": "등록되지 않은 이메일입니다.",
        "auth/wrong-password": "비밀번호가 올바르지 않습니다.",
        "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않습니다.",
        "auth/too-many-requests": "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
        "auth/network-request-failed": "네트워크 오류가 발생했습니다.",
    };
    return map[code] ?? `오류가 발생했습니다. (${code})`;
}
