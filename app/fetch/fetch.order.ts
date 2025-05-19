import HTTP from "../common/http";
export interface IOrder {
  _id: string;
  userId: string;
  productId: IProduct[];
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
  price: number;
  status: "pending" | "paid" | "shipped" | "cancelled" | "active";
  createdAt: Date;
  expiryDate?: string;
  name?: string;
  description?: string;
}
export interface IProduct {
  name: string;
  type: "carbon_credits" | "carbon_accounting" | "international_certificates";
  description: string;
  purchaseDate: Date;
  status: "active" | "pending" | "expired";
  expiryDate?: Date;
  image?: string;
  price?: number;
  billingCycle: string;
  projectLocation?: string;
  carbonAmount?: number;
  carbonUsed?: number;
  verificationStandard?: string;
  usageStats?: {
    totalUsage: number;
    lastMonthUsage: number;
    trend: "up" | "down" | "stable";
  };
}
interface ResTOrder {
  orders?: IOrder[];
  totalAmount?: number;
}
interface ResTOrder2 {
  order?: IOrder[];
}
interface ResTOrder2 {
  data?: IOrder[];
}

export const apiOrders = {
  getInforOrderByUserId: <T>(id: any) => HTTP.GET<T>(`/orders/info/${id}`),
  cancelOrder: (orderCode: string) => HTTP.DELETE(`/orders/${orderCode}`),
  getOrderByUser: (id: string) => HTTP.GET<any>(`/orders/user/${id}`),
  getAll: () => HTTP.GET<any[]>("/orders"),
  deleteID: (id: string) => HTTP.DELETE(`/orders/id/${id}`),
  createOrder: (body: any) => HTTP.POST<any>("/orders", { body }),
  update: (id: string, body: any) => HTTP.PUT(`/orders/${id}`, { body }),
  confirm: (id: string, body: any) => HTTP.PUT(`/orders/${id}`, { body }),
};
