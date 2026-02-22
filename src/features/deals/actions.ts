'use server';

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Deal, DealStage } from '@/lib/firebase/db';

const DEALS_COLLECTION = 'deals';

export async function createDeal(data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
        const docRef = await addDoc(collection(db, DEALS_COLLECTION), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return { id: docRef.id, success: true };
    } catch (error) {
        console.error('Error creating deal:', error);
        return { success: false, error: '딜 생성에 실패했습니다.' };
    }
}

export async function getDealsByLead(leadId: string) {
    try {
        const q = query(collection(db, DEALS_COLLECTION), where('leadId', '==', leadId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Deal[];
    } catch (error) {
        console.error('Error fetching deals:', error);
        throw new Error('딜 목록을 불러오는 중 오류가 발생했습니다.');
    }
}

export async function updateDealStage(id: string, stage: DealStage) {
    try {
        const docRef = doc(db, DEALS_COLLECTION, id);
        await updateDoc(docRef, {
            stage,
            updatedAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating deal stage:', error);
        return { success: false, error: '딜 단계 변경에 실패했습니다.' };
    }
}
