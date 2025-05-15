import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AffiliatePendingProps {
  affiliateData: {
    fullName: string;
    email: string;
    createdAt: string;
  };
}

export default function AffiliatePending({
  affiliateData,
}: AffiliatePendingProps) {
  return (
    <div className="py-6 max-w-md mx-auto">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-green-600">
            Đăng ký đang được xem xét
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl text-gray-700">
            Chào <strong>{affiliateData.fullName}</strong>! Đơn đăng ký
            affiliate của bạn đã được gửi vào{" "}
            <span className="text-gray-900 font-semibold">
              {new Date(affiliateData.createdAt).toLocaleDateString("vi-VN")}
            </span>
            .
          </p>
          <p className="text-xl text-gray-700 mt-6">
            Chúng tôi đang xem xét thông tin của bạn. Bạn sẽ nhận được thông báo
            qua email <strong>{affiliateData.email}</strong> khi được duyệt. Cảm
            ơn bạn đã kiên nhẫn! 😊
          </p>
          <p className="text-lg text-gray-600 mt-6">
            Trong khi chờ đợi, bạn có thể tham khảo thêm về chương trình hoặc
            truy cập trang FAQ để biết thêm chi tiết.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
