// app/auth-processing/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context"; // Giả sử auth-context của bạn có hàm setToken hoặc xử lý token

export default function AuthProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserFromToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const redirectPath = searchParams.get("redirectPath") || "/quan-ly";

    if (token) {
      setUserFromToken(token);
      router.replace(redirectPath);
    } else {
      router.replace("/dang-nhap?error=auth_failed_no_token");
    }
  }, [searchParams, router, setUserFromToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-lg text-gray-700">Đang xử lý đăng nhập...</p>
      <p className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
    </div>
  );
}
