"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"
import Image from "next/image"

export default function CarbonCreditDetailPage() {
  const { id } = useParams()
  const { language } = useLanguage()
  const [progress, setProgress] = useState(65)
  const [activeTab, setActiveTab] = useState("overview")


  const carbonCredit = {
    id,
    title: language === "vi" ? "Tín chỉ Carbon - Dự án Rừng Cát Tiên" : "Carbon Credits - Cat Tien Forest Project",
    location: language === "vi" ? "Vườn Quốc gia Cát Tiên, Đồng Nai" : "Cat Tien National Park, Dong Nai",
    area: "1,500 hecta",
    startDate: "15/04/2023",
    endDate: "15/04/2028",
    totalCredits: "5,000 tCO2e",
    usedCredits: "1,250 tCO2e",
    remainingCredits: "3,750 tCO2e",
    status: "active",
    description:
      language === "vi"
        ? "Dự án trồng rừng và bảo tồn đa dạng sinh học tại Vườn Quốc gia Cát Tiên, góp phần giảm phát thải CO2 và bảo vệ môi trường. Dự án được chứng nhận theo tiêu chuẩn VCS (Verified Carbon Standard) và CCB (Climate, Community & Biodiversity Standards)."
        : "Reforestation and biodiversity conservation project at Cat Tien National Park, contributing to CO2 emission reduction and environmental protection. The project is certified according to VCS (Verified Carbon Standard) and CCB (Climate, Community & Biodiversity Standards).",
    image: "/images/before-reforestation.png",
    afterImage: "/images/after-reforestation.png",
    projectManager: language === "vi" ? "Nguyễn Văn Minh" : "Nguyen Van Minh",
    projectContact: "project-manager@tinchicarbon.vn",
    projectPhone: "+84 28 1234 5678",
    verificationDate: "30/03/2023",
    nextVerificationDate: "30/03/2024",
    verificationBody: "Bureau Veritas",
    communityBenefits: [
      language === "vi" ? "Tạo việc làm cho cộng đồng địa phương" : "Creating jobs for local communities",
      language === "vi" ? "Cải thiện sinh kế" : "Improving livelihoods",
      language === "vi" ? "Đào tạo kỹ năng lâm nghiệp" : "Forestry skills training",
    ],
    biodiversityBenefits: [
      language === "vi" ? "Bảo vệ các loài động thực vật quý hiếm" : "Protection of rare plant and animal species",
      language === "vi" ? "Phục hồi hệ sinh thái" : "Ecosystem restoration",
      language === "vi" ? "Tăng cường đa dạng sinh học" : "Enhancing biodiversity",
    ],
    reports: [
      {
        id: "rep-001",
        title: language === "vi" ? "Báo cáo Quý 1/2023" : "Q1 2023 Report",
        date: "30/03/2023",
        size: "2.4 MB",
        type: "quarterly",
      },
      {
        id: "rep-002",
        title: language === "vi" ? "Báo cáo Quý 2/2023" : "Q2 2023 Report",
        date: "30/06/2023",
        size: "3.1 MB",
        type: "quarterly",
      },
      {
        id: "rep-003",
        title: language === "vi" ? "Báo cáo Quý 3/2023" : "Q3 2023 Report",
        date: "30/09/2023",
        size: "2.8 MB",
        type: "quarterly",
      },
      {
        id: "rep-004",
        title: language === "vi" ? "Báo cáo Kiểm chứng 2023" : "2023 Verification Report",
        date: "15/05/2023",
        size: "4.5 MB",
        type: "verification",
      },
      {
        id: "rep-005",
        title: language === "vi" ? "Báo cáo Tác động Môi trường" : "Environmental Impact Report",
        date: "10/02/2023",
        size: "5.2 MB",
        type: "impact",
      },
    ],
    transactions: [
      {
        id: "tr-001",
        date: "15/04/2023",
        type: language === "vi" ? "Mua" : "Purchase",
        amount: "5,000 tCO2e",
        value: "250,000,000 VND",
        status: "completed",
      },
      {
        id: "tr-002",
        date: "20/05/2023",
        type: language === "vi" ? "Sử dụng" : "Usage",
        amount: "500 tCO2e",
        value: "25,000,000 VND",
        purpose: language === "vi" ? "Bù đắp phát thải Quý 1" : "Q1 Emissions Offset",
        status: "completed",
      },
      {
        id: "tr-003",
        date: "15/07/2023",
        type: language === "vi" ? "Sử dụng" : "Usage",
        amount: "750 tCO2e",
        value: "37,500,000 VND",
        purpose: language === "vi" ? "Bù đắp phát thải Quý 2" : "Q2 Emissions Offset",
        status: "completed",
      },
      {
        id: "tr-004",
        date: "10/10/2023",
        type: language === "vi" ? "Chuyển nhượng" : "Transfer",
        amount: "250 tCO2e",
        value: "12,500,000 VND",
        recipient: "Công ty XYZ",
        status: "pending",
      },
    ],
    certificates: [
      {
        id: "cert-001",
        title: language === "vi" ? "Chứng nhận Mua Tín chỉ Carbon" : "Carbon Credit Purchase Certificate",
        date: "15/04/2023",
        size: "1.2 MB",
      },
      {
        id: "cert-002",
        title: language === "vi" ? "Chứng nhận VCS" : "VCS Certificate",
        date: "30/03/2023",
        size: "1.5 MB",
      },
      {
        id: "cert-003",
        title: language === "vi" ? "Chứng nhận CCB" : "CCB Certificate",
        date: "30/03/2023",
        size: "1.3 MB",
      },
    ],
    timeline: [
      {
        date: "01/01/2023",
        event: language === "vi" ? "Bắt đầu dự án" : "Project Start",
      },
      {
        date: "15/02/2023",
        event: language === "vi" ? "Hoàn thành đánh giá ban đầu" : "Initial Assessment Completed",
      },
      {
        date: "30/03/2023",
        event: language === "vi" ? "Chứng nhận VCS và CCB" : "VCS and CCB Certification",
      },
      {
        date: "15/04/2023",
        event: language === "vi" ? "Mua tín chỉ carbon" : "Carbon Credits Purchase",
      },
      {
        date: "20/05/2023",
        event: language === "vi" ? "Sử dụng tín chỉ đầu tiên" : "First Credit Usage",
      },
      {
        date: "30/03/2024",
        event: language === "vi" ? "Kiểm chứng tiếp theo" : "Next Verification",
        upcoming: true,
      },
    ],
  }

  // Tính toán phần trăm tín chỉ đã sử dụng
  const usedPercentage = Math.round(
    (Number.parseInt(carbonCredit.usedCredits.replace(/[^0-9]/g, "")) /
      Number.parseInt(carbonCredit.totalCredits.replace(/[^0-9]/g, ""))) *
      100,
  )

  return (
    <div className="py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{carbonCredit.title}</h1>
            <span
              className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                carbonCredit.status === "active"
                  ? "bg-green-100 text-green-800"
                  : carbonCredit.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {carbonCredit.status === "active"
                ? language === "vi"
                  ? "Đang hoạt động"
                  : "Active"
                : carbonCredit.status === "pending"
                  ? language === "vi"
                    ? "Đang xử lý"
                    : "Pending"
                  : language === "vi"
                    ? "Hết hạn"
                    : "Expired"}
            </span>
          </div>
          <div className="flex items-center mt-2 text-gray-600">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{carbonCredit.location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Share2 className="w-4 h-4 mr-2" />
            {language === "vi" ? "Chia sẻ" : "Share"}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Printer className="w-4 h-4 mr-2" />
            {language === "vi" ? "In" : "Print"}
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="mr-2 h-4 w-4" />
            {language === "vi" ? "Tải chứng chỉ" : "Download Certificate"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{language === "vi" ? "Tổng tín chỉ" : "Total Credits"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{carbonCredit.totalCredits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{language === "vi" ? "Tín chỉ đã sử dụng" : "Used Credits"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{carbonCredit.usedCredits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{language === "vi" ? "Tín chỉ còn lại" : "Remaining Credits"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{carbonCredit.remainingCredits}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 md:mb-8">
        <CardHeader>
          <CardTitle>{language === "vi" ? "Tiến độ dự án" : "Project Progress"}</CardTitle>
          <CardDescription>{language === "vi" ? "Sử dụng tín chỉ carbon" : "Carbon Credit Usage"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">
                {usedPercentage}% {language === "vi" ? "đã xong" : "used"}
              </span>
              <span className="text-sm text-gray-500">
                {carbonCredit.usedCredits} / {carbonCredit.totalCredits}
              </span>
            </div>
            <Progress value={usedPercentage} className="h-2" />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {language === "vi" ? "Thời gian dự án" : "Project Period"}
                </p>
                <p className="text-sm">
                  {carbonCredit.startDate} - {carbonCredit.endDate}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {language === "vi" ? "Diện tích dự án" : "Project Area"}
                </p>
                <p className="text-sm">{carbonCredit.area}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  {language === "vi" ? "Sắp đến kỳ kiểm chứng" : "Upcoming Verification"}
                </h4>
                <p className="text-xs text-yellow-700 mt-1">
                  {language === "vi"
                    ? `Dự án sẽ được kiểm chứng vào ngày ${carbonCredit.nextVerificationDate}. Vui lòng chuẩn bị tài liệu cần thiết.`
                    : `The project will be verified on ${carbonCredit.nextVerificationDate}. Please prepare the necessary documents.`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="mb-6 md:mb-8" value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full md:w-auto">
            <TabsTrigger value="overview">{language === "vi" ? "Tổng quan" : "Overview"}</TabsTrigger>
            <TabsTrigger value="reports">{language === "vi" ? "Báo cáo" : "Reports"}</TabsTrigger>
            <TabsTrigger value="transactions">{language === "vi" ? "Giao dịch" : "Transactions"}</TabsTrigger>
            <TabsTrigger value="certificates">{language === "vi" ? "Chứng chỉ" : "Certificates"}</TabsTrigger>
            <TabsTrigger value="timeline">{language === "vi" ? "Dòng thời gian" : "Timeline"}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4 md:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        {language === "vi" ? "Mô tả dự án" : "Project Description"}
                      </h3>
                      <p className="text-gray-600 mb-6">{carbonCredit.description}</p>

                      <h3 className="text-lg font-medium mb-3">
                        {language === "vi" ? "Lợi ích cộng đồng" : "Community Benefits"}
                      </h3>
                      <ul className="space-y-2 mb-6">
                        {carbonCredit.communityBenefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <Users className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="text-lg font-medium mb-3">
                        {language === "vi" ? "Lợi ích đa dạng sinh học" : "Biodiversity Benefits"}
                      </h3>
                      <ul className="space-y-2">
                        {carbonCredit.biodiversityBenefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <Shield className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <div className="relative h-40 sm:h-48 w-full rounded-lg overflow-hidden">
                        <Image
                          src={carbonCredit.image || "/placeholder.svg?height=200&width=400"}
                          alt={language === "vi" ? "Trước khi tái trồng rừng" : "Before Reforestation"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                          {language === "vi" ? "Trước khi tái trồng rừng" : "Before Reforestation"}
                        </div>
                      </div>
                      <div className="relative h-40 sm:h-48 w-full rounded-lg overflow-hidden">
                        <Image
                          src={carbonCredit.afterImage || "/placeholder.svg?height=200&width=400"}
                          alt={language === "vi" ? "Sau khi tái trồng rừng" : "After Reforestation"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                          {language === "vi" ? "Sau khi tái trồng rừng" : "After Reforestation"}
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-800 mb-2">
                          {language === "vi" ? "Tiêu chuẩn chứng nhận" : "Certification Standards"}
                        </h4>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-white p-2 rounded-full">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-green-600"
                            >
                              <path
                                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">VCS (Verified Carbon Standard)</p>
                            <p className="text-xs text-green-700">
                              {language === "vi"
                                ? "Chứng nhận ngày: " + carbonCredit.verificationDate
                                : "Certified on: " + carbonCredit.verificationDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-white p-2 rounded-full">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-green-600"
                            >
                              <path
                                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">CCB (Climate, Community & Biodiversity)</p>
                            <p className="text-xs text-green-700">
                              {language === "vi"
                                ? "Chứng nhận ngày: " + carbonCredit.verificationDate
                                : "Certified on: " + carbonCredit.verificationDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "vi" ? "Thông tin dự án" : "Project Information"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {language === "vi" ? "Vị trí dự án" : "Project Location"}
                      </p>
                      <p className="text-sm">{carbonCredit.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">{language === "vi" ? "Diện tích" : "Area"}</p>
                      <p className="text-sm">{carbonCredit.area}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {language === "vi" ? "Thời gian dự án" : "Project Period"}
                      </p>
                      <p className="text-sm">
                        {carbonCredit.startDate} - {carbonCredit.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {language === "vi" ? "Quản lý dự án" : "Project Manager"}
                      </p>
                      <p className="text-sm">{carbonCredit.projectManager}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {language === "vi" ? "Đơn vị kiểm chứng" : "Verification Body"}
                      </p>
                      <p className="text-sm">{carbonCredit.verificationBody}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {language === "vi" ? "Kiểm chứng tiếp theo" : "Next Verification"}
                      </p>
                      <p className="text-sm">{carbonCredit.nextVerificationDate}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      {language === "vi" ? "Xem trang dự án" : "View Project Page"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{language === "vi" ? "Hành động nhanh" : "Quick Actions"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Tải chứng chỉ" : "Download Certificate"}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Tạo báo cáo" : "Generate Report"}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Chia sẻ dự án" : "Share Project"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === "vi" ? "Báo cáo dự án" : "Project Reports"}</CardTitle>
              <CardDescription>
                {language === "vi"
                  ? "Tất cả báo cáo liên quan đến dự án tín chỉ carbon"
                  : "All reports related to the carbon credit project"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">{language === "vi" ? "Tất cả" : "All"}</TabsTrigger>
                    <TabsTrigger value="quarterly">{language === "vi" ? "Báo cáo quý" : "Quarterly"}</TabsTrigger>
                    <TabsTrigger value="verification">{language === "vi" ? "Kiểm chứng" : "Verification"}</TabsTrigger>
                    <TabsTrigger value="impact">{language === "vi" ? "Tác động" : "Impact"}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-4">
                {carbonCredit.reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center mb-3 sm:mb-0">
                      <div className="bg-green-100 p-2 rounded-full mr-4 flex-shrink-0">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-gray-500">
                          {report.date} • {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
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
                      <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                        <Download className="h-4 w-4 mr-2" />
                        {language === "vi" ? "Tải xuống" : "Download"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === "vi" ? "Lịch sử giao dịch" : "Transaction History"}</CardTitle>
              <CardDescription>
                {language === "vi"
                  ? "Tất cả giao dịch liên quan đến tín chỉ carbon của bạn"
                  : "All transactions related to your carbon credits"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        {language === "vi" ? "Ngày" : "Date"}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        {language === "vi" ? "Loại giao dịch" : "Transaction Type"}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        {language === "vi" ? "Số lượng" : "Amount"}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        {language === "vi" ? "Giá trị" : "Value"}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        {language === "vi" ? "Mục đích/Người nhận" : "Purpose/Recipient"}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        {language === "vi" ? "Trạng thái" : "Status"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {carbonCredit.transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{transaction.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              transaction.type === (language === "vi" ? "Mua" : "Purchase")
                                ? "bg-green-100 text-green-800"
                                : transaction.type === (language === "vi" ? "Sử dụng" : "Usage")
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">{transaction.amount}</td>
                        <td className="py-3 px-4">{transaction.value}</td>
                        <td className="py-3 px-4">{transaction.purpose || transaction.recipient || "-"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {transaction.status === "completed" ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {language === "vi" ? "Hoàn thành" : "Completed"}
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                {language === "vi" ? "Đang xử lý" : "Pending"}
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === "vi" ? "Chứng chỉ" : "Certificates"}</CardTitle>
              <CardDescription>
                {language === "vi"
                  ? "Tất cả chứng chỉ liên quan đến dự án tín chỉ carbon"
                  : "All certificates related to the carbon credit project"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {carbonCredit.certificates.map((certificate) => (
                  <Card key={certificate.id} className="overflow-hidden">
                    <div className="relative h-40 w-full bg-green-50 flex items-center justify-center">
                      <FileText className="h-16 w-16 text-green-300" />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{certificate.title}</CardTitle>
                      <CardDescription>{certificate.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-500 mb-4">{certificate.size}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
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
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <Download className="h-4 w-4 mr-2" />
                          {language === "vi" ? "Tải xuống" : "Download"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === "vi" ? "Dòng thời gian dự án" : "Project Timeline"}</CardTitle>
              <CardDescription>
                {language === "vi"
                  ? "Các sự kiện quan trọng trong dự án tín chỉ carbon"
                  : "Key events in the carbon credit project"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-green-200 pl-6 ml-3 space-y-8">
                {carbonCredit.timeline.map((event, index) => (
                  <div key={index} className="relative">
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
                        event.upcoming ? "border-yellow-200 bg-yellow-50" : "border-gray-200 bg-white"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-500">{event.date}</p>
                      <p className="font-medium mt-1">{event.event}</p>
                      {event.upcoming && (
                        <div className="mt-2 flex items-center text-sm text-yellow-700">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span>{language === "vi" ? "Sắp diễn ra" : "Upcoming"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
