"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiProjects } from "@/app/fetch/fetch.projects";

// Import các component UI cần thiết
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Để hiển thị trạng thái tài liệu
import { Separator } from "@/components/ui/separator"; // Để phân tách các phần
import {
  FileText,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Eye, // Icon xem
  CheckCircle2, // Icon phê duyệt
  XCircle, // Icon từ chối
  FileUp, // Icon cho tài liệu đang chờ
} from "lucide-react";
import Link from "next/link";
import { formatDateUtil } from "@/app/utils/common";

// --- Interfaces (Đảm bảo các interfaces này được định nghĩa ở đây hoặc trong một file dùng chung) ---
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

export interface IDocument {
  _id?: string;
  name: string;
  url: string;
  type?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  status?: "pending" | "approved" | "rejected";
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
  documents?: IDocument[];
  activities?: IActivity[];
  userId: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
// --- Kết thúc Interfaces ---

export default function ProjectDocumentsDisplay() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State để lưu tài liệu đang được chọn/xem chi tiết
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(
    null,
  );

  const fetchProjectData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiProjects.getProject(projectId);
      if (response && response.payload) {
        setProject(response.payload);
      } else {
        throw new Error(
          response?.message || "Lỗi khi lấy dữ liệu dự án: Không tìm thấy",
        );
      }
    } catch (err: any) {
      console.error("Lỗi tải dữ liệu dự án:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu dự án.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, fetchProjectData]);

  const handleViewReport = (url: string) => {
    window.open(url, "_blank");
  };

  const handleApproveReport = async (documentId: string) => {
    console.log("Phê duyệt báo cáo với ID:", documentId);
    try {
      // Thực tế bạn sẽ gọi API ở đây, ví dụ:
      // const res = await apiProjects.updateDocumentStatus(projectId, documentId, "approved");
      // if (res.success) {
      //   alert("Phê duyệt thành công!");
      //   fetchProjectData(); // Tải lại dữ liệu
      //   setSelectedDocument(null); // Đóng panel chi tiết
      // }

      // Giả lập cập nhật trạng thái
      alert(`Đã phê duyệt báo cáo ID: ${documentId}`);
      setProject((prevProject) => {
        if (!prevProject) return null;
        const updatedDocs = prevProject.documents?.map((doc) =>
          doc._id === documentId ? { ...doc, status: "approved" } : doc,
        );
        return { ...prevProject, documents: updatedDocs };
      });
      setSelectedDocument((prevDoc) =>
        prevDoc && prevDoc._id === documentId
          ? { ...prevDoc, status: "approved" }
          : null,
      );
    } catch (err) {
      console.error("Lỗi phê duyệt báo cáo:", err);
      setError("Đã xảy ra lỗi khi phê duyệt báo cáo.");
    }
  };

  const handleRejectReport = async (documentId: string) => {
    console.log("Từ chối báo cáo với ID:", documentId);
    try {
      const res = await apiProjects.updateDocumentStatus(
        projectId,
        documentId,
        "rejected",
      );
      if (res && res.payload) {
        alert("Từ chối thành công!");
        fetchProjectData();
        setSelectedDocument(null);
      }
      alert(`Đã từ chối báo cáo ID: ${documentId}`);
      setProject((prevProject) => {
        if (!prevProject) return null;
        const updatedDocs = prevProject.documents?.map((doc) =>
          doc._id === documentId ? { ...doc, status: "rejected" } : doc,
        );
        return { ...prevProject, documents: updatedDocs };
      });
      setSelectedDocument((prevDoc) =>
        prevDoc && prevDoc._id === documentId
          ? { ...prevDoc, status: "rejected" }
          : null,
      );
    } catch (err) {
      console.error("Lỗi từ chối báo cáo:", err);
      setError("Đã xảy ra lỗi khi từ chối báo cáo.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-gray-600">Đang tải tài liệu dự án...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-red-700">
          {error || "Không tìm thấy dự án hoặc tài liệu"}
        </h2>
        <p className="text-gray-500 mb-6">
          Có lỗi xảy ra hoặc dự án/tài liệu không tồn tại. Vui lòng thử lại.
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

  const allDocuments = project.documents || [];

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Đã phê duyệt
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" /> Đã từ chối
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <FileUp className="w-3 h-3 mr-1" /> Đang chờ
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-6 flex justify-between items-center">
        <Link
          href={`/quan-ly/du-an/${projectId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại chi tiết dự án {project.name ? `: ${project.name}` : ""}
        </Link>
        {/* Có thể thêm nút "Tải lên tài liệu mới" ở đây nếu cần */}
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        <FileText className="inline-block mr-3 h-8 w-8 text-primary" />
        Quản lý Tài liệu Dự án
        <p className="text-base font-normal text-gray-500 mt-2">
          Xem và quản lý các tài liệu đính kèm cho dự án `{project.name}`.
        </p>
      </h1>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md flex items-center gap-2 mb-6">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột trái: Danh sách tài liệu */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <FileText className="mr-2 h-5 w-5 text-gray-700" />
                Danh sách Tài liệu
              </CardTitle>
              <CardDescription>
                Click vào một tài liệu để xem chi tiết và quản lý.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
              {allDocuments.length > 0 ? (
                <div className="space-y-3">
                  {allDocuments.map((doc) => (
                    <div
                      key={doc._id || doc.url}
                      className={`
                        flex items-center justify-between p-3 border rounded-md cursor-pointer
                        hover:bg-gray-50 transition-colors
                        ${
                          selectedDocument?._id === doc._id
                            ? "bg-blue-50 border-blue-400"
                            : "bg-white border-gray-200"
                        }
                      `}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="flex items-center truncate">
                        <FileText className="h-5 w-5 mr-3 flex-shrink-0 text-gray-600" />
                        <div className="truncate">
                          <p className="font-medium truncate">{doc.name}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {doc.type} &bull;{" "}
                            {doc.uploadedAt
                              ? formatDateUtil(doc.uploadedAt)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {getStatusBadge(doc.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa có tài liệu nào được đính kèm cho dự án này.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cột phải: Panel chi tiết tài liệu / Phê duyệt (hiện khi chọn) */}
        <div className="md:col-span-1">
          <Card className="sticky top-10 h-full">
            <CardHeader>
              <CardTitle className="text-xl">
                {selectedDocument ? (
                  <>
                    <FileText className="inline-block mr-2 h-5 w-5" />
                    Chi tiết Tài liệu
                  </>
                ) : (
                  "Chọn Tài liệu"
                )}
              </CardTitle>
              <CardDescription>
                {selectedDocument
                  ? "Xem thông tin chi tiết và quản lý tài liệu đã chọn."
                  : "Chọn một tài liệu từ danh sách bên trái để xem chi tiết."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDocument ? (
                <>
                  <p className="font-bold text-lg">{selectedDocument.name}</p>
                  <p className="text-sm text-gray-600">
                    **Loại:** {selectedDocument.type || "Không xác định"}
                  </p>
                  <p className="text-sm text-gray-600">
                    **Ngày tải lên:**{" "}
                    {selectedDocument.uploadedAt
                      ? formatDateUtil(selectedDocument.uploadedAt)
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    **Trạng thái:** {getStatusBadge(selectedDocument.status)}
                  </p>

                  <Separator className="my-4" />

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleViewReport(selectedDocument.url)}
                      className="w-full"
                      variant="outline"
                    >
                      <Eye className="w-4 h-4 mr-2" /> Xem Báo cáo
                    </Button>
                    {selectedDocument.status === "pending" ||
                    !selectedDocument.status ? ( // Hiển thị nút phê duyệt/từ chối nếu trạng thái là pending hoặc không có trạng thái
                      <>
                        <Button
                          onClick={() =>
                            handleApproveReport(selectedDocument._id!)
                          }
                          className="w-full"
                          variant="default"
                          disabled={!selectedDocument._id}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Phê duyệt
                        </Button>
                        <Button
                          onClick={() =>
                            handleRejectReport(selectedDocument._id!)
                          }
                          className="w-full"
                          variant="destructive"
                          disabled={!selectedDocument._id}
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Từ chối
                        </Button>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 italic text-center mt-4">
                        Tài liệu này đã được{" "}
                        {selectedDocument.status === "approved"
                          ? "phê duyệt"
                          : "từ chối"}
                        .
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  <FileText className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                  <p>Chưa có tài liệu nào được chọn.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
