"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";

export default function AuthProcessingPage() {
  const searchParams = useSearchParams();
  const { setUserFromToken, isAuthenticated } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const redirectPath = searchParams.get("redirectPath") || "/quan-ly";

    console.log("--- AuthProcessingPage DEBUG START ---");
    console.log("Token:", token);
    console.log("Redirect Path:", redirectPath);

    if (token) {
      console.log("Có token, xử lý đăng nhập...");
      try {
        setUserFromToken(token);
        console.log("Đăng nhập thành công. Chuyển hướng...");
        window.location.href = redirectPath;
      } catch (error) {
        console.error("Lỗi khi xử lý token:", error);
        toast({
          title: "Lỗi xác thực",
          description: "Không thể xử lý token đăng nhập. Vui lòng thử lại.",
          variant: "destructive",
        });
        window.location.href = "/dang-nhap?error=auth_processing_failed";
      }
    } else {
      console.log("Không có token. Chuyển về trang đăng nhập.");
      window.location.href = "/dang-nhap?error=auth_failed_no_token";
    }

    console.log("--- AuthProcessingPage DEBUG END ---");
  }, [searchParams, setUserFromToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-lg text-gray-700">Đang xử lý đăng nhập...</p>
      <p className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
    </div>
  );
}
