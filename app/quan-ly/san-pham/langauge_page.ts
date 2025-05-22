// src/app/quan-ly/san-pham/products-management-language.ts

const productsManagementTranslations = {
  pageHeader: {
    title: {
      vi: "Quản lý sản phẩm",
      en: "Product Management",
    },
    description: {
      vi: "Quản lý tất cả sản phẩm và dịch vụ bạn đã đăng ký",
      en: "Manage all products and services you have registered for",
    },
    buyMoreButton: {
      vi: "Mua thêm sản phẩm",
      en: "Buy More Products",
    },
  },
  pendingProducts: {
    title: {
      vi: "Sản phẩm chưa thanh toán",
      en: "Unpaid Products",
    },
    orderCode: {
      vi: "Mã đơn hàng:",
      en: "Order Code:",
    },
    noDescription: {
      vi: "Không có mô tả",
      en: "No description",
    },
    amount: {
      vi: "Số tiền:",
      en: "Amount:",
    },
    expires: {
      vi: "Hết hạn:",
      en: "Expires:",
    },
    payNowButton: {
      vi: "Thanh toán ngay",
      en: "Pay Now",
    },
    productNotFound: {
      vi: "Sản phẩm không tồn tại",
      en: "Product not found",
    },
  },
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
  productTypes: {
    carbon_credits: {
      vi: "Tín chỉ Carbon",
      en: "Carbon Credits",
    },
    carbon_accounting: {
      vi: "Carbon Toàn Thư",
      en: "Carbon Accounting Book",
    },
    international_certificates: {
      vi: "Chứng chỉ Quốc tế",
      en: "International Certificates",
    },
    default: {
      vi: "Không xác định",
      en: "Undefined",
    },
  },
  additionalInfo: {
    carbonCredits: {
      projectLocation: {
        vi: "Vị trí dự án:",
        en: "Project location:",
      },
      totalCredits: {
        vi: "Tổng tín chỉ:",
        en: "Total credits:",
      },
      usedCredits: {
        vi: "Đã sử dụng:",
        en: "Used:",
      },
      unit: {
        vi: "tCO2e",
        en: "tCO2e",
      },
    },
    carbonAccounting: {
      description: {
        vi: "Nền tảng tri thức toàn diện về Carbon",
        en: "Comprehensive Carbon Knowledge Platform",
      },
    },
    internationalCertificates: {
      issuer: {
        vi: "Đơn vị cấp:",
        en: "Issuer:",
      },
      certificationLevel: {
        vi: "Cấp độ:",
        en: "Level:",
      },
      courseProgress: {
        vi: "Tiến độ khóa học",
        en: "Course Progress",
      },
      lastAccessed: {
        vi: "Truy cập gần nhất:",
        en: "Last accessed:",
      },
    },
  },
  emptyState: {
    title: {
      vi: "Không tìm thấy sản phẩm nào",
      en: "No products found",
    },
    description: {
      vi: "Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử điều chỉnh bộ lọc hoặc tìm kiếm.",
      en: "No products match your search criteria. Please try adjusting your filters or search terms.",
    },
    resetButton: {
      vi: "Đặt lại bộ lọc",
      en: "Reset Filters",
    },
  },
  misc: {
    notAvailable: {
      vi: "Không có tiêu đề", // For product.name ?? "Không có tiêu đề"
      en: "No title",
    },
    noDescription: {
      vi: "Không có mô tả", // For product.description ?? "Không có mô tả"
      en: "No description",
    },
    notSpecified: {
      vi: "Không xác định", // For N/A cases or generic undefined
      en: "Not specified",
    },
    currency: {
      vi: "VND",
      en: "VND", // Or "USD" if you want to localize currency symbol
    },
  },
};

export default productsManagementTranslations;
