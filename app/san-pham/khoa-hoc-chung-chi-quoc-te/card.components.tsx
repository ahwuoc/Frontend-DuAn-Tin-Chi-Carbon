import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiProducts } from "../../fetch/fetch.products";

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
      } catch (err) { // Bắt lỗi cụ thể hơn
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

  if (products.length === 0 && !loading) { // Kiểm tra cả loading để tránh hiển thị khi đang tải
    return (
      <div className="text-center py-10 text-gray-600">
        Không có sản phẩm nào để hiển thị. {/* Đã dịch */}
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Logic kiểm tra products.length === 0 đã được đưa lên trên */}
      {products.map((plan, index) => (
        <Card
          key={plan._id || index} // Dùng _id nếu có, fallback về index
          className={`hover:shadow-xl transition-all duration-300 border-2 flex flex-col ${plan.subscriptionTier === "professional"
            ? "border-green-600 transform scale-105"
            : "border-gray-200"
            }`}
        >
          {plan.subscriptionTier === "professional" && (
            <div className="bg-green-600 text-white text-center py-2 text-sm font-medium">
              Phổ biến nhất {/* Đã dịch */}
            </div>
          )}
          <CardContent className="p-8 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {plan.name || "Không có tiêu đề"} {/* Thêm fallback */}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-800">
                  {/* Sửa định dạng giá và dịch */}
                  {plan.price ? `${plan.price.toLocaleString("vi-VN")} VNĐ` : "Liên hệ báo giá"}
                </span>
                {plan.price && (
                  <span className="text-gray-500 line-through ml-2">
                    {/* Giả lập originalPrice - giữ nguyên hoặc xóa nếu không cần */}
                    {plan.price ? `${(plan.price + 50).toLocaleString("vi-VN")} VNĐ` : ""}{" "}
                  </span>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  {/* Dịch mô tả giá */}
                  {plan.price ? "Ưu đãi có thời hạn" : "Tùy chỉnh theo yêu cầu"}
                </p>
              </div>
              {plan.subscriptionTier && (
                <p className="text-sm text-gray-600 italic mb-3">
                  {/* Dịch mô tả gói */}
                  {plan.subscriptionTier === "enterprise"
                    ? "Bao gồm tất cả tính năng của gói Professional"
                    : plan.subscriptionTier === "professional"
                      ? "Bao gồm tất cả tính năng của gói Basic" // Giả định có gói Basic
                      : ""}
                </p>
              )}
              <div className="space-y-3 mb-8 max-h-[260px] overflow-y-auto pr-2">
                {plan.features?.length > 0 ? (
                  plan.features.map((feature: any, idx: number) => (
                    <div key={feature.id || idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700">{feature.title || "Tính năng không xác định"}</span> {/* Thêm fallback */}
                        <p className="text-xs text-gray-500">
                          {feature.description || "Không có mô tả"} {/* Thêm fallback */}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Không có tính năng nào.</p>
                )}
              </div>
              {plan.subscriptionTier !== "enterprise" && (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-green-800 font-medium">
                    Cơ hội nghề nghiệp {/* Đã dịch */}
                  </p>
                  <ul className="text-sm text-green-700 list-disc pl-5 mt-1">
                    <li>Tăng 80% tỷ lệ phỏng vấn</li> {/* Đã dịch */}
                    <li>
                      Tăng lương lên đến{" "} {/* Đã dịch */}
                      {plan.subscriptionTier === "professional" ? "40%" : "20%"}{" "}
                    </li>
                  </ul>
                </div>
              )}
              {plan.subscriptionTier === "enterprise" && (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-green-800 font-medium">
                    Bao gồm hỗ trợ tuân thủ CBAM {/* Đã dịch */}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500 mb-4">
                {/* Dịch mô tả đối tượng phù hợp */}
                {plan.subscriptionTier === "enterprise"
                  ? "Tốt nhất cho doanh nghiệp và đội nhóm"
                  : plan.subscriptionTier === "professional"
                    ? "Lý tưởng cho chuyên gia muốn phát triển sự nghiệp"
                    : "Phù hợp cho người tự học"}
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
      ))}
    </div>
  );
};

export default PricingSection;