import { Suspense } from "react";
import AuthProcessingPage from "./AuthProcessingPage";

export default function Page() {
  return (
    <Suspense fallback={<p>Đang xử lý đăng nhập...</p>}>
      <AuthProcessingPage />
    </Suspense>
  );
}
