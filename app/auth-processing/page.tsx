import { Suspense } from "react";
import AuthProcessingPage from "./AuthProcessingPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProcessingPage />
    </Suspense>
  );
}
