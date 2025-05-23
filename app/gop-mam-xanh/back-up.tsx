"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import DonationForm from "@/components/donation-form";
import { Button } from "@/components/ui/button";
import ForestExplorer from "@/components/forest/ForestExplorer";
import StaticCertificate from "@/components/static-certificate";
import CertificateGenerator from "@/components/certificate-generator";
import { apiDonation } from "../fetch/fetch.donation";
import translations from "./language";
import { useLanguage } from "@/context/language-context";

export default function GopMamXanhPage() {
  const [donorName, setDonorName] = useState<string>("");
  const [donorNote, setDonorNote] = useState<string>("");
  const [treeId, setTreeId] = useState<string>("");
  const [treeCount, setTreeCount] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const { language } = useLanguage();

  const [forestStats, setForestStats] = useState<{
    treeCount: number;
    contributorCount: number;
    co2Reduction: number;
    isLoading: boolean;
  }>({
    treeCount: 0,
    contributorCount: 0,
    co2Reduction: 0,
    isLoading: true,
  });

  const [activeTab, setActiveTab] = useState<"video" | "image">("video");

  //==== Quản lý trạng thái giao dịch ====
  const [transactionStatus, setTransactionStatus] = useState<
    "idle" | "paid" | "cancelled" | "error"
  >("idle");

  //==== Cuộn trang đến phần trồng cây khi có hash URL ====
  useLayoutEffect(() => {
    if (window.location.hash === "#plant-tree-section") {
      const el = document.getElementById("plant-tree-section");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  //==== Fetch dữ liệu thống kê rừng ====
  const fetchDonation = async () => {
    setForestStats((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await apiDonation.getInfor();
      if (response.status === 200 && response.payload) {
        setForestStats({
          treeCount: response.payload.totalQuantity ?? 0,
          contributorCount: response.payload.contributorCount ?? 0,
          co2Reduction: (response.payload.totalQuantity ?? 0) * 21,
          isLoading: false,
        });
      } else {
        throw new Error("Invalid response status");
      }
    } catch (error) {
      console.error("Failed to fetch donation data:", error);
      setForestStats((prev) => ({ ...prev, isLoading: false }));
    }
  };

  //==== Xử lý tham số URL và cập nhật trạng thái giao dịch ====
  useEffect(() => {
    fetchDonation();

    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get("status");
    const orderId = queryParams.get("id");
    const orderCode = queryParams.get("orderCode");

    if (status) {
      if (status === "PAID") {
        const nameFromUrl = "Người đóng góp từ URL";
        const quantityFromUrl = 1;
        const treeIdFromUrl =
          orderCode ||
          `TC-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`;

        setDonorName(nameFromUrl);
        setTreeCount(quantityFromUrl);
        setTreeId(treeIdFromUrl);
        setTransactionStatus("paid");
        setShowCertificate(true);
        fetchDonation();
      } else if (status === "CANCELLED") {
        setTransactionStatus("cancelled");
      } else {
        setTransactionStatus("error");
      }

      const newUrl =
        window.location.origin +
        window.location.pathname +
        window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  //==== Xử lý hoàn tất quyên góp từ DonationForm ====
  const handleDonationComplete = (
    name: string,
    note?: string,
    quantity?: number,
  ) => {
    const newTreeId = `TC-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;

    setDonorName(name || "");
    setDonorNote(note || "");
    setTreeId(newTreeId);
    setTreeCount(quantity || 1);

    setTransactionStatus("paid");
    setShowCertificate(true);

    fetchDonation();
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        <div className="absolute inset-0 z-0">
          <video
            src="https://res.cloudinary.com/dyticflm3/video/upload/v1744835407/tr%E1%BB%93ng_c%C3%A2y_dfj0rl.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {translations.hero.title[language]}
          </h1>
          <p className="text-white text-lg max-w-xl">
            {translations.hero.subtitle[language]}
          </p>
        </div>
      </section>

      {/* Tropical Forest 3D Model Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {translations.communityForest.title[language]}
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              {translations.communityForest.description[language]}
            </p>
          </div>
          <div
            id="community-forest"
            className="bg-white rounded-xl shadow-xl overflow-hidden border border-emerald-100"
          >
            <div className="h-[800px] relative">
              <ForestExplorer />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-emerald-100">
              <div className="p-6 text-center border-b md:border-b-0 md:border-r border-emerald-100">
                <div className="text-3xl font-bold text-emerald-600">
                  {forestStats.isLoading ? (
                    <span className="inline-block w-16 h-8 bg-emerald-100 animate-pulse rounded"></span>
                  ) : (
                    forestStats.treeCount || 0
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {translations.communityForest.treeCount[language]}
                </div>
              </div>
              <div className="p-6 text-center border-b md:border-b-0 md:border-r border-emerald-100">
                <div className="text-3xl font-bold text-emerald-600">
                  {forestStats.isLoading ? (
                    <span className="inline-block w-12 h-8 bg-emerald-100 animate-pulse rounded"></span>
                  ) : (
                    forestStats.contributorCount || 0
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {translations.communityForest.contributorCount[language]}
                </div>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {forestStats.isLoading ? (
                    <span className="inline-block w-24 h-8 bg-emerald-100 animate-pulse rounded"></span>
                  ) : (
                    `${(forestStats.co2Reduction || 0).toLocaleString()} kg`
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {translations.communityForest.co2Reduction[language]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dự án thực tế triển khai */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-[300px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E1%BA%A2nh%20v%E1%BB%87%20tinh%20DDN%20PT.jpg-5bp15W1CYHhx4v8J1PRqFgo0H3iuwQ.jpeg"
                alt="Ảnh vệ tinh khu vực dự án"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
            <div className="relative inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {translations.projectDetails.title[language]}
              </h2>
              <p className="text-white max-w-2xl">
                {translations.projectDetails.subtitle[language]}
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-center">
                  {translations.projectDetails.technicalInfo.title[language]}
                </h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-gray-700 mb-4">
                      {translations.projectDetails.intro[language]}
                    </p>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        {
                          translations.projectDetails.environmentalImpact.title[
                            language
                          ]
                        }
                      </h4>
                      <ul className="space-y-2">
                        {translations.projectDetails.environmentalImpact.items.map(
                          (item, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-600 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{item[language]}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        {
                          translations.projectDetails.socialImpact.title[
                            language
                          ]
                        }
                      </h4>
                      <ul className="space-y-2">
                        {translations.projectDetails.socialImpact.items.map(
                          (item, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{item[language]}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative h-[120px] rounded-lg overflow-hidden">
                        <Image
                          src="https://res.cloudinary.com/dyticflm3/image/upload/v1744836233/20240915_093409_lknqhd.jpg"
                          alt={
                            translations.projectDetails.additionalImages[0]
                              .title[language]
                          }
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="relative h-[120px] rounded-lg overflow-hidden">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1730032197659.jpg-nD2t3kPh1A7zPzSkNZ1kVWYm9tVQMM.jpeg"
                          alt={
                            translations.projectDetails.additionalImages[1]
                              .title[language]
                          }
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">
                    {translations.projectDetails.technicalInfo.title[language]}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {
                          translations.projectDetails.technicalInfo.projectType
                            .label[language]
                        }
                      </p>
                      <p className="font-medium">
                        {
                          translations.projectDetails.technicalInfo.projectType
                            .value[language]
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {
                          translations.projectDetails.technicalInfo.treeSpecies
                            .label[language]
                        }
                      </p>
                      <p className="font-medium">
                        {
                          translations.projectDetails.technicalInfo.treeSpecies
                            .value[language]
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {
                          translations.projectDetails.technicalInfo
                            .plantingDensity.label[language]
                        }
                      </p>
                      <p className="font-medium">
                        {
                          translations.projectDetails.technicalInfo
                            .plantingDensity.value[language]
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {
                          translations.projectDetails.technicalInfo
                            .projectDuration.label[language]
                        }
                      </p>
                      <p className="font-medium">
                        {
                          translations.projectDetails.technicalInfo
                            .projectDuration.value[language]
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {
                          translations.projectDetails.technicalInfo
                            .standardsApplied.label[language]
                        }
                      </p>
                      <p className="font-medium">
                        {
                          translations.projectDetails.technicalInfo
                            .standardsApplied.value[language]
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {
                          translations.projectDetails.technicalInfo.sdgGoals
                            .label[language]
                        }
                      </p>
                      <p className="font-medium">
                        {
                          translations.projectDetails.technicalInfo.sdgGoals
                            .value[language]
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {translations.projectDetails.additionalImages.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                      >
                        <div className="relative h-[140px]">
                          <Image
                            src={
                              index === 0
                                ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2085.jpg-Z3cyOVYXCBpwCLMNNqO7yuhM5QU9Z4.jpeg"
                                : index === 1
                                  ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2014.jpg-CNdj11tLzOAmSHK0FXwtVTwWPXnigk.jpeg"
                                  : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2033.jpg-5ckI5Hz41LfL9Yc7raxiNZDaLkirlD.jpeg"
                            }
                            alt={item.title[language]}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h5 className="font-medium text-sm mb-1">
                            {item.title[language]}
                          </h5>
                          <p className="text-xs text-gray-600">
                            {item.description[language]}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
                  onClick={() => {
                    const donationSection =
                      document.getElementById("plant-tree-section");
                    if (donationSection) {
                      donationSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3Z"></path>
                    <path d="M10 8V5a2 2 0 1 1 4 0v3"></path>
                    <path d="M8 17.5a6 6 0 0 0 8 0"></path>
                    <path d="M18 12h.01"></path>
                    <path d="M6 12h.01"></path>
                  </svg>
                  {translations.projectDetails.contributeButton[language]}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Model Visualization Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {translations.modelSection.title[language]}
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              {translations.modelSection.description[language]}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="aspect-video w-full h-[600px] relative">
              <div className="absolute top-0 left-0 right-0 h-[50px] z-10 bg-emerald-900 pointer-events-none"></div>

              <div className="sketchfab-embed-wrapper w-full h-full">
                <div className="sketchfab-embed-wrapper w-full h-full">
                  <iframe
                    {...({
                      title: "Levé LiDAR IGN des Carrières de Junas",
                      frameBorder: "0",
                      allowFullScreen: true,
                      mozallowfullscreen: "true",
                      webkitallowfullscreen: "true",
                      allow: "autoplay; fullscreen; xr-spatial-tracking",
                      "xr-spatial-tracking": "true",
                      "execution-while-out-of-viewport": "true",
                      "execution-while-not-rendered": "true",
                      "web-share": "true",
                      src: "https://sketchfab.com/models/ded2fbbc694542dfb691d2f08b466163/embed?autostart=1",
                      className: "w-full h-full",
                    } as any)}
                  />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[50px] z-10 bg-emerald-900 pointer-events-none"></div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                {translations.modelSection.caption[language]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mục tiêu trồng cây */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {translations.plantingGoals.title[language]}
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              {translations.plantingGoals.description[language]}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">
                {translations.plantingGoals.progress[language]}
              </span>
              <span className="font-semibold text-gray-700">
                {forestStats.isLoading
                  ? "..."
                  : `${forestStats.treeCount}/10,000`}
                <span className="text-sm text-gray-500 ml-1">
                  (
                  {forestStats.isLoading
                    ? "..."
                    : `${((forestStats.treeCount / 10000) * 100).toFixed(1)}%`}
                  )
                </span>
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${
                    forestStats.isLoading
                      ? 0
                      : (forestStats.treeCount / 10000) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      <section id="plant-tree-section" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {translations.plantTreeSection.title[language]}
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              {translations.plantTreeSection.description[language]}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Cột bên trái: Hiển thị form hoặc thông báo/chứng nhận */}
            <div>
              {/*==== Hiển thị thông báo hủy giao dịch ====*/}
              {transactionStatus === "cancelled" ? (
                <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center shadow-md">
                  <h3 className="text-xl font-semibold text-red-800 mb-4">
                    Đơn quyên góp đã bị hủy.
                  </h3>
                  <p className="text-red-700 mb-6">
                    Rất tiếc, giao dịch của bạn đã bị hủy hoặc không thành công.
                    Vui lòng thử lại sau.
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm"
                    onClick={() => {
                      setTransactionStatus("idle");
                      setDonorName("");
                    }}
                  >
                    Thử lại
                  </Button>
                </div>
              ) : /*==== Hiển thị thông báo thành công và chứng nhận hoặc form quyên góp ====*/
              transactionStatus === "paid" && donorName ? (
                <div className="space-y-8">
                  {/* Phần thông báo thành công */}
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200 shadow-md">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-500 rounded-full p-2 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-green-800">
                        {
                          translations.plantTreeSection.donationSuccess.title[
                            language
                          ]
                        }
                      </h3>
                    </div>
                    <p className="text-green-700 mb-6">
                      {translations.plantTreeSection.donationSuccess.message[
                        language
                      ](donorName, treeCount, treeId)}
                    </p>

                    <div className="flex justify-center">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-sm"
                        onClick={() => {
                          const certificateSection = document.getElementById(
                            "certificate-section",
                          );
                          if (certificateSection) {
                            certificateSection.scrollIntoView({
                              behavior: "smooth",
                            });
                          }
                        }}
                      >
                        {
                          translations.plantTreeSection.donationSuccess
                            .viewCertificateButton[language]
                        }
                      </Button>
                    </div>
                  </div>

                  {/* Phần chứng nhận */}
                  <div
                    id="certificate-section"
                    className="bg-white p-6 rounded-lg border border-gray-200 shadow-md"
                  >
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-center mb-6">
                        {
                          translations.plantTreeSection.certificateSection
                            .title[language]
                        }
                      </h3>

                      <div className="space-y-8">
                        <div className="border-b border-gray-200">
                          <nav className="flex -mb-px" aria-label="Tabs">
                            <button
                              onClick={() => setActiveTab("video")}
                              className={`py-2 px-4 text-center border-b-2 font-medium text-sm flex-1 ${
                                activeTab === "video"
                                  ? "border-green-500 text-green-600"
                                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 inline-block mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                <rect
                                  x="1"
                                  y="5"
                                  width="15"
                                  height="14"
                                  rx="2"
                                  ry="2"
                                ></rect>
                              </svg>
                              {
                                translations.plantTreeSection.certificateSection
                                  .videoTab[language]
                              }
                            </button>
                            <button
                              onClick={() => setActiveTab("image")}
                              className={`py-2 px-4 text-center border-b-2 font-medium text-sm flex-1 ${
                                activeTab === "image"
                                  ? "border-green-500 text-green-600"
                                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 inline-block mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                              {
                                translations.plantTreeSection.certificateSection
                                  .imageTab[language]
                              }
                            </button>
                          </nav>
                        </div>

                        <div
                          className={activeTab === "video" ? "block" : "hidden"}
                        >
                          <h4 className="text-xl font-semibold mb-4 text-center">
                            {
                              translations.plantTreeSection.certificateSection
                                .videoTab[language]
                            }
                          </h4>
                          <div className="bg-white rounded-lg overflow-hidden">
                            <CertificateGenerator
                              name={donorName}
                              treeCount={treeCount}
                              treeId={treeId}
                              note={donorNote || undefined}
                            />
                          </div>
                        </div>

                        <div
                          className={activeTab === "image" ? "block" : "hidden"}
                        >
                          <h4 className="text-xl font-semibold mb-4 text-center">
                            {
                              translations.plantTreeSection.certificateSection
                                .imageTab[language]
                            }
                          </h4>
                          <div id="static-certificate">
                            <StaticCertificate
                              name={donorName}
                              treeCount={treeCount}
                              treeId={treeId}
                              note={donorNote || undefined}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <DonationForm onDonationComplete={handleDonationComplete} />
              )}
            </div>

            {/* Cột bên phải: Thông tin dự án (giữ nguyên) */}
            <div>
              <h3 className="text-2xl font-bold mb-6">
                {translations.plantTreeSection.aboutProject.title[language]}
              </h3>

              <div className="space-y-6">
                <p>
                  {
                    translations.plantTreeSection.aboutProject.description[
                      language
                    ]
                  }
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-lg mb-2">
                      {
                        translations.plantTreeSection.aboutProject
                          .co2Equivalent[language]
                      }
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {
                        translations.plantTreeSection.aboutProject.co2Amount[
                          language
                        ]
                      }
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {
                        translations.plantTreeSection.aboutProject.co2Caption[
                          language
                        ]
                      }
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-lg mb-2">
                      {
                        translations.plantTreeSection.aboutProject.plantedTrees[
                          language
                        ]
                      }
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {forestStats.isLoading ? (
                        <span className="inline-block w-16 h-8 bg-emerald-100 animate-pulse rounded"></span>
                      ) : (
                        forestStats.treeCount || 0
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {translations.plantingGoals.units[language]}
                    </div>
                  </div>
                </div>

                <div className="relative h-[200px] rounded-lg overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/dyticflm3/image/upload/v1744836233/20240915_093409_lknqhd.jpg"
                    alt="Hoạt động trồng cây"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-2">
                    {
                      translations.plantTreeSection.aboutProject.benefitsTitle[
                        language
                      ]
                    }
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {translations.plantTreeSection.aboutProject.benefitsList.map(
                      (item, index) => (
                        <li key={index}>{item[language]}</li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {translations.faqSection.title[language]}
            </h2>
          </div>

          <div className="space-y-6">
            {[
              translations.faqSection.q1,
              translations.faqSection.q2,
              translations.faqSection.q3,
              translations.faqSection.q4,
            ].map((faqItem, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2">
                  {faqItem.question[language]}
                </h3>
                <p className="text-gray-600">{faqItem.answer[language]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
