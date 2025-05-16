// const carbonProducts = {
//   // Gói Doanh Nghiệp
//   "ca-002": {
//     id: "ca-002",
//     title:
//       language === "vi"
//         ? "Carbon Toàn Thư 4.0 - Gói Doanh Nghiệp"
//         : "Carbon Encyclopedia 4.0 - Enterprise Package",
//     company: language === "vi" ? "Công ty TNHH ABC" : "ABC Company Ltd.",
//     startDate: "03/06/2023",
//     endDate: "03/06/2024",
//     status: "active",
//     description:
//       language === "vi"
//         ? "Giải pháp toàn diện giúp doanh nghiệp tiếp cận tri thức về tín chỉ carbon, ESG & CSR thông qua nền tảng AI CarbonSeek nâng cao. Bao gồm quản lý người dùng theo phòng ban, đào tạo nội bộ tùy chỉnh và tư vấn chiến lược carbon & CBAM."
//         : "A comprehensive solution helping enterprises access knowledge about carbon credits, ESG & CSR through the advanced CarbonSeek AI platform. Includes department-based user management, custom in-house training, and carbon & CBAM strategy consulting.",
//     image:
//       "https://res.cloudinary.com/dyticflm3/image/upload/v1744629737/Robot_working_rsz_q5yv9k.jpg",
//     dashboardImage: "/images/carbon-analytics.jpg",
//     aiPlatformUrl: "https://carbonseek.tinchicarbonvietnam.vn/login",
//     documentsDriveUrl:
//       "https://drive.google.com/drive/folders/1edG48t5iUgRzi9mQKr8dFHtFLPHZR-gh",
//     price: 30000000,
//     billingCycle: language === "vi" ? "Hàng năm" : "Annual",
//     nextBillingDate: "03/06/2024",
//     paymentMethod: language === "vi" ? "Thẻ tín dụng" : "Credit Card",
//     cardInfo: "**** **** **** 4589",
//     usageStats: {
//       totalUsage: 250,
//       lastMonthUsage: 60,
//       trend: "up",
//       usageLimit: 500,
//       usagePercentage: 50,
//     },
//     supportContact: {
//       email: "support@tinchicarbon.vn",
//       phone: "+84 28 1234 5678",
//       supportHours:
//         language === "vi"
//           ? "8:00 - 17:30, Thứ 2 - Thứ 6"
//           : "8:00 AM - 5:30 PM, Monday - Friday",
//     },
//     accountManager: {
//       name: language === "vi" ? "Nguyễn Thị Hương" : "Nguyen Thi Huong",
//       email: "huong.nguyen@tinchicarbon.vn",
//       phone: "+84 90 1234 567",
//     },
//     resources: [
//       {
//         id: "res-001",
//         title:
//           language === "vi"
//             ? "Hướng dẫn sử dụng AI CarbonSeek"
//             : "AI CarbonSeek User Guide",
//         type: "pdf",
//         icon: "FileText",
//         size: "2.8 MB",
//         date: "15/06/2023",
//       },
//       {
//         id: "res-002",
//         title:
//           language === "vi"
//             ? "Video hướng dẫn phân tích dữ liệu"
//             : "Data Analysis Tutorial Video",
//         type: "video",
//         icon: "Video",
//         size: "45 MB",
//         date: "20/06/2023",
//       },
//       {
//         id: "res-003",
//         title:
//           language === "vi"
//             ? "Mẫu báo cáo phát thải"
//             : "Emission Report Template",
//         type: "excel",
//         icon: "FileText",
//         size: "1.2 MB",
//         date: "25/06/2023",
//       },
//       {
//         id: "res-004",
//         title:
//           language === "vi"
//             ? "Câu hỏi thường gặp"
//             : "Frequently Asked Questions",
//         type: "pdf",
//         icon: "FileQuestion",
//         size: "1.5 MB",
//         date: "30/06/2023",
//       },
//       {
//         id: "res-005",
//         title:
//           language === "vi"
//             ? "Hướng dẫn tích hợp API"
//             : "API Integration Guide",
//         type: "pdf",
//         icon: "FileText",
//         size: "3.2 MB",
//         date: "10/07/2023",
//       },
//       {
//         id: "res-006",
//         title:
//           language === "vi"
//             ? "Bảng dữ liệu hệ số phát thải"
//             : "Emission Factors Datasheet",
//         type: "excel",
//         icon: "FileText",
//         size: "2.1 MB",
//         date: "15/07/2023",
//       },
//     ],
//     features: [
//       {
//         id: "feat-001",
//         title:
//           language === "vi"
//             ? "Tất cả tính năng gói Chuyên gia"
//             : "All Expert package features",
//         description:
//           language === "vi"
//             ? "Bao gồm toàn bộ tính năng và dịch vụ có trong gói Chuyên gia."
//             : "Includes all features and services available in the Expert package.",
//         icon: "CheckCircle2",
//       },
//       {
//         id: "feat-002",
//         title:
//           language === "vi"
//             ? "Quản lý người dùng theo phòng ban"
//             : "Department-based user management",
//         description:
//           language === "vi"
//             ? "Phân quyền và quản lý người dùng theo cơ cấu phòng ban của doanh nghiệp."
//             : "Permission and user management according to the company's department structure.",
//         icon: "Users",
//       },
//       {
//         id: "feat-003",
//         title:
//           language === "vi"
//             ? "Đào tạo nội bộ tùy chỉnh"
//             : "Custom in-house training",
//         description:
//           language === "vi"
//             ? "Chương trình đào tạo được thiết kế riêng cho nhu cầu và ngành nghề của doanh nghiệp."
//             : "Training programs specifically designed for the company's needs and industry.",
//         icon: "BookOpen",
//       },
//       {
//         id: "feat-004",
//         title:
//           language === "vi"
//             ? "Tư vấn chiến lược carbon & CBAM"
//             : "Carbon & CBAM strategy consulting",
//         description:
//           language === "vi"
//             ? "Tư vấn xây dựng chiến lược ứng phó với quy định về carbon và cơ chế điều chỉnh biên giới carbon."
//             : "Consulting on building strategies to respond to carbon regulations and carbon border adjustment mechanism.",
//         icon: "BarChart2",
//       },
//       {
//         id: "feat-005",
//         title:
//           language === "vi"
//             ? "Tích hợp API CarbonSeek"
//             : "CarbonSeek API integration",
//         description:
//           language === "vi"
//             ? "Tích hợp API CarbonSeek với hệ thống quản lý doanh nghiệp hiện có."
//             : "Integration of CarbonSeek API with existing enterprise management systems.",
//         icon: "Zap",
//       },
//       {
//         id: "feat-006",
//         title:
//           language === "vi"
//             ? "Báo cáo chuyên ngành riêng"
//             : "Industry-specific reports",
//         description:
//           language === "vi"
//             ? "Báo cáo chuyên sâu được thiết kế riêng cho ngành nghề của doanh nghiệp."
//             : "In-depth reports specifically designed for the company's industry.",
//         icon: "FileText",
//       },
//     ],
//     recentActivities: [
//       {
//         id: "act-001",
//         date: "01/03/2024",
//         action: language === "vi" ? "Đăng nhập vào nền tảng" : "Platform login",
//         user: "admin@company.com",
//       },
//       {
//         id: "act-002",
//         date: "28/02/2024",
//         action:
//           language === "vi"
//             ? "Tạo báo cáo phát thải Q1"
//             : "Generated Q1 emission report",
//         user: "manager@company.com",
//       },
//       {
//         id: "act-003",
//         date: "25/02/2024",
//         action:
//           language === "vi"
//             ? "Cập nhật dữ liệu phát thải"
//             : "Updated emission data",
//         user: "data-analyst@company.com",
//       },
//       {
//         id: "act-004",
//         date: "20/02/2024",
//         action: language === "vi" ? "Thêm người dùng mới" : "Added new user",
//         user: "admin@company.com",
//       },
//       {
//         id: "act-005",
//         date: "15/02/2024",
//         action: language === "vi" ? "Tải xuống báo cáo" : "Downloaded report",
//         user: "ceo@company.com",
//       },
//     ],
//     updates: [
//       {
//         id: "upd-001",
//         date: "15/02/2024",
//         title:
//           language === "vi" ? "Cập nhật phiên bản 4.2" : "Version 4.2 Update",
//         description:
//           language === "vi"
//             ? "Cải thiện thuật toán AI và thêm tính năng phân tích chuỗi cung ứng."
//             : "Improved AI algorithms and added supply chain analysis features.",
//       },
//       {
//         id: "upd-002",
//         date: "10/01/2024",
//         title:
//           language === "vi"
//             ? "Cập nhật hệ số phát thải"
//             : "Emission Factors Update",
//         description:
//           language === "vi"
//             ? "Cập nhật hệ số phát thải theo tiêu chuẩn mới nhất của IPCC."
//             : "Updated emission factors according to the latest IPCC standards.",
//       },
//     ],
//   },

