import { z } from "zod";

export const getFormSchema = (language: "vi" | "en") =>
  z.object({
    fullName: z
      .string()
      .trim()
      .nonempty(
        language === "vi"
          ? "Vui lòng nhập họ tên"
          : "Please enter your full name",
      ),
    email: z
      .string()
      .trim()
      .nonempty(
        language === "vi" ? "Vui lòng nhập email" : "Please enter your email",
      )
      .email(language === "vi" ? "Email không hợp lệ" : "Invalid email format"),
    phone: z
      .string()
      .trim()
      .nonempty(
        language === "vi"
          ? "Vui lòng nhập số điện thoại"
          : "Please enter your phone number",
      )
      .regex(
        /^[0-9]{10,11}$/,
        language === "vi"
          ? "Số điện thoại không hợp lệ"
          : "Invalid phone number",
      ),
    address: z
      .string()
      .trim()
      .nonempty(
        language === "vi"
          ? "Vui lòng nhập địa chỉ"
          : "Please enter your address",
      ),
  });
