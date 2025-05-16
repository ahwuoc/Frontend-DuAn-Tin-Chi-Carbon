"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCarbonCredits, CarbonCredit } from "../../../fetch/fetch.carboncredits";

export default function CarbonCreditsPage() {
    const [credits, setCredits] = useState<CarbonCredit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCarbonCredits = async () => {
            try {
                const response = await apiCarbonCredits.getAll();
                if (response && response.data) {
                    const formatted = response.data.map((item: any) => ({
                        ...item,
                        id: item._id,
                    }));
                    setCredits(formatted);
                }
            } catch (e) {
                setError("Lỗi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetchCarbonCredits();
    }, []);

    const handleAdd = () => {
        router.push("/quan-ly/admin/carboncredits/create");
    };

    const handleEdit = (id: string) => {
        router.push(`/quan-ly/admin/carboncredits/edit/${id}`);
    };

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa không?")) {
            // Gọi API xóa rồi cập nhật UI
            alert(`Fake xóa item id=${id}`);
            setCredits((prev) => prev.filter((c) => c.id !== id));
        }
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div>{error}</div>;
    if (credits.length === 0) return <div>Không có dữ liệu.</div>;

    return (
        <div style={{ padding: 20 }}>
            <h1>Danh sách Carbon Credits</h1>
            <button onClick={handleAdd} style={{ marginBottom: 10, padding: "6px 12px" }}>
                Thêm mới
            </button>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#eee" }}>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Tiêu đề</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Trạng thái</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Vị trí</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Diện tích</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Thời gian</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Credits (Tổng / Đã dùng / Còn lại)</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Quản lý dự án</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Mô tả</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Ảnh</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {credits.map((c) => (
                        <tr key={c.id} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={{ border: "1px solid #ccc", padding: 8 }}>{c.title}</td>
                            <td style={{ border: "1px solid #ccc", padding: 8 }}>{c.status}</td>
                            <td style={{ border: "1px solid #ccc", padding: 8 }}>{c.location}</td>
                            <td style={{ border: "1px solid #ccc", padding: 8 }}>{c.area}</td>
                            <td style={{ border: "1px solid #ccc", padding: 8 }}>
                                {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: 8 }}>
                                {c.totalCredits} / {c.usedCredits} / {c.remainingCredits}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: 8 }}>
                                {c.projectManager} <br /> {c.projectPhone}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: 8 }}>{c.description}</td>
                            <td style={{ border: "1px solid #ccc", padding: 8 }}>
                                {c.image && <img src={c.image} alt={c.title} style={{ maxWidth: 120 }} />}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: 8, whiteSpace: "nowrap" }}>
                                <button onClick={() => handleEdit(c.id)} style={{ marginRight: 6 }}>
                                    Sửa
                                </button>
                                <button onClick={() => handleDelete(c.id)} style={{ color: "red" }}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
