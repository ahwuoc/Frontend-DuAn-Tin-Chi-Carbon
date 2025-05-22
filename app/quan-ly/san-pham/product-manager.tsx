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
  Filter,
  Search,
  Download,
  FileText,
  Settings,
  Trash2,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductTabs } from "./components/product-tab";
import { apiOrders } from "../../fetch/fetch.order";
import { getUserFromLocalStorage } from "../../utils/common";
import { useLanguage } from "@/context/language-context"; // Import language hook
import productsManagementTranslations from "./langauge-manager";

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
  const pendingProductsList = pendingOrders
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

  const getFeatureIcon = (feature: string) => {
    // Standardize feature text for icon matching
    const lowerCaseFeature = feature.toLowerCase();

    if (
      lowerCaseFeature.includes("ai") ||
      lowerCaseFeature.includes("carbonseek")
    ) {
      return <Zap className="w-4 h-4 text-purple-500" />;
    } else if (
      lowerCaseFeature.includes("báo cáo") ||
      lowerCaseFeature.includes("esg") ||
      lowerCaseFeature.includes("kiểm toán") ||
      lowerCaseFeature.includes("report") ||
      lowerCaseFeature.includes("audit")
    ) {
      return <FileCheck className="w-4 h-4 text-blue-500" />;
    } else if (
      lowerCaseFeature.includes("phân tích") ||
      lowerCaseFeature.includes("trend") ||
      lowerCaseFeature.includes("xu hướng") ||
      lowerCaseFeature.includes("analysis")
    ) {
      return <BarChart2 className="w-4 h-4 text-orange-500" />;
    } else if (
      lowerCaseFeature.includes("cộng đồng") ||
      lowerCaseFeature.includes("tư vấn") ||
      lowerCaseFeature.includes("community") ||
      lowerCaseFeature.includes("consultation")
    ) {
      return <Users className="w-4 h-4 text-indigo-500" />;
    } else if (
      lowerCaseFeature.includes("bảo tồn") ||
      lowerCaseFeature.includes("bảo vệ") ||
      lowerCaseFeature.includes("conservation") ||
      lowerCaseFeature.includes("protection")
    ) {
      return <Shield className="w-4 h-4 text-green-500" />;
    } else if (
      lowerCaseFeature.includes("quốc tế") ||
      lowerCaseFeature.includes("toàn cầu") ||
      lowerCaseFeature.includes("international") ||
      lowerCaseFeature.includes("global")
    ) {
      return <Globe className="w-4 h-4 text-cyan-500" />;
    } else if (
      lowerCaseFeature.includes("chứng nhận") ||
      lowerCaseFeature.includes("vcs") ||
      lowerCaseFeature.includes("ccb") ||
      lowerCaseFeature.includes("certification")
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

  // Render Grid View
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product._id} // Assuming _id is available from API
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
                    {product.name ??
                      productsManagementTranslations.misc.notAvailable[
                        language
                      ]}
                  </CardTitle>
                  <CardDescription className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                    {
                      productsManagementTranslations.productDetails
                        .purchaseDate[language]
                    }{" "}
                    {formatDate(product.purchaseDate)}
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
                {product.description ??
                  productsManagementTranslations.misc.noDescription[language]}
              </p>

              {renderAdditionalInfo(product)}

              {product.features && product.features.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {
                      productsManagementTranslations.productDetails.keyFeatures[
                        language
                      ]
                    }
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
                  {
                    productsManagementTranslations.productDetails.expires[
                      language
                    ]
                  }{" "}
                  {formatDate(product.expiryDate)}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 pt-0">
              <Link
                href={getProductDetailLink(product.type, product._id)}
                className="flex-1"
              >
                <Button
                  variant="default"
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {
                    productsManagementTranslations.productDetails.manageButton[
                      language
                    ]
                  }
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="p-2">
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">
                    {
                      productsManagementTranslations.productDetails
                        .viewDetailsSrOnly[language]
                    }
                  </span>
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">
                    {
                      productsManagementTranslations.productDetails
                        .settingsSrOnly[language]
                    }
                  </span>
                </Button>
                {product.status !== "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">
                      {
                        productsManagementTranslations.productDetails
                          .deleteSrOnly[language]
                      }
                    </span>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  // Render List View
  const renderListView = () => {
    return (
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <Card
            key={product._id} // Assuming _id is available from API
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
                      {
                        productsManagementTranslations.productDetails
                          .purchaseDate[language]
                      }{" "}
                      {formatDate(product.purchaseDate)}
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
                  {product.description ??
                    productsManagementTranslations.misc.noDescription[language]}
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
                        {
                          productsManagementTranslations.productDetails.expires[
                            language
                          ]
                        }{" "}
                        {formatDate(product.expiryDate)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={getProductDetailLink(product.type, product._id)}
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {
                          productsManagementTranslations.productDetails
                            .manageButton[language]
                        }
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      {
                        productsManagementTranslations.productDetails
                          .detailsButton[language]
                      }
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

      {/* Product Filter and Search Section */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={
                productsManagementTranslations.filterSection.searchPlaceholder[
                  language
                ]
              }
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {/* View Mode Buttons */}
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
              {
                productsManagementTranslations.filterSection.filterButton[
                  language
                ]
              }
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              {
                productsManagementTranslations.filterSection.exportButton[
                  language
                ]
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Display pending products list */}
      {pendingProductsList.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {productsManagementTranslations.pendingProducts.title[language]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingProductsList.map(({ order, product }) =>
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
          {filteredProducts.length === 0 && pendingProductsList.length === 0 ? (
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
              // This is where you would typically render the products based on filteredProducts
              // I'm including the original render functions for context, assuming ProductTabs
              // might eventually use these or similar logic for rendering its internal products.
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  {/* This TabsList seems empty or only has a default "all" trigger without visible text.
                     Consider adding actual tabs here based on product status/type if needed
                     Example: <TabsTrigger value="all">{productsManagementTranslations.productStatusFilters.all.label[language]}</TabsTrigger>
                 */}
                  <TabsTrigger value="all">
                    {
                      productsManagementTranslations.productStatusFilters.all
                        .label[language]
                    }
                  </TabsTrigger>{" "}
                  {/* Added text */}
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  {viewMode === "grid" ? renderGridView() : renderListView()}
                </TabsContent>
              </Tabs>
            )
          )}
        </div>
      </div>
    </div>
  );
}
