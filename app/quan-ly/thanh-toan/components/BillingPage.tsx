"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import {
    CreditCard,
    Download,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText,
    DollarSign,
    Receipt,
    Plus,
    Wallet,
    Building,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import {
    subscriptions as initialSubscriptions,
    invoices as initialInvoices,
    paymentMethods as initialPaymentMethods,
} from "@/app/mockup/bill.mockup";


import { Subscriptions } from "./subscriptions";
import { PaymentMethods } from "./payments";
import { Invoices } from "./invoices";
import { PaymentMethods } from "./payments";
export interface Invoice {
    id: string;
    number: string;
    date: string;
    dueDate: string;
    amount: string;
    status: "paid" | "pending" | "overdue" | "draft";
    items: { name: string; quantity: number; price: string }[];
}

export interface PaymentMethod {
    id: string;
    type: "credit_card" | "bank_transfer" | "paypal";
    name: string;
    last4?: string;
    expiryDate?: string;
    isDefault: boolean;
}

export interface Subscription {
    id: string;
    name: string;
    status: "active" | "canceled" | "expired";
    startDate: string;
    endDate: string;
    amount: string;
    billingCycle: "monthly" | "quarterly" | "annually";
    autoRenew: boolean;
}

export default function BillingPage() {
    const { user } = useAuth(); // isAuthenticated không được dùng trong JSX nên có thể bỏ nếu không cần
    const router = useRouter();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("overview");
    const searchParams = useSearchParams();

    const [currentInvoices, setCurrentInvoices] = useState<Invoice[]>(initialInvoices);
    const [currentSubscriptions, setCurrentSubscriptions] = useState<Subscription[]>(initialSubscriptions);
    const [currentPaymentMethods, setCurrentPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
    const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getInvoiceStatusBadge = (status: Invoice["status"]) => {
        switch (status) {
            case "paid":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Đã thanh toán
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Đang chờ
                    </Badge>
                );
            case "overdue":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Quá hạn
                    </Badge>
                );
            case "draft":
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center">
                        Bản nháp
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                        {status}
                    </Badge>
                );
        }
    };

    const getSubscriptionStatusBadge = (status: Subscription["status"]) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Đang hoạt động
                    </Badge>
                );
            case "canceled":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center">
                        Đã hủy
                    </Badge>
                );
            case "expired":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center">
                        Hết hạn
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                        {status}
                    </Badge>
                );
        }
    };

    const getPaymentMethodIcon = (type: PaymentMethod["type"]) => {
        switch (type) {
            case "credit_card":
                return <CreditCard className="w-5 h-5 text-blue-600" />;
            case "bank_transfer":
                return <Building className="w-5 h-5 text-green-600" />;
            case "paypal":
                return <Wallet className="w-5 h-5 text-purple-600" />;
            default:
                return <CreditCard className="w-5 h-5 text-gray-600" />;
        }
    };

    const getBillingCycleName = (cycle: Subscription["billingCycle"]) => {
        switch (cycle) {
            case "monthly":
                return "Hàng tháng";
            case "quarterly":
                return "Hàng quý";
            case "annually":
                return "Hàng năm";
            default:
                return cycle;
        }
    };

    const handleSubmitBillingInfo = (e: React.FormEvent, billingInfo: any) => {
        e.preventDefault();
        toast({ title: "Thông báo", description: "Thông tin thanh toán đã được cập nhật!" });
    };

    const handleAddPaymentMethod = (newMethodData: Omit<PaymentMethod, "id" | "isDefault">) => {
        const newId = `pm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newPaymentMethod: PaymentMethod = {
            ...newMethodData,
            id: newId,
            isDefault: currentPaymentMethods.length === 0,
        };
        setCurrentPaymentMethods((prevMethods) => [...prevMethods, newPaymentMethod]);
        toast({ title: "Thành công", description: "Đã thêm phương thức thanh toán mới!" });
    };


    return (
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Thanh toán</h1>
                    <p className="text-gray-500 mt-1">
                        Quản lý hóa đơn, đăng ký và phương thức thanh toán của bạn.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => setActiveTab("invoices")}>
                        <Receipt className="w-4 h-4 mr-2" />
                        Xem tất cả hóa đơn
                    </Button>
                    <Button onClick={() => setIsAddPaymentModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm phương thức thanh toán
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Tổng chi tiêu</CardTitle>
                        <DollarSign className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">10.100.000 đ</div>
                        <p className="text-xs text-gray-500">+2.500.000 đ so với tháng trước</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Đăng ký đang hoạt động</CardTitle>
                        <Calendar className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {currentSubscriptions.filter((s) => s.status === "active").length}
                        </div>
                        <p className="text-xs text-gray-500">Tổng số các gói đang dùng</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Hóa đơn chưa thanh toán</CardTitle>
                        <Clock className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {currentInvoices.filter((i) => i.status === "pending" || i.status === "overdue").length}
                        </div>
                        <p className="text-xs text-gray-500">Tổng số hóa đơn cần xử lý</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Phương thức thanh toán</CardTitle>
                        <CreditCard className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentPaymentMethods.length}</div>
                        <p className="text-xs text-gray-500">Số lượng phương thức đã lưu</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="invoices">Hóa đơn</TabsTrigger>
                    <TabsTrigger value="subscriptions">Đăng ký</TabsTrigger>
                    <TabsTrigger value="payment_methods">Phương thức thanh toán</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Overview
                        user={user}
                        invoices={currentInvoices}
                        subscriptions={currentSubscriptions}
                        paymentMethods={currentPaymentMethods}
                        setActiveTab={setActiveTab}
                        formatDate={formatDate}
                        getInvoiceStatusBadge={getInvoiceStatusBadge}
                        getSubscriptionStatusBadge={getSubscriptionStatusBadge}
                        getPaymentMethodIcon={getPaymentMethodIcon}
                        getBillingCycleName={getBillingCycleName}
                        handleSubmitBillingInfo={handleSubmitBillingInfo}
                    />
                </TabsContent>
                <TabsContent value="invoices">
                    <Invoices
                        invoices={currentInvoices}
                        formatDate={formatDate}
                        getInvoiceStatusBadge={getInvoiceStatusBadge}
                    />
                </TabsContent>
                <TabsContent value="subscriptions">
                    <Subscriptions
                        subscriptions={currentSubscriptions}
                        formatDate={formatDate}
                        getSubscriptionStatusBadge={getSubscriptionStatusBadge}
                        getBillingCycleName={getBillingCycleName}
                        router={router}
                    />
                </TabsContent>
                <TabsContent value="payment_methods">
                    <PaymentMethods
                        paymentMethods={currentPaymentMethods}
                        getPaymentMethodIcon={getPaymentMethodIcon}
                        onSetDefault={(methodId) => {
                            setCurrentPaymentMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === methodId })))
                            toast({ title: "Thông báo", description: "Đã đặt phương thức thanh toán mặc định." })
                        }}
                        onDelete={(methodId) => {
                            setCurrentPaymentMethods(prev => prev.filter(m => m.id !== methodId))
                            toast({ title: "Thông báo", description: "Đá xoá phương thức thanh toán." })
                        }}
                    />
                </TabsContent>
            </Tabs>
            <AddPaymentMethodModal
                isOpen={isAddPaymentModalOpen}
                onOpenChange={setIsAddPaymentModalOpen}
                onSubmit={handleAddPaymentMethod}
            />
        </div>
    );
}