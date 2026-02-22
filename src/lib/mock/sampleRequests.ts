export type SampleStatus = "대기" | "제작중" | "발송완료";
export type SampleType = "무상" | "유상";

export interface SampleRequest {
    id: string;
    requestNo: string;
    customerName: string;
    productName: string;
    quantity: number;
    sampleType: SampleType;
    status: SampleStatus;
    requestedBy: string;
    requestedAt: string;
    note: string;
}

export const MOCK_SAMPLE_REQUESTS: SampleRequest[] = [
    { id: "s1", requestNo: "SR-2026-0018", customerName: "아모레퍼시픽", productName: "수분 크림 OEM 프로토타입 A", quantity: 30, sampleType: "무상", status: "발송완료", requestedBy: "김영업", requestedAt: "2026-02-10", note: "1차 검토용" },
    { id: "s2", requestNo: "SR-2026-0019", customerName: "한국콜마", productName: "선크림 SPF50+ 시제품", quantity: 60, sampleType: "유상", status: "제작중", requestedBy: "이영업", requestedAt: "2026-02-15", note: "내부 품질 테스트 포함" },
    { id: "s3", requestNo: "SR-2026-0020", customerName: "토니모리", productName: "립틴트 컬러 12종", quantity: 12, sampleType: "무상", status: "대기", requestedBy: "박영업", requestedAt: "2026-02-21", note: "컬러칩 확인 후 최종 선정" },
    { id: "s4", requestNo: "SR-2026-0021", customerName: "클리오", productName: "쿠션 파운데이션 프로토타입", quantity: 55, sampleType: "유상", status: "대기", requestedBy: "김영업", requestedAt: "2026-02-22", note: "커버력 테스트 위주" },
];

export const SAMPLE_STEPS: SampleStatus[] = ["대기", "제작중", "발송완료"];
