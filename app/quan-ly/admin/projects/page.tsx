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
import { CheckCircle, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiProjects } from "../../../fetch/fetch.projects";
import { formatDateUtil } from "@/app/utils/common";
import {
  getProjectTypeText,
  getStatusBadge,
  getStatusText,
} from "@/app/components/projects/project";

export type ProjectStatus =
  | "surveying"
  | "designing"
  | "verifying"
  | "implementing"
  | "credit_issuing"
  | "trading";

export interface IProject {
  _id: string;
  name: string;
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
    name: string;
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
  status?: ProjectStatus;
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const projectStatusOrder: ProjectStatus[] = [
    "surveying",
    "designing",
    "verifying",
    "implementing",
    "credit_issuing",
    "trading",
  ];

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiProjects.getAll();
      if (Array.isArray(response.payload)) {
        const formattedProjects = response.payload.map((project: IProject) => ({
          ...project,
          status:
            project.status && projectStatusOrder.includes(project.status)
              ? project.status
              : "surveying",
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

  const handleAdvanceProjectStatus = async (project: IProject) => {
    const currentIndex = projectStatusOrder.indexOf(
      project.status || "surveying",
    );
    const nextStatusIndex = currentIndex + 1;

    if (nextStatusIndex >= projectStatusOrder.length) {
      toast({
        title: "Thông báo",
        description: "Dự án đã ở trạng thái cuối cùng.",
        variant: "default",
      });
      return;
    }

    const nextStatus = projectStatusOrder[nextStatusIndex];

    if (
      !confirm(
        `Bạn có chắc chắn muốn chuyển dự án "${project.name}" sang trạng thái "${getStatusText(nextStatus)}"`,
      )
    )
      return;

    try {
      await apiProjects.update(project._id, { status: nextStatus });

      setProjects((prev) =>
        prev.map((p) =>
          p._id === project._id ? { ...p, status: nextStatus } : p,
        ),
      );
      toast({
        title: "Thành công",
        description: `Dự án "${project.name}" đã được chuyển sang trạng thái "${getStatusText(nextStatus)}"`,
      });
    } catch (err) {
      toast({
        title: "Lỗi",
        description: `Không thể chuyển trạng thái dự án "${project.name}"! Vui lòng thử lại.`,
        variant: "destructive",
      });
    }
  };

  const handleViewProject = (project: IProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
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
                        <TableCell>
                          {getProjectTypeText(project.projectType)}
                        </TableCell>
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
                        <TableCell>
                          {formatDateUtil(project.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProject(project)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Xem
                            </Button>
                            {project.status !== "trading" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-green-50 hover:text-green-600"
                                onClick={() =>
                                  handleAdvanceProjectStatus(project)
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Chuyển trạng thái
                              </Button>
                            )}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Chi tiết Dự án Carbon</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về dự án được gửi bởi người dùng.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">
                  Tên người gửi:
                </p>
                <p className="col-span-3 text-sm font-semibold">
                  {selectedProject.userId?.name || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">Email:</p>
                <p className="col-span-3 text-sm">
                  {selectedProject.userId?.email || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">Tổ chức:</p>
                <p className="col-span-3 text-sm">
                  {selectedProject.organization || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">
                  Số điện thoại:
                </p>
                <p className="col-span-3 text-sm">
                  {selectedProject.phone || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">Loại dự án:</p>
                <p className="col-span-3 text-sm font-semibold">
                  {getProjectTypeText(selectedProject.projectType)}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">Trạng thái:</p>
                <p className="col-span-3 text-sm">
                  {getStatusBadge(selectedProject.status)}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">Địa chỉ:</p>
                <p className="col-span-3 text-sm">
                  {selectedProject.address || "N/A"}
                </p>
              </div>
              {selectedProject.details?.forestLocation && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="col-span-1 text-sm text-gray-500">
                    Vị trí rừng:
                  </p>
                  <p className="col-span-3 text-sm">
                    {selectedProject.details.forestLocation}
                  </p>
                </div>
              )}
              {selectedProject.details?.forestArea && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="col-span-1 text-sm text-gray-500">
                    Diện tích rừng:
                  </p>
                  <p className="col-span-3 text-sm">
                    {selectedProject.details.forestArea} ha
                  </p>
                </div>
              )}
              {selectedProject.details?.treeSpecies && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="col-span-1 text-sm text-gray-500">Loại cây:</p>
                  <p className="col-span-3 text-sm">
                    {selectedProject.details.treeSpecies}
                  </p>
                </div>
              )}
              {selectedProject.details?.plantingAge && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="col-span-1 text-sm text-gray-500">
                    Tuổi cây trồng:
                  </p>
                  <p className="col-span-3 text-sm">
                    {selectedProject.details.plantingAge}
                  </p>
                </div>
              )}
              {selectedProject.details?.averageHeight && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="col-span-1 text-sm text-gray-500">
                    Chiều cao trung bình:
                  </p>
                  <p className="col-span-3 text-sm">
                    {selectedProject.details.averageHeight}
                  </p>
                </div>
              )}
              {selectedProject.details?.averageCircumference && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="col-span-1 text-sm text-gray-500">
                    Chu vi trung bình:
                  </p>
                  <p className="col-span-3 text-sm">
                    {selectedProject.details.averageCircumference}
                  </p>
                </div>
              )}
              {selectedProject.details?.previousDeforestation && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="col-span-1 text-sm text-gray-500">
                    Phá rừng trước đó:
                  </p>
                  <p className="col-span-3 text-sm">
                    {selectedProject.details.previousDeforestation}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">
                  Thông tin bổ sung:
                </p>
                <p className="col-span-3 text-sm">
                  {selectedProject.additionalInfo || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">
                  Tín chỉ Carbon:
                </p>
                <p className="col-span-3 text-sm">
                  {selectedProject.carbonCredits !== undefined &&
                  selectedProject.carbonCreditsTotal !== undefined
                    ? `${selectedProject.carbonCredits.toLocaleString()} / ${selectedProject.carbonCreditsTotal.toLocaleString()} tấn`
                    : selectedProject.carbonCredits !== undefined
                      ? `${selectedProject.carbonCredits.toLocaleString()} tấn`
                      : "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">Tiến độ:</p>
                <p className="col-span-3 text-sm">
                  {selectedProject.progress !== undefined
                    ? `${selectedProject.progress}%`
                    : "N/A"}
                </p>
              </div>
              {selectedProject.landDocuments &&
                selectedProject.landDocuments.length > 0 && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <p className="col-span-1 text-sm text-gray-500">
                      Tài liệu đất đai:
                    </p>
                    <div className="col-span-3 flex flex-col gap-2">
                      {selectedProject.landDocuments.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {doc.name || `Tài liệu ${index + 1}`}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              {selectedProject.kmlFile && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="col-span-1 text-sm text-gray-500">File KML:</p>
                  <a
                    href={selectedProject.kmlFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-3 text-blue-600 hover:underline text-sm"
                  >
                    {selectedProject.kmlFile.name || "Tải xuống file KML"}
                  </a>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">Ngày tạo:</p>
                <p className="col-span-3 text-sm">
                  {formatDateUtil(selectedProject.createdAt)}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm text-gray-500">
                  Ngày cập nhật:
                </p>
                <p className="col-span-3 text-sm">
                  {formatDateUtil(selectedProject.updatedAt)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
