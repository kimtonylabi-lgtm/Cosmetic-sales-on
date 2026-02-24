'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function diagGeminiModels() {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return { success: false, error: "API_KEY_MISSING" };
    }

    console.log("AI_DIAG: Starting diagnosis...");
    try {
        // 1. REST API로 직접 모델 목록 조회 시도 (타임아웃 적용)
        console.log("AI_DIAG: Fetching models list from Google API...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        const listResponse = await fetch(listUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        const listData = await listResponse.json();
        console.log("AI_DIAG: List models response received");

        if (listData.error) {
            console.error("AI_DIAG: API Error:", listData.error);
            return {
                success: true,
                apiKeyPrefix: API_KEY.substring(0, 8),
                error: listData.error.message,
                rawListData: listData.error
            };
        }

        const availableFromList = listData.models
            ? listData.models.map((m: any) => m.name.replace("models/", ""))
            : [];

        console.log("AI_DIAG: Found models:", availableFromList);

        // 핵심 모델 한두개만 테스트 (시간 단축 및 행 방지)
        const modelsToTest = ["gemini-1.5-flash", "gemini-pro"].filter(m => availableFromList.includes(m));
        if (modelsToTest.length === 0 && availableFromList.length > 0) {
            modelsToTest.push(availableFromList[0]);
        }

        const results = [];
        const genAI = new GoogleGenerativeAI(API_KEY);

        for (const modelName of modelsToTest) {
            try {
                console.log(`AI_DIAG: Testing generation with ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });

                // 생성 테스트에도 타임아웃 적용 시도 (SDK 자체 지원 여부에 따라 다름)
                const result = await Promise.race([
                    model.generateContent("OK"),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))
                ]) as any;

                if (result && result.response) {
                    results.push({ name: modelName, success: true });
                    console.log(`AI_DIAG: ${modelName} test success`);
                }
            } catch (e: any) {
                console.warn(`AI_DIAG: ${modelName} test failed:`, e.message);
                results.push({ name: modelName, success: false, error: e.message });
            }
        }

        return {
            success: true,
            apiKeyPrefix: API_KEY.substring(0, 8),
            availableFromList,
            testResults: results
        };
    } catch (error: any) {
        console.error("AI_DIAG: Fatal Error:", error.message);
        return {
            success: false,
            error: error.name === 'AbortError' ? "연결 타임아웃 (서버 응답 없음)" : error.message,
            apiKeyPrefix: API_KEY ? API_KEY.substring(0, 8) : "MISSING"
        };
    }
}
