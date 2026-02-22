import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            // Note: In a real production environment, you should use a proper service account JSON
            // For now, we assume the environment handles credentials or we skip detailed private key setup
            // unless the user provides it.
        }),
    });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
