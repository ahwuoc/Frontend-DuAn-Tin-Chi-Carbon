import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { apiProducts } from "../../fetch/fetch.products";
import { subscriptionTierMap } from "../utils/common";

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

export default function CarbonCard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiProducts.getProducts("carbon_credits");
        let productData = response.payload; // Sử dụng let để có thể gán lại

        if (Array.isArray(productData)) {
          // Lọc bỏ gói "free" nếu bạn đã xóa nó khỏi API hoặc muốn bỏ qua nó
          productData = productData.filter(
            (p) => p.subscriptionTier !== "free",
          );

          // --- Logic sắp xếp sản phẩm được cập nhật ---
          const sortedProducts = productData.sort((a, b) => {
            // Định nghĩa thứ tự ưu tiên cho từng gói
            const order = {
              enterprise: 1, // Enterprise: đầu tiên
              research: 2, // Research: thứ hai (ở giữa trong 3 gói)
              expert: 3, // Expert: thứ ba (cuối cùng bên phải)
            };

            const orderA =
              order[a.subscriptionTier as keyof typeof order] || 99; // 99 cho các loại không xác định
            const orderB =
              order[b.subscriptionTier as keyof typeof order] || 99;

            return orderA - orderB;
          });
          // --- Kết thúc logic sắp xếp ---

          setProducts(sortedProducts);
        } else {
          setError("Dữ liệu sản phẩm không đúng định dạng.");
        }
      } catch (err) {
        setError(`Lỗi khi tải sản phẩm: ${(err as Error).message}`);
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
    // Điều chỉnh grid để phù hợp với 3 cột chính, và có thể căn giữa
    // grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3
    // md:grid-cols-3 đã đủ để hiện 3 cột trên màn hình trung bình trở lên
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {products.map((product) => {
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
        const localizedSubscriptionTier =
          subscriptionTierMap[subscriptionTier] || subscriptionTier;

        // --- Logic để xác định giá hiển thị và giá gạch ngang ---
        let strikethroughPrice = "";
        let currentPriceDisplay = "";

        if (isExpert) {
          strikethroughPrice = ""; // Expert không có giá gạch ngang
          currentPriceDisplay = price
            ? `${price.toLocaleString("vi-VN")} VNĐ`
            : "Liên hệ báo giá";
        } else if (isResearch) {
          strikethroughPrice = ""; // Research cũng không có giá gạch ngang (cập nhật theo yêu cầu mới)
          currentPriceDisplay = price
            ? `${price.toLocaleString("vi-VN")} VNĐ`
            : "Liên hệ báo giá";
        } else if (isEnterprise) {
          currentPriceDisplay = "Liên hệ báo giá";
          strikethroughPrice = "";
        } else if (isFree) {
          currentPriceDisplay = "Miễn phí";
        } else {
          currentPriceDisplay = price
            ? `${price.toLocaleString("vi-VN")} VNĐ`
            : "N/A";
        }

        // --- Logic để xác định mô tả chu kỳ thanh toán ---
        let billingCycleDescription = "";
        if (isFree) {
          billingCycleDescription = "Dùng thử 14 ngày";
        } else if (isEnterprise) {
          billingCycleDescription = "Tùy chỉnh theo yêu cầu";
        } else {
          billingCycleDescription = "Giá khuyến mãi đến 04/03"; // Mặc định cho các gói có giá
        }

        // --- Logic để xác định mô tả đối tượng phù hợp (companyDescription) ---
        let companyDescription = "";
        if (isResearch) {
          companyDescription =
            "Phù hợp cho nhà nghiên cứu và người mới bước vào lĩnh vực kiểm kê khí nhà kính, môi trường, ESG, hoặc sinh viên mong muốn lấy chứng chỉ quốc tế để mở rộng cơ hội tương lai.";
        } else if (isFree) {
          companyDescription =
            "Phù hợp cho sinh viên các ngành môi trường, kinh tế, quản lý tài nguyên, phát triển bền vững và các ngành liên quan.";
        } else if (isEnterprise) {
          companyDescription =
            "Phù hợp cho các doanh nghiệp vừa và lớn muốn nâng cao năng lực đội ngũ, đáp ứng yêu cầu pháp lý quốc tế, đồng thời triển khai các dự án kiểm kê carbon, ESG một cách toàn diện.";
        } else if (isExpert) {
          companyDescription =
            "Dành cho chuyên gia ESG, quản lý dự án, tư vấn môi trường, nhà đầu tư và những người làm việc trong lĩnh vực phát triển bền vững.";
        } else {
          companyDescription = company || "Doanh nghiệp và cá nhân"; // Fallback nếu không có tier nào khớp
        }

        let planDescription = "";
        if (isFree) {
          planDescription = "Dành cho sinh viên và người mới bắt đầu";
        } else if (isExpert) {
          planDescription = "Dành cho chuyên gia và người đi làm";
        } else if (isResearch) {
          planDescription = "Dành riêng cho sinh viên với giá ưu đãi"; // Mô tả chi tiết cho research
        } else if (isEnterprise) {
          planDescription = "Giải pháp toàn diện cho doanh nghiệp";
        }

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
                  {localizedSubscriptionTier || "Không có tiêu đề"}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {currentPriceDisplay}{" "}
                  </span>
                  {strikethroughPrice && (
                    <span className="text-gray-500 line-through ml-2">
                      {strikethroughPrice}{" "}
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {billingCycleDescription}{" "}
                  </p>
                </div>
                <p className="text-sm text-gray-600 italic mb-4 line-clamp-2">
                  {planDescription}
                </p>

                <div className="space-y-3 mb-6 pr-2">
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
                  Phù hợp với: {companyDescription}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <Link
                  href={
                    isEnterprise
                      ? "/san-pham/du-an-tin-chi-carbon#dang-ky-du-an"
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
