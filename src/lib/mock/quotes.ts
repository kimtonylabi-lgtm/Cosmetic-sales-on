export type QuoteStatus = "작성중" | "발송" | "승인" | "반려";

// ─── 후가공 타입 ──────────────────────────────────────────────────
export interface PostProcessing {
    deposition: string;      // 증착
    coating: string;         // 코팅
    printing: string;        // 인쇄
    postPrice: number | "";  // 후가공 단가 (빈 셀 시작)
}

export interface QuoteItem {
    id: string;
    partName: string;           // 부품명
    material: string;           // 재질
    color: string;              // 색상
    postProcessing: PostProcessing; // 후가공
    unitPrice: number | "";     // 단가 (빈 셀 시작)
}

export interface Quote {
    id: string;
    quoteNo: string;
    customerName: string;
    productName: string;   // 제품명
    moq: string;           // MOQ (천단위 구분 문자열)
    status: QuoteStatus;
    items: QuoteItem[];
    note: string;
    createdAt: string;
    validUntil: string;
}

const emptyPost = (): PostProcessing => ({
    deposition: "", coating: "", printing: "", postPrice: "",
});

export const MOCK_QUOTES: Quote[] = [
    {
        id: "q1", quoteNo: "QT-2026-0042", customerName: "아모레퍼시픽",
        productName: "수분 크림 OEM", moq: "30,000", status: "발송",
        items: [
            { id: "qi1", partName: "캡", material: "PP", color: "화이트", postProcessing: { deposition: "알루미늄 증착", coating: "UV 코팅", printing: "실크스크린", postPrice: 1500 }, unitPrice: 350 },
            { id: "qi2", partName: "바디", material: "PET", color: "투명", postProcessing: { deposition: "", coating: "무광 코팅", printing: "", postPrice: 800 }, unitPrice: 420 },
        ],
        note: "MOQ 3만개 이상 시 단가 적용", createdAt: "2026-02-20", validUntil: "2026-03-20",
    },
    {
        id: "q2", quoteNo: "QT-2026-0041", customerName: "LG생활건강",
        productName: "선크림 SPF50+ OEM", moq: "100,000", status: "승인",
        items: [
            { id: "qi3", partName: "튜브", material: "LDPE", color: "실버", postProcessing: { deposition: "크롬 증착", coating: "", printing: "핫스탬핑", postPrice: 2000 }, unitPrice: 580 },
        ],
        note: "1차 발주 10만개 / 분기별 재발주", createdAt: "2026-02-15", validUntil: "2026-03-15",
    },
    {
        id: "q3", quoteNo: "QT-2026-0040", customerName: "코스맥스",
        productName: "쿠션 파운데이션 OEM", moq: "20,000", status: "작성중",
        items: [
            { id: "qi4", partName: "케이스 상판", material: "ABS", color: "골드", postProcessing: { deposition: "", coating: "UV 코팅", printing: "금박", postPrice: 3000 }, unitPrice: 720 },
            { id: "qi5", partName: "립틴트 튜브", material: "PP", color: "핑크", postProcessing: emptyPost(), unitPrice: 190 },
        ],
        note: "", createdAt: "2026-02-22", validUntil: "2026-03-22",
    },
    {
        id: "q4", quoteNo: "QT-2026-0039", customerName: "이니스프리",
        productName: "그린티 세럼 OEM", moq: "15,000", status: "반려",
        items: [
            { id: "qi6", partName: "펌프 바디", material: "PET", color: "투명", postProcessing: emptyPost(), unitPrice: 610 },
        ],
        note: "단가 재협상 요청", createdAt: "2026-02-10", validUntil: "2026-03-10",
    },
];
