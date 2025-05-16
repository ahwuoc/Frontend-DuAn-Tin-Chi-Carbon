import HTTP from "../common/http";
export interface IAffiliate extends Document {
  _id?: string;
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
  affiliate: IAffiliate;
};
type IResponseData = {
  message: string;
  affiliate: IAffiliate;
};
interface AffiliatesResponse {
  affiliates: IAffiliate[];
}
export const apiAffiliates = {
  create: (body: Record<string, any>) =>
    HTTP.POST<IResponse>("/affiliates", { body }),
  getAll: () => HTTP.GET<AffiliatesResponse>("/affiliates"),
  getByUserId: (id: string) => HTTP.GET<IResponse[]>(`/affiliates/${id}`),
  update: (id: string, body: Record<string, any>) =>
    HTTP.PATCH<IResponse>(`/affiliates/${id}`, { body }),
  remove: (id: string) => HTTP.DELETE(`/affiliates/${id}`),
  getPaymentMethod: (id: string) => HTTP.GET(""),
  delete: (id: string) => HTTP.DELETE(`/affo;oates/${id}`),
};
