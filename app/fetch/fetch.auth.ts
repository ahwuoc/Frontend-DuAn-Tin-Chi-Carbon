import HTTP from "../common/http";
import Cookies from "js-cookie";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: "admin" | "user";
  createdAt: Date;
};

export type TLoginResponse = {
  token: string;
  success: boolean;
  message: string;
  userData: TUser;
};

export type TRegisterResponse = {
  success: boolean;
  message: string;
  user: TUser;
};

export type TUpdateResponse = {
  success: boolean;
  message: string;
  user: TUser;
};

export type TLogoutResponse = {
  success: boolean;
  message: string;
  data: any;
};

const apiAuth = {
  login: async (body: Record<string, any>): Promise<TLoginResponse> => {
    const httpResponse = await HTTP.POST<TLoginResponse>("/auth/login", {
      body,
    });
    if (
      httpResponse.payload &&
      httpResponse.payload.success &&
      httpResponse.payload.token
    ) {
      Cookies.set("token", httpResponse.payload.token, {
        expires: 7,
        path: "/",
      });
    }
    return httpResponse.payload;
  },
  createUser: (body: any) => HTTP.POST<any>("/auth/register", { body }),
  updateUser: async (id: string, body: any) =>
    await HTTP.POST<any>("/register", { body }),
  logout: async (): Promise<TLogoutResponse> => {
    const httpResponse = await HTTP.POST<TLogoutResponse>("/auth/logout");
    Cookies.remove("token", { path: "/" });
    return httpResponse.payload;
  },
  getAll: async () => await HTTP.GET<any>("/auth/users"),
  register: async (body: Record<string, any>): Promise<TRegisterResponse> => {
    const httpResponse = await HTTP.POST<TRegisterResponse>("/auth/register", {
      body,
    });
    return httpResponse.payload;
  },
  deleteUser: (id: string) => HTTP.DELETE<any>(`/auth/user${id}`),
  update: async (body: Record<string, any>): Promise<TUpdateResponse> => {
    const token = Cookies.get("token");
    const requestOptions: Parameters<typeof HTTP.PUT>[1] = { body };
    if (token) {
      requestOptions.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    const httpResponse = await HTTP.PUT<TUpdateResponse>(
      "/auth/users/update",
      requestOptions,
    );
    return httpResponse.payload;
  },
  getInforManager: (id: string) => HTTP.GET(`/auth/user/infor-manger/${id}`),
};

export default apiAuth;
