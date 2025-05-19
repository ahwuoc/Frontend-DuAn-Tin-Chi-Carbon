"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
// Import các API service của bạn
import { apiProjects } from "@/app/fetch/fetch.projects";

// Import components từ shadcn/ui
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

// Import icons từ lucide-react
import {
  PencilIcon, // Icon chỉnh sửa
  SaveIcon, // Icon lưu
  Trash2Icon, // Icon xóa
  XCircleIcon, // Icon hủy
  MapPinIcon, // Icon địa điểm
  CalendarDaysIcon, // Icon ngày tháng
  UsersIcon, // Icon người tham gia
  AreaChartIcon, // Icon diện tích / progress
  DollarSignIcon, // Icon tín chỉ carbon
  FileTextIcon, // Icon mô tả / tài liệu
  BookOpenIcon, // Icon loại / activities
  InfoIcon, // Icon trạng thái / đăng ký
} from "lucide-react";

// Định nghĩa lại các interface đã cập nhật dựa trên dữ liệu mẫu
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
  const [isEditing, setIsEditing] = useState(false); // State để quản lý chế độ chỉnh sửa/chỉ đọc

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiProjects.getProject(projectId);

        if (response && response.payload) {
          const data: IProject = response.payload;
          setProject(data);
          // Khởi tạo formData ngay khi fetch thành công
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
          setIsEditing(false); // Mặc định là chế độ chỉ đọc sau khi load
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
    };

    fetchProject();
  }, [projectId]);

  // Reset formData về dữ liệu project gốc khi vào chế độ chỉnh sửa
  const handleEditClick = () => {
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
      setIsEditing(true);
      setError(null); // Clear error khi vào chế độ chỉnh sửa
    }
  };

  // Hủy bỏ chỉnh sửa, quay lại chế độ chỉ đọc và khôi phục dữ liệu gốc
  const handleCancelClick = () => {
    if (project) {
      setFormData({
        // Reset formData về dữ liệu gốc
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
    setError(null); // Clear error khi hủy
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

    if (!formData || !projectId || isSubmitting || isDeleting) return; // Không submit nếu đang xóa

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
        // Cập nhật state project gốc sau khi lưu thành công để hiển thị đúng ở chế độ chỉ đọc
        setProject(response.payload);
        setIsEditing(false); // Quay lại chế độ chỉ đọc
        // router.push(`/projects/${projectId}`); // Có thể không cần chuyển hướng nếu ở lại trang edit
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
    if (!projectId || isDeleting || isSubmitting) return; // Không xóa nếu đang submit

    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa dự án "${project?.name || "này"}" không? Hành động này không thể hoàn tác.`,
    );

    if (!confirmDelete) {
      return; // Người dùng hủy xóa
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await apiProjects.delete(projectId);

      if (response && response.success) {
        console.log("Dự án đã xóa thành công!");
        router.push("/projects"); // Chuyển hướng về trang danh sách project hoặc dashboard
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

  // Helper để render trường form hoặc giá trị chỉ đọc
  const renderField = (
    label: string,
    formField: keyof FormData,
    projectValue: any, // Use 'any' or more specific type if needed
    inputType: string = "text",
    options?: { value: string; label: string }[], // For select
    step?: string, // For number
    min?: string, // For number
    max?: string, // For number
  ) => (
    <div>
      <Label htmlFor={formField}>{label}</Label>
      {isEditing ? (
        inputType === "textarea" ? (
          <Textarea
            id={formField}
            name={formField}
            value={formData?.[formField] as string}
            onChange={handleChange}
            rows={4}
            required={
              formField === "name" ||
              formField === "description" ||
              formField === "location" ||
              formField === "status"
            } // Apply required based on field
          />
        ) : inputType === "select" && options ? (
          <Select
            value={formData?.[formField] as string}
            onValueChange={handleSelectChange(formField)}
            required={formField === "status"} // Apply required based on field
          >
            <SelectTrigger id={formField} name={formField}>
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
        ) : (
          // text, number, date inputs
          <Input
            type={inputType}
            id={formField}
            name={formField}
            value={formData?.[formField] ?? ""}
            onChange={handleChange}
            step={step}
            min={min}
            max={max}
            required={formField === "name" || formField === "location"} // Apply required based on field
          />
        )
      ) : (
        <div className="mt-1 text-gray-900 text-sm">
          {projectValue !== undefined &&
          projectValue !== null &&
          projectValue !== ""
            ? inputType === "date"
              ? new Date(projectValue).toLocaleDateString() // Format date
              : formField === "progress"
                ? `${projectValue}%` // Add % for progress
                : formField === "coordinates"
                  ? `Lat: ${projectValue.lat}, Lng: ${projectValue.lng}` // Format coordinates
                  : formField === "participantsCount"
                    ? project?.participants?.[0] || "N/A" // Display original participant string if exists
                    : String(projectValue) // Default to string
            : "N/A"}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Đang tải dữ liệu dự án...
      </div>
    );
  }

  if (error && !formData) {
    // Chỉ hiện lỗi fetch ban đầu nếu chưa có formData
    return (
      <div className="container mx-auto p-4 text-red-600">Lỗi: {error}</div>
    );
  }

  // Hiện "Chuẩn bị form..." chỉ khi formData chưa được load
  if (!formData && !error) {
    return (
      <div className="container mx-auto p-4 text-center">
        Đang chuẩn bị form...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl mx-auto">
      {/* Header với tên dự án và nút Chỉnh sửa */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          <BookOpenIcon className="inline-block mr-2 h-6 w-6" />
          Dự án: {project?.name || "Đang tải..."}
        </h1>
        {!isEditing && (
          <Button onClick={handleEditClick} disabled={loading || !project}>
            <PencilIcon className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Button>
        )}
      </div>

      {/* Hiển thị lỗi khi submit/xóa */}
      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Các trường luôn hiển thị 1 cột */}
        {renderField("Tên Dự án", "name", project?.name, "text")}
        {renderField("Mô tả", "description", project?.description, "textarea")}
        {renderField("Địa điểm", "location", project?.location, "text")}

        {/* Các trường nhóm thành 2 cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField(
            "Diện tích (km²)",
            "area",
            project?.area,
            "number",
            undefined,
            "0.1",
          )}
          {renderField(
            "Số người tham gia",
            "participantsCount",
            project?.participants?.[0],
            "number",
            undefined,
            "1",
            "0",
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField(
            "Vĩ độ",
            "coordinates",
            project?.coordinates,
            "number",
            undefined,
            "0.000001",
          )}
          {renderField(
            "Kinh độ",
            "coordinates",
            project?.coordinates,
            "number",
            undefined,
            "0.000001",
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("Ngày bắt đầu", "startDate", project?.startDate, "date")}
          {renderField("Ngày kết thúc", "endDate", project?.endDate, "date")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("Loại dự án", "type", project?.type, "select", [
            { value: "forestry", label: "Lâm nghiệp" },
            { value: "agriculture", label: "Nông nghiệp" },
            // Thêm các loại khác
          ])}
          {renderField("Trạng thái", "status", project?.status, "select", [
            { value: "pending", label: "Đang chờ duyệt" },
            { value: "active", label: "Đang hoạt động" },
            { value: "completed", label: "Hoàn thành" },
            { value: "archived", label: "Đã lưu trữ" },
            // Thêm các trạng thái khác
          ])}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField(
            "Tiến độ (%)",
            "progress",
            project?.progress,
            "number",
            undefined,
            "1",
            "0",
            "100",
          )}
          {renderField(
            "Tổng tín chỉ Carbon",
            "carbonCreditsTotal",
            project?.carbonCreditsTotal,
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
            project?.carbonCredits,
            "number",
            undefined,
            "1",
            "0",
          )}
          {renderField(
            "Tín chỉ Carbon đã yêu cầu",
            "carbonCreditsClaimed",
            project?.carbonCreditsClaimed,
            "number",
            undefined,
            "1",
            "0",
          )}
        </div>

        {/* Trường chỉ đọc không có trong formData */}
        <div>
          <Label>Ngày đăng ký</Label>
          <div className="mt-1 text-gray-900 text-sm flex items-center">
            <CalendarDaysIcon className="mr-2 h-4 w-4 text-gray-500" />
            {project?.registrationDate
              ? new Date(project.registrationDate).toLocaleDateString()
              : "N/A"}
          </div>
        </div>

        {/* Activities List (Display only in both modes) */}
        {project?.activities && project.activities.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
              <BookOpenIcon className="mr-2 h-5 w-5 text-gray-700" />
              Hoạt động gần đây
            </h3>
            <ul className="border rounded-md p-3 bg-gray-50 max-h-40 overflow-y-auto text-sm">
              {project.activities.map((activity) => (
                <li
                  key={activity._id || activity.description}
                  className="leading-tight mb-1"
                >
                  <strong>
                    {new Date(activity.date).toLocaleDateString()}:
                  </strong>{" "}
                  {activity.description}{" "}
                  {activity.title ? `(${activity.title})` : ""}{" "}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Documents List (Display only in both modes) */}
        {project?.documents && project.documents.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
              <FileTextIcon className="mr-2 h-5 w-5 text-gray-700" />
              Tài liệu
            </h3>
            <div className="text-sm text-gray-700">
              ({project.documents.length} tài liệu đính kèm)
            </div>
          </div>
        )}

        {/* Action Buttons (Visible only in Edit mode) */}
        {isEditing && (
          <div className="flex items-center justify-start gap-4 mt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !formData || isDeleting}
            >
              {isSubmitting ? (
                "Đang lưu..."
              ) : (
                <>
                  <SaveIcon className="mr-2 h-4 w-4" /> Lưu thay đổi
                </>
              )}
            </Button>

            {project?._id && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
              >
                {isDeleting ? (
                  "Đang xóa..."
                ) : (
                  <>
                    <Trash2Icon className="mr-2 h-4 w-4" /> Xóa Dự án
                  </>
                )}
              </Button>
            )}

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
      {/* Button Quay lại (Visible only when not in Edit mode) */}
      {!isEditing && (
        <div className="flex items-center justify-start gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()} // Quay lại trang trước
            disabled={loading || isDeleting || isSubmitting}
          >
            Quay lại
          </Button>
        </div>
      )}
    </div>
  );
}
