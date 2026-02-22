export type QuoteStatus = "작성중" | "발송" | "승인" | "반려";

export interface QuoteItem {
    id: string;
    productName: string;
    spec: string;        // 규격
    unitPrice: number;
    quantity: number;
}

export interface Quote {
    id: string;
    quoteNo: string;
    customerName: string;
    status: QuoteStatus;
    items: QuoteItem[];
    note: string;
    createdAt: string;
    validUntil: string;
}

export const MOCK_QUOTES: Quote[] = [
    {
        id: "q1", quoteNo: "QT-2026-0042", customerName: "아모레퍼시픽", status: "발송",
        items: [
            { id: "qi1", productName: "수분 크림 OEM", spec: "50mL / 개", unitPrice: 3500, quantity: 50000 },
            { id: "qi2", productName: "토너 OEM", spec: "150mL / 개", unitPrice: 2200, quantity: 30000 },
        ],
        note: "MOQ 3만개 이상 시 단가 적용", createdAt: "2026-02-20", validUntil: "2026-03-20",
    },
    {
        id: "q2", quoteNo: "QT-2026-0041", customerName: "LG생활건강", status: "승인",
        items: [
            { id: "qi3", productName: "선크림 SPF50+ OEM", spec: "60mL / 개", unitPrice: 5800, quantity: 100000 },
        ],
        note: "1차 발주 10만개 / 분기별 재발주", createdAt: "2026-02-15", validUntil: "2026-03-15",
    },
    {
        id: "q3", quoteNo: "QT-2026-0040", customerName: "코스맥스", status: "작성중",
        items: [
            { id: "qi4", productName: "쿠션 파운데이션 OEM", spec: "15g / 개", unitPrice: 7200, quantity: 20000 },
            { id: "qi5", productName: "립틴트 OEM", spec: "4g / 개", unitPrice: 1900, quantity: 50000 },
        ],
        note: "", createdAt: "2026-02-22", validUntil: "2026-03-22",
    },
    {
        id: "q4", quoteNo: "QT-2026-0039", customerName: "이니스프리", status: "반려",
        items: [
            { id: "qi6", productName: "그린티 세럼 OEM", spec: "30mL / 개", unitPrice: 6100, quantity: 15000 },
        ],
        note: "단가 재협상 요청", createdAt: "2026-02-10", validUntil: "2026-03-10",
    },
];
