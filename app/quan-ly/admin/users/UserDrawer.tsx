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
import apiAuth, { TUser } from "@/app/fetch/fetch.auth";
import { Trash2 } from "lucide-react";

interface UserDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setUsers: React.Dispatch<React.SetStateAction<TUser[]>>;
  selectedUser: TUser | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<TUser | null>>;
  formData: {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      password: string;
      role: "user" | "admin";
    }>
  >;
}

export default function UserDrawer({
  isOpen,
  setIsOpen,
  setUsers,
  selectedUser,
  setSelectedUser,
  formData,
  setFormData,
}: UserDrawerProps) {
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      if (selectedUser?._id) {
        const data = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        }
        const res = await apiAuth.updateUser(selectedUser._id, data);
        if (res.status === 200) {
          setUsers((prev) =>
            prev.map((u) => (u._id === selectedUser._id ? res.payload.user : u)),
          );
          toast({
            title: "Thành công",
            description: "Sửa user mượt như bơ! 😎",
          });
        } else {
          throw new Error("Sửa user thất bại");
        }
      } else {
        const res = await apiAuth.createUser(formData);
        if (res.status === 201) {
          setUsers((prev) => [...prev, res.payload.user]);
          toast({
            title: "Thành công",
            description: "Thêm user mới nhanh hơn ánh sáng! 🚀",
          });
        } else {
          throw new Error("Thêm user thất bại");
        }
      }
      setIsOpen(false);
      setFormData({ name: "", email: "", password: "", role: "user" });
      setSelectedUser(null);
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.response?.data?.error || "Không thể xử lý user!",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedUser?._id) return;
    try {
      const res = await apiAuth.deleteUser(selectedUser._id);
      if (res.status === 200) {
        setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
        setIsOpen(false);
        setSelectedUser(null);
        toast({
          title: "Thành công",
          description: "Xóa user nhanh như một cơn gió! 🌪️",
        });
      } else {
        throw new Error("Xóa user thất bại");
      }
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.response?.data?.error || "Không thể xóa user!",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="w-full sm:w-96">
        <DrawerHeader>
          <DrawerTitle>
            {selectedUser?._id ? "Sửa người dùng" : "Thêm người dùng mới"}
          </DrawerTitle>
          <DrawerDescription>
            {selectedUser?._id
              ? "Cập nhật thông tin người dùng."
              : "Nhập thông tin để tạo người dùng mới."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 p-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Họ tên
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
          {!selectedUser?._id && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Vai trò
            </Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "user" | "admin",
                })
              }
              className="col-span-3 border rounded-md p-2"
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
        </div>
        <DrawerFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              {selectedUser?._id ? "Lưu" : "Thêm"}
            </Button>
          </div>
          {selectedUser?._id && (
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
