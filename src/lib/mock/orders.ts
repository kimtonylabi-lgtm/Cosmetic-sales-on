export type OrderStatus = "검토중" | "확정" | "생산중" | "납품완료";

export interface Order {
    id: string;
    orderNo: string;
    customerName: string;
    productName: string;
    amount: number;
    quantity: number;
    status: OrderStatus;
    confirmedAt: string;
    deliveryDue: string;
    assignee: string;
    fromQuoteId?: string; // 견적서에서 전환된 경우
}

export const MOCK_ORDERS: Order[] = [
    { id: "o1", orderNo: "PO-2026-0031", customerName: "LG생활건강", productName: "선크림 SPF50+", amount: 580000000, quantity: 100000, status: "생산중", confirmedAt: "2026-02-16", deliveryDue: "2026-03-31", assignee: "김영업", fromQuoteId: "q2" },
    { id: "o2", orderNo: "PO-2026-0030", customerName: "클리오", productName: "쿠션 파운데이션 OEM", amount: 144000000, quantity: 20000, status: "확정", confirmedAt: "2026-02-19", deliveryDue: "2026-04-15", assignee: "이영업" },
    { id: "o3", orderNo: "PO-2026-0029", customerName: "미샤", productName: "수분 크림 OEM", amount: 63000000, quantity: 30000, status: "납품완료", confirmedAt: "2026-02-01", deliveryDue: "2026-02-20", assignee: "박영업" },
    { id: "o4", orderNo: "PO-2026-0028", customerName: "이니스프리", productName: "그린티 앰플 OEM", amount: 91500000, quantity: 15000, status: "검토중", confirmedAt: "2026-02-21", deliveryDue: "2026-05-01", assignee: "최영업" },
    { id: "o5", orderNo: "PO-2026-0027", customerName: "아모레퍼시픽", productName: "토너 OEM", amount: 66000000, quantity: 30000, status: "납품완료", confirmedAt: "2026-01-20", deliveryDue: "2026-02-10", assignee: "김영업" },
];
