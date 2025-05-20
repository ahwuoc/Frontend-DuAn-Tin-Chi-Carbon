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
import { CheckCircle2, XCircle, Trash2, Eye } from "lucide-react";
import { apiAffiliates, IAffiliate } from "@/app/fetch/fetch.affiliate";
import { useToast } from "@/hooks/use-toast";
import { formatDateUtil, formatNumberUtil } from "@/app/utils/common";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminAffiliatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [affiliates, setAffiliates] = useState<IAffiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAffiliateForView, setSelectedAffiliateForView] =
    useState<IAffiliate | null>(null);

  useEffect(() => {
    const fetchAffiliates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiAffiliates.getAll();
        if (response && response?.payload) {
          setAffiliates(response.payload.affiliates);
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

  const handleDeleteAffiliate = async (affiliateId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa affiliate này không?")) {
      return;
    }
    try {
      await apiAffiliates.delete(affiliateId);
      setAffiliates((prev) => prev.filter((aff) => aff._id !== affiliateId));
      toast({
        title: "Thành công",
        description: "Đã xóa affiliate thành công.",
      });
    } catch (error) {
      console.error("Lỗi khi xóa affiliate:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa affiliate. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAffiliateStatus = async (
    affiliateId: string,
    newStatus: "pending" | "approved" | "rejected",
  ) => {
    try {
      const updatedAffiliate = await apiAffiliates.update(affiliateId, {
        status: newStatus,
      });
      if (updatedAffiliate && updatedAffiliate?.payload?.affiliate) {
        setAffiliates((prev) =>
          prev.map((aff) =>
            aff._id === affiliateId ? updatedAffiliate.payload.affiliate : aff,
          ),
        );
        toast({
          title: "Thành công",
          description: `Đã cập nhật trạng thái thành "${
            newStatus === "approved"
              ? "Đã duyệt"
              : newStatus === "rejected"
                ? "Bị từ chối"
                : "Đang chờ"
          }".`,
        });
      } else {
        throw new Error("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái affiliate:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const openViewModal = (affiliate: IAffiliate) => {
    setSelectedAffiliateForView(affiliate);
    setIsViewModalOpen(true);
  };

  const statusDisplayMap: Record<"pending" | "approved" | "rejected", string> =
    {
      pending: "Đang chờ",
      approved: "Đã duyệt",
      rejected: "Bị từ chối",
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
            </div>
          </CardHeader>
          <CardContent>
            {affiliates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có affiliate nào.</p>
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
                    {affiliates.map((affiliate) => (
                      <TableRow key={affiliate._id}>
                        <TableCell className="font-medium">
                          {affiliate?.fullName || "N/A"}
                        </TableCell>
                        <TableCell>{affiliate?.email || "N/A"}</TableCell>
                        <TableCell>{affiliate?.company || "N/A"}</TableCell>
                        <TableCell>
                          {formatNumberUtil(affiliate?.totalCommission ?? 0)}
                        </TableCell>
                        <TableCell>
                          {affiliate?.status
                            ? statusDisplayMap[affiliate.status]
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {formatDateUtil(affiliate?.createdAt || "")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {/* Nút Xem chi tiết */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openViewModal(affiliate)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            {/* Nút Duyệt: chỉ hiển thị nếu trạng thái KHÔNG phải là "approved" */}
                            {affiliate.status !== "approved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateAffiliateStatus(
                                    affiliate._id!,
                                    "approved",
                                  )
                                }
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Duyệt
                              </Button>
                            )}

                            {/* Nút Từ chối: chỉ hiển thị nếu trạng thái KHÔNG phải là "rejected" */}
                            {affiliate.status !== "rejected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateAffiliateStatus(
                                    affiliate._id!,
                                    "rejected",
                                  )
                                }
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Từ chối
                              </Button>
                            )}

                            {/* Nút Xóa luôn hiển thị */}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteAffiliate(affiliate._id!)
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

      {/* Modal xem chi tiết Affiliate */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chi tiết Affiliate</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết của affiliate.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedAffiliateForView ? (
              <>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="view-fullName" className="text-right">
                    Họ tên:
                  </Label>
                  <span id="view-fullName" className="col-span-2">
                    {selectedAffiliateForView.fullName || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="view-email" className="text-right">
                    Email:
                  </Label>
                  <span id="view-email" className="col-span-2">
                    {selectedAffiliateForView.email || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="view-phone" className="text-right">
                    Điện thoại:
                  </Label>
                  <span id="view-phone" className="col-span-2">
                    {selectedAffiliateForView.phone || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="view-company" className="text-right">
                    Công ty:
                  </Label>
                  <span id="view-company" className="col-span-2">
                    {selectedAffiliateForView.company || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="view-reason" className="text-right">
                    Lý do đăng ký:
                  </Label>
                  <span id="view-reason" className="col-span-2">
                    {selectedAffiliateForView.reason || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="view-referralCode" className="text-right">
                    Mã giới thiệu:
                  </Label>
                  <span id="view-referralCode" className="col-span-2">
                    {selectedAffiliateForView.referralCode || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="view-totalCommission" className="text-right">
                    Tổng hoa hồng:
                  </Label>
                  <span id="view-totalCommission" className="col-span-2">
                    {formatNumberUtil(
                      selectedAffiliateForView.totalCommission ?? 0,
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="view-status" className="text-right">
                    Trạng thái:
                  </Label>
                  <span id="view-status" className="col-span-2">
                    {selectedAffiliateForView.status
                      ? statusDisplayMap[selectedAffiliateForView.status]
                      : "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="view-createdAt" className="text-right">
                    Ngày tạo:
                  </Label>
                  <span id="view-createdAt" className="col-span-2">
                    {formatDateUtil(selectedAffiliateForView.createdAt || "")}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">
                Không có thông tin để hiển thị.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
