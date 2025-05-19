"use client";

import React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, LogIn } from "lucide-react";
import ConfettiEffect from "@/components/confetti-effect";

import { useAuth } from "@/context/auth-context";
import { apiProjectCarbon } from "@/app/fetch/fetch.project-carbon";
import {
  getUserFromLocalStorage,
  uploadToCloudinary,
} from "@/app/utils/common";

import dynamic from "next/dynamic";
import ProjectFormContent from "./ProjectFormContent";

interface FormData {
  name: string;
  organization: string;
  phone: string;
  email: string;
  address: string;

  forestLocation: string;
  forestArea: string;
  treeSpecies: string;
  plantingAge: string;
  averageHeight: string;
  averageCircumference: string;
  previousDeforestation: string;

  riceLocation: string;
  riceArea: string;
  riceTerrain: string;
  riceClimate: string;
  riceSoilType: string;
  riceStartDate: string;
  riceEndDate: string;

  biocharRawMaterial: string;
  biocharCarbonContent: string;
  biocharLandArea: string;
  biocharApplicationMethod: string;

  additionalInfo: string;
}

interface FormErrors {
  [key: string]: string;
}

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
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [kmlFile, setKmlFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      if (formErrors.landDocuments) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.landDocuments;
          return newErrors;
        });
      }
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
    const errors: FormErrors = {};
    const requiredFields = ["name", "phone", "email"];

    if (activeTab === "forest") {
      requiredFields.push("forestLocation", "forestArea", "treeSpecies");
    } else if (activeTab === "rice") {
      requiredFields.push(
        "riceLocation",
        "riceArea",
        "riceStartDate",
        "riceEndDate",
      );
    } else if (activeTab === "biochar") {
      requiredFields.push(
        "biocharRawMaterial",
        "biocharLandArea",
        "biocharApplicationMethod",
      );
    }

    requiredFields.forEach((field) => {
      if (!formData[field as keyof FormData]?.trim()) {
        errors[field] = `${getFieldLabel(field)} là bắt buộc`;
      }
    });

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email = "Định dạng email không hợp lệ";
    }

    if (uploadedFiles.length === 0) {
      errors.landDocuments = "Vui lòng tải lên giấy tờ sử dụng đất";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const scrollToFirstError = (errors: FormErrors) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (uploadedFiles.length === 0 && errors.landDocuments) {
      const fileUploadSection = document.getElementById(
        "land-documents-upload",
      );
      if (fileUploadSection) {
        fileUploadSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
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
    router.push(
      `/dang-nhap?redirect=${encodeURIComponent("/quan-ly")}&email=${encodeURIComponent(formData.email)}`,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      scrollToFirstError(errors);
      return;
    }
    setIsSubmitting(true);

    try {
      const landDocumentUrls = await Promise.all(
        uploadedFiles.map((file) => uploadToCloudinary(file)),
      );

      let kmlFileUrl: string | null = null;
      if (kmlFile) {
        kmlFileUrl = await uploadToCloudinary(kmlFile);
      }

      const dataToSendToBackend: any = {
        name: formData.name,
        organization: formData.organization,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        projectType: activeTab,
        additionalInfo: formData.additionalInfo,
        landDocuments: landDocumentUrls,
        kmlFile: kmlFileUrl,
      };

      if (activeTab === "forest") {
        dataToSendToBackend.forestLocation = formData.forestLocation;
        dataToSendToBackend.forestArea = formData.forestArea;
        dataToSendToBackend.treeSpecies = formData.treeSpecies;
        dataToSendToBackend.plantingAge = formData.plantingAge;
        dataToSendToBackend.averageHeight = formData.averageHeight;
        dataToSendToBackend.averageCircumference =
          formData.averageCircumference;
        dataToSendToBackend.previousDeforestation =
          formData.previousDeforestation;
      } else if (activeTab === "rice") {
        dataToSendToBackend.riceLocation = formData.riceLocation;
        dataToSendToBackend.riceArea = formData.riceArea;
        dataToSendToBackend.riceTerrain = formData.riceTerrain;
        dataToSendToBackend.riceClimate = formData.riceClimate;
        dataToSendToBackend.riceSoilType = formData.riceSoilType;
        dataToSendToBackend.riceStartDate = formData.riceStartDate;
        dataToSendToBackend.riceEndDate = formData.riceEndDate;
      } else if (activeTab === "biochar") {
        dataToSendToBackend.biocharRawMaterial = formData.biocharRawMaterial;
        dataToSendToBackend.biocharCarbonContent =
          formData.biocharCarbonContent;
        dataToSendToBackend.biocharLandArea = formData.biocharLandArea;
        dataToSendToBackend.biocharApplicationMethod =
          formData.biocharApplicationMethod;
      }

      let userid = null;
      try {
        const user = getUserFromLocalStorage();
        if (user && user.userId) {
          userid = user.userId;
        }
      } catch (parseError) {
        console.error("Failed to get user_id from localStorage", parseError);
      }

      if (userid) {
        dataToSendToBackend.userId = userid;
      } else if (isAuthenticated) {
        console.warn(
          "User is authenticated but user_id not found/valid in localStorage.",
        );
      }

      const result = await apiProjectCarbon.add(dataToSendToBackend);
      console.log("API submission result:", result);

      setIsSuccess(true);
      setShowConfetti(true);
      setShowLoginPrompt(!isAuthenticated);

      if (!isAuthenticated) {
        setFormData({
          name: "",
          organization: "",
          phone: "",
          email: "",
          address: "",
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
      } else {
        setFormData((prev) => ({
          ...prev,
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
      alert(`Đã xảy ra lỗi: ${(error as Error).message || "Không rõ lỗi"}`);

      setIsSuccess(false);
      setShowLoginPrompt(false);
      setShowConfetti(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-6">
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
                <span className="font-medium">Loại dự án:</span>
                {activeTab === "forest"
                  ? "Lâm nghiệp"
                  : activeTab === "rice"
                    ? "Lúa"
                    : "Biochar"}
              </p>
              <p>
                <span className="font-medium">{getFieldLabel("name")}:</span>
                {formData.name}
              </p>
              {formData.organization && (
                <p>
                  <span className="font-medium">
                    {getFieldLabel("organization")}:
                  </span>
                  {formData.organization}
                </p>
              )}
              <p>
                <span className="font-medium">{getFieldLabel("phone")}:</span>
                {formData.phone}
              </p>
              <p>
                <span className="font-medium">{getFieldLabel("email")}:</span>
                {formData.email}
              </p>
              {formData.address && (
                <p>
                  <span className="font-medium">
                    {getFieldLabel("address")}:
                  </span>
                  {formData.address}
                </p>
              )}
              {activeTab === "forest" && (
                <>
                  <p>
                    <span className="font-medium">
                      {getFieldLabel("forestLocation")}:
                    </span>
                    {formData.forestLocation}
                  </p>
                  <p>
                    <span className="font-medium">
                      {getFieldLabel("forestArea")}:
                    </span>
                    {formData.forestArea} ha
                  </p>
                </>
              )}
              {activeTab === "rice" && (
                <>
                  <p>
                    <span className="font-medium">
                      {getFieldLabel("riceLocation")}:
                    </span>
                    {formData.riceLocation}
                  </p>
                  <p>
                    <span className="font-medium">
                      {getFieldLabel("riceArea")}:
                    </span>
                    {formData.riceArea} ha
                  </p>
                </>
              )}
              {activeTab === "biochar" && (
                <>
                  <p>
                    <span className="font-medium">
                      {getFieldLabel("biocharRawMaterial")}:
                    </span>
                    {formData.biocharRawMaterial}
                  </p>
                  {formData.biocharCarbonContent && (
                    <p>
                      <span className="font-medium">
                        {getFieldLabel("biocharCarbonContent")}:
                      </span>
                      {formData.biocharCarbonContent}%
                    </p>
                  )}
                  <p>
                    <span className="font-medium">
                      {getFieldLabel("biocharLandArea")}:
                    </span>
                    {formData.biocharLandArea} ha
                  </p>
                  <p>
                    <span className="font-medium">
                      {getFieldLabel("biocharApplicationMethod")}:
                    </span>
                    {formData.biocharApplicationMethod}
                  </p>
                </>
              )}
              {formData.additionalInfo && (
                <p>
                  <span className="font-medium">
                    {getFieldLabel("additionalInfo")}:
                  </span>
                  {formData.additionalInfo}
                </p>
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
              <li>Chúng tôi sẽ liên hệ với bạn trong vòng 3-5 ngày làm việc</li>
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
              <Button
                onClick={handleGoToLogin}
                className="w-full bg-green-600 hover:bg-green-700"
              >
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
                setUploadedFiles([]);
                setKmlFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                if (kmlFileInputRef.current) kmlFileInputRef.current.value = "";
                setFormErrors({});
                setShowLoginPrompt(false);
                setActiveTab("forest");
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
        <ProjectFormContent
          formData={formData}
          formErrors={formErrors}
          uploadedFiles={uploadedFiles}
          kmlFile={kmlFile}
          activeTab={activeTab}
          isSubmitting={isSubmitting}
          fileInputRef={fileInputRef}
          kmlFileInputRef={kmlFileInputRef}
          handleChange={handleChange}
          handleTabChange={handleTabChange}
          handleFileUpload={handleFileUpload}
          handleKmlFileUpload={handleKmlFileUpload}
          removeFile={removeFile}
          removeKmlFile={removeKmlFile}
          getFieldLabel={getFieldLabel}
          handleSubmit={handleSubmit}
        />
      )}
      <ConfettiEffect isActive={showConfetti} />
    </div>
  );
}
