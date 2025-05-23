export interface IDonation extends Document {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  note?: string;
  totalAmount: number;
  bankInfo: {
    accountName: string;
    accountNumber: string;
    bank: string;
    branch: string;
    content: string;
  };
  createdAt: Date;
}

export interface DonationResponse {
  donations: IDonation[];
  totalQuantity: number;
  totalTreeCount: number;
  contributorCount: number;
  treeCountByUser: { email: string; treeCount: number }[];
}

export interface saveResponse {
  savedDonation: IDonation;
}

import HTTP from "../common/http";

const apiDonation = {
  addDonate: (body: any) => HTTP.POST<any>("/donation", { body }),
  getDonations: () => HTTP.GET("/donations"),
  getDonationById: (id: string) => HTTP.GET(`/donation/${id}`),
  getDonationByorderCodeAndUpdateStatus: (orderCode: string) =>
    HTTP.GET<any>(`/donation/orderCode/${orderCode}`),
  getInfor: () => HTTP.GET<DonationResponse>("/donation/infor"),
  updateDonation: (id: string, body: any) =>
    HTTP.PUT(`/donation/${id}`, { body }),
  deleteDonation: (id: string) => HTTP.DELETE(`/donation/${id}`),
};
export { apiDonation };
