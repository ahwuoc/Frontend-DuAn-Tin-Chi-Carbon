"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiProducts } from "../../../../fetch/fetch.products";
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
    Save,
    XCircle,
    PlusCircle,
    User,
    Mail,
    Phone
} from "lucide-react";

import { uploadToCloudinary } from "../../../../utils/common";
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const uploadPreset = "my_unsigned_preset";

interface NewCarbonCreditData {
    image: string;
    name: string;
    description?: string;
    projectLocation?: string;
    price?: number;
    status: "active" | "pending" | "expired";
    subscriptionTier: "free" | "expert" | "research" | "enterprise"; // Cập nhật kiểu dữ liệu cho subscriptionTier
    verificationStandard?: string;
    billingCycle: string;
    type: string;
    accountManager: {
        name: string;
        email: string;
        phone: string;
    };
}


export default function CreateCarbonCreditPage() {
    const router = useRouter();

    const [newCarbonCredit, setNewCarbonCredit] = useState<NewCarbonCreditData>({
        image: "",
        name: "",
        description: "",
        projectLocation: "",
        price: 0,
        status: "pending",
        verificationStandard: "",
        subscriptionTier: "free", // Giá trị khởi tạo phù hợp với kiểu mới
        billingCycle: "One-Time",
        type: "carbon_credits",
        accountManager: {
            name: "",
            email: "",
            phone: "",
        },
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);


    const hasChanges = newCarbonCredit.name.trim() !== "" ||
        newCarbonCredit.description?.trim() !== "" ||
        newCarbonCredit.projectLocation?.trim() !== "" ||
        (newCarbonCredit.price !== 0 && newCarbonCredit.price !== undefined && newCarbonCredit.price !== null) ||
        newCarbonCredit.status !== "pending" ||
        newCarbonCredit.verificationStandard?.trim() !== "" ||
        newCarbonCredit.subscriptionTier !== "free" || // So sánh với giá trị mặc định mới
        newCarbonCredit.billingCycle !== "One-Time" ||
        newCarbonCredit.type !== "carbon_credits" ||
        newCarbonCredit.accountManager.name.trim() !== "" ||
        newCarbonCredit.accountManager.email.trim() !== "" ||
        newCarbonCredit.accountManager.phone.trim() !== "" ||
        selectedImageFile !== null;


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        const [parentKey, childKey] = id.split('.');

        setNewCarbonCredit(prevState => {
            if (childKey && prevState?.[parentKey as keyof NewCarbonCreditData] && typeof prevState[parentKey as keyof NewCarbonCreditData] === 'object') {
                return {
                    ...prevState!,
                    [parentKey]: {
                        ...(prevState[parentKey as keyof NewCarbonCreditData] as any),
                        [childKey]: value,
                    }
                };
            } else {
                const processedValue = id === 'price' ? parseFloat(value) || 0 : value;
                return {
                    ...prevState!,
                    [id]: processedValue,
                };
            }
        });
    };


    const handleSelectChange = (id: keyof NewCarbonCreditData, value: string) => {
        setNewCarbonCredit(prevState => ({
            ...prevState!,
            [id]: value as any
        }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setSelectedImageFile(null);
            setImagePreviewUrl(null);
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);


    const handleCreate = async () => {
        if (
            !newCarbonCredit.name.trim() ||
            !newCarbonCredit.type.trim() ||
            !newCarbonCredit.status.trim() ||
            !newCarbonCredit.billingCycle.trim() ||
            !newCarbonCredit.subscriptionTier.trim() || // Đảm bảo giá trị được chọn
            !newCarbonCredit.accountManager.name.trim() ||
            !newCarbonCredit.accountManager.email.trim() ||
            !newCarbonCredit.accountManager.phone.trim() ||
            isSaving
        ) {
            setError("Vui lòng điền đầy đủ các trường bắt buộc (Tên, Loại, Trạng thái, Chu kỳ thanh toán, Gói đăng ký, Thông tin Quản lý tài khoản).");
            return;
        }

        setIsSaving(true);
        setError(null);

        let imageUrl = "";

        try {
            if (selectedImageFile) {
                console.log("Đang tải ảnh lên Cloudinary...");
                const uploadRes = await uploadToCloudinary(selectedImageFile, cloudName, uploadPreset);
                if (uploadRes) {
                    imageUrl = uploadRes;
                    console.log("Tải ảnh lên thành công:", imageUrl);
                } else {
                    setError("Không thể tải ảnh lên Cloudinary.");
                    console.error("Lỗi tải ảnh lên Cloudinary:", uploadRes);
                    setIsSaving(false);
                    return;
                }
            }

            const dataToCreate: NewCarbonCreditData = {
                ...newCarbonCredit,
                image: imageUrl,
            };

            console.log("Đang tạo dữ liệu:", dataToCreate);
            const res = await apiProducts.create(dataToCreate);

            if (res.payload) {
                router.push(`/quan-ly/admin/products`);
            } else {
                setError("Không thể tạo Carbon Credit mới.");
                console.error("API response data missing on create or missing _id:", res?.payload);
            }
        } catch (err) {
            console.error("Lỗi tạo dữ liệu:", err);
            setError(`Lỗi khi tạo Carbon Credit mới: ${(err as Error).message} `);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };


    return (
        <div className="container flex flex-col mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
                <PlusCircle className="mr-2 h-6 w-6" />
                Tạo Carbon Credit mới
            </h1>

            {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

            <div className="mb-6 flex flex-wrap gap-4 justify-center">
                <Button
                    onClick={handleCreate}
                    disabled={
                        isSaving ||
                        !newCarbonCredit.name.trim() ||
                        !newCarbonCredit.type.trim() ||
                        !newCarbonCredit.status.trim() ||
                        !newCarbonCredit.billingCycle.trim() ||
                        !newCarbonCredit.subscriptionTier.trim() ||
                        !newCarbonCredit.accountManager.name.trim() ||
                        !newCarbonCredit.accountManager.email.trim() ||
                        !newCarbonCredit.accountManager.phone.trim()
                    }
                >
                    {isSaving ? (
                        <> <Save className="mr-2 h-4 w-4 animate-pulse" /> Đang tạo... </>
                    ) : (
                        <> <PlusCircle className="mr-2 h-4 w-4" /> Tạo Carbon Credit </>
                    )}
                </Button>
                <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Hủy
                </Button>
            </div>


            <Card>
                <CardHeader>
                    <CardTitle>Thông tin Carbon Credit mới</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Thông tin chung</h3>

                        <div className="space-y-2">
                            <Label htmlFor="type">Loại:</Label>
                            <Select
                                value={newCarbonCredit.type}
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Ảnh (Tùy chọn):</Label>
                            {imagePreviewUrl && (
                                <img src={imagePreviewUrl} alt="Preview" className="mt-2 max-h-40 object-cover rounded" />
                            )}
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                disabled={isSaving}
                            />
                            {selectedImageFile && <p className="text-sm text-gray-500">Đã chọn file: {selectedImageFile.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Tên:</Label>
                            <Input
                                id="name"
                                type="text"
                                value={newCarbonCredit.name}
                                onChange={handleInputChange}
                                placeholder="Nhập tên Carbon Credit"
                                disabled={isSaving}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả:</Label>
                            <Textarea
                                id="description"
                                value={newCarbonCredit.description || ""}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Mô tả chi tiết về Carbon Credit"
                                disabled={isSaving}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="projectLocation">Địa điểm dự án:</Label>
                                <Input
                                    id="projectLocation"
                                    type="text"
                                    value={newCarbonCredit.projectLocation || ""}
                                    onChange={handleInputChange}
                                    placeholder="Địa điểm dự án"
                                    disabled={isSaving}
                                />
                            </div>
                            {/* Trạng thái không còn là Select */}
                            <div className="space-y-2">
                                <Label>Trạng thái:</Label>
                                <Input value="Đang chờ xử lý (Mặc định)" disabled />
                            </div>
                        </div>
                        {/* Tiêu chuẩn xác minh đã bị xóa */}
                    </div>

                    <Separator />

                    {/* Nhóm Thông tin Quản lý tài khoản */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            Thông tin Quản lý tài khoản
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="accountManager.name">Tên Quản lý:</Label>
                            <div className="relative flex items-center">
                                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="accountManager.name"
                                    type="text"
                                    value={newCarbonCredit.accountManager.name}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên quản lý"
                                    disabled={isSaving}
                                    required
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
                                    value={newCarbonCredit.accountManager.email}
                                    onChange={handleInputChange}
                                    placeholder="Nhập email quản lý"
                                    disabled={isSaving}
                                    required
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
                                    value={newCarbonCredit.accountManager.phone}
                                    onChange={handleInputChange}
                                    placeholder="Nhập SĐT quản lý"
                                    disabled={isSaving}
                                    required
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Tài chính & Gói đăng ký</h3>
                        <div className="space-y-2">
                            <Label htmlFor="price">Giá (VND):</Label>
                            <Input
                                id="price"
                                type="number"
                                value={newCarbonCredit.price ?? ''}
                                onChange={handleInputChange}
                                placeholder="Giá sản phẩm"
                                disabled={isSaving}
                            />
                        </div>

                        {/* Lượng đã dùng đã bị xóa */}

                        <div className="space-y-2">
                            <Label htmlFor="billingCycle">Chu kỳ thanh toán:</Label>
                            <Select
                                value={newCarbonCredit.billingCycle || ""}
                                onValueChange={(value) => handleSelectChange('billingCycle', value)}
                                disabled={isSaving}
                            >
                                <SelectTrigger id="billingCycle">
                                    <SelectValue placeholder="Chọn chu kỳ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="One-Time">Một lần</SelectItem>
                                    <SelectItem value="Monthly">Hàng tháng</SelectItem>
                                    <SelectItem value="Annually">Hàng năm</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subscriptionTier">Gói đăng ký:</Label>
                            <Select
                                value={newCarbonCredit.subscriptionTier || ""}
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
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Hủy
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={
                            isSaving ||
                            !newCarbonCredit.name.trim() ||
                            !newCarbonCredit.type.trim() ||
                            !newCarbonCredit.status.trim() || // Kiểm tra status (luôn là pending)
                            !newCarbonCredit.billingCycle.trim() ||
                            !newCarbonCredit.subscriptionTier.trim() ||
                            !newCarbonCredit.accountManager.name.trim() ||
                            !newCarbonCredit.accountManager.email.trim() ||
                            !newCarbonCredit.accountManager.phone.trim()
                        }
                    >
                        {isSaving ? (
                            <> <Save className="mr-2 h-4 w-4 animate-pulse" /> Đang tạo... </>
                        ) : (
                            <> <PlusCircle className="mr-2 h-4 w-4" /> Tạo Carbon Credit </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}