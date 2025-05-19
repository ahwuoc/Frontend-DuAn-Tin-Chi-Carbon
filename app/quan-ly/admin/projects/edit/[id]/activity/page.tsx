"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ClockIcon,
  Trash2Icon,
  PencilIcon,
} from "lucide-react";
import { apiProjects } from "@/app/fetch/fetch.projects"; // Đảm bảo đường dẫn này đúng
import Link from "next/link";

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
  activities?: IActivity[]; // Mảng các hoạt động
  userId: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function UpdateProjectActivityPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [description, setDescription] = useState("");
  const [activityDate, setActivityDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [title, setTitle] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // State mới để chỉ lưu trữ mảng activities
  const [projectActivities, setProjectActivities] = useState<IActivity[]>([]);
  // State để lưu trữ tên dự án, phục vụ hiển thị
  const [projectName, setProjectName] = useState<string | null>(null);

  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(
    null,
  );
  const [editingActivity, setEditingActivity] = useState<IActivity | null>(
    null,
  );

  const fetchProjectData = async () => {
    setLoadingProject(true);
    try {
      const response = await apiProjects.getProject(projectId);
      if (response && response.payload) {
        // Chỉ lưu mảng activities và tên dự án
        setProjectActivities(response.payload.activities || []);
        setProjectName(response.payload.name);
      } else {
        setProjectActivities([]);
        setProjectName(null);
      }
    } catch (err) {
      console.error("Failed to fetch project data:", err);
      setProjectActivities([]);
      setProjectName(null);
    } finally {
      setLoadingProject(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchProjectData();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setMessage(null);

    if (!description || !activityDate) {
      setMessage({
        type: "error",
        text: "Vui lòng điền đầy đủ các trường bắt buộc.",
      });
      setLoadingForm(false);
      return;
    }

    const activityToSave: IActivity = {
      description,
      date: new Date(activityDate).toISOString(),
      title: title || undefined,
    };

    try {
      let activitiesToUpdate: IActivity[];

      if (editingActivity) {
        // Cập nhật hoạt động hiện có trong mảng projectActivities
        activitiesToUpdate = projectActivities.map((act) =>
          act._id === editingActivity._id ? { ...act, ...activityToSave } : act,
        );
      } else {
        // Thêm hoạt động mới vào mảng projectActivities
        activitiesToUpdate = [
          ...projectActivities,
          activityToSave as IActivity,
        ];
      }

      // Gửi mảng hoạt động đã cập nhật lên API
      const res = await apiProjects.updateActivities(projectId, {
        activities: activitiesToUpdate,
      });

      if (!res || !res.payload) {
        throw new Error(
          editingActivity
            ? "Cập nhật hoạt động thất bại."
            : "Thêm hoạt động thất bại: Lỗi API không xác định.",
        );
      }

      setMessage({
        type: "success",
        text: editingActivity
          ? "Hoạt động đã được cập nhật thành công!"
          : "Hoạt động đã được thêm thành công!",
      });
      // Cập nhật state projectActivities với mảng hoạt động mới nhất từ phản hồi API
      setProjectActivities(res.payload.activities || []);
      setDescription("");
      setActivityDate(new Date().toISOString().split("T")[0]);
      setTitle("");
      setEditingActivity(null);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Đã xảy ra lỗi.",
      });
    } finally {
      setLoadingForm(false);
    }
  };

  const handleDeleteActivity = async (activityToDeleteId: string) => {
    if (!projectId || !projectActivities) return;

    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa hoạt động này không? Hành động này không thể hoàn tác.",
    );
    if (!confirmDelete) return;

    setDeletingActivityId(activityToDeleteId);
    setMessage(null);

    try {
      // Lọc bỏ hoạt động cần xóa khỏi mảng projectActivities
      const updatedActivities = projectActivities.filter(
        (activity) => activity._id !== activityToDeleteId,
      );

      // Gửi mảng hoạt động đã cập nhật lên API
      const res = await apiProjects.updateActivities(projectId, {
        activities: updatedActivities,
      });

      if (!res || !res.payload) {
        throw new Error(
          res?.message || "Xóa hoạt động thất bại: Lỗi API không xác định.",
        );
      }

      setMessage({
        type: "success",
        text: "Hoạt động đã được xóa thành công!",
      });
      // Cập nhật state projectActivities với mảng hoạt động mới nhất từ phản hồi API
      setProjectActivities(res.payload.activities || []);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Đã xảy ra lỗi khi xóa hoạt động.",
      });
      console.error("Lỗi xóa hoạt động:", error);
    } finally {
      setDeletingActivityId(null);
    }
  };

  const handleEditActivityClick = (activity: IActivity) => {
    setEditingActivity(activity);
    setTitle(activity.title || "");
    setDescription(activity.description);
    // Đảm bảo định dạng ngày phù hợp với input type="date"
    setActivityDate(activity.date.split("T")[0]);
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingActivity(null);
    setTitle("");
    setDescription("");
    setActivityDate(new Date().toISOString().split("T")[0]);
    setMessage(null);
  };

  if (loadingProject) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Đang tải dữ liệu dự án...</p>
      </div>
    );
  }

  // Hiển thị thông báo nếu không tìm thấy tên dự án (nghĩa là không tìm thấy dự án)
  if (!projectName) {
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
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link
          href={`/quan-ly/du-an/${projectId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại chi tiết dự án {projectName ? `: ${projectName}` : ""}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="w-full mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                {editingActivity ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới"}
              </CardTitle>
              <CardDescription>
                {editingActivity
                  ? "Cập nhật thông tin cho hoạt động này."
                  : `Thêm hoạt động mới vào dự án "${projectName}".`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="title">Tiêu đề (tùy chọn)</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Ví dụ: Trồng cây đợt 1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="description">Mô tả hoạt động</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết hoạt động đã diễn ra..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="activityDate">Ngày hoạt động</Label>
                  <Input
                    id="activityDate"
                    type="date"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loadingForm}
                  >
                    {loadingForm ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang
                        lưu...
                      </>
                    ) : editingActivity ? (
                      "Lưu thay đổi"
                    ) : (
                      "Thêm hoạt động"
                    )}
                  </Button>
                  {editingActivity && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={loadingForm}
                    >
                      Hủy
                    </Button>
                  )}
                </div>

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

        <div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <ClockIcon className="mr-2 h-6 w-6" />
                Các hoạt động đã ghi nhận
              </CardTitle>
              <CardDescription>
                Danh sách các hoạt động hiện có của dự án.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projectActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có hoạt động nào được ghi nhận.
                </div>
              ) : (
                <ul className="space-y-4">
                  {projectActivities
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    )
                    .map((activity) => (
                      <li
                        key={
                          activity._id ||
                          `${activity.description}-${activity.date}`
                        }
                        className="p-4 border rounded-lg flex justify-between items-center"
                      >
                        <div className="flex items-start flex-grow">
                          <ClockIcon className="h-5 w-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Ngày:{" "}
                              {new Date(activity.date).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                            <h3 className="font-medium text-lg mt-1">
                              {activity.title || activity.description}
                            </h3>
                            {activity.title && (
                              <p className="text-sm text-gray-700 mt-1">
                                {activity.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditActivityClick(activity)}
                            disabled={!!deletingActivityId || !!editingActivity}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteActivity(activity._id!)}
                            disabled={
                              deletingActivityId === activity._id ||
                              !!editingActivity
                            }
                          >
                            {deletingActivityId === activity._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2Icon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
