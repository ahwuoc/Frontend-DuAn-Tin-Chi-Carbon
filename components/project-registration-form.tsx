"use client"

import React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2, Upload, X, FileText, MapPin, LogIn } from "lucide-react"
import ConfettiEffect from "@/components/confetti-effect"

import { useAuth } from "@/context/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { apiProjectCarbon } from "../app/fetch/fetch.project-carbon"

const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

export default function ProjectRegistrationForm() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const kmlFileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("forest");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [kmlFile, setKmlFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    organization: "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",

    forestLocation: "",
    forestArea: "",
    treeSpecies: "",
    plantingAge: "",
    averageHeight: "",
    averageCircumference: "",
    previousDeforestation: "",

    riceLocation: "",
    riceArea: "",
    riceTerrain: "",
    riceClimate: "",
    riceSoilType: "",
    riceStartDate: "",
    riceEndDate: "",

    biocharRawMaterial: "",
    biocharCarbonContent: "",
    biocharLandArea: "",
    biocharApplicationMethod: "",

    additionalInfo: "",
  });

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | React.ChangeEvent<HTMLTextAreaElement> | HTMLSelectElement>) => {
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleKmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setKmlFile(e.target.files[0]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeKmlFile = () => {
    setKmlFile(null);
    if (kmlFileInputRef.current) {
      kmlFileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const requiredFields = ["name", "phone", "email"];

    if (activeTab === "forest") {
      requiredFields.push("forestLocation", "forestArea", "treeSpecies");
    } else if (activeTab === "rice") {
      requiredFields.push("riceLocation", "riceArea", "riceStartDate", "riceEndDate");
    } else if (activeTab === "biochar") {
      requiredFields.push("biocharRawMaterial", "biocharLandArea", "biocharApplicationMethod");
    }

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        errors[field] = `${getFieldLabel(field)} là bắt buộc`;
      }
    });

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Định dạng email không hợp lệ";
    }

    if (uploadedFiles.length === 0) {
      errors.landDocuments = "Vui lòng tải lên giấy tờ sử dụng đất";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const scrollToFirstError = (errors: Record<string, string>) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  };

  const getFieldLabel = (fieldName: string): string => {
    const labels: Record<string, string> = {
      name: "Họ và tên",
      organization: "Tổ chức/Doanh nghiệp",
      phone: "Số điện thoại",
      email: "Email",
      address: "Địa chỉ",
      forestLocation: "Vị trí dự án",
      forestArea: "Diện tích đất trồng cây",
      treeSpecies: "Các loài cây",
      plantingAge: "Thời gian đã trồng",
      averageHeight: "Chiều cao trung bình",
      averageCircumference: "Chu vi ngang ngực thân cây",
      previousDeforestation: "Lịch sử chặt phá",
      riceLocation: "Vị trí dự án",
      riceArea: "Diện tích đất trồng lúa",
      riceTerrain: "Địa hình",
      riceClimate: "Khí hậu",
      riceSoilType: "Loại đất",
      riceStartDate: "Thời gian bắt đầu trồng",
      riceEndDate: "Thời gian kết thúc trồng",
      biocharRawMaterial: "Nguyên liệu đầu vào",
      biocharCarbonContent: "Hàm lượng carbon cố định",
      biocharLandArea: "Diện tích đất được cải tạo",
      biocharApplicationMethod: "Phương pháp ứng dụng",
      additionalInfo: "Thông tin bổ sung",
      landDocuments: "Giấy tờ sử dụng đất",
      kmlFile: "File KML",
    };
    return labels[fieldName] || fieldName;
  };

  const handleGoToLogin = () => {
    router.push(`/dang-nhap?redirect=${encodeURIComponent("/quan-ly")}&email=${encodeURIComponent(formData.email)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      scrollToFirstError(errors);
      return;
    }
    setIsSubmitting(true);

    const uploadPreset = "my_unsigned_preset";

    try {
      const landDocumentUrls: string[] = [];
      for (const file of uploadedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error(`Error uploading ${file.name} to Cloudinary:`, res.status, errorData);
          throw new Error(`Tải file ${file.name} lên Cloudinary thất bại: ${errorData.error?.message || res.statusText}`);
        }

        const data = await res.json();
        landDocumentUrls.push(data.secure_url);
      }

      let kmlFileUrl: string | null = null;
      if (kmlFile) {
        const formData = new FormData();
        formData.append("file", kmlFile);
        formData.append("upload_preset", uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error(`Error uploading ${kmlFile.name} to Cloudinary:`, res.status, errorData);
          throw new Error(`Tải file KML ${kmlFile.name} lên Cloudinary thất bại: ${errorData.error?.message || res.statusText}`);
        }

        const data = await res.json();
        kmlFileUrl = data.secure_url;
      }
      const dataToSendToBackend = new FormData();
      dataToSendToBackend.append('name', formData.name);
      dataToSendToBackend.append('organization', formData.organization);
      dataToSendToBackend.append('phone', formData.phone);
      dataToSendToBackend.append('email', formData.email);
      dataToSendToBackend.append('address', formData.address);
      dataToSendToBackend.append('projectType', activeTab);

      if (activeTab === "forest") {
        dataToSendToBackend.append('forestLocation', formData.forestLocation);
        dataToSendToBackend.append('forestArea', formData.forestArea);
        dataToSendToBackend.append('treeSpecies', formData.treeSpecies);
        dataToSendToBackend.append('plantingAge', formData.plantingAge);
        dataToSendToBackend.append('averageHeight', formData.averageHeight);
        dataToSendToBackend.append('averageCircumference', formData.averageCircumference);
        dataToSendToBackend.append('previousDeforestation', formData.previousDeforestation);
      } else if (activeTab === "rice") {
        dataToSendToBackend.append('riceLocation', formData.riceLocation);
        dataToSendToBackend.append('riceArea', formData.riceArea);
        dataToSendToBackend.append('riceTerrain', formData.riceTerrain);
        dataToSendToBackend.append('riceClimate', formData.riceClimate);
        dataToSendToBackend.append('riceSoilType', formData.riceSoilType);
        dataToSendToBackend.append('riceStartDate', formData.riceStartDate);
        dataToSendToBackend.append('riceEndDate', formData.riceEndDate);
      } else if (activeTab === "biochar") {
        dataToSendToBackend.append('biocharRawMaterial', formData.biocharRawMaterial);
        dataToSendToBackend.append('biocharCarbonContent', formData.biocharCarbonContent);
        dataToSendToBackend.append('biocharLandArea', formData.biocharLandArea);
        dataToSendToBackend.append('biocharApplicationMethod', formData.biocharApplicationMethod);
      }
      dataToSendToBackend.append('additionalInfo', formData.additionalInfo);
      landDocumentUrls.forEach(url => {
        dataToSendToBackend.append('landDocuments', url);
      });
      if (kmlFileUrl) {
        dataToSendToBackend.append('kmlFile', kmlFileUrl);
      }
      const userid = JSON.parse(localStorage.getItem("user_id") ?? "");
      dataToSendToBackend.append('userId', userid);
      const result = await apiProjectCarbon.add(Object.fromEntries(dataToSendToBackend));
      setIsSuccess(true);
      setShowConfetti(true);
      setShowLoginPrompt(!isAuthenticated);

      if (!isAuthenticated) {
        setFormData({
          name: "", organization: "", phone: "", email: "", address: "",
          forestLocation: "", forestArea: "", treeSpecies: "", plantingAge: "", averageHeight: "", averageCircumference: "", previousDeforestation: "",
          riceLocation: "", riceArea: "", riceTerrain: "", riceClimate: "", riceSoilType: "", riceStartDate: "", riceEndDate: "",
          biocharRawMaterial: "", biocharCarbonContent: "", biocharLandArea: "", biocharApplicationMethod: "",
          additionalInfo: "",
        });
      } else {
        setFormData(prev => ({
          ...prev,
          forestLocation: "", forestArea: "", treeSpecies: "", plantingAge: "", averageHeight: "", averageCircumference: "", previousDeforestation: "",
          riceLocation: "", riceArea: "", riceTerrain: "", riceClimate: "", riceSoilType: "", riceStartDate: "", riceEndDate: "",
          biocharRawMaterial: "", biocharCarbonContent: "", biocharLandArea: "", biocharApplicationMethod: "",
          additionalInfo: "",
        }));
      }

      setUploadedFiles([]);
      setKmlFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (kmlFileInputRef.current) kmlFileInputRef.current.value = "";

      setFormErrors({});

      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

    } catch (error) {
      console.error("Lỗi trong quá trình submit:", error);
      alert(`Đã xảy ra lỗi: ${(error as Error).message || 'Không rõ lỗi'}`);

      setIsSuccess(false);
      setShowLoginPrompt(false);
      setShowConfetti(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Đăng ký dự án tín chỉ carbon
      </h3>

      {isSuccess ? (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              Đăng ký dự án thành công!
            </h3>
            <p className="text-gray-600">
              Cảm ơn bạn đã đăng ký dự án tín chỉ carbon với chúng tôi.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-lg mb-3">
              Thông tin dự án của bạn
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Loại dự án:</span>{" "}
                {activeTab === "forest"
                  ? "Lâm nghiệp"
                  : activeTab === "rice"
                    ? "Lúa"
                    : "Biochar"
                }
              </p>
              <p><span className="font-medium">{getFieldLabel("name")}:</span> {formData.name}</p>
              {formData.organization && <p><span className="font-medium">{getFieldLabel("organization")}:</span> {formData.organization}</p>}
              <p><span className="font-medium">{getFieldLabel("phone")}:</span> {formData.phone}</p>
              <p><span className="font-medium">{getFieldLabel("email")}:</span> {formData.email}</p>
              {formData.address && <p><span className="font-medium">{getFieldLabel("address")}:</span> {formData.address}</p>}

              {activeTab === "forest" && (
                <>
                  <p><span className="font-medium">{getFieldLabel("forestLocation")}:</span> {formData.forestLocation}</p>
                  <p><span className="font-medium">{getFieldLabel("forestArea")}:</span> {formData.forestArea} ha</p>
                </>
              )}
              {activeTab === "rice" && (
                <>
                  <p><span className="font-medium">{getFieldLabel("riceLocation")}:</span> {formData.riceLocation}</p>
                  <p><span className="font-medium">{getFieldLabel("riceArea")}:</span> {formData.riceArea} ha</p>
                </>
              )}
              {activeTab === "biochar" && (
                <>
                  <p><span className="font-medium">{getFieldLabel("biocharRawMaterial")}:</span> {formData.biocharRawMaterial}</p>
                  <p><span className="font-medium">{getFieldLabel("biocharLandArea")}:</span> {formData.biocharLandArea} ha</p>
                </>
              )}
              {formData.additionalInfo && (
                <p><span className="font-medium">{getFieldLabel("additionalInfo")}:</span> {formData.additionalInfo}</p>
              )}
              {uploadedFiles.length > 0 && (
                <p><span className="font-medium">{getFieldLabel("landDocuments")}:</span> {uploadedFiles.map(f => f.name).join(', ')}</p>
              )}
              {kmlFile && (
                <p><span className="font-medium">{getFieldLabel("kmlFile")}:</span> {kmlFile.name}</p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-lg mb-2 text-blue-800">
              Các bước tiếp theo
            </h4>
            <ul className="text-blue-700 space-y-1 list-disc pl-5 text-sm">
              <li>
                Chuyên gia của chúng tôi sẽ xem xét thông tin dự án của bạn
              </li>
              <li>
                Chúng tôi sẽ liên hệ với bạn trong vòng 3-5 ngày làm việc
              </li>
              <li>
                Bạn sẽ được hướng dẫn các bước tiếp theo để triển khai dự án
              </li>
            </ul>
          </div>

          {showLoginPrompt && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
              <h4 className="font-semibold flex items-center text-green-800 mb-2">
                <LogIn className="h-5 w-5 mr-2" />
                Theo dõi dự án của bạn
              </h4>
              <p className="text-sm text-green-700 mb-3">
                {`Chúng tôi đã sử dụng email ${formData.email} của bạn. Đăng nhập để theo dõi trạng thái dự án và cập nhật thông tin.`}
              </p>
              <Button onClick={handleGoToLogin} className="w-full bg-green-600 hover:bg-green-700">
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập ngay
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  name: user?.name || "", organization: "", phone: user?.phone || "", email: user?.email || "", address: user?.address || "",
                  forestLocation: "", forestArea: "", treeSpecies: "", plantingAge: "", averageHeight: "", averageCircumference: "", previousDeforestation: "",
                  riceLocation: "", riceArea: "", riceTerrain: "", riceClimate: "", riceSoilType: "", riceStartDate: "", riceEndDate: "",
                  biocharRawMaterial: "", biocharCarbonContent: "", biocharLandArea: "", biocharApplicationMethod: "",
                  additionalInfo: "",
                });
                setUploadedFiles([]);
                setKmlFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                if (kmlFileInputRef.current) kmlFileInputRef.current.value = "";
                setFormErrors({});
                setShowLoginPrompt(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Đăng ký dự án khác
            </Button>
            <Button
              type="button"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (isAuthenticated) {
                  router.push("/quan-ly");
                } else {
                  router.push("/");
                }
              }}
            >
              {isAuthenticated ? "Quản lý tài khoản" : "Về trang chủ"}
            </Button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="forest" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="forest" className="text-sm md:text-base">
              Lâm nghiệp
            </TabsTrigger>
            <TabsTrigger value="rice" className="text-sm md:text-base">
              Lúa
            </TabsTrigger>
            <TabsTrigger value="biochar" className="text-sm md:text-base">
              Biochar
            </TabsTrigger>
          </TabsList>

          <div className="space-y-5 mb-8">
            <h4 className="text-lg font-semibold text-gray-700">
              Thông tin liên hệ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  {getFieldLabel("name")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={getFieldLabel("name")}
                  className={`border-2 py-6 ${formErrors.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization" className="text-gray-700 font-medium">
                  {getFieldLabel("organization")}
                </Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder={getFieldLabel("organization")}
                  className="border-2 py-6 border-gray-200 focus:border-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  {getFieldLabel("phone")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={getFieldLabel("phone")}
                  className={`border-2 py-6 ${formErrors.phone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  {getFieldLabel("email")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={getFieldLabel("email")}
                  className={`border-2 py-6 ${formErrors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700 font-medium">
                {getFieldLabel("address")}
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={getFieldLabel("address")}
                className="border-2 py-6 border-gray-200 focus:border-green-500"
              />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="text-lg font-semibold text-gray-700">
              Giấy tờ sử dụng đất
              <span className="text-red-500">*</span>
            </h4>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer ${formErrors.landDocuments ? "border-red-400" : "border-gray-300"}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-1">
                Kéo và thả hoặc nhấp để tải lên
              </p>
              <p className="text-gray-400 text-sm">
                Hỗ trợ: PDF, DOC, DOCX, JPG, PNG
              </p>
            </div>

            {formErrors.landDocuments && <p className="text-red-500 text-sm">{formErrors.landDocuments}</p>}

            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="font-medium text-gray-700">Tệp đã tải lên:</p>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-700 text-sm">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <TabsContent value="forest" className="space-y-6 mt-0">
            <h4 className="text-lg font-semibold text-gray-700">
              Thông tin dự án lâm nghiệp
            </h4>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="forestLocation" className="text-gray-700 font-medium">
                  {getFieldLabel("forestLocation")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="forestLocation"
                  name="forestLocation"
                  value={formData.forestLocation}
                  onChange={handleChange}
                  placeholder="Vị trí cụ thể của dự án"
                  className={`border-2 py-6 ${formErrors.forestLocation ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.forestLocation && <p className="text-red-500 text-sm">{formErrors.forestLocation}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  File KML (nếu có)
                </Label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => kmlFileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={kmlFileInputRef}
                    onChange={handleKmlFileUpload}
                    className="hidden"
                    accept=".kml,.kmz"
                  />
                  <MapPin className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">
                    Tải lên file KML/KMZ
                  </p>
                </div>

                {kmlFile && (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md mt-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-700 text-sm">{kmlFile.name}</span>
                    </div>
                    <button type="button" onClick={removeKmlFile} className="text-gray-500 hover:text-red-500">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="forestArea" className="text-gray-700 font-medium">
                    {getFieldLabel("forestArea")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="forestArea"
                    name="forestArea"
                    value={formData.forestArea}
                    onChange={handleChange}
                    placeholder="Diện tích (ha)"
                    className={`border-2 py-6 ${formErrors.forestArea ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                  />
                  {formErrors.forestArea && <p className="text-red-500 text-sm">{formErrors.forestArea}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treeSpecies" className="text-gray-700 font-medium">
                    {getFieldLabel("treeSpecies")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="treeSpecies"
                    name="treeSpecies"
                    value={formData.treeSpecies}
                    onChange={handleChange}
                    placeholder="Các loài cây (phân cách bằng dấu phẩy)"
                    className={`border-2 py-6 ${formErrors.treeSpecies ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                  />
                  {formErrors.treeSpecies && <p className="text-red-500 text-sm">{formErrors.treeSpecies}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="plantingAge" className="text-gray-700 font-medium">
                    {getFieldLabel("plantingAge")}
                  </Label>
                  <Input
                    id="plantingAge"
                    name="plantingAge"
                    value={formData.plantingAge}
                    onChange={handleChange}
                    placeholder="Đã trồng bao lâu (năm)"
                    className="border-2 py-6 border-gray-200 focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averageHeight" className="text-gray-700 font-medium">
                    {getFieldLabel("averageHeight")}
                  </Label>
                  <Input
                    id="averageHeight"
                    name="averageHeight"
                    value={formData.averageHeight}
                    onChange={handleChange}
                    placeholder="Chiều cao trung bình (m)"
                    className="border-2 py-6 border-gray-200 focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averageCircumference" className="text-gray-700 font-medium">
                    {getFieldLabel("averageCircumference")}
                  </Label>
                  <Input
                    id="averageCircumference"
                    name="averageCircumference"
                    value={formData.averageCircumference}
                    onChange={handleChange}
                    placeholder="Chu vi ngang ngực (cm)"
                    className="border-2 py-6 border-gray-200 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousDeforestation" className="text-gray-700 font-medium">
                  {getFieldLabel("previousDeforestation")}
                </Label>
                <select
                  id="previousDeforestation"
                  name="previousDeforestation"
                  value={formData.previousDeforestation}
                  onChange={handleChange}
                  className="w-full border-2 py-3 px-4 rounded-md border-gray-200 focus:border-green-500"
                >
                  <option value="">-- Chọn câu trả lời --</option>
                  <option value="no">
                    Không, không có hoạt động chặt phá
                  </option>
                  <option value="yes">
                    Có, đã có hoạt động chặt phá
                  </option>
                  <option value="unknown">
                    Không biết/Không chắc chắn
                  </option>
                </select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rice" className="space-y-6 mt-0">
            <h4 className="text-lg font-semibold text-gray-700">
              Thông tin dự án lúa
            </h4>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="riceLocation" className="text-gray-700 font-medium">
                  {getFieldLabel("riceLocation")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="riceLocation"
                  name="riceLocation"
                  value={formData.riceLocation}
                  onChange={handleChange}
                  placeholder="Vị trí cụ thể của dự án"
                  className={`border-2 py-6 ${formErrors.riceLocation ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.riceLocation && <p className="text-red-500 text-sm">{formErrors.riceLocation}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  File KML (nếu có)
                </Label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => kmlFileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={kmlFileInputRef}
                    onChange={handleKmlFileUpload}
                    className="hidden"
                    accept=".kml,.kmz"
                  />
                  <MapPin className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">
                    Tải lên file KML/KMZ
                  </p>
                </div>

                {kmlFile && (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md mt-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-700 text-sm">{kmlFile.name}</span>
                    </div>
                    <button type="button" onClick={removeKmlFile} className="text-gray-500 hover:text-red-500">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="riceArea" className="text-gray-700 font-medium">
                    {getFieldLabel("riceArea")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="riceArea"
                    name="riceArea"
                    value={formData.riceArea}
                    onChange={handleChange}
                    placeholder="Diện tích (ha)"
                    className={`border-2 py-6 ${formErrors.riceArea ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                  />
                  {formErrors.riceArea && <p className="text-red-500 text-sm">{formErrors.riceArea}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riceSoilType" className="text-gray-700 font-medium">
                    {getFieldLabel("riceSoilType")}
                  </Label>
                  <Input
                    id="riceSoilType"
                    name="riceSoilType"
                    value={formData.riceSoilType}
                    onChange={handleChange}
                    placeholder="Loại đất"
                    className="border-2 py-6 border-gray-200 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="riceTerrain" className="text-gray-700 font-medium">
                    {getFieldLabel("riceTerrain")}
                  </Label>
                  <Input
                    id="riceTerrain"
                    name="riceTerrain"
                    value={formData.riceTerrain}
                    onChange={handleChange}
                    placeholder="Mô tả địa hình"
                    className="border-2 py-6 border-gray-200 focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riceClimate" className="text-gray-700 font-medium">
                    {getFieldLabel("riceClimate")}
                  </Label>
                  <Input
                    id="riceClimate"
                    name="riceClimate"
                    value={formData.riceClimate}
                    onChange={handleChange}
                    placeholder="Điều kiện khí hậu"
                    className="border-2 py-6 border-gray-200 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="riceStartDate" className="text-gray-700 font-medium">
                    {getFieldLabel("riceStartDate")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="riceStartDate"
                    name="riceStartDate"
                    type="date"
                    value={formData.riceStartDate}
                    onChange={handleChange}
                    className={`border-2 py-6 ${formErrors.riceStartDate ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                  />
                  {formErrors.riceStartDate && <p className="text-red-500 text-sm">{formErrors.riceStartDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riceEndDate" className="text-gray-700 font-medium">
                    {getFieldLabel("riceEndDate")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="riceEndDate"
                    name="riceEndDate"
                    type="date"
                    value={formData.riceEndDate}
                    onChange={handleChange}
                    className={`border-2 py-6 ${formErrors.riceEndDate ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                  />
                  {formErrors.riceEndDate && <p className="text-red-500 text-sm">{formErrors.riceEndDate}</p>}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="biochar" className="space-y-6 mt-0">
            <h4 className="text-lg font-semibold text-gray-700">
              Thông tin dự án Biochar
            </h4>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="biocharRawMaterial" className="text-gray-700 font-medium">
                  {getFieldLabel("biocharRawMaterial")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="biocharRawMaterial"
                  name="biocharRawMaterial"
                  value={formData.biocharRawMaterial}
                  onChange={handleChange}
                  placeholder="Nguyên liệu đầu vào"
                  className={`border-2 py-6 ${formErrors.biocharRawMaterial ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.biocharRawMaterial && (
                  <p className="text-red-500 text-sm">{formErrors.biocharRawMaterial}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="biocharCarbonContent" className="text-gray-700 font-medium">
                  {getFieldLabel("biocharCarbonContent")}
                </Label>
                <Input
                  id="biocharCarbonContent"
                  name="biocharCarbonContent"
                  value={formData.biocharCarbonContent}
                  onChange={handleChange}
                  placeholder="Hàm lượng carbon cố định (%)"
                  className="border-2 py-6 border-gray-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="biocharLandArea" className="text-gray-700 font-medium">
                  {getFieldLabel("biocharLandArea")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="biocharLandArea"
                  name="biocharLandArea"
                  value={formData.biocharLandArea}
                  onChange={handleChange}
                  placeholder="Diện tích đất được cải tạo (ha)"
                  className={`border-2 py-6 ${formErrors.biocharLandArea ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.biocharLandArea && <p className="text-red-500 text-sm">{formErrors.biocharLandArea}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="biocharApplicationMethod" className="text-gray-700 font-medium">
                  {getFieldLabel("biocharApplicationMethod")} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="biocharApplicationMethod"
                  name="biocharApplicationMethod"
                  value={formData.biocharApplicationMethod}
                  onChange={handleChange}
                  placeholder="Mô tả phương pháp ứng dụng biochar vào đất"
                  rows={3}
                  className={`border-2 ${formErrors.biocharApplicationMethod ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"} resize-none`}
                />
                {formErrors.biocharApplicationMethod && (
                  <p className="text-red-500 text-sm">{formErrors.biocharApplicationMethod}</p>
                )}
              </div>
            </div>
          </TabsContent>

          <div className="space-y-4 mt-6">
            <h4 className="text-lg font-semibold text-gray-700">
              Thông tin bổ sung
            </h4>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="text-gray-700 font-medium">
                {getFieldLabel("additionalInfo")}
              </Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Thông tin bổ sung về dự án"
                rows={4}
                className="border-2 border-gray-200 focus:border-green-500 resize-none"
              />
            </div>
          </div>

          <div className="flex items-start space-x-2 py-4">
            <div className="bg-green-100 p-1 rounded-full mt-0.5">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">
              Chúng tôi cam kết bảo mật thông tin của bạn và chỉ sử dụng cho mục đích đánh giá dự án.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang gửi...
              </>
            ) : (
              "Đăng ký dự án"
            )}
          </Button>
        </Tabs>
      )}

      <ConfettiEffect isActive={showConfetti} />
    </form>
  );
}