"use client";

import React, { useEffect, useState } from "react";
import {
    Package,
    Settings,
    Droplets,
    Zap,
    Plus,
    Upload,
    Trash2,
    Edit2,
    Save,
    X,
    Database
} from "lucide-react";
import {
    getAllDocuments,
    createDocument,
    updateDocument,
    deleteDocument
} from "@/lib/firebase/db";
import type {
    MasterRawMaterial,
    MasterSubMaterial,
    MasterPumpEngine,
    MasterInjectionRate
} from "@/lib/firebase/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MasterDataPage() {
    const [activeTab, setActiveTab] = useState("raw-materials");
    const [rawMaterials, setRawMaterials] = useState<MasterRawMaterial[]>([]);
    const [subMaterials, setSubMaterials] = useState<MasterSubMaterial[]>([]);
    const [pumpEngines, setPumpEngines] = useState<MasterPumpEngine[]>([]);
    const [injectionRates, setInjectionRates] = useState<MasterInjectionRate[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [raw, sub, pump, rate] = await Promise.all([
                getAllDocuments<MasterRawMaterial>("masterRawMaterials"),
                getAllDocuments<MasterSubMaterial>("masterSubMaterials"),
                getAllDocuments<MasterPumpEngine>("masterPumpEngines"),
                getAllDocuments<MasterInjectionRate>("masterInjectionRates")
            ]);
            setRawMaterials(raw);
            setSubMaterials(sub);
            setPumpEngines(pump);
            setInjectionRates(rate);
        } catch (error) {
            console.error("Error fetching master data:", error);
            alert("데이터를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Database className="w-8 h-8 text-primary" />
                        마스터 데이터 관리
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        원재료, 부자재, 사출 임률 등 원가 계산에 필요한 기준 데이터를 관리합니다.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchData}>
                        새로고침
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="raw-materials" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                    <TabsTrigger value="raw-materials" className="gap-2">
                        <Droplets className="w-4 h-4" /> 원재료
                    </TabsTrigger>
                    <TabsTrigger value="sub-materials" className="gap-2">
                        <Package className="w-4 h-4" /> 부자재
                    </TabsTrigger>
                    <TabsTrigger value="pumps" className="gap-2">
                        <Zap className="w-4 h-4" /> 펌프/엔진
                    </TabsTrigger>
                    <TabsTrigger value="injection" className="gap-2">
                        <Settings className="w-4 h-4" /> 사출 임률
                    </TabsTrigger>
                </TabsList>

                {/* 원재료 탭 */}
                <TabsContent value="raw-materials">
                    <MasterTable
                        title="원재료 마스터"
                        description="제품 생산에 사용되는 수지(Resin) 단가 (원/kg)"
                        data={rawMaterials}
                        columns={[
                            { header: "원재료명", key: "name" },
                            { header: "단가", key: "price", type: "number" }
                        ]}
                        onRefresh={fetchData}
                        collection="masterRawMaterials"
                    />
                </TabsContent>

                {/* 부자재 탭 */}
                <TabsContent value="sub-materials">
                    <MasterTable
                        title="부자재 마스터"
                        description="포장재, 라벨, 스티커 등 부자재 단가 (원)"
                        data={subMaterials}
                        columns={[
                            { header: "부자재명", key: "name" },
                            { header: "단가", key: "price", type: "number" }
                        ]}
                        onRefresh={fetchData}
                        collection="masterSubMaterials"
                    />
                </TabsContent>

                {/* 펌프 엔진 탭 */}
                <TabsContent value="pumps">
                    <MasterTable
                        title="펌프 엔진 마스터"
                        description="펌프, 디스펜서 엔진 단가 (원)"
                        data={pumpEngines}
                        columns={[
                            { header: "엔진명", key: "name" },
                            { header: "단가", key: "price", type: "number" }
                        ]}
                        onRefresh={fetchData}
                        collection="masterPumpEngines"
                    />
                </TabsContent>

                {/* 사출 임률 탭 */}
                <TabsContent value="injection">
                    <MasterTable
                        title="사출 임률 마스터"
                        description="사출기 톤수(T)별 임률 설정"
                        data={injectionRates}
                        columns={[
                            { header: "톤수", key: "tonnage" },
                            { header: "원가 임율", key: "rate", type: "number" }
                        ]}
                        onRefresh={fetchData}
                        collection="masterInjectionRates"
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// ─── 공용 테이블 컴포넌트 ────────────────────────────────────────────────────────

interface MasterTableProps {
    title: string;
    description: string;
    data: any[];
    columns: { header: string; key: string; type?: "text" | "number" }[];
    onRefresh: () => void;
    collection: string;
}

function MasterTable({ title, description, data, columns, onRefresh, collection }: MasterTableProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [isAdding, setIsAdding] = useState(false);

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setEditForm(item);
    };

    const handleSave = async (id: string) => {
        try {
            await updateDocument(collection, id, editForm);
            alert("수정되었습니다.");
            setEditingId(null);
            onRefresh();
        } catch (error) {
            alert("저장에 실패했습니다.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteDocument(collection, id);
            alert("삭제되었습니다.");
            onRefresh();
        } catch (error) {
            alert("삭제에 실패했습니다.");
        }
    };

    const handleAdd = async () => {
        try {
            await createDocument(collection, editForm);
            alert("추가되었습니다.");
            setIsAdding(false);
            setEditForm({});
            onRefresh();
        } catch (error) {
            alert("추가에 실패했습니다.");
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target?.result as string;
            const lines = content.split("\n");

            const newItems = lines.slice(1).filter(line => line.trim()).map(line => {
                const values = line.split(",");
                const obj: any = {};
                columns.forEach((col, idx) => {
                    const val = values[idx]?.trim();
                    obj[col.key] = col.type === "number" ? parseFloat(val) || 0 : val;
                });
                return obj;
            });

            try {
                for (const item of newItems) {
                    await createDocument(collection, item);
                }
                alert(`${newItems.length}개의 데이터가 업로드되었습니다.`);
                onRefresh();
            } catch (error) {
                alert("업로드 중 오류가 발생했습니다.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div className="space-y-1">
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                            <label>
                                <Upload className="w-4 h-4" /> CSV 업로드
                                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                            </label>
                        </Button>
                    </div>
                    <Button className="gap-2" onClick={() => { setIsAdding(true); setEditForm({}); }}>
                        <Plus className="w-4 h-4" /> 항목 추가
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-border/40 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                {columns.map((col) => (
                                    <TableHead key={col.key}>{col.header}</TableHead>
                                ))}
                                <TableHead className="text-right">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isAdding && (
                                <TableRow className="bg-primary/5">
                                    {columns.map((col) => (
                                        <TableCell key={col.key}>
                                            <Input
                                                type={col.type === "number" ? "number" : "text"}
                                                value={editForm[col.key] || ""}
                                                onChange={(e) => setEditForm({ ...editForm, [col.key]: col.type === "number" ? parseFloat(e.target.value) : e.target.value })}
                                                className="h-8"
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" onClick={handleAdd}>추가</Button>
                                        <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>취소</Button>
                                    </TableCell>
                                </TableRow>
                            )}
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="h-24 text-center text-muted-foreground">
                                        데이터가 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                        {columns.map((col) => (
                                            <TableCell key={col.key}>
                                                {editingId === item.id ? (
                                                    <Input
                                                        type={col.type === "number" ? "number" : "text"}
                                                        value={editForm[col.key] || ""}
                                                        onChange={(e) => setEditForm({ ...editForm, [col.key]: col.type === "number" ? parseFloat(e.target.value) : e.target.value })}
                                                        className="h-8"
                                                    />
                                                ) : (
                                                    col.type === "number" ? item[col.key]?.toLocaleString() : item[col.key]
                                                )}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-right space-x-1">
                                            {editingId === item.id ? (
                                                <>
                                                    <Button size="sm" variant="ghost" onClick={() => handleSave(item.id)}>
                                                        <Save className="w-4 h-4 text-primary" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                                                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
