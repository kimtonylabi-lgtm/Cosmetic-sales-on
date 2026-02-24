import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    updateDoc,
    deleteDoc,
    addDoc,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { db } from "./config";

// ─── 사용자 역할 & 팀 타입 ───────────────────────────────────────
export type UserRole = 'Admin' | 'Member';
export type UserTeam = 'Sales' | 'Sample' | 'Support';

// (중략 - 타입 정의들)

// ─── 마스터 데이터 타입 ──────────────────────────────────────────
export interface MasterRawMaterial {
    id?: string;
    name: string;      // 원재료명
    vendor: string;    // 제조사
    price: number;     // 단가 (원/kg)
    updatedAt?: Timestamp;
}

export interface MasterSubMaterial {
    id?: string;
    name: string;      // 부자재명
    spec?: string;     // 규격
    price: number;     // 단가 (원)
    updatedAt?: Timestamp;
}

export interface MasterPumpEngine {
    id?: string;
    name: string;      // 엔진명
    spec?: string;     // 규격
    price: number;     // 단가 (원)
    updatedAt?: Timestamp;
}

export interface MasterInjectionRate {
    id?: string;
    tonnage: string;   // 톤수 (T)
    rate: number;      // 임률 (원/sec 또는 원/hr 등 사용자 입력값)
    updatedAt?: Timestamp;
}

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

// ─── 활동 로그 (WorkLog) ──────────────────────────────────────────
export type WorkLogCategory = 'System' | 'Manual';

export interface WorkLog {
    id: string;
    userId: string;
    userName: string;
    team: UserTeam;
    category: WorkLogCategory;
    action: string;      // 예: '견적 생성', '주문 확정'
    content: string;     // 상세 내용 요약
    metadata?: Record<string, any>;
    createdAt: Timestamp;
}

// ─── 보고서 (Report) ──────────────────────────────────────────────
export type ReportType = 'DAILY' | 'WEEKLY';
export type ReportStatus = 'TEMP' | 'FINAL';

export interface Report {
    id: string;
    userId: string;
    userName: string;
    team: UserTeam;
    type: ReportType;
    targetDate: string;  // '2026-02-24'
    content: string;     // AI 생성 본문 (Markdown)
    summary: string;     // 핵심 요약
    status: ReportStatus;
    feedback?: string;   // 부서장 피드백
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * 특정 사용자의 활동 로그를 조회합니다.
 */
export const queryWorkLogs = async (userId: string, team?: UserTeam): Promise<WorkLog[]> => {
    try {
        let q = query(
            collection(db, "workLogs"),
            where("userId", "==", userId)
            // 인덱스 전파 지연으로 인해 정렬 제거
        );

        if (team && !userId) {
            q = query(
                collection(db, "workLogs"),
                where("team", "==", team)
            );
        }

        const querySnapshot = await getDocs(q);
        const logs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkLog));

        // 데이터가 표시되도록 클라이언트 사전 정렬
        return logs.sort((a, b) => {
            const timeA = (a.createdAt as any)?.seconds || 0;
            const timeB = (b.createdAt as any)?.seconds || 0;
            return timeB - timeA;
        });
    } catch (error) {
        console.error("QueryWorkLogs Error:", error);
        throw error;
    }
};

/**
 * 특정 사용자의 보고서를 조회합니다.
 */
export const queryReports = async (userId: string, team?: UserTeam): Promise<Report[]> => {
    try {
        let q = query(
            collection(db, "reports"),
            where("userId", "==", userId)
        );

        if (team && !userId) {
            q = query(
                collection(db, "reports"),
                where("team", "==", team)
            );
        }

        const querySnapshot = await getDocs(q);
        const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));

        return reports.sort((a, b) => {
            const timeA = (a.createdAt as any)?.seconds || 0;
            const timeB = (b.createdAt as any)?.seconds || 0;
            return timeB - timeA;
        });
    } catch (error) {
        console.error("QueryReports Error:", error);
        throw error;
    }
};

export const createDocument = async <T extends object>(
    collectionName: string,
    data: T,
    id?: string
) => {
    if (id) {
        await setDoc(doc(db, collectionName, id), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return id;
    } else {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }
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

export const deleteDocument = async (
    collectionName: string,
    id: string
) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
};

export const getAllDocuments = async <T>(
    collectionName: string
): Promise<T[]> => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
};

