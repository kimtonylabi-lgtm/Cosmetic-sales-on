'use server';

import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Lead, Deal } from '@/lib/firebase/db';

export async function seedMockData() {
    try {
        // 1. Clear existing leads/deals (Optional, but good for clean demo)
        const leadsSnap = await getDocs(collection(db, 'leads'));
        for (const d of leadsSnap.docs) {
            await deleteDoc(doc(db, 'leads', d.id));
        }
        const dealsSnap = await getDocs(collection(db, 'deals'));
        for (const d of dealsSnap.docs) {
            await deleteDoc(doc(db, 'deals', d.id));
        }

        // 2. Add Mock Leads
        const mockLeads = [
            { companyName: '태성산업', contactPerson: '김철수', status: 'HOT', score: 92 },
            { companyName: 'LG생활건강', contactPerson: '이영희', status: 'WARM', score: 75 },
            { companyName: '아모레퍼시픽', contactPerson: '박민준', status: 'COLD', score: 45 },
            { companyName: '올리브영', contactPerson: '정우성', status: 'HOT', score: 88 },
        ];

        for (const leadData of mockLeads) {
            const leadRef = await addDoc(collection(db, 'leads'), {
                ...leadData,
                assignedTo: 'dev-user',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // 3. Add Mock Deals for some leads
            if (leadData.status !== 'COLD') {
                await addDoc(collection(db, 'deals'), {
                    leadId: leadRef.id,
                    amount: Math.floor(Math.random() * 50000000) + 10000000,
                    stage: leadData.status === 'HOT' ? 'PROPOSAL' : 'PROSPECTING',
                    estimatedCloseDate: serverTimestamp(),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Seed error:', error);
        return { success: false, error: '시드 데이터 생성 실패' };
    }
}
