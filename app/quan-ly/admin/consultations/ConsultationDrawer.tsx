"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import {
  apiConsultations,
  IConsultation,
} from "@/app/fetch/fetch.consultations";
import { useState, useEffect } from "react";

type ConsultationType =
  | "forest"
  | "carbon"
  | "other"
  | "biochar"
  | "agriculture"
  | "csu"
  | "carbonbook";

interface ConsultationDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setConsultations: React.Dispatch<React.SetStateAction<IConsultation[]>>;
  selectedConsultation: IConsultation | null;
  setSelectedConsultation: React.Dispatch<
    React.SetStateAction<IConsultation | null>
  >;
  // **Lưu ý: formData không còn cần thiết cho việc hiển thị tất cả các trường**
  // Thay vào đó, chúng ta sẽ đọc trực tiếp từ selectedConsultation để đảm bảo dữ liệu luôn đồng bộ và đầy đủ
  formData: {
    // Vẫn giữ để tránh lỗi compile nếu bạn đang dùng ở nơi khác, nhưng chúng ta sẽ không dùng nó để hiển thị dữ liệu chi tiết
    name: string;
    email: string;
    phone: string;
    organization: string;
    consultationType: ConsultationType;
    projectType: string;
    projectSize: string;
    budget: string;
    status: "pending" | "in_progress" | "completed" | "cancelled";
  };
  setFormData: React.Dispatch<
    // Vẫn giữ để tránh lỗi compile nếu bạn đang dùng ở nơi khác
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      organization: string;
      consultationType: ConsultationType;
      projectType: string;
      projectSize: string;
      budget: string;
      status: "pending" | "in_progress" | "completed" | "cancelled";
    }>
  >;
}

export default function ConsultationDrawer({
  isOpen,
  setIsOpen,
  setConsultations,
  selectedConsultation,
  setSelectedConsultation,
  formData, // Giữ lại formData props nhưng không dùng để hiển thị chi tiết nữa
  setFormData, // Giữ lại setFormData props nhưng không dùng để set chi tiết nữa
}: ConsultationDrawerProps) {
  const { toast } = useToast();
  const [feedbackContent, setFeedbackContent] = useState("");
  useEffect(() => {
    if (isOpen && selectedConsultation) {
      setFeedbackContent(selectedConsultation.feedback || "");
    } else if (!isOpen) {
      setFeedbackContent(""); // Reset khi đóng drawer
    }
  }, [isOpen, selectedConsultation]);

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

  const handleSendFeedback = async () => {
    if (!selectedConsultation?._id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy yêu cầu tư vấn để gửi phản hồi.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedData = {
        ...selectedConsultation,
        status: "completed" as "completed", // Cập nhật trạng thái
        feedback: feedbackContent, // Thêm/cập nhật nội dung phản hồi
      };

      const res = await apiConsultations.updateConsultation(
        selectedConsultation._id,
        updatedData,
      );

      if (res.payload) {
        setConsultations((prev) =>
          prev.map((c) =>
            c._id === selectedConsultation._id ? res.payload.consultation : c,
          ),
        );
        toast({
          title: "Thành công",
          description: "Phản hồi đã được gửi thành công!",
        });
        setIsOpen(false);
        setSelectedConsultation(null);
        setFeedbackContent("");
      } else {
        throw new Error("Gửi phản hồi thất bại");
      }
    } catch (err: any) {
      console.error("Lỗi khi gửi phản hồi:", err);
      toast({
        title: "Lỗi",
        description:
          err.response?.data?.error || "Không thể gửi phản hồi yêu cầu tư vấn!",
        variant: "destructive",
      });
    }
  };

  // Tránh lỗi khi selectedConsultation là null
  if (!selectedConsultation) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="w-full sm:max-w-xl mx-auto rounded-t-[10px] p-4">
        <DrawerHeader className="text-center pb-4">
          <DrawerTitle className="text-2xl font-bold text-gray-900">
            Chi tiết và phản hồi yêu cầu tư vấn
          </DrawerTitle>
          <DrawerDescription className="text-sm text-gray-600 mt-1">
            Xem thông tin yêu cầu và gửi phản hồi cho khách hàng.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 px-4 py-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {/* Custom Scrollbar */}
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
          `}</style>
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 border-b pb-4 mb-4">
            <h3 className="col-span-2 text-lg font-semibold text-gray-800 mb-2">
              Thông tin khách hàng
            </h3>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Tên khách hàng:
              </Label>
              <span className="text-base text-gray-900 font-semibold">
                {selectedConsultation?.name || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Email:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.email || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Số điện thoại:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.phone || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Tổ chức:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.organization || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">Tuổi:</Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.age || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Vị trí:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.position || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1 col-span-2">
              <Label className="text-sm font-medium text-gray-700">
                Kinh nghiệm:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.experience || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1 col-span-2">
              <Label className="text-sm font-medium text-gray-700">
                Học vấn:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.education || "N/A"}
              </span>
            </div>
          </div>

          {/* Các trường thông tin yêu cầu tư vấn */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 mb-4">
            <h3 className="col-span-2 text-lg font-semibold text-gray-800 mb-2">
              Thông tin yêu cầu tư vấn
            </h3>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Loại tư vấn:
              </Label>
              <span className="text-base text-gray-900">
                {consultationTypeMap[selectedConsultation?.consultationType] ||
                  "Khác"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Loại dự án:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.projectType || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Quy mô dự án:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.projectSize || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Ngân sách:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.budget || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Khu vực (Area):
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.area || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Địa điểm dự án:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.projectLocation || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1 col-span-2">
              <Label className="text-sm font-medium text-gray-700">
                Mục tiêu Carbon:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.carbonGoals || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1 col-span-2">
              <Label className="text-sm font-medium text-gray-700">
                Lộ trình thực hiện:
              </Label>
              <span className="text-base text-gray-900">
                {selectedConsultation?.implementationTimeline || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-1 col-span-2">
              <Label className="text-sm font-medium text-gray-700">
                Lời nhắn của khách hàng:
              </Label>
              <span className="text-base text-gray-900 leading-relaxed">
                {selectedConsultation?.message || "Không có lời nhắn."}
              </span>
            </div>
            <div className="flex flex-col space-y-1 col-span-2">
              <Label className="text-sm font-medium text-gray-700">
                Trạng thái:
              </Label>
              <span className="text-base text-gray-900 font-semibold">
                {statusMap[selectedConsultation?.status] || "Không rõ"}
              </span>
            </div>
          </div>

          {/* Trường nhập liệu cho phản hồi */}
          <div className="col-span-1 md:col-span-2 flex flex-col space-y-2 pt-4 border-t">
            <Label
              htmlFor="feedbackContent"
              className="text-lg font-semibold text-gray-800"
            >
              Nội dung phản hồi:
            </Label>
            <Textarea
              id="feedbackContent"
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              placeholder="Nhập nội dung phản hồi tại đây..."
              className="min-h-[120px] resize-y border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
            />
          </div>
        </div>
        <DrawerFooter className="flex flex-row justify-end gap-3 p-4 border-t pt-4 bg-white sticky bottom-0">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Đóng
          </Button>
          <Button
            onClick={handleSendFeedback}
            disabled={!feedbackContent.trim()}
          >
            Gửi phản hồi
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
