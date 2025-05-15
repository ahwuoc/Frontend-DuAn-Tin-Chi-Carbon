"use client"
import ParticleBackground from "@/components/particle-background"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"
import AnimatedButton from "@/components/animated-button"
import TypingEffect from "@/components/typing-effect"
import { useLanguage } from "@/context/language-context"
import CountUp from "react-countup"

export default function HomePage() {
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
      <section className="relative h-[90vh] bg-black overflow-hidden" aria-labelledby="hero-heading">
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
              aria-hidden="true"
              onError={(e) => {
                console.warn("Video failed to load, using fallback")
                e.currentTarget.style.display = "none"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" aria-hidden="true" />
          </div>
          <ParticleBackground />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <div className="animate-fade-in">
            <span className="inline-block py-1 px-3 bg-green-600 text-white text-sm font-medium rounded-full mb-6">
              {t("sustainable_solutions")}
            </span>
            <h1 id="hero-heading" className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              {language === "vi" ? "TÍN CHỈ CARBON VIỆT NAM" : "CARBON CREDITS VIETNAM"}
              <br />
              <span className="text-green-50">
                <TypingEffect
                  texts={typingTexts}
                  typingSpeed={50}
                  deletingSpeed={25}
                  delayBetweenTexts={1000}
                  className="inline-block min-w-[5ch]"
                  aria-live="polite"
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
              aria-label={t("register_now_button")}
            >
              {t("register_now_button")}
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              size="lg"
              className="border-green-600 text-black hover:bg-green-600 hover:text-white transition-all duration-300 px-8 py-6 text-lg border-2"
              hoverText={t("explore_more") || (language === "vi" ? "Khám phá thêm!" : "Explore more!")}
              href="/gioi-thieu"
              aria-label={t("learn_more_button")}
            >
              {t("learn_more_button")}
            </AnimatedButton>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-10"
          aria-hidden="true"
        ></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white" aria-labelledby="stats-heading">
        <div className="container mx-auto px-4">
          <h2 id="stats-heading" className="sr-only">
            {t("our_impact_in_numbers") || "Our Impact in Numbers"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <CountUp
                end={15}
                suffix="+"
                className="text-4xl font-bold text-green-600 mb-2"
                duration={2.5}
                aria-live="polite"
              />
              <p className="text-gray-600">{t("projects_completed")}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <CountUp
                end={50}
                suffix="+"
                className="text-4xl font-bold text-green-600 mb-2"
                duration={2.5}
                aria-live="polite"
              />
              <p className="text-gray-600">{t("clients_partners")}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <CountUp
                end={25000}
                suffix="+"
                className="text-4xl font-bold text-green-600 mb-2"
                duration={2.5}
                aria-live="polite"
              />
              <p className="text-gray-600">{t("tons_co2_reduced")}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <CountUp end={3} className="text-4xl font-bold text-green-600 mb-2" duration={2.5} aria-live="polite" />
              <p className="text-gray-600">{t("countries")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50" aria-labelledby="services-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="services-heading" className="text-3xl md:text-4xl font-bold mb-4">
              {t("our_services")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("services_description")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:transform hover:scale-105">
              <div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
                aria-hidden="true"
              >
                <span className="text-green-600 text-2xl">🍃</span>
              </div>
              <h3 className="text-xl font-bold mb-4">{t("carbon_credits")}</h3>
              <p className="text-gray-600 mb-6">{t("carbon_credits_description")}</p>
              <a
                href="/san-pham/du-an-tin-chi-carbon"
                className="text-green-600 font-medium flex items-center hover:text-green-700 transition-colors"
                aria-label={`${t("learn_more")} ${t("carbon_credits")}`}
              >
                {t("learn_more")}{" "}
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:transform hover:scale-105">
              <div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
                aria-hidden="true"
              >
                <span className="text-green-600 text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold mb-4">{t("carbon_encyclopedia")}</h3>
              <p className="text-gray-600 mb-6">{t("carbon_encyclopedia_description")}</p>
              <a
                href="/san-pham/carbon-toan-thu"
                className="text-green-600 font-medium flex items-center hover:text-green-700 transition-colors"
                aria-label={`${t("learn_more")} ${t("carbon_encyclopedia")}`}
              >
                {t("learn_more")}{" "}
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:transform hover:scale-105">
              <div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
                aria-hidden="true"
              >
                <span className="text-green-600 text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold mb-4">{t("international_certificates")}</h3>
              <p className="text-gray-600 mb-6">{t("international_certificates_description")}</p>
              <a
                href="/san-pham/khoa-hoc-chung-chi-quoc-te"
                className="text-green-600 font-medium flex items-center hover:text-green-700 transition-colors"
                aria-label={`${t("learn_more")} ${t("international_certificates")}`}
              >
                {t("learn_more")}{" "}
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Animated Gradient */}
      <section className="py-20 bg-gradient-to-r from-green-800 to-green-600" aria-labelledby="about-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="about-heading" className="text-3xl md:text-4xl font-bold mb-6 text-white">
                {t("about_us_title")}
              </h2>
              <p className="text-gray-100 mb-8 leading-relaxed">{t("about_us_description")}</p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-green-400 mr-3 flex-shrink-0 mt-1" aria-hidden="true">
                    ✓
                  </span>
                  <p className="text-gray-100">{t("about_point_1")}</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-3 flex-shrink-0 mt-1" aria-hidden="true">
                    ✓
                  </span>
                  <p className="text-gray-100">{t("about_point_2")}</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-3 flex-shrink-0 mt-1" aria-hidden="true">
                    ✓
                  </span>
                  <p className="text-gray-100">{t("about_point_3")}</p>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href="/gioi-thieu"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-100 transition-colors"
                  aria-label={t("discover_our_story")}
                >
                  {t("discover_our_story")}
                </a>
              </div>
            </div>
            <div className="relative">
              <div
                className="w-full h-[400px] lg:h-[500px] bg-green-700 rounded-lg overflow-hidden"
                aria-label="Interactive globe showing our global impact"
              >
                {/* Placeholder for InteractiveGlobe component */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl" aria-hidden="true">
                    🌍
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-20 bg-white" aria-labelledby="impact-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="impact-heading" className="text-3xl md:text-4xl font-bold mb-4">
              {t("our_impact")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("impact_description")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6">{t("reforestation_progress")}</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{t("mekong_delta")}</span>
                    <span className="text-green-600 font-medium">75%</span>
                  </div>
                  <div
                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={75}
                  >
                    <div className="h-full bg-green-600 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{t("central_highlands")}</span>
                    <span className="text-green-600 font-medium">60%</span>
                  </div>
                  <div
                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={60}
                  >
                    <div className="h-full bg-green-600 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{t("northern_mountains")}</span>
                    <span className="text-green-600 font-medium">45%</span>
                  </div>
                  <div
                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={45}
                  >
                    <div className="h-full bg-green-600 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">{t("carbon_reduction")}</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{t("agriculture_sector")}</span>
                    <span className="text-green-600 font-medium">80%</span>
                  </div>
                  <div
                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={80}
                  >
                    <div className="h-full bg-green-600 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{t("energy_sector")}</span>
                    <span className="text-green-600 font-medium">65%</span>
                  </div>
                  <div
                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={65}
                  >
                    <div className="h-full bg-green-600 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{t("waste_management")}</span>
                    <span className="text-green-600 font-medium">50%</span>
                  </div>
                  <div
                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={50}
                  >
                    <div className="h-full bg-green-600 rounded-full" style={{ width: "50%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Section */}
      <section
        className="relative py-20 bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/images/leaf-background.jpg')" }}
        aria-labelledby="join-movement-heading"
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" aria-hidden="true"></div>
        <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h2 id="join-movement-heading" className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t("join_movement")}
          </h2>
          <p className="text-xl text-white mb-10 max-w-2xl">{t("join_movement_description")}</p>
          <a
            href="/dang-ky-tu-van"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            aria-label={t("get_started_button")}
          >
            {t("get_started_button")}
          </a>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-20 bg-white" aria-labelledby="results-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="results-heading" className="text-3xl md:text-4xl font-bold mb-4">
              {t("our_results")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("results_description")}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <img
                src="/images/before-reforestation.png"
                alt="Forest area before reforestation efforts"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 py-2 bg-black bg-opacity-70 text-white rounded-md">{t("before")}</span>
              </div>
            </div>
            <p className="text-center text-gray-500 mt-4 italic">{t("reforestation_caption")}</p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50" aria-labelledby="partners-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="partners-heading" className="text-3xl font-bold mb-4">
              {t("our_partners")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("partners_description")}</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8" aria-label="Partner logos carousel">
            {/* Placeholder for PartnerLogoCarousel component */}
            <div className="w-32 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
              <span className="text-gray-400">Logo 1</span>
            </div>
            <div className="w-32 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
              <span className="text-gray-400">Logo 2</span>
            </div>
            <div className="w-32 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
              <span className="text-gray-400">Logo 3</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold mb-4">
              {t("testimonials")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("testimonials_description")}</p>
          </div>
          <div className="max-w-4xl mx-auto" aria-label="Testimonials from our clients">
            {/* Placeholder for MediaTestimonials component */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-gray-600 italic mb-4">"{t("testimonial_placeholder")}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">Nguyễn Văn A</p>
                  <p className="text-sm text-gray-500">CEO, Company XYZ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 id="cta-heading" className="text-3xl font-bold text-white mb-4">
                {t("ready_to_start")}
              </h2>
              <p className="text-white text-opacity-90 max-w-xl">{t("ready_to_start_description")}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/dang-ky-tu-van"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-100 transition-colors"
                aria-label={t("contact_us_button")}
              >
                {t("contact_us_button")}
              </a>
              <a
                href="/san-pham"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-green-700 transition-colors"
                aria-label={t("explore_products_button")}
              >
                {t("explore_products_button")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="registration-form" className="py-20 bg-gray-50" aria-labelledby="registration-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-10 flex items-center justify-center bg-green-600">
                <div className="text-center">
                  <h3 id="registration-heading" className="text-2xl font-bold text-white mb-4">
                    {t("join_us_today")}
                  </h3>
                  <p className="text-white text-opacity-90 mb-6">{t("join_us_description")}</p>
                  <div className="flex justify-center space-x-4">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600 hover:bg-gray-100 transition-colors"
                      aria-label="Facebook"
                    >
                      <span className="sr-only">Facebook</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600 hover:bg-gray-100 transition-colors"
                      aria-label="Twitter"
                    >
                      <span className="sr-only">Twitter</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600 hover:bg-gray-100 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-10">
                <form className="space-y-6" aria-labelledby="registration-form-heading">
                  <h4 id="registration-form-heading" className="sr-only">
                    {t("registration_form")}
                  </h4>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("full_name")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("email_address")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("phone_number")}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("message")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                      aria-label={t("submit_button")}
                    >
                      {t("submit_button")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
