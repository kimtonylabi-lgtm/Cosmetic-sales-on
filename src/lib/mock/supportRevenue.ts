// ─── 매출관리 모의 데이터 ─────────────────────────────────────────

export type PaymentStatus = "수금완료" | "미수금" | "부분수금";

export type TaxInvoice = {
    id: string;
    invoiceNo: string;     // 세금계산서 번호
    customerName: string;  // 거래처명
    issuedDate: string;    // 발행일
    dueDate: string;       // 수금 예정일
    amount: number;        // 공급가액 (원)
    vat: number;           // 부가세 (원)
    totalAmount: number;   // 합계 (원)
    paymentStatus: PaymentStatus;
    collectedAmount: number; // 수금액 (원)
};

export type RevenueSummary = {
    totalRevenue: number;    // 총 매출액
    collectedAmount: number; // 수금액
    uncollected: number;     // 미수금
    invoiceCount: number;    // 세금계산서 발행 건수
};

export const MOCK_TAX_INVOICES: TaxInvoice[] = [
    {
        id: "TI-001",
        invoiceNo: "2025-02-0001",
        customerName: "(주)더마코스메틱",
        issuedDate: "2025-02-05",
        dueDate: "2025-02-28",
        amount: 12000000,
        vat: 1200000,
        totalAmount: 13200000,
        paymentStatus: "수금완료",
        collectedAmount: 13200000,
    },
    {
        id: "TI-002",
        invoiceNo: "2025-02-0002",
        customerName: "뷰티랩 코리아",
        issuedDate: "2025-02-07",
        dueDate: "2025-03-07",
        amount: 8500000,
        vat: 850000,
        totalAmount: 9350000,
        paymentStatus: "미수금",
        collectedAmount: 0,
    },
    {
        id: "TI-003",
        invoiceNo: "2025-02-0003",
        customerName: "글로우 스킨케어",
        issuedDate: "2025-02-10",
        dueDate: "2025-03-10",
        amount: 22000000,
        vat: 2200000,
        totalAmount: 24200000,
        paymentStatus: "부분수금",
        collectedAmount: 12000000,
    },
    {
        id: "TI-004",
        invoiceNo: "2025-02-0004",
        customerName: "자연주의 뷰티",
        issuedDate: "2025-02-12",
        dueDate: "2025-03-12",
        amount: 5500000,
        vat: 550000,
        totalAmount: 6050000,
        paymentStatus: "수금완료",
        collectedAmount: 6050000,
    },
    {
        id: "TI-005",
        invoiceNo: "2025-02-0005",
        customerName: "럭셔리 코스메틱",
        issuedDate: "2025-02-15",
        dueDate: "2025-03-15",
        amount: 35000000,
        vat: 3500000,
        totalAmount: 38500000,
        paymentStatus: "미수금",
        collectedAmount: 0,
    },
    {
        id: "TI-006",
        invoiceNo: "2025-02-0006",
        customerName: "클린뷰티 스튜디오",
        issuedDate: "2025-02-18",
        dueDate: "2025-03-18",
        amount: 9800000,
        vat: 980000,
        totalAmount: 10780000,
        paymentStatus: "수금완료",
        collectedAmount: 10780000,
    },
    {
        id: "TI-007",
        invoiceNo: "2025-02-0007",
        customerName: "K뷰티 글로벌",
        issuedDate: "2025-02-20",
        dueDate: "2025-03-20",
        amount: 18000000,
        vat: 1800000,
        totalAmount: 19800000,
        paymentStatus: "부분수금",
        collectedAmount: 9900000,
    },
];

/**
 * 요약 통계 동적 계산
 */
export function calcRevenueSummary(invoices: TaxInvoice[]): RevenueSummary {
    const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const collectedAmount = invoices.reduce((acc, inv) => acc + inv.collectedAmount, 0);
    const uncollected = totalRevenue - collectedAmount;

    return {
        totalRevenue,
        collectedAmount,
        uncollected,
        invoiceCount: invoices.length,
    };
}
