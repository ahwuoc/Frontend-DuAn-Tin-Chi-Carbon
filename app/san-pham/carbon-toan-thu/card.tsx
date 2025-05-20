import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { apiProducts } from "../../fetch/fetch.products";

// Định nghĩa giao diện cho cấu trúc sản phẩm để có kiểu an toàn hơn
interface Product {
  _id: string;
  subscriptionTier: "free" | "enterprise" | "expert" | "research" | string; // Giữ nguyên type string nếu có thể có giá trị khác
  price: number;
  billingCycle?: string;
  description?: string;
  features: { _id: string; title: string; description: string }[];
  benefits: { _id: string; title: string }[];
  company?: string;
}

// Đối tượng ánh xạ các cấp độ gói sang tiếng Việt
const subscriptionTierMap: Record<string, string> = {
  free: "Cơ Bản",
  expert: "Chuyên Gia",
  research: "Nghiên Cứu",
  enterprise: "Doanh Nghiệp",
  // Thêm các ánh xạ khác nếu có các giá trị subscriptionTier khác
};

export default function CarbonCard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiProducts.getProducts("carbon_credits");
        const productData = response.payload;

        // Đảm bảo productData là một mảng trước khi đặt trạng thái
        if (Array.isArray(productData)) {
          setProducts(productData);
        } else {
          setError("Dữ liệu sản phẩm không đúng định dạng.");
        }
      } catch (err) {
        // Thông báo lỗi cụ thể hơn
        setError(`Lỗi khi tải sản phẩm: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Mảng phụ thuộc rỗng có nghĩa là hiệu ứng này chỉ chạy một lần khi component được mount

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {products.map((product) => {
        // Destructure để truy cập sạch hơn
        const {
          _id,
          subscriptionTier,
          price,
          description,
          billingCycle,
          features,
          benefits,
          company,
        } = product;

        const isFree = subscriptionTier === "free" || price === 0;
        const isEnterprise =
          subscriptionTier === "enterprise" || price > 50000000;
        const isExpert = subscriptionTier === "expert";
        const isResearch = subscriptionTier === "research";

        // Lấy tên gói bằng tiếng Việt từ ánh xạ, nếu không có thì giữ nguyên giá trị gốc
        const localizedSubscriptionTier =
          subscriptionTierMap[subscriptionTier] || subscriptionTier;

        return (
          <Card
            key={_id}
            className={`relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 ${
              isExpert ? "border-green-600" : "border-gray-200"
            } flex flex-col min-h-[650px] overflow-hidden`}
          >
            {isExpert && (
              <div className="bg-green-600 text-white text-center py-2 text-sm font-semibold tracking-wide">
                Được lựa chọn nhiều nhất
              </div>
            )}
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 tracking-tight">
                  Gói {localizedSubscriptionTier || "Không có tiêu đề"}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {isFree
                      ? "Miễn phí"
                      : isEnterprise
                        ? "Liên hệ báo giá"
                        : price
                          ? `${price.toLocaleString("vi-VN")} VNĐ`
                          : "N/A"}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {isFree
                      ? "Dùng thử 30 ngày"
                      : isEnterprise
                        ? "Tùy chỉnh theo yêu cầu"
                        : billingCycle || "Không xác định"}
                  </p>
                </div>
                <p className="text-sm text-gray-600 italic mb-4 line-clamp-2">
                  {description ||
                    (isFree
                      ? "Dành cho sinh viên và người mới bắt đầu"
                      : isExpert
                        ? "Dành cho chuyên gia và đội ngũ kỹ thuật"
                        : isResearch
                          ? "Phù hợp cho nghiên cứu và các tổ chức học thuật"
                          : "Giải pháp toàn diện cho doanh nghiệp")}
                </p>

                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2">
                  {features?.length ? (
                    features.map((feature) => (
                      <div key={feature._id} className="flex items-start">
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
                    {benefits?.length ? (
                      benefits.map((benefit) => (
                        <li key={benefit._id}>{benefit.title || "N/A"}</li>
                      ))
                    ) : (
                      <li>Không có lợi ích nào.</li>
                    )}
                  </ul>
                </div>

                <p className="text-sm text-gray-500">
                  Phù hợp với: {company || "Doanh nghiệp và cá nhân"}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <Link
                  href={
                    isEnterprise
                      ? "/dang-ky-tu-van"
                      : `/thanh-toan?product=${_id}`
                  }
                  className="block w-full"
                >
                  <Button className="w-full py-3 text-base font-semibold tracking-wide transition-colors duration-200 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                    {isFree
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
