// AuthProcessingPage.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast"; // Đảm bảo import toast nếu bạn dùng nó

export default function AuthProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserFromToken, isAuthenticated, user } = useAuth(); // Lấy thêm isAuthenticated, user để debug

  useEffect(() => {
    const token = searchParams.get("token");
    const redirectPath = searchParams.get("redirectPath") || "/quan-ly";

    console.log("--- AuthProcessingPage DEBUG START ---");
    console.log("1. useEffect is running.");
    console.log("2. Token found in URL:", !!token); // Log true/false nếu có token
    if (token) {
      console.log("   Token length:", token.length); // Log độ dài token để đảm bảo không rỗng
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
        // Gọi setUserFromToken. Nếu nó là async, bạn cần await nó.
        // Tuy nhiên, nếu nó chỉ cập nhật state và localStorage, nó có thể không cần async/await ở đây.
        setUserFromToken(token);
        console.log("7. setUserFromToken called.");

        // Thêm một setTimeout nhỏ để đảm bảo React có thời gian cập nhật state
        // và component con nhận được prop/context mới. Điều này chỉ là một giải pháp tạm thời
        // nếu vấn đề thực sự là hydration/state update race condition.
        // Hầu hết không cần nếu logic context đúng.
        setTimeout(() => {
          console.log(
            "8. isAuthenticated (AFTER setUserFromToken & setTimeout):",
            isAuthenticated,
          );
          console.log(
            "9. Current user (AFTER setUserFromToken & setTimeout):",
            user,
          );
          // router.replace("/quan-ly"); // Chuyển hướng cứng để test

          if (isAuthenticated) {
            // Kiểm tra lại isAuthenticated sau khi state có thể đã cập nhật
            console.log(
              "10. Authentication successful. Redirecting to:",
              redirectPath,
            );
            router.replace(redirectPath);
          } else {
            console.warn(
              "10. isAuthenticated is still FALSE after setUserFromToken. Possible issue in auth-context.",
            );
            toast({
              title: "Lỗi đăng nhập",
              description:
                "Không thể xác thực thông tin tài khoản. Vui lòng thử lại.",
              variant: "destructive",
            });
            router.replace("/dang-nhap?error=auth_failed_context_issue");
          }
        }, 100); // Đợi 100ms
      } catch (error) {
        console.error(
          "11. ERROR: Exception caught during setUserFromToken:",
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
  }, [searchParams, router, setUserFromToken, isAuthenticated, user, toast]); // Thêm tất cả dependencies

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-lg text-gray-700">Đang xử lý đăng nhập...</p>
      <p className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
    </div>
  );
}
