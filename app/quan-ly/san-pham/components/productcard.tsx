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
import { useLanguage } from "@/context/language-context";
import {
  Calendar,
  Clock,
  FileText,
  Settings,
  Trash2,
  Leaf,
  BookOpen,
  Award,
  Globe,
  CheckCircle2,
  Zap,
  FileCheck,
  BarChart2,
  Users,
  Shield,
  Tag,
  ArrowRight,
  AlertCircle,
  Package,
} from "lucide-react";
import { Product } from "./type";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const { language } = useLanguage();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {language === "vi" ? "Đang hoạt động" : "Active"}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {language === "vi" ? "Đang xử lý" : "Pending"}
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {language === "vi" ? "Hết hạn" : "Expired"}
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === "vi"
      ? date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const formatCurrency = (amount: number) => {
    if (language === "vi") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount / 24000);
    }
  };

  const getProductDetailLink = (type: string, id: string) => {
    switch (type) {
      case "carbon_credits":
        return `/quan-ly/tin-chi-carbon/${id}`;
      case "carbon_accounting":
        return `/quan-ly/carbon-toan-thu/${id}`;
      case "international_certificates":
        return `/quan-ly/chung-chi-quoc-te/${id}`;
      default:
        return `/quan-ly`;
    }
  };

  const getProductTypeName = (type: string) => {
    switch (type) {
      case "carbon_credits":
        return language === "vi" ? "Tín chỉ Carbon" : "Carbon Credits";
      case "carbon_accounting":
        return language === "vi" ? "Carbon Toàn Thư" : "Carbon Accounting";
      case "international_certificates":
        return language === "vi"
          ? "Chứng chỉ Quốc tế"
          : "International Certificates";
      default:
        return type;
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

  const getFeatureIcon = (feature: string) => {
    if (feature.includes("AI") || feature.includes("CarbonSeek")) {
      return <Zap className="w-4 h-4 text-purple-500" />;
    } else if (
      feature.includes("Báo cáo") ||
      feature.includes("Report") ||
      feature.includes("ESG") ||
      feature.includes("Kiểm toán") ||
      feature.includes("Audit")
    ) {
      return <FileCheck className="w-4 h-4 text-blue-500" />;
    } else if (
      feature.includes("Phân tích") ||
      feature.includes("Analysis") ||
      feature.includes("Trend") ||
      feature.includes("Xu hướng")
    ) {
      return <BarChart2 className="w-4 h-4 text-orange-500" />;
    } else if (
      feature.includes("Cộng đồng") ||
      feature.includes("Community") ||
      feature.includes("Tư vấn") ||
      feature.includes("Consult")
    ) {
      return <Users className="w-4 h-4 text-indigo-500" />;
    } else if (
      feature.includes("Bảo tồn") ||
      feature.includes("Conservation") ||
      feature.includes("Bảo vệ") ||
      feature.includes("Protection")
    ) {
      return <Shield className="w-4 h-4 text-green-500" />;
    } else if (
      feature.includes("Quốc tế") ||
      feature.includes("International") ||
      feature.includes("Global") ||
      feature.includes("Toàn cầu")
    ) {
      return <Globe className="w-4 h-4 text-cyan-500" />;
    } else if (
      feature.includes("Chứng nhận") ||
      feature.includes("Certified") ||
      feature.includes("VCS") ||
      feature.includes("CCB")
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
                <span>
                  {language === "vi" ? "Tổng tín chỉ: " : "Total credits: "}
                  {product.carbonAmount} tCO2e
                </span>
              </div>
            )}
            {product.carbonUsed !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>
                    {language === "vi" ? "Đã sử dụng: " : "Used: "}
                    {product.carbonUsed} tCO2e
                  </span>
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
              <span>
                {language === "vi"
                  ? "Nền tảng tri thức toàn diện về Carbon"
                  : "Comprehensive Carbon knowledge platform"}
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
                  {language === "vi" ? "Đơn vị cấp: " : "Issuer: "}
                  {product.issuer}
                </span>
              </div>
            )}
            {product.certificationLevel && (
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-600" />
                <span>
                  {language === "vi" ? "Cấp độ: " : "Level: "}
                  {product.certificationLevel}
                </span>
              </div>
            )}
            {product.courseProgress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>
                    {language === "vi" ? "Tiến độ khóa học" : "Course progress"}
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
                  {language === "vi"
                    ? "Truy cập gần nhất: "
                    : "Last accessed: "}
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

  return (
    <Card
      className={`overflow-hidden ${viewMode === "grid" ? "flex flex-col h-full" : ""} hover:shadow-md transition-shadow`}
    >
      {viewMode === "grid" ? (
        <>
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
                  {language === "vi" ? "Ngày mua: " : "Purchased on: "}{" "}
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
              {product.description}
            </p>

            {renderAdditionalInfo(product)}

            {product.features && product.features.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {language === "vi" ? "Tính năng chính:" : "Key features:"}
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
                {language === "vi" ? "Hết hạn: " : "Expires: "}{" "}
                {formatDate(product.expiryDate)}
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
                {language === "vi" ? "Quản lý" : "Manage"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="p-2">
                <FileText className="h-4 w-4" />
                <span className="sr-only">
                  {language === "vi" ? "Xem chi tiết" : "View details"}
                </span>
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Settings className="h-4 w-4" />
                <span className="sr-only">
                  {language === "vi" ? "Cài đặt" : "Settings"}
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
                    {language === "vi" ? "Xóa" : "Delete"}
                  </span>
                </Button>
              )}
            </div>
          </CardFooter>
        </>
      ) : (
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
                  {language === "vi" ? "Ngày mua: " : "Purchased on: "}{" "}
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

            <p className="text-sm text-gray-600 mb-3">{product.description}</p>

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
                    {language === "vi" ? "Hết hạn: " : "Expires: "}{" "}
                    {formatDate(product.expiryDate)}
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
                    {language === "vi" ? "Quản lý" : "Manage"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  {language === "vi" ? "Chi tiết" : "Details"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
