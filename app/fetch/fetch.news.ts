import HTTP from "../common/http";
interface userId {
  _id: string;
  name: string;
}
export interface INews extends Document {
  userId?: userId | string;
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
interface Response {
  data: INews[];
}
interface ResoonseBy {
  data: any;
}
export const apiNews = {
  getAll: () => HTTP.GET<Response>("/news"),
  getById: (id: string) => HTTP.GET<ResoonseBy>(`/news/${id}`),
  create: (body: any) => HTTP.POST("/news", { body }),
  update: (id: string, body: any) => HTTP.PUT(`/news/${id}`, { body }),
  delete: (id: string) => HTTP.DELETE(`/news/${id}`),
};
