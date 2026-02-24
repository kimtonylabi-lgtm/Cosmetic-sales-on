"use client";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    User
} from "firebase/auth";
import { auth } from "./config";
import { createDocument } from "./db";
import type { UserRole, UserTeam } from "./db";
import { useState, useEffect } from "react";

// ─── 관리자 이메일 체크 ───────────────────────────────────────────
const getAdminEmails = (): string[] => {
    const raw = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
    return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
};

// ─── 회원가입 ────────────────────────────────────────────────────
export const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string,
    team: UserTeam
): Promise<User> => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    // Firebase Auth 프로필에 이름 저장
    await updateProfile(user, { displayName });

    // 관리자 이메일 여부에 따라 role 결정
    const adminEmails = getAdminEmails();
    const role: UserRole = adminEmails.includes(email.toLowerCase()) ? 'Admin' : 'Member';

    // Firestore users 컬렉션에 프로필 저장
    await createDocument("users", {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL: null,
        role,
        team,
        isDeptHead: false,
    }, user.uid);

    return user;
};

// ─── 로그인 ──────────────────────────────────────────────────────
export const loginWithEmail = async (
    email: string,
    password: string
): Promise<User> => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
};

// ─── 로그아웃 ────────────────────────────────────────────────────
export const logout = async (): Promise<void> => {
    await signOut(auth);
};

// ─── 인증 상태 훅 ────────────────────────────────────────────────
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { user, loading };
};
