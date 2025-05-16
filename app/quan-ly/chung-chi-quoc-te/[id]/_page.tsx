// "use client"

// import { useParams } from "next/navigation"
// import { useLanguage } from "@/context/language-context"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Download, FileText, Award, Calendar, User, CheckCircle2, BookOpen, Shield, Globe } from "lucide-react"
// import Image from "next/image"

// export default function CertificateDetailPage() {
//   const { id } = useParams()
//   const { language } = useLanguage()

//   // Dữ liệu mẫu cho các chứng chỉ quốc tế
//   const certificates = {
//     "ic-001": {
//       id: "ic-001",
//       title: language === "vi" ? "Chứng chỉ Quốc tế - Gói Nghiên cứu" : "International Certificate - Research Package",
//       recipient: "Nguyễn Văn A",
//       issueDate: "10/02/2025",
//       expiryDate: "10/02/2027",
//       status: "active",
//       description:
//         language === "vi"
//           ? "Chứng chỉ nghiên cứu về carbon và biến đổi khí hậu, được cấp bởi Columbia Southern University (CSU) và Tín Chỉ Carbon Việt Nam. Trang bị kiến thức nền tảng và phương pháp nghiên cứu trong lĩnh vực carbon."
//           : "Research certificate in carbon and climate change, issued by Columbia Southern University (CSU) and Vietnam Carbon Credits. Provides foundational knowledge and research methodologies in the carbon field.",
//       image: "/images/certificate-sample.png",
//       issuer: {
//         name: "Columbia Southern University (CSU)",
//         logo: "/images/csu-logo.png",
//       },
//       features: [
//         language === "vi" ? "Phương pháp nghiên cứu" : "Research Methodologies",
//         language === "vi" ? "Đào tạo 3 tháng" : "3-month Training",
//         language === "vi" ? "Hỗ trợ học thuật" : "Academic Support",
//         language === "vi" ? "Tiếp cận cơ sở dữ liệu quốc tế" : "Access to International Databases",
//       ],
//       certificationLevel: language === "vi" ? "Nghiên cứu" : "Research",
//     },
//     "ic-002": {
//       id: "ic-002",
//       title: language === "vi" ? "Chứng chỉ Quốc tế - Gói Chuyên gia" : "International Certificate - Expert Package",
//       recipient: "Trần Thị B",
//       issueDate: "20/10/2024",
//       expiryDate: "20/10/2026",
//       status: "active",
//       description:
//         language === "vi"
//           ? "Chứng chỉ chuyên gia toàn diện về quản lý carbon, kiểm toán carbon và tư vấn ESG, được cấp bởi Columbia Southern University (CSU) và Tín Chỉ Carbon Việt Nam. Đào tạo chuyên gia có khả năng tư vấn và triển khai các dự án carbon chuyên nghiệp."
//           : "Comprehensive expert certificate in carbon management, carbon auditing, and ESG consulting, issued by Columbia Southern University (CSU) and Vietnam Carbon Credits. Trains experts capable of consulting and implementing professional carbon projects.",
//       image: "/images/certificate-sample.png",
//       issuer: {
//         name: "Columbia Southern University (CSU)",
//         logo: "/images/csu-logo.png",
//       },
//       features: [
//         language === "vi" ? "Quản lý carbon chuyên nghiệp" : "Professional Carbon Management",
//         language === "vi" ? "Kiểm toán carbon" : "Carbon Auditing",
//         language === "vi" ? "Tư vấn ESG" : "ESG Consulting",
//         language === "vi" ? "Đào tạo 6 tháng" : "6-month Training",
//         language === "vi" ? "Thực hành với doanh nghiệp thật" : "Practice with Real Businesses",
//         language === "vi" ? "Tư vấn nghề nghiệp" : "Career Consulting",
//       ],
//       certificationLevel: language === "vi" ? "Chuyên gia" : "Expert",
//     },
//   }

//   // Lấy thông tin chứng chỉ dựa trên ID
//   const certificate = certificates[id as string] || certificates["ic-001"]

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-800"
//       case "in_progress":
//         return "bg-yellow-100 text-yellow-800"
//       case "not_started":
//         return "bg-gray-100 text-gray-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case "completed":
//         return language === "vi" ? "Đã hoàn thành" : "Completed"
//       case "in_progress":
//         return language === "vi" ? "Đang học" : "In Progress"
//       case "not_started":
//         return language === "vi" ? "Chưa bắt đầu" : "Not Started"
//       default:
//         return status
//     }
//   }

