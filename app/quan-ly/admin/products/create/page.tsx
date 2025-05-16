// app/quan-ly/admin/products/create/page.tsx
// **LƯU Ý:** Kết hợp component form và logic trang vào MỘT file.
// Việc tách thành component riêng là phương pháp được khuyến khích trong thực tế.

"use client"; // Đánh dấu đây là Client Component vì sử dụng state, effect và event handlers

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // Giả định bạn có hook useToast
import { IProduct } from "@/app/fetch/fetch.products"; // Giả định interface sản phẩm
import { Trash2, Plus, Info, DollarSign, Settings, Users, ListChecks, MapPin, CheckSquare } from "lucide-react"; // Các icons

import { v4 as uuidv4 } from 'uuid'; // Để tạo ID tạm cho features trên client

// Định nghĩa kiểu dữ liệu cho Feature trong Form (bao gồm ID client-side)
interface FormFeature {
    id: string; // ID tạm thời cho UI list rendering
    title: string;
    description: string;
    icon: string;
}

// Định nghĩa kiểu dữ liệu cho toàn bộ Form Data
// Dựa trên IProduct nhưng bỏ đi các trường do backend quản lý và thêm/sửa các trường của form
export type ProductFormData = Partial<Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>> & {
    features?: FormFeature[]; // Sử dụng kiểu FormFeature đã định nghĩa
    accountManager?: { // Đảm bảo accountManager luôn là object
        name: string;
        email: string;
        phone: string;
    };
};

// Định nghĩa props mà component ProductForm (nếu là component riêng) sẽ nhận
// Chúng ta vẫn giữ định nghĩa này ở đây để rõ ràng về cấu trúc dữ liệu.
interface ProductFormProps {
    initialData?: ProductFormData | null; // Dữ liệu ban đầu cho chế độ chỉnh sửa
    onSubmit: (data: ProductFormData) => Promise<void>; // Hàm xử lý khi submit form
    isEditMode: boolean; // true nếu ở chế độ chỉnh sửa, false nếu tạo mới
    onDelete?: () => Promise<void>; // Hàm xử lý xóa (chỉ dùng trong edit mode)
    isLoading?: boolean; // Trạng thái loading để disable form
}

// Giá trị mặc định cho Form Data khi tạo mới
const defaultFormData: ProductFormData = {
    name: "",
    price: undefined, // undefined cho trường số có thể để trống
    type: "carbon_credits",
    description: "",
    status: "pending",
    subscriptionTier: "basic",
    billingCycle: "monthly",
    carbonAmount: undefined,
    accountManager: { name: "", email: "", phone: "" },
    features: [], // Mảng rỗng ban đầu
    projectLocation: "",
    verificationStandard: "",
    area: undefined,
};

// Helper component cho tiêu đề các phần của Form
const FormSectionTitle = ({ title, icon }: { title: string, icon?: React.ReactNode }) => (
    <div className="flex items-center mb-6">
        {icon && <span className="mr-3 text-primary">{icon}</span>}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
    </div>
);

