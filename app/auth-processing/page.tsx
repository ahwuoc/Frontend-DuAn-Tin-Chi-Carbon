// app/auth-processing/page.tsx
// Đây là Server Component mặc định (không có "use client";)
import { Suspense } from "react";
import AuthProcessingPage from "./AuthProcessingPage"; // AuthProcessingPage CÓ "use client";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* AuthProcessingPage là Client Component, sử dụng useSearchParams */}
      <AuthProcessingPage />
    </Suspense>
  );
}
