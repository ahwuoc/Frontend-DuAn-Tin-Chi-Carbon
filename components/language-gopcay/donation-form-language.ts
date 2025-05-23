// src/components/donation-form-language.ts
const donationFormTranslations = {
  formTitle: {
    vi: "Góp cây rừng",
    en: "Contribute to the Forest",
  },
  formStep1: {
    nameLabel: {
      vi: "Họ và tên*",
      en: "Full name*",
    },
    namePlaceholder: {
      vi: "Nhập họ và tên của bạn",
      en: "Enter your full name",
    },
    nameError: {
      vi: "Vui lòng nhập tên của bạn",
      en: "Please enter your name",
    },
    emailLabel: {
      vi: "Email*",
      en: "Email*",
    },
    emailPlaceholder: {
      vi: "Nhập email của bạn",
      en: "Enter your email",
    },
    emailError: {
      vi: "Vui lòng nhập email",
      en: "Please enter your email",
    },
    emailInvalidError: {
      vi: "Email không hợp lệ",
      en: "Invalid email",
    },
    phoneLabel: {
      vi: "Số điện thoại*",
      en: "Phone number*",
    },
    phonePlaceholder: {
      vi: "Nhập số điện thoại của bạn",
      en: "Enter your phone number",
    },
    phoneError: {
      vi: "Vui lòng nhập số điện thoại",
      en: "Please enter your phone number",
    },
    quantityLabel: {
      vi: "Số lượng cây",
      en: "Number of trees",
    },
    noteLabel: {
      vi: "Ghi chú (hiển thị trong mô hình 3D)",
      en: "Note (displayed in 3D model)",
    },
    notePlaceholder: {
      vi: "Nhập ghi chú của bạn (không bắt buộc)",
      en: "Enter your note (optional)",
    },
    noteHint: {
      vi: "Ghi chú của bạn sẽ được hiển thị trong mô hình rừng 3D",
      en: "Your note will be displayed in the 3D forest model",
    },
    pricePerTree: {
      vi: "Giá mỗi cây:",
      en: "Price per tree:",
    },
    totalAmount: {
      vi: "Tổng cộng:",
      en: "Total:",
    },
    transferContentTitle: {
      vi: "Nội dung chuyển khoản",
      en: "Transfer content",
    },
    transferContentHint: {
      vi: "Vui lòng sử dụng chính xác nội dung này khi chuyển khoản",
      en: "Please use this exact content for bank transfer",
    },
    continueButton: {
      vi: "Tiếp tục góp cây",
      en: "Continue to contribute",
    },
  },
  formStep2: {
    donationInfoTitle: {
      vi: "Thông tin góp cây",
      en: "Donation information",
    },
    donationQuantityText: {
      vi: (quantity) => `Đóng góp ${quantity} cây xanh`,
      en: (quantity) => `Contribute ${quantity} trees`,
    },
    bankInfoTitle: {
      vi: "Thông tin chuyển khoản",
      en: "Bank transfer information",
    },
    accountNameLabel: {
      vi: "Tên tài khoản:",
      en: "Account name:",
    },
    accountNumberLabel: {
      vi: "Số tài khoản:",
      en: "Account number:",
    },
    bankLabel: {
      vi: "Ngân hàng:",
      en: "Bank:",
    },
    branchLabel: {
      vi: "Chi nhánh:",
      en: "Branch:",
    },
    contentLabel: {
      vi: "Nội dung:",
      en: "Content:",
    },
    qrScanTitle: {
      vi: "Quét mã QR để góp xanh",
      en: "Scan QR code to contribute green",
    },
    qrScanHint: {
      vi: "Quét mã QR bằng ứng dụng ngân hàng để thanh toán nhanh chóng",
      en: "Scan the QR code with your banking app for quick payment",
    },
    completeButton: {
      vi: "Tôi đã góp cây",
      en: "I have contributed",
    },
    processingButton: {
      vi: "Đang xử lý...",
      en: "Processing...",
    },
  },
  toastMessages: {
    errorTitle: {
      vi: "Lỗi!",
      en: "Error!",
    },
    noCheckoutUrl: {
      noCheckoutUrl: {
        vi: "Có lỗi xảy ra, thử lại sau nhé!",
        en: "An error occurred, please try again later!",
      },
    },
    errorMessage: {
      vi: "Có lỗi xảy ra, thử lại sau nhé!",
      en: "An error occurred, please try again later!",
    },
  },
  agreementText: {
    vi: "* Bằng việc đóng góp, bạn đồng ý với điều khoản và điều kiện của chúng tôi.",
    en: "* By donating, you agree to our terms and conditions.",
  },
};

export default donationFormTranslations;
