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
import { Plus, MessageSquareText } from "lucide-react";

import ConsultationDrawer from "./ConsultationDrawer";

type ConsultationType =
  | "forest"
  | "carbon"
  | "other"
  | "biochar"
  | "agriculture"
  | "csu"
  | "carbonbook";

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  organization: string;
  consultationType: ConsultationType;
  projectType: string;
  projectSize: string;
  budget: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
}

// Interface ConsultationDrawerProps không cần thay đổi trong file này,
// nhưng tôi sẽ giữ nó ở đây để bạn tiện tham khảo.
interface ConsultationDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setConsultations: React.Dispatch<React.SetStateAction<IConsultation[]>>;
  selectedConsultation: IConsultation | null;
  setSelectedConsultation: React.Dispatch<
    React.SetStateAction<IConsultation | null>
  >;
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

import {
  apiConsultations,
  IConsultation,
} from "@/app/fetch/fetch.consultations";

export default function AdminConsultationsPage() {
  const consultationTypeMap: Record<ConsultationType, string> = {
    forest: "Trồng rừng",
    carbon: "Carbon Offset",
    biochar: "Biochar",
    agriculture: "Nông nghiệp",
    csu: "CSU",
    carbonbook: "Carbonbook",
    other: "Khác",
  };

  const statusMap: Record<
    "pending" | "in_progress" | "completed" | "cancelled",
    string
  > = {
    pending: "Đang chờ",
    in_progress: "Đang xử lý",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const router = useRouter();
  const [consultations, setConsultations] = useState<IConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConsultationDrawerOpen, setIsConsultationDrawerOpen] =
    useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<IConsultation | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    // Sử dụng FormDataType
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

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiConsultations.getAll();
        if (response && response?.payload) {
          setConsultations(response.payload.data);
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
    setSelectedConsultation(consultation || null);

    if (consultation) {
      setFormData({
        name: consultation.name || "",
        email: consultation.email || "",
        phone: consultation.phone || "",
        organization: consultation.organization || "",
        consultationType: consultation.consultationType || "other",
        projectType: consultation.projectType || "",
        projectSize: consultation.projectSize || "",
        budget: consultation.budget || "",
        status: consultation.status || "pending",
      });
    } else {
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

  const formatDate = (dateString: string) => {
    // Thay đổi kiểu về string vì createdAt thường là string từ API
    if (!dateString) return "N/A";
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
            </div>
          </CardHeader>
          <CardContent>
            {consultations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có yêu cầu tư vấn nào.</p>
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
                      consultations.map((consultation, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {consultation?.name || "N/A"}
                          </TableCell>
                          <TableCell>{consultation?.email || "N/A"}</TableCell>
                          <TableCell>
                            {consultation?.organization || "N/A"}
                          </TableCell>
                          <TableCell>
                            {consultation?.consultationType
                              ? consultationTypeMap[
                                  consultation.consultationType
                                ]
                              : "Khác"}
                          </TableCell>
                          <TableCell>
                            {consultation?.status
                              ? statusMap[consultation.status]
                              : "Không rõ"}
                          </TableCell>
                          <TableCell>
                            {formatDate(consultation?.createdAt || "")}
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
                                <MessageSquareText className="w-4 h-4 mr-1" />
                                Gửi lời phản hồi
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
