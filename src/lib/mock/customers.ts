export type CustomerGrade = "VIP" | "일반" | "신규";

export interface ContactPerson {
    name: string;
    position: string;
    phone: string;
    email: string;
}

export interface Customer {
    id: string;
    companyName: string;
    industry: string;     // 주력 제품군
    grade: CustomerGrade;
    assignee: string;
    phone: string;
    address: string;
    registeredAt: string;
    contacts: ContactPerson[];
    orderIds: string[];   // 연결된 수주 ID
    sampleIds: string[];  // 연결된 샘플 ID
    memo: string;
}

export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: "c1", companyName: "아모레퍼시픽", industry: "스킨케어", grade: "VIP",
        assignee: "김영업", phone: "02-3453-7788", address: "서울특별시 용산구 한강대로 100",
        registeredAt: "2024-03-01",
        contacts: [
            { name: "이아름", position: "구매팀장", phone: "010-1234-5678", email: "arum@amorepacific.com" },
            { name: "박현우", position: "R&D 매니저", phone: "010-9876-5432", email: "hwpark@amorepacific.com" },
        ],
        orderIds: ["o1", "o5"], sampleIds: ["s1"],
        memo: "국내 최대 고객사. 분기별 신제품 OEM 정기 협의 진행.",
    },
    {
        id: "c2", companyName: "LG생활건강", industry: "선케어/바디케어", grade: "VIP",
        assignee: "이영업", phone: "02-6924-6901", address: "서울특별시 종로구 청계천로 30",
        registeredAt: "2024-05-15",
        contacts: [
            { name: "최상원", position: "소싱팀 대리", phone: "010-2345-6789", email: "choi@lgcare.com" },
        ],
        orderIds: ["o1"], sampleIds: [],
        memo: "선케어 라인 OEM 주력. 납기 준수 민감.",
    },
    {
        id: "c3", companyName: "코스맥스", industry: "메이크업", grade: "일반",
        assignee: "박영업", phone: "031-500-7700", address: "경기도 성남시 중원구 성남대로 997",
        registeredAt: "2025-01-10",
        contacts: [
            { name: "정민지", position: "구매담당", phone: "010-5678-1234", email: "mj@cosmax.com" },
        ],
        orderIds: [], sampleIds: [],
        memo: "메이크업 신제품 개발 활성화 중. 견적 검토 단계.",
    },
    {
        id: "c4", companyName: "한국콜마", industry: "선케어", grade: "신규",
        assignee: "이영업", phone: "02-350-7101", address: "서울특별시 중구 을지로 100",
        registeredAt: "2026-02-01",
        contacts: [
            { name: "신하늘", position: "개발팀", phone: "010-3456-7890", email: "sky@kolmar.co.kr" },
        ],
        orderIds: [], sampleIds: ["s2"],
        memo: "2026년 신규 유입 고객. 선케어 샘플 테스트 중.",
    },
    {
        id: "c5", companyName: "이니스프리", industry: "그린뷰티", grade: "VIP",
        assignee: "김영업", phone: "02-6040-3300", address: "서울특별시 용산구 이태원로 200",
        registeredAt: "2023-11-20",
        contacts: [
            { name: "오지수", position: "MD 팀장", phone: "010-7890-1234", email: "oh@innisfree.com" },
        ],
        orderIds: ["o4"], sampleIds: [],
        memo: "그린뷰티 컨셉 제품 전문. 친환경 패키징 요구사항 있음.",
    },
    {
        id: "c6", companyName: "클리오", industry: "메이크업", grade: "일반",
        assignee: "최영업", phone: "02-836-4005", address: "서울특별시 강서구 마곡중앙8로 71",
        registeredAt: "2025-06-01",
        contacts: [
            { name: "백승호", position: "구매부장", phone: "010-6543-2109", email: "baek@clio.co.kr" },
        ],
        orderIds: ["o2"], sampleIds: ["s4"],
        memo: "쿠션 파운데이션 수주 확정. 납기일 관리 중요.",
    },
];
