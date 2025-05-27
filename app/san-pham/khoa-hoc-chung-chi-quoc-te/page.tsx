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
// Import file dịch thuật mới thay vì mockup
import internationalCertificateTranslations from "./language";
import { useRef } from "react";

export default function InternationalCertificateCoursesPage() {
  const { language } = useLanguage();
  const handleScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const targetRef = useRef<HTMLDivElement>(null);

  // Helper function to get text based on current language
  const getText = (key: keyof typeof internationalCertificateTranslations) => {
    const translation = internationalCertificateTranslations[key];
    if (
      typeof translation === "object" &&
      translation !== null &&
      "vi" in translation &&
      "en" in translation
    ) {
      return (translation as { vi: string; en: string })[language];
    }
    // Fallback for cases where the key might not be directly a simple string object
    // This could happen if a key points to an object with more complex structure
    console.warn(
      `Translation key "${key}" not found or not a simple {vi, en} object.`,
    );
    return String(key); // Return key itself or a default if translation structure is unexpected
  };

  const courseSchema = generateProductSchema({
    name: internationalCertificateTranslations.courseName[language],
    description:
      internationalCertificateTranslations.courseDescription1[language] +
      " " +
      internationalCertificateTranslations.courseDescription2[language],
    url: "https://tinchicarbonvietnam.vn/san-pham/khoa-hoc-chung-chi-quoc-te",
    imageUrl: "https://tinchicarbonvietnam.vn/images/certificate-sample.png",
    price: 9900000,
    priceCurrency: "VND",
  });

  // Tạo schema.org cho FAQ
  const faqSchema = generateFAQSchema([
    {
      question: internationalCertificateTranslations.faq1[language],
      answer: internationalCertificateTranslations.faqAnswer1[language],
    },
    {
      question: internationalCertificateTranslations.faq2[language],
      answer: internationalCertificateTranslations.faqAnswer2[language],
    },
    {
      question: internationalCertificateTranslations.faq3[language],
      answer: internationalCertificateTranslations.faqAnswer3[language],
    },
    {
      question: internationalCertificateTranslations.faq4[language],
      answer: internationalCertificateTranslations.faqAnswer4[language],
    },
    {
      question: internationalCertificateTranslations.faq5[language],
      answer: internationalCertificateTranslations.faqAnswer5[language],
    },
    {
      question: internationalCertificateTranslations.faq6[language],
      answer: internationalCertificateTranslations.faqAnswer6[language],
    },
    {
      question: internationalCertificateTranslations.faq7[language],
      answer: internationalCertificateTranslations.faqAnswer7[language],
    },
    {
      question: internationalCertificateTranslations.faq8[language],
      answer: internationalCertificateTranslations.faqAnswer8[language],
    },
  ]);

  return (
    <>
      <Head>
        <title>
          {internationalCertificateTranslations.courseName[language]}
        </title>
        <meta
          name="description"
          content={
            internationalCertificateTranslations.courseDescription1[language]
          }
        />
        <meta
          name="keywords"
          content={
            internationalCertificateTranslations.courseKeywords[language]
          }
        />
        <meta
          property="og:title"
          content={internationalCertificateTranslations.courseName[language]}
        />
        <meta
          property="og:description"
          content={
            internationalCertificateTranslations.courseDescription1[language]
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
              alt={internationalCertificateTranslations.courseTitle[language]}
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
            <div className="flex items-center gap-4 mb-6">
              <span className="inline-block py-1 px-3 bg-green-600 text-white text-sm font-medium rounded-full">
                {
                  internationalCertificateTranslations.exclusivePartner[
                    language
                  ]
                }
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
              {internationalCertificateTranslations.courseTitle[language]}
            </h1>
            <p className="text-white text-xl max-w-2xl mb-8">
              {internationalCertificateTranslations.courseSubtitle[language]}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleScroll}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
              >
                {internationalCertificateTranslations.registerCourse[language]}
              </Button>
              <Button
                onClick={handleScroll}
                variant="outline"
                size="lg"
                className="border-white text-white bg-green-600/20 hover:bg-white hover:text-green-600 px-8 py-6 text-lg"
              >
                {
                  internationalCertificateTranslations.downloadSchedule[
                    language
                  ]
                }
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
                    {
                      internationalCertificateTranslations.videoIntroTitle[
                        language
                      ]
                    }
                  </p>
                </div>
              </div>
              <div className="text-center mt-8">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
                  {
                    internationalCertificateTranslations.exploreCourseTitle[
                      language
                    ]
                  }
                </h2>
                <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                  {
                    internationalCertificateTranslations.exploreCourseDesc[
                      language
                    ]
                  }
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
                {
                  internationalCertificateTranslations.educationPartnerBadge[
                    language
                  ]
                }
              </span>
              <h2
                id="about-csu-heading"
                className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 tracking-tight"
              >
                {internationalCertificateTranslations.csuTitle[language]}
              </h2>
              <div
                className="h-1 w-24 bg-green-600 mx-auto mb-6"
                aria-hidden="true"
              ></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {internationalCertificateTranslations.csuSubtitle[language]}
              </p>
            </div>

            {/* Stats - Enhanced with animations and better visuals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
              <div className="bg-white p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600">
                <div className="text-6xl font-bold text-green-600 mb-2">
                  30,000+
                </div>
                <div className="text-xl font-medium text-gray-800">
                  {internationalCertificateTranslations.studentsCount[language]}
                </div>
                <p className="text-gray-600 mt-2">
                  {
                    internationalCertificateTranslations.studentsGlobalDesc[
                      language
                    ]
                  }
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600">
                <div className="text-6xl font-bold text-green-600 mb-2">
                  1,000+
                </div>
                <div className="text-xl font-medium text-gray-800">
                  {internationalCertificateTranslations.facultyCount[language]}
                </div>
                <p className="text-gray-600 mt-2">
                  {internationalCertificateTranslations.facultyDesc[language]}
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600">
                <div className="text-6xl font-bold text-green-600 mb-2">
                  2,000+
                </div>
                <div className="text-xl font-medium text-gray-800">
                  {
                    internationalCertificateTranslations.vietnamStudentsCount[
                      language
                    ]
                  }
                </div>
                <p className="text-gray-600 mt-2">
                  {
                    internationalCertificateTranslations.vietnamStudentsDesc[
                      language
                    ]
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CSU.jpg-0LuxLd7fwKUAiNvVjsUFzuVPYz6qEc.jpeg"
                  alt={
                    internationalCertificateTranslations.graduationCeremony[
                      language
                    ]
                  }
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
                      {
                        internationalCertificateTranslations.graduationCeremony[
                          language
                        ]
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="prose prose-lg max-w-none">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-10 w-1 bg-green-600 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-800 m-0">
                      {
                        internationalCertificateTranslations
                          .globalReputationTitle[language]
                      }
                    </h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    {
                      internationalCertificateTranslations
                        .globalReputationDesc1[language]
                    }
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    {
                      internationalCertificateTranslations
                        .globalReputationDesc2[language]
                    }
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {
                      internationalCertificateTranslations
                        .globalReputationDesc3[language]
                    }
                  </p>
                </div>
                <div className="mt-8">
                  <a
                    href="https://www.columbiasouthern.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {
                      internationalCertificateTranslations.learnMoreCSU[
                        language
                      ]
                    }
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
                  {internationalCertificateTranslations.overviewBadge[language]}
                </span>
                <h2
                  id="overview-heading"
                  className="text-4xl font-bold mb-6 text-gray-800"
                >
                  {
                    internationalCertificateTranslations.aboutCourseTitle[
                      language
                    ]
                  }
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {
                    internationalCertificateTranslations.courseDescription1[
                      language
                    ]
                  }
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  {
                    internationalCertificateTranslations.courseDescription2[
                      language
                    ]
                  }
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">
                      {
                        internationalCertificateTranslations
                          .internationalCertificate[language]
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">
                      {
                        internationalCertificateTranslations.usInstructors[
                          language
                        ]
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">
                      {
                        internationalCertificateTranslations.onlineOrOffline[
                          language
                        ]
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">
                      {
                        internationalCertificateTranslations.practicalProjects[
                          language
                        ]
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-[250px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/H%E1%BB%8Dc%20t%E1%BA%A1i%20Vi%E1%BB%87t%20Nam.jpg-ZUqQvwNI021iu77SGSudXhhRqr7IQS.jpeg"
                    alt={
                      internationalCertificateTranslations.vietnamClassroom[
                        language
                      ]
                    }
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium">
                      {
                        internationalCertificateTranslations.vietnamClassroom[
                          language
                        ]
                      }
                    </p>
                  </div>
                </div>
                <div className="relative h-[250px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/H%E1%BB%8Dc%20t%E1%BA%A1i%20Vi%E1%BB%87t%20Nam%202.jpg-lcsiofkLTfbf3u0dzzqaR2P2cTwpWv.jpeg"
                    alt={
                      internationalCertificateTranslations.inDepthStudy[
                        language
                      ]
                    }
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium">
                      {
                        internationalCertificateTranslations.inDepthStudy[
                          language
                        ]
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Benefits Section */}
        <section
          className="py-20 bg-gray-50"
          aria-labelledby="benefits-heading"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {internationalCertificateTranslations.careerSolution[language]}
              </span>
              <h2
                id="benefits-heading"
                className="text-4xl font-bold mb-4 text-gray-800"
              >
                {
                  internationalCertificateTranslations.whyNeedCertificate[
                    language
                  ]
                }
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {
                  internationalCertificateTranslations.competitiveMarket[
                    language
                  ]
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title:
                    internationalCertificateTranslations.standOutTitle[
                      language
                    ],
                  description:
                    internationalCertificateTranslations.standOutDesc[language],
                  icon: <Award className="h-12 w-12 text-green-600" />,
                },
                {
                  title:
                    internationalCertificateTranslations.knowledgeTitle[
                      language
                    ],
                  description:
                    internationalCertificateTranslations.knowledgeDesc[
                      language
                    ],
                  icon: <BookOpen className="h-12 w-12 text-green-600" />,
                },
                {
                  title:
                    internationalCertificateTranslations.expertTitle[language],
                  description:
                    internationalCertificateTranslations.expertDesc[language],
                  icon: <Users className="h-12 w-12 text-green-600" />,
                },
                {
                  title:
                    internationalCertificateTranslations.incomeTitle[language],
                  description:
                    internationalCertificateTranslations.incomeDesc[language],
                  icon: <CheckCircle className="h-12 w-12 text-green-600" />,
                },
                {
                  title:
                    internationalCertificateTranslations.opportunityTitle[
                      language
                    ],
                  description:
                    internationalCertificateTranslations.opportunityDesc[
                      language
                    ],
                  icon: <Globe className="h-12 w-12 text-green-600" />,
                },
                {
                  title:
                    internationalCertificateTranslations.flexibleTitle[
                      language
                    ],
                  description:
                    internationalCertificateTranslations.flexibleDesc[language],
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

        {/* Course Structure Section */}
        <section
          className="py-20 bg-white"
          aria-labelledby="course-structure-heading"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {internationalCertificateTranslations.courseProgram[language]}
              </span>
              <h2
                id="course-structure-heading"
                className="text-4xl font-bold mb-4 text-gray-800"
              >
                {internationalCertificateTranslations.courseStructure[language]}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {
                  internationalCertificateTranslations.comprehensiveContent[
                    language
                  ]
                }
              </p>
            </div>

            <Tabs defaultValue="basic" className="max-w-4xl mx-auto">
              <TabsList
                className="grid grid-cols-3 mb-8"
                aria-label="Course content levels"
              >
                <TabsTrigger value="basic">
                  {internationalCertificateTranslations.basic[language]}
                </TabsTrigger>
                <TabsTrigger value="intermediate">
                  {internationalCertificateTranslations.intermediate[language]}
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  {internationalCertificateTranslations.advanced[language]}
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="basic"
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  {internationalCertificateTranslations.basicTitle[language]}
                </h3>
                <p className="text-gray-600 mb-6">
                  {internationalCertificateTranslations.basicDesc[language]}
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title:
                        internationalCertificateTranslations.intro[language],
                      duration:
                        internationalCertificateTranslations.introHours[
                          language
                        ],
                      description:
                        internationalCertificateTranslations.introDesc[
                          language
                        ],
                    },
                    {
                      title:
                        internationalCertificateTranslations.concepts[language],
                      duration:
                        internationalCertificateTranslations.conceptsHours[
                          language
                        ],
                      description:
                        internationalCertificateTranslations.conceptsDesc[
                          language
                        ],
                    },
                    {
                      title:
                        internationalCertificateTranslations.history[language],
                      duration:
                        internationalCertificateTranslations.historyHours[
                          language
                        ],
                      description:
                        internationalCertificateTranslations.historyDesc[
                          language
                        ],
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
                  {
                    internationalCertificateTranslations.intermediateTitle[
                      language
                    ]
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {
                    internationalCertificateTranslations.intermediateDesc[
                      language
                    ]
                  }
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title:
                        internationalCertificateTranslations.systems[language],
                      duration:
                        internationalCertificateTranslations.systemsHours[
                          language
                        ],
                      description:
                        internationalCertificateTranslations.systemsDesc[
                          language
                        ],
                    },
                    {
                      title:
                        internationalCertificateTranslations.gases[language],
                      duration:
                        internationalCertificateTranslations.gasesHours[
                          language
                        ],
                      description:
                        internationalCertificateTranslations.gasesDesc[
                          language
                        ],
                    },
                    {
                      title:
                        internationalCertificateTranslations.markets[language],
                      duration:
                        internationalCertificateTranslations.marketsHours[
                          language
                        ],
                      description:
                        internationalCertificateTranslations.marketsDesc[
                          language
                        ],
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
                  {internationalCertificateTranslations.advancedTitle[language]}
                </h3>
                <p className="text-gray-600 mb-6">
                  {internationalCertificateTranslations.advancedDesc[language]}
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title:
                        internationalCertificateTranslations.projectTypes[
                          language
                        ],
                      duration:
                        internationalCertificateTranslations.projectTypesHours[
                          language
                        ],
                      description:
                        internationalCertificateTranslations.projectTypesDesc[
                          language
                        ],
                    },
                    {
                      title:
                        internationalCertificateTranslations.certifiers[
                          language
                        ],
                      duration:
                        internationalCertificateTranslations.certifiersHours[
                          language
                        ],
                      description:
                        internationalCertificateTranslations.certifiersDesc[
                          language
                        ],
                    },
                    {
                      title:
                        internationalCertificateTranslations.practicalProjects[
                          language
                        ],
                      duration:
                        internationalCertificateTranslations
                          .practicalProjectsHours[language],
                      description:
                        internationalCertificateTranslations
                          .practicalProjectsDesc[language],
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
                {internationalCertificateTranslations.uniqueFeatures[language]}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                {internationalCertificateTranslations.onlyInOurCourse[language]}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {
                  internationalCertificateTranslations.uniqueFeaturesDesc[
                    language
                  ]
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title:
                    internationalCertificateTranslations.marketAnalysisTitle[
                      language
                    ],
                  description:
                    internationalCertificateTranslations.marketAnalysisDesc[
                      language
                    ],
                },
                {
                  title:
                    internationalCertificateTranslations.unlimitedTestsTitle[
                      language
                    ],
                  description:
                    internationalCertificateTranslations.unlimitedTestsDesc[
                      language
                    ],
                },
                {
                  title:
                    internationalCertificateTranslations.bothMarketsTitle[
                      language
                    ],
                  description:
                    internationalCertificateTranslations.bothMarketsDesc[
                      language
                    ],
                },
                {
                  title:
                    internationalCertificateTranslations.calculationSkillsTitle[
                      language
                    ],
                  description:
                    internationalCertificateTranslations.calculationSkillsDesc[
                      language
                    ],
                },
                {
                  title:
                    internationalCertificateTranslations.noPrerequisitesTitle[
                      language
                    ],
                  description:
                    internationalCertificateTranslations.noPrerequisitesDesc[
                      language
                    ],
                },
                {
                  title:
                    internationalCertificateTranslations
                      .transferableCreditTitle[language],
                  description:
                    internationalCertificateTranslations.transferableCreditDesc[
                      language
                    ],
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
                {internationalCertificateTranslations.certificate[language]}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                {internationalCertificateTranslations.investOnce[language]}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {internationalCertificateTranslations.certificateDesc[language]}
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
                    {
                      internationalCertificateTranslations.certificateValue[
                        language
                      ]
                    }
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {
                            internationalCertificateTranslations
                              .globalRecognition[language]
                          }
                        </p>
                        <p className="text-gray-600 text-sm">
                          {
                            internationalCertificateTranslations
                              .globalRecognitionDesc[language]
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {
                            internationalCertificateTranslations.officialCEUs[
                              language
                            ]
                          }
                        </p>
                        <p className="text-gray-600 text-sm">
                          {
                            internationalCertificateTranslations
                              .officialCEUsDesc[language]
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {
                            internationalCertificateTranslations.creditTransfer[
                              language
                            ]
                          }
                        </p>
                        <p className="text-gray-600 text-sm">
                          {
                            internationalCertificateTranslations
                              .creditTransferDesc[language]
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {
                            internationalCertificateTranslations.enhanceProfile[
                              language
                            ]
                          }
                        </p>
                        <p className="text-gray-600 text-sm">
                          {
                            internationalCertificateTranslations
                              .enhanceProfileDesc[language]
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 bg-green-100 p-4 rounded-lg">
                    <p className="text-green-800 font-medium">
                      {
                        internationalCertificateTranslations.certificateQuote[
                          language
                        ]
                      }
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
                {internationalCertificateTranslations.instructors[language]}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                {internationalCertificateTranslations.meetExperts[language]}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {internationalCertificateTranslations.instructorsDesc[language]}
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
                          alt={
                            internationalCertificateTranslations.charlesDavis[
                              language
                            ]
                          }
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
                        {
                          internationalCertificateTranslations.instructor[
                            language
                          ]
                        }
                      </div>
                      <h3 className="block mt-1 text-2xl leading-tight font-bold text-gray-900">
                        {
                          internationalCertificateTranslations.charlesDavis[
                            language
                          ]
                        }
                      </h3>
                      <p className="mt-2 text-gray-600">
                        {
                          internationalCertificateTranslations.charlesEducation[
                            language
                          ]
                        }
                      </p>
                      <div className="mt-4 text-gray-600">
                        <p className="mb-2">
                          {
                            internationalCertificateTranslations.charlesDesc[
                              language
                            ]
                          }
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            {
                              internationalCertificateTranslations
                                .charlesAchievement1[language]
                            }
                          </li>
                          <li>
                            {
                              internationalCertificateTranslations
                                .charlesAchievement2[language]
                            }
                          </li>
                          <li>
                            {
                              internationalCertificateTranslations
                                .charlesAchievement3[language]
                            }
                          </li>
                          <li>
                            {
                              internationalCertificateTranslations
                                .charlesAchievement4[language]
                            }
                          </li>
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
                          alt={
                            internationalCertificateTranslations.elwinJones[
                              language
                            ]
                          }
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
                        {
                          internationalCertificateTranslations.instructor[
                            language
                          ]
                        }
                      </div>
                      <h3 className="block mt-1 text-2xl leading-tight font-bold text-gray-900">
                        {
                          internationalCertificateTranslations.elwinJones[
                            language
                          ]
                        }
                      </h3>
                      <p className="mt-2 text-gray-600">
                        {
                          internationalCertificateTranslations.elwinEducation[
                            language
                          ]
                        }
                      </p>
                      <div className="mt-4 text-gray-600">
                        <p className="mb-2">
                          {
                            internationalCertificateTranslations.elwinDesc[
                              language
                            ]
                          }
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            {
                              internationalCertificateTranslations
                                .elwinAchievement1[language]
                            }
                          </li>
                          <li>
                            {
                              internationalCertificateTranslations
                                .elwinAchievement2[language]
                            }
                          </li>
                          <li>
                            {
                              internationalCertificateTranslations
                                .elwinAchievement3[language]
                            }
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tran Thi Nhu Phuong */}
            {/* Tran Thi Nhu Phuong - UPDATED SECTION */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="shrink-0">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-green-600">
                      <Image
                        src="/images/tran-thi-nhu-phuong.png" // Đảm bảo đường dẫn ảnh chính xác
                        alt={
                          internationalCertificateTranslations.tranThiNhuPhuong[
                            language
                          ]
                        }
                        fill
                        className="object-cover"
                        priority // Cân nhắc thêm priority nếu ảnh này quan trọng ở màn hình đầu
                      />
                    </div>
                    {/* Logo WEVN vẫn đang bị ẩn theo code gốc, bạn có thể bỏ class 'hidden' nếu muốn hiển thị */}
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
                  <div className="flex-grow">
                    {" "}
                    {/* Thêm flex-grow để nội dung chiếm không gian còn lại */}
                    <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">
                      {
                        internationalCertificateTranslations
                          .vietnameseInstructorTitle[language] // Tiêu đề cho mục giảng viên này
                      }
                    </div>
                    <h3 className="block mt-1 text-2xl leading-tight font-bold text-gray-900">
                      {
                        internationalCertificateTranslations.tranThiNhuPhuong[
                          language
                        ]
                      }
                    </h3>
                    <p className="mt-2 text-gray-600 text-base">
                      {" "}
                      {/* Cân nhắc kích thước font */}
                      {
                        internationalCertificateTranslations.phuongEducation[
                          language
                        ]
                      }
                    </p>
                    <p className="mt-2 text-gray-700 font-medium text-base">
                      {
                        internationalCertificateTranslations.phuongCurrentRoles[
                          language
                        ]
                      }
                    </p>
                    <p className="mt-1 text-gray-700 text-base">
                      {
                        internationalCertificateTranslations.phuongGeneralRole[
                          language
                        ]
                      }
                    </p>
                    <div className="mt-4 text-gray-600 text-base leading-relaxed">
                      <p className="mb-3">
                        {
                          internationalCertificateTranslations.phuongDesc[
                            language
                          ]
                        }
                      </p>

                      {/* Professional Certifications & Training */}
                      {internationalCertificateTranslations.phuongCertifications &&
                        internationalCertificateTranslations
                          .phuongCertifications.length > 0 && (
                          <>
                            <h4 className="font-semibold mt-4 mb-2 text-gray-700">
                              {
                                internationalCertificateTranslations
                                  .phuongCertificationsTitle[language]
                              }
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {internationalCertificateTranslations.phuongCertifications.map(
                                (item, index) => (
                                  <li key={`phuong-cert-${index}`}>
                                    {typeof item === "object" &&
                                    item !== null &&
                                    item[language as "vi" | "en"]
                                      ? item[language as "vi" | "en"]
                                      : String(item)}
                                  </li>
                                ),
                              )}
                            </ul>
                          </>
                        )}

                      {/* Notable Projects */}
                      {internationalCertificateTranslations.phuongProjects &&
                        internationalCertificateTranslations.phuongProjects
                          .length > 0 && (
                          <>
                            <h4 className="font-semibold mt-4 mb-2 text-gray-700">
                              {
                                internationalCertificateTranslations
                                  .phuongProjectsTitle[language]
                              }
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {internationalCertificateTranslations.phuongProjects.map(
                                (item, index) => (
                                  <li key={`phuong-proj-${index}`}>
                                    {typeof item === "object" &&
                                    item !== null &&
                                    item[language as "vi" | "en"]
                                      ? item[language as "vi" | "en"]
                                      : String(item)}
                                  </li>
                                ),
                              )}
                            </ul>
                          </>
                        )}

                      {/* Industry Recognition */}
                      {internationalCertificateTranslations.phuongRecognition &&
                        internationalCertificateTranslations.phuongRecognition
                          .length > 0 && (
                          <>
                            <h4 className="font-semibold mt-4 mb-2 text-gray-700">
                              {
                                internationalCertificateTranslations
                                  .phuongRecognitionTitle[language]
                              }
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {internationalCertificateTranslations.phuongRecognition.map(
                                (item, index) => (
                                  <li key={`phuong-recog-${index}`}>
                                    {typeof item === "object" &&
                                    item !== null &&
                                    item[language as "vi" | "en"]
                                      ? item[language as "vi" | "en"]
                                      : String(item)}
                                  </li>
                                ),
                              )}
                            </ul>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-3xl mx-auto mt-12 bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                {
                  internationalCertificateTranslations.facultyTeamTitle[
                    language
                  ]
                }
              </h3>
              <p className="text-gray-700 mb-4">
                {internationalCertificateTranslations.facultyDesc1[language]}
              </p>
              <p className="text-gray-700">
                <strong>{language === "vi" ? "Đặc biệt:" : "Special:"}</strong>{" "}
                {internationalCertificateTranslations.facultyDesc2[language]}
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
                  alt={
                    internationalCertificateTranslations.courseDetails[language]
                  }
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                  {internationalCertificateTranslations.courseDetails[language]}
                </span>
                <h2 className="text-4xl font-bold mb-6 text-gray-800">
                  {internationalCertificateTranslations.detailedInfo[language]}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-gray-800">
                        {internationalCertificateTranslations.time[language]}
                      </h3>
                      <p className="text-gray-600">
                        {
                          internationalCertificateTranslations.timeDesc[
                            language
                          ]
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-gray-800">
                        {
                          internationalCertificateTranslations.targetAudience[
                            language
                          ]
                        }
                      </h3>
                      <p className="text-gray-600">
                        {
                          internationalCertificateTranslations
                            .targetAudienceDesc[language]
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <Globe className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-gray-800">
                        {
                          internationalCertificateTranslations.learningFormat[
                            language
                          ]
                        }
                      </h3>
                      <p className="text-gray-600">
                        {
                          internationalCertificateTranslations
                            .learningFormatDesc[language]
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-gray-800">
                        {
                          internationalCertificateTranslations
                            .certificateDetail[language]
                        }
                      </h3>
                      <p className="text-gray-600">
                        {
                          internationalCertificateTranslations
                            .certificateDetailDesc[language]
                        }
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
                {internationalCertificateTranslations.tuition[language]}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                {internationalCertificateTranslations.investInFuture[language]}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {internationalCertificateTranslations.choosePlan[language]}
              </p>
            </div>

            <div
              ref={targetRef}
              className="flex w-full md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
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
                {internationalCertificateTranslations.reviews[language]}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                {
                  internationalCertificateTranslations.studentsFeedback[
                    language
                  ]
                }
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {internationalCertificateTranslations.testimonialDesc[language]}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  content:
                    internationalCertificateTranslations.testimonial1[language],
                  author:
                    internationalCertificateTranslations.testimonialAuthor1[
                      language
                    ],
                  position:
                    internationalCertificateTranslations.testimonialPosition1[
                      language
                    ],
                  avatar:
                    "https://res.cloudinary.com/dyticflm3/image/upload/v1744662839/A_Trung_ngufm5.png",
                },
                {
                  content:
                    internationalCertificateTranslations.testimonial2[language],
                  author:
                    internationalCertificateTranslations.testimonialAuthor2[
                      language
                    ],
                  position:
                    internationalCertificateTranslations.testimonialPosition2[
                      language
                    ],
                  avatar:
                    "https://res.cloudinary.com/dyticflm3/image/upload/v1744662809/Anh_%C4%90%E1%BB%A9c_Anh_qqdwoc.jpg",
                },
                {
                  content:
                    internationalCertificateTranslations.testimonial3[language],
                  author:
                    internationalCertificateTranslations.testimonialAuthor3[
                      language
                    ],
                  position:
                    internationalCertificateTranslations.testimonialPosition3[
                      language
                    ],
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
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {internationalCertificateTranslations.faq[language]}
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                {internationalCertificateTranslations.answerQuestions[language]}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {internationalCertificateTranslations.faqDesc[language]}
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {[
                {
                  question: internationalCertificateTranslations.faq1[language],
                  answer:
                    internationalCertificateTranslations.faqAnswer1[language],
                },
                {
                  question: internationalCertificateTranslations.faq2[language],
                  answer:
                    internationalCertificateTranslations.faqAnswer2[language],
                },
                {
                  question: internationalCertificateTranslations.faq3[language],
                  answer:
                    internationalCertificateTranslations.faqAnswer3[language],
                },
                {
                  question: internationalCertificateTranslations.faq4[language],
                  answer:
                    internationalCertificateTranslations.faqAnswer4[language],
                },
                {
                  question: internationalCertificateTranslations.faq5[language],
                  answer:
                    internationalCertificateTranslations.faqAnswer5[language],
                },
                {
                  question: internationalCertificateTranslations.faq6[language],
                  answer:
                    internationalCertificateTranslations.faqAnswer6[language],
                },
                {
                  question: internationalCertificateTranslations.faq7[language],
                  answer:
                    internationalCertificateTranslations.faqAnswer7[language],
                },
                {
                  question: internationalCertificateTranslations.faq8[language],
                  answer:
                    internationalCertificateTranslations.faqAnswer8[language],
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
                    {
                      internationalCertificateTranslations.exclusivePartnerCSU[
                        language
                      ]
                    }
                  </h2>
                  <p className="text-white/80 text-lg">
                    {
                      internationalCertificateTranslations.registerNowLimited[
                        language
                      ]
                    }
                  </p>
                </div>
              </div>
              <Link href="/thanh-toan?product=khoa-hoc-chung-chi-chuyen-gia">
                <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-medium">
                  {internationalCertificateTranslations.registerNow[language]}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
