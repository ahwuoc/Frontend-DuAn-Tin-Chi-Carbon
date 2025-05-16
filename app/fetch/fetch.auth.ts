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
    const httpResponse = await HTTP.POST<TLoginResponse>("/login", { body });
    if (
      httpResponse.data &&
      httpResponse.data.success &&
      httpResponse.data.token
    ) {
      Cookies.set("token", httpResponse.data.token, { expires: 7, path: "/" });
    }
    return httpResponse.data;
  },

  logout: async (): Promise<TLogoutResponse> => {
    const httpResponse = await HTTP.POST<TLogoutResponse>("/logout");
    Cookies.remove("token", { path: "/" });
    return httpResponse.data;
  },
  getAll: async (): Promise<TUser[]> => {
    const httpResponse = await HTTP.GET<TUser[]>("/users");
    return httpResponse.data;
  },
  register: async (body: Record<string, any>): Promise<TRegisterResponse> => {
    const httpResponse = await HTTP.POST<TRegisterResponse>("/register", {
      body,
    });
    return httpResponse.data;
  },

  update: async (body: Record<string, any>): Promise<TUpdateResponse> => {
    const token = Cookies.get("token");
    const requestOptions: Parameters<typeof HTTP.PUT>[1] = { body };

    if (token) {
      requestOptions.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const httpResponse = await HTTP.PUT<TUpdateResponse>(
      "/users/update",
      requestOptions
    );
    return httpResponse.data;
  },
};

export default apiAuth;
