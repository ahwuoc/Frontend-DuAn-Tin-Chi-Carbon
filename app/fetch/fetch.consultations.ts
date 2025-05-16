import HTTP from "../common/http";
export interface IConsultation {
  _id?: string;
  name: string;
  age?: string;
  location?: string;
  area?: string;
  phone: string;
  email: string;
  message?: string;
  consultationType:
    | "forest"
    | "agriculture"
    | "biochar"
    | "csu"
    | "carbonbook"
    | "other";
  organization?: string;
  position?: string;
  experience?: string;
  education?: string;
  projectType?: string;
  projectSize?: string;
  projectLocation?: string;
  implementationTimeline?: string;
  budget?: string;
  carbonGoals?: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}
type IResponse = {
  consultation: IConsultation;
};
type IResponse2 = {
  data: IConsultation[];
};

export const apiConsultations = {
  getAll: () => HTTP.GET<IResponse2>("/consultation/getall"),
  register: (body: any) => HTTP.POST("/consultation/register", { body }),
  createConsultation: (body: any) =>
    HTTP.POST<IResponse>("/consultation/", { body }),
  deleteConsultation: (id: string) => HTTP.DELETE(`/consultation/${id}`),
  updateConsultation: (id: string, body: any) =>
    HTTP.DELETE<IResponse>(`/consultation/${id}`, { body }),
};
