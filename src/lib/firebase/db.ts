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

// Generic CRUD helpers
export const createDocument = async (collectionName: string, id: string, data: any) => {
    await setDoc(doc(db, collectionName, id), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

export const getDocument = async (collectionName: string, id: string) => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

// Types for our collections
export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: 'Admin' | 'Manager' | 'Member';
    team: 'Sales' | 'Sample' | 'Support' | 'Executive';
    createdAt: Timestamp;
}

export interface Lead {
    id: string;
    companyName: string;
    contactName: string;
    status: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
    value: number;
    assignedTo: string; // User UID
    createdAt: Timestamp;
}
