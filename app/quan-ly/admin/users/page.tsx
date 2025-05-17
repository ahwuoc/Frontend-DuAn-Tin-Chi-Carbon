"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import apiAuth, { TUser } from "@/app/fetch/fetch.auth";
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
import DashboardSidebar from "@/components/dashboard/sidebar";
import UserDrawer from "./UserDrawer";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiAuth.getAll();
        if (res && res.data) {
          setUsers(res.data.data);
        } else {
          throw new Error("Không lấy được danh sách người dùng");
        }
      } catch (err) {
        setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router, user]);

  const openUserDrawer = (user?: TUser) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
      });
    } else {
      setSelectedUser(null);
      setFormData({ name: "", email: "", password: "", role: "user" });
    }
    setIsUserDrawerOpen(true);
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
                <CardTitle>Danh sách người dùng</CardTitle>
                <CardDescription>
                  Quản lý thông tin người dùng trên hệ thống
                </CardDescription>
              </div>
              <Button onClick={() => openUserDrawer()}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm người dùng
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Chưa có người dùng nào. Thêm ngay!
                </p>
                <Button className="mt-4" onClick={() => openUserDrawer()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm người dùng
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {user.name || "N/A"}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.role === "admin"
                            ? "Quản trị viên"
                            : "Người dùng"}
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openUserDrawer(user)}
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Sửa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openUserDrawer(user)}
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
      {/* Drawer xử lý user (create/update/delete) */}
      <UserDrawer
        isOpen={isUserDrawerOpen}
        setIsOpen={setIsUserDrawerOpen}
        setUsers={setUsers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
