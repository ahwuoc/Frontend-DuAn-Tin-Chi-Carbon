// app/auth-processing/AuthProcessingPage.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";

export default function AuthProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserFromToken, isAuthenticated, user } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const redirectPath = searchParams.get("redirectPath") || "/quan-ly";

    console.log("--- AuthProcessingPage DEBUG START ---");
    console.log("1. useEffect is running.");
    console.log("2. Token found in URL:", !!token);
    if (token) {
      console.log("   Token length:", token.length);
    }
    console.log("3. Redirect Path:", redirectPath);
    console.log("4. isAuthenticated (BEFORE logic):", isAuthenticated);
    console.log("5. Current user (BEFORE logic):", user);

    if (token && !isAuthenticated) {
      console.log(
        "6. Token exists and user is NOT yet authenticated. Calling setUserFromToken...",
      );
      try {
        setUserFromToken(token);
        console.log("7. setUserFromToken called.");
        console.log(
          "8. Authentication processed. Attempting to PUSH to:",
          "/quan-ly", // Log rõ ràng đang push
        );
        router.push("/quan-ly");
      } catch (error) {
        console.error(
          "9. ERROR: Exception caught during setUserFromToken:",
          error,
        );
        toast({
          title: "Lỗi xác thực",
          description: "Không thể xử lý thông tin đăng nhập. Vui lòng thử lại.",
          variant: "destructive",
        });
        router.replace("/dang-nhap?error=auth_processing_failed");
      }
    } else if (token && isAuthenticated) {
      console.log(
        "6. Token exists and user is ALREADY authenticated. Attempting to REPLACE to:",
        redirectPath, // Log rõ ràng đang replace
      );
      router.replace(redirectPath);
    } else if (!token) {
      console.log("6. No token found. Redirecting to login page with error.");
      router.replace("/dang-nhap?error=auth_failed_no_token");
    }
    console.log("--- AuthProcessingPage DEBUG END ---");
  }, [searchParams, router, setUserFromToken, isAuthenticated, user, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-lg text-gray-700">Đang xử lý đăng nhập...</p>
      <p className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
    </div>
  );
}
