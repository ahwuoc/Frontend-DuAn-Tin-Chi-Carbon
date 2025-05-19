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

type TheLoai =
  | "carbon_credits"
  | "carbon_accounting"
  | "international_certificates";

export interface IProduct extends Document {
  _id: string;
  name: string;
  createdAt: Date;
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
  totalCredits?: number;
  usedCredits?: number;
}
interface ReportItem {
  date: string;
  // các trường khác
}
interface ApiResponse {
  data: {
    reports: ReportItem[];
  };
}

export const apiProducts = {
  create: (body: Record<string, any>) => HTTP.POST("/products", { body }),
  getAll: () => HTTP.GET<IProduct[]>("/products"),
  getById: (id: string) => HTTP.GET<any>(`/products/${id}`),
  updateById: (id: string, body: any) => HTTP.PUT<any>(`/${id}`, { body }),
  delete: (id: string) => HTTP.DELETE(`/${id}`),
  getFreeTrial: () => HTTP.GET("/free/trial"),
  updatetimeline: (id: string, body: any) =>
    HTTP.PUT<any>(`/products/timelines/${id}`, { body }),
  updateFeatures: (id: string, body: any) =>
    HTTP.PUT<any>(`/products/features/${id}`, { body }),
  updateReport: (id: string, body: any) =>
    HTTP.PUT<any>(`/products/reports/${id}`, { body }),
  updateBenefits: (id: string, body: any) =>
    HTTP.PUT<any>(`/products/benefits/${id}`, { body }),
  updatecertificates: (id: string, body: any) =>
    HTTP.PUT<any>(`/products/certificates/${id}`, { body }),
  getProducts: (type: TheLoai) => HTTP.GET<any[]>(`/products?type=${type}`),
  updateProduct: (id: string, body: any) =>
    HTTP.PUT<any>(`products/${id}`, { body }),
};
