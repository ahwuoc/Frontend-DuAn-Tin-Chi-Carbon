"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"

export const testimonials = [
  {
    id: 1,
    content:
      "Tín Chỉ Carbon Việt Nam đã giúp chúng tôi xây dựng lộ trình Net Zero hiệu quả và tiết kiệm chi phí. Đội ngũ chuyên gia của họ rất tận tâm và chuyên nghiệp.",
    author: "Phạm Văn Tuấn",
    position: "CTHĐQT công ty Thanh Hà",
    avatar: "/images/testimonials/pham-van-tuan.jpg",
    company: "/images/company-1.png",
  },
  {
    id: 2,
    content:
      "Dịch vụ tư vấn tín chỉ carbon của Tín Chỉ Carbon Việt Nam đã giúp doanh nghiệp chúng tôi tiếp cận thị trường quốc tế và nâng cao giá trị thương hiệu.",
    author: "Phạm Thị Dung",
    position: "Giám đốc TT Việc làm và Khởi nghiệp Đại Nam",
    avatar: "/images/testimonials/pham-thi-dung.jpg",
    company: "/images/company-2.png",
  },
  {
    id: 3,
    content:
      "Công cụ tính toán carbon footprint của Tín Chỉ Carbon Việt Nam rất dễ sử dụng và cung cấp báo cáo chi tiết, giúp chúng tôi xác định được các cơ hội giảm phát thải.",
    author: "Hà Tiến Đạt",
    position: "Chủ tịch JCI Thăng Long 2024",
    avatar: "/images/testimonials/ha-tien-dat.jpg",
    company: "/images/company-3.png",
  },
  {
    id: 4,
    content:
      "Nhờ tham gia dự án tín chỉ carbon, thu nhập của gia đình tôi đã tăng đáng kể. Tín Chỉ Carbon Việt Nam không chỉ giúp chúng tôi bảo vệ rừng mà còn cải thiện sinh kế.",
    author: "Đồng Đạo Nghĩa",
    position: "Chủ rừng 25 ha Phú Thọ",
    avatar: "/images/testimonials/dong-dao-nghia.jpg",
  },
  {
    id: 5,
    content:
      "Tôi rất hài lòng khi tham gia dự án tín chỉ carbon. Đội ngũ Tín Chỉ Carbon Việt Nam đã hỗ trợ tận tình từ khâu đăng ký đến quản lý và bảo vệ rừng.",
    author: "Nguyễn Thị Chính",
    position: "Chủ rừng 22 ha Phú Thọ",
    avatar: "/images/testimonials/nguyen-thi-chinh.jpg",
  },
  {
    id: 6,
    content:
      "Hợp tác với Tín Chỉ Carbon Việt Nam là quyết định đúng đắn của chúng tôi. Họ đã giúp doanh nghiệp chúng tôi xây dựng chiến lược phát triển bền vững hiệu quả.",
    author: "Phạm Đức Anh",
    position: "CTHĐQT Công ty TNHH Nông nghiệp Thực phẩm Số 1",
    avatar: "/images/testimonials/pham-duc-anh.jpg",
    company: "/images/company-6.png",
  },
  {
    id: 7,
    content:
      "Tín Chỉ Carbon Việt Nam đã mang đến cho chúng tôi giải pháp toàn diện về quản lý carbon. Đặc biệt ấn tượng với sự chuyên nghiệp và hiệu quả trong triển khai dự án.",
    author: "Nguyễn Trí Dũng",
    position: "CTHĐQT Công ty SCT",
    avatar: "/images/testimonials/nguyen-tri-dung.jpg",
  },
  {
    id: 8,
    content:
      "Mô hình kinh doanh của Tín Chỉ Carbon Việt Nam rất sáng tạo và có tính ứng dụng cao. Họ đã tạo ra giá trị thực sự cho cộng đồng và môi trường.",
    author: "Nguyễn Xuân Trung",
    position: "Chuyên viên, Sở KH&CN tỉnh Nghệ An, Huấn luyện viên ĐMST Quốc gia",
    avatar: "/images/testimonials/nguyen-xuan-trung.jpg",
  },
]

