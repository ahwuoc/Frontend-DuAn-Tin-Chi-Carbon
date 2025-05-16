import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { IAffiliatePaymentMethod, IAffiliateDetail } from "../type";

const PaymentMethods = ({
    paymentMethods,
    getPaymentMethodIcon,
    onSetDefault,
    onDelete,
    onAddPaymentMethod,
}: {
    paymentMethods: IAffiliatePaymentMethod[];
    getPaymentMethodIcon: (type: string) => React.ReactNode;
    onSetDefault: (methodId: string) => void;
    onDelete: (methodId: string) => void;
    onAddPaymentMethod?: (method: IAffiliatePaymentMethod) => void;
}) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: "bank_transfer" as "bank_transfer" | "paypal" | "other",
        name: "",
        bankName: "",
        accountNumber: "",
        accountHolder: "",
        swiftCode: "",
        paypalEmail: "",
        otherDescription: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleOpenForm = () => setIsFormOpen(true);

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setFormData({
            type: "bank_transfer",
            name: "",
            bankName: "",
            accountNumber: "",
            accountHolder: "",
            swiftCode: "",
            paypalEmail: "",
            otherDescription: "",
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name) newErrors.name = "Tên phương thức là bắt buộc";
        if (formData.type === "bank_transfer") {
            if (!formData.bankName) newErrors.bankName = "Tên ngân hàng là bắt buộc";
            if (!formData.accountNumber) newErrors.accountNumber = "Số tài khoản là bắt buộc";
            if (!formData.accountHolder) newErrors.accountHolder = "Chủ tài khoản là bắt buộc";
        } else if (formData.type === "paypal") {
            if (!formData.paypalEmail || !/\S+@\S+\.\S+/.test(formData.paypalEmail))
                newErrors.paypalEmail = "Email PayPal không hợp lệ";
        } else if (formData.type === "other") {
            if (!formData.otherDescription) newErrors.otherDescription = "Mô tả là bắt buộc";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const newMethod: IAffiliatePaymentMethod = {
            id: `temp-${Date.now()}`,
            affiliateId: "",
            type: formData.type,
            name: formData.name,
            details:
                formData.type === "bank_transfer"
                    ? {
                        bankName: formData.bankName,
                        accountNumber: formData.accountNumber,
                        accountHolder: formData.accountHolder,
                        swiftCode: formData.swiftCode || "",
                    }
                    : formData.type === "paypal"
                        ? { email: formData.paypalEmail }
                        : { description: formData.otherDescription },
            isDefault: paymentMethods.length === 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        onAddPaymentMethod?.(newMethod);
        handleCloseForm();
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Phương thức thanh toán</CardTitle>
                {onAddPaymentMethod && (
                    <Button size="sm" onClick={handleOpenForm}>
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm mới
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {paymentMethods && paymentMethods.length > 0 ? (
                        paymentMethods.map((method) => (
                            <div key={method.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                        {getPaymentMethodIcon(method.type)}
                                        <div className="ml-3">
                                            <h4 className="font-medium">{method.name || method.type}</h4>
                                            {method.type === "bank_transfer" && method.details && (
                                                <div className="text-sm text-gray-500">
                                                    <p>Ngân hàng: {(method.details as IAffiliateDetail).bankName}</p>
                                                    <p>Số tài khoản: {(method.details as IAffiliateDetail).accountNumber}</p>
                                                    <p>Chủ tài khoản: {(method.details as IAffiliateDetail).accountHolder}</p>
                                                    {(method.details as IAffiliateDetail).swiftCode && (
                                                        <p>Swift Code: {(method.details as IAffiliateDetail).swiftCode}</p>
                                                    )}
                                                </div>
                                            )}
                                            {method.type === "paypal" && method.details && (
                                                <p className="text-sm text-gray-500">
                                                    Email: {(method.details as { email: string }).email}
                                                </p>
                                            )}
                                            {method.type === "other" && method.details && (
                                                <p className="text-sm text-gray-500">
                                                    Mô tả: {(method.details as { description: string }).description}
                                                </p>
                                            )}
                                            {method.isDefault && (
                                                <Badge variant="outline" className="mt-1">
                                                    Mặc định
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!method.isDefault && onSetDefault && (
                                            <Button variant="outline" size="sm" onClick={() => onSetDefault(method.id)}>
                                                Đặt làm mặc định
                                            </Button>
                                        )}
                                        {onDelete && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => onDelete(method.id)}
                                            >
                                                Xóa
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500 border rounded-lg">
                            Bạn chưa có phương thức thanh toán nào được lưu.
                        </div>
                    )}
                </div>
            </CardContent>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm phương thức thanh toán mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Loại phương thức</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, type: value as "bank_transfer" | "paypal" | "other" })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại phương thức" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank_transfer">Chuyển khoản ngân hàng</SelectItem>
                                    <SelectItem value="paypal">PayPal</SelectItem>
                                    <SelectItem value="other">Khác</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Tên phương thức</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ví dụ: Tài khoản Vietcombank, PayPal cá nhân"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
                        {formData.type === "bank_transfer" ? (
                            <>
                                <div>
                                    <Label>Tên ngân hàng</Label>
                                    <Input
                                        value={formData.bankName}
                                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                        placeholder="Ví dụ: Vietcombank"
                                    />
                                    {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
                                </div>
                                <div>
                                    <Label>Số tài khoản</Label>
                                    <Input
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                        placeholder="Ví dụ: 123456789"
                                    />
                                    {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}
                                </div>
                                <div>
                                    <Label>Chủ tài khoản</Label>
                                    <Input
                                        value={formData.accountHolder}
                                        onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                                        placeholder="Ví dụ: Nguyen Van A"
                                    />
                                    {errors.accountHolder && <p className="text-red-500 text-sm">{errors.accountHolder}</p>}
                                </div>
                                <div>
                                    <Label>Swift Code (không bắt buộc)</Label>
                                    <Input
                                        value={formData.swiftCode}
                                        onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                                        placeholder="Ví dụ: VCBVVNVX"
                                    />
                                </div>
                            </>
                        ) : formData.type === "paypal" ? (
                            <div>
                                <Label>Email PayPal</Label>
                                <Input
                                    value={formData.paypalEmail}
                                    onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                                    placeholder="Ví dụ: user@example.com"
                                />
                                {errors.paypalEmail && <p className="text-red-500 text-sm">{errors.paypalEmail}</p>}
                            </div>
                        ) : (
                            <div>
                                <Label>Mô tả</Label>
                                <Input
                                    value={formData.otherDescription}
                                    onChange={(e) => setFormData({ ...formData, otherDescription: e.target.value })}
                                    placeholder="Ví dụ: Tiền mặt hoặc ví điện tử khác"
                                />
                                {errors.otherDescription && <p className="text-red-500 text-sm">{errors.otherDescription}</p>}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseForm}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default PaymentMethods;