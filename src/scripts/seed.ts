import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// .env.local 에서 환경 변수 로드 (수동)
const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const env: any = {};
envFile.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) env[key.trim()] = value.join('=').trim().replace(/"/g, '');
});

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
}

const db = admin.firestore();

async function seedCsv(filePath: string, collectionName: string, mapping: (values: string[]) => any) {
    console.log(`Seeding ${collectionName} from ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());

    // 헤더 제외
    const dataRows = lines.slice(1);
    const batch = db.batch();

    for (const row of dataRows) {
        const values = row.split(',').map(v => v.trim());
        const data = mapping(values);
        if (data) {
            const docRef = db.collection(collectionName).doc();
            batch.set(docRef, {
                ...data,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
    }

    await batch.commit();
    console.log(`Successfully seeded ${dataRows.length} items into ${collectionName}.`);
}

async function run() {
    try {
        // 1. 원재료
        await seedCsv(
            path.join(process.cwd(), 'master_data', 'raw_materials.csv'),
            'masterRawMaterials',
            (v) => v.length >= 2 ? { name: v[0], price: parseFloat(v[1]) || 0 } : null
        );

        // 2. 부자재
        await seedCsv(
            path.join(process.cwd(), 'master_data', 'sub_materials.csv'),
            'masterSubMaterials',
            (v) => v.length >= 2 ? { name: v[0], price: parseFloat(v[1]) || 0 } : null
        );

        // 3. 사출 임률
        await seedCsv(
            path.join(process.cwd(), 'master_data', 'injection_rates.csv'),
            'masterInjectionRates',
            (v) => v.length >= 2 ? { tonnage: v[0], rate: parseFloat(v[1]) || 0 } : null
        );

        // 4. 펌프 엔진
        await seedCsv(
            path.join(process.cwd(), 'master_data', 'pump_engines.csv'),
            'masterPumpEngines',
            (v) => v.length >= 2 ? { name: v[0], price: parseFloat(v[1]) || 0 } : null
        );

        console.log('Seeding completed!');
    } catch (error) {
        console.error('Seeding failed:', error);
    }
}

run();
