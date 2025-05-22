"use client";

import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import { ProductFilter } from "./components/product-filter";
import { ProductSidebar } from "./components/product-sidebar";
import { EmptyState } from "./components/empty-state";
import { Product } from "./components/type";
import { userProducts } from "./data"; // This is your fallback data
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductTabs } from "./components/product-tab";
import { apiOrders } from "../../fetch/fetch.order";
import { getUserFromLocalStorage } from "../../utils/common";
import { useLanguage } from "@/context/language-context"; // Import language hook
import productsManagementTranslations from "./langauge_page";

export default function ProductsManagementPage() {
  const router = useRouter();
  const { language } = useLanguage(); // Get current language

  const [activeTab, setActiveTab] = useState("all");
  const [activeTypeTab, setActiveTypeTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]); // Products the user has bought (active/completed)
  const [orders, setOrders] = useState<any[]>([]); // All orders, including pending
  const [pendingOrders, setPendingOrders] = useState<any[]>([]); // Only pending orders

  useEffect(() => {
    const fetchProductByUser = async () => {
      const user = getUserFromLocalStorage();
      try {
        if (!user?.userId) {
          console.warn("No user ID found in localStorage");
          return;
        }
        const response = await apiOrders.getOrderByUser(user.userId);
        if (response.status === 200) {
          const { orders = [], products = [] } = response.payload ?? {};
          setOrders(orders);
          setProducts(products.length > 0 ? products : userProducts); // Fallback to userProducts if API returns empty
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

  // Filter out products that have a pending order
  const filteredProducts = products.filter((product) => {
    const isPending = pendingOrders.some(
      (order) => order.productId === product._id && order.status === "pending",
    );
    if (isPending) {
      return false;
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
    return matchesStatusTab && matchesTypeTab && matchesSearch;
  });

  // Combine product and order data for pending items
  const pendingProducts = pendingOrders
    .map((order) => ({
      order,
      product: products.find((p) => p._id === order.productId),
    }))
    .filter((item) => item.product); // Ensure product data is available

  const getStatusBadge = (status: string) => {
    const statusText =
      productsManagementTranslations.statusBadges[
        status as keyof typeof productsManagementTranslations.statusBadges
      ]?.[language] ||
      productsManagementTranslations.statusBadges.unknown[language];

    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {statusText}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {statusText}
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {statusText}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {statusText}
          </Badge>
        );
    }
  };

  const getProductDetailLink = (productId: string) => `/products/${productId}`;

  const formatDate = (dateString: string) => {
    if (!dateString)
      return productsManagementTranslations.misc.notSpecified[language];
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined)
      return `0 ${productsManagementTranslations.misc.currency[language]}`;
    return new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: productsManagementTranslations.misc.currency[language],
    }).format(amount);
  };

  const getProductTypeName = (type: string) => {
    const typeKey =
      type as keyof typeof productsManagementTranslations.productTypes;
    return (
      productsManagementTranslations.productTypes[typeKey]?.[language] ||
      productsManagementTranslations.productTypes.default[language]
    );
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
      text.includes("kiểm toán") ||
      text.includes("report") ||
      text.includes("audit")
    ) {
      return <FileCheck className="w-4 h-4 text-blue-500" />;
    } else if (
      text.includes("phân tích") ||
      text.includes("trend") ||
      text.includes("xu hướng") ||
      text.includes("analysis")
    ) {
      return <BarChart2 className="w-4 h-4 text-orange-500" />;
    } else if (
      text.includes("cộng đồng") ||
      text.includes("tư vấn") ||
      text.includes("community") ||
      text.includes("consultation")
    ) {
      return <Users className="w-4 h-4 text-indigo-500" />;
    } else if (
      text.includes("bảo tồn") ||
      text.includes("bảo vệ") ||
      text.includes("conservation") ||
      text.includes("protection")
    ) {
      return <Shield className="w-4 h-4 text-green-500" />;
    } else if (
      text.includes("quốc tế") ||
      text.includes("toàn cầu") ||
      text.includes("international") ||
      text.includes("global")
    ) {
      return <Globe className="w-4 h-4 text-cyan-500" />;
    } else if (
      text.includes("chứng nhận") ||
      text.includes("vcs") ||
      text.includes("ccb") ||
      text.includes("certification")
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
                <span>
                  {
                    productsManagementTranslations.additionalInfo.carbonCredits
                      .projectLocation[language]
                  }{" "}
                  {product.projectLocation}
                </span>
              </div>
            )}
            {product.carbonAmount && (
              <div className="flex items-center text-sm text-gray-600">
                <Leaf className="h-4 w-4 mr-2 flex-shrink-0 text-green-600" />
                <span>
                  {
                    productsManagementTranslations.additionalInfo.carbonCredits
                      .totalCredits[language]
                  }{" "}
                  {product.carbonAmount}{" "}
                  {
                    productsManagementTranslations.additionalInfo.carbonCredits
                      .unit[language]
                  }
                </span>
              </div>
            )}
            {product.carbonUsed !== undefined && product.carbonAmount && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>
                    {
                      productsManagementTranslations.additionalInfo
                        .carbonCredits.usedCredits[language]
                    }{" "}
                    {product.carbonUsed}{" "}
                    {
                      productsManagementTranslations.additionalInfo
                        .carbonCredits.unit[language]
                    }
                  </span>
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
              <span>
                {
                  productsManagementTranslations.additionalInfo.carbonAccounting
                    .description[language]
                }
              </span>
            </div>
          </div>
        );
      case "international_certificates":
        return (
          <div className="mt-3 space-y-2">
            {product.issuer && (
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-600" />
                <span>
                  {
                    productsManagementTranslations.additionalInfo
                      .internationalCertificates.issuer[language]
                  }{" "}
                  {product.issuer}
                </span>
              </div>
            )}
            {product.certificationLevel && (
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-600" />
                <span>
                  {
                    productsManagementTranslations.additionalInfo
                      .internationalCertificates.certificationLevel[language]
                  }{" "}
                  {product.certificationLevel}
                </span>
              </div>
            )}
            {product.courseProgress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>
                    {
                      productsManagementTranslations.additionalInfo
                        .internationalCertificates.courseProgress[language]
                    }
                  </span>
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
                  {
                    productsManagementTranslations.additionalInfo
                      .internationalCertificates.lastAccessed[language]
                  }{" "}
                  {formatDate(product.lastAccessed)}
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
          <h1 className="text-3xl font-bold">
            {productsManagementTranslations.pageHeader.title[language]}
          </h1>
          <p className="text-gray-500 mt-1">
            {productsManagementTranslations.pageHeader.description[language]}
          </p>
        </div>
        <Button
          onClick={() => router.push("/san-pham")}
          className="bg-green-600 hover:bg-green-700"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {productsManagementTranslations.pageHeader.buyMoreButton[language]}
        </Button>
      </div>

      {/* Display pending products list */}
      {pendingProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {productsManagementTranslations.pendingProducts.title[language]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingProducts.map(({ order, product }) =>
              product ? (
                <Card
                  key={order._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {product.name ??
                        productsManagementTranslations.misc.notAvailable[
                          language
                        ]}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>
                        {
                          productsManagementTranslations.pendingProducts
                            .orderCode[language]
                        }{" "}
                        {order.orderCode}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {product.description ??
                          productsManagementTranslations.misc.noDescription[
                            language
                          ]}
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>
                          {
                            productsManagementTranslations.pendingProducts
                              .amount[language]
                          }{" "}
                          {formatCurrency(order.amount)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>
                          {
                            productsManagementTranslations.pendingProducts
                              .expires[language]
                          }{" "}
                          {formatDate(order.expiredAt)}
                        </span>
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
                            {
                              productsManagementTranslations.pendingProducts
                                .payNowButton[language]
                            }
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div key={order._id} className="p-4 text-red-500">
                  {
                    productsManagementTranslations.pendingProducts
                      .productNotFound[language]
                  }
                </div>
              ),
            )}
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
            <EmptyState
              resetFilters={resetFilters}
              translations={{
                title:
                  productsManagementTranslations.emptyState.title[language],
                description:
                  productsManagementTranslations.emptyState.description[
                    language
                  ],
                resetButton:
                  productsManagementTranslations.emptyState.resetButton[
                    language
                  ],
              }}
            />
          ) : (
            filteredProducts.length > 0 && (
              <ProductTabs
                products={products} // This should likely be `filteredProducts` for the tab content
                viewMode="grid"
                getStatusBadge={getStatusBadge}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
                getProductTypeName={getProductTypeName}
                getProductTypeIcon={getProductTypeIcon}
                getFeatureIcon={getFeatureIcon}
                getProductDetailLink={getProductDetailLink}
                renderAdditionalInfo={renderAdditionalInfo}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
