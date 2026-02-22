'use client';

import React from 'react';

export const SeedButton = () => {
    return (
        <button
            onClick={async () => {
                const { seedMockData } = await import('@/features/leads/seed-action');
                const res = await seedMockData();
                if (res.success) alert('데이터 시딩 완료! 새로고침 해주세요.');
            }}
            className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 hover:bg-ocean-teal hover:text-white transition-all uppercase tracking-tighter"
        >
            Seed Data
        </button>
    );
};
