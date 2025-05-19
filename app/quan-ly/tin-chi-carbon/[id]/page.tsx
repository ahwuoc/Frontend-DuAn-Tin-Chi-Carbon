"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  FileText,
  Calendar,
  MapPin,
  Globe,
  Users,
  Shield,
  ArrowUpRight,
  Share2,
  Printer,
  Info,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail, // Thêm icon Mail
  Phone, // Thêm icon Phone
} from "lucide-react";
import Image from "next/image";
import { apiProducts } from "@/app/fetch/fetch.products";
import { formatDateUtil } from "@/app/utils/common";

export default function CarbonCreditDetailPage() {
  const { id } = useParams();
  const { language } = useLanguage(); // Giữ lại useLanguage nếu bạn muốn đa ngôn ngữ cho các phần cứng
  const [progress, setProgress] = useState(0); // Khởi tạo 0, sẽ được tính toán lại
  const [activeTab, setActiveTab] = useState("overview");
  const [product, setProduct] = useState<any | null>(null); // Đổi tên Product thành product (viết thường chữ cái đầu)
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  console.log("data =>", id);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      if (!id) {
        console.warn("ID sản phẩm không tồn tại.");
        setLoading(false);
        return;
      }
      try {
        const response = await apiProducts.getById(id as string);
        if (response && response.payload) {
          setProduct(response.payload);
          // Tính toán progress dựa trên dữ liệu thật
          const totalCarbon = response.payload.carbonAmount || 0;
          const usedCarbon = response.payload.carbonUsed || 0;
          if (totalCarbon > 0) {
            setProgress(Math.round((usedCarbon / totalCarbon) * 100));
          } else {
            setProgress(0);
          }
        } else {
          setProduct(null);
          console.error("Không tìm thấy sản phẩm hoặc payload rỗng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setProduct(null);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };
    fetchData();
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
        {/* Có thể thêm nút quay lại trang danh sách sản phẩm */}
      </div>
    );
  }
  const {
    name,
    description,
    status,
    purchaseDate,
    expiryDate,
    image,
    projectLocation,
    carbonAmount,
    carbonUsed,
    verificationStandard,
    features,
    benefits,
    accountManager,
    certificates,
    timeline,
    reports,
  } = product;

  // Tính toán tín chỉ còn lại
  const remainingCredits = (carbonAmount || 0) - (carbonUsed || 0);

  return (
    <div className="py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {name || "Tên sản phẩm không xác định"}
            </h1>
            <span
              className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-800"
                  : status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {status === "active"
                ? "Đang hoạt động"
                : status === "pending"
                  ? "Đang xử lý"
                  : "Hết hạn"}
            </span>
          </div>
          <div className="flex items-center mt-2 text-gray-600">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{projectLocation || "Chưa xác định"}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Share2 className="w-4 h-4 mr-2" />
            Chia sẻ
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Printer className="w-4 h-4 mr-2" />
            In
          </Button>
          {/* Nút tải chứng chỉ chỉ hiện khi có chứng chỉ */}
          {certificates && certificates.length > 0 && (
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="mr-2 h-4 w-4" />
              Tải chứng chỉ
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tổng tín chỉ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {carbonAmount !== undefined ? `${carbonAmount} tCO2e` : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tín chỉ đã sử dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {carbonUsed !== undefined ? `${carbonUsed} tCO2e` : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tín chỉ còn lại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {remainingCredits !== undefined
                ? `${remainingCredits} tCO2e`
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 md:mb-8">
        <CardHeader>
          <CardTitle>Tiến độ sử dụng</CardTitle>
          <CardDescription>Tiến độ sử dụng tín chỉ carbon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">
                {progress}% đã sử dụng
              </span>
              <span className="text-sm text-gray-500">
                {carbonUsed !== undefined ? `${carbonUsed} tCO2e` : "N/A"} /{" "}
                {carbonAmount !== undefined ? `${carbonAmount} tCO2e` : "N/A"}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Ngày mua / Ngày hết hạn
                </p>
                <p className="text-sm">
                  {formatDateUtil(purchaseDate)} - {formatDateUtil(expiryDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Vị trí dự án
                </p>
                <p className="text-sm">{projectLocation || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Cảnh báo ngày hết hạn (tạm thời sử dụng expiryDate) */}
          {expiryDate &&
            new Date(expiryDate) <
              new Date(new Date().setMonth(new Date().getMonth() + 1)) && ( // Kiểm tra nếu sắp hết hạn trong 1 tháng
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">
                      Gói tín chỉ sắp hết hạn
                    </h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      Gói tín chỉ này sẽ hết hạn vào ngày{" "}
                      {formatDateUtil(expiryDate)}. Vui lòng xem xét gia hạn.
                    </p>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      <Tabs
        defaultValue="overview"
        className="mb-6 md:mb-8"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full md:w-auto">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="features">Tính năng</TabsTrigger>{" "}
            {/* Thêm tab tính năng */}
            <TabsTrigger value="benefits">Lợi ích</TabsTrigger>{" "}
            {/* Thêm tab lợi ích */}
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
            <TabsTrigger value="certificates">Chứng chỉ</TabsTrigger>
            <TabsTrigger value="timeline">Dòng thời gian</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4 md:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Mô tả sản phẩm</h3>
                  <p className="text-gray-600 mb-6">
                    {description || "Không có mô tả."}
                  </p>

                  {image && (
                    <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
                      <Image
                        src={image}
                        alt={name || "Ảnh sản phẩm"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                        Ảnh minh họa
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">
                      Tiêu chuẩn kiểm định
                    </h4>
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-full">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {verificationStandard || "Không rõ"}
                        </p>
                        <p className="text-xs text-green-700">
                          Được chứng nhận theo tiêu chuẩn này.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Địa điểm liên quan
                      </p>
                      <p className="text-sm">{projectLocation || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Ngày mua
                      </p>
                      <p className="text-sm">{formatDateUtil(purchaseDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Ngày hết hạn
                      </p>
                      <p className="text-sm">{formatDateUtil(expiryDate)}</p>
                    </div>
                  </div>

                  {accountManager && (
                    <>
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Quản lý tài khoản
                          </p>
                          <p className="text-sm">{accountManager.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Email liên hệ
                          </p>
                          <p className="text-sm">{accountManager.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Số điện thoại
                          </p>
                          <p className="text-sm">{accountManager.phone}</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Đi tới trang sản phẩm
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Hành động nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {certificates && certificates.length > 0 && (
                    <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                      <Download className="h-4 w-4 mr-2" />
                      Tải chứng chỉ
                    </Button>
                  )}
                  {reports && reports.length > 0 && (
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Xem báo cáo
                    </Button>
                  )}
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ sản phẩm
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab "Tính năng" */}
        <TabsContent value="features" className="mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Các tính năng của gói</CardTitle>
              <CardDescription>
                Những tính năng bạn nhận được với gói này.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {features && features.length > 0 ? (
                  features.map((feature: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start p-3 rounded-lg border border-gray-200"
                    >
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    Không có tính năng nào được liệt kê.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab "Lợi ích" */}
        <TabsContent value="benefits" className="mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lợi ích của gói</CardTitle>
              <CardDescription>
                Những lợi ích bạn sẽ nhận được từ gói tín chỉ carbon này.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benefits && benefits.length > 0 ? (
                  benefits.map((benefit: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start p-3 rounded-lg border border-gray-200"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium">{benefit.title}</h4>
                        {/* <p className="text-sm text-gray-500 mt-1">{benefit.description}</p> */}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    Không có lợi ích nào được liệt kê.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo dự án</CardTitle>
              <CardDescription>
                Tất cả báo cáo liên quan đến gói tín chỉ carbon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Bạn sẽ cần ánh xạ dữ liệu reports từ API vào đây nếu có */}
              <div className="space-y-4">
                {reports && reports.length > 0 ? (
                  reports.map((report: any) => (
                    <div
                      key={report._id || report.id} // Sử dụng _id hoặc id từ API
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center mb-3 sm:mb-0">
                        <div className="bg-green-100 p-2 rounded-full mr-4 flex-shrink-0">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <p className="text-sm text-gray-500">
                            {formatDateUtil(report.date)} •{" "}
                            {report.size || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200"
                          onClick={() => window.open(report.url, "_blank")} // Mở URL báo cáo
                          disabled={!report.url}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => window.open(report.url, "_blank")} // Tải xuống (hoặc mở) URL báo cáo
                          disabled={!report.url}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Tải xuống
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    Chưa có báo cáo nào.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử giao dịch</CardTitle>
              <CardDescription>
                Tất cả giao dịch liên quan đến gói tín chỉ carbon của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Dữ liệu giao dịch không có trong API response mẫu của bạn.
                  Nếu bạn có, hãy ánh xạ chúng tương tự như reports/certificates.
                  Hiện tại, phần này sẽ hiển thị trống.
              */}
              <p className="text-gray-500 text-center">
                Chưa có giao dịch nào.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chứng chỉ</CardTitle>
              <CardDescription>
                Tất cả chứng chỉ liên quan đến gói tín chỉ carbon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates && certificates.length > 0 ? (
                  certificates.map((certificate: any) => (
                    <Card
                      key={certificate._id || certificate.id}
                      className="overflow-hidden"
                    >
                      <div className="relative h-40 w-full bg-green-50 flex items-center justify-center">
                        <FileText className="h-16 w-16 text-green-300" />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {certificate.title || "Chứng chỉ không tên"}
                        </CardTitle>
                        <CardDescription>
                          {formatDateUtil(certificate.date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-500 mb-4">
                          {certificate.size || "N/A"}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              window.open(certificate.url, "_blank")
                            }
                            disabled={!certificate.url}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            Xem
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              window.open(certificate.url, "_blank")
                            }
                            disabled={!certificate.url}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    Chưa có chứng chỉ nào.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dòng thời gian</CardTitle>
              <CardDescription>
                Các sự kiện quan trọng của gói tín chỉ carbon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-green-200 pl-6 ml-3 space-y-8">
                {timeline && timeline.length > 0 ? (
                  timeline.map((event: any, index: number) => (
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
                          {formatDateUtil(event.date)}
                        </p>
                        <p className="font-medium mt-1">{event.event}</p>
                        {event.upcoming && (
                          <div className="mt-2 flex items-center text-sm text-yellow-700">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span>Sắp diễn ra</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    Chưa có sự kiện nào trong dòng thời gian.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
