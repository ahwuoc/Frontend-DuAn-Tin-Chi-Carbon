"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2 } from "lucide-react";
import ConfettiEffect from "@/components/confetti-effect";
import apiConsultation, { TFormData } from "@/app/fetch/fetch.register-form";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function RegistrationForm() {
  const [formData, setFormData] = useState<TFormData>({
    userId: "",
    name: "",
    age: "",
    location: "",
    area: "",
    phone: "",
    email: "",
    message: "",
    consultationType: "forest",
    organization: "",
    position: "",
    experience: "",
    education: "",
    projectType: "",
    projectSize: "",
    projectLocation: "",
    implementationTimeline: "",
    budget: "",
    carbonGoals: "",
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [requiredFields, setRequiredFields] = useState<string[]>([
    "name",
    "phone",
    "email",
    "consultationType",
  ]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      try {
        const parsedUserId = JSON.parse(storedUserId);
        setFormData((prev) => ({ ...prev, userId: parsedUserId || "" }));
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const baseRequiredFields = ["name", "phone", "email", "consultationType"];
    let additionalFields: string[] = [];

    switch (formData.consultationType) {
      case "forest":
        additionalFields = ["age", "location", "area"];
        break;
      case "agriculture":
        additionalFields = ["area", "location", "projectType"];
        break;
      case "biochar":
        additionalFields = ["organization", "projectSize"];
        break;
      case "csu":
        additionalFields = ["education", "experience"];
        break;
      case "carbonbook":
        additionalFields = ["organization", "position"];
        break;
      case "other":
        additionalFields = ["message"];
        break;
    }
    setRequiredFields([...baseRequiredFields, ...additionalFields]);
  }, [formData.consultationType]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      const fieldValue = formData[field as keyof TFormData];
      if (typeof fieldValue === 'string' && !fieldValue.trim()) {
        errors[field] = `${getFieldLabel(field)} là bắt buộc`;
      } else if (typeof fieldValue !== 'string' && !fieldValue) {
        errors[field] = `${getFieldLabel(field)} là bắt buộc`;
      }
    });
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email = "Định dạng email không hợp lệ";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldLabel = (fieldName: string): string => {
    const labels: Record<string, string> = {
      name: "Họ và tên",
      age: "Tuổi",
      location: "Địa điểm",
      area: formData.consultationType === "forest" ? "Diện tích rừng" : "Diện tích (ha)",
      phone: "Số điện thoại",
      email: "Email",
      message: "Câu hỏi khác",
      consultationType: "Loại tư vấn",
      organization: "Tổ chức/Doanh nghiệp",
      position: "Chức vụ",
      experience: "Kinh nghiệm",
      education: "Trình độ học vấn",
      projectType: "Loại dự án",
      projectSize: "Quy mô dự án",
      projectLocation: "Địa điểm dự án",
      implementationTimeline: "Thời gian triển khai",
      budget: "Ngân sách dự kiến",
      carbonGoals: "Mục tiêu giảm phát thải",
    };
    return labels[fieldName] || fieldName;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await apiConsultation.registerConsultation({ formData });
      if (response.status === 200 && response.payload) {
        setIsSuccess(true);
        setShowConfetti(true);

        let resetUserId = "";
        const storedUserId = localStorage.getItem("user_id");
        if (storedUserId) {
          try {
            resetUserId = JSON.parse(storedUserId) || "";
          } catch (error) {
            resetUserId = "";
          }
        }

        setFormData({
          userId: resetUserId,
          name: "",
          age: "",
          location: "",
          area: "",
          phone: "",
          email: "",
          message: "",
          consultationType: "forest",
          organization: "",
          position: "",
          experience: "",
          education: "",
          projectType: "",
          projectSize: "",
          projectLocation: "",
          implementationTimeline: "",
          budget: "",
          carbonGoals: "",
        });
        setTimeout(() => {
          setIsSuccess(false);
          setShowConfetti(false);
          toast({
            title: "Gửi thành công",
            description: "Cảm ơn bạn đã đăng ký tư vấn!",
            variant: "default",
          });
        }, 5000);
      } else {
        toast({
          title: "Gửi thất bại",
          description: response.payload?.error || "Gửi thất bại, vui lòng thử lại sau!",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Gửi thất bại",
        description: "Gửi thất bại, vui lòng thử lại sau!",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderConsultationTypeFields = () => {
    switch (formData.consultationType) {
      case "forest":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-700 font-medium">
                  Tuổi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Tuổi"
                  className={`border-2 py-6 ${formErrors.age ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.age && (
                  <p className="text-red-500 text-sm">{formErrors.age}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">
                  Địa điểm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Địa chỉ"
                  className={`border-2 py-6 ${formErrors.location ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm">{formErrors.location}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area" className="text-gray-700 font-medium">
                Diện tích rừng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Diện tích rừng (ha)"
                className={`border-2 py-6 ${formErrors.area ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.area && (
                <p className="text-red-500 text-sm">{formErrors.area}</p>
              )}
            </div>
          </>
        );

      case "agriculture":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700 font-medium">
                Địa điểm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Địa chỉ"
                className={`border-2 py-6 ${formErrors.location ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.location && (
                <p className="text-red-500 text-sm">{formErrors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area" className="text-gray-700 font-medium">
                Diện tích canh tác (ha) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Diện tích canh tác (ha)"
                className={`border-2 py-6 ${formErrors.area ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.area && (
                <p className="text-red-500 text-sm">{formErrors.area}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType" className="text-gray-700 font-medium">
                Loại cây trồng/vật nuôi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                placeholder="Loại cây trồng/vật nuôi"
                className={`border-2 py-6 ${formErrors.projectType ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.projectType && (
                <p className="text-red-500 text-sm">{formErrors.projectType}</p>
              )}
            </div>
          </>
        );
      case "biochar":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="organization" className="text-gray-700 font-medium">
                Tổ chức/Doanh nghiệp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Tổ chức/Doanh nghiệp"
                className={`border-2 py-6 ${formErrors.organization ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.organization && (
                <p className="text-red-500 text-sm">{formErrors.organization}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectSize" className="text-gray-700 font-medium">
                Quy mô dự án <span className="text-red-500">*</span>
              </Label>
              <Input
                id="projectSize"
                name="projectSize"
                value={formData.projectSize}
                onChange={handleChange}
                placeholder="Quy mô dự án (tấn biochar/năm)"
                className={`border-2 py-6 ${formErrors.projectSize ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.projectSize && (
                <p className="text-red-500 text-sm">{formErrors.projectSize}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectLocation" className="text-gray-700 font-medium">
                Địa điểm dự kiến
              </Label>
              <Input
                id="projectLocation"
                name="projectLocation"
                value={formData.projectLocation}
                onChange={handleChange}
                placeholder="Địa điểm dự kiến"
                className="border-2 py-6 border-gray-200 focus:border-green-500"
              />
            </div>
          </>
        );

      case "csu":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="education" className="text-gray-700 font-medium">
                Trình độ học vấn <span className="text-red-500">*</span>
              </Label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className={`w-full border-2 py-3 px-4 rounded-md ${formErrors.education ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              >
                <option value="">Trình độ học vấn</option>
                <option value="high_school">Trung học phổ thông</option>
                <option value="college">Cao đẳng</option>
                <option value="bachelor">Đại học</option>
                <option value="master">Thạc sĩ</option>
                <option value="phd">Tiến sĩ</option>
              </select>
              {formErrors.education && (
                <p className="text-red-500 text-sm">{formErrors.education}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-700 font-medium">
                Kinh nghiệm trong lĩnh vực môi trường <span className="text-red-500">*</span>
              </Label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full border-2 py-3 px-4 rounded-md ${formErrors.experience ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              >
                <option value="">Kinh nghiệm trong lĩnh vực môi trường</option>
                <option value="none">Chưa có kinh nghiệm</option>
                <option value="less_than_1">Dưới 1 năm</option>
                <option value="1_to_3">1-3 năm</option>
                <option value="3_to_5">3-5 năm</option>
                <option value="more_than_5">Trên 5 năm</option>
              </select>
              {formErrors.experience && (
                <p className="text-red-500 text-sm">{formErrors.experience}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization" className="text-gray-700 font-medium">
                Tổ chức/Doanh nghiệp
              </Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Tổ chức/Doanh nghiệp"
                className="border-2 py-6 border-gray-200 focus:border-green-500"
              />
            </div>
          </>
        );

      case "carbonbook":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="organization" className="text-gray-700 font-medium">
                Tổ chức/Doanh nghiệp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Tổ chức/Doanh nghiệp"
                className={`border-2 py-6 ${formErrors.organization ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.organization && (
                <p className="text-red-500 text-sm">{formErrors.organization}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-gray-700 font-medium">
                Chức vụ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Chức vụ"
                className={`border-2 py-6 ${formErrors.position ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.position && (
                <p className="text-red-500 text-sm">{formErrors.position}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbonGoals" className="text-gray-700 font-medium">
                Mục tiêu sử dụng Carbon Toàn Thư 4.0
              </Label>
              <Textarea
                id="carbonGoals"
                name="carbonGoals"
                value={formData.carbonGoals}
                onChange={handleChange}
                placeholder="Mục tiêu sử dụng Carbon Toàn Thư 4.0"
                rows={3}
                className="border-2 border-gray-200 focus:border-green-500 resize-none"
              />
            </div>
          </>
        );

      case "other":
        return (
          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-700 font-medium">
              Nội dung tư vấn <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Câu hỏi hoặc yêu cầu bổ sung"
              rows={5}
              className={`border-2 ${formErrors.message ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"} resize-none`}
            />
            {formErrors.message && (
              <p className="text-red-500 text-sm">{formErrors.message}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Đăng ký tư vấn
        </h3>

        <div className="space-y-2">
          <Label htmlFor="consultationType" className="text-gray-700 font-medium">
            Loại tư vấn <span className="text-red-500">*</span>
          </Label>
          <select
            id="consultationType"
            name="consultationType"
            value={formData.consultationType}
            onChange={handleChange}
            className={`w-full border-2 py-3 px-4 rounded-md ${formErrors.consultationType ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
          >
            <option value="forest">Tín chỉ carbon từ rừng</option>
            <option value="agriculture">Tín chỉ nông nghiệp</option>
            <option value="biochar">Công nghệ Biochar</option>
            <option value="csu">Khóa học chứng chỉ quốc tế CSU</option>
            <option value="carbonbook">Carbon Toàn Thư 4.0</option>
            <option value="other">Khác</option>
          </select>
          {formErrors.consultationType && (
            <p className="text-red-500 text-sm">{formErrors.consultationType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 font-medium">
            Họ và tên <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Họ và tên"
            className={`border-2 py-6 ${formErrors.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm">{formErrors.name}</p>
          )}
        </div>

        {renderConsultationTypeFields()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 font-medium">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className={`border-2 py-6 ${formErrors.phone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
            />
            {formErrors.phone && (
              <p className="text-red-500 text-sm">{formErrors.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`border-2 py-6 ${formErrors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>
        </div>

        {formData.consultationType !== "other" && (
          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-700 font-medium">
              Câu hỏi khác
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Câu hỏi hoặc yêu cầu bổ sung"
              rows={4}
              className="border-2 border-gray-200 focus:border-green-500 resize-none"
            />
          </div>
        )}

        <div className="flex items-start space-x-2 py-2">
          <div className="bg-green-100 p-1 rounded-full mt-0.5">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Cam kết bảo mật thông tin cá nhân</p>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang gửi...
            </>
          ) : (
            "Gửi đăng ký"
          )}
        </Button>

        {isSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p>Cảm ơn bạn đã đăng ký tư vấn!</p>
          </div>
        )}

        <ConfettiEffect isActive={showConfetti} />
      </form>
    </>
  );
}