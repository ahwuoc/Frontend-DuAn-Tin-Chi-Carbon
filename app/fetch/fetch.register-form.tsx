import HTTP from "../common/http";

export type TFormData = {
  userId?: string;
  name: string;
  age: string;
  location: string;
  area: string;
  phone: string;
  email: string;
  message: string;
  consultationType:
  | "forest"
  | "agriculture"
  | "biochar"
  | "csu"
  | "carbonbook"
  | "other";
  organization: string;
  position: string;
  experience: string;
  education: string;
  projectType: string;
  projectSize: string;
  projectLocation: string;
  implementationTimeline: string;
  budget: string;
  carbonGoals: string;
};

const apiConsultation = {
  registerConsultation: (body: Record<string, any>) =>
    HTTP.POST("/consultation/register", { body }),
};
export default apiConsultation;
