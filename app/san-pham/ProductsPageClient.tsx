"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  TrendingUp,
  Clock,
  Brain,
  FileText,
  Users,
  DollarSign,
  Star,
  BarChart3,
  Shield,
  Leaf,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import { testimonials, testimonials_en } from "@/components/testimonial-slider";

function ProductsPageClient() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-black">
        <div className="absolute inset-0 z-0">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <video
              src="https://res.cloudinary.com/dyticflm3/video/upload/v1744623711/drone_valley_nxhspi.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              fetchPriority="high"
              poster="/images/mother-1505000_1280.jpg"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            id="products-page-title"
          >
            {t("products_page_title")}
          </h1>
          <p
            className="text-white text-xl max-w-2xl"
            aria-describedby="products-page-title"
          >
            {t("products_page_subtitle")}
          </p>
        </div>
      </section>

      {/* Products Overview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {t("our_products")}
            </span>
            <h2
              className="text-4xl font-bold mb-4 text-gray-800"
              id="product-ecosystem-title"
            >
              {t("product_ecosystem")}
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              aria-describedby="product-ecosystem-title"
            >
              {t("product_ecosystem_description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Product 1: International Certificate Courses */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border-2 border-transparent hover:border-green-200">
              <div className="relative h-64">
                <Image
                  src="https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/CSU/Field%20of%20Knowledge%20fixed-5EKBWRBwl9HSxazRMrqpFSy1KttxmO.png"
                  alt={t("international_certificate_courses") || ""}
                  fill
                  className="object-cover"
                  aria-label={t("international_certificate_courses") || ""}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                  aria-hidden="true"
                ></div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 hover:bg-green-700">
                    {t("bestseller")}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3
                    className="text-2xl font-bold text-white mb-2"
                    id="international-certificate-courses-title"
                  >
                    {t("international_certificate_courses")}
                  </h3>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <p
                  className="text-gray-600 mb-6"
                  aria-describedby="international-certificate-courses-title"
                >
                  <span className="font-semibold text-gray-800">
                    {language === "vi" ? "Vấn đề:" : "Problem:"}
                  </span>{" "}
                  {t("problem_certificate")}
                </p>

                <p
                  className="text-gray-600 mb-6"
                  aria-describedby="international-certificate-courses-title"
                >
                  <span className="font-semibold text-gray-800">
                    {language === "vi" ? "Giải pháp:" : "Solution:"}
                  </span>{" "}
                  {t("solution_certificate")}
                </p>

                {/* Thêm phần giới thiệu giảng viên */}
                <div className="flex items-center p-4 bg-blue-50 rounded-lg mb-6">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-green-500 flex-shrink-0">
                    <Image
                      src="/images/charles-davis.jpeg"
                      alt="Charles Davis"
                      fill
                      className="object-cover"
                      aria-label="Charles Davis"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800">Charles Davis</h4>
                    <p className="text-gray-600 text-sm">
                      {t("main_instructor")} - {t("instructor_description")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <div
                      className="bg-green-100 p-1.5 rounded-full mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">
                        {t("benefit_interview")}
                      </span>
                      <p className="text-gray-600 text-sm">
                        {t("benefit_interview_desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="bg-green-100 p-1.5 rounded-full mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">
                        {t("benefit_expert")}
                      </span>
                      <p className="text-gray-600 text-sm">
                        {t("benefit_expert_desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="bg-green-100 p-1.5 rounded-full mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">
                        {t("benefit_income")}
                      </span>
                      <p className="text-gray-600 text-sm">
                        {t("benefit_income_desc")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center mb-2">
                    <Award
                      className="h-5 w-5 text-green-600 mr-2"
                      aria-hidden="true"
                    />
                    <span className="text-gray-700 font-medium">
                      {t("global_recognition")}
                    </span>
                  </div>
                  <p className="text-gray-700">
                    {t("global_recognition_desc")}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  <Link href="/san-pham/khoa-hoc-chung-chi-quoc-te">
                    <Button className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg">
                      {language === "vi" ? "Đăng ký ngay" : "Register Now"}
                    </Button>
                  </Link>
                  <Link href="/san-pham/khoa-hoc-chung-chi-quoc-te">
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    >
                      {t("learn_more_button")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Product 2: Carbon Credit Projects */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border-2 border-transparent hover:border-green-200">
              <div className="relative h-64">
                <Image
                  src="/images/vietnam-farmer-639204_1920.jpg"
                  alt={t("carbon_credit_projects") || ""}
                  fill
                  className="object-cover"
                  aria-label={t("carbon_credit_projects") || ""}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                  aria-hidden="true"
                ></div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-600 hover:bg-blue-700">
                    {t("high_profit")}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3
                    className="text-2xl font-bold text-white mb-2"
                    id="carbon-credit-projects-title"
                  >
                    {t("carbon_credit_projects")}
                  </h3>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <p
                  className="text-gray-600 mb-6"
                  aria-describedby="carbon-credit-projects-title"
                >
                  <span className="font-semibold text-gray-800">
                    {language === "vi" ? "Vấn đề:" : "Problem:"}
                  </span>{" "}
                  {t("problem_project")}
                </p>

                <p
                  className="text-gray-600 mb-6"
                  aria-describedby="carbon-credit-projects-title"
                >
                  <span className="font-semibold text-gray-800">
                    {language === "vi" ? "Giải pháp:" : "Solution:"}
                  </span>{" "}
                  {t("solution_project")}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <div
                      className="bg-green-100 p-1.5 rounded-full mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">
                        {t("benefit_cost")}
                      </span>
                      <p className="text-gray-600 text-sm">
                        {t("benefit_cost_desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="bg-green-100 p-1.5 rounded-full mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <BarChart3 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">
                        {t("benefit_tech")}
                      </span>
                      <p className="text-gray-600 text-sm">
                        {t("benefit_tech_desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="bg-green-100 p-1.5 rounded-full mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">
                        {t("benefit_rights")}
                      </span>
                      <p className="text-gray-600 text-sm">
                        {t("benefit_rights_desc")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center mb-2">
                    <Leaf
                      className="h-5 w-5 text-blue-500 mr-2"
                      aria-hidden="true"
                    />
                    <span className="text-gray-700 font-medium">
                      {t("minimum_requirements")}
                    </span>
                  </div>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>{t("requirement_1")}</li>
                    <li>{t("requirement_2")}</li>
                    <li>{t("requirement_3")}</li>
                    <li>{t("requirement_4")}</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  <Link href="/dang-ky-tu-van?type=forest">
                    <Button className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg">
                      {language === "vi"
                        ? "Đăng ký tư vấn"
                        : "Register for Consultation"}
                    </Button>
                  </Link>
                  <Link href="/san-pham/du-an-tin-chi-carbon">
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    >
                      {t("learn_more_button")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Product 3: Carbon Toàn Thư 4.0 */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border-2 border-transparent hover:border-green-200">
              <div className="relative h-64">
                <Image
                  src="https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Carbon%20To%C3%A0n%20Th%C6%B0/Robot%20working-ePJD9KizKKfeK9Z90BjHitP4xJfg4u.jpg"
                  alt={t("carbon_encyclopedia") || ""}
                  fill
                  className="object-cover"
                  aria-label={t("carbon_encyclopedia") || ""}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                  aria-hidden="true"
                ></div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-purple-600 hover:bg-purple-700">
                    {t("ai_integrated")}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3
                    className="text-2xl font-bold text-white mb-2"
                    id="carbon-encyclopedia-title"
                  >
                    {t("carbon_encyclopedia")}
                  </h3>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <p
                  className="text-gray-600 mb-6"
                  aria-describedby="carbon-encyclopedia-title"
                >
                  <span className="font-semibold text-gray-800">
                    {language === "vi" ? "Vấn đề:" : "Problem:"}
                  </span>{" "}
                  {t("problem_encyclopedia")}
                </p>

                <p
                  className="text-gray-600 mb-6"
                  aria-describedby="carbon-encyclopedia-title"
                >
                  <span className="font-semibold text-gray-800">
                    {language === "vi" ? "Giải pháp:" : "Solution:"}
                  </span>{" "}
                  {t("solution_encyclopedia")}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <div
                      className="bg-green-100 p-1.5 rounded-full mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <Brain className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">
                        {t("benefit_ai")}
                      </span>
                      <p className="text-gray-600 text-sm">
                        {t("benefit_ai_desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="bg-green-100 p-1.5 rounded-full mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">
                        {t("benefit_docs")}
                      </span>
                      <p className="text-gray-600 text-sm">
                        {t("benefit_docs_desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="bg-green-100 p-1.5 rounded-full mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">
                        {t("benefit_time")}
                      </span>
                      <p className="text-gray-600 text-sm">
                        {t("benefit_time_desc")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center mb-2">
                    <Award
                      className="h-5 w-5 text-purple-500 mr-2"
                      aria-hidden="true"
                    />
                    <span className="text-gray-700 font-medium">
                      {t("user_reviews")}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm italic">
                    {t("user_review_content")}
                  </p>
                  <p className="text-gray-700 text-sm font-medium mt-2">
                    - Lý Nguyên Ngọc,{" "}
                    {language === "vi"
                      ? "Thạc sĩ Luật/Giảng viên đại học"
                      : "LL. M / ESG Expert"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  <Link href="/thanh-toan?product=68210ccd22b9b2f0337813c9">
                    <Button className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg">
                      {language === "vi" ? "Mua ngay" : "Buy Now"}
                    </Button>
                  </Link>
                  <Link href="/san-pham/carbon-toan-thu">
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    >
                      {t("learn_more_button")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-16">
            <div className="text-center mb-8">
              <h3
                className="text-2xl font-bold text-gray-800 mb-2"
                id="why-choose-title"
              >
                {t("why_choose")}
              </h3>
              <p className="text-gray-600" aria-describedby="why-choose-title">
                {t("why_choose_desc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                <div
                  className="bg-green-100 p-3 rounded-full inline-block mb-4"
                  aria-hidden="true"
                >
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {t("quality_assured")}
                </h4>
                <p className="text-gray-600">{t("quality_assured_desc")}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                <div
                  className="bg-green-100 p-3 rounded-full inline-block mb-4"
                  aria-hidden="true"
                >
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {t("expert_team")}
                </h4>
                <p className="text-gray-600">{t("expert_team_desc")}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                <div
                  className="bg-green-100 p-3 rounded-full inline-block mb-4"
                  aria-hidden="true"
                >
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {t("continuous_updates")}
                </h4>
                <p className="text-gray-600">{t("continuous_updates_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {language === "vi" ? "Khách hàng của chúng tôi" : "Our Clients"}
            </span>
            <h2
              className="text-3xl font-bold mb-4 text-gray-800"
              id="client-testimonials-title"
            >
              {t("client_testimonials")}
            </h2>
            <p
              className="text-gray-600 max-w-2xl mx-auto"
              aria-describedby="client-testimonials-title"
            >
              {t("client_testimonials_desc")}
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            aria-live="polite"
          >
            {(language === "en" ? testimonials_en : testimonials)
              .slice(0, 3)
              .map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 border-2 border-green-500">
                      <Image
                        src={
                          testimonial.avatar ||
                          "/placeholder.svg?height=48&width=48"
                        }
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                        aria-label={testimonial.author}
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="fill-yellow-400 h-4 w-4"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 font-medium">
                        {testimonial.author}, {testimonial.position}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {t("faq")}
            </span>
            <h2
              className="text-3xl font-bold mb-4 text-gray-800"
              id="faq-products-title"
            >
              {t("faq_products")}
            </h2>
            <p
              className="text-gray-600 max-w-2xl mx-auto"
              aria-describedby="faq-products-title"
            >
              {t("faq_products_desc")}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("faq_1")}
                    </h3>
                    <div
                      className="w-5 h-5 border-2 border-green-600 rounded-full flex items-center justify-center group-open:bg-green-600 transition-all duration-300"
                      aria-hidden="true"
                    >
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
                    <p>{t("faq_1_answer")}</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li
                        dangerouslySetInnerHTML={{
                          __html: t("faq_1_point1") || "",
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: t("faq_1_point2") || "",
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: t("faq_1_point3") || "",
                        }}
                      ></li>
                    </ul>
                    <p className="mt-2">{t("faq_1_contact")}</p>
                  </div>
                </details>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("faq_2")}
                    </h3>
                    <div
                      className="w-5 h-5 border-2 border-green-600 rounded-full flex items-center justify-center group-open:bg-green-600 transition-all duration-300"
                      aria-hidden="true"
                    >
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
                    <p>{t("faq_2_answer")}</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>{t("faq_2_point1")}</li>
                      <li>{t("faq_2_point2")}</li>
                      <li>{t("faq_2_point3")}</li>
                      <li>{t("faq_2_point4")}</li>
                    </ul>
                    <p className="mt-2">{t("faq_2_instructions")}</p>
                  </div>
                </details>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("faq_3")}
                    </h3>
                    <div
                      className="w-5 h-5 border-2 border-green-600 rounded-full flex items-center justify-center group-open:bg-green-600 transition-all duration-300"
                      aria-hidden="true"
                    >
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
                    <p>{t("faq_3_answer")}</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li
                        dangerouslySetInnerHTML={{
                          __html: t("faq_3_point1") || "",
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: t("faq_3_point2") || "",
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: t("faq_3_point3") || "",
                        }}
                      ></li>
                    </ul>
                    <p className="mt-2">{t("faq_3_commitment")}</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2">
                {t("need_consultation")}
              </h2>
              <p className="text-white/80 text-lg">{t("contact_for_free")}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dang-ky-tu-van">
                <Button className="border-2 border-white bg-white text-green-600 hover:bg-transparent hover:text-white transition-all duration-300 px-8 py-3 text-lg font-medium">
                  {t("register_free_consultation")}
                </Button>
              </Link>
              <Link href="/faq">
                <Button className="border-2 border-white bg-white text-green-600 hover:bg-transparent hover:text-white transition-all duration-300 px-8 py-3 text-lg font-medium">
                  {t("view_faq")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductsPageClient;
