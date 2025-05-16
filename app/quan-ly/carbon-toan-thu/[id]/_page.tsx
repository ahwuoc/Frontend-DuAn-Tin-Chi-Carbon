// "use client";

// import { useState } from "react";
// import { useParams } from "next/navigation";
// // import { useLanguage } from "@/context/language-context"; // Xóa import này
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import {
//   Download,
//   FileText,
//   ExternalLink,
//   Calendar,
//   Building,
//   ArrowUpRight,
//   BookOpen,
//   FileQuestion,
//   Video,
//   Database,
//   BarChart2,
//   Bot,
//   Users,
//   Settings,
//   CreditCard,
//   Shield,
//   Zap,
//   AlertTriangle,
//   TrendingUp,
//   CheckCircle2,
//   Sparkles,
//   Mail,
//   BookOpenCheck,
//   Presentation,
//   Network,
// } from "lucide-react";
// import Image from "next/image";

// // Dữ liệu giả định cho các sản phẩm Carbon Toàn Thư
// // Cần phải có định nghĩa của carbonProducts ở đây hoặc import từ nơi khác
// // Ví dụ (đặt bên ngoài component hoặc import):
// const carbonProducts = {
//   "ca-001": {
//     id: "ca-001",
//     title: "Carbon Toàn Thư Gói Chuyên gia",
//     description: "Gói dành cho chuyên gia và nhóm nhỏ cần phân tích sâu về phát thải carbon.",
//     status: "active",
//     company: "Công ty TNHH Xanh Việt Nam",
//     startDate: "01/01/2024",
//     endDate: "31/12/2024",
//     price: 15000000, // VND
//     billingCycle: "Hàng năm",
//     paymentMethod: "Chuyển khoản ngân hàng",
//     cardInfo: "**** **** **** 1234",
//     nextBillingDate: "01/01/2025",
//     aiPlatformUrl: "https://ai.carbonseek.vn/expert",
//     documentsDriveUrl: "https://docs.google.com/drive/expert",
//     features: [
//       { id: 1, icon: "Database", title: "Quản lý dữ liệu phát thải", description: "Thu thập và quản lý dữ liệu phát thải từ nhiều nguồn." },
//       { id: 2, icon: "BarChart2", title: "Phân tích nâng cao", description: "Các công cụ phân tích và báo cáo chuyên sâu." },
//       { id: 3, icon: "Users", title: "Hỗ trợ 5 người dùng", description: "Truy cập cho tối đa 5 người dùng trong tổ chức." },
//     ],
//     usageStats: {
//       totalUsage: 560,
//       lastMonthUsage: 85,
//       usageLimit: "Không giới hạn", // Có thể là một số hoặc 'Không giới hạn'
//       usagePercentage: 0 // Nếu là không giới hạn, percentage có thể là 0 hoặc N/A
//     },
//     recentActivities: [
//       { user: "Nguyễn Văn A", action: "Truy cập nền tảng AI", date: "15/05/2025" },
//       { user: "Trần Thị B", action: "Tải báo cáo Q1 2025", date: "14/05/2025" },
//       { user: "Lê Văn C", action: "Xem tài liệu hướng dẫn API", date: "14/05/2025" },
//       { user: "Nguyễn Văn A", action: "Cập nhật dữ liệu hoạt động", date: "13/05/2025" },
//     ],
//     supportContact: {
//       email: "support@carbonseek.vn",
//       phone: "028 1234 5678",
//       supportHours: "Thứ 2 - Thứ 6, 9:00 - 17:00",
//     },
//     accountManager: {
//       name: "Phạm Thị D",
//       email: "dpt@carbonseek.vn",
//       phone: "090 987 6543",
//     },
//     // Thêm các trường dữ liệu khác nếu cần
//   },
//   "ca-002": {
//     id: "ca-002",
//     title: "Carbon Toàn Thư Gói Doanh nghiệp",
//     description: "Giải pháp toàn diện cho doanh nghiệp lớn, tích hợp và báo cáo theo tiêu chuẩn quốc tế.",
//     status: "active",
//     company: "Tập đoàn Hòa Phát",
//     startDate: "10/03/2024",
//     endDate: "09/03/2025",
//     price: 50000000, // VND
//     billingCycle: "Hàng năm",
//     paymentMethod: "Chuyển khoản ngân hàng",
//     cardInfo: "**** **** **** 5678",
//     nextBillingDate: "10/03/2025",
//     aiPlatformUrl: "https://ai.carbonseek.vn/enterprise",
//     documentsDriveUrl: "https://docs.google.com/drive/enterprise",
//     features: [
//       { id: 1, icon: "Database", title: "Quản lý dữ liệu quy mô lớn", description: "Hỗ trợ thu thập và quản lý dữ liệu phức tạp cho doanh nghiệp lớn." },
//       { id: 2, icon: "BarChart2", title: "Báo cáo ESG tùy chỉnh", description: "Công cụ tạo báo cáo ESG theo yêu cầu và tuân thủ các khung báo cáo." },
//       { id: 3, icon: "Users", title: "Hỗ trợ không giới hạn người dùng", description: "Truy cập không giới hạn cho tất cả nhân viên." },
//       { id: 4, icon: "Network", title: "Tích hợp hệ thống", description: "Hỗ trợ tích hợp dữ liệu tự động với các hệ thống nội bộ." },
//     ],
//     usageStats: {
//       totalUsage: 1250,
//       lastMonthUsage: 210,
//       usageLimit: "Không giới hạn",
//       usagePercentage: 0
//     },
//     recentActivities: [
//       { user: "Nguyễn Văn F", action: "Truy cập nền tảng AI", date: "15/05/2025" },
//       { user: "Trần Thị G", action: "Xuất báo cáo ESG H1 2025", date: "15/05/2025" },
//       { user: "Lê Văn H", action: "Thêm người dùng mới", date: "14/05/2025" },
//       { user: "Phạm Thị I", action: "Xem video hướng dẫn tích hợp", date: "13/05/2025" },
//     ],
//     supportContact: {
//       email: "enterprise-support@carbonseek.vn",
//       phone: "028 9876 5432",
//       supportHours: "Thứ 2 - Chủ Nhật, 24/7",
//     },
//     accountManager: {
//       name: "Nguyễn Văn K",
//       email: "kvn@carbonseek.vn",
//       phone: "091 234 5678",
//     },
//   },
//   "ca-003": {
//     id: "ca-003",
//     title: "Carbon Toàn Thư Gói Dùng thử",
//     description: "Dùng thử nền tảng Carbon Toàn Thư với các tính năng cơ bản.",
//     status: "pending", // Giả định trạng thái pending hoặc expired cho gói dùng thử
//     company: "Công ty Mới Bắt Đầu",
//     startDate: "01/05/2025",
//     endDate: "31/05/2025",
//     price: 0, // Miễn phí
//     billingCycle: "Một lần", // Hoặc "Dùng thử"
//     paymentMethod: "N/A",
//     cardInfo: "N/A",
//     nextBillingDate: "31/05/2025",
//     aiPlatformUrl: "https://ai.carbonseek.vn/trial",
//     documentsDriveUrl: "https://docs.google.com/drive/trial",
//     features: [
//       { id: 1, icon: "FileText", title: "Quản lý dữ liệu cơ bản", description: "Nhập và xem dữ liệu phát thải cơ bản." },
//       { id: 2, icon: "FileQuestion", title: "Truy cập FAQ", description: "Xem các câu hỏi thường gặp." },
//       { id: 3, icon: "Users", title: "Hỗ trợ 1 người dùng", description: "Truy cập cho 1 người dùng." },
//     ],
//     usageStats: {
//       totalUsage: 15,
//       lastMonthUsage: 15, // Dùng thử 1 tháng nên lastMonthUsage = totalUsage
//       usageLimit: 50, // Giới hạn số lượt truy cập hoặc tính năng
//       usagePercentage: (15 / 50) * 100 // Tính theo giới hạn
//     },
//     recentActivities: [
//       { user: "Trần Văn L", action: "Truy cập nền tảng AI", date: "15/05/2025" },
//       { user: "Trần Văn L", action: "Xem hướng dẫn sử dụng", date: "14/05/2025" },
//     ],
//     supportContact: {
//       email: "trial-support@carbonseek.vn",
//       phone: "028 1122 3344",
//       supportHours: "Thứ 2 - Thứ 6, 9:00 - 17:00",
//     },
//     accountManager: {
//       name: "Lê Thị M",
//       email: "mlt@carbonseek.vn",
//       phone: "093 456 7890",
//     },
//   },
// };


// export default function CarbonAccountingDetailPage() {
//   const { id } = useParams();
//   // const { language } = useLanguage(); // Xóa dòng này
//   const [usageData, setUsageData] = useState({
//     labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"], // Cập nhật nhãn sang tiếng Việt
//     datasets: [65, 45, 75, 50, 80, 90],
//   });

//   // Dữ liệu cho các gói Carbon Toàn Thư khác nhau

//   // Lấy thông tin sản phẩm dựa trên ID
//   // Sử dụng as string để đảm bảo kiểu dữ liệu
//   const carbonProduct = carbonProducts[id] || carbonProducts["ca-002"];

//   // Hàm hiển thị icon dựa trên loại
//   const renderIcon = (iconName: string) => { // Thêm kiểu cho iconName
//     switch (iconName) {
//       case "FileText":
//         return <FileText className="h-5 w-5 text-green-600" />;
//       case "Video":
//         return <Video className="h-5 w-5 text-green-600" />;
//       case "FileQuestion":
//         return <FileQuestion className="h-5 w-5 text-green-600" />;
//       case "Bot":
//         return <Bot className="h-5 w-5 text-green-600" />;
//       case "Database":
//         return <Database className="h-5 w-5 text-green-600" />;
//       case "BarChart2":
//         return <BarChart2 className="h-5 w-5 text-green-600" />;
//       case "Users":
//         return <Users className="h-5 w-5 text-green-600" />;
//       case "Shield":
//         return <Shield className="h-5 w-5 text-green-600" />;
//       case "Zap":
//         return <Zap className="h-5 w-5 text-green-600" />;
//       case "CheckCircle2":
//         return <CheckCircle2 className="h-5 w-5 text-green-600" />;
//       case "Sparkles":
//         return <Sparkles className="h-5 w-5 text-green-600" />;
//       case "Mail":
//         return <Mail className="h-5 w-5 text-green-600" />;
//       case "BookOpenCheck":
//         return <BookOpenCheck className="h-5 w-5 text-green-600" />;
//       case "Presentation":
//         return <Presentation className="h-5 w-5 text-green-600" />;
//       case "Network":
//         return <Network className="h-5 w-5 text-green-600" />;
//       default:
//         return <FileText className="h-5 w-5 text-green-600" />;
//     }
//   };

//   // Helper function to format currency in VND
//   const formatCurrencyVND = (amount: number) => {
//     if (amount === 0) return "Miễn phí";
//     // Sử dụng NumberFormat để định dạng tiền tệ Việt Nam
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//       minimumFractionDigits: 0, // Không hiển thị số thập phân nếu không có
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };


