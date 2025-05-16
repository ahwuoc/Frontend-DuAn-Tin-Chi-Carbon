import { Badge } from "@/components/ui/badge";
import { Building, Wallet, CreditCard } from "lucide-react";
import { Invoice, Subscription } from "../type";

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN");

export const getInvoiceStatusBadge = (status: Invoice["status"]) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline">Chờ xử lý</Badge>;
    case "paid":
      return <Badge variant="outline">Đã thanh toán</Badge>;
    case "overdue":
      return <Badge variant="destructive">Quá hạn</Badge>;
    default:
      return null;
  }
};

export const getSubscriptionStatusBadge = (status: Subscription["status"]) => {
  switch (status) {
    case "active":
      return <Badge variant="outline">Đang hoạt động</Badge>;
    case "canceled":
      return <Badge variant="outline">Đã hủy</Badge>;
    case "expired":
      return <Badge variant="destructive">Hết hạn</Badge>;
    default:
      return null;
  }
};

export const getPaymentMethodIcon = (type: string) => {
  switch (type) {
    case "bank_transfer":
      return <Building className="w-5 h-5 text-green-500" />;
    case "paypal":
      return <Wallet className="w-5 h-5 text-blue-500" />;
    case "other":
      return <CreditCard className="w-5 h-5 text-gray-500" />;
    default:
      return <Wallet className="w-5 h-5 text-gray-500" />;
  }
};

export const getBillingCycleName = (cycle: Subscription["billingCycle"]) => {
  return cycle === "monthly" ? "Hàng tháng" : "Hàng năm";
};
