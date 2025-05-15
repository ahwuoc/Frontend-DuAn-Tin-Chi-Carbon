"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import {
  ShoppingCart,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Search,
  Download,
  FileText,
  Settings,
  Trash2,
  Leaf,
  BookOpen,
  Award,
  Package,
  BarChart2,
  Users,
  Zap,
  Shield,
  Globe,
  FileCheck,
  Tag,
} from "lucide-react";

// Định nghĩa kiểu Product
interface Product {
  id: string;
  name: string;
  type: "carbon_credits" | "carbon_accounting" | "international_certificates";
  description: string;
  purchaseDate: string;
  status: "active" | "pending" | "expired";
  expiryDate?: string;
  image?: string;
  features?: string[];
  price?: number;
  usageStats?: {
    totalUsage: number;
    lastMonthUsage: number;
    trend: "up" | "down" | "stable";
  };
  certificationLevel?: string;
  projectLocation?: string;
  carbonAmount?: number;
  carbonUsed?: number;
  verificationStandard?: string;
  courseProgress?: number;
  lastAccessed?: string;
  nextPayment?: string;
  subscriptionTier?: "basic" | "professional" | "enterprise";
  issuer?: string;
}
import { userProducts } from "./data";
export default function ProductsManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [activeTypeTab, setActiveTypeTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Lọc sản phẩm theo trạng thái, loại và tìm kiếm
  const filteredProducts = userProducts.filter((product) => {
    const matchesStatusTab =
      activeTab === "all" || product.status === activeTab;
    const matchesTypeTab =
      activeTypeTab === "all" || product.type === activeTypeTab;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatusTab && matchesTypeTab && matchesSearch;
  });

  // Hiển thị trạng thái sản phẩm
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Đang hoạt động
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Đang xử lý
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Hết hạn
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Định dạng ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Lấy đường dẫn chi tiết sản phẩm
  const getProductDetailLink = (type: string, id: string) => {
    switch (type) {
      case "carbon_credits":
        return `/quan-ly/tin-chi-carbon/${id}`;
      case "carbon_accounting":
        return `/quan-ly/carbon-toan-thu/${id}`;
      case "international_certificates":
        if (id === "ic-001") {
          return `/quan-ly/chung-chi-quoc-te/ic-001`; // Gói Nghiên cứu
        } else if (id === "ic-002") {
          return `/quan-ly/chung-chi-quoc-te/ic-002`; // Gói Chuyên gia
        } else {
          return `/quan-ly/chung-chi-quoc-te/${id}`;
        }
      default:
        return `/quan-ly`;
    }
  };

  // Lấy tên loại sản phẩm
  const getProductTypeName = (type: string) => {
    switch (type) {
      case "carbon_credits":
        return "Tín chỉ Carbon";
      case "carbon_accounting":
        return "Carbon Toàn Thư";
      case "international_certificates":
        return "Chứng chỉ Quốc tế";
      default:
        return type;
    }
  };

  // Lấy icon cho loại sản phẩm
  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case "carbon_credits":
        return <Leaf className="w-5 h-5 text-green-600" />;
      case "carbon_accounting":
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case "international_certificates":
        return <Award className="w-5 h-5 text-yellow-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  // Lấy icon cho tính năng
  const getFeatureIcon = (feature: string) => {
    if (feature.includes("AI") || feature.includes("CarbonSeek")) {
      return <Zap className="w-4 h-4 text-purple-500" />;
    } else if (
      feature.includes("Báo cáo") ||
      feature.includes("ESG") ||
      feature.includes("Kiểm toán")
    ) {
      return <FileCheck className="w-4 h-4 text-blue-500" />;
    } else if (
      feature.includes("Phân tích") ||
      feature.includes("Trend") ||
      feature.includes("Xu hướng")
    ) {
      return <BarChart2 className="w-4 h-4 text-orange-500" />;
    } else if (feature.includes("Cộng đồng") || feature.includes("Tư vấn")) {
      return <Users className="w-4 h-4 text-indigo-500" />;
    } else if (feature.includes("Bảo tồn") || feature.includes("Bảo vệ")) {
      return <Shield className="w-4 h-4 text-green-500" />;
    } else if (feature.includes("Quốc tế") || feature.includes("Toàn cầu")) {
      return <Globe className="w-4 h-4 text-cyan-500" />;
    } else if (
      feature.includes("Chứng nhận") ||
      feature.includes("VCS") ||
      feature.includes("CCB")
    ) {
      return <Tag className="w-4 h-4 text-red-500" />;
    } else {
      return <CheckCircle2 className="w-4 h-4 text-gray-500" />;
    }
  };

  // Hiển thị thông tin bổ sung dựa trên loại sản phẩm
  const renderAdditionalInfo = (product: Product) => {
    switch (product.type) {
      case "carbon_credits":
        return (
          <div className="mt-3 space-y-2">
            {product.projectLocation && (
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="h-4 w-4 mr-2 flex-shrink-0 text-green-600" />
                <span>{product.projectLocation}</span>
              </div>
            )}
            {product.carbonAmount && (
              <div className="flex items-center text-sm text-gray-600">
                <Leaf className="h-4 w-4 mr-2 flex-shrink-0 text-green-600" />
                <span>Tổng tín chỉ: {product.carbonAmount} tCO2e</span>
              </div>
            )}
            {product.carbonUsed !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Đã sử dụng: {product.carbonUsed} tCO2e</span>
                  <span>
                    {Math.round(
                      (product.carbonUsed / product.carbonAmount!) * 100,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(product.carbonUsed / product.carbonAmount!) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      case "carbon_accounting":
        return (
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <BookOpen className="h-4 w-4 mr-2 flex-shrink-0 text-blue-600" />
              <span>Nền tảng tri thức toàn diện về Carbon</span>
            </div>
          </div>
        );
      case "international_certificates":
        return (
          <div className="mt-3 space-y-2">
            {product.issuer && (
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-600" />
                <span>Đơn vị cấp: {product.issuer}</span>
              </div>
            )}
            {product.certificationLevel && (
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-600" />
                <span>Cấp độ: {product.certificationLevel}</span>
              </div>
            )}
            {product.courseProgress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Tiến độ khóa học</span>
                  <span>{product.courseProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${product.courseProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            {product.lastAccessed && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-600" />
                <span>
                  Truy cập gần nhất: {formatDate(product.lastAccessed)}
                </span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Hiển thị sản phẩm dạng lưới
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
          >
            <div className="relative h-48 w-full">
              <Image
                src={product.image || "/placeholder.svg?height=200&width=400"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2">
                {getStatusBadge(product.status)}
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                    Ngày mua: {formatDate(product.purchaseDate)}
                  </CardDescription>
                </div>
                <div className="flex items-center">
                  {getProductTypeIcon(product.type)}
                  <Badge variant="outline" className="ml-2">
                    {getProductTypeName(product.type)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600 line-clamp-3">
                {product.description}
              </p>

              {renderAdditionalInfo(product)}

              {product.features && product.features.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Tính năng chính:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700"
                      >
                        {getFeatureIcon(feature)}
                        <span className="ml-1">{feature}</span>
                      </div>
                    ))}
                    {product.features.length > 3 && (
                      <div className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700">
                        +{product.features.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {product.expiryDate && (
                <p className="text-sm text-gray-500 mt-3 flex items-center">
                  <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                  Hết hạn: {formatDate(product.expiryDate)}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 pt-0">
              <Link
                href={getProductDetailLink(product.type, product.id)}
                className="flex-1"
              >
                <Button
                  variant="default"
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Quản lý
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="p-2">
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">Xem chi tiết</span>
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Cài đặt</span>
                </Button>
                {product.status !== "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Xóa</span>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  // Hiển thị sản phẩm dạng danh sách
  const renderListView = () => {
    return (
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                <Image
                  src={product.image || "/placeholder.svg?height=200&width=400"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              </div>
              <div className="flex flex-col flex-grow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      Ngày mua: {formatDate(product.purchaseDate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(product.status)}
                    <Badge variant="outline" className="flex items-center">
                      {getProductTypeIcon(product.type)}
                      <span className="ml-1">
                        {getProductTypeName(product.type)}
                      </span>
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {product.description}
                </p>

                {renderAdditionalInfo(product)}

                {product.features && product.features.length > 0 && (
                  <div className="mt-auto pt-3">
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700"
                        >
                          {getFeatureIcon(feature)}
                          <span className="ml-1">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <div className="flex items-center">
                    {product.price && (
                      <span className="text-sm font-medium text-gray-700">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                    {product.expiryDate && (
                      <span className="text-sm text-gray-500 ml-4 flex items-center">
                        <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                        Hết hạn: {formatDate(product.expiryDate)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={getProductDetailLink(product.type, product.id)}>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Quản lý
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-gray-500 mt-1">
            Quản lý tất cả sản phẩm và dịch vụ bạn đã đăng ký
          </p>
        </div>
        <Button
          onClick={() => router.push("/san-pham")}
          className="bg-green-600 hover:bg-green-700"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Mua thêm sản phẩm
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 ${viewMode === "grid" ? "bg-green-50 text-green-600" : "bg-white text-gray-600"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 ${viewMode === "list" ? "bg-green-50 text-green-600" : "bg-white text-gray-600"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Xuất
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium text-lg mb-4">Loại sản phẩm</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTypeTab("all")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTypeTab === "all"
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Package className="w-5 h-5 mr-3" />
                Tất cả sản phẩm
              </button>
              <button
                onClick={() => setActiveTypeTab("carbon_credits")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTypeTab === "carbon_credits"
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Leaf className="w-5 h-5 mr-3" />
                Tín chỉ Carbon
              </button>
              <button
                onClick={() => setActiveTypeTab("carbon_accounting")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTypeTab === "carbon_accounting"
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Carbon Toàn Thư
              </button>
              <button
                onClick={() => setActiveTypeTab("international_certificates")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTypeTab === "international_certificates"
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Award className="w-5 h-5 mr-3" />
                Chứng chỉ Quốc tế
              </button>
            </div>

            <h3 className="font-medium text-lg mt-8 mb-4">Trạng thái</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "all"
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Tất cả trạng thái
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "active"
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                Đang hoạt động
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "pending"
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                Đang xử lý
              </button>
              <button
                onClick={() => setActiveTab("expired")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "expired"
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                Hết hạn
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm của
                bạn.
              </p>
              <Button
                onClick={() => {
                  setActiveTab("all");
                  setActiveTypeTab("all");
                  setSearchTerm("");
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Xem tất cả sản phẩm
              </Button>
            </div>
          ) : (
            <div>
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all"></TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  {viewMode === "grid" ? renderGridView() : renderListView()}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
