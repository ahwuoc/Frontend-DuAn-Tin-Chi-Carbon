"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  Award,
  Calendar,
  User,
  CheckCircle2,
  BookOpen,
  Shield,
  Globe,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  Clock,
  MapPin, // Import Clock icon for features
} from "lucide-react";
import Image from "next/image";
import { apiProducts } from "@/app/fetch/fetch.products";

// Hàm tiện ích định dạng ngày tháng
const formatDateForDisplay = (dateString: string | Date | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function CertificateDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      if (!id) {
        console.warn("ID sản phẩm không tồn tại.");
        setLoading(false);
        return;
      }
      try {
        const response = await apiProducts.getById(id as string);
        if (response && response.payload) {
          setProduct(response.payload);
        } else {
          setProduct(null);
          console.error("Không tìm thấy sản phẩm hoặc payload rỗng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-500 mb-6">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc có lỗi khi tải dữ liệu.
        </p>
        <Button onClick={() => window.history.back()}>
          <AlertCircle className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  // Lấy dữ liệu từ product đã fetch
  const {
    name: title,
    description,
    purchaseDate: issueDate,
    expiryDate,
    status,
    image,
    issuer,
    features,
    certificationLevel,
    accountManager,
    courseProgress,
    lastAccessed,
    price,
    projectLocation,
    carbonAmount,
    carbonUsed,
    verificationStandard,
    subscriptionTier,
    nextPayment,
    billingCycle,
    benefits,
    certificates,
    timeline,
    reports,
    type, // ĐÃ THÊM 'type' VÀO ĐÂY ĐỂ KHẮC PHỤC LỖI
  } = product;

  const recipientEmail = accountManager?.email || "N/A";

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case "active":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "not_started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (currentStatus: string) => {
    switch (currentStatus) {
      case "active":
        return "Đang hoạt động";
      case "in_progress":
        return "Đang học";
      case "pending":
        return "Đang xử lý";
      case "completed":
        return "Đã hoàn thành";
      case "not_started":
        return "Chưa bắt đầu";
      default:
        return currentStatus;
    }
  };

  const getFeatureIcon = (featureTitle: string) => {
    if (featureTitle.includes("Quốc tế") || featureTitle.includes("Columbia")) {
      return <Globe className="w-4 h-4 text-cyan-500" />;
    } else if (
      featureTitle.includes("khóa học") ||
      featureTitle.includes("học")
    ) {
      return <BookOpen className="w-4 h-4 text-blue-500" />;
    } else if (
      featureTitle.includes("nghiên cứu") ||
      featureTitle.includes("tài liệu") ||
      featureTitle.includes("báo cáo")
    ) {
      return <FileText className="w-4 h-4 text-orange-500" />;
    } else if (featureTitle.includes("AI CarbonSeek")) {
      return <Shield className="w-4 h-4 text-purple-500" />;
    } else if (
      featureTitle.includes("Cập nhật") ||
      featureTitle.includes("tin tức")
    ) {
      return <Clock className="w-4 h-4 text-indigo-500" />;
    } else if (
      featureTitle.includes("Hỗ trợ") ||
      featureTitle.includes("email")
    ) {
      return <Mail className="w-4 h-4 text-red-500" />;
    } else if (
      featureTitle.includes("phỏng vấn") ||
      featureTitle.includes("lương")
    ) {
      // Thêm icon cho benefits
      return <Award className="w-4 h-4 text-yellow-500" />;
    }
    return <Award className="w-4 h-4 text-gray-500" />; // Mặc định
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {title || "Tên chứng chỉ không xác định"}
          </h1>
        </div>
        {/* Nút tải chứng chỉ chỉ hiển thị nếu có URL và là dạng chứng chỉ */}
        {type === "international_certificates" &&
          certificates &&
          certificates.length > 0 && (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (certificates[0]?.url) {
                  window.open(certificates[0].url, "_blank");
                } else {
                  alert("Không có URL chứng chỉ để tải xuống.");
                }
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Tải chứng chỉ
            </Button>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="relative h-80 w-full border rounded-lg overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={title || "Ảnh chứng chỉ"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chi tiết gói</CardTitle>{" "}
            {/* Đổi tên từ "Chi tiết khóa học" */}
            <CardDescription>
              Thông tin về gói sản phẩm bạn đã mua
            </CardDescription>{" "}
            {/* Mô tả mới */}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Đơn vị cấp
                  </p>
                  <div className="flex items-center">
                    <p>{issuer || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày mua</p>{" "}
                  {/* Đổi từ Ngày cấp */}
                  <p>{formatDateForDisplay(issueDate)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Ngày hết hạn
                  </p>
                  <p>{formatDateForDisplay(expiryDate)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Trạng thái
                  </p>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}
                    >
                      {getStatusText(status)}
                    </span>
                  </div>
                </div>
              </div>

              {certificationLevel && (
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Cấp độ chứng nhận
                    </p>{" "}
                    {/* Đổi tên */}
                    <p>{certificationLevel}</p>
                  </div>
                </div>
              )}

              {verificationStandard && ( // Thêm trường tiêu chuẩn kiểm định
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Tiêu chuẩn kiểm định
                    </p>
                    <p>{verificationStandard}</p>
                  </div>
                </div>
              )}

              {projectLocation && ( // Thêm trường địa điểm liên quan
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Địa điểm liên quan
                    </p>
                    <p>{projectLocation}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Mô tả gói
              </h3>{" "}
              {/* Đổi tên */}
              <p className="text-gray-600">
                {description || "Không có mô tả."}
              </p>
            </div>

            {features && features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Tính năng chính
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {features.map((feature: any, index: number) => (
                    <div
                      key={feature._id || index}
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700"
                    >
                      {getFeatureIcon(feature.title)}
                      <span className="ml-1">{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {benefits &&
              benefits.length > 0 && ( // Thêm hiển thị Benefits
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Lợi ích đạt được
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {benefits.map((benefit: any, index: number) => (
                      <div
                        key={benefit._id || index}
                        className="flex items-center bg-green-100 rounded-full px-3 py-1 text-xs text-green-800"
                      >
                        {getFeatureIcon(benefit.title)}{" "}
                        {/* Sử dụng getFeatureIcon cho benefits */}
                        <span className="ml-1">{benefit.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Phần truy cập khóa học/gói */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Thông tin truy cập</CardTitle>
          <CardDescription>
            Sử dụng thông tin bên dưới để truy cập các tài nguyên của gói sản
            phẩm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {accountManager?.email && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Email liên kết
                </h3>
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium">{recipientEmail}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Đây là email được sử dụng để liên kết với gói sản phẩm/tài
                  khoản của bạn.
                </p>
              </div>
            )}

            {accountManager?.phone && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Số điện thoại hỗ trợ
                </h3>
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium">{accountManager.phone}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Liên hệ số này để được hỗ trợ trực tiếp.
                </p>
              </div>
            )}

            {courseProgress !== undefined && ( // Hiển thị tiến độ khóa học nếu có
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Tiến độ khóa học
                </h3>
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium">{courseProgress}% hoàn thành</p>
                </div>
              </div>
            )}

            {lastAccessed && ( // Hiển thị lần truy cập cuối cùng nếu có
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Lần truy cập cuối
                </h3>
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium">
                    {formatDateForDisplay(lastAccessed)}
                  </p>
                </div>
              </div>
            )}

            {/* Nút truy cập tài nguyên chính, ví dụ: khóa học */}
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Truy cập tài nguyên
            </h3>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() =>
                window.open(
                  "https://auth.columbiasouthern.edu/login", // Đây là link mẫu, bạn có thể thay bằng link thực tế từ API nếu có
                  "_blank",
                )
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              Truy cập nội dung học / tài nguyên
            </Button>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-600">
                Nếu bạn gặp khó khăn khi truy cập, vui lòng liên hệ với bộ phận
                hỗ trợ của chúng tôi qua email minhtq@carboncreditvietnam.vn
                hoặc hotline 092.3370.804.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phần Reports */}
      {reports && reports.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Báo cáo</CardTitle>
            <CardDescription>
              Các báo cáo liên quan đến gói sản phẩm của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report: any, index: number) => (
                <div
                  key={report._id || index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium">
                        {report.title || "Báo cáo không tên"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDateForDisplay(report.date)}{" "}
                        {report.size ? `• ${report.size}` : ""}
                      </p>
                    </div>
                  </div>
                  {report.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(report.url, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" /> Tải xuống
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phần Certificates (nếu là các chứng chỉ con của gói) */}
      {certificates && certificates.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Chứng chỉ đi kèm</CardTitle>
            <CardDescription>
              Các chứng chỉ bạn nhận được từ gói sản phẩm này.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certificates.map((cert: any, index: number) => (
                <div
                  key={cert._id || index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <h4 className="font-medium">
                        {cert.title || "Chứng chỉ không tên"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Ngày cấp: {formatDateForDisplay(cert.date)}
                      </p>
                    </div>
                  </div>
                  {cert.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(cert.url, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" /> Tải xuống
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phần Timeline */}
      {timeline && timeline.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dòng thời gian</CardTitle>
            <CardDescription>
              Các sự kiện quan trọng của gói sản phẩm.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-green-200 pl-6 ml-3 space-y-8">
              {timeline.map((event: any, index: number) => (
                <div key={event._id || index} className="relative">
                  <div
                    className={`absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center ${
                      event.upcoming ? "bg-yellow-100" : "bg-green-100"
                    }`}
                  >
                    {event.upcoming ? (
                      <Clock className="h-3 w-3 text-yellow-600" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-lg border ${
                      event.upcoming
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-500">
                      {formatDateForDisplay(event.date)}
                    </p>
                    <p className="font-medium mt-1">{event.event}</p>
                    {event.upcoming && (
                      <div className="mt-2 flex items-center text-sm text-yellow-700">
                        <AlertCircle className="h-4 w-4 mr-1" />{" "}
                        {/* Đổi từ AlertTriangle sang AlertCircle cho nhất quán */}
                        <span>Sắp diễn ra</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
