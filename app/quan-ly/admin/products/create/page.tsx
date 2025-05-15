// app/components/forms/ProductForm.tsx (or a similar path)
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { IProduct } from "@/app/fetch/fetch.products"; // Assuming IProduct is correctly defined
import { Trash2, Plus, Info, DollarSign, Settings, Users, ListChecks, Trees, MapPin, CheckSquare } from "lucide-react";
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

// Helper component for section titles
const FormSectionTitle = ({ title, icon }: { title: string, icon?: React.ReactNode }) => (
    <div className="flex items-center mb-6">
        {icon && <span className="mr-3 text-primary">{icon}</span>}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
    </div>
);

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
            const processedInitialData: ProductFormData = {
                ...defaultFormData,
                ...initialData,
                features: initialData.features?.map(f => ({ ...f, id: f.id || uuidv4() })) || [],
                accountManager: initialData.accountManager || { name: "", email: "", phone: "" },
            };
            setFormData(processedInitialData);
        } else {
            setFormData(defaultFormData);
        }
    }, [initialData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;
        let processedValue: string | number | undefined = value;

        if (type === 'number') {
            processedValue = value === '' ? undefined : Number(value); // Store as undefined if empty, else number
        }

        setFormData((prev) => ({ ...prev, [name]: processedValue }));
    };

    const handleAccountManagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            accountManager: {
                ...prev.accountManager!,
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

        if (formData.price !== undefined && formData.price < 0) {
            newErrors.price = "Giá không được âm.";
        }
        if (formData.carbonAmount !== undefined && formData.carbonAmount < 0) {
            newErrors.carbonAmount = "Lượng carbon không được âm.";
        }
        if (formData.area !== undefined && formData.area < 0) {
            newErrors.area = "Diện tích không được âm.";
        }

        if (!formData.accountManager?.name?.trim()) newErrors.accountManagerName = "Tên người quản lý là bắt buộc.";
        if (!formData.accountManager?.email?.trim()) newErrors.accountManagerEmail = "Email người quản lý là bắt buộc.";
        else if (!/\S+@\S+\.\S+/.test(formData.accountManager.email)) newErrors.accountManagerEmail = "Email không hợp lệ.";
        if (!formData.accountManager?.phone?.trim()) newErrors.accountManagerPhone = "Số điện thoại người quản lý là bắt buộc.";

        formData.features?.forEach((feature, index) => {
            if (!feature.title?.trim()) newErrors[`featureTitle${index}`] = `Tên tính năng ${index + 1} là bắt buộc.`;
            if (!feature.description?.trim()) newErrors[`featureDescription${index}`] = `Mô tả tính năng ${index + 1} là bắt buộc.`;
            // Icon can be optional, so not validated here unless required
            // if (!feature.icon?.trim()) newErrors[`featureIcon${index}`] = `Icon tính năng ${index + 1} là bắt buộc.`;
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
        await onSubmit(formData);
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
        <form onSubmit={handleSubmit} className="space-y-10 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl">

            {/* Section 1: Thông tin cơ bản */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <FormSectionTitle title="Thông tin cơ bản" icon={<Info size={24} />} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="name">Tên sản phẩm <span className="text-destructive">*</span></Label>
                        <Input id="name" name="name" value={formData.name || ""} onChange={handleInputChange} placeholder="Ví dụ: Gói Carbon Tín chỉ Rừng XYZ" disabled={isLoading} />
                        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="type">Loại sản phẩm <span className="text-destructive">*</span></Label>
                        <select id="type" name="type" value={formData.type || "carbon_credits"} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background" disabled={isLoading}>
                            <option value="carbon_credits">Carbon Credits</option>
                            <option value="carbon_accounting">Carbon Accounting</option>
                            <option value="international_certificates">Chứng chỉ quốc tế</option>
                        </select>
                        {errors.type && <p className="text-sm text-destructive mt-1">{errors.type}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="description">Mô tả sản phẩm <span className="text-destructive">*</span></Label>
                        <Textarea id="description" name="description" value={formData.description || ""} onChange={handleInputChange} placeholder="Mô tả chi tiết về sản phẩm/dịch vụ..." rows={4} disabled={isLoading} />
                        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                    </div>
                    <div>
                        <Label htmlFor="status">Trạng thái <span className="text-destructive">*</span></Label>
                        <select id="status" name="status" value={formData.status || "pending"} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background" disabled={isLoading}>
                            <option value="active">Hoạt động (Active)</option>
                            <option value="pending">Chờ duyệt (Pending)</option>
                            <option value="expired">Hết hạn (Expired)</option>
                            <option value="archived">Lưu trữ (Archived)</option>
                        </select>
                        {errors.status && <p className="text-sm text-destructive mt-1">{errors.status}</p>}
                    </div>
                </div>
            </div>

            {/* Section 2: Định giá & Gói dịch vụ */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <FormSectionTitle title="Định giá & Gói dịch vụ" icon={<DollarSign size={24} />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="price">Giá (VND)</Label>
                        <Input id="price" name="price" type="number" value={formData.price ?? ""} onChange={handleInputChange} placeholder="Nhập giá" min="0" disabled={isLoading} />
                        {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
                    </div>
                    <div>
                        <Label htmlFor="subscriptionTier">Cấp độ gói</Label>
                        <select id="subscriptionTier" name="subscriptionTier" value={formData.subscriptionTier || "basic"} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background" disabled={isLoading}>
                            <option value="basic">Cơ bản (Basic)</option>
                            <option value="professional">Chuyên nghiệp (Professional)</option>
                            <option value="enterprise">Doanh nghiệp (Enterprise)</option>
                        </select>
                        {errors.subscriptionTier && <p className="text-sm text-destructive mt-1">{errors.subscriptionTier}</p>}
                    </div>
                    <div>
                        <Label htmlFor="billingCycle">Chu kỳ thanh toán <span className="text-destructive">*</span></Label>
                        <select id="billingCycle" name="billingCycle" value={formData.billingCycle || "monthly"} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background" disabled={isLoading}>
                            <option value="monthly">Hàng tháng</option>
                            <option value="annually">Hàng năm</option>
                            <option value="one_time">Một lần</option>
                            <option value="trial">Dùng thử</option>
                            <option value="custom">Tùy chỉnh</option>
                        </select>
                        {errors.billingCycle && <p className="text-sm text-destructive mt-1">{errors.billingCycle}</p>}
                    </div>
                </div>
            </div>

            {/* Section 3: Chi tiết kỹ thuật (Ví dụ: cho sản phẩm Carbon) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <FormSectionTitle title="Thuộc tính kỹ thuật" icon={<Settings size={24} />} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="carbonAmount">Lượng Carbon (tấn CO2e)</Label>
                        <Input id="carbonAmount" name="carbonAmount" type="number" value={formData.carbonAmount ?? ""} onChange={handleInputChange} placeholder="Ví dụ: 100" min="0" disabled={isLoading} />
                        {errors.carbonAmount && <p className="text-sm text-destructive mt-1">{errors.carbonAmount}</p>}
                    </div>
                    <div>
                        <Label htmlFor="area">Diện tích (m² hoặc ha)</Label>
                        <Input id="area" name="area" type="number" value={formData.area ?? ""} onChange={handleInputChange} placeholder="Ví dụ: 5000 (cho m²)" min="0" disabled={isLoading} />
                        {errors.area && <p className="text-sm text-destructive mt-1">{errors.area}</p>}
                    </div>
                    <div>
                        <Label htmlFor="projectLocation">Vị trí dự án</Label>
                        <div className="flex items-center">
                            <MapPin size={18} className="mr-2 text-gray-400" />
                            <Input id="projectLocation" name="projectLocation" value={formData.projectLocation || ""} onChange={handleInputChange} placeholder="Địa điểm cụ thể hoặc vùng" disabled={isLoading} className="flex-1" />
                        </div>
                        {errors.projectLocation && <p className="text-sm text-destructive mt-1">{errors.projectLocation}</p>}
                    </div>
                    <div>
                        <Label htmlFor="verificationStandard">Tiêu chuẩn xác minh</Label>
                        <div className="flex items-center">
                            <CheckSquare size={18} className="mr-2 text-gray-400" />
                            <Input id="verificationStandard" name="verificationStandard" value={formData.verificationStandard || ""} onChange={handleInputChange} placeholder="Ví dụ: Verra VCS, Gold Standard" disabled={isLoading} className="flex-1" />
                        </div>
                        {errors.verificationStandard && <p className="text-sm text-destructive mt-1">{errors.verificationStandard}</p>}
                    </div>
                </div>
            </div>

            {/* Section 4: Người quản lý tài khoản */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <FormSectionTitle title="Người quản lý tài khoản" icon={<Users size={24} />} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="accountManagerName">Tên người quản lý <span className="text-destructive">*</span></Label>
                        <Input id="accountManagerName" name="name" value={formData.accountManager?.name || ""} onChange={handleAccountManagerChange} placeholder="Nguyễn Văn A" disabled={isLoading} />
                        {errors.accountManagerName && <p className="text-sm text-destructive mt-1">{errors.accountManagerName}</p>}
                    </div>
                    <div>
                        <Label htmlFor="accountManagerEmail">Email <span className="text-destructive">*</span></Label>
                        <Input id="accountManagerEmail" name="email" type="email" value={formData.accountManager?.email || ""} onChange={handleAccountManagerChange} placeholder="email@example.com" disabled={isLoading} />
                        {errors.accountManagerEmail && <p className="text-sm text-destructive mt-1">{errors.accountManagerEmail}</p>}
                    </div>
                    <div>
                        <Label htmlFor="accountManagerPhone">Số điện thoại <span className="text-destructive">*</span></Label>
                        <Input id="accountManagerPhone" name="phone" value={formData.accountManager?.phone || ""} onChange={handleAccountManagerChange} placeholder="09xxxxxxxx" disabled={isLoading} />
                        {errors.accountManagerPhone && <p className="text-sm text-destructive mt-1">{errors.accountManagerPhone}</p>}
                    </div>
                </div>
            </div>

            {/* Section 5: Tính năng */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <FormSectionTitle title="Tính năng nổi bật" icon={<ListChecks size={24} />} />
                <div className="space-y-4">
                    {(formData.features || []).map((feature, index) => (
                        <div key={feature.id} className="border border-dashed dark:border-gray-700 p-4 rounded-md space-y-3 bg-gray-50 dark:bg-gray-700/30 relative">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300">Tính năng {index + 1}</h4>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} disabled={isLoading} className="absolute top-2 right-2 text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <div>
                                <Label htmlFor={`featureTitle${index}`}>Tên tính năng <span className="text-destructive">*</span></Label>
                                <Input id={`featureTitle${index}`} placeholder="Ví dụ: Báo cáo tùy chỉnh" value={feature.title} onChange={(e) => updateFeature(index, "title", e.target.value)} disabled={isLoading} />
                                {errors[`featureTitle${index}`] && <p className="text-sm text-destructive mt-1">{errors[`featureTitle${index}`]}</p>}
                            </div>
                            <div>
                                <Label htmlFor={`featureDescription${index}`}>Mô tả tính năng <span className="text-destructive">*</span></Label>
                                <Textarea id={`featureDescription${index}`} placeholder="Mô tả chi tiết lợi ích của tính năng" value={feature.description} onChange={(e) => updateFeature(index, "description", e.target.value)} rows={2} disabled={isLoading} />
                                {errors[`featureDescription${index}`] && <p className="text-sm text-destructive mt-1">{errors[`featureDescription${index}`]}</p>}
                            </div>
                            <div>
                                <Label htmlFor={`featureIcon${index}`}>Tên Icon (ví dụ: 'star', 'shield-check')</Label>
                                <Input id={`featureIcon${index}`} placeholder="Từ thư viện Lucide React hoặc tên class FontAwesome" value={feature.icon} onChange={(e) => updateFeature(index, "icon", e.target.value)} disabled={isLoading} />
                                {errors[`featureIcon${index}`] && <p className="text-sm text-destructive mt-1">{errors[`featureIcon${index}`]}</p>}
                            </div>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" onClick={addFeature} className="w-full mt-6" disabled={isLoading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm tính năng
                </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-8 mt-8 border-t border-gray-300 dark:border-gray-700">
                {isEditMode && onDelete && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onDelete}
                        className="w-full sm:w-auto order-1 sm:order-none"
                        disabled={isLoading}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa sản phẩm
                    </Button>
                )}
                <Button type="submit" className="w-full sm:w-auto order-first sm:order-last" disabled={isLoading}>
                    {isLoading ? (isEditMode ? "Đang lưu..." : "Đang tạo...") : (isEditMode ? "Lưu thay đổi" : "Tạo sản phẩm")}
                </Button>
            </div>
        </form>
    );
}