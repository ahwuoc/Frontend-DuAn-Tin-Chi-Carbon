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
import Head from "next/head";
import { generateProductSchema, generateFAQSchema } from "@/lib/schema";
import { PricingSection } from "./card.components";
import translations from "@/app/mockup/translate.mockup";
export default function InternationalCertificateCoursesPage() {
  const { language } = useLanguage();

  const getText = (key: keyof typeof translations["vi"]) => {
    const langData = translations[language] as typeof translations["vi"];
    return langData[key] || translations["vi"][key];
  };

  const courseSchema = generateProductSchema({
    name:
      language === "vi"
        ? "Khóa học chứng chỉ quốc tế về thị trường tín chỉ carbon"
        : "International Certificate Course on Carbon Credit Markets",
    description:
      language === "vi"
        ? getText("courseDescription1") + " " + getText("courseDescription2")
        : getText("courseDescription1") + " " + getText("courseDescription2"),
    url: "https://tinchicarbonvietnam.vn/san-pham/khoa-hoc-chung-chi-quoc-te",
    imageUrl: "https://tinchicarbonvietnam.vn/images/certificate-sample.png",
    price: 9900000,
    priceCurrency: "VND",
  });

  // Tạo schema.org cho FAQ
  const faqSchema = generateFAQSchema([
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
  ]);

  return (
    <>
      <Head>
        <title>
          {language === "vi"
            ? "Khóa học chứng chỉ quốc tế về thị trường tín chỉ carbon"
            : "International Certificate Course on Carbon Credit Markets"}
        </title>
        <meta
          name="description"
          content={
            language === "vi"
              ? getText("courseDescription1")
              : getText("courseDescription1")
          }
        />
        <meta
          name="keywords"
          content={
            language === "vi"
              ? "chứng chỉ quốc tế, tín chỉ carbon, khóa học, ESG, Columbia Southern University"
              : "international certificate, carbon credits, course, ESG, Columbia Southern University"
          }
        />
        <meta
          property="og:title"
          content={
            language === "vi"
              ? "Khóa học chứng chỉ quốc tế về thị trường tín chỉ carbon"
              : "International Certificate Course on Carbon Credit Markets"
          }
        />
        <meta
          property="og:description"
          content={
            language === "vi"
              ? getText("courseDescription1")
              : getText("courseDescription1")
          }
        />
        <meta
          property="og:image"
          content="https://tinchicarbonvietnam.vn/images/certificate-sample.png"
        />
        <meta
          property="og:url"
          content="https://tinchicarbonvietnam.vn/san-pham/khoa-hoc-chung-chi-quoc-te"
        />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section
          className="relative h-[60vh] bg-black"
          aria-labelledby="hero-heading"
        >
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/CSU/Field%20of%20Knowledge%20fixed-5EKBWRBwl9HSxazRMrqpFSy1KttxmO.png"
              alt={getText("courseTitle")}
              fill
              className="object-cover opacity-60"
              priority
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
              <Link href="/thanh-toan?product=khoa-hoc-chung-chi-chuyen-gia">
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
              >
                {getText("downloadSchedule")}
              </Button>
            </div>
          </div>
        </section>

        {/* Video Introduction Section */}
        <section className="relative bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <video
                  className="w-full h-auto"
                  src="https://res.cloudinary.com/dyticflm3/video/upload/v1746549053/CSUxCCV_720p_ea7rgb.mp4"
                  autoPlay
                  muted
                  controls
                  playsInline
                  poster="/images/certificate-sample.png"
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg">
                    <Image
                      src="/images/csu-logo.png"
                      alt="CSU Logo"
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-white font-medium text-base md:text-lg">
                    {language === "vi"
                      ? "Video giới thiệu khóa học chứng chỉ quốc tế"
                      : "International Certificate Course Introduction"}
                  </p>
                </div>
              </div>
              <div className="text-center mt-8">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
                  {language === "vi"
                    ? "Khám phá khóa học chứng chỉ quốc tế"
                    : "Explore the International Certificate Course"}
                </h2>
                <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                  {language === "vi"
                    ? "Xem video giới thiệu để hiểu rõ hơn về khóa học chứng chỉ quốc tế và những lợi ích mà nó mang lại cho sự nghiệp của bạn."
                    : "Watch the introduction video to learn more about the international certificate course and the benefits it brings to your career."}
                </p>
              </div>
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
                <div className="text-6xl font-bold text-green-600 mb-2">
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
                <div className="text-6xl font-bold text-green-600 mb-2">
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
                <div className="text-6xl font-bold text-green-600 mb-2">
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
                    <div className="h-10 w-1 bg-green-600 rounded-full"></div>
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
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">
                      {getText("internationalCertificate")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">
                      {getText("usInstructors")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">
                      {getText("onlineOrOffline")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
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

        {/* Giữ nguyên các phần còn lại của trang */}
        {/* Course Benefits Section */}
        <section
          className="py-20 bg-gray-50"
          aria-labelledby="benefits-heading"
        >
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
                  icon: <Award className="h-12 w-12 text-green-600" />,
                },
                {
                  title: getText("knowledgeTitle"),
                  description: getText("knowledgeDesc"),
                  icon: <BookOpen className="h-12 w-12 text-green-600" />,
                },
                {
                  title: getText("expertTitle"),
                  description: getText("expertDesc"),
                  icon: <Users className="h-12 w-12 text-green-600" />,
                },
                {
                  title: getText("incomeTitle"),
                  description: getText("incomeDesc"),
                  icon: <CheckCircle className="h-12 w-12 text-green-600" />,
                },
                {
                  title: getText("opportunityTitle"),
                  description: getText("opportunityDesc"),
                  icon: <Globe className="h-12 w-12 text-green-600" />,
                },
                {
                  title: getText("flexibleTitle"),
                  description: getText("flexibleDesc"),
                  icon: <Award className="h-12 w-12 text-green-600" />,
                },
              ].map((benefit, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 hover:bg-green-50"
                >
                  <CardContent className="p-8">
                    <div className="bg-green-100 p-4 rounded-full inline-block mb-6">
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

        {/* Giữ nguyên các phần còn lại của trang */}
        {/* Course Structure Section */}
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
                <TabsTrigger value="advanced">
                  {getText("advanced")}
                </TabsTrigger>
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
                          <Clock className="h-4 w-4 mr-1" />
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
                          <Clock className="h-4 w-4 mr-1" />
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
                          <Clock className="h-4 w-4 mr-1" />
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
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {getText("uniqueFeatures")}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
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
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certificate Showcase Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {getText("certificate")}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
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
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
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
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
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
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
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
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
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

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {getText("instructors")}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
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
                        <ul className="list-disc pl-5 space-y-1">
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
                        <ul className="list-disc pl-5 space-y-1">
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

            {/* Tran Thi Nhu Phuong */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="shrink-0">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-green-600">
                      <Image
                        src="/images/tran-thi-nhu-phuong.png"
                        alt="Trần Thị Như Phương"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="bg-white p-2 rounded-lg mt-4 mx-auto w-24 hidden">
                      <Image
                        src="/images/wevn-logo.png"
                        alt="WEVN Logo"
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">
                      Giảng viên tiếng Việt
                    </div>
                    <h3 className="block mt-1 text-2xl leading-tight font-bold text-gray-900">
                      Trần Thị Như Phượng
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Tiến sĩ Giáo dục học, Đại học Sư phạm TP. Hồ Chí Minh
                    </p>
                    <div className="mt-2 text-gray-600">
                      <p className="font-medium">Trưởng bộ môn Phương pháp giảng dạy tiếng Việt</p>
                      <p className="font-medium">Chuyên môn: Ngôn ngữ học, Giáo dục học</p>
                      <p className="font-medium">Vai trò: Giảng viên, Nghiên cứu viên</p>
                    </div>
                    <div className="mt-4 text-gray-600">
                      <p className="mb-2">
                        Giảng viên có hơn 20 năm kinh nghiệm trong đào tạo giáo viên tiểu học và nghiên cứu về phương pháp giảng dạy tiếng Việt.
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Tham gia biên soạn chương trình giáo dục phổ thông mới</li>
                        <li>Tác giả nhiều công trình nghiên cứu khoa học cấp quốc gia</li>
                        <li>Giải thưởng giảng viên xuất sắc năm 2020</li>
                        <li>Thành viên hội đồng chuyên môn Bộ Giáo dục</li>
                      </ul>
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
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/grandmother-4992686_1920.jpg"
                  alt={getText("courseDetails")}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                  {getText("courseDetails")}
                </span>
                <h2 className="text-4xl font-bold mb-6 text-gray-800">
                  {getText("detailedInfo")}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
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
                    <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
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
                    <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
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
                    <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
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
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {getText("tuition")}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                {getText("investInFuture")}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {getText("choosePlan")}
              </p>
            </div>

            <div className="flex  w-full  md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Show product */}
              <PricingSection />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {getText("reviews")}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
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
                    <div
                      className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-green-600"
                      aria-hidden="true"
                    >
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
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {getText("faq")}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600">
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
                  <h2 className="text-3xl font-bold mb-2">
                    {getText("exclusivePartnerCSU")}
                  </h2>
                  <p className="text-white/80 text-lg">
                    {getText("registerNowLimited")}
                  </p>
                </div>
              </div>
              <Link href="/thanh-toan?product=khoa-hoc-chung-chi-chuyen-gia">
                <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-medium">
                  {getText("registerNow")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
