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
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react"; // Chỉ giữ lại CheckCircle icon
import { useToast } from "@/hooks/use-toast";
import { apiProjects } from "../../../fetch/fetch.projects";

// Cập nhật interface IProject để phù hợp với dữ liệu bạn cung cấp
export interface IProject {
  _id: string;
  name: string; // Tên dự án
  organization: string;
  phone: string;
  email: string;
  address: string;
  projectType:
    | "forest"
    | "agriculture"
    | "renewable_energy"
    | "waste_management"
    | string;
  additionalInfo: string;
  landDocuments: any[];
  kmlFile: any | null;
  userId: {
    _id: string;
    email: string;
    name: string; // Tên người dùng/người gửi
    role: string;
    avatar: string;
    provider: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  } | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  status?: "pending" | "active" | "completed" | "archived";
  details?: {
    forestLocation?: string;
    forestArea?: string;
    treeSpecies?: string;
    plantingAge?: string;
    averageHeight?: string;
    averageCircumference?: string;
    previousDeforestation?: string;
  };
  carbonCredits?: number;
  carbonCreditsTotal?: number;
  progress?: number;
}

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
      const response = await apiProjects.getAll();
      if (Array.isArray(response.payload)) {
        const formattedProjects = response.payload.map((project: IProject) => ({
          ...project,
          status: project.status || "pending",
          carbonCredits: project.carbonCredits || 0,
          carbonCreditsTotal: project.carbonCreditsTotal || 0,
          progress: project.progress || 0,
        }));
        setProjects(formattedProjects);
      } else {
        console.error(
          "Expected array from API, but received:",
          response.payload,
        );
        setProjects([]);
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

  const handleApproveProject = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn phê duyệt dự án này không?")) return;
    try {
      // Giả định apiProjects.update có endpoint để cập nhật trạng thái
      await apiProjects.update(id, { status: "active" });

      setProjects((prev) =>
        prev.map((project) =>
          project._id === id ? { ...project, status: "active" } : project,
        ),
      );
      toast({
        title: "Thành công",
        description: "Dự án đã được phê duyệt!",
      });
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể phê duyệt dự án! Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Xóa hàm handleDeleteProject
  // const handleDeleteProject = async (id: string) => {
  //   if (!confirm("Bạn có chắc chắn muốn xóa dự án này không?")) return;
  //   try {
  //     await apiProjects.delete(id);
  //     setProjects((prev) => prev.filter((project) => project._id !== id));
  //     toast({
  //       title: "Thành công",
  //       description: "Xóa dự án thành công!",
  //     });
  //   } catch (err) {
  //     toast({
  //       title: "Lỗi",
  //       description: "Không thể xóa dự án! Vui lòng thử lại.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      try {
        const isoDate = new Date(dateString + "Z");
        if (!isNaN(isoDate.getTime())) {
          return isoDate.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }
      } catch (e) {}
      return "Ngày không hợp lệ";
    }
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
    return <Badge className={styles[status || "pending"]}>{text}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        Đang tải danh sách dự án...
      </div>
    );
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
                <CardDescription>
                  Quản lý các dự án Carbon trên hệ thống
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có dự án nào.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên người gửi</TableHead>
                      <TableHead>Loại dự án</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Vị trí</TableHead>
                      <TableHead>Diện tích (ha)</TableHead>
                      <TableHead>Tín chỉ Carbon</TableHead>
                      <TableHead>Tiến độ</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow
                        key={project._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell
                          className="font-medium max-w-xs truncate"
                          title={project.userId?.name || "N/A"}
                        >
                          {project.userId?.name || "N/A"}
                        </TableCell>
                        <TableCell>{project.projectType || "N/A"}</TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell>
                          {project.details?.forestLocation ||
                            project.address ||
                            "N/A"}
                        </TableCell>
                        <TableCell>
                          {project.details?.forestArea
                            ? `${project.details.forestArea} ha`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {project.carbonCredits !== undefined &&
                          project.carbonCreditsTotal !== undefined
                            ? `${project.carbonCredits.toLocaleString()} / ${project.carbonCreditsTotal.toLocaleString()} tấn`
                            : project.carbonCredits !== undefined
                              ? `${project.carbonCredits.toLocaleString()} tấn`
                              : "N/A"}
                        </TableCell>
                        <TableCell>
                          {project.progress !== undefined
                            ? `${project.progress}%`
                            : "N/A"}
                        </TableCell>
                        <TableCell>{formatDate(project.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {project.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-green-50 hover:text-green-600"
                                onClick={() =>
                                  handleApproveProject(project._id)
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Phê duyệt
                              </Button>
                            )}
                            {/* Nút "Xóa" đã được loại bỏ */}
                            {/* <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleDeleteProject(project._id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Xóa
                            </Button> */}
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
