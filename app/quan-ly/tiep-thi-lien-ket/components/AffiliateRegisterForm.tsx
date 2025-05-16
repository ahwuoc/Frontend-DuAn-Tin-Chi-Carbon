"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiAffiliates } from "@/app/fetch/fetch.affiliate";
import { useAuth } from "../../../../context/auth-context";
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  reason: string;
  address: string;
  website: string;
  socialMedia: string;
  experience: string;
}

export default function AffiliateRegisterForm() {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    reason: "",
    address: "",
    website: "",
    socialMedia: "",
    experience: "",
  });

  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showError = (message: string) =>
    toast({
      title: "Lỗi 😢",
      description: message,
      variant: "destructive",
    });

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.fullName || formData.fullName.length < 2)
      errors.fullName = "Họ và tên phải có ít nhất 2 ký tự.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Email không hợp lệ.";

    if (!/^\+?[0-9]{9,15}$/.test(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ.";
    }
    if (!formData.reason || formData.reason.length < 10)
      errors.reason = "Lý do tham gia phải dài hơn 10 ký tự.";

    if (!formData.address || formData.address.length < 5)
      errors.address = "Địa chỉ phải có ít nhất 5 ký tự.";

    if (Object.keys(errors).length > 0) {
      showError(Object.values(errors)[0]); // Hiển thị lỗi đầu tiên
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {


      const userId = user?.userId;
      const payload = { ...formData, userId };
      const response = await apiAffiliates.create(payload);

      if (response?.data) {
        toast({
          title: "Thành công 🎉",
          description: "Đăng ký affiliate thành công. Kiếm tiền thôi nào! 💰",
        });
        window.location.reload();
      }
    } catch (error) {
      showError("Đăng ký thất bại. Thử lại sau nha!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Đăng ký Affiliate</h1>
      <p className="text-gray-600 text-center mb-8">
        Điền thông tin để tham gia chương trình tiếp thị liên kết và bắt đầu
        kiếm tiền! 🚀
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* --- Commission Table --- */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Cơ cấu hoa hồng</h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Sản phẩm</th>
                  <th className="p-2">Cơ bản</th>
                  <th className="p-2">VIP</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">Carbon Toàn Thư 4.0</td>
                  <td className="p-2">20%</td>
                  <td className="p-2">30%</td>
                </tr>
                <tr>
                  <td className="p-2">Khóa học quốc tế</td>
                  <td className="p-2">10%</td>
                  <td className="p-2">15%</td>
                </tr>
                <tr>
                  <td className="p-2">Tín chỉ carbon</td>
                  <td className="p-2">5%</td>
                  <td className="p-2">10%</td>
                </tr>
                <tr>
                  <td className="p-2">Tư vấn doanh nghiệp</td>
                  <td className="p-2">5%</td>
                  <td className="p-2">10%</td>
                </tr>
              </tbody>
            </table>
            <ul className="text-sm mt-4 text-gray-600 list-disc pl-5">
              <li>Hoa hồng tính trên doanh thu bạn mang về.</li>
              <li>
                Đạt VIP nếu đạt 50 triệu doanh thu hoặc giới thiệu 20 khách hàng
                trong 3 tháng.
              </li>
              <li>Nhận tài liệu tiếp thị miễn phí ngay sau khi đăng ký.</li>
            </ul>
          </div>
        </div>

        {/* --- Form Section --- */}
        <div className="md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputBlock
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <InputBlock
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <InputBlock
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <InputBlock
                label="Công ty"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <InputBlock
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <InputBlock
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
              <InputBlock
                label="Mạng xã hội"
                name="socialMedia"
                value={formData.socialMedia}
                onChange={handleChange}
              />
            </div>
            <InputBlock
              label="Kinh nghiệm liên quan"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            />
            <InputBlock
              label="Lý do tham gia"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi đăng ký"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 🔧 Component InputBlock: giảm lặp, dễ maintain
function InputBlock({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
}: {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={label}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
