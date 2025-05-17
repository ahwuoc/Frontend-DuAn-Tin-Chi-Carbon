"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCertificates, Certificate } from "../../../../../fetch/fetch.certificates";
export default function EditCertificatePage() {
    const router = useRouter();
    const params = useParams();
    const _id = params.id as string;

    const [form, setForm] = useState<Partial<Certificate>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiCertificates.getById(_id);
                if (res && res.payload) {
                    setForm(res.payload);
                } else {
                    setError("Không tìm thấy chứng chỉ");
                }
            } catch {
                setError("Lỗi khi lấy dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [_id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            // Chuyển giá trị số nếu cần
            [name]: name === "price" || name === "courseProgress" ? Number(value) : value,
        }));
    };

    const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            features: e.target.value.split(",").map((f) => f.trim()),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await apiCertificates.update(_id, form as Certificate);
            router.push("/quan-ly/admin/certificates");
        } catch (err: any) {
            setError(err.message || "Lỗi khi cập nhật");
        } finally {
            setSaving(false);
        }
    };
    if (loading) return <p>Loading... ⏳</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Sửa chứng chỉ: {_id}</h1>
            {error && <p className="mb-4 text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="_id"
                    placeholder="ID"
                    value={form._id || ""}
                    className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                    disabled
                />
                <input
                    name="name"
                    placeholder="Tên"
                    value={form.name || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    name="type"
                    placeholder="Loại"
                    value={form.type || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <textarea
                    name="description"
                    placeholder="Mô tả"
                    value={form.description || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    rows={3}
                />
                <input
                    name="purchaseDate"
                    type="date"
                    placeholder="Ngày mua"
                    value={form.purchaseDate?.slice(0, 10) || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="expiryDate"
                    type="date"
                    placeholder="Ngày hết hạn"
                    value={form.expiryDate?.slice(0, 10) || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="status"
                    placeholder="Trạng thái"
                    value={form.status || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="image"
                    placeholder="URL ảnh"
                    value={form.image || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="certificateImage"
                    placeholder="URL ảnh chứng chỉ"
                    value={form.certificateImage || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="features"
                    placeholder="Tính năng (phân tách bằng dấu ,)"
                    value={form.features?.join(", ") || ""}
                    onChange={handleFeaturesChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="customFeatureName"
                    placeholder="Tính năng tùy chỉnh"
                    value={form.customFeatureName || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="price"
                    type="number"
                    placeholder="Giá (VNĐ)"
                    value={form.price ?? ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="certificationLevel"
                    placeholder="Cấp độ chứng chỉ"
                    value={form.certificationLevel || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="courseProgress"
                    type="number"
                    placeholder="Tiến độ khóa học (%)"
                    value={form.courseProgress ?? ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    min={0}
                    max={100}
                />
                <input
                    name="lastAccessed"
                    type="date"
                    placeholder="Ngày truy cập cuối"
                    value={form.lastAccessed?.slice(0, 10) || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="issuer"
                    placeholder="Issuer"
                    value={form.issuer || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </form>
        </div>
    );
}
