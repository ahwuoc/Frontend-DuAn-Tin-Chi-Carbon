"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import RegistrationForm from "@/components/registration-form"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import AnimatedGradient from "@/components/animated-gradient"

export default function ContactPage() {
  const { t } = useLanguage()
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vietnam-farmer-639204_1920.jpg"
            alt="Đăng ký tư vấn"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Đăng Ký Tư Vấn</h1>
            <p className="text-xl text-white/80 mb-8">
              Điền thông tin của bạn để nhận tư vấn miễn phí về tín chỉ carbon, nông nghiệp, biochar và các sản phẩm về
              giáo dục
            </p>
            <Link href="/" className="inline-flex items-center text-green-400 hover:text-green-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <div className="sticky top-24">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Dịch Vụ Tư Vấn Của Chúng Tôi</h2>
                <p className="text-gray-600 mb-8">
                  Chúng tôi cung cấp dịch vụ tư vấn chuyên nghiệp trong nhiều lĩnh vực khác nhau liên quan đến phát
                  triển bền vững và giảm phát thải carbon.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      title: "Tín chỉ carbon từ rừng",
                      description: "Tư vấn về dự án tín chỉ carbon từ rừng, quản lý và bảo vệ rừng bền vững.",
                    },
                    {
                      title: "Tín chỉ nông nghiệp",
                      description:
                        "Hướng dẫn áp dụng các phương pháp canh tác bền vững để tạo ra tín chỉ carbon từ nông nghiệp.",
                    },
                    {
                      title: "Công nghệ Biochar",
                      description: "Tư vấn về sản xuất và ứng dụng biochar để cải tạo đất và lưu trữ carbon.",
                    },
                    {
                      title: "Khóa học chứng chỉ quốc tế CSU",
                      description:
                        "Thông tin về khóa học và chứng chỉ quốc tế về biến đổi khí hậu và phát triển bền vững.",
                    },
                    {
                      title: "Carbon Toàn Thư 4.0",
                      description: "Hướng dẫn sử dụng nền tảng Carbon Toàn Thư 4.0 để quản lý dự án carbon hiệu quả.",
                    },
                  ].map((service, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0 mt-1">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{service.title}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-6 bg-white rounded-lg shadow-md border border-green-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Thông Tin Liên Hệ</h3>
                  <div className="space-y-3">
                    <p className="flex items-center text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      092.3370.804 | 085.8721.592 | 082.220.8881
                    </p>
                    <p className="flex items-center text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      minhtq@carboncreditvietnam.vn | phuongmh@carboncreditvietnam.vn
                    </p>
                    <p className="flex items-center text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Tầng 2, Toà nhà CT4 - The Pride, Tố Hữu, Hà Đông, Hà Nội, Việt Nam
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <RegistrationForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-90">
          <AnimatedGradient />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Bắt Đầu Hành Trình Phát Triển Bền Vững Ngay Hôm Nay</h2>
            <p className="text-xl text-white/80 mb-8">
              Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ sau khi nhận được thông tin đăng ký
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/san-pham/du-an-tin-chi-carbon">
                <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-medium border border-green-600">
                  Tìm hiểu thêm về dự án
                </Button>
              </Link>
              <Link href="/faq">
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 bg-white hover:bg-green-50 px-8 py-3 text-lg font-medium"
                >
                  Câu hỏi thường gặp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
