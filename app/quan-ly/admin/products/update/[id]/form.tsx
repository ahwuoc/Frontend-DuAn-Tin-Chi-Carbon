// app/components/forms/ProductForm.tsx (or a similar path)
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { IProduct } from "@/app/fetch/fetch.products"; // Assuming IProduct is correctly defined
import { Trash2, Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid'; // Make sure to npm install uuid and @types/uuid

// Define a more specific type for features within the form if IProduct['features'] is too broad or allows undefined
interface FormFeature {
    id: string; // Ensure id is always string for local state key
    title: string;
    description: string;
    icon: string;
    // Add other fields if necessary from IProduct['features'][0]
}

// FormData should align with IProduct, allowing for partial updates
// and handling potentially undefined fields during initialization.
export type ProductFormData = Partial<Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>> & {
    features?: FormFeature[]; // Use the local FormFeature type
    // Ensure accountManager is always an object, even if its fields are empty strings
    accountManager?: {
        name: string;
        email: string;
        phone: string;
    };
};


interface ProductFormProps {
    initialData?: ProductFormData | null; // Product data for editing, null for create
    onSubmit: (data: ProductFormData) => Promise<void>;
    isEditMode: boolean;
    onDelete?: () => Promise<void>; // Optional delete handler for edit mode
    isLoading?: boolean; // To disable form during submission
}

const defaultFormData: ProductFormData = {
    name: "",
    price: 0,
    type: "carbon_credits",
    description: "",
    status: "pending",
    subscriptionTier: "basic",
    billingCycle: "monthly",
    carbonAmount: 0,
    accountManager: { name: "", email: "", phone: "" },
    features: [],
    projectLocation: "",
    verificationStandard: "",
    area: 0,
};

export default function ProductForm({
    initialData,
    onSubmit,
    isEditMode,
    onDelete,
    isLoading = false,
}: ProductFormProps) {
    const { toast } = useToast();
    const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (initialData) {
            // Ensure features have string IDs and accountManager is initialized
            const processedInitialData: ProductFormData = {
                ...defaultFormData, // Start with defaults to ensure all fields are present
                ...initialData,
                features: initialData.features?.map(f => ({ ...f, id: f.id || uuidv4() })) || [],
                accountManager: initialData.accountManager || { name: "", email: "", phone: "" },
            };
            setFormData(processedInitialData);
        } else {
            setFormData(defaultFormData); // Reset to default for create mode
        }
    }, [initialData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;
        let processedValue: string | number = value;

        if (type === 'number') {
            processedValue = value === '' ? '' : Number(value); // Allow empty string for temporary state, convert to number
        }

        setFormData((prev) => ({ ...prev, [name]: processedValue }));
    };

    const handleAccountManagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            accountManager: {
                ...prev.accountManager!, // Non-null assertion as it's initialized
                [name]: value,
            },
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name?.trim()) newErrors.name = "Tên sản phẩm là bắt buộc.";
        if (!formData.type) newErrors.type = "Loại sản phẩm là bắt buộc.";
        if (!formData.description?.trim()) newErrors.description = "Mô tả là bắt buộc.";
        if (!formData.status) newErrors.status = "Trạng thái sản phẩm là bắt buộc.";
        if (!formData.billingCycle) newErrors.billingCycle = "Chu kỳ thanh toán là bắt buộc.";

        if (formData.price !== undefined && formData.price !== null && formData.price < 0) {
            newErrors.price = "Giá không được âm.";
        }
        if (formData.carbonAmount !== undefined && formData.carbonAmount !== null && formData.carbonAmount < 0) {
            newErrors.carbonAmount = "Lượng carbon không được âm.";
        }
        if (formData.area !== undefined && formData.area !== null && formData.area < 0) {
            newErrors.area = "Diện tích không được âm.";
        }

        if (!formData.accountManager?.name?.trim()) newErrors.accountManagerName = "Tên người quản lý là bắt buộc.";
        if (!formData.accountManager?.email?.trim()) newErrors.accountManagerEmail = "Email người quản lý là bắt buộc.";
        else if (!/\S+@\S+\.\S+/.test(formData.accountManager.email)) newErrors.accountManagerEmail = "Email không hợp lệ.";
        if (!formData.accountManager?.phone?.trim()) newErrors.accountManagerPhone = "Số điện thoại người quản lý là bắt buộc.";

        formData.features?.forEach((feature, index) => {
            if (!feature.title?.trim()) newErrors[`featureTitle${index}`] = `Tên tính năng ${index + 1} là bắt buộc.`;
            if (!feature.description?.trim()) newErrors[`featureDescription${index}`] = `Mô tả tính năng ${index + 1} là bắt buộc.`;
            if (!feature.icon?.trim()) newErrors[`featureIcon${index}`] = `Icon tính năng ${index + 1} là bắt buộc.`;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast({
                title: "Lỗi dữ liệu",
                description: "Vui lòng kiểm tra lại các trường thông tin đã nhập.",
                variant: "destructive",
            });
            return;
        }
        // Filter out empty string prices before submitting
        const dataToSubmit = { ...formData };
        if (dataToSubmit.price === '') dataToSubmit.price = undefined;
        if (dataToSubmit.carbonAmount === '') dataToSubmit.carbonAmount = undefined;
        if (dataToSubmit.area === '') dataToSubmit.area = undefined;


        await onSubmit(dataToSubmit);
    };

    const addFeature = () => {
        setFormData((prev) => ({
            ...prev,
            features: [
                ...(prev.features || []),
                { id: uuidv4(), title: "", description: "", icon: "" },
            ],
        }));
    };

    const updateFeature = (
        index: number,
        field: keyof FormFeature,
        value: string,
    ) => {
        const updatedFeatures = [...(formData.features || [])];
        // Type assertion as we know 'id' is not meant to be updated this way or other fields are strings
        (updatedFeatures[index] as any)[field] = value;
        setFormData((prev) => ({ ...prev, features: updatedFeatures }));
    };

    const removeFeature = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            features: (prev.features || []).filter((_, i) => i !== index),
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-1"> {/* Add p-1 to ensure scrollbar shows if content overflows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        placeholder="Nhập tên sản phẩm"
                        disabled={isLoading}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                {/* Price */}
                <div className="space-y-1">
                    <Label htmlFor="price">Giá (VND)</Label>
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price ?? ""} // Use ?? for potentially undefined or null
                        onChange={handleInputChange}
                        placeholder="Nhập giá sản phẩm"
                        min="0"
                        disabled={isLoading}
                    />
                    {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>

                {/* Type */}
                <div className="space-y-1">
                    <Label htmlFor="type">Loại sản phẩm</Label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type || "carbon_credits"}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background"
                        disabled={isLoading}
                    >
                        <option value="carbon_credits">Carbon Credits</option>
                        <option value="carbon_accounting">Carbon Accounting</option>
                        <option value="international_certificates">Chứng chỉ quốc tế</option>
                    </select>
                    {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                </div>

                {/* Status */}
                <div className="space-y-1">
                    <Label htmlFor="status">Trạng thái</Label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status || "pending"}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background"
                        disabled={isLoading}
                    >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="expired">Expired</option>
                    </select>
                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả sản phẩm"
                    rows={4}
                    disabled={isLoading}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subscription Tier */}
                <div className="space-y-1">
                    <Label htmlFor="subscriptionTier">Cấp độ</Label>
                    <select
                        id="subscriptionTier"
                        name="subscriptionTier"
                        value={formData.subscriptionTier || "basic"}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background"
                        disabled={isLoading}
                    >
                        <option value="basic">Basic</option>
                        <option value="professional">Professional</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                    {errors.subscriptionTier && <p className="text-sm text-destructive">{errors.subscriptionTier}</p>}
                </div>

                {/* Billing Cycle */}
                <div className="space-y-1">
                    <Label htmlFor="billingCycle">Chu kỳ thanh toán</Label>
                    <select
                        id="billingCycle"
                        name="billingCycle"
                        value={formData.billingCycle || "monthly"}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background"
                        disabled={isLoading}
                    >
                        <option value="monthly">Hàng tháng</option>
                        <option value="annually">Hàng năm</option>
                        <option value="trial">Dùng thử</option>
                        <option value="custom">Tùy chỉnh</option>
                    </select>
                    {errors.billingCycle && <p className="text-sm text-destructive">{errors.billingCycle}</p>}
                </div>

                {/* Carbon Amount */}
                <div className="space-y-1">
                    <Label htmlFor="carbonAmount">Lượng Carbon (tấn)</Label>
                    <Input
                        id="carbonAmount"
                        name="carbonAmount"
                        type="number"
                        value={formData.carbonAmount ?? ""}
                        onChange={handleInputChange}
                        placeholder="Nhập lượng carbon"
                        min="0"
                        disabled={isLoading}
                    />
                    {errors.carbonAmount && <p className="text-sm text-destructive">{errors.carbonAmount}</p>}
                </div>

                {/* Area */}
                <div className="space-y-1">
                    <Label htmlFor="area">Diện tích (m²)</Label>
                    <Input
                        id="area"
                        name="area"
                        type="number"
                        value={formData.area ?? ""}
                        onChange={handleInputChange}
                        placeholder="Nhập diện tích (tùy chọn)"
                        min="0"
                        disabled={isLoading}
                    />
                    {errors.area && <p className="text-sm text-destructive">{errors.area}</p>}
                </div>
            </div>

            {/* Account Manager */}
            <fieldset className="border p-4 rounded-md space-y-3">
                <legend className="text-lg font-medium px-1">Người quản lý tài khoản</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="accountManagerName">Tên</Label>
                        <Input
                            id="accountManagerName"
                            name="name" // Matches key in accountManager object
                            value={formData.accountManager?.name || ""}
                            onChange={handleAccountManagerChange}
                            placeholder="Tên người quản lý"
                            disabled={isLoading}
                        />
                        {errors.accountManagerName && <p className="text-sm text-destructive">{errors.accountManagerName}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="accountManagerEmail">Email</Label>
                        <Input
                            id="accountManagerEmail"
                            name="email" // Matches key in accountManager object
                            type="email"
                            value={formData.accountManager?.email || ""}
                            onChange={handleAccountManagerChange}
                            placeholder="Email người quản lý"
                            disabled={isLoading}
                        />
                        {errors.accountManagerEmail && <p className="text-sm text-destructive">{errors.accountManagerEmail}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="accountManagerPhone">Số điện thoại</Label>
                        <Input
                            id="accountManagerPhone"
                            name="phone" // Matches key in accountManager object
                            value={formData.accountManager?.phone || ""}
                            onChange={handleAccountManagerChange}
                            placeholder="Số điện thoại"
                            disabled={isLoading}
                        />
                        {errors.accountManagerPhone && <p className="text-sm text-destructive">{errors.accountManagerPhone}</p>}
                    </div>
                </div>
            </fieldset>

            {/* Features */}
            <fieldset className="border p-4 rounded-md space-y-3">
                <legend className="text-lg font-medium px-1">Tính năng</legend>
                {(formData.features || []).map((feature, index) => (
                    <div key={feature.id} className="border p-3 rounded-md space-y-2 bg-muted/50">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">Tính năng {index + 1}</h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFeature(index)}
                                disabled={isLoading}
                            >
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`featureTitle${index}`}>Tên tính năng</Label>
                            <Input
                                id={`featureTitle${index}`}
                                placeholder="Tên tính năng"
                                value={feature.title}
                                onChange={(e) => updateFeature(index, "title", e.target.value)}
                                disabled={isLoading}
                            />
                            {errors[`featureTitle${index}`] && <p className="text-sm text-destructive">{errors[`featureTitle${index}`]}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`featureDescription${index}`}>Mô tả tính năng</Label>
                            <Textarea
                                id={`featureDescription${index}`}
                                placeholder="Mô tả tính năng"
                                value={feature.description}
                                onChange={(e) => updateFeature(index, "description", e.target.value)}
                                rows={2}
                                disabled={isLoading}
                            />
                            {errors[`featureDescription${index}`] && <p className="text-sm text-destructive">{errors[`featureDescription${index}`]}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`featureIcon${index}`}>Icon</Label>
                            <Input
                                id={`featureIcon${index}`}
                                placeholder="Icon (e.g., 'lucide:star', 'fa-star')"
                                value={feature.icon}
                                onChange={(e) => updateFeature(index, "icon", e.target.value)}
                                disabled={isLoading}
                            />
                            {errors[`featureIcon${index}`] && <p className="text-sm text-destructive">{errors[`featureIcon${index}`]}</p>}
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature} className="w-full mt-2" disabled={isLoading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm tính năng
                </Button>
            </fieldset>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project Location */}
                <div className="space-y-1">
                    <Label htmlFor="projectLocation">Vị trí dự án (tùy chọn)</Label>
                    <Input
                        id="projectLocation"
                        name="projectLocation"
                        value={formData.projectLocation || ""}
                        onChange={handleInputChange}
                        placeholder="Nhập vị trí dự án"
                        disabled={isLoading}
                    />
                    {errors.projectLocation && <p className="text-sm text-destructive">{errors.projectLocation}</p>}
                </div>

                {/* Verification Standard */}
                <div className="space-y-1">
                    <Label htmlFor="verificationStandard">Tiêu chuẩn xác minh (tùy chọn)</Label>
                    <Input
                        id="verificationStandard"
                        name="verificationStandard"
                        value={formData.verificationStandard || ""}
                        onChange={handleInputChange}
                        placeholder="Nhập tiêu chuẩn xác minh"
                        disabled={isLoading}
                    />
                    {errors.verificationStandard && <p className="text-sm text-destructive">{errors.verificationStandard}</p>}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t mt-6">
                <div className="flex gap-3">
                    <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                        {isLoading ? (isEditMode ? "Đang lưu..." : "Đang thêm...") : (isEditMode ? "Lưu thay đổi" : "Thêm sản phẩm")}
                    </Button>
                    {/* Navigation back can be handled by the parent page after successful submit */}
                </div>
                {isEditMode && onDelete && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onDelete}
                        className="w-full sm:w-auto"
                        disabled={isLoading}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa sản phẩm
                    </Button>
                )}
            </div>
        </form>
    );
}