"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  uploadToCloudinary,
  formatDateUtil,
  getUserFromLocalStorage,
} from "@/app/utils/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Leaf,
  MapPin,
  Calendar,
  Clock,
  FileText,
  BarChart3,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  FileUp,
  FileBadge,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  apiProjects,
  IProject,
  IProjectDocument,
  IKmlFile,
  IActivity,
} from "@/app/fetch/fetch.projects";
import { ProjectIcon } from "./_components";

const StatusBadge: React.FC<{
  status: string;
}> = ({ status }) => {
  const badgeStyles = {
    active: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    completed: "bg-green-100 text-green-800 hover:bg-green-100",
    approved: "bg-green-100 text-green-800 hover:bg-green-100",
    in_progress: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    rejected: "bg-red-100 text-red-800 hover:bg-red-800",
    archived: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };
  const badgeLabels = {
    active: "Đang thực hiện",
    pending: "Đang xử lý",
    completed: "Hoàn thành",
    approved: "Đã phê duyệt",
    in_progress: "Đang tiến hành",
    rejected: "Đã từ chối",
    archived: "Đã lưu trữ",
  };
  return (
    <Badge
      className={
        badgeStyles[status as keyof typeof badgeStyles] ||
        "bg-gray-100 text-gray-800 hover:bg-gray-100"
      }
    >
      <Clock className="w-3 h-3 mr-1" />
      {badgeLabels[status as keyof typeof badgeLabels] || status}
    </Badge>
  );
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileTypeToUpload, setFileTypeToUpload] = useState<
    "landDocument" | "kmlFile"
  >("landDocument");

  const getProjectTypeName = (type: string) => {
    switch (type) {
      case "rice":
        return "Lúa gạo";
      case "forest":
        return "Lâm nghiệp";
      case "biochar":
        return "Than sinh học";
      default:
        return type;
    }
  };

  const fetchProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await apiProjects.getProject(id);
      if (response.status === 200) {
        setProject(response.payload as IProject);
      } else {
        setProject(null);
      }
    } catch (error) {
      console.error("Lỗi khi tải dự án:", error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log("Đã chọn tệp:", event.target.files[0]);
      setSelectedFile(event.target.files[0]);
      setUploadError(null);
      setUploadSuccess(false);
    } else {
      console.log("Không có tệp nào được chọn hoặc đã xóa tệp.");
      setSelectedFile(null);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile || !project?._id) {
      setUploadError("Vui lòng chọn một tệp để tải lên.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const fileUrl = await uploadToCloudinary(selectedFile);
      const userId = getUserFromLocalStorage()?.userId;

      if (fileTypeToUpload === "landDocument") {
        const newDocument: IProjectDocument = {
          name: selectedFile.name,
          url: fileUrl,
          type: selectedFile.type || "unknown",
          createdAt: new Date().toISOString(),
          userId: userId,
        };
        const updatedLandDocuments = project.landDocuments
          ? [...project.landDocuments, newDocument]
          : [newDocument];

        const response = await apiProjects.updateProject(project._id, {
          landDocuments: updatedLandDocuments,
        });

        if (response && response.payload) {
          setProject((prevProject) => ({
            ...(prevProject as IProject),
            landDocuments:
              response.payload.landDocuments || updatedLandDocuments,
          }));
          setUploadSuccess(true);
          setSelectedFile(null);
          alert("Tài liệu đất đai đã được tải lên thành công!");
        } else {
          setUploadError("Lỗi khi cập nhật dự án với tài liệu đất đai.");
        }
      } else if (fileTypeToUpload === "kmlFile") {
        if (!selectedFile.name.toLowerCase().endsWith(".kml")) {
          setUploadError("Vui lòng chọn tệp KML hợp lệ (.kml).");
          setUploading(false);
          return;
        }

        const newKmlFile: IKmlFile = {
          name: selectedFile.name,
          url: fileUrl,
          createdAt: new Date().toISOString(),
        };

        const response = await apiProjects.updateProject(project._id, {
          kmlFile: newKmlFile,
        });

        if (response && response.payload) {
          setProject((prevProject) => ({
            ...(prevProject as IProject),
            kmlFile: response.payload.kmlFile || newKmlFile,
          }));
          setUploadSuccess(true);
          setSelectedFile(null);
          alert("Tệp KML đã được tải lên thành công!");
        } else {
          setUploadError("Lỗi khi cập nhật dự án với tệp KML.");
        }
      }
    } catch (error) {
      setUploadError("Lỗi khi tải tệp lên.");
      console.error("Lỗi tải tài liệu:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLandDocument = async (docUrl: string) => {
    if (!project?._id) return;

    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác.",
      )
    ) {
      return;
    }

    try {
      const updatedLandDocuments =
        project.landDocuments?.filter((doc) => doc.url !== docUrl) || [];
      const response = await apiProjects.updateProject(project._id, {
        landDocuments: updatedLandDocuments,
      });

      if (response && response.payload) {
        setProject((prevProject) => ({
          ...(prevProject as IProject),
          landDocuments: response.payload.landDocuments || updatedLandDocuments,
        }));
        alert("Tài liệu đã được xóa thành công!");
      } else {
        alert("Lỗi khi xóa tài liệu.");
        console.error("Lỗi khi xóa tài liệu:", response);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi xóa tài liệu.");
      console.error("Lỗi xóa tài liệu:", error);
    }
  };

  const handleDeleteKmlFile = async () => {
    if (!project?._id) return;

    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa tệp KML này không? Hành động này không thể hoàn tác.",
      )
    ) {
      return;
    }

    try {
      const response = await apiProjects.updateProject(project._id, {
        kmlFile: null,
      });

      if (response && response.payload) {
        setProject((prevProject) => ({
          ...(prevProject as IProject),
          kmlFile: response.payload.kmlFile || null,
        }));
        alert("Tệp KML đã được xóa thành công!");
      } else {
        alert("Lỗi khi xóa tệp KML.");
        console.error("Lỗi khi xóa tệp KML:", response);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi xóa tệp KML.");
      console.error("Lỗi xóa tệp KML:", error);
    }
  };

  const handleViewFile = (url: string) => {
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string);
    }
  }, [params.id, fetchProject]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy dự án</h2>
        <p className="text-gray-500 mb-6">
          Dự án bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy
          cập.
        </p>
        <Button onClick={() => router.push("/quan-ly")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại trang quản lý
        </Button>
      </div>
    );
  }

  const landDocuments = project.landDocuments || [];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link
          href="/quan-ly"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại trang quản lý
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center">
          <ProjectIcon type={project.projectType} />
          <div className="ml-3">
            <h1 className="text-3xl font-bold">
              Dự án {getProjectTypeName(project.projectType)} của{" "}
              {project.name}{" "}
            </h1>
            <p className="text-gray-500">
              Đăng ký ngày:{" "}
              {formatDateUtil(project.createdAt || new Date().toISOString())}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <StatusBadge status={project.status || "pending"} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Tài liệu
          </TabsTrigger>
          <TabsTrigger value="activities">
            <Clock className="w-4 h-4 mr-2" />
            Hoạt động
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin dự án</CardTitle>
              <CardDescription>
                Chi tiết về dự án tín chỉ carbon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Loại dự án
                  </h3>
                  <p className="font-medium">
                    {getProjectTypeName(project.projectType)}
                  </p>
                </div>

                {project.projectType === "forest" && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Địa điểm rừng
                      </h3>
                      <p className="font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {project.details?.forestLocation || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Diện tích rừng
                      </h3>
                      <p className="font-medium">
                        {project.details?.forestArea || "N/A"} ha
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Loài cây
                      </h3>
                      <p className="font-medium">
                        {project.details?.treeSpecies || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Tuổi cây trồng
                      </h3>
                      <p className="font-medium">
                        {project.details?.plantingAge || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Chiều cao trung bình
                      </h3>
                      <p className="font-medium">
                        {project.details?.averageHeight || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Chu vi trung bình
                      </h3>
                      <p className="font-medium">
                        {project.details?.averageCircumference || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Lịch sử chặt phá
                      </h3>
                      <p className="font-medium">
                        {project.details?.previousDeforestation === "no"
                          ? "Không"
                          : project.details?.previousDeforestation === "yes"
                            ? "Có"
                            : project.details?.previousDeforestation ===
                                "unknown"
                              ? "Không rõ"
                              : "N/A"}
                      </p>
                    </div>
                  </>
                )}

                {project.projectType === "rice" && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Địa điểm lúa gạo
                      </h3>
                      <p className="font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {project.details?.riceLocation || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Diện tích lúa gạo
                      </h3>
                      <p className="font-medium">
                        {project.details?.riceArea || "N/A"} ha
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Địa hình
                      </h3>
                      <p className="font-medium">
                        {project.details?.riceTerrain || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Khí hậu
                      </h3>
                      <p className="font-medium">
                        {project.details?.riceClimate || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Loại đất
                      </h3>
                      <p className="font-medium">
                        {project.details?.riceSoilType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Ngày bắt đầu (lúa gạo)
                      </h3>
                      <p className="font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {project.details?.riceStartDate
                          ? formatDateUtil(project.details.riceStartDate)
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Ngày kết thúc (lúa gạo)
                      </h3>
                      <p className="font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {project.details?.riceEndDate
                          ? formatDateUtil(project.details.riceEndDate)
                          : "N/A"}
                      </p>
                    </div>
                  </>
                )}

                {project.projectType === "biochar" && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Nguyên liệu thô
                      </h3>
                      <p className="font-medium">
                        {project.details?.biocharRawMaterial || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Hàm lượng carbon
                      </h3>
                      <p className="font-medium">
                        {project.details?.biocharCarbonContent || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Diện tích đất ứng dụng
                      </h3>
                      <p className="font-medium">
                        {project.details?.biocharLandArea || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Phương pháp ứng dụng
                      </h3>
                      <p className="font-medium">
                        {project.details?.biocharApplicationMethod || "N/A"}
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Người đăng ký
                  </h3>
                  <p className="font-medium">{project.name || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Tổ chức
                  </h3>
                  <p className="font-medium">{project.organization || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Email liên hệ
                  </h3>
                  <p className="font-medium">{project.email || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Số điện thoại
                  </h3>
                  <p className="font-medium">{project.phone || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Địa chỉ
                  </h3>
                  <p className="font-medium">{project.address || "N/A"}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Thông tin bổ sung
                </h3>
                <p className="text-gray-700">
                  {project.additionalInfo || "Không có thông tin bổ sung."}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button>Cập nhật thông tin</Button>
              <Button variant="outline">Tải xuống báo cáo</Button>
            </CardFooter>
          </Card>

          {project.carbonCreditsTotal !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin Tín chỉ Carbon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Tổng tín chỉ carbon
                    </h3>
                    <p className="font-medium">
                      {project.carbonCreditsTotal?.toLocaleString() || "N/A"}{" "}
                      tấn CO₂
                    </p>
                  </div>
                  {project.carbonCredits !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Tín chỉ hiện có
                      </h3>
                      <p className="font-medium">
                        {project.carbonCredits?.toLocaleString() || "N/A"} tấn
                        CO₂
                      </p>
                    </div>
                  )}
                  {project.carbonCreditsClaimed !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Tín chỉ đã yêu cầu
                      </h3>
                      <p className="font-medium">
                        {project.carbonCreditsClaimed?.toLocaleString() ||
                          "N/A"}{" "}
                        tấn CO₂
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {typeof project.progress === "number" && (
            <Card>
              <CardHeader>
                <CardTitle>Tiến độ dự án</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Tiến độ tổng</span>
                      <span className="text-sm font-medium">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu đất đai</CardTitle>
              <CardDescription>
                Các tài liệu liên quan đến quyền sở hữu/sử dụng đất của dự án.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {landDocuments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên tài liệu</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Ngày tải lên</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {landDocuments.map((doc: IProjectDocument) => (
                        <TableRow key={doc._id || doc.url}>
                          <TableCell className="font-medium">
                            {doc.name ||
                              decodeURIComponent(
                                doc.url.split("/").pop() ||
                                  "Tài liệu không tên",
                              )}
                          </TableCell>
                          <TableCell>{doc.type || "N/A"}</TableCell>
                          <TableCell>
                            {doc.createdAt
                              ? formatDateUtil(doc.createdAt)
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewFile(doc.url)}
                              >
                                Xem
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleDeleteLandDocument(doc.url)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  Chưa có tài liệu đất đai nào được đính kèm.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tệp KML</CardTitle>
              <CardDescription>
                Tệp KML định vị khu vực địa lý của dự án trên bản đồ.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.kmlFile ? (
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center">
                    <FileBadge className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="font-medium">{project.kmlFile.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewFile(project.kmlFile!.url)}
                    >
                      Xem
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteKmlFile}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  Chưa có tệp KML nào được đính kèm.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tải lên tệp mới</CardTitle>
              <CardDescription>
                Tải lên tài liệu đất đai hoặc tệp KML mới cho dự án.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fileType">Loại tệp tải lên</Label>
                  <Select
                    value={fileTypeToUpload}
                    onValueChange={(value: "landDocument" | "kmlFile") =>
                      setFileTypeToUpload(value)
                    }
                  >
                    <SelectTrigger id="fileType">
                      <SelectValue placeholder="Chọn loại tệp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landDocument">
                        Tài liệu đất đai
                      </SelectItem>
                      <SelectItem value="kmlFile">Tệp KML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="document" className="mb-2 block">
                    Chọn tệp
                  </Label>
                  <Input
                    id="document"
                    type="file"
                    onChange={handleFileChange}
                    className="mb-2"
                    accept={fileTypeToUpload === "kmlFile" ? ".kml" : undefined}
                  />
                </div>
              </div>

              {selectedFile && (
                <p className="text-sm text-gray-600">
                  Đã chọn tệp:{" "}
                  <span className="font-medium">{selectedFile.name}</span>
                </p>
              )}
              {uploadError && (
                <div className="flex items-center text-red-500 text-sm mt-2">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {uploadError}
                </div>
              )}
              {uploadSuccess && (
                <div className="flex items-center text-green-500 text-sm mt-2">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Tải lên thành công!
                </div>
              )}
              <Button
                onClick={handleUploadFile}
                disabled={uploading || !selectedFile}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Tải lên
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử hoạt động</CardTitle>
              <CardDescription>
                Các hoạt động gần đây liên quan đến dự án
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {project.activities && project.activities.length > 0 ? (
                    project.activities.map((activity, index) => (
                      <div key={index} className="ml-10 relative">
                        <div className="absolute -left-10 mt-1.5 w-5 h-5 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center">
                          <Clock className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {formatDateUtil(activity.date)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">
                      Chưa có hoạt động nào được ghi nhận.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
