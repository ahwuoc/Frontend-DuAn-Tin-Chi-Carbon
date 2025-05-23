// components/PlantTreeActionSection.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import DonationForm from "@/components/donation-form";
import StaticCertificate from "@/components/static-certificate";
import CertificateGenerator from "@/components/certificate-generator";
import { useLanguage } from "@/context/language-context";
import translations from "@/app/gop-mam-xanh/language"; // Import translations từ thư mục gốc
import { RefObject, useState } from "react";

interface PlantTreeActionSectionProps {
  donorName: string;
  donorNote: string;
  treeId: string;
  treeCount: number;
  transactionStatus: "idle" | "paid" | "cancelled" | "error";
  sectionRef: RefObject<HTMLDivElement>;
  forestStatsIsLoading: boolean; // Để hiển thị loading cho stats trong section này
  onDonationComplete: (name: string, note?: string, quantity?: number) => void;
  setTransactionStatus: React.Dispatch<
    React.SetStateAction<"idle" | "paid" | "cancelled" | "error">
  >; // Thêm prop này để có thể reset trạng thái từ nút "Thử lại"
}

export default function PlantTreeActionSection({
  donorName,
  donorNote,
  treeId,
  treeCount,
  transactionStatus,
  forestStatsIsLoading,
  onDonationComplete,
  sectionRef,
  setTransactionStatus, // nhận từ props
}: PlantTreeActionSectionProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"video" | "image">("video"); // state này chỉ cần trong component này

  return (
    <section id="plant-tree-section" ref={sectionRef} className="py-16 px-4">
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
                    setTransactionStatus("idle"); // Reset trạng thái để hiển thị form lại
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
                        translations.plantTreeSection.certificateSection.title[
                          language
                        ]
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
              <DonationForm onDonationComplete={onDonationComplete} />
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
                      translations.plantTreeSection.aboutProject.co2Equivalent[
                        language
                      ]
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
                    {forestStatsIsLoading ? (
                      <span className="inline-block w-16 h-8 bg-emerald-100 animate-pulse rounded"></span>
                    ) : (
                      // treeCount này là của forestStats.treeCount, không phải treeCount của prop
                      // có thể cần điều chỉnh prop hoặc lấy trực tiếp từ forestStats ở page.tsx
                      treeCount || 0
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
  );
}
