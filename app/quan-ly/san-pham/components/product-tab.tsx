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
import {
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  Settings,
  Trash2,
} from "lucide-react";
import { Product } from "./type";

export const getManagementLink = (type?: string, id?: string) => {
  if (!type || !id) {
    console.warn("Type or ID is undefined, returning default management link");
    return "/quan-ly";
  }
  switch (type) {
    case "carbon_credits":
      return `/quan-ly/tin-chi-carbon/${id}`;
    case "carbon_accounting":
      return `/quan-ly/carbon-toan-thu/${id}`;
    case "international_certificates":
      return `/quan-ly/chung-chi-quoc-te/${id}`;
    default:
      return "/quan-ly";
  }
};

interface ProductTabsProps {
  products?: Product[];
  viewMode: "grid" | "list";
  getStatusBadge: (status: string) => JSX.Element;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
  getProductDetailLink: (type: string, id: string) => string;
  getProductTypeName: (type: string) => string;
  getProductTypeIcon: (type: string) => JSX.Element;
  getFeatureIcon: (feature: string) => JSX.Element;
  renderAdditionalInfo: (product: Product) => JSX.Element | null;
}
export function ProductTabs({
  products = [],
  viewMode,
  getStatusBadge,
  formatDate,
  formatCurrency,
  getProductTypeName,
  getProductTypeIcon,
  getFeatureIcon,
  renderAdditionalInfo,
}: ProductTabsProps) {
  const renderGridView = () => {
    if (!products || products.length === 0) {
      return <div>Không có sản phẩm nào để hiển thị.</div>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <Card
            key={product._id ?? product.id ?? "unknown"} // Xử lý khi _id hoặc id là undefined
            className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
          >
            <div className="relative h-48 w-full">
              <Image
                src={product.image ?? "/placeholder.svg?height=200&width=400"}
                alt={product.name ?? "Sản phẩm không tên"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2">
                {getStatusBadge(product.status ?? "unknown")}
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg line-clamp-2">
                    {product.name ?? "Không có tiêu đề"}
                  </CardTitle>
                  <CardDescription className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                    Ngày mua:{" "}
                    {formatDate(
                      product.purchaseDate ?? new Date().toISOString(),
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center">
                  {getProductTypeIcon(product.type ?? "unknown")}
                  <Badge variant="outline" className="ml-2">
                    {getProductTypeName(product.type ?? "unknown")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600 line-clamp-3">
                {product.description ?? "Không có mô tả"}
              </p>

              {renderAdditionalInfo(product)}

              {(product.features ?? []).slice(0, 3).map((feature) => (
                <div
                  key={feature.id ?? feature.title ?? Math.random().toString()} // Xử lý khi feature.id hoặc feature.title là undefined
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700"
                >
                  {getFeatureIcon(feature.title ?? "unknown")}
                  <span className="ml-1">
                    {feature.title ?? "Tính năng không xác định"}
                  </span>
                </div>
              ))}

              {product.expiryDate && (
                <p className="text-sm text-gray-500 mt-3 flex items-center">
                  <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                  Hết hạn: {formatDate(product.expiryDate)}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 pt-0">
              <Link
                href={getManagementLink(
                  product.type,
                  product._id ?? product.id,
                )}
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

  const renderListView = () => {
    if (!products || products.length === 0) {
      return <div>Không có sản phẩm nào để hiển thị.</div>;
    }

    return (
      <div className="space-y-4">
        {products.map((product) => (
          <Card
            key={product._id ?? product.id ?? "unknown"} // Xử lý khi _id hoặc id là undefined
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                <Image
                  src={product.image ?? "/placeholder.svg?height=200&width=400"}
                  alt={product.name ?? "Sản phẩm không tên"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              </div>
              <div className="flex flex-col flex-grow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium">
                      {product.name ?? "Không có tiêu đề"}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      Ngày mua:{" "}
                      {formatDate(
                        product.purchaseDate ?? new Date().toISOString(),
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(product.status ?? "unknown")}
                    <Badge variant="outline" className="flex items-center">
                      {getProductTypeIcon(product.type ?? "unknown")}
                      <span className="ml-1">
                        {getProductTypeName(product.type ?? "unknown")}
                      </span>
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {product.description ?? "Không có mô tả"}
                </p>
                {renderAdditionalInfo(product)}
                {(product.features ?? []).length > 0 && (
                  <div className="mt-auto pt-3">
                    <div className="flex flex-wrap gap-2">
                      {(product.features ?? []).map((feature, index) => (
                        <div
                          key={feature.id ?? feature.title ?? index}
                          className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700"
                        >
                          {getFeatureIcon(feature.title ?? "unknown")}
                          <span className="ml-1">
                            {feature.title ?? "Tính năng không xác định"}
                          </span>
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
                    <Link
                      href={getManagementLink(
                        product.type ?? "unknown",
                        product._id ?? product.id ?? "unknown",
                      )}
                    >
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
    <div>
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {viewMode === "grid" ? renderGridView() : renderListView()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
