// ─── 마감관리 모의 데이터 ─────────────────────────────────────────

export type ClosingStatus = "미마감" | "마감완료";

export type ClosingItem = {
    id: string;
    yearMonth: string;       // "2025-01" 형식
    label: string;           // 표시용 레이블 "2025년 1월"
    totalRevenue: number;    // 총 매출액 (원)
    collectedAmount: number; // 수금액 (원)
    totalCost: number;       // 총 비용 (원)
    operatingProfit: number; // 영업이익 (원)
    status: ClosingStatus;
    closedAt?: string;       // 마감 처리 일시
    closedBy?: string;       // 마감 처리자
};

export const MOCK_CLOSING_DATA: ClosingItem[] = [
    {
        id: "CL-2024-09",
        yearMonth: "2024-09",
        label: "2024년 9월",
        totalRevenue: 95000000,
        collectedAmount: 92000000,
        totalCost: 68000000,
        operatingProfit: 27000000,
        status: "마감완료",
        closedAt: "2024-10-05 11:30",
        closedBy: "김지원 팀장",
    },
    {
        id: "CL-2024-10",
        yearMonth: "2024-10",
        label: "2024년 10월",
        totalRevenue: 108000000,
        collectedAmount: 105000000,
        totalCost: 79000000,
        operatingProfit: 29000000,
        status: "마감완료",
        closedAt: "2024-11-04 14:15",
        closedBy: "김지원 팀장",
    },
    {
        id: "CL-2024-11",
        yearMonth: "2024-11",
        label: "2024년 11월",
        totalRevenue: 121000000,
        collectedAmount: 118000000,
        totalCost: 92000000,
        operatingProfit: 29000000,
        status: "마감완료",
        closedAt: "2024-12-03 10:00",
        closedBy: "박민우 과장",
    },
    {
        id: "CL-2024-12",
        yearMonth: "2024-12",
        label: "2024년 12월",
        totalRevenue: 145000000,
        collectedAmount: 140000000,
        totalCost: 110000000,
        operatingProfit: 35000000,
        status: "마감완료",
        closedAt: "2025-01-07 16:00",
        closedBy: "김지원 팀장",
    },
    {
        id: "CL-2025-01",
        yearMonth: "2025-01",
        label: "2025년 1월",
        totalRevenue: 98000000,
        collectedAmount: 90000000,
        totalCost: 74000000,
        operatingProfit: 24000000,
        status: "마감완료",
        closedAt: "2025-02-04 09:30",
        closedBy: "박민우 과장",
    },
    {
        id: "CL-2025-02",
        yearMonth: "2025-02",
        label: "2025년 2월",
        totalRevenue: 121880000,
        collectedAmount: 52730000,
        totalCost: 0,
        operatingProfit: 0,
        status: "미마감",
    },
];
