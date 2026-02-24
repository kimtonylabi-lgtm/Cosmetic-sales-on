// ─── 출고관리 모의 데이터 ─────────────────────────────────────────

export type ShippingStatus = "준비중" | "출고완료" | "배송중" | "배송완료";

export const SHIPPING_STATUS_ORDER: ShippingStatus[] = [
    "준비중",
    "출고완료",
    "배송중",
    "배송완료",
];

export type ShipmentItem = {
    id: string;
    shipmentNo: string;    // 출고 번호
    customerName: string;  // 거래처명
    productName: string;   // 제품명
    quantity: number;      // 수량
    shippedDate: string;   // 출고일
    estimatedDelivery: string; // 배송 예정일
    status: ShippingStatus;
    trackingNo: string;    // 운송장 번호
    carrier: string;       // 택배사
};

export const MOCK_SHIPMENTS: ShipmentItem[] = [
    {
        id: "SH-001",
        shipmentNo: "OUT-250210-001",
        customerName: "(주)더마코스메틱",
        productName: "수분 세럼 100ml × 500ea",
        quantity: 500,
        shippedDate: "2025-02-10",
        estimatedDelivery: "2025-02-12",
        status: "배송완료",
        trackingNo: "123456789012",
        carrier: "CJ대한통운",
    },
    {
        id: "SH-002",
        shipmentNo: "OUT-250213-001",
        customerName: "뷰티랩 코리아",
        productName: "나이트 크림 50ml × 300ea",
        quantity: 300,
        shippedDate: "2025-02-13",
        estimatedDelivery: "2025-02-15",
        status: "배송완료",
        trackingNo: "234567890123",
        carrier: "한진택배",
    },
    {
        id: "SH-003",
        shipmentNo: "OUT-250218-001",
        customerName: "글로우 스킨케어",
        productName: "선크림 SPF50 80ml × 1,000ea",
        quantity: 1000,
        shippedDate: "2025-02-18",
        estimatedDelivery: "2025-02-20",
        status: "배송중",
        trackingNo: "345678901234",
        carrier: "로젠택배",
    },
    {
        id: "SH-004",
        shipmentNo: "OUT-250219-001",
        customerName: "자연주의 뷰티",
        productName: "토너 200ml × 200ea",
        quantity: 200,
        shippedDate: "2025-02-19",
        estimatedDelivery: "2025-02-21",
        status: "출고완료",
        trackingNo: "456789012345",
        carrier: "CJ대한통운",
    },
    {
        id: "SH-005",
        shipmentNo: "OUT-250220-001",
        customerName: "럭셔리 코스메틱",
        productName: "에센스 마스크 팩 × 2,000ea",
        quantity: 2000,
        shippedDate: "2025-02-20",
        estimatedDelivery: "2025-02-22",
        status: "배송중",
        trackingNo: "567890123456",
        carrier: "한진택배",
    },
    {
        id: "SH-006",
        shipmentNo: "OUT-250221-001",
        customerName: "클린뷰티 스튜디오",
        productName: "클렌징 폼 150ml × 150ea",
        quantity: 150,
        shippedDate: "2025-02-21",
        estimatedDelivery: "2025-02-23",
        status: "준비중",
        trackingNo: "-",
        carrier: "-",
    },
    {
        id: "SH-007",
        shipmentNo: "OUT-250222-001",
        customerName: "K뷰티 글로벌",
        productName: "수분 세럼 100ml × 3,000ea",
        quantity: 3000,
        shippedDate: "2025-02-22",
        estimatedDelivery: "2025-02-25",
        status: "준비중",
        trackingNo: "-",
        carrier: "-",
    },
];