//   return (
//     <div>
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <div className="flex items-center">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//               {carbonProduct.title}
//             </h1>
//             <span
//               className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${carbonProduct.status === "active"
//                 ? "bg-green-100 text-green-800"
//                 : carbonProduct.status === "pending"
//                   ? "bg-yellow-100 text-yellow-800"
//                   : "bg-red-100 text-red-800"
//                 }`}
//             >
//               {/* Thay thế điều kiện ngôn ngữ bằng văn bản tiếng Việt */}
//               {carbonProduct.status === "active"
//                 ? "Đang hoạt động"
//                 : carbonProduct.status === "pending"
//                   ? "Đang xử lý"
//                   : "Hết hạn"}
//             </span>
//           </div>
//           <div className="flex items-center mt-2 text-gray-600">
//             <Building className="h-4 w-4 mr-1" />
//             <span>{carbonProduct.company}</span>
//           </div>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <Button
//             variant="outline"
//             className="border-green-600 text-green-600 hover:bg-green-50"
//           >
//             <BookOpen className="mr-2 h-4 w-4" />
//             Tài liệu {/* Văn bản tiếng Việt */}
//           </Button>
//           <Button className="bg-green-600 hover:bg-green-700">
//             <ArrowUpRight className="mr-2 h-4 w-4" />
//             Truy cập AI CarbonSeek {/* Văn bản tiếng Việt */}
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
//           <CardHeader className="pb-2">
//             <CardTitle className="flex items-center">
//               <Bot className="h-5 w-5 mr-2 text-green-600" />
//               AI CarbonSeek {/* Văn bản tiếng Việt */}
//             </CardTitle>
//             <CardDescription>
//               Nền tảng AI phân tích phát thải carbon {/* Văn bản tiếng Việt */}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="mb-4 relative h-32 w-full rounded-lg overflow-hidden">
//               <video
//                 src="https://res.cloudinary.com/dyticflm3/video/upload/v1744631174/CARBONSEEK_C%C3%B4ng_c%E1%BB%A5_h%E1%BB%97_tr%E1%BB%A3_nghi%C3%AAn_c%E1%BB%A9u_v%C3%A0_qu%E1%BA%A3n_l%C3%BD_to%C3%A0n_b%E1%BB%99_v%E1%BB%81_ESG_T%C3%ADn_ch%E1%BB%89_carbon_%C4%91%E1%BA%A7y_%C4%91%E1%BB%A7_th%C3%B4ng_tin_nh%E1%BA%A5t_tr%C3%AAn_th%E1%BB%8B_tr%C6%B0%E1%BB%9Dng_hi%E1%BB%87n_nay_cvbsck.mp4"
//                 className="w-full h-full object-cover"
//                 autoPlay
//                 muted
//                 loop
//               />
//             </div>
//             <p className="text-sm text-gray-600 mb-4">
//               Truy cập nền tảng AI CarbonSeek để phân tích và quản lý dữ liệu phát thải carbon của doanh nghiệp bạn. {/* Văn bản tiếng Việt */}
//             </p>
//             <Button
//               className="w-full bg-green-600 hover:bg-green-700 h-10"
//               onClick={() => window.open(carbonProduct.aiPlatformUrl, "_blank")}
//             >
//               <ExternalLink className="mr-2 h-4 w-4" />
//               Đăng nhập vào AI CarbonSeek {/* Văn bản tiếng Việt */}
//             </Button>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
//           <CardHeader className="pb-2">
//             <CardTitle className="flex items-center">
//               <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
//               Tài liệu & Hướng dẫn {/* Văn bản tiếng Việt */}
//             </CardTitle>
//             <CardDescription>
//               Thư viện tài liệu hỗ trợ {/* Văn bản tiếng Việt */}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="mb-4 relative h-32 w-full rounded-lg overflow-hidden">
//               <Image
//                 src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Greenhouse%20Library%20Haven.jpg-V06rjIZMn48LhPqcTNKEYK9NMkbiRb.jpeg"
//                 alt="Thư viện tài liệu" // Văn bản tiếng Việt
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <p className="text-sm text-gray-600 mb-4">
//               Truy cập thư viện Google Drive chứa tất cả tài liệu hướng dẫn, mẫu báo cáo và tài liệu tham khảo. {/* Văn bản tiếng Việt */}
//             </p>
//             <Button
//               className="w-full bg-blue-600 hover:bg-blue-700 h-10"
//               onClick={() =>
//                 window.open(carbonProduct.documentsDriveUrl, "_blank")
//               }
//             >
//               <ExternalLink className="mr-2 h-4 w-4" />
//               Mở thư viện tài liệu {/* Văn bản tiếng Việt */}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//       {/* Show Menus */}
//       <Tabs defaultValue="overview" className="mb-8">
//         <TabsList>
//           <TabsTrigger value="overview">
//             Tổng quan {/* Văn bản tiếng Việt */}
//           </TabsTrigger>
//           <TabsTrigger value="resources">
//             Tài nguyên {/* Văn bản tiếng Việt */}
//           </TabsTrigger>
//           <TabsTrigger value="usage">
//             Sử dụng {/* Văn bản tiếng Việt */}
//           </TabsTrigger>
//           <TabsTrigger value="subscription">
//             Thông tin đăng ký {/* Văn bản tiếng Việt */}
//           </TabsTrigger>
//           <TabsTrigger value="support">
//             Hỗ trợ {/* Văn bản tiếng Việt */}
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="mt-6">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2">
//               <Card>
//                 <CardContent className="pt-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h3 className="text-lg font-medium mb-4">
//                         Mô tả sản phẩm {/* Văn bản tiếng Việt */}
//                       </h3>
//                       <p className="text-gray-600 mb-4">
//                         {carbonProduct.description}
//                       </p>

