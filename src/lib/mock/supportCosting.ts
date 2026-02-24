// ─── 원가관리 모의 데이터 ─────────────────────────────────────────

export type MaterialTrend = {
    month: string;
    rawMaterial: number; // 원자재 단가 (원/kg)
    packaging: number;   // 부자재 단가 (원/ea)
    marginRate: number;  // 마진율 (%)
};

export type CostBreakdown = {
    id: string;
    productName: string;
    rawMaterial: number;  // 원자재비 (원)
    subMaterial: number;  // 부자재비 (원)
    laborCost: number;    // 인건비 (원)
    overhead: number;     // 간접비 (원)
    totalCost: number;    // 총원가 (원)
    sellPrice: number;    // 판매가 (원)
    marginRate: number;   // 마진율 (%)
};

export const MATERIAL_TREND_DATA: MaterialTrend[] = [
    { month: "24.09", rawMaterial: 4200, packaging: 850, marginRate: 18.5 },
    { month: "24.10", rawMaterial: 4500, packaging: 870, marginRate: 14.2 },
    { month: "24.11", rawMaterial: 5100, packaging: 910, marginRate: 7.8 },
    { month: "24.12", rawMaterial: 5800, packaging: 960, marginRate: -2.4 },
    { month: "25.01", rawMaterial: 5600, packaging: 940, marginRate: 1.1 },
    { month: "25.02", rawMaterial: 5200, packaging: 900, marginRate: 9.3 },
];

export const COST_BREAKDOWN_DATA: CostBreakdown[] = [
    {
        id: "CB-001",
        productName: "수분 세럼 100ml",
        rawMaterial: 18500,
        subMaterial: 4200,
        laborCost: 3100,
        overhead: 2800,
        totalCost: 28600,
        sellPrice: 35000,
        marginRate: 18.3,
    },
    {
        id: "CB-002",
        productName: "나이트 크림 50ml",
        rawMaterial: 22000,
        subMaterial: 5100,
        laborCost: 3500,
        overhead: 3200,
        totalCost: 33800,
        sellPrice: 38000,
        marginRate: 11.1,
    },
    {
        id: "CB-003",
        productName: "선크림 SPF50 80ml",
        rawMaterial: 31000,
        subMaterial: 5800,
        laborCost: 4200,
        overhead: 3900,
        totalCost: 44900,
        sellPrice: 42000,
        marginRate: -6.9,
    },
    {
        id: "CB-004",
        productName: "토너 200ml",
        rawMaterial: 12000,
        subMaterial: 3500,
        laborCost: 2600,
        overhead: 2200,
        totalCost: 20300,
        sellPrice: 28000,
        marginRate: 27.5,
    },
    {
        id: "CB-005",
        productName: "에센스 마스크 팩",
        rawMaterial: 8500,
        subMaterial: 6200,
        laborCost: 2100,
        overhead: 1800,
        totalCost: 18600,
        sellPrice: 18000,
        marginRate: -3.3,
    },
    {
        id: "CB-006",
        productName: "클렌징 폼 150ml",
        rawMaterial: 9800,
        subMaterial: 3100,
        laborCost: 2200,
        overhead: 1900,
        totalCost: 17000,
        sellPrice: 22000,
        marginRate: 22.7,
    },
];
