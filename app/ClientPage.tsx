"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import RegistrationForm from "@/components/registration-form"
import { Leaf, Award, Users, Globe, CheckCircle } from "lucide-react"
import CountUp from "@/components/count-up"
import TestimonialSlider from "@/components/testimonial-slider"
import { useInView } from "react-intersection-observer"
import ParticleBackground from "@/components/particle-background"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"
import ParallaxSection from "@/components/parallax-section"
import AnimatedButton from "@/components/animated-button"
import TypingEffect from "@/components/typing-effect"
import ImageComparison from "@/components/image-comparison"
import FloatingElement from "@/components/floating-element"
import AnimatedGradient from "@/components/animated-gradient"
import { useLanguage } from "@/context/language-context"
import MediaTestimonials from "@/components/media-testimonials"
import CarbonCalculatorAdvanced from "@/components/carbon-calculator-advanced"
import PartnerLogoCarousel from "@/components/partner-logo-carousel"
import { ReactNode } from "react"

export default function Home() {
  useSmoothScroll()
  const { t, language } = useLanguage()

  // Placeholder image with dimensions
  const placeholderImage = "/placeholder.svg?height=240&width=400"

  // Typing effect texts based on language
  const typingTexts =
    language === "vi"
      ? ["CARBON TOÀN THƯ 4.0", "DỰ ÁN TÍN CHỈ CARBON", "KHÓA HỌC CHỨNG CHỈ QUỐC TẾ"]
      : ["CARBON ENCYCLOPEDIA 4.0", "CARBON CREDIT PROJECTS", "INTERNATIONAL CERTIFICATE COURSES"]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <video
              src="https://res.cloudinary.com/dyticflm3/video/upload/v1744623719/colorful_rice_paddle_vid_guzdsx.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-70"
              onError={(e) => {
                console.warn("Video failed to load, using fallback")
                e.currentTarget.style.display = "none"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
          </div>
          <ParticleBackground />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <div className="animate-fade-in">
            <span className="inline-block py-1 px-3 bg-green-600 text-white text-sm font-medium rounded-full mb-6">
              {t("sustainable_solutions")}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              {language === "vi" ? "TÍN CHỈ CARBON VIỆT NAM" : "CARBON CREDITS VIETNAM"}
              <br />
              <span className="text-green-50">
                <TypingEffect
                  texts={typingTexts}
                  typingSpeed={50}
                  deletingSpeed={25}
                  delayBetweenTexts={1000}
                  className="inline-block min-w-[5ch]"
                />
              </span>
            </h1>
            <p className="text-white text-lg max-w-xl mb-8 leading-relaxed">
              {language === "vi"
                ? "Chúng tôi cung cấp giải pháp toàn diện về phát triển xanh cho doanh nghiệp, từ tư vấn chuyên môn đến triển khai dự án, cung cấp các giải pháp giáo dục toàn diện về thị trường giúp doanh nghiệp phát triển bền vững và thân thiện với môi trường."
                : "We provide comprehensive green development solutions for businesses, from expert consulting to project implementation, delivering comprehensive educational solutions about the market to help businesses develop sustainably and environmentally friendly."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
            <AnimatedButton
              size="lg"
              className="border-green-600 text-black hover:bg-green-600 hover:text-white transition-all duration-150 px-8 py-6 text-lg border-2"
              onClick={() => document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth" })}
              hoverText={t("start_now") || (language === "vi" ? "Bắt đầu ngay!" : "Start now!")}
            >
              {t("register_now_button")}
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              size="lg"
              className="border-green-600 text-black hover:bg-green-600 hover:text-white transition-all duration-300 px-8 py-6 text-lg border-2"
              hoverText={t("explore_more") || (language === "vi" ? "Khám phá thêm!" : "Explore more!")}
              href="/gioi-thieu"
            >
              {t("learn_more_button")}
            </AnimatedButton>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-10"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-20">
            {[
              {
                value: 15,
                label: language === "vi" ? "Dự án" : "Projects",
                icon: <Award className="h-8 w-8 text-green-600" />,
                suffix: "+",
              },
              {
                value: 50,
                label: language === "vi" ? "Khách hàng và đối tác" : "Clients and partners",
                icon: <Users className="h-8 w-8 text-green-600" />,
                suffix: "+",
              },
              {
                value: 25000,
                label: language === "vi" ? "Tấn CO2e giảm thải" : "Tons of CO2e reduced",
                icon: <Leaf className="h-8 w-8 text-green-600" />,
                suffix: "+",
              },
              {
                value: 3,
                label: language === "vi" ? "Quốc gia" : "Countries",
                icon: <Globe className="h-8 w-8 text-green-600" />,
                suffix: "",
              },
            ].map((stat, index) => (
              <AnimateOnScroll
                key={index}
                className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center text-center transition-all duration-150 hover:shadow-2xl hover:transform hover:scale-105 hover:bg-green-50 active:scale-95 active:bg-green-100"
                delay={index * 50}
              >
                <FloatingElement speed={0.5} offset={10}>
                  <div className="bg-green-50 p-3 rounded-full mb-4">{stat.icon}</div>
                </FloatingElement>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ParallaxSection speed={0.2}>
              <AnimateOnScroll className="animate-slide-in-left">
                <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                  {t("about_us")}
                </span>
                <h2 className="section-title text-gray-800 mb-8">{t("about_title")}</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{t("about_description")}</p>

                <div className="mt-8 mb-8">
                  <h4 className="text-lg font-bold mb-4">{t("project_impact")}</h4>
                  <ImageComparison
                    beforeImage="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.jpg-7p45S0g3WhR1ozdHTPW4tRNzxdLxUU.jpeg"
                    afterImage="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.jpg-SQng7DIiD8PABfvVU8Vx0UAzTgMJat.jpeg"
                    beforeLabel={t("before_project")}
                    afterLabel={t("after_project")}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link href="/gioi-thieu">
                    <Button variant="outline" className="btn-outline border-2">
                      {language === "vi" ? "Tìm hiểu thêm" : "Learn more"}
                    </Button>
                  </Link>
                  <Link href="/dich-vu-va-cong-cu-tinh-toan">
                    <Button className="btn-primary">
                      {language === "vi" ? "Dịch vụ của chúng tôi" : "Our services"}
                    </Button>
                  </Link>
                </div>
              </AnimateOnScroll>
            </ParallaxSection>

            <ParallaxSection speed={0.4}>
              <div className="relative">
                <AnimateOnScroll className="relative" delay={200}>
                  <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src="/images/vietnam-farmer-639204_1920.jpg"
                      alt={"image"}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        console.warn("Image failed to load, using fallback")
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                </AnimateOnScroll>
              </div>
            </ParallaxSection>
          </div>
        </div>
      </section>

      {/* Carbon Calculator Section - Replacing Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimateOnScroll className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {t("calculation_tools")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {language === "vi" ? "Công cụ tính toán Carbon" : "Carbon Calculation Tools"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === "vi"
                ? "Ước tính lượng carbon hấp thụ hoặc phát thải với công cụ tính toán chuyên nghiệp của chúng tôi"
                : "Estimate carbon absorption or emissions with our professional calculation tools"}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <CarbonCalculatorAdvanced />
          </AnimateOnScroll>

          <AnimateOnScroll className="text-center mt-12">
            <Link href="/dich-vu-va-cong-cu-tinh-toan">
              <Button className="btn-primary px-8 py-3">
                {language === "vi" ? "Xem thêm công cụ tính toán" : "View more calculation tools"}
              </Button>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimateOnScroll className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {language === "vi" ? "Sản phẩm của chúng tôi" : "Our Products"}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{t("product_ecosystem")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === "vi"
                ? "Khám phá hệ sinh thái sản phẩm toàn diện của chúng tôi, được thiết kế để đáp ứng mọi nhu cầu về tín chỉ carbon - từ kiến thức chuyên sâu đến triển khai dự án thực tế"
                : "Explore our comprehensive product ecosystem, designed to meet all your carbon credit needs - from in-depth knowledge to real-world project implementation"}
            </p>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Product 1: International Certificate Courses */}
            <AnimateOnScroll
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col"
              delay={100}
            >
              <div className="relative h-64">
                <Image
                  src="https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/CSU/Field%20of%20Knowledge%20fixed-5EKBWRBwl9HSxazRMrqpFSy1KttxmO.png"
                  alt={language === "vi" ? "Khóa học chứng chỉ quốc tế" : "International Certificate Courses"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {language === "vi"
                      ? "Khóa học chứng chỉ quốc tế từ CSU"
                      : "International Certificate Courses from CSU"}
                  </h3>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 mb-6">
                  {language === "vi"
                    ? "Nâng cao kiến thức và năng lực chuyên môn với chứng chỉ được công nhận toàn cầu từ  Columbia Southern University (CSU), mở ra cơ hội nghề nghiệp mới trong lĩnh vực tín chỉ carbon."
                    : "Enhance your knowledge and professional capabilities with globally recognized certificates from  Columbia Southern University (CSU), opening new career opportunities in the carbon credit field."}
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {language === "vi"
                        ? "Tăng 70% cơ hội phỏng vấn thành công"
                        : "Increase interview success rate by 70%"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {language === "vi"
                        ? "Học từ chuyên gia hàng đầu với 20 năm kinh nghiệm"
                        : "Learn from top experts with 20 years of experience"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {language === "vi"
                        ? "Tăng thu nhập trung bình 30% sau khóa học"
                        : "Increase average income by 30% after the course"}
                    </span>
                  </div>
                </div>
                <div className="mt-auto">
                  <Link href="/san-pham/khoa-hoc-chung-chi-quoc-te">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      {language === "vi" ? "Đăng ký ngay" : "Register Now"}
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Product 2: Carbon Credit Projects */}
            <AnimateOnScroll
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col"
              delay={200}
            >
              <div className="relative h-64">
                <Image
                  src="/images/vietnam-farmer-639204_1920.jpg"
                  alt={language === "vi" ? "Dự án tín chỉ carbon" : "Carbon Credit Projects"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {language === "vi" ? "Dự án tín chỉ carbon" : "Carbon Credit Projects"}
                  </h3>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 mb-6">
                  {language === "vi"
                    ? "Phát triển các dự án tín chỉ carbon chất lượng cao, tối ưu hóa giá trị từ các khu rừng trồng và tạo nguồn thu nhập ổn định lên đến 8 triệu VND/ha/năm."
                    : "Develop high-quality carbon credit projects, optimize value from planted forests and create stable income up to 8 million VND/ha/year."}
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {language === "vi" ? "Chi trả toàn bộ chi phí thiết lập dự án" : "Cover all project setup costs"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {language === "vi"
                        ? "Áp dụng công nghệ tiên tiến trong giám sát"
                        : "Apply advanced technology in monitoring"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {language === "vi"
                        ? "Vẫn giữ quyền khai thác gỗ sau dự án"
                        : "Retain timber harvesting rights after the project"}
                    </span>
                  </div>
                </div>
                <div className="mt-auto">
                  <Link href="/san-pham/du-an-tin-chi-carbon">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      {language === "vi" ? "Tìm hiểu thêm" : "Learn More"}
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Product 3: Carbon Toàn Thư 4.0 */}
            <AnimateOnScroll
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col"
              delay={300}
            >
              <div className="relative h-64">
                <Image
                  src="https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Carbon%20To%C3%A0n%20Th%C6%B0/Robot%20working-ePJD9KizKKfeK9Z90BjHitP4xJfg4u.jpg"
                  alt={language === "vi" ? "Carbon Toàn Thư 4.0" : "Carbon Encyclopedia 4.0"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {language === "vi" ? "Carbon Toàn Thư 4.0" : "Carbon Encyclopedia 4.0"}
                  </h3>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 mb-6">
                  {language === "vi"
                    ? "Kho tàng tri thức toàn diện với hơn 600 tài liệu chuyên sâu và trợ lý AI thông minh CarbonSeek, giúp bạn tiếp cận mọi kiến thức về tín chỉ carbon một cách nhanh chóng và hiệu quả."
                    : "Comprehensive knowledge repository with over 600 in-depth documents and the intelligent AI assistant CarbonSeek, helping you access all knowledge about carbon credits quickly and efficiently."}
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {language === "vi"
                        ? "Trợ lý AI CarbonSeek hoạt động 24/7"
                        : "CarbonSeek AI assistant available 24/7"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {language === "vi"
                        ? "Hơn 600 tài liệu chuyên sâu được cập nhật liên tục"
                        : "Over 600 in-depth documents continuously updated"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {language === "vi" ? "Tiết kiệm 70% thời gian nghiên cứu" : "Save 70% of research time"}
                    </span>
                  </div>
                </div>
                <div className="mt-auto">
                  <Link href="/san-pham/carbon-toan-thu">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      {language === "vi" ? "Khám phá ngay" : "Explore Now"}
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll className="text-center mt-12">
            <Link href="/san-pham">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                {language === "vi" ? "Khám phá tất cả sản phẩm" : "Explore All Products"}
              </Button>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimateOnScroll className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {t("faq")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{t("faq_title")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("faq_description")}</p>
          </AnimateOnScroll>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question:
                  language === "vi"
                    ? "Carbon Toàn Thư 4.0 là gì và có những tính năng nào?"
                    : "What is Carbon Encyclopedia 4.0 and what features does it have?",
                answer:
                  language === "vi"
                    ? "Carbon Toàn Thư 4.0 là kho tri thức toàn diện với hơn 600 tài liệu nghiên cứu, báo cáo chuyên sâu về Carbon Credits, ESG & CSR, kết hợp với trợ lý AI hiện đại nhất hiện nay. Sản phẩm này giúp bạn giải đáp mọi thắc mắc, cá nhân hóa thông tin theo nhu cầu, tính toán chính xác trữ lượng carbon rừng và cập nhật tin tức mới nhất về thị trường Carbon."
                    : "Carbon Encyclopedia 4.0 is a comprehensive knowledge repository with over 600 in-depth reports, researches, documents on Carbon Credits, ESG & CSR, combined with the most modern AI assistant available today. This product helps you answer all questions, personalize information according to your needs, accurately calculate forest carbon stocks, and update the latest news about the Carbon market.",
              },
              {
                question:
                  language === "vi"
                    ? "Giá của Carbon Toàn Thư 4.0 là bao nhiêu?"
                    : "How much does Carbon Encyclopedia 4.0 cost?",
                answer:
                  language === "vi"
                    ? "Hiện tại Carbon Toàn Thư 4.0 đang sử dụng trong 1 năm và update liên tục, có giá là 560.000 VNĐ."
                    : "Currently, Carbon Encyclopedia 4.0 is used for 1 year with continuous updates, priced at 600,000 VND.",
              },
              {
                question:
                  language === "vi"
                    ? "CarbonSeek là gì và có những tính năng nào?"
                    : "What is CarbonSeek and what features does it have?",
                answer:
                  language === "vi"
                    ? "CarbonSeek là trợ lý ảo thông minh của TCCV, được phát triển để giải đáp mọi thắc mắc về tín chỉ carbon, hướng dẫn quy trình liên quan về tín chỉ carbon, tính toán trữ lượng carbon và cung cấp thông tin chuyên ngành và các thông tin cập nhật liên tục về thị trường Carbon. Trợ lý hoạt động 24/7 giúp bạn nhận câu trả lời nhanh chóng và chính xác."
                    : "CarbonSeek is TCCV's intelligent virtual assistant, developed to answer all questions about carbon credits, guide carbon credit-related processes, calculate carbon stocks, and provide industry information and continuous updates on the Carbon market. The assistant operates 24/7 to help you receive quick and accurate answers.",
              },
              {
                question:
                  language === "vi"
                    ? "Lợi ích khi tham gia dự án tín chỉ carbon là gì?"
                    : "What are the benefits of participating in a carbon credit project?",
                answer:
                  language === "vi"
                    ? "Tham gia dự án này, bạn không chỉ có cơ hội nhận được nguồn thu nhập từ việc bán tín chỉ carbon với giá trị trung bình khoảng 8 triệu VND/ha/năm, mà còn góp phần quan trọng vào việc bảo vệ và phục hồi hệ sinh thái rừng. Ngoài ra, sau thời gian làm dự án carbon cho khu rừng của mình, bạn vẫn có quyền khai thác và sử dụng tài nguyên gỗ của khu rừng."
                    : "By participating in this project, you not only have the opportunity to receive income from selling carbon credits with an average value of about 8 million VND/ha/year, but also make an important contribution to protecting and restoring forest ecosystems. Additionally, after the carbon project period for your forest, you still retain the right to exploit and use the timber resources of the forest.",
              },
            ].map((faq, index) => (
              <AnimateOnScroll key={index} delay={index * 100} className="mb-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h3 className="text-xl font-bold text-gray-800">{faq.question}</h3>
                      <div className="w-5 h-5 border-2 border-green-600 rounded-full flex items-center justify-center group-open:bg-green-600 transition-all duration-300">
                        <span className="transform group-open:rotate-180 transition-transform duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-600 group-open:text-white"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </span>
                      </div>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 animate-fadeIn">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                </div>
              </AnimateOnScroll>
            ))}
            <AnimateOnScroll className="text-center mt-8">
              <Link href="/faq">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-base font-medium">
                  {language === "vi" ? "Xem tất cả câu hỏi thường gặp" : "View all FAQs"}
                </Button>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimateOnScroll className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {t("testimonials")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{t("trusted_partners")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("testimonials_description")}</p>
          </AnimateOnScroll>

          <AnimateOnScroll className="mb-16">
            <h3 className="text-2xl font-semibold text-center mb-8">
              {language === "vi" ? "Đối tác của chúng tôi" : "Our Partners"}
            </h3>
            <PartnerLogoCarousel />
          </AnimateOnScroll>

          <AnimateOnScroll>
            <TestimonialSlider />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="registration-form" className="py-20 bg-black relative">
        <div className="absolute inset-0 z-0">
          <Image src="/images/boy-1822614_1920.jpg" alt="Leaf background" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll className="animate-slide-in-left">
              <span className="inline-block py-1 px-3 bg-green-600 text-white text-sm font-medium rounded-full mb-4">
                {t("registration_form")}
              </span>
              <h2 className="text-4xl font-bold mb-6 text-white">{t("registration_title")}</h2>
              <p className="text-white text-lg mb-6 leading-relaxed">{t("registration_description")}</p>
              <div className="bg-green-600/20 p-6 rounded-lg border border-green-600/30 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4">{t("benefits_title")}</h3>
                <ul className="space-y-3">
                  {[t("benefit_1"), t("benefit_2"), t("benefit_3"), t("benefit_4")].map((item, index) => (
                    <li key={index} className="flex items-start text-white">
                      <span className="inline-block w-5 h-5 bg-green-500 rounded-full mr-3 mt-1 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll className="bg-white p-8 rounded-xl shadow-2xl" delay={200}>
              <RegistrationForm />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimateOnScroll className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {t("latest_news")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{t("latest_news")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("news_description")}</p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t("news_1_title"),
                date: "15/03/2023",
                image: "/images/rice-3182281_1920.jpg",
                excerpt: t("news_1_desc"),
                delay: 100,
              },
              {
                title: t("news_2_title"),
                date: "02/04/2023",
                image: "/images/mother-1505000_1280.jpg",
                excerpt: t("news_2_desc"),
                delay: 200,
              },
              {
                title: t("news_3_title"),
                date: "18/05/2023",
                image: "/images/ethnic-girls-4522623_1920.jpg",
                excerpt: t("news_3_desc"),
                delay: 300,
              },
            ].map((news, index) => (
              <AnimateOnScroll
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-150 hover:shadow-xl"
                delay={news.delay / 2}
              >
                <div className="relative h-60">
                  <Image src={news.image || placeholderImage} alt={news.title ?? ""} fill className="object-cover" />
                  <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-medium py-1 px-3 rounded-full">
                    {news.date}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">{news.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{news.excerpt}</p>
                  <Link href="/tin-tuc">
                    <Button variant="link" className="text-green-600 p-0 hover:text-green-700 group">
                      {t("read_more")}{" "}
                      <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Button>
                  </Link>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll className="text-center mt-12">
            <Link href="/tin-tuc" prefetch={true} className="btn-outline border-2">
              {t("view_all_news")}
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Media Testimonials Section */}
      <MediaTestimonials />

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-90">
          <AnimatedGradient />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <AnimateOnScroll className="text-white">
              <h2 className="text-3xl font-bold mb-2">{t("ready_to_start")}</h2>
              <p className="text-white/80 text-lg">{t("contact_for_free_consultation")}</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <AnimatedButton
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-medium shadow-lg"
                hoverText={t("contact_now_button")}
                href="/lien-he"
              >
                {t("contact_now")}
              </AnimatedButton>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
      {/* Sử dụng dynamic import với error boundary */}
      {typeof window !== "undefined" && (
        <ParallaxSection>
          <div>Your parallax content here</div>
        </ParallaxSection>
      )}
    </div>
  )
}

// Custom component to handle animations on scroll
function AnimateOnScroll({ children, className = "", delay = 0, animation = "animate-fade-in" }: AnimateOnScrollProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div
      ref={ref}
      className={`${className} ${inView ? animation : "opacity-0"}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: "400ms",
        transitionProperty: "opacity, transform",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        visibility: "visible", // Đảm bảo nội dung luôn hiển thị
        willChange: "opacity, transform", // Tối ưu hóa hiệu suất animation
      }}
    >
      {children}
    </div>
  )
}
interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: string;
}
