"use client"
import { useLanguage } from "@/context/language-context"
import {
  Calendar,
  MapPin,
  Users,
  BarChart3,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Leaf,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    name: "Dự án trồng rừng Tây Nguyên",
    description:
      "Dự án trồng và phục hồi rừng tại khu vực Tây Nguyên nhằm tăng cường khả năng hấp thụ carbon và bảo vệ đa dạng sinh học. Dự án này được thực hiện với sự hợp tác của cộng đồng địa phương và các tổ chức phi chính phủ.",
    status: "active",
    registrationDate: "2023-10-15",
    startDate: "2023-11-01",
    endDate: "2025-11-01",
    carbonCredits: 25.5,
    carbonCreditsTotal: 500,
    carbonCreditsClaimed: 125,
    type: "forestry",
    location: "Tây Nguyên",
    coordinates: "12.0433° N, 108.0580° E",
    area: 250,
    participants: 120,
    progress: 65,
    documents: [
      { name: "Báo cáo tiến độ Q1 2024", date: "2024-01-15", type: "pdf" },
      { name: "Đánh giá tác động môi trường", date: "2023-09-20", type: "pdf" },
      { name: "Kế hoạch thực hiện", date: "2023-10-10", type: "docx" },
    ],
    activities: [
      { date: "2024-02-15", description: "Hoàn thành trồng 5,000 cây xanh tại khu vực A" },
      { date: "2024-01-10", description: "Tập huấn kỹ thuật trồng và chăm sóc cây cho 50 hộ dân" },
      { date: "2023-12-05", description: "Khảo sát và đánh giá khu vực trồng mới" },
      { date: "2023-11-01", description: "Khởi động dự án với sự tham gia của cộng đồng địa phương" },
    ],
  },
  {
    id: 2,
    name: "Năng lượng mặt trời Ninh Thuận",
    description:
      "Dự án lắp đặt các tấm pin năng lượng mặt trời tại Ninh Thuận nhằm giảm phát thải carbon từ việc sử dụng nhiên liệu hóa thạch. Dự án này góp phần vào mục tiêu phát triển năng lượng tái tạo của Việt Nam.",
    status: "pending",
    registrationDate: "2023-11-20",
    startDate: "2024-01-15",
    endDate: "2026-01-15",
    carbonCredits: 18.2,
    carbonCreditsTotal: 800,
    carbonCreditsClaimed: 0,
    type: "renewable",
    location: "Ninh Thuận",
    coordinates: "11.6739° N, 108.8620° E",
    area: 120,
    participants: 45,
    progress: 25,
    documents: [
      { name: "Kế hoạch triển khai", date: "2023-11-25", type: "pdf" },
      { name: "Báo cáo khả thi", date: "2023-10-30", type: "pdf" },
    ],
    activities: [
      { date: "2023-12-20", description: "Hoàn thành khảo sát địa điểm lắp đặt" },
      { date: "2023-11-30", description: "Ký kết hợp đồng với nhà cung cấp thiết bị" },
      { date: "2023-11-20", description: "Đăng ký tham gia dự án" },
    ],
  },
  {
    id: 3,
    name: "Bảo tồn đất ngập nước Đồng Tháp",
    description:
      "Dự án bảo tồn và phục hồi hệ sinh thái đất ngập nước tại Đồng Tháp, giúp tăng cường khả năng lưu trữ carbon và bảo vệ đa dạng sinh học. Dự án này cũng hỗ trợ sinh kế bền vững cho cộng đồng địa phương.",
    status: "completed",
    registrationDate: "2023-08-05",
    startDate: "2023-09-01",
    endDate: "2024-03-01",
    carbonCredits: 42.8,
    carbonCreditsTotal: 300,
    carbonCreditsClaimed: 300,
    type: "conservation",
    location: "Đồng Tháp",
    coordinates: "10.4938° N, 105.6882° E",
    area: 180,
    participants: 85,
    progress: 100,
    documents: [
      { name: "Báo cáo kết quả dự án", date: "2024-03-15", type: "pdf" },
      { name: "Đánh giá tác động sinh thái", date: "2023-08-20", type: "pdf" },
      { name: "Kế hoạch bảo tồn", date: "2023-08-10", type: "docx" },
    ],
    activities: [
      { date: "2024-03-01", description: "Hoàn thành dự án và tổ chức lễ bàn giao" },
      { date: "2024-02-15", description: "Đánh giá cuối cùng về hiệu quả bảo tồn" },
      { date: "2024-01-10", description: "Tập huấn quản lý đất ngập nước cho cộng đồng" },
      { date: "2023-11-20", description: "Hoàn thành phục hồi 50 ha đất ngập nước" },
      { date: "2023-09-01", description: "Khởi động dự án bảo tồn" },
    ],
  },
  {
    id: 4,
    name: "Chuyển đổi chất thải hữu cơ Hà Nội",
    description:
      "Dự án xử lý và tái chế chất thải hữu cơ thành phân bón tại Hà Nội, giúp giảm phát thải khí mê-tan từ bãi rác và tạo ra sản phẩm có giá trị. Dự án này góp phần vào mục tiêu quản lý chất thải bền vững của thành phố.",
    status: "active",
    registrationDate: "2023-09-12",
    startDate: "2023-10-01",
    endDate: "2024-10-01",
    carbonCredits: 15.3,
    carbonCreditsTotal: 250,
    carbonCreditsClaimed: 75,
    type: "waste",
    location: "Hà Nội",
    coordinates: "21.0285° N, 105.8542° E",
    area: 5,
    participants: 30,
    progress: 45,
    documents: [
      { name: "Báo cáo tiến độ Q1 2024", date: "2024-01-10", type: "pdf" },
      { name: "Kế hoạch vận hành", date: "2023-09-25", type: "pdf" },
    ],
    activities: [
      { date: "2024-02-01", description: "Mở rộng thu gom chất thải từ 5 chợ mới" },
      { date: "2023-12-15", description: "Hoàn thành lắp đặt thiết bị xử lý chất thải" },
      { date: "2023-11-01", description: "Tập huấn phân loại rác cho 20 khu dân cư" },
      { date: "2023-10-01", description: "Khởi động dự án xử lý chất thải" },
    ],
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Đang hoạt động
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Chờ xác nhận
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Hoàn thành
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Không xác định
        </Badge>
      )
  }
}

