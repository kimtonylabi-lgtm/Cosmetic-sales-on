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
import { Lead, LeadStatus } from '@/lib/firebase/db';

const LEADS_COLLECTION = 'leads';

export async function createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
        const docRef = await addDoc(collection(db, LEADS_COLLECTION), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return { id: docRef.id, success: true };
    } catch (error) {
        console.error('Error creating lead:', error);
        return { success: false, error: '리드 생성에 실패했습니다.' };
    }
}

export async function getLeads() {
    try {
        const querySnapshot = await getDocs(collection(db, LEADS_COLLECTION));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Lead[];
    } catch (error) {
        console.error('Error fetching leads:', error);
        throw new Error('리드 목록을 불러오는 중 오류가 발생했습니다.');
    }
}

export async function updateLead(id: string, data: Partial<Lead>) {
    try {
        const docRef = doc(db, LEADS_COLLECTION, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating lead:', error);
        return { success: false, error: '리드 수정에 실패했습니다.' };
    }
}

export async function deleteLead(id: string) {
    try {
        await deleteDoc(doc(db, LEADS_COLLECTION, id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting lead:', error);
        return { success: false, error: '리드 삭제에 실패했습니다.' };
    }
}
