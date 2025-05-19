"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiProjects } from "@/app/fetch/fetch.projects";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PencilIcon,
  SaveIcon,
  Trash2Icon,
  XCircleIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UsersIcon,
  AreaChartIcon,
  DollarSignIcon,
  FileTextIcon,
  BookOpenIcon,
  InfoIcon,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ActivityIcon, // Thêm ActivityIcon cho phần Hoạt động
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export interface ICoordinates {
  lat: number;
  lng: number;
}

export interface IActivity {
  _id?: string;
  date: string;
  description: string;
  title?: string;
}

export interface IProject {
  _id?: string;
  name: string;
  description?: string;
  status?: "pending" | "active" | "completed" | "archived";
  registrationDate?: string;
  startDate?: string;
  endDate?: string;
  carbonCredits?: number;
  carbonCreditsTotal?: number;
  carbonCreditsClaimed?: number;
  type?: string;
  location?: string;
  coordinates?: ICoordinates;
  area?: number;
  participants?: string[];
  progress?: number;
  documents?: string[];
  activities?: IActivity[];
  userId: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface FormData {
  name: string;
  description: string;
  location: string;
  area: number | undefined;
  coordinates: ICoordinates;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  participantsCount: number | undefined;
  progress: number | undefined;
  carbonCreditsTotal: number | undefined;
  carbonCredits: number | undefined;
  carbonCreditsClaimed: number | undefined;
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<IProject | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Đổi tên state này để tránh nhầm lẫn, vì nó không dùng cho "tasks"
  // const [isProcessingTasks, setIsProcessingTasks] = useState(false);

  const fetchProject = useMemo(
    () => async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiProjects.getProject(projectId);

        if (response && response.payload) {
          const data: IProject = response.payload;
          setProject(data);
          setFormData({
            name: data.name || "",
            description: data.description || "",
            location: data.location || "",
            area: data.area,
            coordinates: {
              lat: data.coordinates?.lat ?? 0,
              lng: data.coordinates?.lng ?? 0,
            },
            startDate: data.startDate?.split("T")[0] || "",
            endDate: data.endDate?.split("T")[0] || "",
            type: data.type || "",
            status: data.status || "",
            participantsCount:
              data.participants && data.participants.length > 0
                ? parseInt(data.participants[0], 10)
                : undefined,
            progress: data.progress,
            carbonCreditsTotal: data.carbonCreditsTotal,
            carbonCredits: data.carbonCredits,
            carbonCreditsClaimed: data.carbonCreditsClaimed,
          });
          setIsEditing(false); // Đảm bảo trạng thái ban đầu là không chỉnh sửa
        } else {
          throw new Error(
            response?.message ||
              "Lỗi khi lấy dữ liệu dự án: Lỗi API không xác định",
          );
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(
          err.message || "Đã xảy ra lỗi không xác định khi lấy dữ liệu.",
        );
      } finally {
        setLoading(false);
      }
    },
    [projectId],
  );

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, fetchProject]);

  const handleEditClick = () => {
    if (project) {
      // Đảm bảo formData được điền đầy đủ từ project khi chuyển sang chế độ chỉnh sửa
      setFormData({
        name: project.name || "",
        description: project.description || "",
        location: project.location || "",
        area: project.area,
        coordinates: {
          lat: project.coordinates?.lat ?? 0,
          lng: project.coordinates?.lng ?? 0,
        },
        startDate: project.startDate?.split("T")[0] || "",
        endDate: project.endDate?.split("T")[0] || "",
        type: project.type || "",
        status: project.status || "",
        participantsCount:
          project.participants && project.participants.length > 0
            ? parseInt(project.participants[0], 10)
            : undefined,
        progress: project.progress,
        carbonCreditsTotal: project.carbonCreditsTotal,
        carbonCredits: project.carbonCredits,
        carbonCreditsClaimed: project.carbonCreditsClaimed,
      });
    }
    setIsEditing(true);
    setError(null);
  };

  const handleCancelClick = () => {
    // Đặt lại formData về dữ liệu gốc của project khi hủy
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        location: project.location || "",
        area: project.area,
        coordinates: {
          lat: project.coordinates?.lat ?? 0,
          lng: project.coordinates?.lng ?? 0,
        },
        startDate: project.startDate?.split("T")[0] || "",
        endDate: project.endDate?.split("T")[0] || "",
        type: project.type || "",
        status: project.status || "",
        participantsCount:
          project.participants && project.participants.length > 0
            ? parseInt(project.participants[0], 10)
            : undefined,
        progress: project.progress,
        carbonCreditsTotal: project.carbonCreditsTotal,
        carbonCredits: project.carbonCredits,
        carbonCreditsClaimed: project.carbonCreditsClaimed,
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData((prev) => ({
        ...(prev as FormData),
        [name]: value === "" ? undefined : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...(prev as FormData),
        [name]: value,
      }));
    }
  };

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...(prev as FormData),
      coordinates: {
        ...(prev as FormData).coordinates,
        [name]: parseFloat(value) || 0,
      },
    }));
  };

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData((prev) => ({
      ...(prev as FormData),
      participantsCount: isNaN(value) ? undefined : value,
    }));
  };

  const handleSelectChange = (name: keyof FormData) => (value: string) => {
    setFormData((prev) => ({
      ...(prev as FormData),
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData || !projectId || isSubmitting || isDeleting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const dataToSend: Partial<IProject> = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        area: formData.area,
        coordinates: formData.coordinates,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : undefined,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : undefined,
        type: formData.type,
        status: formData.status as
          | "pending"
          | "active"
          | "completed"
          | "archived"
          | undefined,
        participants:
          formData.participantsCount !== undefined &&
          formData.participantsCount !== null
            ? [String(formData.participantsCount)]
            : undefined,
        progress: formData.progress,
        carbonCreditsTotal: formData.carbonCreditsTotal,
        carbonCredits: formData.carbonCredits,
        carbonCreditsClaimed: formData.carbonCreditsClaimed,
      };

      console.log("Gửi dữ liệu cập nhật:", dataToSend);

      const response = await apiProjects.update(projectId, dataToSend);

      if (response && response.payload) {
        console.log("Dự án cập nhật thành công!");
        setProject(response.payload);
        setIsEditing(false);
      } else {
        throw new Error(
          response?.message || "Lưu dữ liệu thất bại: Lỗi API không xác định",
        );
      }
    } catch (err: any) {
      console.error("Lỗi cập nhật:", err);
      setError(err.message || "Đã xảy ra lỗi không xác định khi cập nhật.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!projectId || isDeleting || isSubmitting) return;

    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa dự án "${project?.name || "này"}" không? Hành động này không thể hoàn tác.`,
    );

    if (!confirmDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await apiProjects.delete(projectId);
      if (response && response.payload) {
        console.log("Dự án đã xóa thành công!");
        router.push("/quan-ly/du-an");
      } else {
        throw new Error(
          response?.message || "Xóa dự án thất bại: Lỗi API không xác định",
        );
      }
    } catch (err: any) {
      console.error("Lỗi xóa:", err);
      setError(err.message || "Đã xảy ra lỗi không xác định khi xóa.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNavigateToActivityPage = () => {
    router.push(`/quan-ly/admin/projects/edit/${projectId}/activity`);
  };

  const handleNavigateToDocumentPage = () => {
    router.push(`/quan-ly/admin/projects/edit/${projectId}/documents`);
  };

  // Hàm renderField đã được điều chỉnh để hiển thị thông tin khi không chỉnh sửa
  const renderField = (
    label: string,
    formField: keyof FormData | "coordinates_lat" | "coordinates_lng", // Thêm loại cho tọa độ
    projectValue: any,
    inputType: string = "text",
    options?: { value: string; label: string }[],
    step?: string,
    min?: string,
    max?: string,
  ) => (
    <div>
      <Label htmlFor={formField}>{label}</Label>
      {isEditing ? (
        inputType === "textarea" ? (
          <Textarea
            id={formField.toString()}
            name={formField.toString()}
            value={formData?.[formField as keyof FormData] as string}
            onChange={handleChange}
            rows={4}
            required={
              formField === "name" ||
              formField === "description" ||
              formField === "location" ||
              formField === "status"
            }
          />
        ) : inputType === "select" && options ? (
          <Select
            value={formData?.[formField as keyof FormData] as string}
            onValueChange={handleSelectChange(formField as keyof FormData)}
            required={formField === "status"}
          >
            <SelectTrigger
              id={formField.toString()}
              name={formField.toString()}
            >
              <SelectValue placeholder={`Chọn ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : formField === "participantsCount" ? (
          <Input
            type="number"
            id="participantsCount"
            name="participantsCount"
            value={formData?.participantsCount ?? ""}
            onChange={handleParticipantsChange}
            step={step}
            min={min}
            max={max}
          />
        ) : inputType === "number" &&
          (formField === "coordinates_lat" ||
            formField === "coordinates_lng") ? (
          <Input
            type="number"
            id={formField.toString()}
            name={formField === "coordinates_lat" ? "lat" : "lng"}
            value={
              formField === "coordinates_lat"
                ? (formData?.coordinates.lat ?? "")
                : (formData?.coordinates.lng ?? "")
            }
            onChange={handleCoordinateChange}
            step={step}
            min={min}
            max={max}
          />
        ) : (
          <Input
            type={inputType}
            id={formField.toString()}
            name={formField.toString()}
            value={formData?.[formField as keyof FormData] ?? ""}
            onChange={handleChange}
            step={step}
            min={min}
            max={max}
            required={formField === "name" || formField === "location"}
          />
        )
      ) : (
        <div className="mt-1 text-gray-900 text-sm">
          {projectValue !== undefined &&
          projectValue !== null &&
          projectValue !== ""
            ? inputType === "date"
              ? new Date(projectValue).toLocaleDateString("vi-VN")
              : formField === "progress"
                ? `${projectValue}%`
                : formField === "area" ||
                    formField === "carbonCredits" ||
                    formField === "carbonCreditsTotal" ||
                    formField === "carbonCreditsClaimed"
                  ? projectValue.toLocaleString("vi-VN") // Định dạng số
                  : formField === "participantsCount"
                    ? project?.participants?.[0] || "N/A"
                    : String(projectValue)
            : "N/A"}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Đang tải dữ liệu dự án...</p>
      </div>
    );
  }

  if (error && !project) {
    // Kiểm tra nếu có lỗi và không có dữ liệu project nào được tải
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Lỗi tải dự án</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href={`/quan-ly/du-an`}>
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách dự án
          </Button>
        </Link>
      </div>
    );
  }

  if (!project) {
    // Trường hợp không có project nào được tải (sau khi loading)
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy dự án</h2>
        <p className="text-gray-500 mb-6">
          Dự án bạn đang tìm kiếm không tồn tại hoặc có lỗi khi tải dữ liệu.
        </p>
        <Link href={`/quan-ly/du-an`}>
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách dự án
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/quan-ly/du-an`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách dự án
        </Link>
        {!isEditing && (
          <Button onClick={handleEditClick} disabled={loading || !project}>
            <PencilIcon className="mr-2 h-4 w-4" /> Chỉnh sửa dự án
          </Button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">
        <BookOpenIcon className="inline-block mr-3 h-8 w-8 text-primary" />
        Chi tiết Dự án: {project?.name}
      </h1>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md flex items-center gap-2 mb-6">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột 1 & 2: Thông tin dự án và Form chỉnh sửa */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <InfoIcon className="mr-2 h-6 w-6 text-blue-600" />
                Thông tin chung
              </CardTitle>
              <CardDescription>
                Cập nhật các thông tin cơ bản của dự án.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderField("Tên Dự án", "name", project.name, "text")}
                {renderField(
                  "Mô tả",
                  "description",
                  project.description,
                  "textarea",
                )}
                {renderField("Địa điểm", "location", project.location, "text")}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Diện tích (ha)",
                    "area",
                    project.area,
                    "number",
                    undefined,
                    "0.1",
                    "0",
                  )}
                  {renderField(
                    "Số người tham gia",
                    "participantsCount",
                    project.participants?.[0],
                    "number",
                    undefined,
                    "1",
                    "0",
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Vĩ độ",
                    "coordinates_lat", // Sử dụng key mới để phân biệt
                    project.coordinates?.lat,
                    "number",
                    undefined,
                    "0.000001",
                  )}
                  {renderField(
                    "Kinh độ",
                    "coordinates_lng", // Sử dụng key mới để phân biệt
                    project.coordinates?.lng,
                    "number",
                    undefined,
                    "0.000001",
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Ngày bắt đầu",
                    "startDate",
                    project.startDate,
                    "date",
                  )}
                  {renderField(
                    "Ngày kết thúc",
                    "endDate",
                    project.endDate,
                    "date",
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField("Loại dự án", "type", project.type, "select", [
                    { value: "forestry", label: "Lâm nghiệp" },
                    { value: "rice", label: "Lúa" },
                    { value: "biochar", label: "Biochar" },
                    { value: "other", label: "Khác" },
                  ])}
                  {renderField(
                    "Trạng thái",
                    "status",
                    project.status,
                    "select",
                    [
                      { value: "pending", label: "Đang chờ duyệt" },
                      { value: "active", label: "Đang hoạt động" },
                      { value: "completed", label: "Hoàn thành" },
                      { value: "approved", label: "Đã phê duyệt" },
                      { value: "in_progress", label: "Đang thực hiện" },
                      { value: "rejected", label: "Bị từ chối" },
                      { value: "archived", label: "Đã lưu trữ" },
                    ],
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Tiến độ (%)",
                    "progress",
                    project.progress,
                    "number",
                    undefined,
                    "1",
                    "0",
                    "100",
                  )}
                  {renderField(
                    "Tổng tín chỉ Carbon",
                    "carbonCreditsTotal",
                    project.carbonCreditsTotal,
                    "number",
                    undefined,
                    "1",
                    "0",
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Tín chỉ Carbon đã tạo",
                    "carbonCredits",
                    project.carbonCredits,
                    "number",
                    undefined,
                    "1",
                    "0",
                  )}
                  {renderField(
                    "Tín chỉ Carbon đã yêu cầu",
                    "carbonCreditsClaimed",
                    project.carbonCreditsClaimed,
                    "number",
                    undefined,
                    "1",
                    "0",
                  )}
                </div>

                {/* Trường chỉ đọc: Ngày đăng ký */}
                <div>
                  <Label>Ngày đăng ký</Label>
                  <div className="mt-1 text-gray-900 text-sm flex items-center">
                    <CalendarDaysIcon className="mr-2 h-4 w-4 text-gray-500" />
                    {project.registrationDate
                      ? new Date(project.registrationDate).toLocaleDateString(
                          "vi-VN",
                        )
                      : "N/A"}
                  </div>
                </div>

                {/* Action Buttons (Visible only in Edit mode, nằm bên dưới form chính) */}
                {isEditing && (
                  <div className="flex flex-wrap items-center justify-start gap-4 mt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData || isDeleting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang
                          lưu...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="mr-2 h-4 w-4" /> Lưu thay đổi
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelClick}
                      disabled={isSubmitting || isDeleting}
                    >
                      <XCircleIcon className="mr-2 h-4 w-4" /> Hủy
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end pt-6">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || isSubmitting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang
                      xóa...
                    </>
                  ) : (
                    <>
                      <Trash2Icon className="mr-2 h-4 w-4" /> Xóa Dự án
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Cột 3: Các tác vụ và Hoạt động gần đây */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Các tác vụ khác</CardTitle>
              <CardDescription>
                Quản lý các phần liên quan khác của dự án.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={handleNavigateToActivityPage}
                disabled={!projectId}
              >
                <ActivityIcon className="mr-2 h-4 w-4" /> Cập nhật hoạt động
              </Button>
              <Button
                className="w-full"
                onClick={handleNavigateToDocumentPage}
                disabled={!projectId}
              >
                <FileTextIcon className="mr-2 h-4 w-4" /> Quản lý tài liệu
              </Button>
              {/* Thêm các nút tác vụ khác ở đây nếu cần */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
