import { create } from "zustand";

// ─── 딜 단계 타입 ─────────────────────────────────────────────────
export type DealStage = "발굴" | "제안" | "협상" | "수주";

export interface KanbanDeal {
    id: string;
    customerName: string;
    amount: number;        // 예상 매출액 (원)
    assignee: string;      // 담당자
    lastUpdated: string;   // ISO date string (정체 감지용)
    priority: "HIGH" | "MEDIUM" | "LOW";
    tags: string[];
}

export type KanbanColumn = {
    id: DealStage;
    deals: KanbanDeal[];
};

// ─── 정체 감지 (7일 이상 미변경) ─────────────────────────────────
export const isStagnant = (lastUpdated: string): boolean => {
    const diffMs = Date.now() - new Date(lastUpdated).getTime();
    return diffMs > 7 * 24 * 60 * 60 * 1000;
};

// ─── 초기 데이터 ──────────────────────────────────────────────────
const INITIAL_COLUMNS: KanbanColumn[] = [
    {
        id: "발굴",
        deals: [
            { id: "d1", customerName: "아모레퍼시픽", amount: 85000000, assignee: "김영업", lastUpdated: "2026-02-20", priority: "HIGH", tags: ["스킨케어"] },
            { id: "d2", customerName: "코스맥스", amount: 42000000, assignee: "이영업", lastUpdated: "2026-02-10", priority: "MEDIUM", tags: ["메이크업"] },
            { id: "d3", customerName: "한국콜마", amount: 120000000, assignee: "박영업", lastUpdated: "2026-02-21", priority: "HIGH", tags: ["선케어"] },
        ],
    },
    {
        id: "제안",
        deals: [
            { id: "d4", customerName: "LG생활건강", amount: 230000000, assignee: "김영업", lastUpdated: "2026-02-08", priority: "HIGH", tags: ["바디케어"] },
            { id: "d5", customerName: "토니모리", amount: 55000000, assignee: "이영업", lastUpdated: "2026-02-18", priority: "LOW", tags: ["립케어"] },
        ],
    },
    {
        id: "협상",
        deals: [
            { id: "d6", customerName: "이니스프리", amount: 178000000, assignee: "박영업", lastUpdated: "2026-02-01", priority: "HIGH", tags: ["그린뷰티"] },
        ],
    },
    {
        id: "수주",
        deals: [
            { id: "d7", customerName: "클리오", amount: 95000000, assignee: "김영업", lastUpdated: "2026-02-19", priority: "MEDIUM", tags: ["메이크업"] },
            { id: "d8", customerName: "미샤", amount: 63000000, assignee: "최영업", lastUpdated: "2026-02-22", priority: "LOW", tags: ["스킨케어"] },
        ],
    },
];

// ─── Zustand 스토어 ───────────────────────────────────────────────
interface SalesStore {
    columns: KanbanColumn[];
    moveDeal: (dealId: string, fromStage: DealStage, toStage: DealStage) => void;
    addDeal: (stage: DealStage, deal: Omit<KanbanDeal, "id">) => void;
    getColumnTotal: (stage: DealStage) => number;
}

export const useSalesStore = create<SalesStore>((set, get) => ({
    columns: INITIAL_COLUMNS,

    moveDeal: (dealId, fromStage, toStage) => {
        set((state) => {
            const newColumns = state.columns.map((col) => ({ ...col, deals: [...col.deals] }));
            const fromCol = newColumns.find((c) => c.id === fromStage)!;
            const toCol = newColumns.find((c) => c.id === toStage)!;
            const dealIndex = fromCol.deals.findIndex((d) => d.id === dealId);
            if (dealIndex === -1) return state;
            const [deal] = fromCol.deals.splice(dealIndex, 1);
            // 이동 시 lastUpdated 갱신
            toCol.deals.push({ ...deal, lastUpdated: new Date().toISOString() });
            return { columns: newColumns };
        });
    },

    addDeal: (stage, dealData) => {
        set((state) => {
            const newDeal: KanbanDeal = {
                ...dealData,
                id: `d${Date.now()}`,
                lastUpdated: new Date().toISOString(),
            };
            return {
                columns: state.columns.map((col) =>
                    col.id === stage ? { ...col, deals: [...col.deals, newDeal] } : col
                ),
            };
        });
    },

    getColumnTotal: (stage) => {
        const col = get().columns.find((c) => c.id === stage);
        return col?.deals.reduce((sum, d) => sum + d.amount, 0) ?? 0;
    },
}));
