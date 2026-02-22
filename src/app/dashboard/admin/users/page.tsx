"use client";

import React, { useEffect, useState } from "react";
import { Shield, Crown, RefreshCw, Users } from "lucide-react";
import { getAllDocuments, updateDocument } from "@/lib/firebase/db";
import type { UserProfile, UserTeam } from "@/lib/firebase/db";
import { useUserRole } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";
import { TEAM_LABELS } from "@/lib/firebase/db";

const ROLE_BADGE = {
    Admin: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    Member: "bg-slate-700/50 text-slate-400 border-slate-600/30",
};

export default function AdminUsersPage() {
    const { isAdmin, loading: roleLoading } = useUserRole();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        const data = await getAllDocuments<UserProfile>("users");
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        if (!roleLoading && isAdmin) {
            fetchUsers();
        }
    }, [isAdmin, roleLoading]);

    const toggleDeptHead = async (user: UserProfile) => {
        setSaving(user.uid);
        await updateDocument("users", user.uid, { isDeptHead: !user.isDeptHead });
        setUsers((prev) =>
            prev.map((u) => u.uid === user.uid ? { ...u, isDeptHead: !u.isDeptHead } : u)
        );
        setSaving(null);
    };

    const toggleRole = async (user: UserProfile) => {
        const newRole = user.role === "Admin" ? "Member" : "Admin";
        setSaving(user.uid);
        await updateDocument("users", user.uid, { role: newRole });
        setUsers((prev) =>
            prev.map((u) => u.uid === user.uid ? { ...u, role: newRole } : u)
        );
        setSaving(null);
    };

    if (roleLoading || loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 rounded-full border-4 border-ocean-teal/30 border-t-ocean-teal animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                접근 권한이 없습니다.
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        사용자 관리
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        팀원 목록 및 권한을 관리합니다.
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="flex items-center gap-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* 유저 카드 목록 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                이름 / 이메일
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                팀
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                역할
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                부서장
                            </th>
                            <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                관리
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {users.map((user) => (
                            <tr key={user.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-ocean-teal/15 flex items-center justify-center font-bold text-ocean-teal text-sm">
                                            {(user.displayName ?? user.email ?? "?")[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {user.displayName ?? "이름 없음"}
                                            </p>
                                            <p className="text-xs text-slate-400">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-slate-600 dark:text-slate-300">
                                        {TEAM_LABELS[user.team as UserTeam] ?? user.team}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                                        ROLE_BADGE[user.role]
                                    )}>
                                        <Shield className="w-3 h-3" />
                                        {user.role === "Admin" ? "관리자" : "팀원"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.isDeptHead ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-amber-500/15 text-amber-400 border-amber-500/30">
                                            <Crown className="w-3 h-3" />
                                            부서장
                                        </span>
                                    ) : (
                                        <span className="text-xs text-slate-500">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => toggleDeptHead(user)}
                                            disabled={saving === user.uid}
                                            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-40"
                                        >
                                            {user.isDeptHead ? "부서장 해제" : "부서장 지정"}
                                        </button>
                                        <button
                                            onClick={() => toggleRole(user)}
                                            disabled={saving === user.uid}
                                            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-40"
                                        >
                                            {user.role === "Admin" ? "팀원으로" : "관리자로"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    등록된 사용자가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
