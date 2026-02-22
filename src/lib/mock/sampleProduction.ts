export type ProductionStep = "준비" | "제작" | "QC" | "완료" | "발송완료";

export interface SampleProduction {
    id: string;
    sampleRequestId: string;
    productName: string;
    customerName: string;
    currentStep: ProductionStep;
    spec: {
        container: string;
        content: string;
        formula: string;
    };
    files: { name: string; size: string; type: string }[];
    productionNotes?: string;
    barcode?: string;
    shippedAt?: string;
}

export const MOCK_PRODUCTION_DATA: SampleProduction[] = [
    {
        id: "prod-001",
        sampleRequestId: "sr-001",
        productName: "수분 크림 OEM 프로토타입 A",
        customerName: "아모레퍼시픽",
        currentStep: "제작",
        spec: {
            container: "50ml 유리 용기, 은색 캡",
            content: "고보습 불투명 크림 제형",
            formula: "W/O 에멀젼, 히알루론산 2% 함유"
        },
        files: [
            { name: "레시피_v1.pdf", size: "1.2MB", type: "pdf" },
            { name: "디자인_가이드.png", size: "3.5MB", type: "image" }
        ]
    },
    {
        id: "prod-002",
        sampleRequestId: "sr-002",
        productName: "선크림 SPF50+ 시제품",
        customerName: "한국콜마",
        currentStep: "QC",
        spec: {
            container: "40ml 튜브 용기",
            content: "백탁 없는 가벼운 에센스 제형",
            formula: "유기자차 혼합, 무기자차 5%"
        },
        files: [
            { name: "성분분석표.xlsx", size: "450KB", type: "excel" }
        ]
    }
];
