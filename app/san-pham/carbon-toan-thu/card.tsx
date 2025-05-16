
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { apiProducts } from "../../fetch/fetch.products";
export default function CarbonCard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiProducts.getProducts("carbon_credits");
        const productData = response.data || [];
        if (Array.isArray(productData)) {
          setProducts(productData);
        } else {
          setError("Dữ liệu sản phẩm không đúng định dạng!");
        }
      } catch (err) {
        setError("Lỗi khi gọi API: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 animate-pulse">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
        {error}
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        Không có sản phẩm nào để hiển thị.
      </div>
    );
  }
  return (
    <div className="flex gap-5  min-w-screen mx-auto">
      {products.map((product) => {
        const isTrial =
          product.subscriptionTier === "basic" || product.price === 0;
        const isEnterprise =
          product.subscriptionTier === "enterprise" || product.price > 50000000;
        const isExpert = product.subscriptionTier === "professional";
        const isResearch = !isTrial && !isEnterprise && !isExpert;
        return (
          <Card
            key={product.id}
            className={`relative w-1/4 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 ${isExpert ? "border-green-600" : "border-gray-200"
              } flex flex-col min-h-[650px] w-full max-w-sm overflow-hidden`}
          >
            {isExpert && (
              <div className="bg-green-600 text-white text-center py-2 text-sm font-semibold tracking-wide">
                Phổ biến nhất
              </div>
            )}
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 tracking-tight">
                  {product.name || "Không có tiêu đề"}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {isTrial
                      ? "Miễn phí"
                      : isEnterprise
                        ? "Liên hệ báo giá"
                        : product.price
                          ? `${product.price.toLocaleString("vi-VN")} VNĐ`
                          : "N/A"}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {isTrial
                      ? "Dùng thử 30 ngày"
                      : isEnterprise
                        ? "Tùy chỉnh"
                        : product.billingCycle || "Không xác định"}
                  </p>
                </div>
                <p className="text-sm text-gray-600 italic mb-4 line-clamp-2">
                  {product.description ||
                    (isTrial
                      ? "Dành cho sinh viên và người mới bắt đầu"
                      : isEnterprise
                        ? "Giải pháp toàn diện cho doanh nghiệp"
                        : isExpert
                          ? "Dành cho chuyên gia và đội ngũ chuyên sâu"
                          : "Dành cho nghiên cứu và doanh nghiệp vừa")}
                </p>
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2">
                  {product.features?.length ? (
                    product.features.map((feature) => (
                      <div key={feature.id} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-gray-700 font-medium">
                            {feature.title || "Tính năng không xác định"}
                          </span>
                          <p className="text-xs text-gray-500">
                            {feature.description || "Không có mô tả"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      Không có tính năng nào.
                    </p>
                  )}
                </div>
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-green-800 font-semibold mb-2">
                    Lợi ích nổi bật
                  </p>
                  <ul className="text-sm text-green-700 list-disc pl-5 space-y-1">
                    {product.features?.length ? (
                      product.features.map((feature) => (
                        <li key={feature.id}>{feature.title || "N/A"}</li>
                      ))
                    ) : (
                      <li>Không có lợi ích nào.</li>
                    )}
                  </ul>
                </div>
                <p className="text-sm text-gray-500">
                  Phù hợp với: {product.company || "Doanh nghiệp và cá nhân"}
                </p>
              </div>
              <div className="mt-auto pt-6">
                <Link
                  href={
                    isTrial
                      ? `/thanh-toan?product=${product._id}`
                      : isEnterprise
                        ? "/dang-ky-tu-van"
                        : `/thanh-toan?product=${product._id}`
                  }
                  className="block w-full"
                >
                  <Button
                    className={`w-full py-3 text-base font-semibold tracking-wide transition-colors duration-200 ${isExpert
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-green-600 hover:bg-green-700"
                      } text-white rounded-lg`}
                  >
                    {isTrial
                      ? "Dùng thử ngay"
                      : isEnterprise
                        ? "Liên hệ tư vấn"
                        : "Đăng ký ngay"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
