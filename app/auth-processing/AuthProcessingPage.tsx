// app/auth-processing/AuthProcessingPage.tsx
"use client"; // RẤT QUAN TRỌNG: Đây là một Client Component

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast"; // Đảm bảo import toast nếu bạn dùng

export default function AuthProcessingPage() {
  const router = useRouter();
  // KHAI BÁO useSearchParams ở đây là OK
  const searchParams = useSearchParams();
  const { setUserFromToken, isAuthenticated, user } = useAuth(); // Lấy thêm isAuthenticated, user để debug

  useEffect(() => {
    // TẤT CẢ LOGIC SỬ DỤNG searchParams VÀ router.replace PHẢI NẰM TRONG useEffect
    const token = searchParams.get("token");
    const redirectPath = searchParams.get("redirectPath") || "/quan-ly";

    console.log("--- AuthProcessingPage DEBUG START ---");
    console.log("1. useEffect is running.");
    console.log("2. Token found in URL:", !!token);
    if (token) {
      console.log("   Token length:", token.length);
    }
    console.log("3. Redirect Path:", redirectPath);
    console.log(
      "4. isAuthenticated (BEFORE calling setUserFromToken):",
      isAuthenticated,
    );
    console.log("5. Current user (BEFORE calling setUserFromToken):", user);

    if (token) {
      console.log("6. Calling setUserFromToken with received token...");
      try {
        setUserFromToken(token);
        console.log("7. setUserFromToken called.");

        // Không cần setTimeout nếu setUserFromToken đồng bộ hoặc bạn đã await trong đó
        // Tuy nhiên, để đảm bảo không có race condition với context update:
        // Có thể dùng một check sau khi setUserFromToken (nếu nó đồng bộ)
        // hoặc biến setUserFromToken thành async và await nó.
        // Giả sử setUserFromToken là đồng bộ (cập nhật state và cookie/localStorage ngay lập tức)
        // thì chuyển hướng ngay sau đó là hợp lý.
        // Nếu nó async và bạn đã làm cho nó async như tôi gợi ý trước đó, thì bạn nên `await` nó.

        // Sau khi setUserFromToken được gọi (và giả định nó đã hoàn tất việc cập nhật context)
        // Chúng ta có thể chuyển hướng ngay lập arguments đó.
        console.log("8. Attempting redirect to:", redirectPath);
        router.replace(redirectPath);
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
    } else {
      console.log("6. No token found. Redirecting to login page.");
      router.replace("/dang-nhap?error=auth_failed_no_token");
    }
    console.log("--- AuthProcessingPage DEBUG END ---");
  }, [searchParams, router, setUserFromToken, isAuthenticated, user, toast]); // Dependencies

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-lg text-gray-700">Đang xử lý đăng nhập...</p>
      <p className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
    </div>
  );
}
