const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Admin SDK setup (using env vars if possible, otherwise we might need a better way)
// But wait, the user doesn't have a service account JSON env var likely.
// Let's use the 'firebase' client-side library since dependencies are there.

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where, limit, serverTimestamp } = require('firebase/firestore');

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

async function createManualReport() {
    try {
        console.log("Fetching Admin user info...");
        const userSnap = await getDocs(query(collection(db, "users"), where("name", "==", "관리자"), limit(1)));
        if (userSnap.empty) throw new Error("Admin user not found");

        const userData = userSnap.docs[0].data();
        const userId = userSnap.docs[0].id;
        const userName = userData.name;
        const userTeam = userData.team || "Admin";

        const reportContent = `
# 📊 일간 업무 분석 보고서 (기능 복구용 매뉴얼 생성)

## 📅 작성 일자: 2026년 2월 24일
**작성자:** ${userName} (${userTeam})

---

## 🔹 주요 업무 성과
- **견적 생성 집중 (Total: 4건)**: 오늘 하루 동안 'Test Customer'를 대상으로 총 4건의 견적서(QT-2026-0047)를 집중적으로 발행했습니다. 이는 반복적인 견적 수정 과정이 있었음을 시사하며, 고객사의 피드백을 실시간으로 반영한 결과로 분석됩니다.
- **제품 데이터 검증**: 모든 견적에 'Test Product'가 포함되었으며, 초기 데이터 미입력 상태에서 점진적으로 고객 정보를 보완하며 견적 프로세스를 완성했습니다.

## 🔹 상세 활동 내역
1. **17:11**: 최종 견적서(QT-2026-0047) 발행 완료 (Test Customer)
2. **17:04**: 3차 견적 수정 및 데이터 업데이트
3. **16:49**: 2차 견적 수정 작업
4. **16:46**: 초기 견적 데이터 생성 및 제품 매핑 (미입력 고객)

## 🔹 향후 계획
- **견적서 최종 확인 및 발송**: 생성된 QT-2026-0047 견적서의 승인 절차를 마무리하고 고객사 담당자에게 공식 발송 예정입니다.
- **활동 로그 자동화 점검**: 현재 발생 중인 AI 보고서 생성 할당량 이슈를 해결하기 위해 시스템 최적화 작업을 병행할 예정입니다.

---
**Summary:** 오늘의 주요 활동은 Test Customer를 대상으로 한 집중적인 견적 발행 및 수정 작업(총 4건)이었습니다. 누락된 정보를 완벽히 보완하여 최종 견적 프로세스를 마무리했습니다.
`;

        console.log("Saving report to Firestore...");
        const reportData = {
            userId: userId,
            userName: userName,
            team: userTeam,
            type: "DAILY",
            title: "2026-02-24 일간 업무 보고서 (매뉴얼 생성)",
            summary: "Test Customer 대상 견적 4건 생성 및 수정 작업 집중 수행",
            content: reportContent,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, "reports"), reportData);
        console.log("Report successfully saved with ID:", docRef.id);

    } catch (e) {
        console.error("Error creating manual report:", e.message);
    }
    process.exit(0);
}

createManualReport();
