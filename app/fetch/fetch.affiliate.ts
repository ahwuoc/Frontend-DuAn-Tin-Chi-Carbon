import HTTP from "../common/http";
export interface IAffiliate extends Document {
  userId?: string;
  fullName?: string;
  email: string;
  phone: string;
  company?: string;
  reason?: string;
  referralCode: string;
  referralLink: string;
  totalClicks: number;
  totalRegistrations: number;
  totalCommission: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
type IResponse = {
  message: string;
  affiliates: IAffiliate;
};
export const apiAffiliates = {
  create: (body: Record<string, any>) => HTTP.POST("/affiliates", { body }),
  getAll: () => HTTP.GET("/affiliates"),
  getByUserId: (id: string) => HTTP.GET<IResponse>(`/affiliates/${id}`),
  update: (id: string, body: Record<string, any>) =>
    HTTP.PATCH(`/affiliates/${id}`, { body }),
  remove: (id: string) => HTTP.DELETE(`/affiliates/${id}`),
};
