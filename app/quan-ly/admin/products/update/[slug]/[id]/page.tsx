"use client";

import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { apiProducts } from "../../../../../../fetch/fetch.products";
import {
    Card,
    CardContent,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


import {
    CalendarDays,
    FileText,
    Award,
    Save,
    ArrowRight,
    FileEdit,
    XCircle,
    User,
    Mail,
    Phone,
    ChartPie,
    Clock,
    Gift,
    Settings,
    Star,
    RefreshCw
} from "lucide-react";

import { uploadToCloudinary } from "../../../../../../utils/common";
import RelatedActions from "../../ProductActions/page";
interface EditableCarbonCreditData {
    _id?: string;
    image: string;
    name: string;
    description?: string;
    projectLocation?: string;
    price?: number;
    status?: string;
    expiryDate?: string;
    subscriptionTier?: string;
    billingCycle?: string;
    type?: string;
    accountManager: {
        name: string;
        email: string;
        phone: string;
    };
}

interface CarbonCreditData {
    _id: string;
    image: string;
    name: string;
    description?: string;
    projectLocation?: string;
    location?: string;
    price?: number;
    carbonAmount?: number;
    amount?: number;
    carbonUsed?: number;
    status?: string;
    purchaseDate?: string;
    expiryDate?: string;
    verificationStandard?: string;
    subscriptionTier?: string;
    billingCycle?: string;
    type?: string;
    accountManager?: {
        name: string;
        email: string;
        phone: string;
    };
    usageStats?: any;
}


export default function ViewCarbonCreditPage() {
    const { id } = useParams();
    const [carbonCredit, setCarbonCredit] = useState<CarbonCreditData | null>(null);
    const [editedCarbonCredit, setEditedCarbonCredit] = useState<EditableCarbonCreditData | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const resetEditedState = useCallback((originalData: CarbonCreditData) => {
        setEditedCarbonCredit({
            _id: originalData._id,
            name: originalData.name || "",
            description: originalData.description || "",
            projectLocation: originalData.projectLocation || originalData.location || "",
            price: originalData.price,
            status: originalData.status || "",
            expiryDate: originalData.expiryDate ? new Date(originalData.expiryDate).toISOString().split('T')[0] : "",
            subscriptionTier: originalData.subscriptionTier || "",
            billingCycle: originalData.billingCycle || "",
            image: originalData.image || "",
            type: originalData.type || "",
            accountManager: originalData.accountManager || { name: "", email: "", phone: "" },
        });
        setImagePreviewUrl(originalData.image || null);
        setSelectedImageFile(null);
        setHasChanges(false);
    }, []);


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
                    const productData: CarbonCreditData = res.payload;
                    setCarbonCredit(productData);
                    resetEditedState(productData);
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
    }, [id, resetEditedState]);


    useEffect(() => {
        if (!carbonCredit || !editedCarbonCredit) {
            setHasChanges(false);
            return;
        }

        const editableKeys: (keyof EditableCarbonCreditData)[] = [
            'name', 'description', 'projectLocation', 'price',
            'status', 'expiryDate',
            'subscriptionTier', 'billingCycle', 'type', 'accountManager'
        ];

        const changesDetected = editableKeys.some(key => {
            if (key === 'accountManager') {
                const originalAccountManager = carbonCredit.accountManager || { name: "", email: "", phone: "" };
                const editedAccountManager = editedCarbonCredit.accountManager || { name: "", email: "", phone: "" };
                return editedAccountManager.name !== (originalAccountManager.name || "") ||
                    editedAccountManager.email !== (originalAccountManager.email || "") ||
                    editedAccountManager.phone !== (originalAccountManager.phone || "");
            }

            const editedValue = editedCarbonCredit[key];
            const originalValue = carbonCredit[key as keyof CarbonCreditData];


            if (key === 'projectLocation') {
                const originalLocation = carbonCredit.projectLocation || carbonCredit.location || "";
                return (editedValue || "") !== originalLocation;
            }


            if (typeof editedValue === 'number' || typeof originalValue === 'number') {
                return (editedValue ?? 0) !== (originalValue ?? 0);
            }

            if (key === 'expiryDate') {
                const originalDateFormatted = originalValue ? new Date(originalValue as string).toISOString().split('T')[0] : "";
                return (editedValue || "") !== originalDateFormatted;
            }


            return (editedValue || "") !== (originalValue || "");
        }) || selectedImageFile !== null;


        setHasChanges(changesDetected);

    }, [editedCarbonCredit, carbonCredit, selectedImageFile]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        const [parentKey, childKey] = id.split('.');

        setEditedCarbonCredit(prevState => {
            if (!prevState) return null;

            if (childKey && prevState[parentKey as keyof EditableCarbonCreditData] && typeof prevState[parentKey as keyof EditableCarbonCreditData] === 'object') {
                return {
                    ...prevState,
                    [parentKey]: {
                        ...(prevState[parentKey as keyof EditableCarbonCreditData] as any),
                        [childKey]: value,
                    }
                };
            } else {
                const processedValue = (id === 'price') ? parseFloat(value) || 0 : value;
                return {
                    ...prevState,
                    [id]: processedValue,
                };
            }
        });
    };


    const handleSelectChange = (id: keyof EditableCarbonCreditData, value: string) => {
        setEditedCarbonCredit(prevState => {
            if (!prevState) return null;
            return {
                ...prevState,
                [id]: value
            } as EditableCarbonCreditData;
        });
    };


    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setSelectedImageFile(null);
            setImagePreviewUrl(editedCarbonCredit?.image || null);
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);


    const handleSave = async () => {
        if (!editedCarbonCredit || !hasChanges || isSaving) {
            return;
        }

        setIsSaving(true);
        setError(null);

        let imageUrl = editedCarbonCredit.image;

        try {
            if (selectedImageFile) {
                const uploadRes = await uploadToCloudinary(selectedImageFile);
                if (uploadRes) {
                    imageUrl = uploadRes;
                } else {
                    setError("Không thể tải ảnh lên Cloudinary.");
                    setIsSaving(false);
                    return;
                }
            }

            const { _id, ...dataToSave } = editedCarbonCredit;

            const finalDataToSave = {
                ...dataToSave,
                image: imageUrl,
                accountManager: dataToSave.accountManager || { name: "", email: "", phone: "" },
            };

            Object.keys(finalDataToSave).forEach(key => finalDataToSave[key as keyof typeof finalDataToSave] === undefined && delete finalDataToSave[key as keyof typeof finalDataToSave]);


            const res = await apiProducts.updateProduct(id as string, finalDataToSave);

            if (res?.payload) {
                const productData: CarbonCreditData = res.payload;
                setCarbonCredit(productData);
                resetEditedState(productData);
                setIsEditing(false);
            } else {
                setError("Không thể lưu dữ liệu Carbon Credit.");
            }
        } catch (err) {
            console.error("Lỗi lưu dữ liệu:", err);
            setError(`Lỗi khi lưu dữ liệu Carbon Credit: ${(err as Error).message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (carbonCredit) {
            resetEditedState(carbonCredit);
        }
        setIsEditing(false);
        setError(null);
    };


    if (loading || !editedCarbonCredit)
        return <p className="text-center mt-10">Đang tải dữ liệu...</p>;
    if (error && !carbonCredit)
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    if (!carbonCredit && !loading)
        return <p className="text-center text-red-500 mt-10">Không tìm thấy dữ liệu Carbon Credit.</p>;


    return (
        <>
            <div className="container flex flex-col mx-auto py-6 px-4">
                {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

                {/* Container chính cho bố cục 2 cột trên màn hình md trở lên */}
                {/* Thay đổi md:grid-cols-2 thành md:grid-cols-[4fr_1fr] để có tỷ lệ 80/20 */}
                <div className="grid grid-cols-1 md:grid-cols-[4fr_1fr] gap-8">

                    {/* Cột 1: Chứa Card thông tin chính */}
                    <div>
                        {/* Các nút Lưu và Hủy khi chỉnh sửa - Đặt ở đây để chúng nằm gần Card */}
                        {isEditing && (
                            <div className="mb-6 flex flex-wrap gap-4 justify-center md:justify-end">
                                <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Hủy
                                </Button>
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
                            </div>
                        )}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold">
                                    {editedCarbonCredit.name || "Chi tiết Carbon Credit"}
                                </CardTitle>
                                {/* Nút Chỉnh sửa thông tin - Chỉ hiển thị khi KHÔNG chỉnh sửa */}
                                {!isEditing && (
                                    <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                                        <FileEdit className="mr-2 h-4 w-4" />
                                        Chỉnh sửa
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="flex flex-col md:flex-row gap-x-8 gap-y-4">
                                {/* Cột Thông tin chung của Card */}
                                <div className="flex-1 space-y-4">
                                    <h3 className="text-lg font-semibold">Thông tin chung</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="image">Ảnh:</Label>
                                        {imagePreviewUrl && (
                                            <img src={imagePreviewUrl} alt="Carbon Credit Image" className="mt-2 max-h-40 object-cover rounded" />
                                        )}
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    id="image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    disabled={isSaving}
                                                />
                                                {selectedImageFile && <p className="text-sm text-gray-500">Đã chọn file: {selectedImageFile.name}</p>}
                                            </>
                                        ) : (
                                            !imagePreviewUrl && <p className="text-sm text-gray-500">Chưa có ảnh</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name">Tên:</Label>
                                        {isEditing ? (
                                            <Input
                                                id="name"
                                                type="text"
                                                value={editedCarbonCredit.name}
                                                onChange={handleInputChange}
                                                disabled={isSaving}
                                            />
                                        ) : (
                                            <p className="text-base">{carbonCredit?.name || "N/A"}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Mô tả:</Label>
                                        {isEditing ? (
                                            <Textarea
                                                id="description"
                                                value={editedCarbonCredit.description || ""}
                                                onChange={handleInputChange}
                                                rows={4}
                                                placeholder="Mô tả chi tiết về Carbon Credit"
                                                disabled={isSaving}
                                            />
                                        ) : (
                                            <p className="text-base whitespace-pre-wrap">{carbonCredit?.description || "N/A"}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="projectLocation">Địa điểm dự án:</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="projectLocation"
                                                    type="text"
                                                    value={editedCarbonCredit.projectLocation || ""}
                                                    onChange={handleInputChange}
                                                    disabled={isSaving}
                                                />
                                            ) : (
                                                <p className="text-base">{carbonCredit?.projectLocation || carbonCredit?.location || "N/A"}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Trạng thái:</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="status"
                                                    type="text"
                                                    value={editedCarbonCredit.status || ""}
                                                    onChange={handleInputChange}
                                                    disabled={isSaving}
                                                />
                                            ) : (
                                                <p className="text-base">{carbonCredit?.status || "N/A"}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Loại:</Label>
                                        {isEditing ? (
                                            <Select
                                                value={editedCarbonCredit.type || ""}
                                                onValueChange={(value) => handleSelectChange('type', value)}
                                                disabled={isSaving}
                                            >
                                                <SelectTrigger id="type">
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="carbon_credits">Carbon Credits</SelectItem>
                                                    <SelectItem value="carbon_accounting">Carbon Accounting</SelectItem>
                                                    <SelectItem value="international_certificates">International Certificates</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="text-base">{carbonCredit?.type || "N/A"}</p>
                                        )}
                                    </div>
                                </div>


                                <Separator orientation={window.innerWidth > 768 ? "vertical" : "horizontal"} className={window.innerWidth > 768 ? "h-full" : "w-full"} />


                                {/* Cột Tài chính & Gói đăng ký và Thông tin Quản lý tài khoản của Card */}
                                <div className="flex-1 space-y-6 md:space-y-8">
                                    {/* Nhóm Tài chính & Gói đăng ký */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Tài chính & Gói đăng ký</h3>
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Giá (VND):</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    value={editedCarbonCredit.price ?? ''}
                                                    onChange={handleInputChange}
                                                    disabled={isSaving}
                                                />
                                            ) : (
                                                <p className="text-base">{carbonCredit?.price ?? "N/A"}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="expiryDate">Ngày hết hạn:</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="expiryDate"
                                                    type="date"
                                                    value={editedCarbonCredit.expiryDate || ""}
                                                    onChange={handleInputChange}
                                                    disabled={isSaving}
                                                />
                                            ) : (
                                                <p className="text-base">{carbonCredit?.expiryDate ? new Date(carbonCredit.expiryDate).toLocaleDateString() : "N/A"}</p>
                                            )}
                                        </div>


                                        <div className="space-y-2">
                                            <Label htmlFor="billingCycle">Chu kỳ thanh toán:</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="billingCycle"
                                                    type="text"
                                                    value={editedCarbonCredit.billingCycle || ""}
                                                    onChange={handleInputChange}
                                                    disabled={isSaving}
                                                />
                                            ) : (
                                                <p className="text-base">{carbonCredit?.billingCycle || "N/A"}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subscriptionTier">Gói đăng ký:</Label>
                                            {isEditing ? (
                                                <Select
                                                    value={editedCarbonCredit.subscriptionTier || ""}
                                                    onValueChange={(value) => handleSelectChange("subscriptionTier", value)}
                                                    disabled={isSaving}
                                                >
                                                    <SelectTrigger id="subscriptionTier">
                                                        <SelectValue placeholder="Chọn gói" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="free">Miễn phí</SelectItem>
                                                        <SelectItem value="expert">Chuyên gia</SelectItem>
                                                        <SelectItem value="research">Nghiên cứu</SelectItem>
                                                        <SelectItem value="enterprise">Doanh nghiệp</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <p className="text-base">{
                                                    {
                                                        "free": "Miễn phí",
                                                        "expert": "Chuyên gia",
                                                        "research": "Nghiên cứu",
                                                        "enterprise": "Doanh nghiệp",
                                                    }[carbonCredit?.subscriptionTier as string] || carbonCredit?.subscriptionTier || "N/A"
                                                }</p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center">
                                            <User className="mr-2 h-5 w-5" />
                                            Thông tin Quản lý tài khoản
                                        </h3>
                                        {isEditing ? (
                                            <>
                                                <div className="space-y-2">
                                                    <Label htmlFor="accountManager.name">Tên Quản lý:</Label>
                                                    <div className="relative flex items-center">
                                                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="accountManager.name"
                                                            type="text"
                                                            value={editedCarbonCredit.accountManager?.name || ''}
                                                            onChange={handleInputChange}
                                                            placeholder="Nhập tên quản lý"
                                                            disabled={isSaving}
                                                            className="pl-8"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="accountManager.email">Email Quản lý:</Label>
                                                    <div className="relative flex items-center">
                                                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="accountManager.email"
                                                            type="email"
                                                            value={editedCarbonCredit.accountManager?.email || ''}
                                                            onChange={handleInputChange}
                                                            placeholder="Nhập email quản lý"
                                                            disabled={isSaving}
                                                            className="pl-8"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="accountManager.phone">Số điện thoại Quản lý:</Label>
                                                    <div className="relative flex items-center">
                                                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="accountManager.phone"
                                                            type="tel"
                                                            value={editedCarbonCredit.accountManager?.phone || ''}
                                                            onChange={handleInputChange}
                                                            placeholder="Nhập SĐT quản lý"
                                                            disabled={isSaving}
                                                            className="pl-8"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="space-y-2 text-base text-gray-700">
                                                <p className="flex items-center gap-2"><User className="h-4 w-4 text-gray-500" /> Tên: {carbonCredit?.accountManager?.name || "N/A"}</p>
                                                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" /> Email: {carbonCredit?.accountManager?.email || "N/A"}</p>
                                                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /> SĐT: {carbonCredit?.accountManager?.phone || "N/A"}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {!isEditing && (
                        <RelatedActions id={id as string} carbonCredit={{ type: carbonCredit.type }} />
                    )}
                </div>
            </div >
        </>
    );
}