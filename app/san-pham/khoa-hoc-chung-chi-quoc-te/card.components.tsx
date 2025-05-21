import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiProducts } from "../../fetch/fetch.products";
import { subscriptionTierMap } from "../utils/common";

export const PricingSection: FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Thêm state loading
  const [error, setError] = useState<string | null>(null); // Thêm state error

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiProducts.getProducts(
          "international_certificates",
        );
        // Kiểm tra response và dữ liệu trả về
        const productData = response.payload || [];
        if (Array.isArray(productData)) {
          setProducts(productData);
        } else {
          setError("Dữ liệu sản phẩm không đúng định dạng!");
        }
      } catch (err) {
        // Bắt lỗi cụ thể hơn
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
        setError("Lỗi khi gọi API: " + (err as Error).message); // Cập nhật state error
      } finally {
        setLoading(false); // Luôn đặt loading về false sau khi fetch
      }
    };
    fetchProduct();
  }, []);

  // Hiển thị trạng thái tải hoặc lỗi
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 animate-pulse">
        Đang tải sản phẩm... {/* Đã dịch */}
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

  if (products.length === 0 && !loading) {
    // Kiểm tra cả loading để tránh hiển thị khi đang tải
    return (
      <div className="text-center py-10 text-gray-600">
        Không có sản phẩm nào để hiển thị. {/* Đã dịch */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((plan, index) => {
        // --- Logic để xác định giá hiển thị và giá gạch ngang ---
        let strikethroughPrice = "";
        let currentPriceDisplay = "";

        if (plan.subscriptionTier === "expert") {
          strikethroughPrice = "12.000.000 VNĐ";
          currentPriceDisplay = plan.price
            ? `${plan.price.toLocaleString("vi-VN")} VNĐ`
            : "Liên hệ báo giá";
        } else if (plan.subscriptionTier === "research") {
          strikethroughPrice = "10.000.000 VNĐ";
          currentPriceDisplay = plan.price
            ? `${plan.price.toLocaleString("vi-VN")} VNĐ`
            : "Liên hệ báo giá";
        } else if (plan.subscriptionTier === "enterprise") {
          currentPriceDisplay = "Liên hệ báo giá";
          strikethroughPrice = "";
        } else {
          // Các gói khác (ví dụ: free)
          currentPriceDisplay = plan.price
            ? `${plan.price.toLocaleString("vi-VN")} VNĐ`
            : "Liên hệ báo giá";
        }

        // --- Logic cho mô tả giá (dưới giá hiển thị) ---
        let priceDescription = "";
        if (plan.subscriptionTier === "enterprise") {
          priceDescription = "Giải pháp tùy chỉnh cho doanh nghiệp";
        } else if (plan.price) {
          priceDescription = "Ưu đãi có thời hạn";
        } else {
          priceDescription = "Tùy chỉnh theo yêu cầu";
        }

        // --- Logic cho mô tả tính năng bao gồm ---
        let includedFeaturesDescription = "";
        if (plan.subscriptionTier === "enterprise") {
          includedFeaturesDescription =
            "Bao gồm tất cả tính năng của gói Chuyên Gia";
        } else if (plan.subscriptionTier === "expert") {
          includedFeaturesDescription =
            "Bao gồm tất cả tính năng của gói Cơ Bản";
        }

        // --- Logic cho mô tả đối tượng phù hợp ---
        let targetAudienceDescription = "";
        if (plan.subscriptionTier === "enterprise") {
          targetAudienceDescription =
            "Phù hợp cho các doanh nghiệp vừa và lớn muốn nâng cao năng lực đội ngũ, đáp ứng yêu cầu pháp lý quốc tế, đồng thời triển khai các dự án kiểm kê carbon, ESG một cách toàn diện.";
        } else if (plan.subscriptionTier === "expert") {
          targetAudienceDescription =
            "Dành cho những cá nhân muốn chuyên sâu và làm việc trực tiếp với chuyên gia, sẵn sàng tự tin đảm nhiệm vai trò chuyên viên/consultant về kiểm kê khí nhà kính, ESG, hoặc phát triển dự án carbon tại doanh nghiệp.";
        } else {
          targetAudienceDescription =
            "Phù hợp cho nhà nghiên cứu và người mới bước vào lĩnh vực kiểm kê khí nhà kính, môi trường, ESG, hoặc sinh viên mong muốn lấy chứng chỉ quốc tế để mở rộng cơ hội tương lai."; // Mặc định cho free, research
        }

        // --- Logic cho phần cơ hội nghề nghiệp/lợi ích bổ sung ---
        let careerOpportunityContent = null; // Khởi tạo là null
        if (plan.subscriptionTier !== "enterprise") {
          careerOpportunityContent = (
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-green-800 font-medium">
                Cơ hội nghề nghiệp {/* Đã dịch */}
              </p>
              <ul className="text-sm text-green-700 list-disc pl-5 mt-1">
                {/* Chỉ render benefits từ API */}
                {plan.benefits?.length > 0 ? (
                  plan.benefits.map((benefit: any) => (
                    <li key={benefit._id}>{benefit.title || "N/A"}</li>
                  ))
                ) : (
                  <li>Không có lợi ích bổ sung nào.</li> // Fallback nếu không có benefits
                )}
              </ul>
            </div>
          );
        } else {
          careerOpportunityContent = (
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-green-800 font-medium">
                Tuân thủ quy định CBAM và nâng cao uy tín ESG của doanh nghiệp
              </p>
            </div>
          );
        }

        return (
          <Card
            key={plan._id || index} // Dùng _id nếu có, fallback về index
            className={`hover:shadow-xl transition-all duration-300 border-2 flex flex-col ${
              plan.subscriptionTier === "expert"
                ? "border-green-600 transform scale-105"
                : "border-gray-200"
            }`}
          >
            {plan.subscriptionTier === "expert" && (
              <div className="bg-green-600 text-white text-center py-2 text-sm font-medium">
                Được lựa chọn nhiều nhất {/* Đã dịch */}
              </div>
            )}
            <CardContent className="p-8 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {subscriptionTierMap[plan.subscriptionTier] ||
                    "Không có tiêu đề"}{" "}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">
                    {currentPriceDisplay}{" "}
                  </span>
                  {strikethroughPrice && (
                    <span className="text-gray-500 line-through ml-2">
                      {strikethroughPrice}{" "}
                    </span>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    {priceDescription} {/* Sử dụng biến priceDescription */}
                  </p>
                </div>
                {includedFeaturesDescription && (
                  <p className="text-sm text-gray-600 italic mb-3">
                    {includedFeaturesDescription} {/* Sử dụng biến mới */}
                  </p>
                )}
                <div className="space-y-3 mb-8 pr-2">
                  {plan.features?.length > 0 ? (
                    plan.features.map((feature: any, idx: number) => (
                      <div key={feature.id || idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-gray-700">
                            {feature.title || "Tính năng không xác định"}
                          </span>{" "}
                          <p className="text-xs text-gray-500">
                            {feature.description || "Không có mô tả"}{" "}
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
                {/* Sử dụng biến đã được xử lý */}
                {careerOpportunityContent}
                <p className="text-sm text-gray-500 mb-4">
                  {targetAudienceDescription}
                </p>
              </div>
              <Link
                href={`/thanh-toan?product=${plan._id}`}
                className="mt-auto w-full"
                passHref
                legacyBehavior
              >
                <a className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-medium">
                    {plan.subscriptionTier === "enterprise"
                      ? "Liên hệ tư vấn"
                      : "Đăng ký ngay"}
                  </Button>
                </a>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
export default PricingSection;
