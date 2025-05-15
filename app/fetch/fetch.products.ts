import HTTP from "../common/http";

interface IFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface IAccountManager {
  name: string;
  email: string;
  phone: string;
}

export interface IProduct extends Document {
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
  features: IFeature[];
  subscriptionTier?: "basic" | "professional" | "enterprise";
  nextPayment?: Date;
  certificationLevel?: string;
  courseProgress?: number;
  lastAccessed?: Date;
  issuer?: string;
  accountManager: IAccountManager;
  area?: number;
}

export const apiProducts = {
  create: (body: Record<string, any>) => HTTP.POST("/products", { body }),
  getAll: () => HTTP.GET("/products"),
  getById: (id: string) => HTTP.GET(`/products/${id}`),
  update: (id: string, body: any) => HTTP.PUT(`/${id}`, { body }),
  delete: (id: string) => HTTP.DELETE(`/${id}`),
  getFreeTrial: () => HTTP.GET("/free/trial"),
};
