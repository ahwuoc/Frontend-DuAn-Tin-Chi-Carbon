import HTTP from "../common/http";

export interface IProjectDocument {
  name: string;
  url: string;
  type?: string;
  createdAt: any;
}
export interface IKmlFile {
  name: string;
  url: string;
  createdAt: any;
}
// Định nghĩa interface cho hoạt động (Activity)
export interface IActivity {
  _id?: string; // _id có thể có nếu lấy từ DB, nhưng không cần khi tạo mới
  title: string;
  date: string; // ISO string
  description: string;
}

// Định nghĩa interface cho tọa độ (Coordinates)
// Interface này chỉ dùng nội bộ khi gửi dữ liệu đi nếu API cần format object
export interface ICoordinates {
  lat: number;
  lng: number;
}

// Định nghĩa kiểu dữ liệu cho form
export type FormData = {
  userId?: any;
  name: string;
  description?: string;
  coordinates?: string; // Luôn là string trong form
  registrationDate?: string;
  startDate?: string;
  endDate?: string;
  landDocuments: any;
  carbonCredits?: number;
  carbonCreditsTotal?: number;
  carbonCreditsClaimed?: number;
  area?: number;
  location?: string;
  type?: string;
  status?: "pending" | "active" | "completed" | "archived";
  participants?: string;
  progress?: number;
  documents: string[];
  activities: IActivity[];
};

export interface IProjectActivity {
  date: Date;
  description: string;
}
export interface IProject {
  _id: string;
  name: string;
  landDocuments: any;
  description: string;
  details?: any;
  status: "active" | "pending" | "completed";
  registrationDate: Date;
  startDate: Date;
  endDate: Date;
  carbonCredits: number;
  carbonCreditsTotal: number;
  carbonCreditsClaimed: number;
  type: "forestry" | "renewable" | "conservation" | "waste";
  location: string;
  address?: any;
  organization?: any;
  coordinates: string;
  area: number;
  kmlFile: any;
  createdAt: Date;
  participants: number;
  progress: number;
  documents: IProjectDocument[];
  activities: IProjectActivity[];
  userId: any;
}
export type ResTProduct = {
  project: IProject[];
};
export const apiProjects = {
  getProject: (id: string) => HTTP.GET<any>(`/projects/${id}`),
  update: (id: string, body: any) =>
    HTTP.PUT<IProject>(`/projects/${id}`, { body }),
  updateProject: (id: string, body: any) =>
    HTTP.PUT<IProject>(`/projects/${id}`, { body }),
  getAll: () => HTTP.GET<IProject[]>("/projects"),
  addProject: (data: any) => HTTP.POST<IProject>("/projects", data),
  getMyProject: (id: string) => HTTP.GET<any>(`/projects/profile/${id}`),
  delete: (id: any) => HTTP.DELETE(`/projects/${id}`),
  updateActivities: (id: string, body: any) =>
    HTTP.PUT<any>(`/projects/activities/${id}`, { body }),
  updateDocuments: (id: string, body: any) =>
    HTTP.PUT(`/projects/documents/${id}`, { body }),
  updateDocumentStatus: (
    projectId: string,
    documentId: string,
    status: string,
  ) =>
    HTTP.PUT(
      `/projects/documents/${projectId}/${documentId}/status?status=${status}`,
    ),
};
