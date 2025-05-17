"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import apiAuth from "../app/fetch/fetch.auth";
import Cookies from "js-cookie";
import { apiProjects, IProject } from "../app/fetch/fetch.projects";
type User = {
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role?: string;
  products?: IOrder[];
  projects?: IProject[];
  orders?: IOrder[];
};

type TokenPayload = {
  userId: string;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
};
import { jwtDecode } from "jwt-decode";
import { apiOrders, IOrder } from "../app/fetch/fetch.order";
type AuthContextType = {
  setUserFromToken: (token: string) => void,
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (userData: Partial<User>) => Promise<boolean>;
  addUserProduct: (productData: any) => Promise<boolean>;
  addUserProject: (projectData: any) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function setCookie(name: string, value: string, days = 7): void {
  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}
export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split('; ');
  const found = cookies.find(row => row.startsWith(name + '='));
  return found ? decodeURIComponent(found.split('=')[1]) : null;
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = getCookie("token");
    if (token) {
      try {
        setUserFromToken(token);
      } catch (e) {
        console.error("Invalid token", e);
        logout(); // Log out if token is invalid
      }
    } else if (storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        if (userData.userId && userData.email && userData.name) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (e) {
        console.error("Invalid user data in localStorage", e);
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiAuth.login({ email, password });
      if (response && response.token) {
        setUserFromToken(response.token)
        return true;
      } else {
        throw new Error(`Unexpected status: ${response}`);
      }
    } catch (error: any) {
      setIsAuthenticated(false);
      return false;
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.userId) {
        try {
          const [projectRes, orderRes] = await Promise.all([
            apiProjects.getMyProject(user.userId),
            apiOrders.getInfoOrderByUserId(user.userId),
          ]);
          setUser(currentUser => {
            if (!currentUser) return null;
            return {
              ...currentUser,
              projects: projectRes?.payload?.project || [],
              products: orderRes?.payload?.orders || [],
              orders: orderRes.payload.orders || []
            };
          });
        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu người dùng (sản phẩm/dự án):", err);
          setUser(currentUser => {
            if (!currentUser) return null;
            return {
              ...currentUser,
              projects: [], // Clear old data on error
              products: [], // Clear old data on error
            };
          });
        } finally {
          // setLoadingData(false); // Optional: unset loading state
        }
      } else {
        // If user logs out or becomes null, clear projects and products from state
        setUser(currentUser => {
          if (!currentUser) return null;
          // Keep essential user info, but clear data specific to a logged-in user
          return {
            ...currentUser,
            projects: [],
            products: [],
          };
        });
      }
    };

    fetchUserData();

  }, [user?.userId]);

  const registerUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!userData.email) return false;
      const response = await apiAuth.register(userData);
      if (response.success) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
  const setUserFromToken = (token: string) => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const userData: User = {
        userId: decoded.userId, // Set userId from token
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        products: [],
        projects: [],
      };
      setUser(userData);
      setIsAuthenticated(true);
      setCookie("token", token, 7);
      localStorage.setItem("user", JSON.stringify({
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        phone: undefined,
        address: undefined,
        avatar: undefined,
      }));
    } catch (error) {
      console.error("Error setting user from token:", error);
      logout(); // Log out if token is invalid or decoding fails
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
      users[user.email] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Thêm dự án thất bại:", error);
      return false;
    }
  };
  const logout = async () => {
    localStorage.clear()
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };
  return (
    <AuthContext.Provider
      value={{
        setUserFromToken,
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
