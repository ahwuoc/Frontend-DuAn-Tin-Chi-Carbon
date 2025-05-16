export interface Invoice {
  id: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  planName: string;
  status: "active" | "canceled" | "expired";
  billingCycle: "monthly" | "yearly";
  nextBillingDate: string;
  amount: number;
}

export interface IAffiliateDetail {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  swiftCode: string;
}

export interface IAffiliatePaymentMethod {
  id: string;
  affiliateId: string;
  type: "bank_transfer" | "paypal" | "other";
  name?: string;
  details?: IAffiliateDetail | { email: string } | { description: string };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
