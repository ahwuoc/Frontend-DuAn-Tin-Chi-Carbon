// src/components/project-registration-language.ts
const projectRegistrationTranslations = {
  formTitle: {
    vi: "Đăng ký dự án tín chỉ carbon",
    en: "Carbon Credit Project Registration",
  },
  successScreen: {
    title: {
      vi: "Đăng ký dự án thành công!",
      en: "Project registration successful!",
    },
    message: {
      vi: "Cảm ơn bạn đã đăng ký dự án tín chỉ carbon với chúng tôi.",
      en: "Thank you for registering your carbon credit project with us.",
    },
    projectInfoTitle: {
      vi: "Thông tin dự án của bạn",
      en: "Your Project Information",
    },
    projectType: {
      label: {
        vi: "Loại dự án:",
        en: "Project Type:",
      },
      forest: {
        vi: "Lâm nghiệp",
        en: "Forestry",
      },
      rice: {
        vi: "Lúa",
        en: "Rice",
      },
      biochar: {
        vi: "Biochar",
        en: "Biochar",
      },
    },
    nextStepsTitle: {
      vi: "Các bước tiếp theo",
      en: "Next Steps",
    },
    nextStepsList: [
      {
        vi: "Chuyên gia của chúng tôi sẽ xem xét thông tin dự án của bạn",
        en: "Our experts will review your project information",
      },
      {
        vi: "Chúng tôi sẽ liên hệ với bạn trong vòng 3-5 ngày làm việc",
        en: "We will contact you within 3-5 business days",
      },
      {
        vi: "Bạn sẽ được hướng dẫn các bước tiếp theo để triển khai dự án",
        en: "You will be guided on the next steps to implement the project",
      },
    ],
    loginPrompt: {
      title: {
        vi: "Theo dõi dự án của bạn",
        en: "Track Your Project",
      },
      message: {
        vi: (email: string) =>
          `Chúng tôi đã sử dụng email ${email} của bạn. Đăng nhập để theo dõi trạng thái dự án và cập nhật thông tin.`,
        en: (email: string) =>
          `We have used your email ${email}. Log in to track project status and update information.`,
      },
      loginButton: {
        vi: "Đăng nhập ngay",
        en: "Log in now",
      },
    },
    registerAnotherProjectButton: {
      vi: "Đăng ký dự án khác",
      en: "Register another project",
    },
    manageAccountButton: {
      vi: "Quản lý tài khoản",
      en: "Manage account",
    },
    backToHomeButton: {
      vi: "Về trang chủ",
      en: "Back to homepage",
    },
  },
  formValidation: {
    requiredField: {
      vi: (label: string) => `${label} là bắt buộc`,
      en: (label: string) => `${label} is required`,
    },
    invalidEmail: {
      vi: "Định dạng email không hợp lệ",
      en: "Invalid email format",
    },
    noLandDocuments: {
      vi: "Vui lòng tải lên giấy tờ sử dụng đất",
      en: "Please upload land use documents",
    },
    // Dịch các label trường trong hàm getFieldLabel
    fieldLabels: {
      name: { vi: "Họ và tên", en: "Full name" },
      organization: { vi: "Tổ chức/Doanh nghiệp", en: "Organization/Business" },
      phone: { vi: "Số điện thoại", en: "Phone number" },
      email: { vi: "Email", en: "Email" },
      address: { vi: "Địa chỉ", en: "Address" },
      forestLocation: { vi: "Vị trí dự án", en: "Project location" },
      forestArea: { vi: "Diện tích đất trồng cây", en: "Tree planting area" },
      treeSpecies: { vi: "Các loài cây", en: "Tree species" },
      plantingAge: { vi: "Thời gian đã trồng", en: "Planting age" },
      averageHeight: { vi: "Chiều cao trung bình", en: "Average height" },
      averageCircumference: {
        vi: "Chu vi ngang ngực thân cây",
        en: "Average tree girth",
      },
      previousDeforestation: {
        vi: "Lịch sử chặt phá",
        en: "Previous deforestation",
      },
      riceLocation: { vi: "Vị trí dự án", en: "Project location" },
      riceArea: { vi: "Diện tích đất trồng lúa", en: "Rice cultivation area" },
      riceTerrain: { vi: "Địa hình", en: "Terrain" },
      riceClimate: { vi: "Khí hậu", en: "Climate" },
      riceSoilType: { vi: "Loại đất", en: "Soil type" },
      riceStartDate: {
        vi: "Thời gian bắt đầu trồng",
        en: "Planting start date",
      },
      riceEndDate: { vi: "Thời gian kết thúc trồng", en: "Planting end date" },
      biocharRawMaterial: { vi: "Nguyên liệu đầu vào", en: "Input material" },
      biocharCarbonContent: {
        vi: "Hàm lượng carbon cố định",
        en: "Fixed carbon content",
      },
      biocharLandArea: {
        vi: "Diện tích đất được cải tạo",
        en: "Rehabilitated land area",
      },
      biocharApplicationMethod: {
        vi: "Phương pháp ứng dụng",
        en: "Application method",
      },
      additionalInfo: { vi: "Thông tin bổ sung", en: "Additional information" },
      landDocuments: { vi: "Giấy tờ sử dụng đất", en: "Land use documents" },
      kmlFile: { vi: "File KML", en: "KML File" },
    },
  },
  loadingMessages: {
    submissionError: {
      vi: "Đã xảy ra lỗi: ",
      en: "An error occurred: ",
    },
    unknownError: {
      vi: "Không rõ lỗi",
      en: "Unknown error",
    },
  },
};

export default projectRegistrationTranslations;
