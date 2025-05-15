"use client";

import { useState, useEffect, useCallback } from "react";
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
import DonationDrawer from "./DonationDrawer";
import { apiDonation, IDonation } from "@/app/fetch/fetch.donation";
import { useToast } from "@/hooks/use-toast";

export default function AdminDonationsPage() {
    const [donations, setDonations] = useState<IDonation[]>([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [contributorCount, setContributorCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDonationDrawerOpen, setIsDonationDrawerOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<IDonation | null>(null);
    const { toast } = useToast();

    const fetchDonations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiDonation.getInfor();
            if (response?.data) {
                const { donations, totalQuantity, contributorCount } = response.data
                setDonations(donations);
                setTotalQuantity(totalQuantity);
                setContributorCount(contributorCount);
            } else {
                throw new Error("Không lấy được danh sách đóng góp");
            }
        } catch (err: any) {
            console.error("Lỗi khi lấy dữ liệu đóng góp:", err);
            setError("Không thể tải danh sách đóng góp. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDonations();
    }, [fetchDonations]);

    const openDonationDrawer = (donationItem?: IDonation) => {
        setSelectedDonation(donationItem || null);
        setIsDonationDrawerOpen(true);
    };

    const formatDate = (dateString: Date | string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
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
                <Button onClick={fetchDonations} className="mt-4">
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
                                <CardTitle>Danh sách đóng góp</CardTitle>
                                <CardDescription>
                                    Quản lý thông tin đóng góp trồng cây xanh trên hệ thống
                                    <div className="mt-2 text-sm text-gray-600">
                                        Tổng số cây: {totalQuantity} | Số người đóng góp: {contributorCount}
                                    </div>
                                </CardDescription>
                            </div>
                            <Button onClick={() => openDonationDrawer()}>
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm đóng góp
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {donations.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Chưa có đóng góp nào. Thêm ngay!</p>
                                <Button className="mt-4" onClick={() => openDonationDrawer()}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm đóng góp
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Họ tên</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Số điện thoại</TableHead>
                                            <TableHead>Số cây</TableHead>
                                            <TableHead>Tổng tiền</TableHead>
                                            <TableHead>Ngân hàng</TableHead>
                                            <TableHead>Ngày tạo</TableHead>
                                            <TableHead>Hành động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {donations.map((donationItem) => (
                                            <TableRow
                                                key={donationItem._id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <TableCell
                                                    className="font-medium max-w-xs truncate"
                                                    title={donationItem.name}
                                                >
                                                    {donationItem.name || "N/A"}
                                                </TableCell>
                                                <TableCell>{donationItem.email || "N/A"}</TableCell>
                                                <TableCell>{donationItem.phone || "N/A"}</TableCell>
                                                <TableCell>{donationItem.quantity || "N/A"}</TableCell>
                                                <TableCell>
                                                    {donationItem.totalAmount
                                                        ? formatCurrency(donationItem.totalAmount)
                                                        : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {donationItem.bankInfo?.bank || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {donationItem.createdAt
                                                        ? formatDate(donationItem.createdAt)
                                                        : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                            onClick={() => openDonationDrawer(donationItem)}
                                                            title="Sửa đóng góp"
                                                        >
                                                            <Pencil className="w-4 h-4 mr-1" />
                                                            Sửa
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                                            onClick={async () => {
                                                                try {
                                                                    await apiDonation.deleteDonation(donationItem._id!);
                                                                    setDonations((prev) =>
                                                                        prev.filter((d) => d._id !== donationItem._id),
                                                                    );
                                                                    toast({
                                                                        title: "Thành công",
                                                                        description: "Xóa đóng góp thành công! 🗑️",
                                                                    });
                                                                    fetchDonations(); // Refresh to update stats
                                                                } catch (err: any) {
                                                                    toast({
                                                                        title: "Lỗi",
                                                                        description: "Không thể xóa đóng góp! 😵",
                                                                        variant: "destructive",
                                                                    });
                                                                }
                                                            }}
                                                            title="Xóa đóng góp"
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
            <DonationDrawer
                isOpen={isDonationDrawerOpen}
                setIsOpen={setIsDonationDrawerOpen}
                setDonations={setDonations}
                selectedDonation={selectedDonation}
                setSelectedDonation={setSelectedDonation}
                onSuccess={fetchDonations}
            />
        </div>
    );
}