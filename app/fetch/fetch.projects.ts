import HTTP from "../common/http";

interface IProjectDocument {
  name: string;
  date: Date;
  type: string;
}

interface IProjectActivity {
  date: Date;
  description: string;
}
export interface IProject {
  _id: string;
  name: string;
  description: string;
  status: "active" | "pending" | "completed";
  registrationDate: Date;
  startDate: Date;
  endDate: Date;
  carbonCredits: number;
  carbonCreditsTotal: number;
  carbonCreditsClaimed: number;
  type: "forestry" | "renewable" | "conservation" | "waste";
  location: string;
  coordinates: string;
  area: number;
  participants: number;
  progress: number;
  documents: IProjectDocument[];
  activities: IProjectActivity[];
  userId: string;
}

export const apiProjects = {
  getProject: (id: string) => HTTP.GET<IProject>(`/projects/${id}`),
  getAllProject: () => HTTP.GET<IProject[]>("/projects"),
  addProject: (data: any) => HTTP.POST<IProject>("/projects", data),
  getMyProject: (id: string) => HTTP.GET<IProject>(`/projects/profile/${id}`),
};
