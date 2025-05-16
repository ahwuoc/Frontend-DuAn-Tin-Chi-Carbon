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
import { apiOrders } from "@/app/fetch/fetch.order";
import { Trash2 } from "lucide-react";
import { IOrder } from "./page";
interface OrderDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setOrders: React.Dispatch<React.SetStateAction<IOrder[]>>;
  selectedOrder: IOrder | null;
  setSelectedOrder: React.Dispatch<React.SetStateAction<IOrder | null>>;
  formData: {
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerAddress: string;
    amount: number;
    status: "pending" | "completed" | "cancelled";
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      buyerName: string;
      buyerEmail: string;
      buyerPhone: string;
      buyerAddress: string;
      amount: number;
      status: "pending" | "completed" | "cancelled";
    }>
  >;
}

export default function OrderDrawer({
  isOpen,
  setIsOpen,
  setOrders,
  selectedOrder,
  setSelectedOrder,
  formData,
  setFormData,
}: OrderDrawerProps) {
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      if (selectedOrder?._id) {
        const res = await apiOrders.update(selectedOrder._id, formData);
        if (res?.status === 200 && res.data) {
          setOrders((prev = []) =>
            prev.map((o) => (o._id === selectedOrder._id ? (res.data as IOrder) : o))
          );

          toast({
            title: "Thành công",
            description: "Sửa đơn hàng thành công!",
          });
        } else {
          throw new Error("Sửa đơn hàng thất bại");
        }
      } else {
        // Tạo mới đơn hàng thì add mới vào array, ko phải map
        const res = await apiOrders.createOrder(formData);
        if (res.status === 200 && res.data) {
          setOrders((prev) => [...prev, res.data as IOrder]); // push item mới

          toast({
            title: "Thành công",
            description: "Thêm đơn hàng mới thành công!",
          });
        } else {
          throw new Error("Thêm đơn hàng thất bại");
        }
      }
      setIsOpen(false);
      setFormData({
        buyerName: "",
        buyerEmail: "",
        buyerPhone: "",
        buyerAddress: "",
        amount: 0,
        status: "pending",
      });
      setSelectedOrder(null);
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.response?.data?.error || "Không thể xử lý đơn hàng!",
        variant: "destructive",
      });
    }
  };
  const handleDelete = async () => {
    if (!selectedOrder?._id) return;
    try {
      const res = await apiOrders.deleteID(selectedOrder._id);
      if (res.status === 200) {
        setOrders((prev) => prev.filter((o) => o._id !== selectedOrder._id));
        setIsOpen(false);
        setSelectedOrder(null);
        toast({
          title: "Thành công",
          description: "Xóa đơn hàng thành công!",
        });
      } else {
        throw new Error("Xóa đơn hàng thất bại");
      }
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.response?.data?.error || "Không thể xóa đơn hàng!",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="w-full sm:w-96">
        <DrawerHeader>
          <DrawerTitle>
            {selectedOrder?._id ? "Sửa đơn hàng" : "Thêm đơn hàng mới"}
          </DrawerTitle>
          <DrawerDescription>
            {selectedOrder?._id
              ? "Cập nhật thông tin đơn hàng."
              : "Nhập thông tin để tạo đơn hàng mới."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 p-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="buyerName" className="text-right">
              Tên người mua
            </Label>
            <Input
              id="buyerName"
              value={formData.buyerName}
              onChange={(e) =>
                setFormData({ ...formData, buyerName: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="buyerEmail" className="text-right">
              Email
            </Label>
            <Input
              id="buyerEmail"
              type="email"
              value={formData.buyerEmail}
              onChange={(e) =>
                setFormData({ ...formData, buyerEmail: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="buyerPhone" className="text-right">
              Số điện thoại
            </Label>
            <Input
              id="buyerPhone"
              value={formData.buyerPhone}
              onChange={(e) =>
                setFormData({ ...formData, buyerPhone: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="buyerAddress" className="text-right">
              Địa chỉ
            </Label>
            <Input
              id="buyerAddress"
              value={formData.buyerAddress}
              onChange={(e) =>
                setFormData({ ...formData, buyerAddress: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Số tiền
            </Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
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
                    | "completed"
                    | "cancelled",
                })
              }
              className="col-span-3 border rounded-md p-2"
            >
              <option value="pending">Đang chờ</option>
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
              {selectedOrder?._id ? "Lưu" : "Thêm"}
            </Button>
          </div>
          {selectedOrder?._id && (
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
