// app/auth-processing/AuthProcessingPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";

export default function AuthProcessingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    if (isVerifying && !verificationComplete) {
      const delay = 2500;

      const timer = setTimeout(() => {
        setIsVerifying(false);
        setVerificationComplete(true);

        if (isAuthenticated) {
          router.replace("/quan-ly");
        } else {
          toast({
            title: "Phiên đăng nhập hết hạn",
            description: "Vui lòng đăng nhập lại để tiếp tục.",
            variant: "destructive",
          });
          router.replace("/dang-nhap?error=session_expired_or_invalid");
        }
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isAuthenticated, user, router, toast, isVerifying, verificationComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-lg text-gray-700">
        {isVerifying
          ? "Đang xác minh phiên đăng nhập..."
          : "Đang chuyển hướng..."}
      </p>
      <p className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
    </div>
  );
}