//   // Gói Chuyên Gia
//   "ca-001": {
//     id: "ca-001",
//     title:
//       language === "vi"
//         ? "Carbon Toàn Thư 4.0 - Gói Chuyên Gia"
//         : "Carbon Encyclopedia 4.0 - Expert Package",
//     company: language === "vi" ? "Công ty TNHH XYZ" : "XYZ Company Ltd.",
//     startDate: "15/03/2023",
//     endDate: "15/03/2024",
//     status: "active",
//     description:
//       language === "vi"
//         ? "Kho tri thức toàn diện với hơn 600 tài liệu, nghiên cứu, báo cáo chuyên sâu về Carbon Credits, ESG & CSR, kết hợp với trợ lý AI CarbonSeek hiện đại nhất hiện nay. Bao gồm công cụ phân tích, báo cáo tự động và tư vấn chuyên sâu."
//         : "Comprehensive knowledge repository with over 600 in-depth researches, documents on Carbon Credits, ESG & CSR, combined with the most advanced CarbonSeek AI assistant. Includes analytics tools, automated reporting, and in-depth consulting.",
//     image:
//       "https://res.cloudinary.com/dyticflm3/image/upload/v1744629737/Robot_working_rsz_q5yv9k.jpg",
//     dashboardImage: "/images/carbon-analytics.jpg",
//     aiPlatformUrl: "https://carbonseek.tinchicarbonvietnam.vn/login",
//     documentsDriveUrl:
//       "https://drive.google.com/drive/folders/1edG48t5iUgRzi9mQKr8dFHtFLPHZR-gh",
//     price: 560000,
//     billingCycle: language === "vi" ? "Hàng năm" : "Annual",
//     nextBillingDate: "15/03/2024",
//     paymentMethod: language === "vi" ? "Thẻ tín dụng" : "Credit Card",
//     cardInfo: "**** **** **** 7821",
//     usageStats: {
//       totalUsage: 120,
//       lastMonthUsage: 35,
//       trend: "up",
//       usageLimit: 300,
//       usagePercentage: 40,
//     },
//     supportContact: {
//       email: "support@tinchicarbon.vn",
//       phone: "+84 28 1234 5678",
//       supportHours:
//         language === "vi"
//           ? "8:00 - 17:30, Thứ 2 - Thứ 6"
//           : "8:00 AM - 5:30 PM, Monday - Friday",
//     },
//     accountManager: {
//       name: language === "vi" ? "Trần Văn Minh" : "Tran Van Minh",
//       email: "minh.tran@tinchicarbon.vn",
//       phone: "+84 90 8765 432",
//     },
//     resources: [
//       {
//         id: "res-001",
//         title:
//           language === "vi"
//             ? "Hướng dẫn sử dụng AI CarbonSeek"
//             : "AI CarbonSeek User Guide",
//         type: "pdf",
//         icon: "FileText",
//         size: "2.8 MB",
//         date: "15/06/2023",
//       },
//       {
//         id: "res-002",
//         title:
//           language === "vi"
//             ? "Video hướng dẫn phân tích dữ liệu"
//             : "Data Analysis Tutorial Video",
//         type: "video",
//         icon: "Video",
//         size: "45 MB",
//         date: "20/06/2023",
//       },
//       {
//         id: "res-003",
//         title:
//           language === "vi"
//             ? "Mẫu báo cáo phát thải"
//             : "Emission Report Template",
//         type: "excel",
//         icon: "FileText",
//         size: "1.2 MB",
//         date: "25/06/2023",
//       },
//       {
//         id: "res-004",
//         title:
//           language === "vi"
//             ? "Câu hỏi thường gặp"
//             : "Frequently Asked Questions",
//         type: "pdf",
//         icon: "FileQuestion",
//         size: "1.5 MB",
//         date: "30/06/2023",
//       },
//     ],
//     features: [
//       {
//         id: "feat-001",
//         title:
//           language === "vi"
//             ? "Trợ lý AI CarbonSeek"
//             : "AI CarbonSeek Assistant",
//         description:
//           language === "vi"
//             ? "Trợ lý AI thông minh giúp tìm kiếm và phân tích thông tin về carbon một cách nhanh chóng."
//             : "Smart AI assistant helps search and analyze carbon information quickly.",
//         icon: "Bot",
//       },
//       {
//         id: "feat-002",
//         title:
//           language === "vi"
//             ? "Hơn 600 tài liệu chuyên sâu"
//             : "Over 600 in-depth documents",
//         description:
//           language === "vi"
//             ? "Thư viện tài liệu đầy đủ về carbon credits, ESG và CSR được cập nhật thường xuyên."
//             : "Comprehensive document library on carbon credits, ESG and CSR, regularly updated.",
//         icon: "BookOpen",
//       },
//       {
//         id: "feat-003",
//         title:
//           language === "vi"
//             ? "Tư vấn 1-1 với chuyên gia"
//             : "One-on-one consultation with experts",
//         description:
//           language === "vi"
//             ? "Được tư vấn trực tiếp với các chuyên gia hàng đầu trong lĩnh vực carbon."
//             : "Direct consultation with leading experts in the carbon field.",
//         icon: "Users",
//       },
//       {
//         id: "feat-004",
//         title:
//           language === "vi"
//             ? "Báo cáo thị trường hàng quý"
//             : "Quarterly market reports",
//         description:
//           language === "vi"
//             ? "Báo cáo phân tích thị trường carbon được cập nhật hàng quý."
//             : "Carbon market analysis reports updated quarterly.",
//         icon: "FileText",
//       },
//       {
//         id: "feat-005",
//         title:
//           language === "vi"
//             ? "Hội thảo trực tuyến hàng quý"
//             : "Quarterly webinars",
//         description:
//           language === "vi"
//             ? "Tham gia các hội thảo trực tuyến với các chuyên gia trong ngành."
//             : "Participate in webinars with industry experts.",
//         icon: "Presentation",
//       },
//     ],
//     recentActivities: [
//       {
//         id: "act-001",
//         date: "05/03/2024",
//         action: language === "vi" ? "Đăng nhập vào nền tảng" : "Platform login",
//         user: "expert@company.com",
//       },
//       {
//         id: "act-002",
//         date: "01/03/2024",
//         action:
//           language === "vi"
//             ? "Tải xuống báo cáo thị trường Q1"
//             : "Downloaded Q1 market report",
//         user: "expert@company.com",
//       },
//       {
//         id: "act-003",
//         date: "25/02/2024",
//         action:
//           language === "vi"
//             ? "Tham gia hội thảo trực tuyến"
//             : "Participated in webinar",
//         user: "expert@company.com",
//       },
//     ],
//     updates: [
//       {
//         id: "upd-001",
//         date: "01/03/2024",
//         title:
//           language === "vi"
//             ? "Báo cáo thị trường Q1 2024"
//             : "Q1 2024 Market Report",
//         description:
//           language === "vi"
//             ? "Báo cáo thị trường carbon quý 1 năm 2024 đã được phát hành."
//             : "Carbon market report for Q1 2024 has been released.",
//       },
//       {
//         id: "upd-002",
//         date: "15/02/2024",
//         title:
//           language === "vi"
//             ? "Cập nhật thư viện tài liệu"
//             : "Document Library Update",
//         description:
//           language === "vi"
//             ? "Thêm 50 tài liệu mới về CBAM và các quy định carbon mới của EU."
//             : "Added 50 new documents on CBAM and new EU carbon regulations.",
//       },
//     ],
//   },

