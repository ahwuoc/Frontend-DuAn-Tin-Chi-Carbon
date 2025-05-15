"use client";

import { useState } from "react";
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
import {
  Download,
  FileText,
  ExternalLink,
  Calendar,
  Building,
  ArrowUpRight,
  BookOpen,
  FileQuestion,
  Video,
  Database,
  BarChart2,
  Bot,
  Users,
  Settings,
  CreditCard,
  Shield,
  Zap,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Mail,
  BookOpenCheck,
  Presentation,
  Network,
} from "lucide-react";
import Image from "next/image";

export default function CarbonAccountingDetailPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [usageData, setUsageData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [65, 45, 75, 50, 80, 90],
  });

  // Dữ liệu cho các gói Carbon Toàn Thư khác nhau

  // Lấy thông tin sản phẩm dựa trên ID
  const carbonProduct =
    carbonProducts[id as string] || carbonProducts["ca-002"]; // Fallback to Enterprise package if ID not found

  // Hàm đ hiển thị icon dựa trên loại
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "FileText":
        return <FileText className="h-5 w-5 text-green-600" />;
      case "Video":
        return <Video className="h-5 w-5 text-green-600" />;
      case "FileQuestion":
        return <FileQuestion className="h-5 w-5 text-green-600" />;
      case "Bot":
        return <Bot className="h-5 w-5 text-green-600" />;
      case "Database":
        return <Database className="h-5 w-5 text-green-600" />;
      case "BarChart2":
        return <BarChart2 className="h-5 w-5 text-green-600" />;
      case "Users":
        return <Users className="h-5 w-5 text-green-600" />;
      case "Shield":
        return <Shield className="h-5 w-5 text-green-600" />;
      case "Zap":
        return <Zap className="h-5 w-5 text-green-600" />;
      case "CheckCircle2":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "Sparkles":
        return <Sparkles className="h-5 w-5 text-green-600" />;
      case "Mail":
        return <Mail className="h-5 w-5 text-green-600" />;
      case "BookOpenCheck":
        return <BookOpenCheck className="h-5 w-5 text-green-600" />;
      case "Presentation":
        return <Presentation className="h-5 w-5 text-green-600" />;
      case "Network":
        return <Network className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-green-600" />;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {carbonProduct.title}
            </h1>
            <span
              className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                carbonProduct.status === "active"
                  ? "bg-green-100 text-green-800"
                  : carbonProduct.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {carbonProduct.status === "active"
                ? language === "vi"
                  ? "Đang hoạt động"
                  : "Active"
                : carbonProduct.status === "pending"
                  ? language === "vi"
                    ? "Đang xử lý"
                    : "Pending"
                  : language === "vi"
                    ? "Hết hạn"
                    : "Expired"}
            </span>
          </div>
          <div className="flex items-center mt-2 text-gray-600">
            <Building className="h-4 w-4 mr-1" />
            <span>{carbonProduct.company}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            {language === "vi" ? "Tài liệu" : "Documents"}
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            {language === "vi"
              ? "Truy cập AI CarbonSeek"
              : "Access AI CarbonSeek"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-green-600" />
              {language === "vi" ? "AI CarbonSeek" : "AI CarbonSeek"}
            </CardTitle>
            <CardDescription>
              {language === "vi"
                ? "Nền tảng AI phân tích phát thải carbon"
                : "AI Carbon Emission Analysis Platform"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative h-32 w-full rounded-lg overflow-hidden">
              <video
                src="https://res.cloudinary.com/dyticflm3/video/upload/v1744631174/CARBONSEEK_C%C3%B4ng_c%E1%BB%A5_h%E1%BB%97_tr%E1%BB%A3_nghi%C3%AAn_c%E1%BB%A9u_v%C3%A0_qu%E1%BA%A3n_l%C3%BD_to%C3%A0n_b%E1%BB%99_v%E1%BB%81_ESG_T%C3%ADn_ch%E1%BB%89_carbon_%C4%91%E1%BA%A7y_%C4%91%E1%BB%A7_th%C3%B4ng_tin_nh%E1%BA%A5t_tr%C3%AAn_th%E1%BB%8B_tr%C6%B0%E1%BB%9Dng_hi%E1%BB%87n_nay_cvbsck.mp4"
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {language === "vi"
                ? "Truy cập nền tảng AI CarbonSeek để phân tích và quản lý dữ liệu phát thải carbon của doanh nghiệp bạn."
                : "Access the AI CarbonSeek platform to analyze and manage your business's carbon emission data."}
            </p>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 h-10"
              onClick={() => window.open(carbonProduct.aiPlatformUrl, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {language === "vi"
                ? "Đăng nhập vào AI CarbonSeek"
                : "Login to AI CarbonSeek"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              {language === "vi"
                ? "Tài liệu & Hướng dẫn"
                : "Documents & Guides"}
            </CardTitle>
            <CardDescription>
              {language === "vi"
                ? "Thư viện tài liệu hỗ trợ"
                : "Support Document Library"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative h-32 w-full rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Greenhouse%20Library%20Haven.jpg-V06rjIZMn48LhPqcTNKEYK9NMkbiRb.jpeg"
                alt={
                  language === "vi" ? "Thư viện tài liệu" : "Document Library"
                }
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {language === "vi"
                ? "Truy cập thư viện Google Drive chứa tất cả tài liệu hướng dẫn, mẫu báo cáo và tài liệu tham khảo."
                : "Access the Google Drive library containing all guides, report templates, and reference materials."}
            </p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 h-10"
              onClick={() =>
                window.open(carbonProduct.documentsDriveUrl, "_blank")
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {language === "vi"
                ? "Mở thư viện tài liệu"
                : "Open Document Library"}
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Show Menus */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">
            {language === "vi" ? "Tổng quan" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="resources">
            {language === "vi" ? "Tài nguyên" : "Resources"}
          </TabsTrigger>
          <TabsTrigger value="usage">
            {language === "vi" ? "Sử dụng" : "Usage"}
          </TabsTrigger>
          <TabsTrigger value="subscription">
            {language === "vi" ? "Thông tin đăng ký" : "Subscription"}
          </TabsTrigger>
          <TabsTrigger value="support">
            {language === "vi" ? "Hỗ trợ" : "Support"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        {language === "vi"
                          ? "Mô tả sản phẩm"
                          : "Product Description"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {carbonProduct.description}
                      </p>

                      <div className="flex items-center space-x-4 mt-6">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            {language === "vi"
                              ? "Thời hạn đăng ký"
                              : "Subscription Period"}
                          </p>
                          <p className="text-sm">
                            {carbonProduct.startDate} - {carbonProduct.endDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="relative h-48 w-full rounded-lg overflow-hidden">
                        <Image
                          src="https://res.cloudinary.com/dyticflm3/image/upload/v1744635841/CarbonSeek_Banner_ous7jy.jpg"
                          alt={carbonProduct.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">
                      {language === "vi" ? "Tính năng chính" : "Key Features"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {carbonProduct.features.map((feature) => (
                        <Card
                          key={feature.id}
                          className="border-2 border-green-100"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center">
                              <div className="bg-green-100 p-2 rounded-full mr-3">
                                {renderIcon(feature.icon)}
                              </div>
                              <CardTitle className="text-base">
                                {feature.title}
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">
                              {feature.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "vi"
                      ? "Thông tin sản phẩm"
                      : "Product Information"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {language === "vi" ? "Công ty" : "Company"}
                      </p>
                      <p className="text-sm">{carbonProduct.company}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {language === "vi"
                          ? "Thời hạn đăng ký"
                          : "Subscription Period"}
                      </p>
                      <p className="text-sm">
                        {carbonProduct.startDate} - {carbonProduct.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {language === "vi" ? "Gói dịch vụ" : "Service Package"}
                      </p>
                      <p className="text-sm">
                        {carbonProduct.id === "ca-002"
                          ? language === "vi"
                            ? "Doanh nghiệp"
                            : "Enterprise"
                          : carbonProduct.id === "ca-001"
                            ? language === "vi"
                              ? "Chuyên gia"
                              : "Expert"
                            : language === "vi"
                              ? "Dùng thử"
                              : "Trial"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {language === "vi"
                          ? "Người quản lý tài khoản"
                          : "Account Manager"}
                      </p>
                      <p className="text-sm">
                        {carbonProduct.accountManager.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {carbonProduct.accountManager.email}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      {language === "vi"
                        ? "Truy cập AI CarbonSeek"
                        : "Access AI CarbonSeek"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">
                  {language === "vi"
                    ? "Tài nguyên có sẵn"
                    : "Available Resources"}
                </h3>
                <p className="text-gray-600">
                  {language === "vi"
                    ? "Tất cả tài liệu và hướng dẫn cho Carbon Toàn Thư 4.0"
                    : "All documents and guides for Carbon Complete 4.0"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      language === "vi"
                        ? "Tìm kiếm tài liệu..."
                        : "Search documents..."
                    }
                    className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    {language === "vi" ? "Lọc" : "Filter"}
                  </Button>
                  <Button variant="outline" size="sm">
                    {language === "vi" ? "Sắp xếp" : "Sort"}
                  </Button>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {carbonProduct.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex flex-col p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-4">
                          {renderIcon(resource.icon)}
                        </div>
                        <div>
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-500">
                            {resource.type.toUpperCase()} • {resource.size} •{" "}
                            {resource.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200"
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
                          {language === "vi" ? "Xem" : "View"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {language === "vi" ? "Tải xuống" : "Download"}
                        </Button>
                      </div>
                    </div>
                    {resource.title.includes("CarbonSeek") &&
                      resource.type === "video" && (
                        <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden">
                          <video
                            src="https://res.cloudinary.com/dyticflm3/video/upload/v1744631174/CARBONSEEK_C%C3%B4ng_c%E1%BB%A5_h%E1%BB%97_tr%E1%BB%A3_nghi%C3%AAn_c%E1%BB%A9u_v%C3%A0_qu%E1%BA%A3n_l%C3%BD_to%C3%A0n_b%E1%BB%99_v%E1%BB%81_ESG_T%C3%ADn_ch%E1%BB%89_carbon_%C4%91%E1%BA%A7y_%C4%91%E1%BB%A7_th%C3%B4ng_tin_nh%E1%BA%A5t_tr%C3%AAn_th%E1%BB%8B_tr%C6%B0%E1%BB%9Dng_hi%E1%BB%87n_nay_cvbsck.mp4"
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                          />
                        </div>
                      )}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">
                      {language === "vi"
                        ? "Thư viện tài liệu đầy đủ"
                        : "Complete Document Library"}
                    </h4>
                    <p className="text-sm text-blue-700 mt-1 mb-3">
                      {language === "vi"
                        ? "Truy cập Google Drive để xem tất cả tài liệu, bao gồm các bản cập nhật mới nhất."
                        : "Access Google Drive to view all documents, including the latest updates."}
                    </p>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() =>
                        window.open(carbonProduct.documentsDriveUrl, "_blank")
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {language === "vi"
                        ? "Mở thư viện Google Drive"
                        : "Open Google Drive Library"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "vi" ? "Thống kê sử dụng" : "Usage Statistics"}
              </CardTitle>
              <CardDescription>
                {language === "vi"
                  ? "Theo dõi việc sử dụng nền tảng Carbon Toàn Thư của bạn"
                  : "Track your Carbon Complete platform usage"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === "vi"
                        ? "Tổng lượt truy cập"
                        : "Total Accesses"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {carbonProduct.usageStats.totalUsage}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {language === "vi" ? "Kể từ" : "Since"}{" "}
                      {carbonProduct.startDate}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === "vi"
                        ? "Sử dụng tháng này"
                        : "This Month Usage"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {carbonProduct.usageStats.lastMonthUsage}
                    </div>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>
                        +12%{" "}
                        {language === "vi"
                          ? "so với tháng trước"
                          : "vs last month"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === "vi" ? "Giới hạn sử dụng" : "Usage Limit"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {carbonProduct.usageStats.usageLimit}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span>
                        {carbonProduct.usageStats.usagePercentage}%{" "}
                        {language === "vi" ? "đã sử dụng" : "used"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">
                  {language === "vi" ? "Xu hướng sử dụng" : "Usage Trends"}
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg border p-4 flex items-center justify-center">
                  <div className="w-full h-full flex items-end justify-between px-4">
                    {usageData.datasets.map((value, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="bg-green-500 w-12 rounded-t-md"
                          style={{ height: `${value}%` }}
                        ></div>
                        <span className="text-xs mt-2">
                          {usageData.labels[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {language === "vi"
                        ? "Người dùng hoạt động"
                        : "Active Users"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {carbonProduct.recentActivities
                        .slice(0, 4)
                        .map((activity, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm">{activity.user}</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {language === "vi" ? "Đang hoạt động" : "Active"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {language === "vi"
                        ? "Hoạt động gần đây"
                        : "Recent Activities"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {carbonProduct.recentActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{activity.action}</span>
                          <span className="text-xs text-gray-500">
                            {activity.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  {language === "vi"
                    ? "Chi tiết đăng ký"
                    : "Subscription Details"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">
                        {language === "vi" ? "Gói dịch vụ" : "Service Package"}
                      </span>
                      <span className="font-medium">
                        {carbonProduct.id === "ca-002"
                          ? language === "vi"
                            ? "Doanh nghiệp"
                            : "Enterprise"
                          : carbonProduct.id === "ca-001"
                            ? language === "vi"
                              ? "Chuyên gia"
                              : "Expert"
                            : language === "vi"
                              ? "Dùng thử"
                              : "Trial"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">
                        {language === "vi" ? "Ngày bắt đầu" : "Start Date"}
                      </span>
                      <span className="font-medium">
                        {carbonProduct.startDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">
                        {language === "vi" ? "Ngày kết thúc" : "End Date"}
                      </span>
                      <span className="font-medium">
                        {carbonProduct.endDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">
                        {language === "vi"
                          ? "Chu kỳ thanh toán"
                          : "Billing Cycle"}
                      </span>
                      <span className="font-medium">
                        {carbonProduct.billingCycle}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">
                        {language === "vi" ? "Giá" : "Price"}
                      </span>
                      <span className="font-medium">
                        {carbonProduct.price === 0
                          ? language === "vi"
                            ? "Miễn phí"
                            : "Free"
                          : new Intl.NumberFormat(
                              language === "vi" ? "vi-VN" : "en-US",
                              {
                                style: "currency",
                                currency: "VND",
                              },
                            ).format(carbonProduct.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">
                        {language === "vi" ? "Trạng thái" : "Status"}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {language === "vi" ? "Đang hoạt động" : "Active"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Card className="border-2 border-green-100">
                      <CardHeader>
                        <CardTitle>
                          {language === "vi"
                            ? "Thông tin thanh toán"
                            : "Payment Information"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            {language === "vi"
                              ? "Phương thức thanh toán"
                              : "Payment Method"}
                          </span>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{carbonProduct.paymentMethod}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            {language === "vi"
                              ? "Thông tin thẻ"
                              : "Card Information"}
                          </span>
                          <span>{carbonProduct.cardInfo}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            {language === "vi"
                              ? "Thanh toán tiếp theo"
                              : "Next Payment"}
                          </span>
                          <span>{carbonProduct.nextBillingDate}</span>
                        </div>

                        <div className="pt-4 mt-2 border-t border-gray-200">
                          <Button variant="outline" className="w-full">
                            <Settings className="h-4 w-4 mr-2" />
                            {language === "vi"
                              ? "Quản lý thanh toán"
                              : "Manage Payment"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {carbonProduct.id === "ca-003" ? (
                      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">
                              {language === "vi"
                                ? "Sắp hết hạn dùng thử"
                                : "Trial Ending Soon"}
                            </h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              {language === "vi"
                                ? `Gói dùng thử của bạn sẽ hết hạn vào ngày ${carbonProduct.endDate}. Nâng cấp ngay để tiếp tục sử dụng dịch vụ.`
                                : `Your trial will expire on ${carbonProduct.endDate}. Upgrade now to continue using the service.`}
                            </p>
                            <Button className="mt-3 bg-yellow-600 hover:bg-yellow-700">
                              {language === "vi"
                                ? "Nâng cấp ngay"
                                : "Upgrade Now"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">
                              {language === "vi"
                                ? "Sắp hết hạn đăng ký"
                                : "Subscription Ending Soon"}
                            </h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              {language === "vi"
                                ? `Đăng ký của bạn sẽ hết hạn vào ngày ${carbonProduct.endDate}. Liên hệ với chúng tôi để gia hạn và đảm bảo dịch vụ không bị gián đoạn.`
                                : `Your subscription will expire on ${carbonProduct.endDate}. Contact us to renew and ensure uninterrupted service.`}
                            </p>
                            <Button className="mt-3 bg-yellow-600 hover:bg-yellow-700">
                              {language === "vi" ? "Gia hạn ngay" : "Renew Now"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">
                  {language === "vi" ? "Lịch sử thanh toán" : "Payment History"}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">
                          {language === "vi" ? "Ngày" : "Date"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">
                          {language === "vi" ? "Mô tả" : "Description"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">
                          {language === "vi" ? "Số tiền" : "Amount"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">
                          {language === "vi" ? "Trạng thái" : "Status"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">
                          {language === "vi" ? "Hóa đơn" : "Invoice"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">{carbonProduct.startDate}</td>
                        <td className="py-3 px-4">{carbonProduct.title}</td>
                        <td className="py-3 px-4">
                          {carbonProduct.price === 0
                            ? language === "vi"
                              ? "Miễn phí"
                              : "Free"
                            : new Intl.NumberFormat(
                                language === "vi" ? "vi-VN" : "en-US",
                                {
                                  style: "currency",
                                  currency: "VND",
                                },
                              ).format(carbonProduct.price)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {language === "vi" ? "Đã thanh toán" : "Paid"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {language === "vi" ? "Liên hệ hỗ trợ" : "Support Contact"}
                  </h3>
                  <Card className="border-2 border-green-100">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-green-100 p-3 rounded-full mr-4">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">
                            {language === "vi"
                              ? "Đội ngũ hỗ trợ"
                              : "Support Team"}
                          </h4>
                          <p className="text-gray-500">
                            {language === "vi"
                              ? "Luôn sẵn sàng giúp đỡ bạn với mọi vấn đề"
                              : "Always ready to help you with any issues"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500 mr-3 mt-0.5"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Email
                            </p>
                            <p className="text-sm">
                              {carbonProduct.supportContact.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500 mr-3 mt-0.5"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              {language === "vi" ? "Điện thoại" : "Phone"}
                            </p>
                            <p className="text-sm">
                              {carbonProduct.supportContact.phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500 mr-3 mt-0.5"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              {language === "vi"
                                ? "Giờ hỗ trợ"
                                : "Support Hours"}
                            </p>
                            <p className="text-sm">
                              {carbonProduct.supportContact.supportHours}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
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
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          {language === "vi"
                            ? "Gửi yêu cầu hỗ trợ"
                            : "Send Support Request"}
                        </Button>
                        <Button variant="outline" className="w-full">
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
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          {language === "vi" ? "Gọi hỗ trợ" : "Call Support"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <h3 className="text-lg font-medium mt-8 mb-4">
                    {language === "vi"
                      ? "Người quản lý tài khoản"
                      : "Account Manager"}
                  </h3>
                  <Card className="border-2 border-blue-100">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">
                            {carbonProduct.accountManager.name}
                          </h4>
                          <p className="text-gray-500">
                            {language === "vi"
                              ? "Người quản lý tài khoản của bạn"
                              : "Your account manager"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500 mr-3 mt-0.5"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Email
                            </p>
                            <p className="text-sm">
                              {carbonProduct.accountManager.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500 mr-3 mt-0.5"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              {language === "vi" ? "Điện thoại" : "Phone"}
                            </p>
                            <p className="text-sm">
                              {carbonProduct.accountManager.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
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
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        {language === "vi"
                          ? "Liên hệ người quản lý"
                          : "Contact Manager"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {language === "vi"
                      ? "Câu hỏi thường gặp"
                      : "Frequently Asked Questions"}
                  </h3>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {language === "vi"
                            ? "Làm thế nào để tạo báo cáo phát thải?"
                            : "How do I generate an emission report?"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          {language === "vi"
                            ? "Để tạo báo cáo phát thải, đăng nhập vào nền tảng AI CarbonSeek, chọn 'Báo cáo' từ menu chính, sau đó chọn loại báo cáo và khoảng thời gian bạn muốn tạo báo cáo."
                            : "To generate an emission report, log in to the AI CarbonSeek platform, select 'Reports' from the main menu, then choose the report type and time period you want to generate the report for."}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {language === "vi"
                            ? "Làm thế nào để thêm người dùng mới vào hệ thống?"
                            : "How do I add new users to the system?"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          {language === "vi"
                            ? "Để thêm người dùng mới, đăng nhập với tư cách quản trị viên, đi đến 'Cài đặt > Quản lý người dùng', sau đó nhấp vào 'Thêm người dùng mới' và điền thông tin cần thiết."
                            : "To add new users, log in as an administrator, go to 'Settings > User Management', then click on 'Add New User' and fill in the required information."}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {language === "vi"
                            ? "Làm thế nào để tích hợp dữ liệu từ hệ thống khác?"
                            : "How do I integrate data from other systems?"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          {language === "vi"
                            ? "Carbon Toàn Thư 4.0 cung cấp API để tích hợp dữ liệu từ các hệ thống khác. Xem tài liệu API trong thư viện tài liệu để biết hướng dẫn chi tiết về cách tích hợp."
                            : "Carbon Complete 4.0 provides APIs to integrate data from other systems. See the API documentation in the document library for detailed instructions on how to integrate."}
                        </p>
                      </CardContent>
                    </Card>

                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        <FileQuestion className="h-4 w-4 mr-2" />
                        {language === "vi"
                          ? "Xem tất cả câu hỏi thường gặp"
                          : "View all FAQs"}
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-8 mb-4">
                    {language === "vi"
                      ? "Tài liệu hỗ trợ"
                      : "Support Resources"}
                  </h3>
                  <div className="space-y-4">
                    <Card className="hover:bg-gray-50 transition-colors">
                      <CardContent className="p-4 flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-4">
                          <Video className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {language === "vi"
                              ? "Video hướng dẫn"
                              : "Tutorial Videos"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {language === "vi"
                              ? "Xem các video hướng dẫn về cách sử dụng nền tảng"
                              : "Watch tutorial videos on how to use the platform"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:bg-gray-50 transition-colors">
                      <CardContent className="p-4 flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-4">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {language === "vi"
                              ? "Hướng dẫn sử dụng"
                              : "User Guides"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {language === "vi"
                              ? "Tài liệu hướng dẫn chi tiết về tất cả các tính năng"
                              : "Detailed documentation on all features"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:bg-gray-50 transition-colors">
                      <CardContent className="p-4 flex items-center">
                        <div className="bg-purple-100 p-2 rounded-full mr-4">
                          <Bot className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {language === "vi"
                              ? "Trợ lý ảo"
                              : "Virtual Assistant"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {language === "vi"
                              ? "Sử dụng trợ lý ảo AI để được hỗ trợ ngay lập tức"
                              : "Use the AI virtual assistant for immediate help"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