export default function ProjectDetail({ id }: { id: number }) {
  const { language } = useLanguage()
  const project = mockProjects.find((p) => p.id === id)

  if (!project) {
    return <div>Không tìm thấy dự án</div>
  }

  // Format date to local format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-8">
      {/* Project header */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-green-600 to-green-400">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <StatusBadge status={project.status} />
            <h1 className="text-2xl font-bold text-white mt-2">{project.name}</h1>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-medium">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Địa điểm</p>
                <p className="font-medium">{project.location}</p>
                <p className="text-xs text-gray-500">{project.coordinates}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Users className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Người tham gia</p>
                <p className="font-medium">{project.participants} người</p>
              </div>
            </div>

            <div className="flex items-start">
              <Leaf className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Diện tích</p>
                <p className="font-medium">{project.area} ha</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon credits */}
      <Card>
        <CardHeader>
          <CardTitle>Tín chỉ Carbon</CardTitle>
          <CardDescription>Thông tin về tín chỉ carbon của dự án</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-green-700 mb-1">Tổng tín chỉ dự kiến</p>
              <p className="text-2xl font-bold text-green-700">
                {project.carbonCreditsTotal} <span className="text-sm font-normal">tấn CO₂</span>
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-700 mb-1">Đã xác nhận</p>
              <p className="text-2xl font-bold text-blue-700">
                {project.carbonCreditsClaimed} <span className="text-sm font-normal">tấn CO₂</span>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 mb-1">Của bạn</p>
              <p className="text-2xl font-bold text-gray-700">
                {project.carbonCredits} <span className="text-sm font-normal">tấn CO₂</span>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Tiến độ dự án</span>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="activities">Hoạt động</TabsTrigger>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử hoạt động</CardTitle>
              <CardDescription>Các hoạt động đã diễn ra trong dự án</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l border-gray-200">
                {project.activities.map((activity, index) => (
                  <div key={index} className="mb-6 relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-green-500 border-4 border-white"></div>
                    <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                    <p className="font-medium mt-1">{activity.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu dự án</CardTitle>
              <CardDescription>Các tài liệu liên quan đến dự án</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-md border border-gray-200 mr-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">{formatDate(doc.date)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Tải xuống
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo phát thải</CardTitle>
              <CardDescription>Thống kê về lượng phát thải đã giảm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Báo cáo chi tiết sẽ được cập nhật sau</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
