"use client";
import ParticleBackground from "@/components/particle-background";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import AnimatedButton from "@/components/animated-button";
import TypingEffect from "@/components/typing-effect";
import { useLanguage } from "@/context/language-context";
import { useHomeTypingTexts } from "@/hooks/use-typing-texts";
import CountUp from "react-countup";

export default function HomePage() {
  useSmoothScroll();
  const { t, language } = useLanguage();
  const typingTexts = useHomeTypingTexts();

  // Placeholder image with dimensions
  const placeholderImage = "/placeholder.svg?height=240&width=400";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 text-center px-4">
          <div className="mb-8">
            <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              {language === "vi" ? "Cơ hội kiếm tiền" : "Earning Opportunity"}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <TypingEffect texts={typingTexts} />
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
              {t("company_description")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AnimatedButton
              href="/san-pham"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {language === "vi" ? "Khám phá ngay" : "Explore Now"}
            </AnimatedButton>
            <AnimatedButton
              href="/gioi-thieu"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {language === "vi" ? "Tìm hiểu thêm" : "Learn More"}
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {language === "vi" ? "Dịch vụ của chúng tôi" : "Our Services"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "vi"
                ? "Cung cấp giải pháp toàn diện cho phát triển tín chỉ carbon"
                : "Providing comprehensive solutions for carbon credit development"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carbon Credits */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {language === "vi" ? "Tín chỉ Carbon" : "Carbon Credits"}
              </h3>
              <p className="text-gray-600 text-center mb-6">
                {language === "vi"
                  ? "Phát triển và quản lý dự án tín chỉ carbon chất lượng cao"
                  : "Develop and manage high-quality carbon credit projects"}
              </p>
              <div className="text-center">
                <AnimatedButton
                  href="/san-pham/du-an-tin-chi-carbon"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {language === "vi" ? "Tìm hiểu" : "Learn More"}
                </AnimatedButton>
              </div>
            </div>

            {/* Carbon Accounting */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {language === "vi" ? "Carbon Toàn Thư" : "Carbon Accounting"}
              </h3>
              <p className="text-gray-600 text-center mb-6">
                {language === "vi"
                  ? "Hệ thống quản lý và tính toán carbon footprint chuyên nghiệp"
                  : "Professional carbon footprint management and calculation system"}
              </p>
              <div className="text-center">
                <AnimatedButton
                  href="/san-pham/carbon-toan-thu"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {language === "vi" ? "Tìm hiểu" : "Learn More"}
                </AnimatedButton>
              </div>
            </div>

            {/* International Certificates */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {language === "vi" ? "Chứng chỉ Quốc tế" : "International Certificates"}
              </h3>
              <p className="text-gray-600 text-center mb-6">
                {language === "vi"
                  ? "Khóa học và chứng chỉ quốc tế về quản lý carbon"
                  : "International courses and certificates in carbon management"}
              </p>
              <div className="text-center">
                <AnimatedButton
                  href="/san-pham/khoa-hoc-chung-chi-quoc-te"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {language === "vi" ? "Tìm hiểu" : "Learn More"}
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {language === "vi" ? "Thành tựu của chúng tôi" : "Our Achievements"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "vi"
                ? "Những con số ấn tượng về tác động tích cực đến môi trường"
                : "Impressive numbers about positive environmental impact"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                <CountUp end={1000} duration={2.5} />+
              </div>
              <p className="text-gray-600 text-lg">
                {language === "vi" ? "Dự án hoàn thành" : "Completed Projects"}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                <CountUp end={50000} duration={2.5} />+
              </div>
              <p className="text-gray-600 text-lg">
                {language === "vi" ? "Cây được trồng" : "Trees Planted"}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                <CountUp end={10000} duration={2.5} />+
              </div>
              <p className="text-gray-600 text-lg">
                {language === "vi" ? "Tín chỉ carbon" : "Carbon Credits"}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                <CountUp end={500} duration={2.5} />+
              </div>
              <p className="text-gray-600 text-lg">
                {language === "vi" ? "Khách hàng hài lòng" : "Happy Clients"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {language === "vi" ? "Sẵn sàng bắt đầu?" : "Ready to Get Started?"}
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {language === "vi"
              ? "Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất"
              : "Contact us for the best consultation and support"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AnimatedButton
              href="/dang-ky-tu-van"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {language === "vi" ? "Đăng ký tư vấn" : "Get Consultation"}
            </AnimatedButton>
            <AnimatedButton
              href="/gioi-thieu"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {language === "vi" ? "Tìm hiểu thêm" : "Learn More"}
            </AnimatedButton>
          </div>
        </div>
      </section>
    </div>
  );
}
