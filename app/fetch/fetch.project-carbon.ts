import HTTP from "../common/http";
interface ProjectCarbonApiResponse {
  _id: string;
  name: string;
  organization?: string;
  phone: string;
  email: string;
  address?: string;
  projectType: "forest" | "rice" | "biochar";
  details: {
    forestLocation?: string;
    forestArea?: string; // Có thể API trả về string hoặc number
    treeSpecies?: string;
    plantingAge?: string; // Có thể API trả về string hoặc number
    averageHeight?: string; // Có thể API trả về string hoặc number
    averageCircumference?: string; // Có thể API trả về string hoặc number
    previousDeforestation?: "no" | "yes" | "unknown" | "";

    riceLocation?: string;
    riceArea?: string; // Có thể API trả về string hoặc number
    riceTerrain?: string;
    riceClimate?: string;
    riceSoilType?: string;
    riceStartDate?: string; // API thường trả về string ISO date
    riceEndDate?: string; // API thường trả về string ISO date

    biocharRawMaterial?: string;
    biocharCarbonContent?: string; // Có thể API trả về string hoặc number
    biocharLandArea?: string; // Có thể API trả về string hoặc number
    biocharApplicationMethod?: string;
  };
  additionalInfo?: string;
  landDocuments?: string[]; // Mảng các tên file/đường dẫn
  kmlFile?: string | null; // Tên file/đường dẫn hoặc null
  user?: string; // ID người dùng dạng string
  createdAt: string; // API thường trả về string ISO date
  updatedAt: string; // API thường trả về string ISO date
}

interface DeleteApiResponse {
  message: string;
}

export const apiProjectCarbon = {
  add: (body: any) => {
    HTTP.POST<ProjectCarbonApiResponse>("/projects/carbon", { body });
  },

  getAll: () => {
    return HTTP.GET<ProjectCarbonApiResponse[]>("/projects/carbon");
  },

  getById: (id: string) => {
    return HTTP.GET<ProjectCarbonApiResponse>(`/projects/carbon/${id}`);
  },
  update: (id: string, body: FormData) => {
    return HTTP.PUT<ProjectCarbonApiResponse>(`/projects/carbon/${id}`, {
      body,
    });
  },

  delete: (id: string) => {
    return HTTP.DELETE<DeleteApiResponse>(`/projects/carbon/${id}`);
  },
};
