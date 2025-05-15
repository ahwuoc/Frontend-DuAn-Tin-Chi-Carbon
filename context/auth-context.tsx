"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import apiAuth from "../app/fetch/fetch.auth";
import Cookies from "js-cookie";
type User = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  products?: Array<{
    id: string;
    name: string;
    purchaseDate: string;
    expiryDate?: string;
    status: "active" | "pending" | "expired";
  }>;
  projects?: Array<{
    id: string;
    type: "forest" | "rice" | "biochar";
    name: string;
    registrationDate: string;
    status: "pending" | "approved" | "in_progress" | "completed";
  }>;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (userData: Partial<User>) => Promise<boolean>;
  addUserProduct: (productData: any) => Promise<boolean>;
  addUserProject: (projectData: any) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Lỗi khi parse user từ localStorage:", error);
      localStorage.removeItem("user");
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiAuth.login({ email, password });
      if (response.userData && response.token) {
        const token = response.token;
        const userData = response.userData;
        localStorage.setItem("token", String(token));
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("user_id", JSON.stringify(userData._id));
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error(`Unexpected status: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const registerUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!userData.email) return false;
      const response = await apiAuth.register(userData);
      if (response.status !== 200) {
        return false;
      }
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : {};

      users[userData.email] = {
        ...users[userData.email],
        ...userData,
        products: users[userData.email]?.products || [],
        projects: users[userData.email]?.projects || [],
      };
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("user", JSON.stringify(users[userData.email]));
      return true;
    } catch (error) {
      return false;
    }
  };
  const addUserProduct = async (productData: any): Promise<boolean> => {
    try {
      if (!user || !user.email) {
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : {};

      if (!users[user.email]) {
        return false;
      }
      const updatedUser = {
        ...users[user.email],
        products: [
          ...(users[user.email].products || []),
          {
            ...productData,
            id: `product_${Date.now()}`,
            purchaseDate: new Date().toISOString(),
            status: "pending",
          },
        ],
      };
      users[user.email] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Thêm sản phẩm thất bại:", error);
      return false;
    }
  };

  const addUserProject = async (projectData: any): Promise<boolean> => {
    try {
      if (!user || !user.email) {
        return false;
      }

      // Giả lập API thêm dự án
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Lấy danh sách người dùng từ localStorage
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : {};

      if (!users[user.email]) {
        return false;
      }

      // Thêm dự án vào danh sách dự án của người dùng
      const updatedUser = {
        ...users[user.email],
        projects: [
          ...(users[user.email].projects || []),
          {
            ...projectData,
            id: `project_${Date.now()}`,
            registrationDate: new Date().toISOString(),
            status: "pending",
          },
        ],
      };

      // Cập nhật người dùng trong danh sách
      users[user.email] = updatedUser;

      // Lưu danh sách người dùng vào localStorage
      localStorage.setItem("users", JSON.stringify(users));

      // Cập nhật trạng thái người dùng hiện tại
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return true;
    } catch (error) {
      console.error("Thêm dự án thất bại:", error);
      return false;
    }
  };
  ``;
  const clearAllCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };

  const logout = async () => {
    localStorage.clear();
    clearAllCookies();
    const response = await apiAuth.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        registerUser,
        addUserProduct,
        addUserProject,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
