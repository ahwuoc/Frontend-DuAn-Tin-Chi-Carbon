"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiCertificates, Certificate } from "../../../fetch/fetch.certificates";

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const response = await apiCertificates.getAll();
                if (response && response.data) {
                    setCertificates(response.data);
                } else {
                    setError("Không có dữ liệu");
                }
            } catch (e) {
                setError("Lỗi khi lấy dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetchCertificate();
    }, []);

    const handleDelete = async (_id: string) => {
        if (!confirm(`Bạn có chắc muốn xóa chứng chỉ ${_id} không?`)) return;
        try {
            await apiCertificates.delete(_id);
            setCertificates((prev) => prev.filter((c) => c._id !== _id));
        } catch {
            alert("Xóa thất bại!");
        }
    };

    if (loading) return <p>Loading... ⏳</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Danh sách chứng chỉ</h1>
            <Link
                href="/quan-ly/admin/certificates/create"
                className="inline-block mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
                ➕ Thêm chứng chỉ
            </Link>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            {[
                                "ID",
                                "Tên",
                                "Loại",
                                "Trạng thái",
                                "Tiến độ (%)",
                                "Ngày hết hạn",
                                "Issuer",
                                "Mô tả",
                                "Giá (VNĐ)",
                                "Tính năng",
                                "Tùy chỉnh tính năng",
                                "Ảnh",
                                "Hành động",
                            ].map((title) => (
                                <th
                                    key={title}
                                    className="border-b border-gray-300 px-4 py-2 text-left text-sm font-semibold"
                                >
                                    {title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.map((cert) => (
                            <tr key={cert._id} className="hover:bg-gray-50">
                                <td className="border-b border-gray-200 px-4 py-2 align-top">{cert._id}</td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top">{cert.name}</td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top">{cert.type}</td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top">{cert.status}</td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top">{cert.courseProgress}</td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top">
                                    {new Date(cert.expiryDate).toLocaleDateString("vi-VN")}
                                </td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top">{cert.issuer}</td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top max-w-xs">{cert.description}</td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top">{cert.price.toLocaleString("vi-VN")} VNĐ</td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top">
                                    <ul className="list-disc list-inside">
                                        {cert.features.map((f, i) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top">{cert.customFeatureName || "-"}</td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top">
                                    {cert.image ? (
                                        <img src={cert.image} alt={cert.name} className="w-20 rounded" />
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="border-b border-gray-200 px-4 py-2 align-top space-x-2">
                                    <Link
                                        href={`/quan-ly/admin/certificates/edit/${cert._id}`} // ✅ Đúng path với file `page.tsx` bạn có
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Sửa
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(cert._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
