"use client";

import React, { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getAllDocuments, MasterRawMaterial, MasterInjectionRate } from "@/lib/firebase/db";
import { Calculator, Save, AlertCircle } from "lucide-react";

interface QuoteDetailCalcSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApply: (data: { unitPrice: number; material: string }) => void;
    initialData?: any;
}

export function QuoteDetailCalcSheet({ open, onOpenChange, onApply, initialData }: QuoteDetailCalcSheetProps) {
    // ─── 마스터 데이터 상태 ──────────────────────────────────────────
    const [rawMaterials, setRawMaterials] = useState<MasterRawMaterial[]>([]);
    const [injectionRates, setInjectionRates] = useState<MasterInjectionRate[]>([]);

    // ─── 입력 필드 상태 ──────────────────────────────────────────────
    const [selectedMaterial, setSelectedMaterial] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [cavity, setCavity] = useState<string>("1");
    const [sprue, setSprue] = useState<string>("");
    const [cycleTime, setCycleTime] = useState<string>("");
    const [selectedTonnage, setSelectedTonnage] = useState<string>("");

    // 콤마 포맷팅 헬퍼
    const formatNumber = (val: string | number) => {
        if (!val && val !== 0) return "";
        const num = typeof val === "string" ? parseFloat(val.replace(/,/g, "")) : val;
        if (isNaN(num)) return "";
        return num.toLocaleString();
    };

    const parseNumber = (val: string) => {
        return val.replace(/,/g, "");
    };

    // 추가비용 및 공정별 선택
    const [processSettings, setProcessSettings] = useState({
        deposition: { active: false, price: "" },
        coating: { active: false, price: "" },
        printing: { active: false, price: "" },
        assembly: { active: false, price: "" },
        ultrasonic: { active: false, price: "" },
    });

    const [logistics, setLogistics] = useState({
        packaging: "",
        transport: "",
        overheadRate: 10, // 기본 10%
    });

    // 계산 결과
    const [results, setResults] = useState({
        materialCost: 0,
        injectionCost: 0,
        processCost: 0,
        logisticsCost: 0,
        subTotal: 0,
        totalPrice: 0
    });

    useEffect(() => {
        const load = async () => {
            const [raw, rates] = await Promise.all([
                getAllDocuments<MasterRawMaterial>("masterRawMaterials"),
                getAllDocuments<MasterInjectionRate>("masterInjectionRates")
            ]);
            setRawMaterials(raw);
            setInjectionRates(rates);
        };
        if (open) load();
    }, [open]);

    // ─── 계산 로직 ──────────────────────────────────────────────────
    useEffect(() => {
        const material = rawMaterials.find(m => m.name === selectedMaterial);
        const rateObj = injectionRates.find(r => r.tonnage === selectedTonnage);

        const mPrice = material?.price || 0;
        const iRate = rateObj?.rate || 0;

        const w = Number(weight) || 0;
        const c = Number(cavity) || 1;
        const s = Number(sprue) || 0;
        const ct = Number(cycleTime) || 0;

        // 1. 원재료비 = (무게 + (스프루/캐비티)) * 단가 * (1 + 0.07)
        // 단가 단위: 원/kg 이면 무게(g)를 kg으로 변환 (/1000)
        const materialCost = ((w + (s / c)) / 1000) * mPrice * 1.07;

        // 2. 사출비 = (임률 * CT) / 캐비티
        const injectionCost = (iRate * ct) / c;

        // 3. 후가공비 (각 공정별 로스율 반영)
        // 증착: 10%, 코팅: 5%, 인쇄: 3%, 조립: 3%, 초음파: 10%
        let pCost = 0;
        if (processSettings.deposition.active) pCost += (Number(processSettings.deposition.price) || 0) * 1.10;
        if (processSettings.coating.active) pCost += (Number(processSettings.coating.price) || 0) * 1.05;
        if (processSettings.printing.active) pCost += (Number(processSettings.printing.price) || 0) * 1.03;
        if (processSettings.assembly.active) pCost += (Number(processSettings.assembly.price) || 0) * 1.03;
        if (processSettings.ultrasonic.active) pCost += (Number(processSettings.ultrasonic.price) || 0) * 1.10;

        // 4. 물류비
        const logiCost = (Number(logistics.packaging) || 0) + (Number(logistics.transport) || 0);

        const subTotal = materialCost + injectionCost + pCost + logiCost;
        const total = subTotal * (1 + (logistics.overheadRate / 100));

        setResults({
            materialCost,
            injectionCost,
            processCost: pCost,
            logisticsCost: logiCost,
            subTotal,
            totalPrice: total
        });
    }, [selectedMaterial, weight, cavity, sprue, cycleTime, selectedTonnage, processSettings, logistics, rawMaterials, injectionRates]);

    const handleApply = () => {
        if (!selectedMaterial || !weight) {
            alert("필수 항목(원재료, 무게)을 입력해주세요.");
            return;
        }

        // 재질명 추출 (예: ABS SD0170 -> ABS)
        const baseMaterial = selectedMaterial.split(" ")[0];

        onApply({
            unitPrice: Math.round(results.totalPrice * 100) / 100, // 소수점 2자리
            material: baseMaterial
        });
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[450px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-primary" />
                        상세 단가 계산기
                    </SheetTitle>
                    <SheetDescription>
                        원재료, 사출기 사양 등을 입력하여 시스템 단가를 산출합니다.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    {/* 사출 사양 섹션 */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            사출 및 원재료 사양
                        </h3>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>원재료 선택</Label>
                                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="마스터 데이터에서 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rawMaterials.map(m => (
                                            <SelectItem key={m.id} value={m.name}>
                                                {m.name} ({m.price?.toLocaleString()}원/kg)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>제품 무게 (g)</Label>
                                    <Input
                                        type="text"
                                        value={formatNumber(weight)}
                                        onChange={(e) => setWeight(parseNumber(e.target.value))}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>캐비티 수 (C)</Label>
                                    <Input
                                        type="text"
                                        value={formatNumber(cavity)}
                                        onChange={(e) => setCavity(parseNumber(e.target.value))}
                                        placeholder="1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>스프루 무게 (g)</Label>
                                    <Input
                                        type="text"
                                        value={formatNumber(sprue)}
                                        onChange={(e) => setSprue(parseNumber(e.target.value))}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cycle Time (sec)</Label>
                                    <Input
                                        type="text"
                                        value={formatNumber(cycleTime)}
                                        onChange={(e) => setCycleTime(parseNumber(e.target.value))}
                                        placeholder="0.0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>사출기 톤수 (T)</Label>
                                <Select value={selectedTonnage} onValueChange={setSelectedTonnage}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="톤수 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {injectionRates.map(r => (
                                            <SelectItem key={r.id} value={r.tonnage}>{r.tonnage}T</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* 후가공 및 조립 섹션 */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            후가공 및 조립
                        </h3>
                        <div className="space-y-3">
                            {[
                                { id: "deposition", label: "증착 (Loss 10%)" },
                                { id: "coating", label: "코팅 (Loss 5%)" },
                                { id: "printing", label: "인쇄 (Loss 3%)" },
                                { id: "assembly", label: "조립 (Loss 3%)" },
                                { id: "ultrasonic", label: "초음파 (Loss 10%)" },
                            ].map((proc) => (
                                <div key={proc.id} className="grid grid-cols-[1fr_120px] gap-2 items-center">
                                    <Label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-slate-300"
                                            checked={processSettings[proc.id as keyof typeof processSettings].active}
                                            onChange={(e) => setProcessSettings({
                                                ...processSettings,
                                                [proc.id]: { ...processSettings[proc.id as keyof typeof processSettings], active: e.target.checked }
                                            })}
                                        />
                                        {proc.label}
                                    </Label>
                                    <Input
                                        type="text"
                                        disabled={!processSettings[proc.id as keyof typeof processSettings].active}
                                        value={formatNumber(processSettings[proc.id as keyof typeof processSettings].price)}
                                        onChange={(e) => setProcessSettings({
                                            ...processSettings,
                                            [proc.id]: { ...processSettings[proc.id as keyof typeof processSettings], price: parseNumber(e.target.value) }
                                        })}
                                        placeholder="0.00"
                                        className="h-8 text-right"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* 물류 및 기타 섹션 */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            물류 및 관리비
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>포장비 (원)</Label>
                                <Input
                                    type="text"
                                    value={formatNumber(logistics.packaging)}
                                    onChange={(e) => setLogistics({ ...logistics, packaging: parseNumber(e.target.value) })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>운반비 (원)</Label>
                                <Input
                                    type="text"
                                    value={formatNumber(logistics.transport)}
                                    onChange={(e) => setLogistics({ ...logistics, transport: parseNumber(e.target.value) })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex justify-between">
                                <span>일반 관리비율 (%)</span>
                                <span className="text-primary font-bold">{logistics.overheadRate}%</span>
                            </Label>
                            <Input
                                type="range"
                                min="0"
                                max="30"
                                step="1"
                                value={logistics.overheadRate}
                                onChange={(e) => setLogistics({ ...logistics, overheadRate: parseInt(e.target.value) })}
                                className="h-6"
                            />
                        </div>
                    </div>

                    {/* 계산 결과 요약 */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2 border border-border">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>원재료비 (Loss 7% 포함)</span>
                            <span>₩{results.materialCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>사출 가공비</span>
                            <span>₩{results.injectionCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>후가공 및 조립 (Loss 반영)</span>
                            <span>₩{results.processCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>물류비 합계</span>
                            <span>₩{results.logisticsCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold py-1 border-t border-border/50">
                            <span>소계 (관리비 제외)</span>
                            <span>₩{results.subTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <Separator className="my-1" />
                        <div className="flex justify-between font-bold text-lg text-primary">
                            <span>최종 산출 단가</span>
                            <span>₩{results.totalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 text-[10px] text-muted-foreground bg-primary/5 p-2 rounded">
                        <AlertCircle className="w-3 h-3 mt-0.5 text-primary" />
                        <p>
                            원재료비는 (무게 + 스프루/C) 기반이며 사출 로스 7%가 가산되었습니다.<br />
                            사출비는 선택된 톤수의 시간당 임률을 Cycle Time 기준으로 안분 계산합니다.
                        </p>
                    </div>
                </div>

                <SheetFooter>
                    <Button className="w-full gap-2" onClick={handleApply}>
                        <Save className="w-4 h-4" /> 견적서에 적용하기
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
