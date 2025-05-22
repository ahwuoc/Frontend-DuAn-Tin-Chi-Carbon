// src/components/registration-form-language.ts
const registrationFormTranslations = {
  formTitle: {
    vi: "Đăng ký tư vấn",
    en: "Register for Consultation",
  },
  orRegisterProject: {
    vi: "HOẶC ĐĂNG KÝ DỰ ÁN NGAY",
    en: "OR REGISTER A PROJECT NOW",
  },
  consultationTypeLabel: {
    vi: "Loại tư vấn",
    en: "Consultation Type",
  },
  consultationTypeOptions: {
    forest: {
      vi: "Tín chỉ carbon từ rừng",
      en: "Forest Carbon Credits",
    },
    agriculture: {
      vi: "Tín chỉ nông nghiệp",
      en: "Agricultural Carbon Credits",
    },
    biochar: {
      vi: "Công nghệ Biochar",
      en: "Biochar Technology",
    },
    csu: {
      vi: "Khóa học chứng chỉ quốc tế CSU",
      en: "CSU International Certificate Course",
    },
    carbonbook: {
      vi: "Carbon Toàn Thư 4.0",
      en: "Carbon Encyclopedia 4.0",
    },
    other: {
      vi: "Khác",
      en: "Other",
    },
  },
  nameLabel: {
    vi: "Họ và tên",
    en: "Full name",
  },
  namePlaceholder: {
    vi: "Họ và tên",
    en: "Full name",
  },
  ageLabel: {
    vi: "Tuổi",
    en: "Age",
  },
  agePlaceholder: {
    vi: "Tuổi",
    en: "Age",
  },
  locationLabel: {
    vi: "Địa điểm",
    en: "Location",
  },
  locationPlaceholder: {
    vi: "Địa chỉ",
    en: "Address",
  },
  areaLabelForest: {
    vi: "Diện tích rừng",
    en: "Forest area",
  },
  areaPlaceholderForest: {
    vi: "Diện tích rừng (ha)",
    en: "Forest area (ha)",
  },
  areaLabelAgriculture: {
    vi: "Diện tích canh tác (ha)",
    en: "Cultivation area (ha)",
  },
  areaPlaceholderAgriculture: {
    vi: "Diện tích canh tác (ha)",
    en: "Cultivation area (ha)",
  },
  phoneLabel: {
    vi: "Số điện thoại",
    en: "Phone number",
  },
  phonePlaceholder: {
    vi: "Số điện thoại",
    en: "Phone number",
  },
  emailLabel: {
    vi: "Email",
    en: "Email",
  },
  emailPlaceholder: {
    vi: "Email",
    en: "Email",
  },
  messageLabel: {
    vi: "Câu hỏi khác",
    en: "Other questions",
  },
  messagePlaceholder: {
    vi: "Câu hỏi hoặc yêu cầu bổ sung",
    en: "Additional questions or requests",
  },
  organizationLabel: {
    vi: "Tổ chức/Doanh nghiệp",
    en: "Organization/Business",
  },
  organizationPlaceholder: {
    vi: "Tổ chức/Doanh nghiệp",
    en: "Organization/Business",
  },
  positionLabel: {
    vi: "Chức vụ",
    en: "Position",
  },
  positionPlaceholder: {
    vi: "Chức vụ",
    en: "Position",
  },
  experienceLabel: {
    vi: "Kinh nghiệm trong lĩnh vực môi trường",
    en: "Environmental experience",
  },
  experienceOptions: {
    none: { vi: "Chưa có kinh nghiệm", en: "No experience" },
    lessThan1: { vi: "Dưới 1 năm", en: "Less than 1 year" },
    "1To3": { vi: "1-3 năm", en: "1-3 years" },
    "3To5": { vi: "3-5 năm", en: "3-5 years" },
    moreThan5: { vi: "Trên 5 năm", en: "More than 5 years" },
  },
  educationLabel: {
    vi: "Trình độ học vấn",
    en: "Education level",
  },
  educationOptions: {
    highSchool: { vi: "Trung học phổ thông", en: "High school" },
    college: { vi: "Cao đẳng", en: "College" },
    bachelor: { vi: "Đại học", en: "Bachelor's" },
    master: { vi: "Thạc sĩ", en: "Master's" },
    phd: { vi: "Tiến sĩ", en: "PhD" },
  },
  projectTypeLabel: {
    vi: "Loại cây trồng/vật nuôi",
    en: "Crop/Livestock type",
  },
  projectTypePlaceholder: {
    vi: "Loại cây trồng/vật nuôi",
    en: "Crop/Livestock type",
  },
  projectSizeLabel: {
    vi: "Quy mô dự án",
    en: "Project size",
  },
  projectSizePlaceholder: {
    vi: "Quy mô dự án (tấn biochar/năm)",
    en: "Project size (tons biochar/year)",
  },
  projectLocationLabel: {
    vi: "Địa điểm dự kiến",
    en: "Proposed location",
  },
  projectLocationPlaceholder: {
    vi: "Địa điểm dự kiến",
    en: "Proposed location",
  },
  carbonGoalsLabel: {
    vi: "Mục tiêu sử dụng Carbon Toàn Thư 4.0",
    en: "Goals for using Carbon Encyclopedia 4.0",
  },
  carbonGoalsPlaceholder: {
    vi: "Mục tiêu sử dụng Carbon Toàn Thư 4.0",
    en: "Goals for using Carbon Encyclopedia 4.0",
  },
  requiredField: {
    vi: (label: string) => `${label} là bắt buộc`,
    en: (label: string) => `${label} is required`,
  },
  invalidEmail: {
    vi: "Định dạng email không hợp lệ",
    en: "Invalid email format",
  },
  privacyCommitment: {
    vi: "Cam kết bảo mật thông tin cá nhân",
    en: "Commitment to personal information privacy",
  },
  submitButton: {
    vi: "Gửi đăng ký",
    en: "Submit Registration",
  },
  submittingButton: {
    vi: "Đang gửi...",
    en: "Submitting...",
  },
  successMessage: {
    title: {
      vi: "Gửi thành công",
      en: "Submission Successful",
    },
    description: {
      vi: "Cảm ơn bạn đã đăng ký tư vấn!",
      en: "Thank you for registering for a consultation!",
    },
  },
  failureMessage: {
    title: {
      vi: "Gửi thất bại",
      en: "Submission Failed",
    },
    description: {
      vi: "Gửi thất bại, vui lòng thử lại sau!",
      en: "Submission failed, please try again later!",
    },
  },
  modal: {
    title: {
      vi: "Vui lòng đăng nhập",
      en: "Please Log In",
    },
    description: {
      vi: "Để đăng ký tư vấn, bạn cần đăng nhập vào tài khoản của mình. Nếu chưa có tài khoản, bạn có thể đăng ký một cách nhanh chóng.",
      en: "To register for a consultation, you need to log in to your account. If you don't have an account, you can register quickly.",
    },
    loginButton: {
      vi: "Đăng nhập",
      en: "Log In",
    },
    registerButton: {
      vi: "Đăng ký tài khoản mới",
      en: "Register New Account",
    },
    continueWithoutLogin: {
      vi: "Tiếp tục mà không đăng nhập (Lưu ý: Không thể theo dõi yêu cầu)",
      en: "Continue without logging in (Note: Request cannot be tracked)",
    },
  },
};

export default registrationFormTranslations;
