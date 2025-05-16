import HTTP from "../common/http";

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
  _id?: string;
  id: string;
  affiliateId: string;
  type: "bank_transfer" | "paypal" | "other";
  name?: string;
  details?: IAffiliateDetail | { email: string } | { description: string };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const apiPayMethod = {
  getAll: (userId: string) =>
    HTTP.GET<IAffiliatePaymentMethod[]>(`/payment-method/${userId}`),
  getById: (id: string) =>
    HTTP.GET<IAffiliatePaymentMethod>(`/payment-method/${id}`),
  create: (body: Partial<IAffiliatePaymentMethod>) =>
    HTTP.POST<IAffiliatePaymentMethod>("/payment-method", { body }),
  update: (id: string, body: Partial<IAffiliatePaymentMethod>) =>
    HTTP.PUT<IAffiliatePaymentMethod>(`/payment-method/${id}`, { body }),
  delete: (id: string) => HTTP.DELETE<void>(`/payment-method/${id}`),
  setDefault: (id: string) =>
    HTTP.POST<void>(`/payment-method/${id}/set-default`, {}),
};
