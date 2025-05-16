import HTTP from "../common/http";
export type CertificateStatus = "active" | "expired";
export type CertificateLevel = "Nghiên cứu" | "Chuyên gia";

export interface Certificate {
  id: string;
  name: string;
  type: "international_certificates";
  description: string;
  purchaseDate: string;
  expiryDate: string;
  status: CertificateStatus;
  image: string;
  features: string[];
  customFeatureName?: string;
  price: number;
  certificationLevel: CertificateLevel;
  courseProgress: number;
  lastAccessed: string;
  issuer: string;
  progressStatus?: "Hoàn thành" | "Đang học" | "Chưa học";
}

export const apiCertificates = {
  getAll: () => HTTP.GET<Certificate[]>("/certificates"),

  getById: (id: string) => HTTP.GET<Certificate>(`/certificates/${id}`),

  create: (body: any) => HTTP.POST("/certificates", { body }),

  update: (id: string, body: any) => HTTP.PUT(`/certificates/${id}`, { body }),

  delete: (id: string) => HTTP.DELETE(`/certificates/${id}`),
};
