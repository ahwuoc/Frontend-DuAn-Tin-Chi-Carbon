import HTTP from "../common/http";
export interface INews extends Document {
  _id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  status: "draft" | "published" | "archived";
  image?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
export const apiNews = {
  getAll: () => HTTP.GET("/news"),
  getById: (id: string) => HTTP.GET(`/news/${id}`),
  create: (body: any) => HTTP.POST("/news", { body }),
  update: (id: string, body: any) => HTTP.PUT(`/news/${id}`, { body }),
  delete: (id: string) => HTTP.DELETE(`/news/${id}`),
};
