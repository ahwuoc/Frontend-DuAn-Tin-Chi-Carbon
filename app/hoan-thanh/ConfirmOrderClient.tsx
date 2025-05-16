'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiOrders } from "../fetch/fetch.order";

export default function ConfirmOrderClient() {
    const searchParams = useSearchParams();
    const orderCode = searchParams.get("orderCode");
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        const confirmOrder = async () => {
            if (!orderCode) {
                setIsLoading(false);
                toast({
                    title: "Lỗi",
                    description: "Mã đơn hàng không hợp lệ. Vui lòng kiểm tra lại!",
                    variant: "destructive",
                });
                return;
            }

            try {
                const formattedOrderCode = `MA_ORDER-${orderCode}`;
                const response = await apiOrders.confirm(formattedOrderCode, {
                    status: "PAID",
                });
                if (response.status === 200) {
                    setIsConfirmed(true);
                    toast({
                        title: "Thành công",
                        description: "Đơn hàng đã được xác nhận, nhanh như một cơn gió! 🌪️",
                    });
                } else {
                    throw new Error("Xác nhận đơn thất bại");
                }
            } catch (error: any) {
                console.error("Lỗi khi xác nhận đơn:", error);
                const errorMessage =
                    error.response?.data?.error ||
                    "Không thể xác nhận đơn. Vui lòng thử lại!";
                toast({
                    title: "Lỗi",
                    description: errorMessage,
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        confirmOrder();
    }, [orderCode, toast]);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <Card className="max-w-3xl mx-auto">
                    <CardHeader className="text-center bg-green-50">
                        <div className="mx-auto mb-4 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                            {isConfirmed ? (
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            ) : (
                                <AlertCircle className="h-10 w-10 text-green-600" />
                            )}
                        </div>
                        <CardTitle className="text-2xl text-green-700">
                            {isConfirmed
                                ? "Thanh toán thành công!"
                                : "Xác nhận đơn thất bại!"}
                        </CardTitle>
                        <CardDescription>
                            {isConfirmed
                                ? "Cảm ơn bạn đã chọn Tín Chỉ Carbon Việt Nam! 🎉"
                                : "Ôi, có gì đó sai sai rồi! 😅"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 text-center">
                        <p className="text-lg text-gray-700 mb-4">
                            {isConfirmed ? (
                                <>
                                    Đơn hàng #{orderCode} đã được ghi nhận, nhanh hơn cả tốc độ ánh sáng! 🚀 Chúng tôi sẽ liên hệ sớm trong vòng{" "}
                                    <span className="font-medium">24 giờ</span>.
                                </>
                            ) : (
                                `Xác nhận đơn #${orderCode} chưa thành công, chậm hơn cả rùa bò! 🐢 Vui lòng thử lại hoặc liên hệ hỗ trợ.`
                            )}
                        </p>

                        <p className="text-sm text-gray-500 mb-6">
                            Cần hỗ trợ ngay? Gọi hotline:{" "}
                            <span className="font-medium">092.3370.804</span>, team mình luôn
                            sẵn sàng 24/7!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/" className="w-full sm:w-1/2">
                                <Button
                                    variant="outline"
                                    className="w-full transition-all duration-300 transform hover:scale-[1.02] hover:bg-gray-100"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Về trang chủ
                                </Button>
                            </Link>
                            <Link
                                href={isConfirmed ? "/san-pham" : "/thanh-toan"}
                                className="w-full sm:w-1/2"
                            >
                                <Button className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02]">
                                    {isConfirmed ? "Khám phá sản phẩm" : "Thử lại"}
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
