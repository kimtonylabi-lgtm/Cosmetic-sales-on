import { SampleRequest, MOCK_SAMPLE_REQUESTS } from "./sampleRequests";

export type ReceptionStatus = "대기" | "승인" | "보류" | "반려";
export type Urgency = "긴급" | "높음" | "보통" | "낮음";

export interface SampleIntake extends SampleRequest {
    receptionStatus: ReceptionStatus;
    urgency: Urgency;
    rejectionReason?: string;
    assignedManager?: string;
}

// 영업팀의 요청 데이터를 기반으로 샘플팀 접수 데이터 생성
export const MOCK_INTAKE_DATA: SampleIntake[] = MOCK_SAMPLE_REQUESTS.map((req, index) => {
    const urgencies: Urgency[] = ["긴급", "높음", "보통", "낮음"];
    const receptionStatuses: ReceptionStatus[] = ["대기", "승인", "보류", "반려"];

    return {
        ...req,
        receptionStatus: index === 0 ? "대기" : (index % 3 === 0 ? "보류" : "대기"),
        urgency: index === 1 ? "긴급" : urgencies[index % 4],
        assignedManager: index % 2 === 0 ? "이개발" : "박연구",
    };
});

export const URGENCY_SCORE: Record<Urgency, number> = {
    "긴급": 100,
    "높음": 50,
    "보통": 20,
    "낮음": 0
};
