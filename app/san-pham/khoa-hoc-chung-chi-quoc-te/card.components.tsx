import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export const PricingSection: FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Đảm bảo kiểu Product[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiProducts.getProducts(
          "international_certificates",
        );
        let productData = response.payload || []; // Sử dụng 'let' để có thể gán lại

        if (Array.isArray(productData)) {
          // Lọc bỏ gói "free" nếu không muốn hiển thị
          // productData = productData.filter((p) => p.subscriptionTier !== "free");

          // --- Logic sắp xếp sản phẩm ---
          const sortedProducts = productData.sort((a, b) => {
            const order = {
              free: 1, // Nếu gói free có tồn tại và bạn muốn nó đầu tiên
              enterprise: 2, // Enterprise: thứ hai
              research: 3, // Research: thứ ba (ở giữa trong 3 cột)
              expert: 4, // Expert: cuối cùng (thứ tư, nằm ngoài cùng bên phải)
            };

            const orderA =
              order[a.subscriptionTier as keyof typeof order] || 99;
            const orderB =
              order[b.subscriptionTier as keyof typeof order] || 99;

            return orderA - orderB;
          });
          // --- Kết thúc logic sắp xếp ---

          setProducts(sortedProducts);
        } else {
          setError("Dữ liệu sản phẩm không đúng định dạng!");
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
        setError("Lỗi khi gọi API: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
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

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Không có sản phẩm nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((plan, index) => {
        // Đảm bảo plan có type Product hoặc tương đương để truy cập thuộc tính
        const product: Product = plan; // Ép kiểu để TypeScript hiểu

        // --- Logic để xác định giá hiển thị và giá gạch ngang ---
        let strikethroughPrice = "";
        let currentPriceDisplay = "";

        if (product.subscriptionTier === "expert") {
          strikethroughPrice = "12.000.000 VNĐ";
          currentPriceDisplay = product.price
            ? `${product.price.toLocaleString("vi-VN")} VNĐ`
            : "Liên hệ báo giá";
        } else if (product.subscriptionTier === "research") {
          strikethroughPrice = "10.000.000 VNĐ";
          currentPriceDisplay = product.price
            ? `${product.price.toLocaleString("vi-VN")} VNĐ`
            : "Liên hệ báo giá";
        } else if (product.subscriptionTier === "enterprise") {
          currentPriceDisplay = "Liên hệ báo giá";
          strikethroughPrice = "";
        } else {
          // Các gói khác (ví dụ: free)
          currentPriceDisplay = product.price
            ? `${product.price.toLocaleString("vi-VN")} VNĐ`
            : "Liên hệ báo giá";
        }

        // --- Logic cho mô tả giá (dưới giá hiển thị) ---
        let priceDescription = "";
        if (product.subscriptionTier === "enterprise") {
          priceDescription = "Giải pháp tùy chỉnh cho doanh nghiệp";
        } else if (product.price) {
          priceDescription = "Ưu đãi có thời hạn";
        } else {
          priceDescription = "Tùy chỉnh theo yêu cầu";
        }

        // --- Logic cho mô tả tính năng bao gồm ---
        let includedFeaturesDescription = "";
        if (product.subscriptionTier === "enterprise") {
          includedFeaturesDescription =
            "Bao gồm tất cả tính năng của gói Chuyên Gia";
        } else if (product.subscriptionTier === "expert") {
          includedFeaturesDescription =
            "Bao gồm tất cả tính năng của gói Cơ Bản";
        }

        // --- Logic cho mô tả đối tượng phù hợp ---
        let targetAudienceDescription = "";
        if (product.subscriptionTier === "enterprise") {
          targetAudienceDescription =
            "Phù hợp cho các doanh nghiệp vừa và lớn muốn nâng cao năng lực đội ngũ, đáp ứng yêu cầu pháp lý quốc tế, đồng thời triển khai các dự án kiểm kê carbon, ESG một cách toàn diện.";
        } else if (product.subscriptionTier === "expert") {
          targetAudienceDescription =
            "Dành cho những cá nhân muốn chuyên sâu và làm việc trực tiếp với chuyên gia, sẵn sàng tự tin đảm nhiệm vai trò chuyên viên/consultant về kiểm kê khí nhà kính, ESG, hoặc phát triển dự án carbon tại doanh nghiệp.";
        } else {
          targetAudienceDescription =
            "Phù hợp cho nhà nghiên cứu và người mới bước vào lĩnh vực kiểm kê khí nhà kính, môi trường, ESG, hoặc sinh viên mong muốn lấy chứng chỉ quốc tế để mở rộng cơ hội tương lai."; // Mặc định cho free, research
        }

        // --- Logic cho phần cơ hội nghề nghiệp/lợi ích bổ sung ---
        let careerOpportunityContent = null;
        if (product.subscriptionTier !== "enterprise") {
          careerOpportunityContent = (
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-green-800 font-medium">
                Cơ hội nghề nghiệp
              </p>
              <ul className="text-sm text-green-700 list-disc pl-5 mt-1">
                {product.benefits?.length > 0 ? (
                  product.benefits.map((benefit: any) => (
                    <li key={benefit._id}>{benefit.title || "N/A"}</li>
                  ))
                ) : (
                  <li>Không có lợi ích bổ sung nào.</li>
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
            key={product._id || index} // Dùng _id nếu có, fallback về index
            className={`hover:shadow-xl transition-all duration-300 border-2 flex flex-col ${
              product.subscriptionTier === "expert"
                ? "border-green-600 transform scale-105"
                : "border-gray-200"
            }`}
          >
            {product.subscriptionTier === "expert" && (
              <div className="bg-green-600 text-white text-center py-2 text-sm font-medium">
                Được lựa chọn nhiều nhất
              </div>
            )}
            <CardContent className="p-8 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {subscriptionTierMap[product.subscriptionTier] ||
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
                    {priceDescription}{" "}
                  </p>
                </div>
                {includedFeaturesDescription && (
                  <p className="text-sm text-gray-600 italic mb-3">
                    {includedFeaturesDescription}{" "}
                  </p>
                )}
                <div className="space-y-3 mb-8 pr-2">
                  {product.features?.length > 0 ? (
                    product.features.map((feature: any, idx: number) => (
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
                {careerOpportunityContent}
                <p className="text-sm text-gray-500 mb-4">
                  {targetAudienceDescription}
                </p>
              </div>
              {product.subscriptionTier === "enterprise" ? (
                <Link
                  href="/san-pham/du-an-tin-chi-carbon#dang-ky-du-an"
                  className="mt-auto w-full"
                  passHref
                  legacyBehavior
                >
                  <a className="w-full">
                    <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-medium">
                      Liên hệ tư vấn
                    </Button>
                  </a>
                </Link>
              ) : (
                <Link
                  href={`/thanh-toan?product=${product._id}`}
                  className="mt-auto w-full"
                  passHref
                  legacyBehavior
                >
                  <a className="w-full">
                    <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-medium">
                      Đăng ký ngay
                    </Button>
                  </a>
                </Link>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PricingSection;
