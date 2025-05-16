import HTTP from "../common/http";

export type ProjectStatus = "active" | "inactive" | "completed";

export interface CarbonCredit {
  id: string;
  title: string;
  location: string;
  area: string; // ví dụ: "2,300 hecta"
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  totalCredits: string; // ví dụ "8,000 tCO2e"
  usedCredits: string;
  remainingCredits: string;
  status: ProjectStatus;
  description: string;
  image?: string;
  afterImage?: string;
  projectManager: string;
  projectContact: string;
  projectPhone: string;
  verificationDate: string;
  nextVerificationDate: string;
  verificationBody: string;
  communityBenefits: string[];
  biodiversityBenefits: string[];
  reports: Array<{
    id: string;
    title: string;
    date: string;
    size: string;
    type: string;
  }>;
  transactions: Array<{
    id: string;
    date: string;
    type: string;
    amount: string;
    value: string;
    status: string;
  }>;
  certificates: Array<{
    id: string;
    title: string;
    date: string;
    size: string;
  }>;
  timeline: Array<{ date: string; event: string }>;
}

export const apiCarbonCredits = {
  getAll: () => HTTP.GET<CarbonCredit[]>("/carboncredits"),

  getById: (id: string) => HTTP.GET<CarbonCredit>(`/carboncredits/${id}`),

  create: (body: CarbonCredit) => HTTP.POST("/carboncredits", { body }),
  update: (id: string, body: any) => HTTP.PUT(`/carboncredits/${id}`, { body }),
  updateById: (id: string, body: any) =>
    HTTP.PUT(`/carboncredits/${id}`, { body }),
  delete: (id: string) => HTTP.DELETE(`/carboncredits/${id}`),
};