//                       <div className="flex items-center space-x-4 mt-6">
//                         <Calendar className="h-5 w-5 text-gray-500" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-500">
//                             Thời hạn đăng ký {/* Văn bản tiếng Việt */}
//                           </p>
//                           <p className="text-sm">
//                             {carbonProduct.startDate} - {carbonProduct.endDate}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="relative h-48 w-full rounded-lg overflow-hidden">
//                         <Image
//                           src="https://res.cloudinary.com/dyticflm3/image/upload/v1744635841/CarbonSeek_Banner_ous7jy.jpg"
//                           alt={carbonProduct.title}
//                           fill
//                           className="object-cover"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-8">
//                     <h3 className="text-lg font-medium mb-4">
//                       Tính năng chính {/* Văn bản tiếng Việt */}
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       {carbonProduct.features.map((feature) => (
//                         <Card
//                           key={feature.id}
//                           className="border-2 border-green-100"
//                         >
//                           <CardHeader className="pb-2">
//                             <div className="flex items-center">
//                               <div className="bg-green-100 p-2 rounded-full mr-3">
//                                 {renderIcon(feature.icon)}
//                               </div>
//                               <CardTitle className="text-base">
//                                 {feature.title}
//                               </CardTitle>
//                             </div>
//                           </CardHeader>
//                           <CardContent>
//                             <p className="text-sm text-gray-600">
//                               {feature.description}
//                             </p>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="lg:col-span-1">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>
//                     Thông tin sản phẩm {/* Văn bản tiếng Việt */}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-start">
//                     <Building className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">
//                         Công ty {/* Văn bản tiếng Việt */}
//                       </p>
//                       <p className="text-sm">{carbonProduct.company}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">
//                         Thời hạn đăng ký {/* Văn bản tiếng Việt */}
//                       </p>
//                       <p className="text-sm">
//                         {carbonProduct.startDate} - {carbonProduct.endDate}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <CreditCard className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">
//                         Gói dịch vụ {/* Văn bản tiếng Việt */}
//                       </p>
//                       <p className="text-sm">
//                         {/* Thay thế điều kiện ngôn ngữ bằng văn bản tiếng Việt */}
//                         {carbonProduct.id === "ca-002"
//                           ? "Doanh nghiệp"
//                           : carbonProduct.id === "ca-001"
//                             ? "Chuyên gia"
//                             : "Dùng thử"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <Users className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">
//                         Người quản lý tài khoản {/* Văn bản tiếng Việt */}
//                       </p>
//                       <p className="text-sm">
//                         {carbonProduct.accountManager.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {carbonProduct.accountManager.email}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="pt-4 mt-4 border-t border-gray-200">
//                     <Button
//                       variant="outline"
//                       className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50"
//                     >
//                       <ArrowUpRight className="h-4 w-4 mr-2" />
//                       Truy cập AI CarbonSeek {/* Văn bản tiếng Việt */}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="resources" className="mt-6">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="mb-4">
//                 <h3 className="text-lg font-medium mb-2">
//                   Tài nguyên có sẵn {/* Văn bản tiếng Việt */}
//                 </h3>
//                 <p className="text-gray-600">
//                   Tất cả tài liệu và hướng dẫn cho Carbon Toàn Thư 4.0 {/* Văn bản tiếng Việt */}
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Tìm kiếm tài liệu..." // Văn bản tiếng Việt
//                     className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="20"
//                     height="20"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   >
//                     <circle cx="11" cy="11" r="8"></circle>
//                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                   </svg>
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <Button variant="outline" size="sm">
//                     Lọc {/* Văn bản tiếng Việt */}
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     Sắp xếp {/* Văn bản tiếng Việt */}
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-4 mt-6">
//                 {carbonProduct.resources && carbonProduct.resources.map((resource) => (
//                   <div
//                     key={resource.id}
//                     className="flex flex-col p-4 border rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="bg-green-100 p-2 rounded-full mr-4">
//                           {renderIcon(resource.icon)}
//                         </div>
//                         <div>
//                           <h4 className="font-medium">{resource.title}</h4>
//                           <p className="text-sm text-gray-500">
//                             {resource.type.toUpperCase()} • {resource.size} •{" "}
//                             {resource.date}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="text-blue-600 border-blue-200"
//                           onClick={() => window.open(resource.url, "_blank")} // Giả định resource có url
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             className="mr-2"
//                           >
//                             <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
//                             <circle cx="12" cy="12" r="3"></circle>
//                           </svg>
//                           Xem {/* Văn bản tiếng Việt */}
//                         </Button>
//                         {resource.downloadUrl && ( // Chỉ hiện nút tải xuống nếu có downloadUrl
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="text-green-600 border-green-200"
//                             onClick={() => window.open(resource.downloadUrl, "_blank")} // Giả định resource có downloadUrl
//                           >
//                             <Download className="h-4 w-4 mr-2" />
//                             Tải xuống {/* Văn bản tiếng Việt */}
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                     {/* Hiển thị video nhúng nếu là video resource */}
//                     {resource.type === "video" && (
//                       <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden">
//                         <video
//                           src={resource.url} // Sử dụng url của resource
//                           className="w-full h-full object-cover"
//                           autoPlay
//                           muted
//                           loop
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <div className="flex items-start">
//                   <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
//                     <BookOpen className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-blue-800">
//                       Thư viện tài liệu đầy đủ {/* Văn bản tiếng Việt */}
//                     </h4>
//                     <p className="text-sm text-blue-700 mt-1 mb-3">
//                       Truy cập Google Drive để xem tất cả tài liệu, bao gồm các bản cập nhật mới nhất. {/* Văn bản tiếng Việt */}
//                     </p>
//                     <Button
//                       className="bg-blue-600 hover:bg-blue-700"
//                       onClick={() =>
//                         window.open(carbonProduct.documentsDriveUrl, "_blank")
//                       }
//                     >
//                       <ExternalLink className="h-4 w-4 mr-2" />
//                       Mở thư viện Google Drive {/* Văn bản tiếng Việt */}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="usage" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>
//                 Thống kê sử dụng {/* Văn bản tiếng Việt */}
//               </CardTitle>
//               <CardDescription>
//                 Theo dõi việc sử dụng nền tảng Carbon Toàn Thư của bạn {/* Văn bản tiếng Việt */}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-base">
//                       Tổng lượt truy cập {/* Văn bản tiếng Việt */}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">
//                       {carbonProduct.usageStats.totalUsage}
//                     </div>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Kể từ{" "} {/* Văn bản tiếng Việt */}
//                       {carbonProduct.startDate}
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-base">
//                       Sử dụng tháng này {/* Văn bản tiếng Việt */}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">
//                       {carbonProduct.usageStats.lastMonthUsage}
//                     </div>
//                     {/* Giả định có dữ liệu so sánh tháng trước */}
//                     {carbonProduct.usageStats.lastMonthChangePercentage !== undefined && (
//                       <div className={`flex items-center text-sm ${carbonProduct.usageStats.lastMonthChangePercentage >= 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>
//                         {carbonProduct.usageStats.lastMonthChangePercentage >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />} {/* Cần import TrendingDown */}
//                         <span>
//                           {carbonProduct.usageStats.lastMonthChangePercentage >= 0 ? "+" : ""}
//                           {carbonProduct.usageStats.lastMonthChangePercentage}% so với tháng trước {/* Văn bản tiếng Việt */}
//                         </span>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-base">
//                       Giới hạn sử dụng {/* Văn bản tiếng Việt */}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {/* Hiển thị giới hạn nếu có */}
//                     {carbonProduct.usageStats.usageLimit !== "Không giới hạn" ? (
//                       <div className="text-3xl font-bold">
//                         {carbonProduct.usageStats.usageLimit}
//                       </div>
//                     ) : (
//                       <div className="text-xl font-bold text-gray-700">
//                         Không giới hạn {/* Văn bản tiếng Việt */}
//                       </div>
//                     )}

//                     {carbonProduct.usageStats.usageLimit !== "Không giới hạn" && (
//                       <div className="flex items-center text-sm text-gray-500 mt-1">
//                         <span>
//                           {carbonProduct.usageStats.usagePercentage}% đã sử dụng {/* Văn bản tiếng Việt */}
//                         </span>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>

//               <div className="mb-8">
//                 <h3 className="text-lg font-medium mb-4">
//                   Xu hướng sử dụng {/* Văn bản tiếng Việt */}
//                 </h3>
//                 {/* Biểu đồ đơn giản sử dụng div */}
//                 <div className="h-64 bg-gray-50 rounded-lg border p-4 flex items-center justify-center">
//                   <div className="w-full h-full flex items-end justify-between px-4">
//                     {usageData.datasets.map((value, index) => (
//                       <div key={index} className="flex flex-col items-center">
//                         <div
//                           className="bg-green-500 w-8 rounded-t-md" // Giảm chiều rộng thanh để đỡ chật
//                           style={{ height: `${value}%` }}
//                         ></div>
//                         <span className="text-xs mt-2">
//                           {usageData.labels[index]}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-base">
//                       Người dùng hoạt động {/* Văn bản tiếng Việt */}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {/* Lọc người dùng có trạng thái 'active' nếu có trường status */}
//                       {carbonProduct.recentActivities
//                         .filter(activity => activity.status === 'active') // Giả định activity có trường status
//                         .slice(0, 4)
//                         .map((activity, index) => (
//                           <div
//                             key={index}
//                             className="flex justify-between items-center"
//                           >
//                             <span className="text-sm">{activity.user}</span>
//                             <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                               Đang hoạt động {/* Văn bản tiếng Việt */}
//                             </span>
//                           </div>
//                         ))}
//                       {/* Nếu không có người dùng active trong recentActivities, hiển thị thông báo */}
//                       {carbonProduct.recentActivities.filter(activity => activity.status === 'active').length === 0 && (
//                         <p className="text-sm text-gray-500">Chưa có người dùng hoạt động gần đây.</p>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-base">
//                       Hoạt động gần đây {/* Văn bản tiếng Việt */}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {carbonProduct.recentActivities.map((activity, index) => (
//                         <div
//                           key={index}
//                           className="flex justify-between items-center"
//                         >
//                           <span className="text-sm">{activity.action}</span>
//                           <span className="text-xs text-gray-500">
//                             {activity.date}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="subscription" className="mt-6">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="mb-6">
//                 <h3 className="text-lg font-medium mb-2">
//                   Chi tiết đăng ký {/* Văn bản tiếng Việt */}
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <span className="text-gray-600">
//                         Gói dịch vụ {/* Văn bản tiếng Việt */}
//                       </span>
//                       <span className="font-medium">
//                         {/* Thay thế điều kiện ngôn ngữ bằng văn bản tiếng Việt */}
//                         {carbonProduct.id === "ca-002"
//                           ? "Doanh nghiệp"
//                           : carbonProduct.id === "ca-001"
//                             ? "Chuyên gia"
//                             : "Dùng thử"}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <span className="text-gray-600">
//                         Ngày bắt đầu {/* Văn bản tiếng Việt */}
//                       </span>
//                       <span className="font-medium">
//                         {carbonProduct.startDate}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <span className="text-gray-600">
//                         Ngày kết thúc {/* Văn bản tiếng Việt */}
//                       </span>
//                       <span className="font-medium">
//                         {carbonProduct.endDate}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <span className="text-gray-600">
//                         Chu kỳ thanh toán {/* Văn bản tiếng Việt */}
//                       </span>
//                       <span className="font-medium">
//                         {carbonProduct.billingCycle}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <span className="text-gray-600">
//                         Giá {/* Văn bản tiếng Việt */}
//                       </span>
//                       <span className="font-medium">
//                         {/* Sử dụng helper function để định dạng tiền */}
//                         {formatCurrencyVND(carbonProduct.price)}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <span className="text-gray-600">
//                         Trạng thái {/* Văn bản tiếng Việt */}
//                       </span>
//                       <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
//                         Đang hoạt động {/* Văn bản tiếng Việt */}
//                       </span>
//                     </div>
//                   </div>

//                   <div>
//                     <Card className="border-2 border-green-100">
//                       <CardHeader>
//                         <CardTitle>
//                           Thông tin thanh toán {/* Văn bản tiếng Việt */}
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-600">
//                             Phương thức thanh toán {/* Văn bản tiếng Việt */}
//                           </span>
//                           <div className="flex items-center">
//                             <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
//                             <span>{carbonProduct.paymentMethod}</span>
//                           </div>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-600">
//                             Thông tin thẻ {/* Văn bản tiếng Việt */}
//                           </span>
//                           <span>{carbonProduct.cardInfo}</span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-600">
//                             Thanh toán tiếp theo {/* Văn bản tiếng Việt */}
//                           </span>
//                           <span>{carbonProduct.nextBillingDate}</span>
//                         </div>

//                         <div className="pt-4 mt-2 border-t border-gray-200">
//                           <Button variant="outline" className="w-full">
//                             <Settings className="h-4 w-4 mr-2" />
//                             Quản lý thanh toán {/* Văn bản tiếng Việt */}
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>

//                     {/* Cập nhật cảnh báo hết hạn dùng thử / đăng ký */}
//                     {carbonProduct.status !== "expired" && ( // Chỉ hiển thị cảnh báo nếu chưa hết hạn
//                       <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//                         <div className="flex items-start">
//                           <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
//                           <div>
//                             <h4 className="font-medium text-yellow-800">
//                               {carbonProduct.id === "ca-003"
//                                 ? "Sắp hết hạn dùng thử"
//                                 : "Sắp hết hạn đăng ký"}
//                             </h4>
//                             <p className="text-sm text-yellow-700 mt-1">
//                               {carbonProduct.id === "ca-003"
//                                 ? `Gói dùng thử của bạn sẽ hết hạn vào ngày ${carbonProduct.endDate}. Nâng cấp ngay để tiếp tục sử dụng dịch vụ.`
//                                 : `Đăng ký của bạn sẽ hết hạn vào ngày ${carbonProduct.endDate}. Liên hệ với chúng tôi để gia hạn và đảm bảo dịch vụ không bị gián đoạn.`}
//                             </p>
//                             <Button className="mt-3 bg-yellow-600 hover:bg-yellow-700">
//                               {carbonProduct.id === "ca-003"
//                                 ? "Nâng cấp ngay"
//                                 : "Gia hạn ngay"}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                   </div>
//                 </div>
//               </div>

//               <div className="mt-8">
//                 <h3 className="text-lg font-medium mb-4">
//                   Lịch sử thanh toán {/* Văn bản tiếng Việt */}
//                 </h3>
//                 {/* Giả định có dữ liệu lịch sử thanh toán trong carbonProduct.paymentHistory */}
//                 {carbonProduct.paymentHistory && carbonProduct.paymentHistory.length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="border-b">
//                           <th className="text-left py-3 px-4 font-medium text-gray-500">
//                             Ngày {/* Văn bản tiếng Việt */}
//                           </th>
//                           <th className="text-left py-3 px-4 font-medium text-gray-500">
//                             Mô tả {/* Văn bản tiếng Việt */}
//                           </th>
//                           <th className="text-left py-3 px-4 font-medium text-gray-500">
//                             Số tiền {/* Văn bản tiếng Việt */}
//                           </th>
//                           <th className="text-left py-3 px-4 font-medium text-gray-500">
//                             Trạng thái {/* Văn bản tiếng Việt */}
//                           </th>
//                           <th className="text-left py-3 px-4 font-medium text-gray-500">
//                             Hóa đơn {/* Văn bản tiếng Việt */}
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {carbonProduct.paymentHistory.map((payment, index) => (
//                           <tr key={index} className="border-b">
//                             <td className="py-3 px-4">{payment.date}</td>
//                             <td className="py-3 px-4">{payment.description}</td>
//                             <td className="py-3 px-4">
//                               {formatCurrencyVND(payment.amount)}
//                             </td>
//                             <td className="py-3 px-4">
//                               <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                 {payment.status}
//                               </span>
//                             </td>
//                             <td className="py-3 px-4">
//                               {payment.invoiceUrl && ( // Chỉ hiện nút tải xuống nếu có invoiceUrl
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-8 px-2"
//                                   onClick={() => window.open(payment.invoiceUrl, "_blank")}
//                                 >
//                                   <Download className="h-4 w-4" />
//                                 </Button>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">Không có lịch sử thanh toán nào.</p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="support" className="mt-6">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div>
//                   <h3 className="text-lg font-medium mb-4">
//                     Liên hệ hỗ trợ {/* Văn bản tiếng Việt */}
//                   </h3>
//                   <Card className="border-2 border-green-100">
//                     <CardContent className="pt-6">
//                       <div className="flex items-center mb-4">
//                         <div className="bg-green-100 p-3 rounded-full mr-4">
//                           <Users className="h-6 w-6 text-green-600" />
//                         </div>
//                         <div>
//                           <h4 className="font-medium text-lg">
//                             Đội ngũ hỗ trợ {/* Văn bản tiếng Việt */}
//                           </h4>
//                           <p className="text-gray-500">
//                             Luôn sẵn sàng giúp đỡ bạn với mọi vấn đề {/* Văn bản tiếng Việt */}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="space-y-4 mb-6">
//                         <div className="flex items-start">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="20"
//                             height="20"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             className="text-gray-500 mr-3 mt-0.5"
//                           >
//                             <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
//                             <polyline points="22,6 12,13 2,6"></polyline>
//                           </svg>
//                           <div>
//                             <p className="text-sm font-medium text-gray-500">
//                               Email
//                             </p>
//                             <p className="text-sm">
//                               {carbonProduct.supportContact.email}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-start">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="20"
//                             height="20"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             className="text-gray-500 mr-3 mt-0.5"
//                           >
//                             <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
//                           </svg>
//                           <div>
//                             <p className="text-sm font-medium text-gray-500">
//                               Điện thoại {/* Văn bản tiếng Việt */}
//                             </p>
//                             <p className="text-sm">
//                               {carbonProduct.supportContact.phone}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-start">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="20"
//                             height="20"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             className="text-gray-500 mr-3 mt-0.5"
//                           >
//                             <circle cx="12" cy="12" r="10"></circle>
//                             <polyline points="12 6 12 12 16 14"></polyline>
//                           </svg>
//                           <div>
//                             <p className="text-sm font-medium text-gray-500">
//                               Giờ hỗ trợ {/* Văn bản tiếng Việt */}
//                             </p>
//                             <p className="text-sm">
//                               {carbonProduct.supportContact.supportHours}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="space-y-3">
//                         <Button className="w-full bg-green-600 hover:bg-green-700">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             className="mr-2"
//                           >
//                             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//                           </svg>
//                           Gửi yêu cầu hỗ trợ {/* Văn bản tiếng Việt */}
//                         </Button>
//                         <Button variant="outline" className="w-full">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             className="mr-2"
//                           >
//                             <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
//                           </svg>
//                           Gọi hỗ trợ {/* Văn bản tiếng Việt */}
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <h3 className="text-lg font-medium mt-8 mb-4">
//                     Người quản lý tài khoản {/* Văn bản tiếng Việt */}
//                   </h3>
//                   <Card className="border-2 border-blue-100">
//                     <CardContent className="pt-6">
//                       <div className="flex items-center mb-4">
//                         <div className="bg-blue-100 p-3 rounded-full mr-4">
//                           <Users className="h-6 w-6 text-blue-600" />
//                         </div>
//                         <div>
//                           <h4 className="font-medium text-lg">
//                             {carbonProduct.accountManager.name}
//                           </h4>
//                           <p className="text-gray-500">
//                             Người quản lý tài khoản của bạn {/* Văn bản tiếng Việt */}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="space-y-4 mb-6">
//                         <div className="flex items-start">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="20"
//                             height="20"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             className="text-gray-500 mr-3 mt-0.5"
//                           >
//                             <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
//                             <polyline points="22,6 12,13 2,6"></polyline>
//                           </svg>
//                           <div>
//                             <p className="text-sm font-medium text-gray-500">
//                               Email
//                             </p>
//                             <p className="text-sm">
//                               {carbonProduct.accountManager.email}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-start">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="20"
//                             height="20"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             className="text-gray-500 mr-3 mt-0.5"
//                           >
//                             <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
//                           </svg>
//                           <div>
//                             <p className="text-sm font-medium text-gray-500">
//                               Điện thoại {/* Văn bản tiếng Việt */}
//                             </p>
//                             <p className="text-sm">
//                               {carbonProduct.accountManager.phone}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <Button variant="outline" className="w-full">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="16"
//                           height="16"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="mr-2"
//                         >
//                           <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//                         </svg>
//                         Liên hệ người quản lý {/* Văn bản tiếng Việt */}
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-medium mb-4">
//                     Câu hỏi thường gặp {/* Văn bản tiếng Việt */}
//                   </h3>
//                   <div className="space-y-4">
//                     {/* Giả định có dữ liệu FAQ trong carbonProduct.faq */}
//                     {carbonProduct.faq && carbonProduct.faq.length > 0 ? (
//                       carbonProduct.faq.map((item, index) => (
//                         <Card key={index}>
//                           <CardHeader className="pb-2">
//                             <CardTitle className="text-base">
//                               {item.question}
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent>
//                             <p className="text-sm text-gray-600">
//                               {item.answer}
//                             </p>
//                           </CardContent>
//                         </Card>
//                       ))
//                     ) : (
//                       <p className="text-sm text-gray-500">Chưa có câu hỏi thường gặp nào.</p>
//                     )}

//                     <div className="pt-4">
//                       <Button variant="outline" className="w-full">
//                         <FileQuestion className="h-4 w-4 mr-2" />
//                         Xem tất cả câu hỏi thường gặp {/* Văn bản tiếng Việt */}
//                       </Button>
//                     </div>
//                   </div>

//                   <h3 className="text-lg font-medium mt-8 mb-4">
//                     Tài liệu hỗ trợ {/* Văn bản tiếng Việt */}
//                   </h3>
//                   {/* Giả định có dữ liệu supportResources trong carbonProduct */}
//                   <div className="space-y-4">
//                     {carbonProduct.supportResources && carbonProduct.supportResources.length > 0 ? (
//                       carbonProduct.supportResources.map((resource, index) => (
//                         <Card key={index} className="hover:bg-gray-50 transition-colors">
//                           <CardContent className="p-4 flex items-center">
//                             <div className={`p-2 rounded-full mr-4 ${resource.iconColor === 'blue' ? 'bg-blue-100' : resource.iconColor === 'purple' ? 'bg-purple-100' : 'bg-green-100'}`}> {/* Sử dụng màu icon từ dữ liệu hoặc mặc định */}
//                               {renderIcon(resource.icon)}
//                             </div>
//                             <div>
//                               <h4 className="font-medium">{resource.title}</h4>
//                               <p className="text-sm text-gray-500">
//                                 {resource.description}
//                               </p>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))
//                     ) : (
//                       <p className="text-sm text-gray-500">Không có tài nguyên hỗ trợ nào.</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }