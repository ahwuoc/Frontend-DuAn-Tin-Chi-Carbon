"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function CreateProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "pending" | "active" | "completed" | "approved" | "in_progress" | "rejected"
  >("pending");
  const [type, setType] = useState<"forestry" | "rice" | "biochar" | "other">(
    "forestry",
  );
  const [location, setLocation] = useState("");
  const [area, setArea] = useState<number | "">("");
  const [estimatedCredits, setEstimatedCredits] = useState<number | "">("");
  const [registrationDate, setRegistrationDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [progress, setProgress] = useState<number | "">("");
  const [participants, setParticipants] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const projectData = {
      name,
      description,
      status,
      type,
      location,
      area: area === "" ? undefined : Number(area),
      estimatedCredits:
        estimatedCredits === "" ? undefined : Number(estimatedCredits),
      registrationDate: registrationDate
        ? new Date(registrationDate).toISOString()
        : new Date().toISOString(),
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      progress: progress === "" ? undefined : Number(progress),
      participants: participants
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== ""),
      documents: [],
      activities: [],
      // userId: "ID_NGUOI_DUNG_HIEN_TAI", // Nếu project cần liên kết với user ID
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể tạo dự án");
      }

      setMessage({ type: "success", text: "Dự án đã được tạo thành công!" });
      // Reset form
      setName("");
      setDescription("");
      setStatus("pending");
      setType("forestry");
      setLocation("");
      setArea("");
      setEstimatedCredits("");
      setRegistrationDate(new Date().toISOString().split("T")[0]);
      setStartDate("");
      setEndDate("");
      setProgress("");
      setParticipants("");

      // Tùy chọn: Chuyển hướng sau khi tạo thành công
      // router.push("/quan-ly/du-an");
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Đã xảy ra lỗi khi tạo dự án.",
      });
      console.error("Lỗi tạo dự án:", error);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Thay đổi duy nhất ở đây: Xóa 'max-w-2xl mx-auto' */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Thêm Dự án Mới</CardTitle>
          <CardDescription>
            Điền thông tin chi tiết để đăng ký một dự án tín chỉ carbon mới.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tên Dự án */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Tên dự án</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ví dụ: Dự án Rừng Cát Tiên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Mô tả */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Mô tả dự án</Label>
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết về dự án..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Loại Dự án */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="type">Loại dự án</Label>
              <Select
                value={type}
                onValueChange={(
                  value: "forestry" | "rice" | "biochar" | "other",
                ) => setType(value)}
                required
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Chọn loại dự án" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forestry">Lâm nghiệp</SelectItem>
                  <SelectItem value="rice">Lúa</SelectItem>
                  <SelectItem value="biochar">Biochar</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Địa điểm */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="location">Địa điểm</Label>
              <Input
                id="location"
                type="text"
                placeholder="Ví dụ: Lào Cai, Việt Nam"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Diện tích */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="area">Diện tích (ha)</Label>
              <Input
                id="area"
                type="number"
                placeholder="Ví dụ: 150.5"
                value={area}
                onChange={(e) =>
                  setArea(e.target.value === "" ? "" : Number(e.target.value))
                }
                min={0}
                step={0.1}
              />
            </div>

            {/* Tín chỉ ước tính */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="estimatedCredits">
                Tín chỉ Carbon ước tính (tCO2e)
              </Label>
              <Input
                id="estimatedCredits"
                type="number"
                placeholder="Ví dụ: 1000"
                value={estimatedCredits}
                onChange={(e) =>
                  setEstimatedCredits(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                min={0}
                step={1}
              />
            </div>

            {/* Ngày đăng ký */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="registrationDate">Ngày đăng ký</Label>
              <Input
                id="registrationDate"
                type="date"
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
                required
              />
            </div>

            {/* Ngày bắt đầu & Ngày kết thúc */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Trạng thái */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={status}
                onValueChange={(value: any) => setStatus(value)}
                required
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Đang chờ</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="approved">Đã phê duyệt</SelectItem>
                  <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                  <SelectItem value="rejected">Bị từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Progress (Optional) */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="progress">Tiến độ (%)</Label>
              <Input
                id="progress"
                type="number"
                placeholder="Ví dụ: 45"
                value={progress}
                onChange={(e) =>
                  setProgress(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                min={0}
                max={100}
              />
            </div>

            {/* Participants (Simple text input, could be enhanced later) */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="participants">
                Người tham gia (cách nhau bởi dấu phẩy)
              </Label>
              <Input
                id="participants"
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A, Trần Thị B"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
              />
            </div>

            {/* Nút gửi form */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo...
                </>
              ) : (
                "Tạo Dự án"
              )}
            </Button>

            {/* Thông báo kết quả */}
            {message && (
              <div
                className={`flex items-center gap-2 p-3 rounded-md ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <p>{message.text}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
