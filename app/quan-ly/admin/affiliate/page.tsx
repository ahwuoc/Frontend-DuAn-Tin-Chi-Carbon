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
import AffiliateDrawer from "./AffiliateDrawer";
import { apiAffiliates, IAffiliate } from "@/app/fetch/fetch.affiliate";

export default function AdminAffiliatesPage() {
  const router = useRouter();
  const [affiliates, setAffiliates] = useState<IAffiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAffiliateDrawerOpen, setIsAffiliateDrawerOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<IAffiliate | null>(
    null
  );

  useEffect(() => {
    const fetchAffiliates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiAffiliates.getAll();
        if (response && response?.data) {
          setAffiliates(response.data.affiliates);
        } else {
          throw new Error("Không lấy được danh sách affiliates");
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu affiliates:", err);
        setError("Không thể tải danh sách affiliates. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchAffiliates();
  }, [router]);

  const openAffiliateDrawer = (affiliate?: IAffiliate) => {
    setSelectedAffiliate(affiliate || null);
    setIsAffiliateDrawerOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCommission = (commission: number) => {
    return commission.toLocaleString("vi-VN") + " VNĐ";
  };

  const handleDeleteAffiliate = async (affiliateId: string) => {
    try {
      await apiAffiliates.delete(affiliateId);
      setAffiliates((prev) => prev.filter((aff) => aff._id !== affiliateId));
    } catch (error) {
      console.error("Lỗi khi xóa affiliate:", error);
    }
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
      <div className="flex-1 p-4 md:p-8">
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Danh sách Affiliates</CardTitle>
                <CardDescription>
                  Quản lý thông tin affiliates trên hệ thống
                </CardDescription>
              </div>
              <Button onClick={() => openAffiliateDrawer()}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm Affiliate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {affiliates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có affiliate nào. Thêm ngay!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Công ty</TableHead>
                      <TableHead>Tổng hoa hồng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliates && affiliates.map((affiliate) => (
                      <TableRow key={affiliate._id}>
                        <TableCell className="font-medium">
                          {affiliate.fullName || "N/A"}
                        </TableCell>
                        <TableCell>{affiliate.email || "N/A"}</TableCell>
                        <TableCell>{affiliate.company || "N/A"}</TableCell>
                        <TableCell>{formatCommission(affiliate.totalCommission)}</TableCell>
                        <TableCell>
                          {affiliate.status === "pending"
                            ? "Đang chờ"
                            : affiliate.status === "approved"
                              ? "Đã duyệt"
                              : "Bị từ chối"}
                        </TableCell>
                        <TableCell>{formatDate(affiliate.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAffiliateDrawer(affiliate)}
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Sửa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAffiliate(affiliate._id)}
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
      <AffiliateDrawer
        isOpen={isAffiliateDrawerOpen}
        setIsOpen={setIsAffiliateDrawerOpen}
        setAffiliates={setAffiliates}
        selectedAffiliate={selectedAffiliate}
        setSelectedAffiliate={setSelectedAffiliate}
      />
    </div>
  );
}
