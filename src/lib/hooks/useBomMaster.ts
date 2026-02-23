"use client";

import { useState, useCallback, useEffect } from "react";

// ─── BOM 마스터 데이터 카테고리 ──────────────────────────────────
export type BomMasterCategory =
    | "업체명"
    | "부품명"
    | "원료명"
    | "색상명"
    | "증착명"
    | "코팅명"
    | "인쇄명"
    // 견적서(발주서) 전용
    | "발주처"
    | "입고처"
    | "제품명";

const STORAGE_KEY = "bom_master_data_v1";

type BomMasterStore = Record<BomMasterCategory, string[]>;

const INITIAL_STORE: BomMasterStore = {
    업체명: [],
    부품명: ["캡", "바디", "펌프", "튜브", "라벨", "박스"],
    원료명: ["ABS", "PP", "PET", "HDPE", "LDPE", "유리"],
    색상명: ["투명", "백색", "흑색", "은색", "금색"],
    증착명: ["알루미늄 증착", "크롬 증착", "미러 코팅"],
    코팅명: ["UV 코팅", "무광 코팅", "유광 코팅", "실리콘 코팅"],
    인쇄명: ["실크스크린", "패드인쇄", "핫스탬핑", "금박", "은박", "라벨 부착"],
    // 견적서 전용
    발주처: [],
    입고처: [],
    제품명: [],
};

// ─── localStorage 유틸리티 ────────────────────────────────────────
function loadStore(): BomMasterStore {
    if (typeof window === "undefined") return INITIAL_STORE;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return INITIAL_STORE;
        const parsed = JSON.parse(saved) as Partial<BomMasterStore>;
        // 기본값과 저장값 병합
        return {
            업체명: [...new Set([...(INITIAL_STORE.업체명), ...(parsed.업체명 ?? [])])],
            부품명: [...new Set([...(INITIAL_STORE.부품명), ...(parsed.부품명 ?? [])])],
            원료명: [...new Set([...(INITIAL_STORE.원료명), ...(parsed.원료명 ?? [])])],
            색상명: [...new Set([...(INITIAL_STORE.색상명), ...(parsed.색상명 ?? [])])],
            증착명: [...new Set([...(INITIAL_STORE.증착명), ...(parsed.증착명 ?? [])])],
            코팅명: [...new Set([...(INITIAL_STORE.코팅명), ...(parsed.코팅명 ?? [])])],
            인쇄명: [...new Set([...(INITIAL_STORE.인쇄명), ...(parsed.인쇄명 ?? [])])],
            발주처: [...new Set([...(INITIAL_STORE.발주처), ...(parsed.발주처 ?? [])])],
            입고처: [...new Set([...(INITIAL_STORE.입고처), ...(parsed.입고처 ?? [])])],
            제품명: [...new Set([...(INITIAL_STORE.제품명), ...(parsed.제품명 ?? [])])],
        };
    } catch {
        return INITIAL_STORE;
    }
}

function saveStore(store: BomMasterStore): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
        // 저장 실패 시 무시
    }
}

// ─── BOM 마스터 훅 ────────────────────────────────────────────────
export function useBomMaster() {
    const [store, setStore] = useState<BomMasterStore>(INITIAL_STORE);

    // 클라이언트에서 localStorage 로드
    useEffect(() => {
        setStore(loadStore());
    }, []);

    /**
     * 특정 카테고리의 입력값과 매칭되는 후보 목록 반환
     */
    const getSuggestions = useCallback(
        (category: BomMasterCategory, query: string): string[] => {
            if (!query.trim()) return store[category].slice(0, 8);
            const q = query.toLowerCase();
            return store[category]
                .filter((item) => item.toLowerCase().includes(q))
                .slice(0, 8);
        },
        [store]
    );

    /**
     * 새 값을 마스터 데이터에 추가 (중복 제거)
     */
    const addToMaster = useCallback(
        (category: BomMasterCategory, value: string) => {
            const trimmed = value.trim();
            if (!trimmed) return;
            setStore((prev) => {
                if (prev[category].includes(trimmed)) return prev;
                const next = {
                    ...prev,
                    [category]: [trimmed, ...prev[category]],
                };
                saveStore(next);
                return next;
            });
        },
        []
    );

    /**
     * 폼 제출 시 여러 값을 한번에 마스터에 저장
     */
    const bulkSaveToMaster = useCallback(
        (entries: Partial<Record<BomMasterCategory, string | string[]>>) => {
            setStore((prev) => {
                const next = { ...prev };
                let changed = false;
                (Object.entries(entries) as [BomMasterCategory, string | string[]][]).forEach(
                    ([cat, val]) => {
                        const values = Array.isArray(val) ? val : [val];
                        values.forEach((v) => {
                            const trimmed = v?.trim();
                            if (trimmed && !next[cat].includes(trimmed)) {
                                next[cat] = [trimmed, ...next[cat]];
                                changed = true;
                            }
                        });
                    }
                );
                if (changed) saveStore(next);
                return changed ? next : prev;
            });
        },
        []
    );

    return { store, getSuggestions, addToMaster, bulkSaveToMaster };
}
