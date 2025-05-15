import HTTP from "../common/http";

export interface ProjectCarbonDetails {
  forestLocation?: string;
  forestArea?: string | number; // Có thể string hoặc number
  treeSpecies?: string;
  plantingAge?: string | number;
  averageHeight?: string | number;
  averageCircumference?: string | number;
  previousDeforestation?: "no" | "yes" | "unknown" | "";

  riceLocation?: string;
  riceArea?: string | number;
  riceTerrain?: string;
  riceClimate?: string;
  riceSoilType?: string;
  riceStartDate?: string; // ISO date string
  riceEndDate?: string;   // ISO date string

  biocharRawMaterial?: string;
  biocharCarbonContent?: string | number;
  biocharLandArea?: string | number;
  biocharApplicationMethod?: string;
}

export interface ProjectCarbonApiResponse {
  _id: string;
  name: string;
  organization?: string;
  phone: string;
  email: string;
  address?: string;
  projectType: "forest" | "rice" | "biochar";
  details: ProjectCarbonDetails;
  additionalInfo?: string;
  landDocuments?: string[];
  kmlFile?: string | null;
  user?: string;
  createdAt: string;
  updatedAt: string;
}

interface DeleteApiResponse {
  message: string;
}

export const apiProjectCarbon = {
  add: (body: any) => {
    return HTTP.POST<ProjectCarbonApiResponse>("/project-carbons", { body });
  },

  getAll: () => {
    return HTTP.GET<ProjectCarbonApiResponse[]>("/project-carbons");
  },

  getById: (id: string) => {
    return HTTP.GET<ProjectCarbonApiResponse>(`/project-carbons/${id}`);
  },

  update: (id: string, body: FormData) => {
    return HTTP.PUT<ProjectCarbonApiResponse>(`/project-carbons/${id}`, { body });
  },

  delete: (id: string) => {
    return HTTP.DELETE<DeleteApiResponse>(`/project-carbons/${id}`); 
  },
};
