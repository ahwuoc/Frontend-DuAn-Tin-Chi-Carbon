"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiProducts } from "../../../../../../fetch/fetch.products";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    CalendarDays,
    FileText,
    Award,
    DollarSign,
    Percent,
    MapPin,
    Leaf,
    Gauge,
    Info,
    Building,
    Repeat2,
    CheckCircle2,
    CalendarClock,
    ScrollText,
    Layers,
    Save
} from "lucide-react";

const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString("vi-VN");
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid Date";
    }
};

const formatNumber = (num: number | undefined, currency?: string): string => {
    if (num === undefined || num === null) return "N/A";
    try {
        const formatter = new Intl.NumberFormat("vi-VN", {
            style: currency ? "currency" : "decimal",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: currency ? 0 : 2,
        });
        return formatter.format(num);
    } catch (e) {
        console.error("Error formatting number:", e);
        return String(num);
    }
};

interface EditableCarbonCreditData {
    _id?: string;
    name: string;
    description?: string;
    projectLocation?: string;
    price?: number;
    carbonAmount?: number;
    carbonUsed?: number;
    status?: string;
    purchaseDate?: string;
    expiryDate?: string;
    verificationStandard?: string;
    subscriptionTier?: string;
    issuer?: string;
    billingCycle?: string;
}


