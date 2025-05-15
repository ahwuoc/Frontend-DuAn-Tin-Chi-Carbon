"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"

export default function MediaTestimonials() {
  const { language } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Placeholder image with dimensions
  const placeholderImage = "/placeholder.svg?height=60&width=200"

  const translations = {
    vi: {
      title: "Báo chí nói về chúng tôi",
      heading: "Tin Chỉ Carbon Việt Nam trên truyền thông",
      description: "Các báo đài uy tín đã đưa tin về hoạt động và đóng góp của chúng tôi trong lĩnh vực tín chỉ carbon",
      readMore: "Đọc thêm",
      footer: "Tin Chỉ Carbon Việt Nam tự hào được công nhận bởi các cơ quan truyền thông hàng đầu",
    },
    en: {
      title: "Media Coverage",
      heading: "Vietnam Carbon Credits in the Media",
      description:
        "Reputable media outlets have reported on our activities and contributions in the carbon credit sector",
      readMore: "Read more",
      footer: "Carbon Credits Vietnam is proud to be recognized by leading media organizations",
    },
  }

  const testimonials = {
    vi: [
      {
        id: 1,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/Logo-NhanDan-xatKYCT4EL3L0azgQ6JFlqpsQiTwEK.png",
        logoAlt: "Báo Nhân Dân",
        quote:
          "Dự án hướng đến việc nâng cao nhận thức và đào tạo người dân về bảo vệ rừng, quản lý tài nguyên bền vững. Với việc áp dụng công nghệ hiện đại trong quản lý rừng, dự án hy vọng tạo ra sự chuyển đổi bền vững cho cộng đồng, giúp họ thích ứng với biến đổi khí hậu và phát triển kinh tế lâu dài.",
        author: "BÁO NHÂN DÂN",
        readMoreLink:
          "https://nhandan.vn/dau-an-viet-nam-tren-nuoc-ban-lao-nhin-tu-du-an-trong-rung-tai-tao-va-phat-trien-tin-chi-carbon-o-mahaxay-post842762.html",
      },
      {
        id: 2,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/VnExpress.net_Logo.svg-gci8ueQC1LHT2KBKMrRW1azMe4bPIz.png",
        logoAlt: "VnExpress",
        quote:
          "Carbon Credits Vietnam - công ty tư vấn và môi giới trên thị trường tín chỉ carbon - đang làm việc với 10 dự án bán tín chỉ, quy mô 500 ha, tập trung tại Phú Thọ. Với mức giá quanh 20 USD một tín chỉ.",
        author: "VNEXPRESS",
        readMoreLink: "https://vnexpress.net/viet-nam-co-the-tro-thanh-be-chua-carbon-lon-cua-the-gioi-4845041.html",
      },
      {
        id: 3,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/banner_scem-cucmoitruong-2-J4jSnukTfZ55CwA07WC4wyAekq1e6W.png",
        logoAlt: "Trung tâm Quan trắc môi trư�������ng miền Nam",
        quote:
          "Carbon Credits Vietnam - công ty tư vấn và môi giới trên thị trường tín chỉ carbon - đang làm việc với 10 dự án bán tín chỉ, quy mô 500 ha, tập trung tại Phú Thọ. Với mức giá quanh 20 USD một tín chỉ.",
        author: "TRUNG TÂM QUAN TRẮC MÔI TRƯỜNG MIỀN NAM",
        readMoreLink:
          "https://scem.gov.vn/vi/tin-tuc-trung-tam/tin-tuc/viet-nam-co-the-tro-thanh-be-chua-carbon-lon-cua-the-gioi-1409.html",
      },
      {
        id: 4,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/logo-cafe-biz-J2KsLLrXYO1LaDDaA2iHDUrXXn64Vb.png",
        logoAlt: "Báo Điện Tử CafeBiz",
        quote:
          "Công nghệ AI hỗ trợ tính toán và xác định lượng carbon hấp thụ của rừng, giúp việc đo lường và báo cáo minh bạch hơn, bảo đảm độ chính xác cao khi phát hành tín chỉ carbon.",
        author: "BÁO ĐIỆN TỬ CAFEBIZ",
        readMoreLink:
          "https://cafebiz.vn/dau-an-viet-nam-tren-nuoc-ban-lao-nhin-tu-du-an-trong-rung-tai-tao-va-phat-trien-tin-chi-carbon-o-mahaxay-176241104140233377.chn",
      },
      {
        id: 5,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/Ti%E1%BB%81n%20phong-Z5Nin0svqrJJfcoDy49Ypzh5iNXl14.png",
        logoAlt: "Báo Tiền Phong",
        quote:
          "'Tín chỉ Carbon Việt Nam' đang tiến gần hơn tới việc hiện thực hóa tầm nhìn của mình: Một Việt Nam xanh, phát triển bền vững và giàu lòng nhân ái.",
        author: "BÁO TIỀN PHONG",
        readMoreLink:
          "https://svvn.tienphong.vn/tin-chi-carbon-viet-nam-sang-tao-xanh-tu-nhom-cuu-sinh-vien-tre-post1697985.tpo",
      },
      {
        id: 6,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/The%20leader-olQF0RJMfBAoV5czLnJZO1e1oE7fFW.png",
        logoAlt: "The Leader",
        quote:
          "Tín Chỉ Carbon Việt Nam đang tiên phong trong việc ứng dụng công nghệ số vào quản lý và phát triển dự án tín chỉ carbon, góp phần quan trọng vào mục tiêu Net Zero của Việt Nam.",
        author: "THE LEADER",
        readMoreLink: "#",
      },
      {
        id: 7,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/VNnetimage-mEtnka2hVYQlZlK6HHm7kzDKltTKLo.png",
        logoAlt: "Vietnam.net",
        quote:
          "Mô hình kinh doanh của Tín Chỉ Carbon Việt Nam đang tạo ra giá trị kép: vừa bảo vệ môi trường, vừa mang lại lợi ích kinh tế bền vững cho cộng đồng địa phương và các bên liên quan.",
        author: "VIETNAM.NET",
        readMoreLink: "#",
      },
      {
        id: 8,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/Logo_baomoi-i7S3bHuWgQ890cMLduDZ6b0HjVvQjT.png",
        logoAlt: "Báo Mới",
        quote:
          "Tín Chỉ Carbon Việt Nam đang đi đầu trong việc kết nối các chủ rừng với thị trường tín chỉ carbon quốc tế, mở ra cơ hội phát triển kinh tế mới cho các vùng nông thôn Việt Nam.",
        author: "BÁO MỚI",
        readMoreLink: "#",
      },
      {
        id: 9,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/D%C3%A2n%20tr%C3%AD-XPV8QPouf3GhsUmKuGtum48hxe5JDS.png",
        logoAlt: "Báo Dân Trí",
        quote:
          "Tín Chỉ Carbon Việt Nam vừa tạo nguồn thu nhập, sinh kế cho bà con, vừa khuyến khích trồng rừng. Dự án đã được thí điểm thành công ở Quảng Yên (Quảng Ninh) và đang tiếp tục được triển khai tại xã Thanh Vận (Bắc Kạn).",
        author: "BÁO DÂN TRÍ",
        readMoreLink:
          "https://dantri.com.vn/giao-duc/quan-quan-cuoc-thi-khoi-nghiep-xa-hoi-la-nhom-sinh-vien-4-truong-dai-hoc-20240206203642991.htm",
      },
    ],
    en: [
      {
        id: 1,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/Logo-NhanDan-xatKYCT4EL3L0azgQ6JFlqpsQiTwEK.png",
        logoAlt: "Nhan Dan Newspaper",
        quote:
          "The project aims to raise awareness and train people on forest protection and sustainable resource management. By applying modern technology in forest management, the project hopes to create sustainable transformation for communities, helping them adapt to climate change and develop long-term economic growth.",
        author: "NHAN DAN NEWSPAPER",
        readMoreLink:
          "https://nhandan.vn/dau-an-viet-nam-tren-nuoc-ban-lao-nhin-tu-du-an-trong-rung-tai-tao-va-phat-trien-tin-chi-carbon-o-mahaxay-post842762.html",
      },
      {
        id: 2,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/VnExpress.net_Logo.svg-gci8ueQC1LHT2KBKMrRW1azMe4bPIz.png",
        logoAlt: "VnExpress",
        quote:
          "Vietnam Carbon Credits - a consulting and brokerage company in the carbon credit market - is working with 10 credit-selling projects, with a scale of 500 hectares, concentrated in Phu Tho. With prices around 20 USD per credit.",
        author: "VNEXPRESS",
        readMoreLink: "https://vnexpress.net/viet-nam-co-the-tro-thanh-be-chua-carbon-lon-cua-the-gioi-4845041.html",
      },
      {
        id: 3,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/banner_scem-cucmoitruong-2-J4jSnukTfZ55CwA07WC4wyAekq1e6W.png",
        logoAlt: "Southern Environmental Monitoring Center",
        quote:
          "Vietnam Carbon Credits - a consulting and brokerage company in the carbon credit market - is working with 10 credit-selling projects, with a scale of 500 hectares, concentrated in Phu Tho. With prices around 20 USD per credit.",
        author: "SOUTHERN ENVIRONMENTAL MONITORING CENTER",
        readMoreLink:
          "https://scem.gov.vn/vi/tin-tuc-trung-tam/tin-tuc/viet-nam-co-the-tro-thanh-be-chua-carbon-lon-cua-the-gioi-1409.html",
      },
      {
        id: 4,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/logo-cafe-biz-J2KsLLrXYO1LaDDaA2iHDUrXXn64Vb.png",
        logoAlt: "CafeBiz Electronic Newspaper",
        quote:
          "AI technology supports the calculation and determination of forest carbon absorption, helping to make measurement and reporting more transparent, ensuring high accuracy when issuing carbon credits.",
        author: "CAFEBIZ ELECTRONIC NEWSPAPER",
        readMoreLink:
          "https://cafebiz.vn/dau-an-viet-nam-tren-nuoc-ban-lao-nhin-tu-du-an-trong-rung-tai-tao-va-phat-trien-tin-chi-carbon-o-mahaxay-176241104140233377.chn",
      },
      {
        id: 5,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/Ti%E1%BB%81n%20phong-Z5Nin0svqrJJfcoDy49Ypzh5iNXl14.png",
        logoAlt: "Tien Phong Newspaper",
        quote:
          "'Carbon Credits Vietnam' is getting closer to realizing its vision: A green, sustainably developed, and compassionate Vietnam.",
        author: "TIEN PHONG NEWSPAPER",
        readMoreLink:
          "https://svvn.tienphong.vn/tin-chi-carbon-viet-nam-sang-tao-xanh-tu-nhom-cuu-sinh-vien-tre-post1697985.tpo",
      },
      {
        id: 6,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/The%20leader-olQF0RJMfBAoV5czLnJZO1e1oE7fFW.png",
        logoAlt: "The Leader",
        quote:
          "Carbon Credits Vietnam is pioneering the application of digital technology in managing and developing carbon credit projects, making an important contribution to Vietnam's Net Zero goal.",
        author: "THE LEADER",
        readMoreLink: "#",
      },
      {
        id: 7,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/VNnetimage-mEtnka2hVYQlZlK6HHm7kzDKltTKLo.png",
        logoAlt: "Vietnam.net",
        quote:
          "Carbon Credits Vietnam's business model is creating dual value: both protecting the environment and bringing sustainable economic benefits to local communities and stakeholders.",
        author: "VIETNAM.NET",
        readMoreLink: "#",
      },
      {
        id: 8,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/Logo_baomoi-i7S3bHuWgQ890cMLduDZ6b0HjVvQjT.png",
        logoAlt: "Bao Moi",
        quote:
          "Carbon Credits Vietnam is leading the way in connecting forest owners with the international carbon credit market, opening up new economic development opportunities for Vietnam's rural areas.",
        author: "BAO MOI",
        readMoreLink: "#",
      },
      {
        id: 9,
        logo: "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Logo/D%C3%A2n%20tr%C3%AD-XPV8QPouf3GhsUmKuGtum48hxe5JDS.png",
        logoAlt: "Dan Tri Newspaper",
        quote:
          "Carbon Credits Vietnam both creates income and livelihoods for people and encourages forest planting. The project has been successfully piloted in Quang Yen (Quang Ninh) and is continuing to be implemented in Thanh Van commune (Bac Kan).",
        author: "DAN TRI NEWSPAPER",
        readMoreLink:
          "https://dantri.com.vn/giao-duc/quan-quan-cuoc-thi-khoi-nghiep-xa-hoi-la-nhom-sinh-vien-4-truong-dai-hoc-20240206203642991.htm",
      },
    ],
  }

  const currentTestimonials = language === "vi" ? testimonials.vi : testimonials.en
  const currentTranslations = language === "vi" ? translations.vi : translations.en

  const goToNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentTestimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToPrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + currentTestimonials.length) % currentTestimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
            {currentTranslations.title}
          </span>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">{currentTranslations.heading}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{currentTranslations.description}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {/* Media Logos Bar */}
                <div className="flex flex-wrap justify-center items-center gap-4 py-6 px-4 bg-white border-b">
                  {currentTestimonials.map((item, index) => (
                    <div
                      key={index}
                      className={`relative h-10 md:h-12 transition-all duration-300 ${
                        index === currentIndex
                          ? "w-28 md:w-36 opacity-100 scale-110"
                          : "w-20 md:w-24 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      {item.logo && (
                        <Image
                          src={item.logo || "/placeholder.svg"}
                          alt={item.logoAlt}
                          fill
                          className="object-contain cursor-pointer"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Testimonial Content */}
                <div className="p-8 md:p-12 bg-white">
                  <div className={`transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
                    <div className="mb-6">
                      <div className="relative h-16 md:h-20 w-40 md:w-56 mx-auto mb-8">
                        {currentTestimonials[currentIndex].logo && (
                          <Image
                            src={currentTestimonials[currentIndex].logo || "/placeholder.svg"}
                            alt={currentTestimonials[currentIndex].logoAlt}
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                      <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed italic text-center">
                        "{currentTestimonials[currentIndex].quote}"
                      </p>
                      <p className="text-center font-bold text-green-700">{currentTestimonials[currentIndex].author}</p>
                      {currentTestimonials[currentIndex].readMoreLink &&
                        currentTestimonials[currentIndex].readMoreLink !== "#" && (
                          <div className="text-center mt-4">
                            <Link
                              href={currentTestimonials[currentIndex].readMoreLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="text-green-600 hover:text-green-700 font-medium inline-flex items-center">
                                {currentTranslations.readMore}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 ml-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </span>
                            </Link>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    onClick={goToPrev}
                    disabled={isAnimating}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    onClick={goToNext}
                    disabled={isAnimating}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-4 left-0 right-0">
                  <div className="flex justify-center flex-wrap gap-1">
                    {currentTestimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index === currentIndex ? "bg-green-600 w-4" : "bg-gray-300 w-2"
                        }`}
                        onClick={() => {
                          if (isAnimating) return
                          setIsAnimating(true)
                          setCurrentIndex(index)
                          setTimeout(() => setIsAnimating(false), 500)
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">{currentTranslations.footer}</p>
          <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
            {currentTestimonials.map((item, index) => (
              <div
                key={index}
                className="relative h-8 w-24 md:h-10 md:w-28 opacity-100 hover:opacity-80 transition-all"
              >
                {item.logo && (
                  <Image src={item.logo || "/placeholder.svg"} alt={item.logoAlt} fill className="object-contain" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
