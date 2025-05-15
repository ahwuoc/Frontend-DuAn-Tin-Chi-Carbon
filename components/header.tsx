"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Phone, Mail, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";

// Thêm import useAuth
import { useAuth } from "@/context/auth-context";

// Thêm import các icon cần thiết
import { User, LogOut } from "lucide-react";

// Thêm import DropdownMenu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Trong component Header, thêm useAuth
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  // Các state và hook hiện có
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Thêm useAuth hook
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: language === "vi" ? "Trang chủ" : "Home", href: "/" },
    { name: language === "vi" ? "Giới thiệu" : "About", href: "/gioi-thieu" },
    {
      name: language === "vi" ? "Sản phẩm" : "Products",
      href: "/san-pham",
      hasDropdown: true,
      dropdownItems: [
        {
          name: language === "vi" ? "Carbon Toàn Thư" : "Carbon Encyclopedia",
          href: "/san-pham/carbon-toan-thu",
        },
        {
          name:
            language === "vi"
              ? "Dự án tín chỉ carbon"
              : "Carbon Credit Projects",
          href: "/san-pham/du-an-tin-chi-carbon",
        },
        {
          name:
            language === "vi"
              ? "Khóa học chứng chỉ quốc tế"
              : "International Certificate Courses",
          href: "/san-pham/khoa-hoc-chung-chi-quoc-te",
        },
      ],
    },
    { name: language === "vi" ? "Tin tức" : "News", href: "/tin-tuc" },
    {
      name: language === "vi" ? "Góp mầm xanh" : "Green Seedlings",
      href: "/gop-mam-xanh",
    },
    {
      name:
        language === "vi"
          ? "Chương trình tiếp thị liên kết"
          : "Affiliate Program",
      href: "/chuong-trinh-tiep-thi-lien-ket",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-green-600 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>092.3370.804 | 036.4444.888</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>minhtq@carboncreditvietnam.vn</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={toggleLanguage}
              >
                <div className="relative h-4 w-6">
                  <Image
                    src={
                      language === "vi"
                        ? "/images/vietnam-flag.png"
                        : "/images/us-flag.png"
                    }
                    alt={language === "vi" ? "Tiếng Việt" : "English"}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <span className="text-sm">
                  {language === "vi" ? "Tiếng Việt" : "English"}
                </span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Fixed height to prevent jumping */}
      <header
        className="bg-white shadow-sm sticky top-0 z-50 h-16"
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center transform-gpu">
          <div className="flex items-center justify-between w-full h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div
                className="relative h-10 w-48"
                style={{
                  transformOrigin: "left center",
                }}
              >
                <Image
                  src={
                    language === "vi"
                      ? "/images/logo-vietnamese.jpg"
                      : "/images/logo-english.jpg"
                  }
                  alt={
                    language === "vi"
                      ? "Tín Chỉ Carbon Việt Nam"
                      : "Vietnam Carbon Credits"
                  }
                  fill
                  priority
                  sizes="(max-width: 768px) 150px, 200px"
                  className="object-contain"
                  style={{ objectPosition: "left" }}
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) =>
                item.hasDropdown ? (
                  <div key={index} className="relative group">
                    <Link
                      href={item.href}
                      className={`text-sm font-medium transition-colors hover:text-green-600 relative group inline-flex items-center ${
                        pathname === item.href
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                      <span
                        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full ${
                          pathname === item.href ? "w-full" : "w-0"
                        }`}
                      ></span>
                    </Link>
                    <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="py-1 bg-white rounded-md shadow-lg border border-gray-200">
                        {item.dropdownItems.map(
                          (dropdownItem, dropdownIndex) => (
                            <Link
                              key={dropdownIndex}
                              href={dropdownItem.href}
                              className={`block px-4 py-2 text-sm hover:bg-green-50 hover:text-green-600 ${
                                pathname === dropdownItem.href
                                  ? "text-green-600 bg-green-50"
                                  : "text-gray-700"
                              }`}
                            >
                              {dropdownItem.name}
                            </Link>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={index}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-green-600 relative group ${
                      pathname === item.href
                        ? "text-green-600"
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full ${
                        pathname === item.href ? "w-full" : "w-0"
                      }`}
                    ></span>
                  </Link>
                ),
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                className="text-gray-700 hover:text-green-600 hover:bg-gray-100"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Login Button */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/quan-ly" className="cursor-pointer">
                        {language === "vi" ? "Bảng điều khiển" : "Dashboard"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/quan-ly/cai-dat" className="cursor-pointer">
                        {language === "vi" ? "Cài đặt" : "Settings"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={() => {
                        logout();
                        // Có thể thêm chuyển hướng sau khi đăng xuất nếu cần
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{language === "vi" ? "Đăng xuất" : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    href="/dang-nhap"
                    className="hidden md:flex items-center justify-center min-w-[120px] px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {language === "vi" ? "Đăng nhập" : "Login"}
                  </Link>
                </>
              )}

              {/* Contact Button */}
              <Link href="/dang-ky-tu-van">
                <Button className="bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105 min-w-[120px] px-4">
                  {language === "vi" ? "Liên hệ" : "Contact"}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu and Search Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                className="text-gray-700"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md z-50 py-4 px-4 border-t border-gray-200">
            <form
              onSubmit={handleSearch}
              className="container mx-auto flex items-center"
            >
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder={language === "vi" ? "Tìm kiếm..." : "Search..."}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Button
                type="submit"
                className="ml-2 bg-green-600 hover:bg-green-700"
              >
                {language === "vi" ? "Tìm kiếm" : "Search"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="ml-2 text-gray-500"
                onClick={toggleSearch}
              >
                <X className="h-5 w-5" />
              </Button>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <div key={index}>
                    {item.hasDropdown ? (
                      <>
                        <Link
                          href={item.href}
                          className={`text-sm font-medium transition-colors hover:text-green-600 ${
                            pathname === item.href
                              ? "text-green-600"
                              : "text-gray-700"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                        <div className="ml-4 mt-2 space-y-2">
                          {item.dropdownItems.map(
                            (dropdownItem, dropdownIndex) => (
                              <Link
                                key={dropdownIndex}
                                href={dropdownItem.href}
                                className={`block text-sm hover:text-green-600 ${
                                  pathname === dropdownItem.href
                                    ? "text-green-600"
                                    : "text-gray-600"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {dropdownItem.name}
                              </Link>
                            ),
                          )}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`text-sm font-medium transition-colors hover:text-green-600 ${
                          pathname === item.href
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile Language Switcher */}
                <div
                  className="flex items-center space-x-2 cursor-pointer py-2"
                  onClick={toggleLanguage}
                >
                  <div className="relative h-5 w-7">
                    <Image
                      src={
                        language === "vi"
                          ? "/images/vietnam-flag.png"
                          : "/images/us-flag.png"
                      }
                      alt={language === "vi" ? "Tiếng Việt" : "English"}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {language === "vi" ? "Tiếng Việt" : "English"}
                  </span>
                </div>

                {/* Mobile Contact Info */}
                <div className="py-2 space-y-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-green-600" />
                    <span>092.3370.804 | 036.4444.888</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Mail className="h-4 w-4 mr-2 text-green-600" />
                    <span>minhtq@carboncreditvietnam.vn</span>
                  </div>
                </div>

                {/* Mobile Login Button */}
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/quan-ly"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {language === "vi" ? "Bảng điều khiển" : "Dashboard"}
                    </Link>
                    <button
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      {language === "vi" ? "Đăng xuất" : "Logout"}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/dang-nhap"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === "vi" ? "Đăng nhập" : "Login"}
                  </Link>
                )}

                {/* Mobile Contact Button */}
                <Link
                  href="/dang-ky-tu-van"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="bg-green-600 hover:bg-green-700 w-full">
                    {language === "vi" ? "Liên hệ" : "Contact"}
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
