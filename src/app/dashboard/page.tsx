export default function DashboardPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
                <p className="text-slate-500">환영합니다! 오늘 진행해야 할 주요 업무를 확인하세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sample Status Cards */}
                {[
                    { label: '신규 리드', value: '12', color: 'bg-blue-500' },
                    { label: '진행중인 딜', value: '8', color: 'bg-ocean-teal' },
                    { label: '샘플 요청건', value: '5', color: 'bg-amber-500' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                            <div className={`${stat.color} w-2 h-2 rounded-full mb-2`} />
                        </div>
                    </div>
                ))}

                {/* Recent Activity Placeholder */}
                <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-semibold text-slate-800 mb-4">최근 활동</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 items-start py-3 border-b border-slate-50 last:border-0">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-slate-800 font-medium">새로운 샘플 요청이 접수되었습니다.</p>
                                    <p className="text-xs text-slate-400">2시간 전 · 태성산업</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Placeholder */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-semibold text-slate-800 mb-4">빠른 작업</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <button className="text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-100">
                            + 새 리드 등록
                        </button>
                        <button className="text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-100">
                            + 샘플 요청서 작성
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
