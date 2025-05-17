"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Trash2 } from "lucide-react";
type ConsultationType = "forest" | "carbon" | "other" | "biochar" | "agriculture" | "csu" | "carbonbook";

interface ConsultationDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setConsultations: React.Dispatch<React.SetStateAction<IConsultation[]>>;
  selectedConsultation: IConsultation | null;
  setSelectedConsultation: React.Dispatch<
    React.SetStateAction<IConsultation | null>
  >;
  formData: {
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
interface FormDataType {
  name: string;
  email: string;
  phone: string;
  organization: string;
  consultationType: ConsultationType; // dùng type rộng luôn
  projectType: string;
  projectSize: string;
  budget: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
}

export default function ConsultationDrawer({
  isOpen,
  setIsOpen,
  setConsultations,
  selectedConsultation,
  setSelectedConsultation,
  formData,
  setFormData,
}: ConsultationDrawerProps) {
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      if (selectedConsultation?._id) {
        const res = await apiConsultations.updateConsultation(
          selectedConsultation._id,
          formData,
        );
        if (res.status === 200) {
          setConsultations((prev) =>
            prev.map((c) =>
              c._id === selectedConsultation._id ? res.payload.consultation : c,
            ),
          );
          toast({
            title: "Thành công",
            description: "Sửa yêu cầu tư vấn thành công!",
          });
        } else {
          throw new Error("Sửa yêu cầu tư vấn thất bại");
        }
      } else {
        const res = await apiConsultations.createConsultation(formData);
        if (res && res.payload) {
          setConsultations((prev) => [...prev, res.payload.consultation]);
          toast({
            title: "Thành công",
            description: "Thêm yêu cầu tư vấn mới thành công!",
          });
        } else {
          throw new Error("Thêm yêu cầu tư vấn thất bại");
        }
      }
      setIsOpen(false);
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
      setSelectedConsultation(null);
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description:
          err.response?.data?.error || "Không thể xử lý yêu cầu tư vấn!",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedConsultation?._id) return;
    try {
      const res = await apiConsultations.deleteConsultation(
        selectedConsultation._id,
      );
      if (res.status === 200) {
        setConsultations((prev) =>
          prev.filter((c) => c._id !== selectedConsultation._id),
        );
        setIsOpen(false);
        setSelectedConsultation(null);
        toast({
          title: "Thành công",
          description: "Xóa yêu cầu tư vấn thành công!",
        });
      } else {
        throw new Error("Xóa yêu cầu tư vấn thất bại");
      }
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description:
          err.response?.data?.error || "Không thể xóa yêu cầu tư vấn!",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="w-full sm:w-96">
        <DrawerHeader>
          <DrawerTitle>
            {selectedConsultation?._id
              ? "Sửa yêu cầu tư vấn"
              : "Thêm yêu cầu tư vấn mới"}
          </DrawerTitle>
          <DrawerDescription>
            {selectedConsultation?._id
              ? "Cập nhật thông tin yêu cầu tư vấn."
              : "Nhập thông tin để tạo yêu cầu tư vấn mới."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 p-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tên khách hàng
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="organization" className="text-right">
              Tổ chức
            </Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) =>
                setFormData({ ...formData, organization: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="consultationType" className="text-right">
              Loại tư vấn
            </Label>
            <select
              id="consultationType"
              value={formData.consultationType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  consultationType: e.target.value as
                    | "forest"
                    | "carbon"
                    | "other",
                })
              }
              className="col-span-3 border rounded-md p-2"
            >
              <option value="forest">Trồng rừng</option>
              <option value="carbon">Carbon Offset</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectType" className="text-right">
              Loại dự án
            </Label>
            <Input
              id="projectType"
              value={formData.projectType}
              onChange={(e) =>
                setFormData({ ...formData, projectType: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectSize" className="text-right">
              Quy mô dự án
            </Label>
            <Input
              id="projectSize"
              value={formData.projectSize}
              onChange={(e) =>
                setFormData({ ...formData, projectSize: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget" className="text-right">
              Ngân sách
            </Label>
            <Input
              id="budget"
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Trạng thái
            </Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as
                    | "pending"
                    | "in_progress"
                    | "completed"
                    | "cancelled",
                })
              }
              className="col-span-3 border rounded-md p-2"
            >
              <option value="pending">Đang chờ</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
        <DrawerFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              {selectedConsultation?._id ? "Lưu" : "Thêm"}
            </Button>
          </div>
          {selectedConsultation?._id && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-1" />
              Xóa
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
