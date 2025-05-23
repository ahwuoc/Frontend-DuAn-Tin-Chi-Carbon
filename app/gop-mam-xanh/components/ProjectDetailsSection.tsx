// components/ProjectDetailsSection.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import translations from "@/app/gop-mam-xanh/language"; // Import translations từ thư mục gốc

export default function ProjectDetailsSection() {
  const { language } = useLanguage();

  return (
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
            {/* Đã sửa lỗi JSX ở đây */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {translations.projectDetails.title[language]}
              </h2>
              <p className="text-white max-w-2xl">
                {translations.projectDetails.subtitle[language]}
              </p>
            </div>
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
                      {translations.projectDetails.socialImpact.title[language]}
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
                          translations.projectDetails.additionalImages[0].title[
                            language
                          ]
                        }
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-[120px] rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1730032197659.jpg-nD2t3kPh1A7zPzSkNZ1kVWYm9tVQMM.jpeg"
                        alt={
                          translations.projectDetails.additionalImages[1].title[
                            language
                          ]
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
  );
}
