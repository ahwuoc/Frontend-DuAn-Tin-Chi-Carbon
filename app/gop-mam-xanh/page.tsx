"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DonationForm from "@/components/donation-form";
import { Button } from "@/components/ui/button";
import ForestExplorer from "@/components/forest/ForestExplorer";
import StaticCertificate from "@/components/static-certificate";
import CertificateGenerator from "@/components/certificate-generator";
import { apiDonation } from "../fetch/fetch.donation";

export default function GopMamXanhPage() {
  const [donorName, setDonorName] = useState<string>("");
  const [donorNote, setDonorNote] = useState<string>("");
  const [treeId, setTreeId] = useState<string>("");
  const [treeCount, setTreeCount] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
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

  const fetchDonation = async () => {
    setForestStats((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await apiDonation.getInfor();
      if (response.status === 200 && response.data) {
        setForestStats({
          treeCount: response.data.totalQuantity ?? 0,
          contributorCount: response.data.contributorCount ?? 0,
          co2Reduction: (response.data.totalQuantity ?? 0) * 21,
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

  useEffect(() => {
    fetchDonation();
  }, []);

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
    setShowCertificate(true);
    fetchDonation();
  };

  return (
    <main className="min-h-screen">
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
            Góp Mầm Xanh
          </h1>
          <p className="text-white text-lg max-w-xl">
            Cùng chung tay góp cây xanh cho xã hội, vì một tương lai bền vững.
          </p>
        </div>
      </section>

      {/* Tropical Forest 3D Model Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Rừng cộng đồng</h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              Khám phá khu rừng cộng đồng đang phát triển với những tác động
              thật sự lên các dự án phủ xanh tại Việt Nam.
            </p>
          </div>
          <div
            id="community-forest"
            className="bg-white rounded-xl shadow-xl overflow-hidden border border-emerald-100"
          >
            <div className="h-[800px] relative">
              {/* Model 3D */}
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
                <div className="text-sm text-gray-500 mt-1">Cây đã trồng</div>
              </div>
              <div className="p-6 text-center border-b md:border-b-0 md:border-r border-emerald-100">
                <div className="text-3xl font-bold text-emerald-600">
                  {forestStats.isLoading ? (
                    <span className="inline-block w-12 h-8 bg-emerald-100 animate-pulse rounded"></span>
                  ) : (
                    forestStats.contributorCount || 0
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">Người đóng góp</div>
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
                  CO₂ giảm thiểu mỗi năm
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Dự án thực tế triển khai
                </h2>
                <p className="text-white max-w-2xl">
                  Dự án trồng rừng 21 hecta tại xã Cự Đồng, huyện Thanh Sơn,
                  tỉnh Phú Thọ - Mã dự án: TCCV_VN_19_001
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-center">
                  Thông tin chi tiết dự án
                </h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-gray-700 mb-4">
                      Dự án trồng rừng bền vững tại Cự Đồng được triển khai bởi
                      Carbon Credits Vietnam với sự hợp tác của chính quyền địa
                      phương và cộng đồng dân cư. Dự án không chỉ giúp phủ xanh
                      đất trống đồi núi trọc mà còn tạo sinh kế bền vững cho
                      người dân địa phương.
                    </p>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Tác động môi trường
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
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
                          <span>
                            Hấp thụ 1.292 tấn CO₂ mỗi năm, góp phần giảm thiểu
                            biến đổi khí hậu
                          </span>
                        </li>
                        <li className="flex items-start">
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
                          <span>
                            Ngăn chặn xói mòn đất và cải thiện chất lượng nguồn
                            nước
                          </span>
                        </li>
                        <li className="flex items-start">
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
                          <span>
                            Tăng cường đa dạng sinh học với các loài cây bản địa
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Tác động xã hội
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
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
                          <span>
                            Tạo ra 50 việc làm ổn định cho người dân địa phương
                            mỗi năm
                          </span>
                        </li>
                        <li className="flex items-start">
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
                          <span>
                            Tăng thu nhập bình quân hộ gia đình lên 30% thông
                            qua các hoạt động lâm nghiệp bền vững
                          </span>
                        </li>
                        <li className="flex items-start">
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
                          <span>
                            Đào tạo kỹ thuật lâm nghiệp bền vững cho hơn 200
                            người dân địa phương
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative h-[120px] rounded-lg overflow-hidden">
                        <Image
                          src="https://res.cloudinary.com/dyticflm3/image/upload/v1744836233/20240915_093409_lknqhd.jpg"
                          alt="Đội ngũ dự án"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="relative h-[120px] rounded-lg overflow-hidden">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1730032197659.jpg-nD2t3kPh1A7zPzSkNZ1kVWYm9tVQMM.jpeg"
                          alt="Lễ ký kết giữa Kiểm lâm địa phương và đơn vị"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">
                    Thông tin kỹ thuật dự án
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Loại dự án</p>
                      <p className="font-medium">Tái trồng rừng (ARR)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loại cây trồng</p>
                      <p className="font-medium">
                        Gù Hương (Cinnamomum Parthenoxylon) và Thông
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mật độ trồng</p>
                      <p className="font-medium">1.100 cây/hecta</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Thời gian dự án</p>
                      <p className="font-medium">40 năm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Tiêu chuẩn áp dụng
                      </p>
                      <p className="font-medium">
                        ARR Carbon Whitepaper - Version 1, 2023
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Mục tiêu phát triển bền vững
                      </p>
                      <p className="font-medium">SDG 13, 15, 1, 4</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div className="relative h-[140px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2085.jpg-Z3cyOVYXCBpwCLMNNqO7yuhM5QU9Z4.jpeg"
                        alt="Hệ thống tưới nhỏ giọt"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-sm mb-1">
                        Công nghệ tưới tiên tiến
                      </h5>
                      <p className="text-xs text-gray-600">
                        Hệ thống tưới nhỏ giọt tiết kiệm 60% lượng nước so với
                        phương pháp truyền thống
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div className="relative h-[140px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2014.jpg-CNdj11tLzOAmSHK0FXwtVTwWPXnigk.jpeg"
                        alt="Khu vực trồng cây"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-sm mb-1">
                        Quy hoạch khoa học
                      </h5>
                      <p className="text-xs text-gray-600">
                        Thiết kế trồng rừng tối ưu dựa trên nghiên cứu địa hình
                        và thổ nhưỡng
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div className="relative h-[140px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2033.jpg-5ckI5Hz41LfL9Yc7raxiNZDaLkirlD.jpeg"
                        alt="Khảo sát địa hình"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-sm mb-1">
                        Giám sát liên tục
                      </h5>
                      <p className="text-xs text-gray-600">
                        Hệ thống giám sát tăng trưởng cây và hấp thụ carbon theo
                        thời gian thực
                      </p>
                    </div>
                  </div>
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
                  Góp thêm mầm xanh
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
              Mô hình 3D khu vực dự án
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              Khám phá mô hình 3D chi tiết của khu vực dự án được tạo từ dữ liệu
              LiDAR.
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
                Mô hình 3D này giúp chúng tôi lập kế hoạch trồng cây hiệu quả và
                theo dõi sự phát triển của rừng theo thời gian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mục tiêu trồng cây */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Mục tiêu trồng cây</h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              Chúng tôi đặt mục tiêu trồng 10.000 cây xanh để tạo nên một khu
              rừng cộng đồng bền vững.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">
                Tiến độ hiện tại
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

      {/* Main content - Moved below the Forest section */}
      <section id="plant-tree-section" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Trồng một cây xanh, vì tương lai bền vững
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              Với mỗi 55.000 VND đóng góp, bạn sẽ trồng được một cây xanh và
              nhận được một hòn đảo 3D tương tác mang tên của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left column - Donation form or tree display */}
            <div>
              {donorName ? (
                <div className="space-y-8">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
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
                        Đóng góp thành công!
                      </h3>
                    </div>
                    <p className="text-green-700 mb-6">
                      Cảm ơn {donorName} đã đóng góp trồng {treeCount} cây xanh.
                      Mã đóng góp của bạn là: {treeId}.
                    </p>

                    <div className="flex justify-center">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
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
                        Xem chứng nhận của bạn
                      </Button>
                    </div>
                  </div>

                  <div
                    id="certificate-section"
                    className="bg-white p-6 rounded-lg border border-gray-200 shadow-md"
                  >
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-center mb-6">
                        Chứng nhận đóng góp
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
                              Chứng nhận video
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
                              Chứng nhận hình ảnh
                            </button>
                          </nav>
                        </div>

                        <div
                          className={activeTab === "video" ? "block" : "hidden"}
                        >
                          <h4 className="text-xl font-semibold mb-4 text-center">
                            Chứng nhận video
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
                            Chứng nhận hình ảnh
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

            {/* Right column - Project information */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Về dự án trồng cây</h3>

              <div className="space-y-6">
                <p>
                  Dự án "Góp Mầm Xanh" là sáng kiến nhằm khôi phục và bảo vệ môi
                  trường thông qua việc trồng cây. Mỗi cây xanh được trồng sẽ
                  góp phần giảm thiểu tác động của biến đổi khí hậu và tạo ra
                  môi trường sống tốt hơn cho các thế hệ tương lai. Những hỗ trợ
                  của bạn không chỉ giúp môi trường mà còn giúp những người cộng
                  đồng người yếu thế tại các điểm dự án. Thay mặt các cộng đồng,
                  chúng tôi xin chân thành cảm ơn những đóng góp của bạn!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-lg mb-2">
                      1 cây xanh =
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      21kg CO₂
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      giảm thiểu mỗi năm
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-lg mb-2">Đã trồng</div>
                    <div className="text-3xl font-bold text-green-600">
                      {forestStats.isLoading ? (
                        <span className="inline-block w-16 h-8 bg-emerald-100 animate-pulse rounded"></span>
                      ) : (
                        forestStats.treeCount || 0
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">cây xanh</div>
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
                    Lợi ích của việc trồng cây:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Giảm thiểu CO₂ trong khí quyển</li>
                    <li>Tạo môi trường sống cho động vật hoang dã</li>
                    <li>Ngăn chặn xói mòn đất</li>
                    <li>Cải thiện chất lượng không khí</li>
                    <li>Tạo sinh kế cho cộng đồng địa phương</li>
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
            <h2 className="text-3xl font-bold mb-4">Câu hỏi thường gặp</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">
                Làm thế nào để tôi biết cây của tôi đã được trồng?
              </h3>
              <p className="text-gray-600">
                Sau khi cây được trồng, chúng tôi sẽ cập nhật hình ảnh thực tế
                của cây trên trang chi tiết. Bạn có thể xem bằng cách nhấp vào
                hòn đảo 3D của mình.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">
                Cây sẽ được trồng ở đâu?
              </h3>
              <p className="text-gray-600">
                Cây sẽ được trồng tại các dự án trồng rừng của chúng tôi ở các
                tỉnh miền núi phía Bắc Việt Nam, nơi có nhu cầu tái trồng rừng
                cao.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">
                Tôi có thể đóng góp nhiều cây không?
              </h3>
              <p className="text-gray-600">
                Có, bạn có thể đóng góp nhiều cây bằng cách điều chỉnh số lượng
                trong biểu mẫu đóng góp. Mỗi cây sẽ có ID riêng.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">
                Loại cây nào sẽ được trồng?
              </h3>
              <p className="text-gray-600">
                Chúng tôi trồng các loại cây bản địa phù hợp với hệ sinh thái
                địa phương, bao gồm cây lim, cây sao, cây dầu và các loại cây
                khác.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
