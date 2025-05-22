"use client";

import React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiProjectCarbon } from "@/app/fetch/fetch.project-carbon";
import {
  getUserFromLocalStorage,
  uploadToCloudinary,
} from "@/app/utils/common";

// Removed 'dynamic' import as it was unused
import ProjectFormContent from "./ProjectFormContent";
import { apiProjects } from "@/app/fetch/fetch.projects";
import ConfettiEffect from "@/components/confetti-effect";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context"; // Import useLanguage hook
import projectRegistrationTranslations from "./language-form";

// Định nghĩa lại FormData để phản ánh cấu trúc chi tiết hơn
interface FormData {
  name: string;
  organization: string;
  phone: string;
  email: string;
  address: string;

  // Fields for all project types, but populated conditionally
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
  riceStartDate: string; // Giữ là string vì form input là string
  riceEndDate: string; // Giữ là string vì form input là string

  biocharRawMaterial: string;
  biocharCarbonContent: string;
  biocharLandArea: string;
  biocharApplicationMethod: string;
  additionalInfo: string;
}

interface FormErrors {
  [key: string]: string;
}

// Cập nhật interface Project để khớp với loại bạn đang fetch từ apiProjects.getAll()
interface Project {
  _id: string;
  name: string;
}

export default function ProjectRegistrationForm() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại

  const fileInputRef = useRef<HTMLInputElement>(null);
  const kmlFileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"forest" | "rice" | "biochar">(
    "forest",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [kmlFile, setKmlFile] = useState<File | null>(null);

  const [Projects, setProjects] = useState<Project[]>([]);

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

  React.useEffect(() => {
    const getProjectList = async () => {
      const response = await apiProjects.getAll();
      if (response?.payload) {
        setProjects(response.payload);
      }
    };

    getProjectList();
  }, []);

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
    setActiveTab(value as "forest" | "rice" | "biochar");
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
        errors[field] =
          projectRegistrationTranslations.formValidation.requiredField[
            language
          ](getFieldLabel(field));
      }
    });

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email =
        projectRegistrationTranslations.formValidation.invalidEmail[language];
    }

    if (uploadedFiles.length === 0) {
      errors.landDocuments =
        projectRegistrationTranslations.formValidation.noLandDocuments[
          language
        ];
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
    // Sử dụng bản dịch cho các nhãn trường
    return (
      projectRegistrationTranslations.formValidation.fieldLabels[
        fieldName as keyof typeof projectRegistrationTranslations.formValidation.fieldLabels
      ]?.[language] || fieldName
    );
  };

  const handleGoToLogin = () => {
    router.push(
      `/dang-nhap?redirect=${encodeURIComponent(
        "/quan-ly",
      )}&email=${encodeURIComponent(formData.email)}`,
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
      // 1. Upload land documents và định dạng lại (Xóa bỏ trường 'status')
      const landDocumentUrls = await Promise.all(
        uploadedFiles.map(async (file) => {
          const url = await uploadToCloudinary(file);
          return {
            name: file.name,
            url: url,
            type: file.type, // Lấy loại tệp từ đối tượng File
          };
        }),
      );
      let kmlFileData: { name: string; url: string } | null = null;
      if (kmlFile) {
        const kmlUrl = await uploadToCloudinary(kmlFile);
        kmlFileData = { name: kmlFile.name, url: kmlUrl };
      }

      // 3. Lấy userId từ localStorage
      let userIdFromLocalStorage: string | null = null;
      try {
        const userData = getUserFromLocalStorage();
        if (userData?.userId) {
          userIdFromLocalStorage = userData.userId;
        }
      } catch (parseError) {
        console.error("Failed to get userId from localStorage", parseError);
      }

      // 4. Tạo đối tượng details dựa trên activeTab
      const details: any = {};
      if (activeTab === "forest") {
        details.forestLocation = formData.forestLocation;
        details.forestArea = formData.forestArea;
        details.treeSpecies = formData.treeSpecies;
        details.plantingAge = formData.plantingAge;
        details.averageHeight = formData.averageHeight;
        details.averageCircumference = formData.averageCircumference;
        details.previousDeforestation = formData.previousDeforestation;
      } else if (activeTab === "rice") {
        details.riceLocation = formData.riceLocation;
        details.riceArea = formData.riceArea;
        details.riceTerrain = formData.riceTerrain;
        details.riceClimate = formData.riceClimate;
        details.riceSoilType = formData.riceSoilType;
        details.riceStartDate = formData.riceStartDate;
        details.riceEndDate = formData.riceEndDate;
      } else if (activeTab === "biochar") {
        details.biocharRawMaterial = formData.biocharRawMaterial;
        details.biocharCarbonContent = formData.biocharCarbonContent;
        details.biocharLandArea = formData.biocharLandArea;
        details.biocharApplicationMethod = formData.biocharApplicationMethod;
      }

      // 5. Chuẩn bị dữ liệu để gửi đến backend
      const dataToSendToBackend: any = {
        name: formData.name, // Tên người đăng ký
        organization: formData.organization || undefined,
        phone: formData.phone,
        email: formData.email,
        address: formData.address || undefined,
        projectType: activeTab,
        details: details,
        status: "pending", // Trạng thái mặc định cho dự án mới đăng ký
        additionalInfo: formData.additionalInfo || undefined,
        landDocuments: landDocumentUrls, // Mảng các đối tượng LandDocument ĐÃ ĐƯỢC ĐỊNH DẠNG LẠI
        kmlFile: kmlFileData,
        userId: userIdFromLocalStorage,
      };

      console.log("Data to send to backend:", dataToSendToBackend);

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
          organization: "",
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
      alert(
        `${projectRegistrationTranslations.loadingMessages.submissionError[language]}${
          (error as Error).message ||
          projectRegistrationTranslations.loadingMessages.unknownError[language]
        }`,
      );

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
        {projectRegistrationTranslations.formTitle[language]}
      </h3>
      {isSuccess ? (
        <div className="bg-white p-8 rounded-lg shadow-md">
          {showConfetti && <ConfettiEffect isActive={showConfetti} />}
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              {projectRegistrationTranslations.successScreen.title[language]}
            </h3>
            <p className="text-gray-600">
              {projectRegistrationTranslations.successScreen.message[language]}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-lg mb-3">
              {
                projectRegistrationTranslations.successScreen.projectInfoTitle[
                  language
                ]
              }
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">
                  {
                    projectRegistrationTranslations.successScreen.projectType
                      .label[language]
                  }
                </span>
                {activeTab === "forest"
                  ? projectRegistrationTranslations.successScreen.projectType
                      .forest[language]
                  : activeTab === "rice"
                    ? projectRegistrationTranslations.successScreen.projectType
                        .rice[language]
                    : projectRegistrationTranslations.successScreen.projectType
                        .biochar[language]}
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
              {
                projectRegistrationTranslations.successScreen.nextStepsTitle[
                  language
                ]
              }
            </h4>
            <ul className="text-blue-700 space-y-1 list-disc pl-5 text-sm">
              {projectRegistrationTranslations.successScreen.nextStepsList.map(
                (item, index) => (
                  <li key={index}>{item[language]}</li>
                ),
              )}
            </ul>
          </div>
          {showLoginPrompt && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
              <h4 className="font-semibold flex items-center text-green-800 mb-2">
                <LogIn className="h-5 w-5 mr-2" />
                {
                  projectRegistrationTranslations.successScreen.loginPrompt
                    .title[language]
                }
              </h4>
              <p className="text-sm text-green-700 mb-3">
                {projectRegistrationTranslations.successScreen.loginPrompt.message[
                  language
                ](formData.email)}
              </p>
              <Button
                onClick={handleGoToLogin}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {
                  projectRegistrationTranslations.successScreen.loginPrompt
                    .loginButton[language]
                }
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
              {
                projectRegistrationTranslations.successScreen
                  .registerAnotherProjectButton[language]
              }
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
              {isAuthenticated
                ? projectRegistrationTranslations.successScreen
                    .manageAccountButton[language]
                : projectRegistrationTranslations.successScreen
                    .backToHomeButton[language]}
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
