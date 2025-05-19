"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { apiProducts } from "../../../../../../../fetch/fetch.products";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
    Settings,
    Save,
    AlertCircle,
} from "lucide-react";

interface CarbonCreditProduct {
    _id: string;
    name: string;
    totalCredits: string;
    usedCredits: string;
    description?: string;
}

const parseFormattedCreditString = (creditString: string | number | undefined | null): number => {
    if (typeof creditString === 'number') return creditString;
    if (!creditString || typeof creditString !== 'string') return 0;
    const cleanedString = creditString.replace(/,/g, '').replace(/\s*tCO2e/gi, '');
    return parseFloat(cleanedString) || 0;
};

const formatNumberWithUnit = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return "";
    const formattedNumber = num.toLocaleString("vi-VN");
    return `${formattedNumber} tCO2e`;
};

export default function CarbonCreditDetailsPage() {
    const { id } = useParams();

    const [carbonCreditData, setCarbonCreditData] = useState<CarbonCreditProduct | null>(null);

    const [editedTotalCredits, setEditedTotalCredits] = useState<string>("");
    const [editedUsedCredits, setEditedUsedCredits] = useState<string>("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError("Không có ID Tín chỉ Carbon.");
                setLoading(false);
                return;
            }
            try {
                const product = await apiProducts.getById(id as string);

                if (product?.payload) {
                    setCarbonCreditData(product.payload);
                    setEditedTotalCredits(product.payload.totalCredits || "");
                    setEditedUsedCredits(product.payload.usedCredits || "");
                    setError(null);
                } else {
                    setError("Không tìm thấy dữ liệu cho ID này.");
                    setCarbonCreditData(null);
                }

            } catch (err) {
                console.error("Lỗi fetch dữ liệu tín chỉ carbon:", err);
                setError("Không thể tải dữ liệu tín chỉ carbon.");
                setCarbonCreditData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const parsedTotal = parseFormattedCreditString(editedTotalCredits);
    const parsedUsed = parseFormattedCreditString(editedUsedCredits);
    const remainingCreditsNumeric = parsedTotal - parsedUsed;
    const remainingCreditsFormatted = formatNumberWithUnit(remainingCreditsNumeric);


    const handleSaveCredits = async (e: FormEvent) => {
        e.preventDefault();

        if (!id || !carbonCreditData) {
            setError("Thiếu thông tin để lưu.");
            return;
        }

        if (remainingCreditsNumeric < 0) {
            setError("Lỗi: Số tín chỉ còn lại không được âm.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const updatePayload = {
                totalCredits: parsedTotal,
                usedCredits: parsedUsed,
            };
            const apiResponse = await apiProducts.updateById(id as string, updatePayload);
            if (apiResponse?.payload) {
                setEditedTotalCredits(apiResponse.payload.totalCredits || "");
                setEditedUsedCredits(apiResponse.payload.usedCredits || "");
            } else {
                setError("Cập nhật thành công nhưng dữ liệu trả về không hợp lệ. Vui lòng tải lại trang.");
            }
        } catch (err) {
            console.error("Lỗi cập nhật tín chỉ API:", err);
            setError("Không thể lưu thông tin tín chỉ lên máy chủ. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <p className="text-center mt-10">Đang tải dữ liệu tín chỉ...</p>;
    if (error && !carbonCreditData) return (
        <div className="mx-auto max-w-2xl bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center mt-10">
            <AlertCircle className="inline-block mr-2 h-5 w-5" /> {error}
        </div>
    );
    if (!carbonCreditData && !loading && !error) return <p className="text-center mt-10">Không tìm thấy thông tin tín chỉ carbon.</p>;
    return (
        <div className="container mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
                <Settings className="mr-2 h-6 w-6" />
                Cập nhật Tín chỉ Carbon: {carbonCreditData?.name || `ID ${id}`}
            </h1>
            {error && (
                <p className="text-red-500 mb-4 flex items-center"><AlertCircle className="mr-2 h-5 w-5" /> {error}</p>
            )}

            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5" /> Thông tin Tín chỉ</CardTitle>
                        <CardDescription>Cập nhật số lượng tín chỉ cho dự án này.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveCredits} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="totalCredits">Tổng tín chỉ</Label>
                                <Input
                                    id="totalCredits"
                                    type="text"
                                    value={editedTotalCredits}
                                    onChange={(e) => setEditedTotalCredits(e.target.value)}
                                    placeholder="Ví dụ: 5,000 tCO2e"
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="usedCredits">Tín chỉ đã sử dụng</Label>
                                <Input
                                    id="usedCredits"
                                    type="text"
                                    value={editedUsedCredits}
                                    onChange={(e) => setEditedUsedCredits(e.target.value)}
                                    placeholder="Ví dụ: 1,250 tCO2e"
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="remainingCredits">Tín chỉ còn lại</Label>
                                <Input
                                    id="remainingCredits"
                                    type="text"
                                    value={remainingCreditsFormatted}
                                    disabled
                                    readOnly
                                    className={`font-bold ${remainingCreditsNumeric < 0 ? 'text-red-600' : 'text-gray-800'}`}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSaving || !carbonCreditData || remainingCreditsNumeric < 0}
                            >
                                {isSaving ? (
                                    <> <Save className="mr-2 h-4 w-4 animate-pulse" /> Đang lưu... </>
                                ) : (
                                    <> <Save className="mr-2 h-4 w-4" /> Lưu thông tin </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>

        </div>
    );
}