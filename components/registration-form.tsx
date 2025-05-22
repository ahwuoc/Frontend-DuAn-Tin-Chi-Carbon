"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRightCircle, CheckCircle, Loader2 } from "lucide-react";
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
import Link from "next/link";
import { useLanguage } from "@/context/language-context"; // Import useLanguage hook
import registrationFormTranslations from "./langauge-form/langauge-form";

export default function RegistrationForm() {
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại
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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      const fieldValue = formData[field as keyof TFormData];
      if (typeof fieldValue === "string" && !fieldValue.trim()) {
        errors[field] = registrationFormTranslations.requiredField[language](
          getFieldLabel(field),
        );
      } else if (typeof fieldValue !== "string" && !fieldValue) {
        errors[field] = registrationFormTranslations.requiredField[language](
          getFieldLabel(field),
        );
      }
    });
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email = registrationFormTranslations.invalidEmail[language];
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldLabel = (fieldName: string): string => {
    const labels: Record<string, string> = {
      name: registrationFormTranslations.nameLabel[language],
      age: registrationFormTranslations.ageLabel[language],
      location: registrationFormTranslations.locationLabel[language],
      area:
        formData.consultationType === "forest"
          ? registrationFormTranslations.areaLabelForest[language]
          : registrationFormTranslations.areaLabelAgriculture[language],
      phone: registrationFormTranslations.phoneLabel[language],
      email: registrationFormTranslations.emailLabel[language],
      message: registrationFormTranslations.messageLabel[language],
      consultationType:
        registrationFormTranslations.consultationTypeLabel[language],
      organization: registrationFormTranslations.organizationLabel[language],
      position: registrationFormTranslations.positionLabel[language],
      experience: registrationFormTranslations.experienceLabel[language],
      education: registrationFormTranslations.educationLabel[language],
      projectType: registrationFormTranslations.projectTypeLabel[language],
      projectSize: registrationFormTranslations.projectSizeLabel[language],
      projectLocation:
        registrationFormTranslations.projectLocationLabel[language],
      implementationTimeline:
        registrationFormTranslations.implementationTimelineLabel[language], // Make sure this key exists in translations
      budget: registrationFormTranslations.budgetLabel[language], // Make sure this key exists in translations
      carbonGoals: registrationFormTranslations.carbonGoalsLabel[language],
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
            title: registrationFormTranslations.successMessage.title[language],
            description:
              registrationFormTranslations.successMessage.description[language],
            variant: "default",
          });
        }, 5000);
      } else {
        toast({
          title: registrationFormTranslations.failureMessage.title[language],
          description:
            registrationFormTranslations.failureMessage.description[language],
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: registrationFormTranslations.failureMessage.title[language],
        description:
          registrationFormTranslations.failureMessage.description[language],
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
                  {registrationFormTranslations.ageLabel[language]}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder={
                    registrationFormTranslations.agePlaceholder[language]
                  }
                  className={`border-2 py-6 ${
                    formErrors.age
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                />
                {formErrors.age && (
                  <p className="text-red-500 text-sm">{formErrors.age}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">
                  {registrationFormTranslations.locationLabel[language]}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={
                    registrationFormTranslations.locationPlaceholder[language]
                  }
                  className={`border-2 py-6 ${
                    formErrors.location
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm">{formErrors.location}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area" className="text-gray-700 font-medium">
                {registrationFormTranslations.areaLabelForest[language]}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder={
                  registrationFormTranslations.areaPlaceholderForest[language]
                }
                className={`border-2 py-6 ${
                  formErrors.area
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
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
                {registrationFormTranslations.locationLabel[language]}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={
                  registrationFormTranslations.locationPlaceholder[language]
                }
                className={`border-2 py-6 ${
                  formErrors.location
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {formErrors.location && (
                <p className="text-red-500 text-sm">{formErrors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area" className="text-gray-700 font-medium">
                {registrationFormTranslations.areaLabelAgriculture[language]}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder={
                  registrationFormTranslations.areaPlaceholderAgriculture[
                    language
                  ]
                }
                className={`border-2 py-6 ${
                  formErrors.area
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {formErrors.area && (
                <p className="text-red-500 text-sm">{formErrors.area}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="projectType"
                className="text-gray-700 font-medium"
              >
                {registrationFormTranslations.projectTypeLabel[language]}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                placeholder={
                  registrationFormTranslations.projectTypePlaceholder[language]
                }
                className={`border-2 py-6 ${
                  formErrors.projectType
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
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
              <Label
                htmlFor="organization"
                className="text-gray-700 font-medium"
              >
                {registrationFormTranslations.organizationLabel[language]}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder={
                  registrationFormTranslations.organizationPlaceholder[language]
                }
                className={`border-2 py-6 ${
                  formErrors.organization
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {formErrors.organization && (
                <p className="text-red-500 text-sm">
                  {formErrors.organization}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="projectSize"
                className="text-gray-700 font-medium"
              >
                {registrationFormTranslations.projectSizeLabel[language]}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="projectSize"
                name="projectSize"
                value={formData.projectSize}
                onChange={handleChange}
                placeholder={
                  registrationFormTranslations.projectSizePlaceholder[language]
                }
                className={`border-2 py-6 ${
                  formErrors.projectSize
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {formErrors.projectSize && (
                <p className="text-red-500 text-sm">{formErrors.projectSize}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="projectLocation"
                className="text-gray-700 font-medium"
              >
                {registrationFormTranslations.projectLocationLabel[language]}
              </Label>
              <Input
                id="projectLocation"
                name="projectLocation"
                value={formData.projectLocation}
                onChange={handleChange}
                placeholder={
                  registrationFormTranslations.projectLocationPlaceholder[
                    language
                  ]
                }
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
                {registrationFormTranslations.educationLabel[language]}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className={`w-full border-2 py-3 px-4 rounded-md ${
                  formErrors.education
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              >
                <option value="">
                  {registrationFormTranslations.educationLabel[language]}
                </option>
                <option value="high_school">
                  {
                    registrationFormTranslations.educationOptions.highSchool[
                      language
                    ]
                  }
                </option>
                <option value="college">
                  {
                    registrationFormTranslations.educationOptions.college[
                      language
                    ]
                  }
                </option>
                <option value="bachelor">
                  {
                    registrationFormTranslations.educationOptions.bachelor[
                      language
                    ]
                  }
                </option>
                <option value="master">
                  {
                    registrationFormTranslations.educationOptions.master[
                      language
                    ]
                  }
                </option>
                <option value="phd">
                  {registrationFormTranslations.educationOptions.phd[language]}
                </option>
              </select>
              {formErrors.education && (
                <p className="text-red-500 text-sm">{formErrors.education}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-700 font-medium">
                {registrationFormTranslations.experienceLabel[language]}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full border-2 py-3 px-4 rounded-md ${
                  formErrors.experience
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              >
                <option value="">
                  {registrationFormTranslations.experienceLabel[language]}
                </option>
                <option value="none">
                  {
                    registrationFormTranslations.experienceOptions.none[
                      language
                    ]
                  }
                </option>
                <option value="less_than_1">
                  {
                    registrationFormTranslations.experienceOptions.lessThan1[
                      language
                    ]
                  }
                </option>
                <option value="1_to_3">
                  {
                    registrationFormTranslations.experienceOptions["1To3"][
                      language
                    ]
                  }
                </option>
                <option value="3_to_5">
                  {
                    registrationFormTranslations.experienceOptions["3To5"][
                      language
                    ]
                  }
                </option>
                <option value="more_than_5">
                  {
                    registrationFormTranslations.experienceOptions.moreThan5[
                      language
                    ]
                  }
                </option>
              </select>
              {formErrors.experience && (
                <p className="text-red-500 text-sm">{formErrors.experience}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="organization"
                className="text-gray-700 font-medium"
              >
                {registrationFormTranslations.organizationLabel[language]}
              </Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder={
                  registrationFormTranslations.organizationPlaceholder[language]
                }
                className="border-2 py-6 border-gray-200 focus:border-green-500"
              />
            </div>
          </>
        );

      case "carbonbook":
        return (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="organization"
                className="text-gray-700 font-medium"
              >
                {registrationFormTranslations.organizationLabel[language]}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder={
                  registrationFormTranslations.organizationPlaceholder[language]
                }
                className={`border-2 py-6 ${
                  formErrors.organization
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {formErrors.organization && (
                <p className="text-red-500 text-sm">
                  {formErrors.organization}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-gray-700 font-medium">
                {registrationFormTranslations.positionLabel[language]}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder={
                  registrationFormTranslations.positionPlaceholder[language]
                }
                className={`border-2 py-6 ${
                  formErrors.position
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {formErrors.position && (
                <p className="text-red-500 text-sm">{formErrors.position}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="carbonGoals"
                className="text-gray-700 font-medium"
              >
                {registrationFormTranslations.carbonGoalsLabel[language]}
              </Label>
              <Textarea
                id="carbonGoals"
                name="carbonGoals"
                value={formData.carbonGoals}
                onChange={handleChange}
                placeholder={
                  registrationFormTranslations.carbonGoalsPlaceholder[language]
                }
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
              {registrationFormTranslations.messageLabel[language]}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={
                registrationFormTranslations.messagePlaceholder[language]
              }
              rows={5}
              className={`border-2 ${
                formErrors.message
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              } resize-none`}
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
      <form onSubmit={handleSubmit} className="space-y-5 ">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          {registrationFormTranslations.formTitle[language]}
        </h3>
        <div className="flex">
          <Link
            href="/san-pham/du-an-tin-chi-carbon#dang-ky-du-an"
            className="flex items-start justify-center space-x-1"
          >
            <p className="text-sm text-gray-600">
              {registrationFormTranslations.orRegisterProject[language]}
            </p>
          </Link>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="consultationType"
            className="text-gray-700 font-medium"
          >
            {registrationFormTranslations.consultationTypeLabel[language]}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <select
            id="consultationType"
            name="consultationType"
            value={formData.consultationType}
            onChange={handleChange}
            className={`w-full border-2 py-3 px-4 rounded-md ${
              formErrors.consultationType
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-green-500"
            }`}
          >
            <option value="forest">
              {
                registrationFormTranslations.consultationTypeOptions.forest[
                  language
                ]
              }
            </option>
            <option value="agriculture">
              {
                registrationFormTranslations.consultationTypeOptions
                  .agriculture[language]
              }
            </option>
            <option value="biochar">
              {
                registrationFormTranslations.consultationTypeOptions.biochar[
                  language
                ]
              }
            </option>
            <option value="csu">
              {
                registrationFormTranslations.consultationTypeOptions.csu[
                  language
                ]
              }
            </option>
            <option value="carbonbook">
              {
                registrationFormTranslations.consultationTypeOptions.carbonbook[
                  language
                ]
              }
            </option>
            <option value="other">
              {
                registrationFormTranslations.consultationTypeOptions.other[
                  language
                ]
              }
            </option>
          </select>
          {formErrors.consultationType && (
            <p className="text-red-500 text-sm">
              {formErrors.consultationType}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 font-medium">
            {registrationFormTranslations.nameLabel[language]}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={registrationFormTranslations.namePlaceholder[language]}
            className={`border-2 py-6 ${
              formErrors.name
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-green-500"
            }`}
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm">{formErrors.name}</p>
          )}
        </div>

        {renderConsultationTypeFields()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 font-medium">
              {registrationFormTranslations.phoneLabel[language]}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={
                registrationFormTranslations.phonePlaceholder[language]
              }
              className={`border-2 py-6 ${
                formErrors.phone
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
            />
            {formErrors.phone && (
              <p className="text-red-500 text-sm">{formErrors.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              {registrationFormTranslations.emailLabel[language]}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={
                registrationFormTranslations.emailPlaceholder[language]
              }
              className={`border-2 py-6 ${
                formErrors.email
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>
        </div>

        {formData.consultationType !== "other" && (
          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-700 font-medium">
              {registrationFormTranslations.messageLabel[language]}
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={
                registrationFormTranslations.messagePlaceholder[language]
              }
              rows={4}
              className="border-2 border-gray-200 focus:border-green-500 resize-none"
            />
          </div>
        )}

        <div className="flex justify-between items-start space-x-2 py-2">
          <div className="flex">
            <div className="bg-green-100 p-1 rounded-full mt-0.5">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">
              {registrationFormTranslations.privacyCommitment[language]}
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
              {registrationFormTranslations.submittingButton[language]}
            </>
          ) : (
            registrationFormTranslations.submitButton[language]
          )}
        </Button>

        {isSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p>
              {
                registrationFormTranslations.successMessage.description[
                  language
                ]
              }
            </p>
          </div>
        )}

        <ConfettiEffect isActive={showConfetti} />
      </form>

      {/* Modal for unauthenticated users */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] p-6">
          <DialogHeader>
            <DialogTitle>
              {registrationFormTranslations.modal.title[language]}
            </DialogTitle>
            <DialogDescription>
              {registrationFormTranslations.modal.description[language]}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-4 mt-4">
            <Button
              onClick={() => {
                router.push("/dang-nhap"); // Replace with your actual login route
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {registrationFormTranslations.modal.loginButton[language]}
            </Button>
            <Button
              onClick={() => {
                router.push("/dang-ky"); // Replace with your actual register route
              }}
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50"
            >
              {registrationFormTranslations.modal.registerButton[language]}
            </Button>
            <Button
              onClick={() => {
                setIsModalOpen(false);
                // Optionally allow submission without auth, but note it won't be tracked
                handleSubmit(
                  new Event(
                    "submit",
                  ) as unknown as React.FormEvent<HTMLFormElement>,
                ); // Trigger submit again, but skip auth check
              }}
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700"
            >
              {
                registrationFormTranslations.modal.continueWithoutLogin[
                  language
                ]
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
