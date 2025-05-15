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

import HTTP from "../common/http";

const apiDonation = {
  addDonate: (body: any) => HTTP.POST("/donation", { body }),

  getDonations: () => HTTP.GET("/donations"),

  getDonationById: (id: string) => HTTP.GET(`/donation/${id}`),

  getInfor: () => HTTP.GET<DonationResponse>("/donation/infor"),
  updateDonation: (id: string, body: IDonation) =>
    HTTP.PUT(`/donation/${id}`, { body }),

  deleteDonation: (id: string) => HTTP.DELETE(`/donation/${id}`),
};
export { apiDonation };