// ========================================================================
// Đây là component Form CHÍNH (tương đương nội dung của ProductForm.tsx)
// Nó được định nghĩa BÊN TRONG file page.tsx này.
// ========================================================================
function ProductForm({
    initialData,
    onSubmit,
    isEditMode,
    onDelete,
    isLoading = false,
}: ProductFormProps) { // Nhận props như component riêng
    const { toast } = useToast(); // Sử dụng hook toast
    const [formData, setFormData] = useState<ProductFormData>(defaultFormData); // State quản lý dữ liệu form
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // State quản lý lỗi validation

    // Effect để nạp dữ liệu ban đầu khi initialData thay đổi (chế độ chỉnh sửa)
    useEffect(() => {
        if (initialData) {
            const processedInitialData: ProductFormData = {
                ...defaultFormData,
                ...initialData,
                // Tạo ID client-side cho features nếu chưa có (cho UI list)
                features: initialData.features?.map(f => ({ ...f, id: f.id || uuidv4() })) || [],
                accountManager: initialData.accountManager || { name: "", email: "", phone: "" },
            };
            setFormData(processedInitialData);
        } else {
            // Reset về default form data cho chế độ tạo mới
            setFormData(defaultFormData);
        }
    }, [initialData]); // Dependency array: chỉ chạy khi initialData thay đổi

    // Handler chung cho các input/textarea/select cơ bản
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;
        let processedValue: any = value;

        // Xử lý input number: chuyển empty string thành undefined, còn lại là Number
        if (type === 'number') {
            processedValue = value === '' ? undefined : Number(value);
        }

        // Cập nhật state cho trường tương ứng
        setFormData((prev) => ({ ...prev, [name]: processedValue }));
    };

    // Handler riêng cho các trường của accountManager (nested object)
    const handleAccountManagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target; // name ở đây là 'name', 'email', hoặc 'phone' của accountManager
        setFormData((prev) => ({
            ...prev,
            accountManager: {
                ...prev.accountManager!, // Spread các thuộc tính hiện có của accountManager
                [name]: value, // Cập nhật thuộc tính cụ thể (name/email/phone)
            },
        }));
    };

    // Hàm thực hiện validation cho toàn bộ form
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Validation các trường bắt buộc và ràng buộc giá trị
        if (!formData.name?.trim()) newErrors.name = "Tên sản phẩm là bắt buộc.";
        if (!formData.type) newErrors.type = "Loại sản phẩm là bắt buộc.";
        if (!formData.description?.trim()) newErrors.description = "Mô tả là bắt buộc.";
        if (!formData.status) newErrors.status = "Trạng thái sản phẩm là bắt buộc.";
        if (!formData.billingCycle) newErrors.billingCycle = "Chu kỳ thanh toán là bắt buộc.";

        // Validation cho các trường số (chỉ kiểm tra nếu có giá trị và là số)
        if (formData.price !== undefined && typeof formData.price === 'number' && formData.price < 0) {
            newErrors.price = "Giá không được âm.";
        }
        if (formData.carbonAmount !== undefined && typeof formData.carbonAmount === 'number' && formData.carbonAmount < 0) {
            newErrors.carbonAmount = "Lượng carbon không được âm.";
        }
        if (formData.area !== undefined && typeof formData.area === 'number' && formData.area < 0) {
            newErrors.area = "Diện tích không được âm.";
        }

        // Validation cho Account Manager
        if (!formData.accountManager?.name?.trim()) newErrors.accountManagerName = "Tên người quản lý là bắt buộc.";
        if (!formData.accountManager?.email?.trim()) newErrors.accountManagerEmail = "Email người quản lý là bắt buộc.";
        // Kiểm tra định dạng email nếu trường email có giá trị
        else if (formData.accountManager?.email && !/\S+@\S+\.\S+/.test(formData.accountManager.email)) newErrors.accountManagerEmail = "Email không hợp lệ.";
        if (!formData.accountManager?.phone?.trim()) newErrors.accountManagerPhone = "Số điện thoại người quản lý là bắt buộc.";

        // Validation cho từng mục trong mảng Features
        formData.features?.forEach((feature, index) => {
            if (!feature.title?.trim()) newErrors[`featureTitle${index}`] = `Tên tính năng ${index + 1} là bắt buộc.`;
            if (!feature.description?.trim()) newErrors[`featureDescription${index}`] = `Mô tả tính năng ${index + 1} là bắt buộc.`;
        });

        setErrors(newErrors); // Cập nhật state lỗi
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi nào
    };

    // Handler khi form được submit (sau khi click nút submit)
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn chặn form submit mặc định của trình duyệt

        // Chạy validation
        if (!validateForm()) {
            // Nếu validation thất bại, hiển thị toast và dừng lại
            toast({
                title: "Lỗi dữ liệu",
                description: "Vui lòng kiểm tra lại các trường thông tin đã nhập.",
                variant: "destructive",
            });
            return;
        }

        // Nếu validation thành công, gọi hàm onSubmit được truyền từ bên ngoài (từ page component)
        // Truyền dữ liệu form hiện tại
        await onSubmit(formData);
    };

    // Thêm một mục feature mới vào mảng features
    const addFeature = () => {
        setFormData((prev) => ({
            ...prev,
            features: [
                ...(prev.features || []), // Giữ lại các features cũ
                { id: uuidv4(), title: "", description: "", icon: "" }, // Thêm feature mới với ID duy nhất
            ],
        }));
    };

    // Cập nhật một mục feature cụ thể theo index và field
    const updateFeature = (
        index: number,
        field: keyof FormFeature,
        value: string,
    ) => {
        const updatedFeatures = [...(formData.features || [])]; // Tạo bản sao mảng features
        if (updatedFeatures[index]) { // Đảm bảo mục đó tồn tại
            (updatedFeatures[index] as any)[field] = value; // Cập nhật giá trị field
            setFormData((prev) => ({ ...prev, features: updatedFeatures })); // Cập nhật state
        }
    };

    // Xóa một mục feature theo index
    const removeFeature = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            features: (prev.features || []).filter((_, i) => i !== index), // Lọc bỏ mục có index tương ứng
        }));
    };

    // Phần render UI của Form
    return (
        <form onSubmit={handleFormSubmit} className="space-y-10 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl">

            {/* Section 1: Thông tin cơ bản */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <FormSectionTitle title="Thông tin cơ bản" icon={<Info size={24} />} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="name">Tên sản phẩm <span className="text-destructive">*</span></Label>
                        <Input id="name" name="name" value={formData.name ?? ""} onChange={handleInputChange} placeholder="Ví dụ: Gói Carbon Tín chỉ Rừng XYZ" disabled={isLoading} />
                        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="type">Loại sản phẩm <span className="text-destructive">*</span></Label>
                        <select id="type" name="type" value={formData.type ?? "carbon_credits"} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background" disabled={isLoading}>
                            <option value="carbon_credits">Carbon Credits</option>
                            <option value="carbon_accounting">Carbon Accounting</option>
                            <option value="international_certificates">Chứng chỉ quốc tế</option>
                        </select>
                        {errors.type && <p className="text-sm text-destructive mt-1">{errors.type}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="description">Mô tả sản phẩm <span className="text-destructive">*</span></Label>
                        <Textarea id="description" name="description" value={formData.description ?? ""} onChange={handleInputChange} placeholder="Mô tả chi tiết về sản phẩm/dịch vụ..." rows={4} disabled={isLoading} />
                        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                    </div>
                    <div>
                        <Label htmlFor="status">Trạng thái <span className="text-destructive">*</span></Label>
                        <select id="status" name="status" value={formData.status ?? "pending"} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background" disabled={isLoading}>
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
                        <select id="subscriptionTier" name="subscriptionTier" value={formData.subscriptionTier ?? "basic"} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background" disabled={isLoading}>
                            <option value="basic">Cơ bản (Basic)</option>
                            <option value="professional">Chuyên nghiệp (Professional)</option>
                            <option value="enterprise">Doanh nghiệp (Enterprise)</option>
                        </select>
                        {errors.subscriptionTier && <p className="text-sm text-destructive mt-1">{errors.subscriptionTier}</p>}
                    </div>
                    <div>
                        <Label htmlFor="billingCycle">Chu kỳ thanh toán <span className="text-destructive">*</span></Label>
                        <select id="billingCycle" name="billingCycle" value={formData.billingCycle ?? "monthly"} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary bg-background" disabled={isLoading}>
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
                            <Input id="projectLocation" name="projectLocation" value={formData.projectLocation ?? ""} onChange={handleInputChange} placeholder="Địa điểm cụ thể hoặc vùng" disabled={isLoading} className="flex-1" />
                        </div>
                        {errors.projectLocation && <p className="text-sm text-destructive mt-1">{errors.projectLocation}</p>}
                    </div>
                    <div>
                        <Label htmlFor="verificationStandard">Tiêu chuẩn xác minh</Label>
                        <div className="flex items-center">
                            <CheckSquare size={18} className="mr-2 text-gray-400" />
                            <Input id="verificationStandard" name="verificationStandard" value={formData.verificationStandard ?? ""} onChange={handleInputChange} placeholder="Ví dụ: Verra VCS, Gold Standard" disabled={isLoading} className="flex-1" />
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
                        <Input id="accountManagerName" name="name" value={formData.accountManager?.name ?? ""} onChange={handleAccountManagerChange} placeholder="Nguyễn Văn A" disabled={isLoading} />
                        {errors.accountManagerName && <p className="text-sm text-destructive mt-1">{errors.accountManagerName}</p>}
                    </div>
                    <div>
                        <Label htmlFor="accountManagerEmail">Email <span className="text-destructive">*</span></Label>
                        <Input id="accountManagerEmail" name="email" type="email" value={formData.accountManager?.email ?? ""} onChange={handleAccountManagerChange} placeholder="email@example.com" disabled={isLoading} />
                        {errors.accountManagerEmail && <p className="text-sm text-destructive mt-1">{errors.accountManagerEmail}</p>}
                    </div>
                    <div>
                        <Label htmlFor="accountManagerPhone">Số điện thoại <span className="text-destructive">*</span></Label>
                        <Input id="accountManagerPhone" name="phone" value={formData.accountManager?.phone ?? ""} onChange={handleAccountManagerChange} placeholder="09xxxxxxxx" disabled={isLoading} />
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
                                <Label htmlFor={`featureTitle${feature.id}`}>Tên tính năng <span className="text-destructive">*</span></Label>
                                <Input id={`featureTitle${feature.id}`} placeholder="Ví dụ: Báo cáo tùy chỉnh" value={feature.title} onChange={(e) => updateFeature(index, "title", e.target.value)} disabled={isLoading} />
                                {errors[`featureTitle${index}`] && <p className="text-sm text-destructive mt-1">{errors[`featureTitle${index}`]}</p>}
                            </div>
                            <div>
                                <Label htmlFor={`featureDescription${feature.id}`}>Mô tả tính năng <span className="text-destructive">*</span></Label>
                                <Textarea id={`featureDescription${feature.id}`} placeholder="Mô tả chi tiết lợi ích của tính năng" value={feature.description} onChange={(e) => updateFeature(index, "description", e.target.value)} rows={2} disabled={isLoading} />
                                {errors[`featureDescription${index}`] && <p className="text-sm text-destructive mt-1">{errors[`featureDescription${index}`]}</p>}
                            </div>
                            <div>
                                <Label htmlFor={`featureIcon${feature.id}`}>Tên Icon (ví dụ: 'star', 'shield-check')</Label>
                                <Input id={`featureIcon${feature.id}`} placeholder="Từ thư viện Lucide React hoặc tên class FontAwesome" value={feature.icon} onChange={(e) => updateFeature(index, "icon", e.target.value)} disabled={isLoading} />
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
                {/* Nút xóa chỉ hiển thị ở chế độ chỉnh sửa */}
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
                {/* Nút Submit */}
                <Button type="submit" className="w-full sm:w-auto order-first sm:order-last" disabled={isLoading}>
                    {isLoading ? (isEditMode ? "Đang lưu..." : "Đang tạo...") : (isEditMode ? "Lưu thay đổi" : "Tạo sản phẩm")}
                </Button>
            </div>
        </form>
    );
}

// ========================================================================
// Đây là Component Trang (Page Component)
// Đây là default export mà Next.js sẽ render cho route tương ứng.
// Component này sẽ sử dụng component ProductForm được định nghĩa bên trên.
// ========================================================================

// Import hook useToast (nếu chưa import ở trên cùng)
// import { useToast } from "@/hooks/use-toast";
// Import useRouter nếu cần chuyển hướng sau khi submit
// import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
    const { toast } = useToast();
    // const router = useRouter(); // Khởi tạo router

    // State quản lý trạng thái loading khi gọi API
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hàm xử lý dữ liệu form sau khi ProductForm validate và gọi onSubmit
    const handleProductSubmit = async (data: ProductFormData) => {
        setIsSubmitting(true); // Bắt đầu trạng thái loading
        console.log("Dữ liệu sản phẩm mới sẵn sàng để gửi API:", data);

        // TODO: THAY THẾ PHẦN NÀY bằng logic gọi API THỰC TẾ của bạn
        // để gửi dữ liệu 'data' lên backend để tạo sản phẩm mới.

        try {
            // Ví dụ: Gọi API POST để tạo sản phẩm
            const response = await fetch('/api/products', { // Điều chỉnh URL API của bạn cho đúng
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Thêm các header Auth nếu cần
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('API phản hồi thành công:', result);

                toast({
                    title: "Thành công!",
                    description: "Sản phẩm mới đã được tạo thành công.",
                    variant: "default",
                });

                // TODO: Chuyển hướng người dùng sau khi tạo thành công
                // router.push('/quan-ly/admin/products');

            } else {
                const errorData = await response.json();
                console.error('Lỗi từ API:', response.status, errorData);

                toast({
                    title: "Lỗi!",
                    description: errorData.message || "Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Lỗi trong quá trình gửi request:', error);
            toast({
                title: "Lỗi!",
                description: "Không thể kết nối đến server hoặc xử lý yêu cầu. Vui lòng kiểm tra kết nối mạng.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false); // Kết thúc trạng thái loading
        }
    };

    // Trong page component này, chúng ta render ProductForm
    // và truyền các props cần thiết.
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Tạo Sản phẩm Mới</h1>

            {/* Render ProductForm và truyền props */}
            <ProductForm
                // initialData không cần thiết khi tạo mới, nên để undefined hoặc null (mặc định)
                onSubmit={handleProductSubmit} // Truyền hàm xử lý submit của trang vào form
                isEditMode={false}            // Chế độ tạo mới
                // onDelete không cần thiết ở trang tạo mới
                isLoading={isSubmitting}      // Truyền trạng thái loading vào form
            />
        </div>
    );
}