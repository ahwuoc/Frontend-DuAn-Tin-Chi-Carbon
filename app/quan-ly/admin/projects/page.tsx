"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IProject } from "../../../fetch/fetch.projects";

import { apiProjects } from "../../../fetch/fetch.projects";


export default function AdminProjectCarbonPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Giả định apiProjects.getAll() trả về dữ liệu theo cấu trúc đã cung cấp
            const response = await apiProjects.getAll();
            if (Array.isArray(response.data)) {
                setProjects(response.data);
            } else {
                // Xử lý trường hợp response.data không phải là mảng
                console.error("Expected array from API, but received:", response.data);
                setProjects([]); // Đặt lại thành mảng rỗng để tránh lỗi
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError("Không thể tải danh sách dự án. Vui lòng thử lại.");
            setProjects([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleAddProject = () => {
        router.push("/quan-ly/admin/projects/create");
    };

    const handleEditProject = (id: string) => {
        router.push(`/quan-ly/admin/projects/edit/${id}`);
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa dự án này không?")) return;
        try {
            await apiProjects.delete(id);
            setProjects(prev => prev.filter(project => project._id !== id));
            toast({
                title: "Thành công",
                description: "Xóa dự án thành công!",
            });
        } catch (err) {
            toast({
                title: "Lỗi",
                description: "Không thể xóa dự án! Vui lòng thử lại.",
                variant: "destructive",
            });
        }
    };

    const formatDate = (dateString?: Date) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        // Kiểm tra tính hợp lệ của ngày
        if (isNaN(date.getTime())) {
            // Thử parse lại với định dạng ISO nếu lỗi
            try {
                const isoDate = new Date(dateString + 'Z'); // Thêm Z để đảm bảo parse theo UTC
                if (!isNaN(isoDate.getTime())) {
                    return isoDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
                }
            } catch (e) {
                // Bỏ qua lỗi parse nếu vẫn không thành công
            }
            return "Ngày không hợp lệ";
        }
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    const getStatusBadge = (status: IProject["status"]) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800",
            active: "bg-green-100 text-green-800",
            completed: "bg-blue-100 text-blue-800",
            archived: "bg-gray-100 text-gray-800",
        };
        const text =
            status === "pending"
                ? "Chờ duyệt"
                : status === "active"
                    ? "Hoạt động"
                    : status === "completed"
                        ? "Hoàn thành"
                        : "Lưu trữ";
        return (
            <Badge className={styles[status]}>
                {text}
            </Badge>
        );
    };

    if (loading) {
        return <div className="container mx-auto py-10 px-4 text-center">Đang tải danh sách dự án...</div>;
    }

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

    return (
        <div className="flex min-h-screen w-full">
            <div className="flex-1 p-4 md:p-8">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Danh sách dự án Carbon</CardTitle>
                                <CardDescription>Quản lý các dự án Carbon trên hệ thống</CardDescription>
                            </div>
                            <Button onClick={handleAddProject}>
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm dự án
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {projects.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Chưa có dự án nào. Thêm ngay!</p>
                                <Button className="mt-4" onClick={handleAddProject}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm dự án
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tên dự án</TableHead>
                                            <TableHead>Loại dự án</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Vị trí</TableHead>
                                            <TableHead>Diện tích (ha)</TableHead>{/* Thêm cột Diện tích */}
                                            <TableHead>Tín chỉ Carbon</TableHead>
                                            <TableHead>Tiến độ</TableHead>
                                            <TableHead>Ngày tạo</TableHead>
                                            <TableHead>Hành động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {projects.map(project => (
                                            <TableRow key={project._id} className="hover:bg-gray-50 transition-colors">
                                                <TableCell className="font-medium max-w-xs truncate" title={project.name}>
                                                    {project.name}
                                                </TableCell>
                                                <TableCell>{project.type || "N/A"}</TableCell>
                                                <TableCell>{getStatusBadge(project.status)}</TableCell>
                                                <TableCell>{project.location || "N/A"}</TableCell>
                                                {/* Hiển thị Diện tích */}
                                                <TableCell>{project.area ? `${project.area.toLocaleString()}` : "N/A"}</TableCell>
                                                {/* Hiển thị Tín chỉ Carbon: Available / Total */}
                                                <TableCell>
                                                    {project.carbonCredits !== undefined && project.carbonCreditsTotal !== undefined
                                                        ? `${project.carbonCredits.toLocaleString()} / ${project.carbonCreditsTotal.toLocaleString()} tấn`
                                                        : project.carbonCredits !== undefined
                                                            ? `${project.carbonCredits.toLocaleString()} tấn`
                                                            : "N/A"}
                                                </TableCell>
                                                <TableCell>{project.progress !== undefined ? `${project.progress}%` : "N/A"}</TableCell>
                                                <TableCell>{formatDate(project.createdAt)}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="hover:bg-blue-50 hover:text-blue-600"
                                                            onClick={() => handleEditProject(project._id)}
                                                        >
                                                            <Pencil className="w-4 h-4 mr-1" />
                                                            Sửa
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="hover:bg-red-50 hover:text-red-600"
                                                            onClick={() => handleDeleteProject(project._id)}
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