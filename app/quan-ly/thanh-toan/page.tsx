import { Suspense } from 'react';
import BillingPageContent from './BillingPageContent'; // Import component con mới

const BillingPage = () => {
  return (
    // Bọc component sử dụng useSearchParams bên trong Suspense
    <Suspense fallback={<div>Đang tải...</div>}>
      <BillingPageContent />
    </Suspense>
  );
};

export default BillingPage;