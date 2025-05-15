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
import OrderDrawer from "./OrderDrawer";
import { apiOrders, IOrder } from "@/app/fetch/fetch.order";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    buyerAddress: "",
    amount: 0,
    status: "pending" as "pending" | "completed" | "cancelled",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiOrders.getAll();
        if (response && response?.data) {
          setOrders(response.data);
        } else {
          throw new Error("Không lấy được danh sách đơn hàng");
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", err);
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  const openOrderDrawer = (order?: IOrder) => {
    if (order) {
      setSelectedOrder(order);
      setFormData({
        buyerName: order.buyerName || "",
        buyerEmail: order.buyerEmail || "",
        buyerPhone: order.buyerPhone || "",
        buyerAddress: order.buyerAddress || "",
        amount: order.amount || 0,
        status: order.status || "pending",
      });
    } else {
      setSelectedOrder(null);
      setFormData({
        buyerName: "",
        buyerEmail: "",
        buyerPhone: "",
        buyerAddress: "",
        amount: 0,
        status: "pending",
      });
    }
    setIsOrderDrawerOpen(true);
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " VNĐ";
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
                <CardTitle>Danh sách đơn hàng</CardTitle>
                <CardDescription>
                  Quản lý thông tin đơn hàng trên hệ thống
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Chưa có đơn hàng nào. Thêm ngay!
                </p>
                <Button className="mt-4" onClick={() => openOrderDrawer()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm đơn hàng
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Tên người mua</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          {order.orderCode || "N/A"}
                        </TableCell>
                        <TableCell>{order.buyerName || "N/A"}</TableCell>
                        <TableCell>{order.buyerEmail || "N/A"}</TableCell>
                        <TableCell>{formatAmount(order.amount)}</TableCell>
                        <TableCell>
                          {order.status === "pending"
                            ? "Đang chờ"
                            : order.status === "completed"
                              ? "Hoàn thành"
                              : "Đã hủy"}
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openOrderDrawer(order)}
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Sửa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openOrderDrawer(order)}
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
      {/* Drawer xử lý đơn hàng (create/update/delete) */}
      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        setIsOpen={setIsOrderDrawerOpen}
        setOrders={setOrders}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
