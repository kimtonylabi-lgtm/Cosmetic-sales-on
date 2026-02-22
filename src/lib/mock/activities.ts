export type ActivityType = "MEETING" | "EMAIL" | "CALL" | "NOTE";

export interface Activity {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    customerName: string;
    date: string; // ISO date string
    nextAction?: string;
    completed: boolean;
}

export const MOCK_ACTIVITIES: Activity[] = [
    { id: "a1", type: "MEETING", title: "아모레퍼시픽 신제품 미팅", description: "2026 S/S 시즌 신규 스킨케어 라인 OEM 제안 미팅. 생산 단가 및 납기일 논의.", customerName: "아모레퍼시픽", date: "2026-02-22T10:00:00", nextAction: "견적서 초안 발송", completed: true },
    { id: "a2", type: "CALL", title: "LG생활건강 납기 조율 통화", description: "3월 생산 스케줄 확인 및 납기 2주 연장 합의.", customerName: "LG생활건강", date: "2026-02-21T14:30:00", nextAction: "합의 내용 이메일 발송", completed: true },
    { id: "a3", type: "EMAIL", title: "코스맥스 견적서 발송", description: "브로셔 및 단가표 포함 견적서 이메일 발송 완료.", customerName: "코스맥스", date: "2026-02-20T09:15:00", nextAction: "회신 대기 (D+3)", completed: true },
    { id: "a4", type: "MEETING", title: "이니스프리 협상 미팅", description: "수량 10만개 이상 시 단가 5% 추가 할인 제안. 품질 기준서 공유.", customerName: "이니스프리", date: "2026-02-19T11:00:00", nextAction: "최종 계약서 검토", completed: true },
    { id: "a5", type: "CALL", title: "한국콜마 발굴 통화", description: "선케어 제품 OEM 수요 확인. 샘플 요청 의사 있음.", customerName: "한국콜마", date: "2026-02-18T16:00:00", nextAction: "샘플 신청 안내", completed: false },
    { id: "a6", type: "NOTE", title: "토니모리 방문 메모", description: "대표이사 면담. 립 케어 전문 라인 신규 론칭 계획 확인. 2분기 시작 목표.", customerName: "토니모리", date: "2026-02-17T13:00:00", nextAction: "제품 기획서 공유", completed: false },
];

export const MOCK_TODOS = [
    { id: "t1", label: "아모레퍼시픽 견적서 초안 발송", dueDate: "2026-02-23", done: false, priority: "HIGH" },
    { id: "t2", label: "LG생활건강 합의 이메일 작성", dueDate: "2026-02-23", done: false, priority: "HIGH" },
    { id: "t3", label: "코스맥스 회신 확인 (D+3)", dueDate: "2026-02-24", done: false, priority: "MEDIUM" },
    { id: "t4", label: "한국콜마 샘플 신청 안내", dueDate: "2026-02-24", done: true, priority: "LOW" },
];
