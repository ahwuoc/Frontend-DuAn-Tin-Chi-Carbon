"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductFilter } from "./components/product-filter";
import { ProductSidebar } from "./components/product-sidebar";
import { EmptyState } from "./components/empty-state";
import { Product } from "./components/type";
import { userProducts } from "./data";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Award,
  BarChart2,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck,
  Globe,
  Leaf,
  Package,
  Shield,
  ShoppingCart,
  Tag,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiCarbon } from "@/app/fetch/fetch.carbon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductTabs } from "./components/product-tab";

export default function ProductsManagementPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [activeTypeTab, setActiveTypeTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
    const fetchProductByUser = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user_id")) ?? undefined;
        if (!userId) {
          console.warn("No user ID found in localStorage");
          setProducts(userProducts);
          return;
        }
        const response = await apiCarbon.getOrderByUser(userId);
        if (response.status === 200) {
          const { orders = [], products = [] } = response.data ?? {};
          setOrders(orders);
          setProducts(products.length > 0 ? products : userProducts);
          setPendingOrders(
            orders.filter((order: any) => order.status === "pending"),
          );
        } else {
          console.warn("Failed to fetch data, using fallback products");
        }
      } catch (error) {
        console.error("Error fetching products and orders:", error);
      }
    };
    fetchProductByUser();
  }, []);

  // Lọc sản phẩm đã thanh toán (loại bỏ sản phẩm liên quan đến đơn hàng pending)
  const filteredProducts = products.filter((product) => {
    const relatedOrder = orders.find(
      (order) => order.productId === product._id && order.status === "pending",
    );
    if (relatedOrder) {
      return false; // Loại bỏ sản phẩm nếu có đơn hàng pending
    }

    const matchesStatusTab =
      activeTab === "all" || product.status === activeTab;
    const matchesTypeTab =
      activeTypeTab === "all" || product.type === activeTypeTab;
    const matchesSearch =
      (product.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase() ?? "").includes(
        searchTerm.toLowerCase(),
      );
    return matchesStatusTab | matchesTypeTab && matchesSearch;
  });

  // Lấy sản phẩm cho đơn hàng pending
  const pendingProducts = pendingOrders
    .map((order) => ({
      order,
      product: products.find((p) => p._id === order.productId),
    }))
    .filter((item) => item.product); // Loại bỏ nếu không tìm thấy sản phẩm

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
            {status || "Không xác định"}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    if (!amount && amount !== 0) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getProductTypeName = (type: string) => {
    switch (type) {
      case "carbon_credits":
        return "Tín chỉ Carbon";
      case "carbon_accounting":
        return "Carbon Toàn Thư";
      case "international_certificates":
        return "Chứng chỉ Quốc tế";
      default:
        return type || "Không xác định";
    }
  };

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

  const getFeatureIcon = (feature: any) => {
    const text =
      `${feature.title ?? ""} ${feature.description ?? ""}`.toLowerCase();

    if (text.includes("ai") || text.includes("carbonseek")) {
      return <Zap className="w-4 h-4 text-purple-500" />;
    } else if (
      text.includes("báo cáo") ||
      text.includes("esg") ||
      text.includes("kiểm toán")
    ) {
      return <FileCheck className="w-4 h-4 text-blue-500" />;
    } else if (
      text.includes("phân tích") ||
      text.includes("trend") ||
      text.includes("xu hướng")
    ) {
      return <BarChart2 className="w-4 h-4 text-orange-500" />;
    } else if (text.includes("cộng đồng") || text.includes("tư vấn")) {
      return <Users className="w-4 h-4 text-indigo-500" />;
    } else if (text.includes("bảo tồn") || text.includes("bảo vệ")) {
      return <Shield className="w-4 h-4 text-green-500" />;
    } else if (text.includes("quốc tế") || text.includes("toàn cầu")) {
      return <Globe className="w-4 h-4 text-cyan-500" />;
    } else if (
      text.includes("chứng nhận") ||
      text.includes("vcs") ||
      text.includes("ccb")
    ) {
      return <Tag className="w-4 h-4 text-red-500" />;
    } else {
      return <CheckCircle2 className="w-4 h-4 text-gray-500" />;
    }
  };

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
            {product.carbonUsed !== undefined && product.carbonAmount && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Đã sử dụng: {product.carbonUsed} tCO2e</span>
                  <span>
                    {Math.round(
                      (product.carbonUsed / product.carbonAmount) * 100,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(product.carbonUsed / product.carbonAmount) * 100}%`,
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

  const resetFilters = () => {
    setActiveTab("all");
    setActiveTypeTab("all");
    setSearchTerm("");
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

      {/* Hiển thị danh sách sản phẩm chưa thanh toán */}
      {pendingProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Sản phẩm chưa thanh toán
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingProducts.map(({ order, product }) => (
              <Card
                key={order._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    {product.name ?? "Không có tiêu đề"}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Mã đơn hàng: {order.orderCode}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {product.description ?? "Không có mô tả"}
                    </p>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>Số tiền: {formatCurrency(order.amount)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>Hết hạn: {formatDate(order.expiredAt)}</span>
                    </div>
                    {order.linkthanhtoan && (
                      <Button
                        asChild
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        <a
                          href={order.linkthanhtoan}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Thanh toán ngay
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <ProductFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <ProductSidebar
            activeTypeTab={activeTypeTab}
            setActiveTypeTab={setActiveTypeTab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 && pendingProducts.length === 0 ? (
            <EmptyState resetFilters={resetFilters} />
          ) : (
            filteredProducts.length > 0 && (
              <ProductTabs
                products={filteredProducts}
                viewMode={viewMode}
                getStatusBadge={getStatusBadge}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
                getProductTypeName={getProductTypeName}
                getProductTypeIcon={getProductTypeIcon}
                getFeatureIcon={getFeatureIcon}
                renderAdditionalInfo={renderAdditionalInfo}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
