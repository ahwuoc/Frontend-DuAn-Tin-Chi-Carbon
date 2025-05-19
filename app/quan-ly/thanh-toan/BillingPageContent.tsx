// components/BillingPageContent.tsx hoặc một nơi nào đó phù hợp

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Calendar, Clock, CreditCard, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { Invoice, Subscription, IAffiliatePaymentMethod } from "./type";
import PaymentMethods from "./components/PaymentMethods";
import Subscriptions from "./components/Subscriptions";
import Invoices from "./components/Invoices";
import Overview from "./components/Overview";
import { formatDate, getInvoiceStatusBadge, getSubscriptionStatusBadge, getPaymentMethodIcon, getBillingCycleName } from "./utils/billing";
import { apiPayMethod } from "../../fetch/fetch.payment-method";
import { apiOrders } from "../../fetch/fetch.order";
import { IOrder } from "../../fetch/fetch.order";
interface IResponseInfor {
    totalOrders: number,
    totalAmount: number,
    totalPendingOrders: number,
    totalSuccessOrders: number,
    totalPendingAmount: number,
    totalSuccessAmount: number,
    pendingOrders: any[];
    successOrders: any[];
}
const BillingPageContent = () => {
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("overview");

    const [currentInvoices, setCurrentInvoices] = useState<Invoice[]>([]);
    const [currentSubscriptions, setCurrentSubscriptions] = useState<Subscription[]>([]);
    const [currentPaymentMethods, setCurrentPaymentMethods] = useState<IAffiliatePaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingPaymentMethod, setIsUpdatingPaymentMethod] = useState(false);
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [info, setInfo] = useState({
        totalOrders: 0,
        totalAmount: 0,
        totalPendingOrders: 0,
        totalSuccessOrders: 0,
        totalPendingAmount: 0,
        totalSuccessAmount: 0,
        pendingOrders: [],
        successOrders: [],
    });
    const [totalAmount, setToTotal] = useState<number>(0);
    const { user } = useAuth();
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.userId) return;
            const response = await apiOrders.getInforOrderByUserId<IResponseInfor>(user?.userId)
            if (response && response.payload) {
                setInfo(prev => ({
                    ...prev,
                    totalOrders: response.payload.totalOrders ?? prev.totalOrders,
                    totalAmount: response.payload.totalAmount ?? prev.totalAmount,
                    totalPendingOrders: response.payload.totalPendingOrders ?? prev.totalPendingOrders,
                    totalSuccessOrders: response.payload.totalSuccessOrders ?? prev.totalSuccessOrders,
                    totalPendingAmount: response.payload.totalPendingAmount ?? prev.totalPendingAmount,
                    totalSuccessAmount: response.payload.totalSuccessAmount ?? prev.totalSuccessAmount,
                    pendingOrders: response.payload.pendingOrders ?? prev.pendingOrders,
                    successOrders: response.payload.successOrders ?? prev.successOrders,
                }));
            }
        }
        fetchOrders();
    }, [user]);

    const getBillingData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (user?.userId) {
                const paymentMethodsResponse = await apiPayMethod.getAll(user.userId);
                if (paymentMethodsResponse.payload) {
                    const formattedMethods = paymentMethodsResponse.payload.map((method: any) => ({
                        ...method,
                        id: method.id || method._id,
                        affiliateId: method.affiliateId.toString(),
                        createdAt: new Date(method.createdAt).toISOString(),
                        updatedAt: new Date(method.updatedAt).toISOString(),
                    }));
                    setCurrentPaymentMethods(formattedMethods);
                } else {
                    setCurrentPaymentMethods([]);
                }
                setCurrentInvoices([]);
                setCurrentSubscriptions([]);
            } else {
                setCurrentPaymentMethods([]);
                setCurrentInvoices([]);
                setCurrentSubscriptions([]);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Không thể tải dữ liệu thanh toán.",
                variant: "destructive",
            });
            setCurrentPaymentMethods([]);
            setCurrentInvoices([]);
            setCurrentSubscriptions([]);
        } finally {
            setIsLoading(false);
        }
    }, [user?.userId, toast]);

    useEffect(() => {
        if (user?.userId) {
            getBillingData();
        }
    }, [getBillingData, user?.userId]);
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && ["overview", "invoices", "subscriptions", "payment_methods"].includes(tab)) {
            setActiveTab(tab);
        } else if (!tab && activeTab !== "overview") {
        }
    }, [searchParams]);
    useEffect(() => {
        const currentTabInUrl = searchParams.get("tab");
        if (activeTab !== currentTabInUrl) {
            router.replace(`?tab=${activeTab}`, { scroll: false });
        }
    }, [activeTab, router, searchParams]);
    const handleSetDefaultPaymentMethod = useCallback(async (methodId: string) => {
        setIsUpdatingPaymentMethod(true);
        try {
            await apiPayMethod.setDefault(methodId);
            setCurrentPaymentMethods((prev) =>
                prev.map((m) => ({ ...m, isDefault: m.id === methodId }))
            );
            toast({
                title: "Thành công",
                description: "Đã đặt phương thức thanh toán mặc định.",
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Đã xảy ra lỗi khi đặt phương thức thanh toán mặc định.",
                variant: "destructive",
            });
        } finally {
            setIsUpdatingPaymentMethod(false);
        }
    }, [toast]);

    const handleDeletePaymentMethod = useCallback(async (methodId: string) => {
        setIsUpdatingPaymentMethod(true);
        try {
            await apiPayMethod.delete(methodId);
            setCurrentPaymentMethods((prev) => prev.filter((m) => m.id !== methodId));
            toast({
                title: "Thành công",
                description: "Đã xóa phương thức thanh toán.",
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Đã xảy ra lỗi khi xóa phương thức thanh toán.",
                variant: "destructive",
            });
        } finally {
            setIsUpdatingPaymentMethod(false);
        }
    }, [toast]);

    const handleAddPaymentMethod = useCallback(
        async (newMethod: IAffiliatePaymentMethod) => {
            setIsUpdatingPaymentMethod(true);
            try {
                if (!user?.userId) {
                    toast({
                        title: "Lỗi",
                        description: "Không tìm thấy thông tin người dùng.",
                        variant: "destructive",
                    });
                    setIsUpdatingPaymentMethod(false);
                    return;
                }

                const payload = {
                    userId: user.userId,
                    type: newMethod.type,
                    name: newMethod.name,
                    details: newMethod.details,
                    isDefault: newMethod.isDefault,
                };
                const response = await apiPayMethod.create(payload);
                if (response.payload) {
                    const formattedMethod = {
                        ...response.payload,
                        id: response.payload.id || response.payload._id,
                        affiliateId: response.payload.affiliateId.toString(),
                        createdAt: new Date(response.payload.createdAt).toISOString(),
                        updatedAt: new Date(response.payload.updatedAt).toISOString(),
                    };
                    setCurrentPaymentMethods((prev) => [...prev, formattedMethod as IAffiliatePaymentMethod]);
                    toast({
                        title: "Thành công",
                        description: "Đã thêm phương thức thanh toán.",
                        variant: "success",
                    });
                } else {
                    toast({
                        title: "Lỗi",
                        description: "Không nhận được dữ liệu từ server khi thêm.",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error(error);
                toast({
                    title: "Lỗi",
                    description: "Đã xảy ra lỗi khi thêm phương thức thanh toán.",
                    variant: "destructive",
                });
            } finally {
                setIsUpdatingPaymentMethod(false);
            }
        },
        [toast, user?.userId]
    );

    if (isLoading) {
        return <div className="container mx-auto py-8 text-center">Đang tải dữ liệu thanh toán...</div>;
    }
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
                    <Button
                        variant="outline"
                        onClick={() => {
                            // Chỉ cập nhật state, useEffect sẽ xử lý cập nhật URL
                            setActiveTab("invoices");
                        }}
                    >
                        <Receipt className="w-4 h-4 mr-2" />
                        Xem tất cả hóa đơn
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
                        <div className="text-2xl font-bold">{info.totalAmount} đ</div>
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
                            {info.totalSuccessOrders ?? 0}
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
                            {info.totalPendingOrders ?? 0}
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
            <Tabs
                value={activeTab}
                // Khi giá trị tab thay đổi, chỉ cập nhật state activeTab
                onValueChange={(value) => {
                    setActiveTab(value);
                }}
                className="w-full"
            >
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
                        setActiveTab={(value: string) => setActiveTab(value)}
                        formatDate={formatDate}
                        getInvoiceStatusBadge={getInvoiceStatusBadge}
                        getSubscriptionStatusBadge={getSubscriptionStatusBadge}
                        getPaymentMethodIcon={getPaymentMethodIcon}
                        getBillingCycleName={getBillingCycleName}
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
                        onSetDefault={handleSetDefaultPaymentMethod}
                        onDelete={handleDeletePaymentMethod}
                        onAddPaymentMethod={handleAddPaymentMethod}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BillingPageContent;