export default function ViewCarbonCreditPage() {
    const { id } = useParams();
    const [carbonCredit, setCarbonCredit] = useState<any>(null);
    const [editedCarbonCredit, setEditedCarbonCredit] = useState<EditableCarbonCreditData | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError("Không có ID Carbon Credit.");
                setLoading(false);
                return;
            }
            try {
                const res = await apiProducts.getById(id as string);
                if (res?.payload) {
                    setCarbonCredit(res.payload);
                    setEditedCarbonCredit({
                        _id: res.payload._id,
                        name: res.payload.name || "",
                        description: res.payload.description || "",
                        projectLocation: res.payload.projectLocation || res.payload.location || "",
                        price: res.payload.price,
                        carbonAmount: res.payload.carbonAmount || res.payload.amount,
                        carbonUsed: res.payload.carbonUsed,
                        status: res.payload.status || "",
                        purchaseDate: res.payload.purchaseDate ? new Date(res.payload.purchaseDate).toISOString().split('T')[0] : "",
                        expiryDate: res.payload.expiryDate ? new Date(res.payload.expiryDate).toISOString().split('T')[0] : "",
                        verificationStandard: res.payload.verificationStandard || "",
                        subscriptionTier: res.payload.subscriptionTier || "",
                        issuer: res.payload.issuer || "",
                        billingCycle: res.payload.billingCycle || "",
                    });
                    setHasChanges(false);
                } else {
                    setError("Không tìm thấy Carbon Credit hoặc dữ liệu rỗng.");
                }
            } catch (err) {
                console.error("Lỗi fetch dữ liệu:", err);
                setError("Lỗi khi tải dữ liệu Carbon Credit.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!carbonCredit || !editedCarbonCredit) {
            setHasChanges(false);
            return;
        }
        const changesDetected = Object.keys(editedCarbonCredit).some(key => {
            const editedValue = editedCarbonCredit[key as keyof EditableCarbonCreditData];
            const originalValue = carbonCredit[key];

            if (typeof editedValue === 'number' || typeof originalValue === 'number') {
                return (editedValue || 0) !== (originalValue || 0);
            }
            if (key === 'purchaseDate' || key === 'expiryDate') {

                const originalDateFormatted = originalValue ? new Date(originalValue).toISOString().split('T')[0] : "";
                return editedValue !== originalDateFormatted;
            }

            return editedValue !== originalValue;
        });

        setHasChanges(changesDetected);

    }, [editedCarbonCredit, carbonCredit]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setEditedCarbonCredit(prevState => ({
            ...prevState!,
            [id]: id === 'price' || id === 'carbonAmount' || id === 'carbonUsed' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSave = async () => {
        if (!editedCarbonCredit || !hasChanges || isSaving) {
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const res = await apiProducts.updateProduct(id as string, editedCarbonCredit);
            if (res?.payload) {
                setCarbonCredit(res.payload);
                setEditedCarbonCredit({
                    _id: res.payload._id,
                    name: res.payload.name || "",
                    description: res.payload.description || "",
                    projectLocation: res.payload.projectLocation || res.payload.location || "",
                    price: res.payload.price,
                    carbonAmount: res.payload.carbonAmount || res.payload.amount,
                    carbonUsed: res.payload.carbonUsed,
                    status: res.payload.status || "",
                    purchaseDate: res.payload.purchaseDate ? new Date(res.payload.purchaseDate).toISOString().split('T')[0] : "",
                    expiryDate: res.payload.expiryDate ? new Date(res.payload.expiryDate).toISOString().split('T')[0] : "",
                    verificationStandard: res.payload.verificationStandard || "",
                    subscriptionTier: res.payload.subscriptionTier || "",
                    issuer: res.payload.issuer || "",
                    billingCycle: res.payload.billingCycle || "",
                });
                setHasChanges(false);
                console.log("Lưu dữ liệu thành công!");
            } else {
                setError("Không thể lưu dữ liệu Carbon Credit.");
                console.error("API response data missing on save.");
            }

        } catch (err) {
            console.error("Lỗi lưu dữ liệu:", err);
            setError("Lỗi khi lưu dữ liệu Carbon Credit.");
        } finally {
            setIsSaving(false);
        }
    };


    if (loading || !editedCarbonCredit)
        return <p className="text-center mt-10">Đang tải dữ liệu...</p>;

    if (error && !carbonCredit)
        return <p className="text-center text-red-500 mt-10">{error}</p>;


    const usageStats = carbonCredit?.usageStats || {};
    const originalCreatedAt = formatDate(carbonCredit?.createdAt);
    const originalUpdatedAt = formatDate(carbonCredit?.updatedAt);


    return (
        <div className="container mx-auto py-6 px-4">
            <div className="mb-6 flex flex-wrap gap-4 justify-center">
                <Button asChild>
                    <Link
                        href={`/quan-ly/admin/products/update/carbon_credits/${id}/timeline`}
                    >
                        <span>
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Xem dòng thời gian dự án
                        </span>
                    </Link>
                </Button>

                <Button asChild variant="secondary">
                    <Link
                        href={`/quan-ly/admin/products/update/carbon_credits/${id}/report`}
                    >
                        <span>
                            <FileText className="mr-2 h-4 w-4" />
                            Cập nhật báo cáo dự án
                        </span>
                    </Link>
                </Button>

                <Button asChild variant="outline">
                    <Link
                        href={`/quan-ly/admin/products/update/carbon_credits/${id}/certificate`}
                    >
                        <span>
                            <Award className="mr-2 h-4 w-4" />
                            Cập nhật chứng chỉ
                        </span>
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{editedCarbonCredit.name || "Chỉnh sửa Carbon Credit"}</CardTitle>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Thông tin chung (Có thể chỉnh sửa) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Thông tin chung</h3>
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên:</Label>
                            <Input
                                id="name"
                                type="text"
                                value={editedCarbonCredit.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả:</Label>
                            <Textarea
                                id="description"
                                value={editedCarbonCredit.description || ""}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Mô tả chi tiết về Carbon Credit"
                            />
                        </div>

                        {/* Nhóm Địa điểm và Trạng thái */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="projectLocation">Địa điểm dự án:</Label>
                                <Input
                                    id="projectLocation"
                                    type="text"
                                    value={editedCarbonCredit.projectLocation || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Trạng thái:</Label>
                                <Input
                                    id="status"
                                    type="text"
                                    value={editedCarbonCredit.status || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Nhóm Đơn vị phát hành và Tiêu chuẩn xác minh */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="issuer">Đơn vị phát hành:</Label>
                                <Input
                                    id="issuer"
                                    type="text"
                                    value={editedCarbonCredit.issuer || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="verificationStandard">Tiêu chuẩn xác minh:</Label>
                                <Input
                                    id="verificationStandard"
                                    type="text"
                                    value={editedCarbonCredit.verificationStandard || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>


                        {/* Các trường không chỉnh sửa ở đây */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium leading-none">ID:</p>
                            <p className="text-base break-all">{carbonCredit._id}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium leading-none">Loại:</p>
                            <p className="text-base">{carbonCredit.type || "N/A"}</p>
                        </div>
                    </div>

                    <Separator orientation="vertical" className="hidden md:block" />
                    <Separator className="md:hidden" />


                    {/* Thông tin tài chính và số liệu (Có thể chỉnh sửa) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Tài chính & Số liệu</h3>
                        <div className="space-y-2">
                            <Label htmlFor="price">Giá (VND):</Label>
                            <Input
                                id="price"
                                type="number"
                                value={editedCarbonCredit.price ?? ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Nhóm Lượng Carbon và Lượng Carbon đã dùng */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="carbonAmount">Lượng Carbon (tấn CO₂e):</Label>
                                <Input
                                    id="carbonAmount"
                                    type="number"
                                    value={editedCarbonCredit.carbonAmount ?? ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="carbonUsed">Lượng đã dùng (tấn CO₂e):</Label>
                                <Input
                                    id="carbonUsed"
                                    type="number"
                                    value={editedCarbonCredit.carbonUsed ?? ''}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>
                        </div>


                        {/* Nhóm Ngày mua và Ngày hết hạn */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="purchaseDate">Ngày mua:</Label>
                                <Input
                                    id="purchaseDate"
                                    type="date"
                                    value={editedCarbonCredit.purchaseDate || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expiryDate">Ngày hết hạn:</Label>
                                <Input
                                    id="expiryDate"
                                    type="date"
                                    value={editedCarbonCredit.expiryDate || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>


                        {/* Nhóm Chu kỳ thanh toán và Gói đăng ký */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="billingCycle">Chu kỳ thanh toán:</Label>
                                <Input
                                    id="billingCycle"
                                    type="text"
                                    value={editedCarbonCredit.billingCycle || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subscriptionTier">Gói đăng ký:</Label>
                                <Input
                                    id="subscriptionTier"
                                    type="text"
                                    value={editedCarbonCredit.subscriptionTier || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <Separator />
                    </div>


                    {/* Thống kê sử dụng (Hiển thị tĩnh) */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <h3 className="text-lg font-semibold mb-2">Thống kê sử dụng</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm font-medium leading-none">Tổng sử dụng:</p>
                                <p className="text-base flex items-center gap-1">
                                    <Gauge className="h-4 w-4 text-blue-500" />
                                    {formatNumber(usageStats.totalUsage) || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium leading-none">Sử dụng tháng trước:</p>
                                <p className="text-base flex items-center gap-1">
                                    <Gauge className="h-4 w-4 text-blue-500" />
                                    {formatNumber(usageStats.lastMonthUsage) || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium leading-none">Xu hướng:</p>
                                <p className="text-base flex items-center gap-1">
                                    {usageStats.trend === 'up' && <span className="text-green-500">▲</span>}
                                    {usageStats.trend === 'down' && <span className="text-red-500">▼</span>}
                                    {usageStats.trend === 'stable' && <span className="text-gray-500">━</span>}
                                    {usageStats.trend || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <Separator />
                    </div>

                    {/* Các tính năng (Hiển thị tĩnh) */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <h3 className="text-lg font-semibold mb-2">Các tính năng</h3>
                        {carbonCredit?.features && carbonCredit.features.length > 0 ? (
                            <ul className="space-y-2">
                                {carbonCredit.features.map((feature: any) => (
                                    <li key={feature._id || feature.id} className="flex items-start space-x-2">
                                        <Info className="h-5 w-5 flex-shrink-0 text-cyan-600 mt-1" />
                                        <div>
                                            <p className="font-medium">{feature.title}</p>
                                            <p className="text-sm text-gray-600">{feature.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-base text-gray-500">Không có thông tin tính năng.</p>
                        )}
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <Separator />
                    </div>

                    {/* Thông tin thời gian (Hiển thị tĩnh) */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
                        <div>
                            <p className="text-sm font-medium leading-none">Ngày tạo:</p>
                            <p className="text-base">{originalCreatedAt}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium leading-none">Cập nhật lần cuối:</p>
                            <p className="text-base">{originalUpdatedAt}</p>
                        </div>
                    </div>


                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                    >
                        {isSaving ? (
                            <> <Save className="mr-2 h-4 w-4 animate-pulse" /> Đang lưu... </>
                        ) : (
                            <> <Save className="mr-2 h-4 w-4" /> Lưu thay đổi </>
                        )}

                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}