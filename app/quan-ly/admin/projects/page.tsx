// AdminProjectCarbonPage.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Sử dụng components từ shadcn/ui
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"; // Sử dụng components từ shadcn/ui
import { Button } from "@/components/ui/button"; // Sử dụng components từ shadcn/ui
import { Plus, Pencil, Trash2 } from "lucide-react"; // Sử dụng icons từ lucide-react
import { useToast } from "@/hooks/use-toast"; // Sử dụng hook toast của bạn
import { ProjectCarbonApiResponse as IProjectCarbon } from "@/app/fetch/fetch.project-carbon";

import { apiProjectCarbon, } from "@/app/fetch/fetch.project-carbon"; // <-- Cần đảm bảo file này tồn tại và có các phương thức getAll, delete
export default function AdminProjectCarbonPage() {
    const router = useRouter();
    // Cập nhật state để lưu trữ danh sách dự án Carbon
    const [projects, setProjects] = useState<IProjectCarbon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Hàm lấy danh sách dự án
    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Gọi API để lấy danh sách dự án
            const response = await apiProjectCarbon.getAll();
            // Giả định cấu trúc response tương tự apiNews: { data: { data: [...] } }
            if (response?.data && Array.isArray(response.data)) {
                setProjects(response.data);
            } else {
                // Xử lý trường hợp API trả về dữ liệu không đúng định dạng
                console.error("API response did not contain data.data array:", response);
                setProjects([]); // Đặt danh sách rỗng nếu không có dữ liệu hợp lệ
                // throw new Error("Không lấy được danh sách dự án Carbon"); // Có thể ném lỗi hoặc chỉ log
            }
        } catch (err: any) {
            console.error("Lỗi khi lấy dữ liệu dự án Carbon:", err);
            setError("Không thể tải danh sách dự án Carbon. Vui lòng thử lại.");
            setProjects([]); // Đặt danh sách rỗng khi có lỗi
        } finally {
            setLoading(false);
        }
    }, []); // dependencies array trống vì không phụ thuộc vào biến nào bên ngoài cần theo dõi

    // Effect để gọi hàm fetchProjects khi component mount
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]); // Thêm fetchProjects vào dependencies array theo khuyến cáo của React Hook

    // Xử lý khi click nút Thêm dự án
    const handleAddProject = () => {
        router.push("/quan-ly/admin/projects/create"); // Cập nhật đường dẫn
    };

    // Xử lý khi click nút Sửa dự án
    const handleEditProject = (id: string) => {
        router.push(`/quan-ly/admin/projects/edit/${id}`); // Cập nhật đường dẫn
    };

    // Xử lý khi click nút Xóa dự án
    const handleDeleteProject = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa dự án này không?")) {
            return; // Hỏi xác nhận trước khi xóa
        }
        try {
            // Gọi API để xóa dự án
            await apiProjectCarbon.delete(id);
            // Cập nhật state để loại bỏ dự án đã xóa
            setProjects((prev) => prev.filter((project) => project._id !== id));
            toast({
                title: "Thành công",
                description: "Xóa dự án thành công! 🗑️",
            });
        } catch (err: any) {
            console.error("Lỗi khi xóa dự án:", err);
            toast({
                title: "Lỗi",
                description: "Không thể xóa dự án! 😵 Vui lòng thử lại.",
                variant: "destructive",
            });
        }
    };

    // Hàm định dạng ngày tháng (giữ nguyên)
    const formatDate = (dateString: Date | string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return "Ngày không hợp lệ"; // Xử lý ngày không hợp lệ
            }
            return date.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch (e) {
            console.error("Lỗi định dạng ngày:", e);
            return "Ngày không hợp lệ"; // Xử lý lỗi khi tạo Date
        }
    };

    // Hiển thị khi đang tải
    if (loading) {
        return (
            <div className="container mx-auto py-10 px-4 text-center">
                <p>Đang tải danh sách dự án...</p>
            </div>
        );
    }

    // Hiển thị khi có lỗi
    if (error) {
        return (
            <div className="container mx-auto py-10 px-4 text-center">
                <p className="text-red-500">{error}</p>
                <Button onClick={fetchProjects} className="mt-4">
                    Thử lại
                </Button>
            </div>
        );
    }

    // Hiển thị giao diện danh sách dự án
    return (
        <div className="flex min-h-screen w-full">
            <div className="flex-1 p-4 md:p-8">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Danh sách dự án Carbon</CardTitle>
                                <CardDescription>
                                    Quản lý thông tin các dự án Carbon trên hệ thống
                                </CardDescription>
                            </div>
                            <Button onClick={handleAddProject}>
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm dự án
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Kiểm tra nếu không có dự án nào */}
                        {projects.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Chưa có dự án nào. Thêm ngay!</p>
                                <Button className="mt-4" onClick={handleAddProject}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm dự án
                                </Button>
                            </div>
                        ) : (
                            // Hiển thị bảng nếu có dự án
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {/* Cập nhật các cột của bảng */}
                                            <TableHead>Tên dự án</TableHead>
                                            <TableHead>Loại dự án</TableHead>
                                            <TableHead>Tổ chức</TableHead>
                                            <TableHead>Điện thoại</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Ngày tạo</TableHead>
                                            <TableHead>Hành động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Mapping qua danh sách dự án để tạo các hàng */}
                                        {projects.map((project) => (
                                            <TableRow
                                                key={project._id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                {/* Hiển thị dữ liệu cho từng cột */}
                                                <TableCell
                                                    className="font-medium max-w-xs truncate"
                                                    title={project.name}
                                                >
                                                    {project.name || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {/* Hiển thị loại dự án với label tiếng Việt */}
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.projectType === "forest" ? "bg-green-100 text-green-800" :
                                                        project.projectType === "rice" ? "bg-blue-100 text-blue-800" :
                                                            project.projectType === "biochar" ? "bg-yellow-100 text-yellow-800" :
                                                                "bg-gray-100 text-gray-800"
                                                        }`}>
                                                        {project.projectType === "forest"
                                                            ? "Lâm nghiệp"
                                                            : project.projectType === "rice"
                                                                ? "Lúa"
                                                                : project.projectType === "biochar"
                                                                    ? "Biochar"
                                                                    : "Không xác định"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{project.organization || "N/A"}</TableCell>
                                                <TableCell>{project.phone || "N/A"}</TableCell>
                                                <TableCell
                                                    className="max-w-xs truncate"
                                                    title={project.email}
                                                >
                                                    {project.email || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {project.createdAt
                                                        ? formatDate(project.createdAt)
                                                        : "N/A"}
                                                </TableCell>
                                                {/* Cột hành động */}
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                            onClick={() => handleEditProject(project._id)}
                                                            title="Sửa dự án"
                                                        >
                                                            <Pencil className="w-4 h-4 mr-1" />
                                                            Sửa
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                                            onClick={() => handleDeleteProject(project._id)}
                                                            title="Xóa dự án"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
