"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import {
  Home,
  Package,
  CreditCard,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Share2,
  Users,
  ShoppingCart,
  BarChart,
  MessageSquare,
  Newspaper,
  Folder,
  UserCheck,
  Handshake,
  FolderKanban,
  MessageSquareText,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    // Đóng menu di động khi chuyển trang
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) =>
      prev.includes(menu)
        ? prev.filter((item) => item !== menu)
        : [...prev, menu],
    );
  };

  const menuItems = [
    {
      title: language === "vi" ? "Tổng quan" : "Dashboard",
      icon: <Home className="w-5 h-5" />,
      href: "/quan-ly",
    },
    {
      title: language === "vi" ? "Dự án của tôi" : "My Projects",
      icon: <Package className="w-5 h-5" />,
      href: "/quan-ly/du-an",
    },
    {
      title: language === "vi" ? "Sản phẩm của tôi" : "My Products",
      icon: <Package className="w-5 h-5" />,
      href: "/quan-ly/san-pham",
    },
    {
      title: language === "vi" ? "Tiếp thị liên kết" : "Affiliate Program",
      icon: <Share2 className="w-5 h-5" />,
      href: "/quan-ly/tiep-thi-lien-ket",
    },
    {
      title: language === "vi" ? "Thanh toán" : "Billing",
      icon: <CreditCard className="w-5 h-5" />,
      href: "/quan-ly/thanh-toan",
    },
    {
      title: language === "vi" ? "Cài đặt" : "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/quan-ly/cai-dat",
    },
  ];

  const adminMenuItems = [
    {
      title: language === "vi" ? "Người dùng" : "Users",
      icon: <Users className="w-5 h-5" />,
      href: "/quan-ly/admin/users",
    },
    {
      title: language === "vi" ? "Đơn hàng" : "Orders",
      icon: <ShoppingCart className="w-5 h-5" />,
      href: "/quan-ly/admin/orders",
    },
    {
      title: language === "vi" ? "Sản phẩm" : "Products",
      icon: <Package className="w-5 h-5" />,
      href: "/quan-ly/admin/products",
    },
    {
      title: language === "vi" ? "Affiliate" : "Affiliate",
      icon: <Handshake className="w-5 h-5" />,
      href: "/quan-ly/admin/affiliate",
    },
    {
      title: language === "vi" ? "Tin tức" : "News",
      icon: <Newspaper className="w-5 h-5" />,
      href: "/quan-ly/admin/news",
    },
    {
      title: language === "vi" ? "Người quyên góp" : "Donors",
      icon: <UserCheck className="w-5 h-5" />,
      href: "/quan-ly/admin/green-community",
    },
    {
      title: language === "vi" ? "Dự án" : "Projects",
      icon: <FolderKanban className="w-5 h-5" />,
      href: "/quan-ly/admin/projects",
    },
    {
      title: language === "vi" ? "Tư vấn" : "Consulting",
      icon: <MessageSquareText className="w-5 h-5" />,
      href: "/quan-ly/admin/consultations",
    },
    {
      title: language === "vi" ? "Quản lý dụ án chứng chỉ" : "Consulting",
      icon: <MessageSquareText className="w-5 h-5" />,
      href: "/quan-ly/admin/certificates",
    },
    {
      title: language === "vi" ? "Quản lý dụ án carboncredits" : "Consulting",
      icon: <MessageSquareText className="w-5 h-5" />,
      href: "/quan-ly/admin/carboncredits",
    },

  ];
  const isActive = (href: string) => pathname === href;

  const hankderRemove = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
  };

  const mobileMenuButton = (
    <Button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
      aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
      variant="ghost"
    >
      {isMobileMenuOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </Button>
  );

  return (
    <>
      {mobileMenuButton}

      <div
        className={`
        ${isMobile && !isMobileMenuOpen ? "-translate-x-full" : "translate-x-0"}
        transition-transform duration-300 ease-in-out
        w-full md:w-64 bg-white border-r border-gray-200
        fixed md:sticky top-0 left-0 h-screen z-40
        overflow-y-auto
      `}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-green-100 p-2 rounded-full">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {user?.name || t("user_dashboard") || "Tài khoản"}
              </h3>
              {user?.role === "admin" && (
                <p className="text-xs text-green-600">Admin Mode 😎</p>
              )}
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <div key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive(item.href)
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              </div>
            ))}

            {user?.role === "admin" && (
              <div className="mt-4">
                <button
                  onClick={() => toggleMenu("admin")}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 w-full"
                >
                  <Users className="w-5 h-5 mr-3" />
                  {language === "vi" ? "Quản trị" : "Admin"}
                  <span className="ml-auto">
                    {openMenus.includes("admin") ? "▲" : "▼"}
                  </span>
                </button>
                {openMenus.includes("admin") && (
                  <div className="pl-6 space-y-1">
                    {adminMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive(item.href)
                          ? "bg-green-50 text-green-600"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        <div className="border-t border-gray-200 p-4">
          <Link
            href="/"
            onClick={hankderRemove}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            {language === "vi" ? "Đăng xuất" : "Logout"}
          </Link>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