//   // Hiển thị icon cho tính năng
//   const getFeatureIcon = (feature: string) => {
//     if (feature.includes("Quốc tế") || feature.includes("International")) {
//       return <Globe className="w-4 h-4 text-cyan-500" />
//     } else if (feature.includes("Đào tạo") || feature.includes("Training")) {
//       return <BookOpen className="w-4 h-4 text-blue-500" />
//     } else if (feature.includes("Đánh giá") || feature.includes("Assessment")) {
//       return <CheckCircle2 className="w-4 h-4 text-green-500" />
//     } else if (feature.includes("Tư vấn") || feature.includes("Consult")) {
//       return <Shield className="w-4 h-4 text-purple-500" />
//     } else {
//       return <Award className="w-4 h-4 text-yellow-500" />
//     }
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">{certificate.title}</h1>
//         </div>
//         <Button className="bg-green-600 hover:bg-green-700">
//           <Download className="mr-2 h-4 w-4" />
//           {language === "vi" ? "Tải chứng chỉ" : "Download Certificate"}
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="relative h-80 w-full border rounded-lg overflow-hidden">
//               <Image
//                 src={certificate.image || "/placeholder.svg"}
//                 alt={certificate.title}
//                 fill
//                 className="object-contain"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>{language === "vi" ? "Chi tiết khóa học" : "Course Details"}</CardTitle>
//             <CardDescription>
//               {language === "vi" ? "Chứng nhận quốc tế" : "International Certification"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <Award className="h-5 w-5 text-gray-500 mr-3" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">{language === "vi" ? "Đơn vị cấp" : "Issuer"}</p>
//                   <div className="flex items-center">
//                     <div className="relative h-6 w-6 mr-2">
//                       <Image
//                         src={certificate.issuer.logo || "/placeholder.svg"}
//                         alt={certificate.issuer.name}
//                         fill
//                         className="object-contain"
//                       />
//                     </div>
//                     <p>{certificate.issuer.name}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center">
//                 <Calendar className="h-5 w-5 text-gray-500 mr-3" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">{language === "vi" ? "Ngày cấp" : "Issue Date"}</p>
//                   <p>{certificate.issueDate}</p>
//                 </div>
//               </div>

//               <div className="flex items-center">
//                 <Calendar className="h-5 w-5 text-gray-500 mr-3" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     {language === "vi" ? "Ngày hết hạn" : "Expiry Date"}
//                   </p>
//                   <p>{certificate.expiryDate}</p>
//                 </div>
//               </div>

//               <div className="flex items-center">
//                 <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">{language === "vi" ? "Trạng thái" : "Status"}</p>
//                   <div className="mt-1">
//                     <span
//                       className={`inline-block px-2 py-1 rounded-full text-xs ${
//                         certificate.status === "pending"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : certificate.status === "active"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {certificate.status === "pending"
//                         ? language === "vi"
//                           ? "Đang xử lý"
//                           : "Pending"
//                         : certificate.status === "active"
//                           ? language === "vi"
//                             ? "Đang hoạt động"
//                             : "Active"
//                           : language === "vi"
//                             ? "Hết hạn"
//                             : "Expired"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {certificate.certificationLevel && (
//                 <div className="flex items-center">
//                   <Award className="h-5 w-5 text-gray-500 mr-3" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       {language === "vi" ? "Cấp độ chứng chỉ" : "Certification Level"}
//                     </p>
//                     <p>{certificate.certificationLevel}</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="mt-6">
//               <h3 className="text-sm font-medium text-gray-500 mb-2">{language === "vi" ? "Mô tả" : "Description"}</h3>
//               <p className="text-gray-600">{certificate.description}</p>
//             </div>

//             {certificate.features && certificate.features.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-sm font-medium text-gray-500 mb-2">
//                   {language === "vi" ? "Tính năng chính" : "Key Features"}
//                 </h3>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {certificate.features.map((feature, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700"
//                     >
//                       {getFeatureIcon(feature)}
//                       <span className="ml-1">{feature}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>{language === "vi" ? "Truy cập khóa học" : "Course Access"}</CardTitle>
//           <CardDescription>
//             {language === "vi"
//               ? "Sử dụng thông tin bên dưới để truy cập nội dung khóa học của bạn"
//               : "Use the information below to access your course content"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500 mb-2">
//                 {language === "vi" ? "Email đăng nhập" : "Login Email"}
//               </h3>
//               <div className="flex items-center p-3 bg-gray-50 rounded-md">
//                 <User className="h-5 w-5 text-gray-400 mr-2" />
//                 <p className="font-medium">
//                   {certificate.recipient.includes("@") ? certificate.recipient : "nguyenvana@example.com"}
//                 </p>
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 {language === "vi"
//                   ? "Sử dụng email này để đăng nhập vào hệ thống học trực tuyến"
//                   : "Use this email to log in to the online learning system"}
//               </p>
//             </div>

//             <div>
//               <h3 className="text-sm font-medium text-gray-500 mb-2">
//                 {language === "vi" ? "Truy cập khóa học" : "Access Course"}
//               </h3>
//               <Button
//                 className="w-full bg-green-600 hover:bg-green-700"
//                 onClick={() => window.open("https://auth.columbiasouthern.edu/login", "_blank")}
//               >
//                 <FileText className="mr-2 h-4 w-4" />
//                 {language === "vi" ? "Truy cập nội dung học" : "Access Course Content"}
//               </Button>
//             </div>

//             <div className="border-t pt-4 mt-4">
//               <p className="text-sm text-gray-600">
//                 {language === "vi"
//                   ? "Nếu bạn gặp khó khăn khi truy cập, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi qua email minhtq@carboncreditvietnam.vn hoặc hotline 092.3370.804."
//                   : "If you have trouble accessing the course, please contact our support team at minhtq@carboncreditvietnam.vn or hotline 092.3370.804."}
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
