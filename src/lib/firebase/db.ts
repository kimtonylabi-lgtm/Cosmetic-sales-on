import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { db } from "./config";

// ─── 사용자 역할 & 팀 타입 ───────────────────────────────────────
export type UserRole = 'Admin' | 'Member';
export type UserTeam = 'Sales' | 'Sample' | 'Support';

export const TEAM_LABELS: Record<UserTeam, string> = {
    Sales: '영업팀',
    Sample: '샘플팀',
    Support: '판매지원팀',
};

// ─── 데이터 인터페이스 ────────────────────────────────────────────
export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    role: UserRole;
    team: UserTeam;
    isDeptHead: boolean; // 부서장 여부 (팀 권한 + 추가 부여)
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
}

export type LeadStatus = 'COLD' | 'WARM' | 'HOT';
export type DealStage = 'PROSPECTING' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
export type InteractionType = 'CALL' | 'EMAIL' | 'MEETING';

export interface Lead {
    id: string;
    companyName: string;
    contactPerson: string;
    score: number; // AI 스코어링
    status: LeadStatus;
    assignedTo: string; // User UID
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Deal {
    id: string;
    leadId: string;
    amount: number; // 예상 매출액
    stage: DealStage;
    estimatedCloseDate: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Interaction {
    id: string;
    dealId: string;
    type: InteractionType;
    notes: string;
    createdAt: Timestamp;
}

// ─── 범용 CRUD 헬퍼 ──────────────────────────────────────────────
export const createDocument = async <T extends object>(
    collectionName: string,
    id: string,
    data: T
) => {
    await setDoc(doc(db, collectionName, id), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

export const getDocument = async <T>(
    collectionName: string,
    id: string
): Promise<T | null> => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
};

export const updateDocument = async <T extends object>(
    collectionName: string,
    id: string,
    data: Partial<T>
) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

export const getAllDocuments = async <T>(
    collectionName: string
): Promise<T[]> => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
};
