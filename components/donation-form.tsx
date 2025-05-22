"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";
import { apiDonation } from "@/app/fetch/fetch.donation";
import { useToast } from "./ui/use-toast";
import { useLanguage } from "@/context/language-context";
import donationFormTranslations from "./language-gopcay/donation-form-language";

interface DonationFormProps {
  onDonationComplete: (name: string, note?: string, quantity?: number) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  quantity: number;
  note: string;
}

export default function DonationForm({
  onDonationComplete,
}: DonationFormProps) {
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    quantity: 1,
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const pricePerTree = 55000; // Giá mỗi cây (VND)
  const currency = "VND"; // Có thể chuyển thành dịch thuật nếu cần
  const totalAmount = pricePerTree * formData.quantity;

  const bankInfo = {
    accountName: "CTY CP TM & ĐT TÍN CHỈ CARBON VN",
    accountNumber: "686820248888",
    bank: "MB Bank",
    branch: "Chi nhánh Hà Nội",
    content: `GOP XANH - ${formData.name || ""} - ${formData.quantity}${
      formData.note ? ` - NOTE: ${formData.note}` : ""
    }`.trim(),
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim())
      newErrors.name = donationFormTranslations.formStep1.nameError[language];
    if (!formData.email.trim())
      newErrors.email = donationFormTranslations.formStep1.emailError[language];
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email =
        donationFormTranslations.formStep1.emailInvalidError[language];
    if (!formData.phone.trim())
      newErrors.phone = donationFormTranslations.formStep1.phoneError[language];

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep(2);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePaymentComplete = async () => {
    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        totalAmount,
        bankInfo,
      };
      const response = await apiDonation.addDonate(data);
      if (response && response.payload) {
        toast({
          title: donationFormTranslations.toastMessages.errorTitle[language],
          description:
            donationFormTranslations.toastMessages.errorMessage[language],
          variant: "default",
        });
      }
      setTimeout(() => {
        setIsSubmitting(false);
        onDonationComplete(formData.name, formData.note, formData.quantity);
        setStep(1);
        setFormData({
          name: "",
          email: "",
          phone: "",
          quantity: 1,
          note: "",
        });
      }, 1500);
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: donationFormTranslations.toastMessages.errorTitle[language],
        description:
          donationFormTranslations.toastMessages.errorMessage[language],
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        id === "quantity" ? Math.max(1, Number.parseInt(value) || 1) : value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-green-100">
      <h3 className="text-xl font-semibold mb-4">
        {donationFormTranslations.formTitle[language]}
      </h3>

      {step === 1 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {donationFormTranslations.formStep1.nameLabel[language]}
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder={
                donationFormTranslations.formStep1.namePlaceholder[language]
              }
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {donationFormTranslations.formStep1.emailLabel[language]}
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder={
                donationFormTranslations.formStep1.emailPlaceholder[language]
              }
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {donationFormTranslations.formStep1.phoneLabel[language]}
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder={
                donationFormTranslations.formStep1.phonePlaceholder[language]
              }
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {donationFormTranslations.formStep1.quantityLabel[language]}
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Math.max(1, prev.quantity - 1),
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                className="w-16 px-3 py-2 border-t border-b border-gray-300 text-center focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: prev.quantity + 1,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {donationFormTranslations.formStep1.noteLabel[language]}
            </label>
            <textarea
              id="note"
              value={formData.note}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={
                donationFormTranslations.formStep1.notePlaceholder[language]
              }
              rows={2}
            />
            <p className="mt-1 text-xs text-gray-500">
              {donationFormTranslations.formStep1.noteHint[language]}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {donationFormTranslations.formStep1.pricePerTree[language]}
              </span>
              <span>
                {pricePerTree.toLocaleString()} {currency}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2 text-lg font-semibold">
              <span>
                {donationFormTranslations.formStep1.totalAmount[language]}
              </span>
              <span className="text-green-700">
                {totalAmount.toLocaleString()} {currency}
              </span>
            </div>
          </div>

          <div className="mt-4 border border-gray-200 rounded-md p-4">
            <h4 className="font-semibold mb-2">
              {
                donationFormTranslations.formStep1.transferContentTitle[
                  language
                ]
              }
            </h4>
            <div className="flex items-center bg-gray-50 p-2 rounded border border-gray-300">
              <span className="flex-grow font-mono text-sm">
                {bankInfo.content}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(bankInfo.content, "transferContent")}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                {copied === "transferContent" ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {donationFormTranslations.formStep1.transferContentHint[language]}
            </p>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
            >
              {donationFormTranslations.formStep1.continueButton[language]}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-semibold text-center mb-2">
              {donationFormTranslations.formStep2.donationInfoTitle[language]}
            </h4>
            <div className="flex justify-between items-center mt-2 text-lg font-semibold">
              <span>
                {donationFormTranslations.formStep1.totalAmount[language]}
              </span>
              <span className="text-green-700">
                {totalAmount.toLocaleString()} {currency}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {donationFormTranslations.formStep2.donationQuantityText[
                language
              ](formData.quantity)}
            </div>
          </div>

          <div className="border border-gray-200 rounded-md p-4">
            <h4 className="font-semibold mb-3">
              {donationFormTranslations.formStep2.bankInfoTitle[language]}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {
                    donationFormTranslations.formStep2.accountNameLabel[
                      language
                    ]
                  }
                </span>
                <div className="flex items-center">
                  <span className="font-medium">{bankInfo.accountName}</span>
                  <button
                    onClick={() =>
                      handleCopy(bankInfo.accountName, "accountName")
                    }
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    {copied === "accountName" ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {
                    donationFormTranslations.formStep2.accountNumberLabel[
                      language
                    ]
                  }
                </span>
                <div className="flex items-center">
                  <span className="font-medium">{bankInfo.accountNumber}</span>
                  <button
                    onClick={() =>
                      handleCopy(bankInfo.accountNumber, "accountNumber")
                    }
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    {copied === "accountNumber" ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {donationFormTranslations.formStep2.bankLabel[language]}
                </span>
                <span className="font-medium">{bankInfo.bank}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {donationFormTranslations.formStep2.branchLabel[language]}
                </span>
                <span className="font-medium">{bankInfo.branch}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {donationFormTranslations.formStep2.contentLabel[language]}
                </span>
                <div className="flex items-center">
                  <span className="font-medium">{bankInfo.content}</span>
                  <button
                    onClick={() => handleCopy(bankInfo.content, "content")}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    {copied === "content" ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="font-semibold mb-3">
              {donationFormTranslations.formStep2.qrScanTitle[language]}
            </h4>
            <div className="relative w-48 h-48 border border-gray-200 rounded-md overflow-hidden">
              <Image
                src="https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Mã%20QR%20chuyển%20khoản-S2p7m4uIA5xpn7Kywu1pCYtHz7giui.jpg"
                alt="QR Payment" // Alt text cũng nên được dịch.
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {donationFormTranslations.formStep2.qrScanHint[language]}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handlePaymentComplete}
              disabled={isSubmitting}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {
                    donationFormTranslations.formStep2.processingButton[
                      language
                    ]
                  }
                </span>
              ) : (
                <span>
                  {donationFormTranslations.formStep2.completeButton[language]}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>{donationFormTranslations.agreementText[language]}</p>
      </div>
    </div>
  );
}
