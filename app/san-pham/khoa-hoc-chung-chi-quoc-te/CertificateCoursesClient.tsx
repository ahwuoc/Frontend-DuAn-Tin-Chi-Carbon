"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Award,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Globe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";
import { apiCarbon } from "@/app/fetch/fetch.carboncredits";
import { ICarbonProduct } from "@/app/fetch/fetch.carboncredits";
import translations from "@/app/mockup/translate.mockup";
export default function CertificateCoursesClient() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<ICarbonProduct[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiCarbon.getProductType(
          "international_certificates",
        );
        if (response?.data) {
          setProduct(response.data);
        }
      } catch (error: any) {
        console.error("Lỗi khi fetch product:", error);
      }
    };
    fetchProducts();
  }, []);

  const getText = (key) => {
    return translations[language][key] || translations["vi"][key];
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] bg-black"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/CSU/Field%20of%20Knowledge%20fixed-5EKBWRBwl9HSxazRMrqpFSy1KttxmO.png"
            alt={getText("courseTitle")}
            fill
            className="object-cover opacity-60"
            priority
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-block py-1 px-3 bg-green-600 text-white text-sm font-medium rounded-full">
              {getText("exclusivePartner")}
            </span>
            <div className="bg-white p-2 rounded-lg">
              <Image
                src="/images/csu-logo.png"
                alt="South Columbia University Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
          <h1
            id="hero-heading"
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            {getText("courseTitle")}
          </h1>
          <p className="text-white text-xl max-w-2xl mb-8">
            {getText("courseSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/thanh-toan?product=khoa-hoc-chung-chi-chuyen-gia"
              aria-label={getText("registerCourse")}
            >
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
              >
                {getText("registerCourse")}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white bg-green-600/20 hover:bg-white hover:text-green-600 px-8 py-6 text-lg"
              aria-label={getText("downloadSchedule")}
            >
              {getText("downloadSchedule")}
            </Button>
          </div>
        </div>
      </section>

      {/* About CSU Section - Moved to top and enhanced */}
      <section
        className="py-20 bg-gradient-to-b from-green-50 to-white"
        aria-labelledby="about-csu-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {language === "vi"
                ? "ĐỐI TÁC GIÁO DỤC HÀNG ĐẦU"
                : "PREMIER EDUCATIONAL PARTNER"}
            </span>
            <h2
              id="about-csu-heading"
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 tracking-tight"
            >
              {language === "vi"
                ? "Đại học Nam Columbia (CSU)"
                : "Columbia Southern University (CSU)"}
            </h2>
            <div
              className="h-1 w-24 bg-green-600 mx-auto mb-6"
              aria-hidden="true"
            ></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "vi"
                ? "Đối tác độc quyền cung cấp chứng chỉ quốc tế về thị trường tín chỉ carbon tại Việt Nam"
                : "Exclusive partner providing international certificates in carbon credit markets in Vietnam"}
            </p>
          </div>

          {/* Stats - Enhanced with animations and better visuals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-white p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600">
              <div
                className="text-6xl font-bold text-green-600 mb-2"
                aria-label="Over 30,000 active students"
              >
                30,000+
              </div>
              <div className="text-xl font-medium text-gray-800">
                {language === "vi" ? "Học viên đang học" : "Active Students"}
              </div>
              <p className="text-gray-600 mt-2">
                {language === "vi"
                  ? "Từ hơn 60 quốc gia trên toàn thế giới"
                  : "From over 60 countries worldwide"}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600">
              <div
                className="text-6xl font-bold text-green-600 mb-2"
                aria-label="Over 1,000 faculty and staff"
              >
                1,000+
              </div>
              <div className="text-xl font-medium text-gray-800">
                {language === "vi"
                  ? "Giảng viên và nhân viên"
                  : "Faculty and Staff"}
              </div>
              <p className="text-gray-600 mt-2">
                {language === "vi"
                  ? "Chuyên gia hàng đầu trong lĩnh vực"
                  : "Leading experts in their fields"}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600">
              <div
                className="text-6xl font-bold text-green-600 mb-2"
                aria-label="Over 2,000 students in Vietnam"
              >
                2,000+
              </div>
              <div className="text-xl font-medium text-gray-800">
                {language === "vi"
                  ? "Học viên tại Việt Nam"
                  : "Students in Vietnam"}
              </div>
              <p className="text-gray-600 mt-2">
                {language === "vi"
                  ? "Đang theo học các chương trình đào tạo"
                  : "Currently enrolled in training programs"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CSU.jpg-0LuxLd7fwKUAiNvVjsUFzuVPYz6qEc.jpeg"
                alt="Columbia Southern University Graduates"
                fill
                className="object-cover"
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg">
                    <Image
                      src="/images/csu-logo.png"
                      alt="CSU Logo"
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-white font-medium">
                    {language === "vi"
                      ? "Lễ tốt nghiệp tại CSU"
                      : "Graduation ceremony at CSU"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="prose prose-lg max-w-none">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="h-10 w-1 bg-green-600 rounded-full"
                    aria-hidden="true"
                  ></div>
                  <h3 className="text-2xl font-bold text-gray-800 m-0">
                    {language === "vi"
                      ? "Uy tín toàn cầu"
                      : "Global Reputation"}
                  </h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {language === "vi"
                    ? "Đại học Nam Columbia (CSU) – trực thuộc Tập đoàn Giáo dục Nam Columbia (CSEG) – với hơn 30 năm đào tạo các bậc học từ Cao đẳng, Cử nhân đại học, Thạc sĩ và Tiến sĩ tại Hoa Kỳ và quốc tế."
                    : "Columbia Southern University (CSU) – part of Columbia Southern Education Group (CSEG) – has over 30 years of experience providing Associate, Bachelor's, Master's, and Doctoral education in the United States and internationally."}
                </p>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {language === "vi"
                    ? "Trường Đại học Nam Columbia tự hào nằm trong top 14% những trường đại học, cao đẳng trên toàn thế giới. CSU cung cấp những khóa học chất lượng cao với phương pháp giảng dạy hiện đại và sát sao với nhu cầu thực tế của thị trường lao động toàn cầu."
                    : "Columbia Southern University proudly ranks in the top 14% of universities and colleges worldwide. CSU provides high-quality courses with modern teaching methods that closely align with the practical needs of the global labor market."}
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {language === "vi"
                    ? "CSU là trường đại học nằm trong top 10 về số lượng sinh viên nhập học bang Alabama. Hiện nay, CSU có trên 3.000 đối tác học tập là các cơ quan chính phủ, tập đoàn và doanh nghiệp Hoa Kỳ."
                    : "CSU is among the top 10 universities in Alabama for student enrollment. Currently, CSU has over 3,000 learning partners including US government agencies, corporations, and businesses."}
                </p>
              </div>
              <div className="mt-8">
                <a
                  href="https://www.columbiasouthern.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  aria-label={
                    language === "vi"
                      ? "Tìm hiểu thêm về CSU"
                      : "Learn more about CSU"
                  }
                >
                  {language === "vi"
                    ? "Tìm hiểu thêm về CSU"
                    : "Learn more about CSU"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white" aria-labelledby="overview-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {getText("overview")}
              </span>
              <h2
                id="overview-heading"
                className="text-4xl font-bold mb-6 text-gray-800"
              >
                {getText("aboutCourse")}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {getText("courseDescription1")}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                {getText("courseDescription2")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className="h-5 w-5 text-green-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-gray-700">
                    {getText("internationalCertificate")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className="h-5 w-5 text-green-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-gray-700">
                    {getText("usInstructors")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className="h-5 w-5 text-green-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-gray-700">
                    {getText("onlineOrOffline")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className="h-5 w-5 text-green-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-gray-700">
                    {getText("practicalProjects")}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative h-[250px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/H%E1%BB%8Dc%20t%E1%BA%A1i%20Vi%E1%BB%87t%20Nam.jpg-ZUqQvwNI021iu77SGSudXhhRqr7IQS.jpeg"
                  alt="Học viên tham gia khóa học tại Việt Nam"
                  fill
                  className="object-cover"
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm font-medium">
                    {language === "vi"
                      ? "Lớp học trực tiếp tại Việt Nam"
                      : "In-person class in Vietnam"}
                  </p>
                </div>
              </div>
              <div className="relative h-[250px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/H%E1%BB%8Dc%20t%E1%BA%A1i%20Vi%E1%BB%87t%20Nam%202.jpg-lcsiofkLTfbf3u0dzzqaR2P2cTwpWv.jpeg"
                  alt="Học viên tham gia khóa học chuyên sâu"
                  fill
                  className="object-cover"
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm font-medium">
                    {language === "vi"
                      ? "Học viên tập trung nghiên cứu chuyên sâu"
                      : "Students focusing on in-depth studies"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Benefits Section */}
      <section className="py-20 bg-gray-50" aria-labelledby="benefits-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("careerSolution")}
            </span>
            <h2
              id="benefits-heading"
              className="text-4xl font-bold mb-4 text-gray-800"
            >
              {getText("whyNeedCertificate")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("competitiveMarket")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: getText("standOutTitle"),
                description: getText("standOutDesc"),
                icon: (
                  <Award
                    className="h-12 w-12 text-green-600"
                    aria-hidden="true"
                  />
                ),
              },
              {
                title: getText("knowledgeTitle"),
                description: getText("knowledgeDesc"),
                icon: (
                  <BookOpen
                    className="h-12 w-12 text-green-600"
                    aria-hidden="true"
                  />
                ),
              },
              {
                title: getText("expertTitle"),
                description: getText("expertDesc"),
                icon: (
                  <Users
                    className="h-12 w-12 text-green-600"
                    aria-hidden="true"
                  />
                ),
              },
              {
                title: getText("incomeTitle"),
                description: getText("incomeDesc"),
                icon: (
                  <CheckCircle
                    className="h-12 w-12 text-green-600"
                    aria-hidden="true"
                  />
                ),
              },
              {
                title: getText("opportunityTitle"),
                description: getText("opportunityDesc"),
                icon: (
                  <Globe
                    className="h-12 w-12 text-green-600"
                    aria-hidden="true"
                  />
                ),
              },
              {
                title: getText("flexibleTitle"),
                description: getText("flexibleDesc"),
                icon: (
                  <Award
                    className="h-12 w-12 text-green-600"
                    aria-hidden="true"
                  />
                ),
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 hover:bg-green-50"
              >
                <CardContent className="p-8">
                  <div
                    className="bg-green-100 p-4 rounded-full inline-block mb-6"
                    aria-hidden="true"
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Display Free */}
      <section
        className="py-20 bg-white"
        aria-labelledby="course-structure-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("courseProgram")}
            </span>
            <h2
              id="course-structure-heading"
              className="text-4xl font-bold mb-4 text-gray-800"
            >
              {getText("courseStructure")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("comprehensiveContent")}
            </p>
          </div>

          <Tabs defaultValue="basic" className="max-w-4xl mx-auto">
            <TabsList
              className="grid grid-cols-3 mb-8"
              aria-label="Course content levels"
            >
              <TabsTrigger value="basic">{getText("basic")}</TabsTrigger>
              <TabsTrigger value="intermediate">
                {getText("intermediate")}
              </TabsTrigger>
              <TabsTrigger value="advanced">{getText("advanced")}</TabsTrigger>
            </TabsList>
            <TabsContent
              value="basic"
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {getText("basicTitle")}
              </h3>
              <p className="text-gray-600 mb-6">{getText("basicDesc")}</p>
              <div className="space-y-4">
                {[
                  {
                    title: getText("intro"),
                    duration: getText("introHours"),
                    description: getText("introDesc"),
                  },
                  {
                    title: getText("concepts"),
                    duration: getText("conceptsHours"),
                    description: getText("conceptsDesc"),
                  },
                  {
                    title: getText("history"),
                    duration: getText("historyHours"),
                    description: getText("historyDesc"),
                  },
                ].map((module, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-gray-800">
                        {module.title}
                      </h4>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                        <span>{module.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="intermediate"
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {getText("intermediateTitle")}
              </h3>
              <p className="text-gray-600 mb-6">
                {getText("intermediateDesc")}
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: getText("systems"),
                    duration: getText("systemsHours"),
                    description: getText("systemsDesc"),
                  },
                  {
                    title: getText("gases"),
                    duration: getText("gasesHours"),
                    description: getText("gasesDesc"),
                  },
                  {
                    title: getText("markets"),
                    duration: getText("marketsHours"),
                    description: getText("marketsDesc"),
                  },
                ].map((module, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-gray-800">
                        {module.title}
                      </h4>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                        <span>{module.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="advanced"
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {getText("advancedTitle")}
              </h3>
              <p className="text-gray-600 mb-6">{getText("advancedDesc")}</p>
              <div className="space-y-4">
                {[
                  {
                    title: getText("projectTypes"),
                    duration: getText("projectTypesHours"),
                    description: getText("projectTypesDesc"),
                  },
                  {
                    title: getText("certifiers"),
                    duration: getText("certifiersHours"),
                    description: getText("certifiersDesc"),
                  },
                  {
                    title: getText("practicalProjects"),
                    duration: getText("practicalProjectsHours"),
                    description: getText("practicalProjectsDesc"),
                  },
                ].map((module, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-gray-800">
                        {module.title}
                      </h4>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                        <span>{module.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Unique Features Section */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="unique-features-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("uniqueFeatures")}
            </span>
            <h2
              id="unique-features-heading"
              className="text-4xl font-bold mb-4 text-gray-800"
            >
              {getText("onlyInOurCourse")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("uniqueFeaturesDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: getText("marketAnalysisTitle"),
                description: getText("marketAnalysisDesc"),
              },
              {
                title: getText("unlimitedTestsTitle"),
                description: getText("unlimitedTestsDesc"),
              },
              {
                title: getText("bothMarketsTitle"),
                description: getText("bothMarketsDesc"),
              },
              {
                title: getText("calculationSkillsTitle"),
                description: getText("calculationSkillsDesc"),
              },
              {
                title: getText("noPrerequisitesTitle"),
                description: getText("noPrerequisitesDesc"),
              },
              {
                title: getText("transferableCreditTitle"),
                description: getText("transferableCreditDesc"),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-800 flex items-center">
                  <CheckCircle
                    className="h-5 w-5 text-green-600 mr-2 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Showcase Section */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="certificate-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("certificate")}
            </span>
            <h2
              id="certificate-heading"
              className="text-4xl font-bold mb-4 text-gray-800"
            >
              {getText("investOnce")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("certificateDesc")}
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="relative mx-auto mb-8">
                <Image
                  src="/images/certificate-sample.png"
                  alt="Sample Certificate"
                  width={800}
                  height={600}
                  className="object-contain"
                />
              </div>
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {getText("certificateValue")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {getText("globalRecognition")}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {getText("globalRecognitionDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {getText("officialCEUs")}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {getText("officialCEUsDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {getText("creditTransfer")}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {getText("creditTransferDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {getText("enhanceProfile")}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {getText("enhanceProfileDesc")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-green-100 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    {getText("certificateQuote")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-20 bg-gray-50"
        aria-labelledby="instructors-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("instructors")}
            </span>
            <h2
              id="instructors-heading"
              className="text-4xl font-bold mb-4 text-gray-800"
            >
              {getText("meetExperts")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("instructorsDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Charles Davis */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="shrink-0">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-green-600">
                      <Image
                        src="/images/charles-davis.jpeg"
                        alt="Charles Davis"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="bg-white p-2 rounded-lg mt-4 mx-auto w-24">
                      <Image
                        src="/images/csu-logo.png"
                        alt="South Columbia University Logo"
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">
                      {getText("instructor")}
                    </div>
                    <h3 className="block mt-1 text-2xl leading-tight font-bold text-gray-900">
                      {getText("charlesDavis")}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {getText("charlesEducation")}
                    </p>
                    <div className="mt-4 text-gray-600">
                      <p className="mb-2">{getText("charlesDesc")}</p>
                      <ul
                        className="list-disc pl-5 space-y-1"
                        aria-label="Charles Davis achievements"
                      >
                        <li>{getText("charlesAchievement1")}</li>
                        <li>{getText("charlesAchievement2")}</li>
                        <li>{getText("charlesAchievement3")}</li>
                        <li>{getText("charlesAchievement4")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Elwin Jones */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="shrink-0">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-green-600">
                      <Image
                        src="/images/elwin-jones.jpeg"
                        alt="Elwin Jones"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="bg-white p-2 rounded-lg mt-4 mx-auto w-24">
                      <Image
                        src="/images/csu-logo.png"
                        alt="South Columbia University Logo"
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">
                      {getText("instructor")}
                    </div>
                    <h3 className="block mt-1 text-2xl leading-tight font-bold text-gray-900">
                      {getText("elwinJones")}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {getText("elwinEducation")}
                    </p>
                    <div className="mt-4 text-gray-600">
                      <p className="mb-2">{getText("elwinDesc")}</p>
                      <ul
                        className="list-disc pl-5 space-y-1"
                        aria-label="Elwin Jones achievements"
                      >
                        <li>{getText("elwinAchievement1")}</li>
                        <li>{getText("elwinAchievement2")}</li>
                        <li>{getText("elwinAchievement3")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-12 bg-green-50 p-6 rounded-lg border border-green-100">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
              {getText("facultyTeam")}
            </h3>
            <p className="text-gray-700 mb-4">{getText("facultyDesc1")}</p>
            <p className="text-gray-700">
              <strong>{language === "vi" ? "Đặc biệt:" : "Special:"}</strong>{" "}
              {getText("facultyDesc2")}
            </p>
          </div>
        </div>
      </section>

      {/* Course Details Section */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="course-details-heading"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/grandmother-4992686_1920.jpg"
                alt={getText("courseDetails")}
                fill
                className="object-cover"
                aria-hidden="true"
              />
            </div>
            <div>
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {getText("courseDetails")}
              </span>
              <h2
                id="course-details-heading"
                className="text-4xl font-bold mb-6 text-gray-800"
              >
                {getText("detailedInfo")}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div
                    className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-800">
                      {getText("time")}
                    </h3>
                    <p className="text-gray-600">{getText("timeDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div
                    className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-800">
                      {getText("targetAudience")}
                    </h3>
                    <p className="text-gray-600">
                      {getText("targetAudienceDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div
                    className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-800">
                      {getText("learningFormat")}
                    </h3>
                    <p className="text-gray-600">
                      {getText("learningFormatDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div
                    className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-800">
                      {getText("certificateDetail")}
                    </h3>
                    <p className="text-gray-600">
                      {getText("certificateDetailDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white" aria-labelledby="pricing-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("tuition")}
            </span>
            <h2
              id="pricing-heading"
              className="text-4xl font-bold mb-4 text-gray-800"
            >
              {getText("investInFuture")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("choosePlan")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Individual */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-200 flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {getText("individual")}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">
                    {getText("individualPrice")}
                  </span>
                  <span
                    className="text-gray-500 line-through ml-2"
                    aria-label="Original price"
                  >
                    {getText("individualOriginalPrice")}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {getText("limitedTimeOffer")}
                  </p>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("fullAccess")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("fullAccessDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("internationalCertificateFeature")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("internationalCertificateFeatureDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("materials")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("materialsDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("aiBasic")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("aiBasicDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("weeklyUpdates")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("weeklyUpdatesDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("emailSupport")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("emailSupportDesc")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-green-800 font-medium">
                    {getText("careerOpportunities")}
                  </p>
                  <ul
                    className="text-sm text-green-700 list-disc pl-5 mt-1"
                    aria-label="Career benefits"
                  >
                    <li>{getText("interviewRate")}</li>
                    <li>{getText("salaryIncrease")}</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {getText("individualSuitableFor")}
                </p>
                <Link
                  href="/thanh-toan?product=khoa-hoc-chung-chi-ca-nhan"
                  className="mt-auto w-full"
                  aria-label={getText("registerNow")}
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-medium">
                    {getText("registerNow")}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Expert */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-600 transform scale-105 flex flex-col">
              <div className="bg-green-600 text-white text-center py-2 text-sm font-medium">
                {getText("mostPopular")}
              </div>
              <CardContent className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {getText("expert")}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">
                    {getText("expertPrice")}
                  </span>
                  <span
                    className="text-gray-500 line-through ml-2"
                    aria-label="Original price"
                  >
                    {getText("expertOriginalPrice")}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {getText("limitedTimeOffer")}
                  </p>
                </div>
                <p className="text-sm text-gray-600 italic mb-3">
                  {getText("includesIndividual")}
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("extendedMaterials")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("extendedMaterialsDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("aiPremium")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("aiPremiumDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("prioritySupport")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("prioritySupportDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("oneOnOne")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("oneOnOneDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("carbonReports")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("carbonReportsDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("exclusiveMaterials")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("exclusiveMaterialsDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("expertNetwork")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("expertNetworkDesc")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-green-800 font-medium">
                    {getText("careerOpportunities")}
                  </p>
                  <ul
                    className="text-sm text-green-700 list-disc pl-5 mt-1"
                    aria-label="Career benefits"
                  >
                    <li>{getText("interviewRate")}</li>
                    <li>{getText("expertSalaryIncrease")}</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {getText("expertSuitableFor")}
                </p>
                <Link
                  href={`/thanh-toan?product=${product}`}
                  className="mt-auto w-full"
                  aria-label={getText("registerNow")}
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-medium">
                    {getText("registerNow")}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Business */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-200 flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {getText("business")}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">
                    {getText("contact")}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {getText("customPrice")}
                  </p>
                </div>
                <p className="text-sm text-gray-600 italic mb-3">
                  {getText("includesExpert")}
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("multipleEmployees")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("multipleEmployeesDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("inHouseTraining")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("inHouseTrainingDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("carbonStrategy")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("carbonStrategyDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("exclusiveMaterialsBusiness")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("exclusiveMaterialsBusinessDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("aiEnterprise")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("aiEnterpriseDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("technicalSupport")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("technicalSupportDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("globalPartners")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("globalPartnersDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-gray-700">
                        {getText("carbonCredits")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {getText("carbonCreditsDesc")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-green-800 font-medium">
                    {getText("cbamCompliance")}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {getText("businessSuitableFor")}
                </p>
                <Link
                  href="/dang-ky-tu-van"
                  className="mt-auto w-full"
                  aria-label={getText("contactUs")}
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-medium">
                    {getText("contactUs")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="testimonials-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("reviews")}
            </span>
            <h2
              id="testimonials-heading"
              className="text-4xl font-bold mb-4 text-gray-800"
            >
              {getText("studentsFeedback")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("testimonialDesc")}
            </p>
          </div>

          {[
            {
              content: getText("testimonial1"),
              author:
                language === "vi"
                  ? getText("testimonialAuthor1")
                  : getText("testimonialAuthor1"),
              position: getText("testimonialPosition1"),
              avatar:
                "https://res.cloudinary.com/dyticflm3/image/upload/v1744662839/A_Trung_ngufm5.png",
            },
            {
              content: getText("testimonial2"),
              author:
                language === "vi"
                  ? getText("testimonialAuthor2")
                  : getText("testimonialAuthor2"),
              position: getText("testimonialPosition2"),
              avatar:
                "https://res.cloudinary.com/dyticflm3/image/upload/v1744662809/Anh_%C4%90%E1%BB%A9c_Anh_qqdwoc.jpg",
            },
            {
              content: getText("testimonial3"),
              author:
                language === "vi"
                  ? getText("testimonialAuthor3")
                  : getText("testimonialAuthor3"),
              position: getText("testimonialPosition3"),
              avatar:
                "https://res.cloudinary.com/dyticflm3/image/upload/v1744662809/B%C3%A1c_D%C5%A9ng_flp9iq.jpg",
            },
          ].map((testimonial, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="mb-6 text-gray-600 italic">
                  {testimonial.content}
                </div>
                <div className="flex items-center">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-green-600">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {testimonial.author}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white bgp" aria-labelledby="faq-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("faq")}
            </span>
            <h2
              id="faq-heading"
              className="text-4xl font-bold mb-4 text-gray-800"
            >
              {getText("answerQuestions")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("faqDesc")}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: getText("faq1"),
                answer: getText("faqAnswer1"),
              },
              {
                question: getText("faq2"),
                answer: getText("faqAnswer2"),
              },
              {
                question: getText("faq3"),
                answer: getText("faqAnswer3"),
              },
              {
                question: getText("faq4"),
                answer: getText("faqAnswer4"),
              },
              {
                question: getText("faq5"),
                answer: getText("faqAnswer5"),
              },
              {
                question: getText("faq6"),
                answer: getText("faqAnswer6"),
              },
              {
                question: getText("faq7"),
                answer: getText("faqAnswer7"),
              },
              {
                question: getText("faq8"),
                answer: getText("faqAnswer8"),
              },
            ].map((faq, index) => (
              <div key={index} className="mb-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                  <details className="group">
                    <summary
                      className="flex justify-between items-center p-6 cursor-pointer"
                      aria-expanded="false"
                    >
                      <h3 className="text-xl font-bold text-gray-800">
                        {faq.question}
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
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white flex items-center gap-6">
              <div className="bg-white p-2 rounded-lg hidden md:block">
                <Image
                  src="/images/csu-logo.png"
                  alt="South Columbia University Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 id="cta-heading" className="text-3xl font-bold mb-2">
                  {getText("exclusivePartnerCSU")}
                </h2>
                <p className="text-white/80 text-lg">
                  {getText("registerNowLimited")}
                </p>
              </div>
            </div>
            <Link
              href="/thanh-toan?product=khoa-hoc-chung-chi-chuyen-gia"
              aria-label={getText("registerNow")}
            >
              <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-medium">
                {getText("registerNow")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
