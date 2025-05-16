"use client";

import { useState, useEffect } from "react";
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
import { apiDonation, IDonation } from "@/app/fetch/fetch.donation";

interface DonationDrawerProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    setDonations: React.Dispatch<React.SetStateAction<IDonation[]>>;
    selectedDonation: IDonation | null;
    setSelectedDonation: React.Dispatch<React.SetStateAction<IDonation | null>>;
    onSuccess: () => Promise<void>;
}

export default function DonationDrawer({
    isOpen,
    setIsOpen,
    setDonations,
    selectedDonation,
    setSelectedDonation,
    onSuccess,
}: DonationDrawerProps) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: selectedDonation?.name || "",
        email: selectedDonation?.email || "",
        phone: selectedDonation?.phone || "",
        quantity: selectedDonation?.quantity || 1,
        note: selectedDonation?.note || "",
        totalAmount: selectedDonation?.totalAmount || 0,
        bankInfo: {
            accountName: selectedDonation?.bankInfo?.accountName || "",
            accountNumber: selectedDonation?.bankInfo?.accountNumber || "",
            bank: selectedDonation?.bankInfo?.bank || "",
            branch: selectedDonation?.bankInfo?.branch || "",
            content: selectedDonation?.bankInfo?.content || "",
        },
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedDonation) {
            setFormData({
                name: selectedDonation.name,
                email: selectedDonation.email,
                phone: selectedDonation.phone,
                quantity: selectedDonation.quantity,
                note: selectedDonation.note || "",
                totalAmount: selectedDonation.totalAmount,
                bankInfo: {
                    accountName: selectedDonation.bankInfo.accountName,
                    accountNumber: selectedDonation.bankInfo.accountNumber,
                    bank: selectedDonation.bankInfo.bank,
                    branch: selectedDonation.bankInfo.branch,
                    content: selectedDonation.bankInfo.content,
                },
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                quantity: 1,
                note: "",
                totalAmount: 0,
                bankInfo: {
                    accountName: "",
                    accountNumber: "",
                    bank: "sdsd",
                    branch: "",
                    content: "",
                },
            });
        }
    }, [selectedDonation]);

    const handleSubmit = async () => {
        if (
            !formData.name ||
            !formData.email ||
            !formData.phone ||
            !formData.quantity ||
            !formData.totalAmount ||
            !formData.bankInfo.accountName ||
            !formData.bankInfo.accountNumber ||
            !formData.bankInfo.bank ||
            !formData.bankInfo.branch ||
            !formData.bankInfo.content
        ) {
            toast({
                title: "Lỗi",
                description: "Vui lòng điền đầy đủ thông tin bắt buộc!",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData };
            if (selectedDonation?._id) {
                const res = await apiDonation.updateDonation(selectedDonation._id, payload);
                if (res?.data) {
                    const updated = res.data as IDonation;
                    setDonations((prev: any[]) =>
                        Array.isArray(prev)
                            ? prev.map((d) => (d._id === selectedDonation._id ? res.data : d))
                            : prev
                    );
                    toast({
                        title: "Thành công",
                        description: "Cập nhật thông tin đóng góp thành công!",
                    });
                } else {
                    throw new Error("Cập nhật thông tin đóng góp thất bại");
                }
            } else {
                const res = await apiDonation.addDonate(payload);
                if (res?.data) {
                    setDonations((prev) => [...prev, res.data.savedDonation]);
                    toast({
                        title: "Thành công",
                        description: "Thêm thông tin đóng góp mới thành công!",
                    });
                } else {
                    throw new Error("Thêm thông tin đóng góp thất bại");
                }
            }
            setIsOpen(false);
            setSelectedDonation(null);
        } catch (err: any) {
            console.error("Lỗi khi xử lý thông tin đóng góp:", err);
            toast({
                title: "Lỗi",
                description: err.message || "Không thể xử lý thông tin đóng góp!",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent className="w-full sm:w-96">
                <DrawerHeader>
                    <DrawerTitle>
                        {selectedDonation?._id ? "Sửa thông tin đóng góp" : "Thêm đóng góp mới"}
                    </DrawerTitle>
                    <DrawerDescription>
                        {selectedDonation?._id
                            ? "Cập nhật thông tin đóng góp trồng cây xanh."
                            : "Nhập thông tin để tạo mới đóng góp trồng cây xanh."}
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
                            required
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
                            required
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
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                            Số lượng cây
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={formData.quantity}
                            onChange={(e) =>
                                setFormData({ ...formData, quantity: parseInt(e.target.value) })
                            }
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="totalAmount" className="text-right">
                            Tổng tiền (VND)
                        </Label>
                        <Input
                            id="totalAmount"
                            type="number"
                            min="0"
                            value={formData.totalAmount}
                            onChange={(e) =>
                                setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })
                            }
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="note" className="text-right">
                            Ghi chú
                        </Label>
                        <Textarea
                            id="note"
                            value={formData.note}
                            onChange={(e) =>
                                setFormData({ ...formData, note: e.target.value })
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="accountName" className="text-right">
                            Tên tài khoản
                        </Label>
                        <Input
                            id="accountName"
                            value={formData.bankInfo.accountName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bankInfo: { ...formData.bankInfo, accountName: e.target.value },
                                })
                            }
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="accountNumber" className="text-right">
                            Số tài khoản
                        </Label>
                        <Input
                            id="accountNumber"
                            value={formData.bankInfo.accountNumber}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bankInfo: { ...formData.bankInfo, accountNumber: e.target.value },
                                })
                            }
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bank" className="text-right">
                            Ngân hàng
                        </Label>
                        <Input
                            id="bank"
                            value={formData.bankInfo.bank}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bankInfo: { ...formData.bankInfo, bank: e.target.value },
                                })
                            }
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="branch" className="text-right">
                            Chi nhánh
                        </Label>
                        <Input
                            id="branch"
                            value={formData.bankInfo.branch}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bankInfo: { ...formData.bankInfo, branch: e.target.value },
                                })
                            }
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="content" className="text-right">
                            Nội dung chuyển khoản
                        </Label>
                        <Input
                            id="content"
                            value={formData.bankInfo.content}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bankInfo: { ...formData.bankInfo, content: e.target.value },
                                })
                            }
                            className="col-span-3"
                            required
                        />
                    </div>
                </div>
                <DrawerFooter className="flex justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading
                                ? "Đang xử lý..."
                                : selectedDonation?._id
                                    ? "Lưu"
                                    : "Thêm"}
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}