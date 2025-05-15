import HTTP from "../common/http";

interface IContact {
  email: string;
  phone: string;
  supportHours?: string;
}

interface IAccountManager {
  name: string;
  email: string;
  phone: string;
}

export interface ICarbonProduct extends Document {
  id: string;
  name?: string;
  company: string;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  description: string;
  image: string;
  dashboardImage: string;
  aiPlatformUrl: string;
  documentsDriveUrl: string;
  price: number;
  billingCycle: string;
  nextBillingDate: string;
  paymentMethod: string;
  cardInfo: string;
  usageStats: IUsageStats;
  supportContact: IContact;
  accountManager: IAccountManager;
  resources: IResource[];
  features: IFeature[];
  recentActivities: IActivity[];
  updates: IUpdate[];
}
interface IResource {
  id: string;
  title: string;
  type: "pdf" | "video" | "excel";
  icon: string;
  size: string;
  date: string;
}

interface IFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface IActivity {
  id: string;
  date: string;
  action: string;
  user: string;
}

interface IUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface IUsageStats {
  totalUsage: number;
  lastMonthUsage: number;
  trend: "up" | "down";
  usageLimit: number;
  usagePercentage: number;
}
interface ResponseOrder {
  message: string;
  data: ICarbonProduct;
}
type TypeProduct =
  | "carbon_accounting"
  | "international_certificates"
  | "carbon_credits";
export const apiCarbon = {
  getId: (id: string) => HTTP.GET<ResponseOrder>(`/products/${id}`),
  getAll: () => HTTP.GET<ICarbonProduct[]>("/carbons"),
  createOrder: (body: Record<string, any>) => HTTP.POST("/orders", { body }),
  getProductType: (type: TypeProduct) => HTTP.GET(`/products?type=${type}`),
  postProductType: (type: TypeProduct) => HTTP.POST(`/products?type=${type}`),
  getOrderByUser: (userId: string) => HTTP.GET(`/orders/user/${userId}`),
};
