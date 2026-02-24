// ─── 샘플 요청 타입 ──────────────────────────────────────────────
export type SampleStatus = "대기" | "제작중" | "발송완료";
export type SampleType = "무상" | "유상";
export type SampleKind = "랜덤" | "CT" | "디자인";

// 디자인 샘플 전용 세부 스펙 (specs JSON 필드에 매핑)
export interface DesignSpecs {
    material: string;           // 용기/패키징 재질
    finishings: string[];       // 인쇄 및 후가공 사양 (다중 선택)
    pantoneColor: string;       // 팬톤 컬러 코드
    designNotes: string;        // 기타 디자인 요청사항
    artworkFileName: string;    // 첨부 원고 파일명 (모의)
}

export interface SampleRequest {
    id: string;
    requestNo: string;
    customerName: string;
    productName: string;
    quantity: number;
    sampleType: SampleType;
    sampleKind: SampleKind;
    status: SampleStatus;
    requestedBy: string;
    requestedAt: string;
    note: string;
    specs?: DesignSpecs | null;  // 디자인 샘플 시에만 존재
}

export const MOCK_SAMPLE_REQUESTS: SampleRequest[] = [
    {
        id: "s1",
        requestNo: "SR-2026-0018",
        customerName: "아모레퍼시픽",
        productName: "수분 크림 OEM 프로토타입 A",
        quantity: 30,
        sampleType: "무상",
        sampleKind: "랜덤",
        status: "발송완료",
        requestedBy: "김영업",
        requestedAt: "2026-02-10",
        note: "1차 검토용",
        specs: null,
    },
    {
        id: "s2",
        requestNo: "SR-2026-0019",
        customerName: "한국콜마",
        productName: "선크림 SPF50+ 시제품",
        quantity: 60,
        sampleType: "유상",
        sampleKind: "CT",
        status: "제작중",
        requestedBy: "이영업",
        requestedAt: "2026-02-15",
        note: "내부 품질 테스트 포함",
        specs: null,
    },
    {
        id: "s3",
        requestNo: "SR-2026-0020",
        customerName: "토니모리",
        productName: "립틴트 컬러 12종 패키징",
        quantity: 12,
        sampleType: "무상",
        sampleKind: "디자인",
        status: "대기",
        requestedBy: "박영업",
        requestedAt: "2026-02-21",
        note: "컬러칩 확인 후 최종 선정",
        specs: {
            material: "유리",
            finishings: ["실크스크린", "금박/은박"],
            pantoneColor: "PMS 812 C",
            designNotes: "로고 위치 정중앙, 폰트 별도 지정 파일 참고",
            artworkFileName: "liptint_artwork_v2.ai",
        },
    },
    {
        id: "s4",
        requestNo: "SR-2026-0021",
        customerName: "클리오",
        productName: "쿠션 파운데이션 프로토타입",
        quantity: 55,
        sampleType: "유상",
        sampleKind: "랜덤",
        status: "대기",
        requestedBy: "김영업",
        requestedAt: "2026-02-22",
        note: "커버력 테스트 위주",
        specs: null,
    },
];

export const SAMPLE_STEPS: SampleStatus[] = ["대기", "제작중", "발송완료"];

// ─── 후가공 옵션 목록 ─────────────────────────────────────────────
export const FINISHING_OPTIONS = [
    "실크스크린",
    "금박/은박",
    "라벨 부착",
    "무광 코팅",
    "유광 코팅",
    "엠보싱/디보싱",
    "UV 코팅",
] as const;

// ─── 재질 옵션 목록 ───────────────────────────────────────────────
export const MATERIAL_OPTIONS = [
    "유리",
    "PET",
    "PP",
    "HDPE",
    "친환경 종이",
    "알루미늄",
    "기타",
] as const;
