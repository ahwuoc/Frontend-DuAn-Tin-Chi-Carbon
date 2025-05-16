"use client";
import { toast } from "sonner"; // hoặc react-hot-toast
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCertificates, Certificate } from "../../../../fetch/fetch.certificates";
export type CertificateStatus = "active" | "expired" | "pending";
const defaultForm: Partial<Certificate> = {
    id: "",
    name: "",
    type: "international_certificates",
    description: "",
    purchaseDate: "",
    expiryDate: "",
    status: "active",
    image: "",
    features: [],
    customFeatureName: "",
    price: 0,
};


const inputClass = "w-full border px-3 py-2 rounded";

export default function CreateCertificatePage() {
    const router = useRouter();
    const [form, setForm] = useState<Partial<Certificate>>(defaultForm);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            features: e.target.value.split(",").map(f => f.trim()),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!form.id || !form.name) throw new Error("ID và tên là bắt buộc");

            await toast.promise(
                apiCertificates.create(form as Certificate),
                {
                    loading: "Đang tạo chứng chỉ...",
                    success: "Tạo chứng chỉ thành công!",
                    error: "Tạo thất bại, thử lại!",
                }
            );

            router.push("/certificates");
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Tạo chứng chỉ mới</h1>
            {error && <p className="mb-4 text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {[
                    { name: "id", placeholder: "ID", required: true },
                    { name: "name", placeholder: "Tên", required: true },
                    { name: "type", placeholder: "Loại" },
                    { name: "status", placeholder: "Trạng thái" },
                    { name: "image", placeholder: "URL ảnh" },
                    { name: "certificateImage", placeholder: "URL ảnh chứng chỉ" },
                    { name: "customFeatureName", placeholder: "Tính năng tùy chỉnh" },
                    { name: "certificationLevel", placeholder: "Cấp độ chứng chỉ" },
                    { name: "issuer", placeholder: "Issuer" },
                ].map((input) => (
                    <input
                        key={input.name}
                        name={input.name}
                        placeholder={input.placeholder}
                        value={(form as any)[input.name] || ""}
                        onChange={handleChange}
                        className={inputClass}
                        required={input.required}
                    />
                ))}

                <textarea
                    name="description"
                    placeholder="Mô tả"
                    value={form.description}
                    onChange={handleChange}
                    className={inputClass}
                    rows={3}
                />

                {[
                    { name: "purchaseDate", label: "Ngày mua" },
                    { name: "expiryDate", label: "Ngày hết hạn" },
                    { name: "lastAccessed", label: "Ngày truy cập cuối" },
                ].map((input) => (
                    <input
                        key={input.name}
                        name={input.name}
                        type="date"
                        placeholder={input.label}
                        value={(form as any)[input.name]?.slice(0, 10) || ""}
                        onChange={handleChange}
                        className={inputClass}
                    />
                ))}

                <input
                    name="features"
                    placeholder="Tính năng (phân tách bằng dấu ,)"
                    value={form.features?.join(", ") || ""}
                    onChange={handleFeaturesChange}
                    className={inputClass}
                />

                <input
                    name="price"
                    type="number"
                    placeholder="Giá (VNĐ)"
                    value={form.price ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                />

                <input
                    name="courseProgress"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Tiến độ khóa học (%)"
                    value={form.courseProgress ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? "Đang lưu..." : "Tạo mới"}
                </button>
            </form>
        </div>
    );
}