//   // Gói Dùng Thử
//   "ca-003": {
//     id: "ca-003",
//     title:
//       language === "vi"
//         ? "Carbon Toàn Thư 4.0 - Gói Dùng Thử"
//         : "Carbon Encyclopedia 4.0 - Trial Package",
//     company: language === "vi" ? "Công ty TNHH DEF" : "DEF Company Ltd.",
//     startDate: "01/04/2023",
//     endDate: "15/04/2023",
//     status: "active",
//     description:
//       language === "vi"
//         ? "Trải nghiệm miễn phí các tính năng cơ bản của Carbon Toàn Thư 4.0 trong 14 ngày. Bao gồm truy cập hạn chế vào kho tài liệu, sử dụng AI CarbonSeek với giới hạn truy vấn, và xem các báo cáo mẫu."
//         : "Free 14-day trial of Carbon Encyclopedia 4.0 basic features. Includes limited access to the document repository, AI CarbonSeek with query limits, and sample reports.",
//     image:
//       "https://res.cloudinary.com/dyticflm3/image/upload/v1744629737/Robot_working_rsz_q5yv9k.jpg",
//     dashboardImage: "/images/carbon-analytics.jpg",
//     aiPlatformUrl: "https://carbonseek.tinchicarbonvietnam.vn/login",
//     documentsDriveUrl:
//       "https://drive.google.com/drive/folders/1edG48t5iUgRzi9mQKr8dFHtFLPHZR-gh",
//     price: 0, // Free trial
//     billingCycle: language === "vi" ? "Dùng th�� 14 ngày" : "14-day trial",
//     nextBillingDate: "15/04/2023",
//     paymentMethod: language === "vi" ? "Miễn phí" : "Free",
//     cardInfo: "N/A",
//     usageStats: {
//       totalUsage: 15,
//       lastMonthUsage: 15,
//       trend: "up",
//       usageLimit: 50,
//       usagePercentage: 30,
//     },
//     supportContact: {
//       email: "support@tinchicarbon.vn",
//       phone: "+84 28 1234 5678",
//       supportHours:
//         language === "vi"
//           ? "8:00 - 17:30, Thứ 2 - Thứ 6"
//           : "8:00 AM - 5:30 PM, Monday - Friday",
//     },
//     accountManager: {
//       name: language === "vi" ? "Lê Thị Hà" : "Le Thi Ha",
//       email: "ha.le@tinchicarbon.vn",
//       phone: "+84 90 3456 789",
//     },
//     resources: [
//       {
//         id: "res-001",
//         title:
//           language === "vi" ? "Hướng dẫn sử dụng cơ bản" : "Basic User Guide",
//         type: "pdf",
//         icon: "FileText",
//         size: "1.5 MB",
//         date: "01/04/2023",
//       },
//       {
//         id: "res-002",
//         title:
//           language === "vi"
//             ? "Video giới thiệu AI CarbonSeek"
//             : "AI CarbonSeek Introduction Video",
//         type: "video",
//         icon: "Video",
//         size: "25 MB",
//         date: "01/04/2023",
//       },
//       {
//         id: "res-003",
//         title: language === "vi" ? "Báo cáo mẫu" : "Sample Report",
//         type: "pdf",
//         icon: "FileText",
//         size: "3.2 MB",
//         date: "01/04/2023",
//       },
//     ],
//     features: [
//       {
//         id: "feat-001",
//         title:
//           language === "vi"
//             ? "Trợ lý AI CarbonSeek (giới hạn)"
//             : "AI CarbonSeek Assistant (limited)",
//         description:
//           language === "vi"
//             ? "Truy cập giới hạn đến trợ lý AI CarbonSeek với số lượng truy vấn hạn chế."
//             : "Limited access to the AI CarbonSeek assistant with a limited number of queries.",
//         icon: "Bot",
//       },
//       {
//         id: "feat-002",
//         title:
//           language === "vi"
//             ? "Truy cập 50 tài liệu cơ bản"
//             : "Access to 50 basic documents",
//         description:
//           language === "vi"
//             ? "Truy cập hạn chế đến thư viện tài liệu với 50 tài liệu cơ bản."
//             : "Limited access to the document library with 50 basic documents.",
//         icon: "BookOpenCheck",
//       },
//       {
//         id: "feat-003",
//         title: language === "vi" ? "Báo cáo mẫu" : "Sample reports",
//         description:
//           language === "vi"
//             ? "Xem các báo cáo mẫu để hiểu rõ hơn về khả năng của hệ thống."
//             : "View sample reports to better understand the system's capabilities.",
//         icon: "FileText",
//       },
//       {
//         id: "feat-004",
//         title: language === "vi" ? "Hỗ trợ qua email" : "Email support",
//         description:
//           language === "vi"
//             ? "Nhận hỗ trợ qua email trong thời gian dùng thử."
//             : "Receive email support during the trial period.",
//         icon: "Mail",
//       },
//     ],
//     recentActivities: [
//       {
//         id: "act-001",
//         date: "05/04/2023",
//         action: language === "vi" ? "Đăng nhập vào nền tảng" : "Platform login",
//         user: "trial@company.com",
//       },
//       {
//         id: "act-002",
//         date: "03/04/2023",
//         action: language === "vi" ? "Xem báo cáo mẫu" : "Viewed sample report",
//         user: "trial@company.com",
//       },
//       {
//         id: "act-003",
//         date: "02/04/2023",
//         action:
//           language === "vi" ? "Sử dụng AI CarbonSeek" : "Used AI CarbonSeek",
//         user: "trial@company.com",
//       },
//     ],
//     updates: [
//       {
//         id: "upd-001",
//         date: "10/04/2023",
//         title: language === "vi" ? "Sắp hết hạn dùng thử" : "Trial Ending Soon",
//         description:
//           language === "vi"
//             ? "Gói dùng thử của bạn sẽ hết hạn trong 5 ngày. Nâng cấp ngay để tiếp tục sử dụng dịch vụ."
//             : "Your trial will expire in 5 days. Upgrade now to continue using the service.",
//       },
//     ],
//   },
// };
