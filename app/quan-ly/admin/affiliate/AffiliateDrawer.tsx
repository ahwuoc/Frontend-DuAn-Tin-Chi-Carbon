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
import { apiAffiliates, IAffiliate } from "@/app/fetch/fetch.affiliate";
import { Trash2 } from "lucide-react";

interface AffiliateDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setAffiliates: React.Dispatch<React.SetStateAction<IAffiliate[]>>;
  selectedAffiliate: IAffiliate | null;
  setSelectedAffiliate: React.Dispatch<React.SetStateAction<IAffiliate | null>>;
  formData: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    reason: string;
    referralCode: string;
    status: "pending" | "approved" | "rejected";
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      email: string;
      phone: string;
      company: string;
      reason: string;
      referralCode: string;
      status: "pending" | "approved" | "rejected";
    }>
  >;
}

export default function AffiliateDrawer({
  isOpen,
  setIsOpen,
  setAffiliates,
  selectedAffiliate,
  setSelectedAffiliate,
  formData,
  setFormData,
}: AffiliateDrawerProps) {
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      if (selectedAffiliate?._id) {
        const res = await apiAffiliates.update(selectedAffiliate._id, formData);
        if (res.status === 200) {
          setAffiliates((prev) =>
            prev.map((a) =>
              a._id === selectedAffiliate._id ? res.payload.affiliate : a
            )
          );
          toast({
            title: "Thành công",
            description: "Sửa affiliate thành công!",
          });
        } else {
          throw new Error("Sửa affiliate thất bại");
        }
      } else {
        const res = await apiAffiliates.create(formData);
        if (res.status === 201) {
          setAffiliates((prev) => [...prev, res.payload.affiliate]);
          toast({
            title: "Thành công",
            description: "Thêm affiliate mới thành công!",
          });
        } else {
          throw new Error("Thêm affiliate thất bại");
        }
      }
      setIsOpen(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        reason: "",
        referralCode: "",
        status: "pending",
      });
      setSelectedAffiliate(null);
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.response?.data?.error || "Không thể xử lý affiliate!",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedAffiliate?._id) return;
    try {
      const res = await apiAffiliates.remove(selectedAffiliate._id);
      if (res.status === 200) {
        setAffiliates((prev) =>
          prev.filter((a) => a._id !== selectedAffiliate._id)
        );
        setIsOpen(false);
        setSelectedAffiliate(null);
        toast({
          title: "Thành công",
          description: "Xóa affiliate thành công!",
        });
      } else {
        throw new Error("Xóa affiliate thất bại");
      }
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.response?.data?.error || "Không thể xóa affiliate!",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="w-full sm:w-96 h-full flex flex-col">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="text-xl">
            {selectedAffiliate?._id ? "Sửa Affiliate" : "Thêm Affiliate mới"}
          </DrawerTitle>
          <DrawerDescription>
            {selectedAffiliate?._id
              ? "Cập nhật thông tin affiliate."
              : "Nhập thông tin để tạo affiliate mới."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {formData && (
            <>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="fullName" className="font-medium">
                  Họ tên
                </Label>
                <Input
                  id="fullName"
                  value={formData?.fullName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full"
                  placeholder="Nhập họ tên"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="email" className="font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData?.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full"
                  placeholder="Nhập email"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="phone" className="font-medium">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  value={formData?.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </>
          )}
        </div>
        <DrawerFooter className="border-t pt-4 px-6 flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit} className="w-full sm:w-auto">
              {selectedAffiliate?._id ? "Lưu" : "Thêm"}
            </Button>
          </div>
          {selectedAffiliate?._id && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Xóa
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
