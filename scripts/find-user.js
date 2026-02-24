const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, limit, query, where } = require("firebase/firestore");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function findUser() {
    try {
        console.log("Searching for Admin user...");
        const q = query(collection(db, "users"), where("name", "==", "관리자"), limit(1));
        const snap = await getDocs(q);

        if (snap.empty) {
            console.log("Admin user not found, listing first 10 users...");
            const q2 = query(collection(db, "users"), limit(10));
            const snap2 = await getDocs(q2);
            console.log(JSON.stringify(snap2.docs.map(d => ({ id: d.id, ...d.data() })), null, 2));
        } else {
            console.log(JSON.stringify(snap.docs.map(d => ({ id: d.id, ...d.data() })), null, 2));
        }
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

findUser();
