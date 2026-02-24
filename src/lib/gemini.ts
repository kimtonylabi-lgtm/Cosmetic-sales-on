'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

// genAI 초기화는 함수 내부에서 수행하도록 변경 (환경 변수 지연 로드 대응)

/**
 * 활동 로그를 기반으로 AI 보고서를 생성합니다 (Server Action).
 */
export async function generateAIReport(logs: any[], type: 'DAILY' | 'WEEKLY') {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log(`AI_REPORT_ACTION: Starting report generation (Type: ${type}, Logs: ${logs.length})`);

    if (!API_KEY) {
        console.error("AI_REPORT_ACTION: API_KEY is missing!");
        throw new Error("API 키가 설정되지 않았습니다. 환경 변수를 확인해 주세요.");
    }

    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash"
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`AI_REPORT_ACTION: Attempting with model ${modelName} via REST...`);

            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

            const prompt = `
                다음은 사용자의 업무 활동 로그 데이터(JSON)입니다:
                ${JSON.stringify(logs, null, 2)}

                이 데이터를 분석하여 전문적인 ${type === 'DAILY' ? '일간' : '주간'} 업무 보고서를 한국어로 작성해줘.
                
                [지침]
                1. Markdown 형식을 사용해줘.
                2. 주요 성과, 진행 중인 사항, 향후 계획 세션으로 구분해줘.
                3. 로그에 나타난 구체적인 수치나 고객사명, 제품명을 언급하여 구체적으로 작성해줘.
                4. 말투는 정중하고 전문적인 비즈니스 문체(~입니다, ~함)를 사용해줘.
                5. 한 줄 요약(Summary: ...)도 마지막에 포함해줘.
            `;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 40000);

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const msg = errorData.error?.message || `HTTP ${response.status}`;
                throw new Error(msg);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                console.log(`AI_REPORT_ACTION: Successfully generated using ${modelName} (Length: ${text.length})`);
                return text;
            }
        } catch (error: any) {
            console.error(`AI_REPORT_ACTION: Model ${modelName} FAILED:`, error.message);
            lastError = error;
            if (error.message?.includes("429") || error.message?.includes("quota")) break;
            continue;
        }
    }

    throw new Error(`AI 보고서 생성 실패: ${lastError?.message || "모델을 찾을 수 없거나 연결이 불가능합니다."}`);
}
