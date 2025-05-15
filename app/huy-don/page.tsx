"use client";

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
import { AlertCircle, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiOrders } from "../fetch/fetch.order";

export default function CancelOrderPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    const cancelOrder = async () => {
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
        const response = await apiOrders.cancelOrder(orderCode);
        if (response.status === 200 || response.status === 201) {
          setIsCancelled(true);
          toast({
            title: "Thành công",
            description: "Đơn hàng đã được hủy, nhanh như một cơn gió! 🌪️",
          });
        } else {
          throw new Error("Hủy đơn thất bại");
        }
      } catch (error) {
        console.error("Lỗi khi hủy đơn:", error);
        toast({
          title: "Lỗi",
          description:
            "Không thể hủy đơn. Vui lòng thử lại hoặc liên hệ hỗ trợ!",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    cancelOrder();
  }, [orderCode, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center bg-red-50">
            <div className="mx-auto mb-4 bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
              {isCancelled ? (
                <CheckCircle className="h-10 w-10 text-red-600" />
              ) : (
                <AlertCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl text-red-700">
              {isCancelled ? "Hủy đơn thành công!" : "Hủy đơn thất bại!"}
            </CardTitle>
            <CardDescription>
              {isCancelled
                ? "Đơn hàng của bạn đã bay mất! 😎"
                : "Ôi, có gì đó sai sai rồi! 😅"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-gray-700 mb-4">
              {isCancelled
                ? `Đơn hàng #${orderCode} đã được hủy, nhanh hơn cả tốc độ ánh sáng! 🚀 Bạn có muốn thử đặt lại không?`
                : `Hủy đơn #${orderCode} chưa thành công, chậm hơn cả rùa bò! 🐢 Vui lòng thử lại hoặc liên hệ hỗ trợ.`}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Cần giúp đỡ ngay? Gọi hotline:{" "}
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
                href={isCancelled ? "/san-pham" : "/thanh-toan"}
                className="w-full sm:w-1/2"
              >
                <Button className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02]">
                  {isCancelled ? "Khám phá sản phẩm" : "Thử lại"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
