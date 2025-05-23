import { Suspense } from "react";
import GopMamXanhPage from "./page-client";

export default function Page() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <GopMamXanhPage />
    </Suspense>
  );
}
