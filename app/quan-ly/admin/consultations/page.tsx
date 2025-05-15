"use client";

import { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import ConsultationDrawer from "./ConsultationDrawer";

import {
  apiConsultations,
  IConsultation,
} from "@/app/fetch/fetch.consultations";

export default function AdminConsultationsPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<IConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConsultationDrawerOpen, setIsConsultationDrawerOpen] =
    useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<IConsultation | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    consultationType: "forest" as "forest" | "carbon" | "other",
    projectType: "",
    projectSize: "",
    budget: "",
    status: "pending" as "pending" | "in_progress" | "completed" | "cancelled",
  });

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiConsultations.getAll();
        if (response && response?.data) {
          setConsultations(response.data.data);
        } else {
          throw new Error("Không lấy được danh sách yêu cầu tư vấn");
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu yêu cầu tư vấn:", err);
        setError("Không thể tải danh sách yêu cầu tư vấn. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, [router]);

  const openConsultationDrawer = (consultation?: IConsultation) => {
    if (consultation) {
      setSelectedConsultation(consultation);
      setFormData({
        name: consultation.name || "",
        email: consultation.email || "",
        phone: consultation.phone || "",
        organization: consultation.organization || "",
        consultationType: consultation.consultationType || "forest",
        projectType: consultation.projectType || "",
        projectSize: consultation.projectSize || "",
        budget: consultation.budget || "",
        status: consultation.status || "pending",
      });
    } else {
      setSelectedConsultation(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        consultationType: "forest",
        projectType: "",
        projectSize: "",
        budget: "",
        status: "pending",
      });
    }
    setIsConsultationDrawerOpen(true);
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Nội dung chính */}
      <div className="flex-1 p-4 md:p-8">
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Danh sách yêu cầu tư vấn</CardTitle>
                <CardDescription>
                  Quản lý thông tin yêu cầu tư vấn môi trường trên hệ thống
                </CardDescription>
              </div>
              <Button onClick={() => openConsultationDrawer()}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm yêu cầu
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {consultations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Chưa có yêu cầu tư vấn nào. Thêm ngay!
                </p>
                <Button
                  className="mt-4"
                  onClick={() => openConsultationDrawer()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm yêu cầu
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên khách hàng</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tổ chức</TableHead>
                      <TableHead>Loại tư vấn</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consultations.length > 0 &&
                      consultations.map((consultation) => (
                        <TableRow key={consultation._id}>
                          <TableCell className="font-medium">
                            {consultation.name || "N/A"}
                          </TableCell>
                          <TableCell>{consultation.email || "N/A"}</TableCell>
                          <TableCell>
                            {consultation.organization || "N/A"}
                          </TableCell>
                          <TableCell>
                            {consultation.consultationType === "forest"
                              ? "Trồng rừng"
                              : consultation.consultationType === "carbon"
                                ? "Carbon Offset"
                                : "Khác"}
                          </TableCell>
                          <TableCell>
                            {consultation.status === "pending"
                              ? "Đang chờ"
                              : consultation.status === "in_progress"
                                ? "Đang xử lý"
                                : consultation.status === "completed"
                                  ? "Hoàn thành"
                                  : "Đã hủy"}
                          </TableCell>
                          <TableCell>
                            {formatDate(consultation.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openConsultationDrawer(consultation)
                                }
                              >
                                <Pencil className="w-4 h-4 mr-1" />
                                Sửa
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openConsultationDrawer(consultation)
                                }
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
      {/* Drawer xử lý yêu cầu tư vấn (create/update/delete) */}
      <ConsultationDrawer
        isOpen={isConsultationDrawerOpen}
        setIsOpen={setIsConsultationDrawerOpen}
        setConsultations={setConsultations}
        selectedConsultation={selectedConsultation}
        setSelectedConsultation={setSelectedConsultation}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
