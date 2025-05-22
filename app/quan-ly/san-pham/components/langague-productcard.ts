// src/app/quan-ly/san-pham/components/product-card-language.ts

const productCardTranslations = {
  statusBadges: {
    active: {
      vi: "Đang hoạt động",
      en: "Active",
    },
    pending: {
      vi: "Đang xử lý",
      en: "Pending",
    },
    expired: {
      vi: "Hết hạn",
      en: "Expired",
    },
    unknown: {
      vi: "Không xác định",
      en: "Unknown",
    },
  },
  dates: {
    purchaseDate: {
      vi: "Ngày mua:",
      en: "Purchased on:",
    },
    expires: {
      vi: "Hết hạn:",
      en: "Expires:",
    },
  },
  currency: {
    vi: "VND",
    en: "USD", // Example: if you want to display USD for English speakers
  },
  productNames: {
    carbon_credits: {
      vi: "Tín chỉ Carbon",
      en: "Carbon Credits",
    },
    carbon_accounting: {
      vi: "Carbon Toàn Thư",
      en: "Carbon Accounting",
    },
    international_certificates: {
      vi: "Chứng chỉ Quốc tế",
      en: "International Certificates",
    },
    default: {
      vi: "Không xác định", // For unknown product types
      en: "Unknown",
    },
  },
  features: {
    keyFeaturesTitle: {
      vi: "Tính năng chính:",
      en: "Key features:",
    },
    // Generic feature descriptions, should match the logic in getFeatureIcon
    aiCarbonSeek: { vi: "AI / CarbonSeek", en: "AI / CarbonSeek" },
    reportEsgAudit: {
      vi: "Báo cáo / ESG / Kiểm toán",
      en: "Reporting / ESG / Auditing",
    },
    analysisTrend: { vi: "Phân tích / Xu hướng", en: "Analysis / Trends" },
    communityConsult: {
      vi: "Cộng đồng / Tư vấn",
      en: "Community / Consulting",
    },
    conservationProtection: {
      vi: "Bảo tồn / Bảo vệ",
      en: "Conservation / Protection",
    },
    internationalGlobal: {
      vi: "Quốc tế / Toàn cầu",
      en: "International / Global",
    },
    certification: { vi: "Chứng nhận", en: "Certification" },
    unknown: { vi: "Tính năng không xác định", en: "Unknown feature" },
  },
  additionalInfo: {
    carbonCredits: {
      projectLocation: { vi: "Vị trí dự án:", en: "Project location:" },
      totalCredits: { vi: "Tổng tín chỉ:", en: "Total credits:" },
      usedCredits: { vi: "Đã sử dụng:", en: "Used:" },
      unit: { vi: "tCO2e", en: "tCO2e" },
    },
    carbonAccounting: {
      description: {
        vi: "Nền tảng tri thức toàn diện về Carbon",
        en: "Comprehensive Carbon knowledge platform",
      },
    },
    internationalCertificates: {
      issuer: { vi: "Đơn vị cấp:", en: "Issuer:" },
      certificationLevel: { vi: "Cấp độ:", en: "Level:" },
      courseProgress: { vi: "Tiến độ khóa học", en: "Course progress" },
      lastAccessed: { vi: "Truy cập gần nhất:", en: "Last accessed:" },
    },
  },
  buttons: {
    manage: { vi: "Quản lý", en: "Manage" },
    details: { vi: "Chi tiết", en: "Details" },
    viewDetailsSrOnly: { vi: "Xem chi tiết", en: "View details" },
    settingsSrOnly: { vi: "Cài đặt", en: "Settings" },
    deleteSrOnly: { vi: "Xóa", en: "Delete" },
  },
  misc: {
    noTitle: { vi: "Không có tiêu đề", en: "No title" },
    noDescription: { vi: "Không có mô tả", en: "No description" },
    unnamedProduct: { vi: "Sản phẩm không tên", en: "Unnamed product" },
  },
};

export default productCardTranslations;
