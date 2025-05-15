import HTTP from "../common/http";
export interface IConsultation {
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

export const apiConsultations = {
  getAll: () => HTTP.GET("/consultation/getall"),
  register: (body: any) => HTTP.POST("consultation/register", { body }),
};