export const testimonials_en = [
  {
    id: 1,
    content:
      "Carbon Credits Vietnam has helped us build an effective and cost-efficient Net Zero roadmap. Their team of experts is dedicated and professional.",
    author: "Pham Van Tuan",
    position: "Chairman of Thanh Ha Company",
    avatar: "/images/testimonials/pham-van-tuan.jpg",
    company: "/images/company-1.png",
  },
  {
    id: 2,
    content:
      "The carbon credit consulting service from Carbon Credits Vietnam has helped our business access international markets and enhance our brand value.",
    author: "Pham Thi Dung",
    position: "Director of Dai Nam Employment and Entrepreneurship Center",
    avatar: "/images/testimonials/pham-thi-dung.jpg",
    company: "/images/company-2.png",
  },
  {
    id: 3,
    content:
      "Carbon Credits Vietnam's carbon footprint calculator is very user-friendly and provides detailed reports, helping us identify emission reduction opportunities.",
    author: "Ha Tien Dat",
    position: "President of JCI Thang Long 2024",
    avatar: "/images/testimonials/ha-tien-dat.jpg",
    company: "/images/company-3.png",
  },
  {
    id: 4,
    content:
      "Thanks to participating in the carbon credit project, my family's income has increased significantly. Carbon Credits Vietnam not only helps us protect forests but also improves our livelihoods.",
    author: "Dong Dao Nghia",
    position: "Forest owner of 25 ha in Phu Tho",
    avatar: "/images/testimonials/dong-dao-nghia.jpg",
  },
  {
    id: 5,
    content:
      "I am very satisfied with participating in the carbon credit project. The Carbon Credits Vietnam team has provided thorough support from registration to forest management and protection.",
    author: "Nguyen Thi Chinh",
    position: "Forest owner of 22 ha in Phu Tho",
    avatar: "/images/testimonials/nguyen-thi-chinh.jpg",
  },
  {
    id: 6,
    content:
      "Collaborating with Carbon Credits Vietnam was the right decision for us. They have helped our business build an effective sustainable development strategy.",
    author: "Pham Duc Anh",
    position: "Chairman of No. 1 Agricultural Food Co., Ltd",
    avatar: "/images/testimonials/pham-duc-anh.jpg",
  },
  {
    id: 7,
    content:
      "Carbon Credits Vietnam has provided us with a comprehensive carbon management solution. Particularly impressive with their professionalism and efficiency in project implementation.",
    author: "Nguyen Tri Dung",
    position: "Chairman of SCT Company",
    avatar: "/images/testimonials/nguyen-tri-dung.jpg",
  },
  {
    id: 8,
    content:
      "Carbon Credits Vietnam's business model is very creative and highly applicable. They have created real value for the community and the environment.",
    author: "Nguyen Xuan Trung",
    position: "Specialist, Nghe An Department of Science and Technology, National Innovation Coach",
    avatar: "/images/testimonials/nguyen-xuan-trung.jpg",
  },
]

export default function TestimonialSlider() {
  const { language } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentTestimonials = language === "vi" ? testimonials : testimonials_en

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

  useEffect(() => {
    const interval = setInterval(goToNext, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="absolute top-8 left-8 text-green-600 opacity-20">
        <Quote className="h-24 w-24" />
      </div>

      <div className="relative z-10">
        <div className={`transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
            "{currentTestimonials[currentIndex].content}"
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-green-500">
                <Image
                  src={
                    currentTestimonials[currentIndex].avatar && currentTestimonials[currentIndex].avatar.trim()
                      ? currentTestimonials[currentIndex].avatar
                      : "/placeholder.svg?height=64&width=64"
                  }
                  alt={currentTestimonials[currentIndex].author}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">{currentTestimonials[currentIndex].author}</h4>
                <p className="text-gray-600">{currentTestimonials[currentIndex].position}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex space-x-4 z-20">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white h-12 w-12 flex items-center justify-center shadow-md"
          onClick={goToPrev}
          disabled={isAnimating}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white h-12 w-12 flex items-center justify-center shadow-md"
          onClick={goToNext}
          disabled={isAnimating}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute bottom-8 left-8 flex space-x-2">
        {currentTestimonials.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-green-600 w-6" : "bg-gray-300"
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
  )
}
