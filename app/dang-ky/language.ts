export const registerLanguage = {
  vi: {
    // Page title and header
    title: "Đăng ký tài khoản",
    subtitle: "Đã có tài khoản?",
    loginLink: "Đăng nhập ngay",
    
    // Form fields
    form: {
      name: {
        label: "Tên",
        placeholder: "Ví dụ: John Doe",
      },
      phone: {
        label: "Số điện thoại",
        placeholder: "0123456789",
      },
      email: {
        label: "Email",
        placeholder: "example@email.com",
      },
      password: {
        label: "Mật khẩu",
        placeholder: "••••••••",
      },
      confirmPassword: {
        label: "Xác nhận mật khẩu",
        placeholder: "••••••••",
      },
      agreeTerms: "Tôi đồng ý với các điều khoản và chính sách",
    },
    
    // Buttons
    buttons: {
      register: "Đăng ký",
      registering: "Đang đăng ký...",
    },
    
    // Toast messages
    toast: {
      success: {
        title: "Đăng ký thành công",
        description: (name: string) => `Chào mừng ${name}!`,
      },
      error: {
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra, thử lại nhé!",
      },
    },
    
    // Validation messages
    validation: {
      nameRequired: "Tên là bắt buộc",
      phoneRequired: "Số điện thoại là bắt buộc",
      emailRequired: "Email là bắt buộc",
      emailInvalid: "Email không hợp lệ",
      passwordRequired: "Mật khẩu là bắt buộc",
      passwordMinLength: "Mật khẩu phải có ít nhất 6 ký tự",
      confirmPasswordRequired: "Xác nhận mật khẩu là bắt buộc",
      passwordsNotMatch: "Mật khẩu không khớp",
      termsRequired: "Bạn phải đồng ý với điều khoản",
    },
  },
  
  en: {
    // Page title and header
    title: "Create your account",
    subtitle: "Already have an account?",
    loginLink: "Log in now",
    
    // Form fields
    form: {
      name: {
        label: "Name",
        placeholder: "E.g., John Doe",
      },
      phone: {
        label: "Phone Number",
        placeholder: "0123456789",
      },
      email: {
        label: "Email Address",
        placeholder: "example@email.com",
      },
      password: {
        label: "Password",
        placeholder: "••••••••",
      },
      confirmPassword: {
        label: "Confirm Password",
        placeholder: "••••••••",
      },
      agreeTerms: "I agree to the terms and policies",
    },
    
    // Buttons
    buttons: {
      register: "Register",
      registering: "Registering...",
    },
    
    // Toast messages
    toast: {
      success: {
        title: "Registration successful",
        description: (name: string) => `Welcome ${name}!`,
      },
      error: {
        title: "Registration failed",
        description: "Something went wrong, try again!",
      },
    },
    
    // Validation messages
    validation: {
      nameRequired: "Name is required",
      phoneRequired: "Phone number is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email address",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must be at least 6 characters",
      confirmPasswordRequired: "Confirm password is required",
      passwordsNotMatch: "Passwords do not match",
      termsRequired: "You must agree to the terms",
    },
  },
} as const;

export type RegisterLanguage = typeof registerLanguage;
export type RegisterLanguageKey = keyof typeof registerLanguage.vi;
