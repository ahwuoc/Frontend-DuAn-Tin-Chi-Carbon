"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RegistrationForm from "@/components/registration-form";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import AnimatedGradient from "@/components/animated-gradient";
import contactPageTranslations from "./language";

export default function ContactPage() {
  const { language } = useLanguage();

  const getText = (key: keyof typeof contactPageTranslations) => {
    const translation = contactPageTranslations[key];
    if (
      typeof translation === "object" &&
      translation !== null &&
      "vi" in translation &&
      "en" in translation
    ) {
      return (translation as { vi: string; en: string })[language];
    }
    console.warn(
      `Translation key "${key}" not found or not a simple {vi, en} object.`,
    );
    return String(key); // Return key itself or a default if translation structure is unexpected
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vietnam-farmer-639204_1920.jpg"
            alt={getText("heroTitle")}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {getText("heroTitle")}
            </h1>
            <p className="text-xl text-white/80 mb-8">
              {getText("heroSubtitle")}
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-green-400 hover:text-green-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {getText("backToHome")}
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
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {getText("servicesTitle")}
                </h2>
                <p className="text-gray-600 mb-8">
                  {getText("servicesDescription")}
                </p>

                <div className="space-y-6">
                  {contactPageTranslations.serviceList.map((service, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0 mt-1">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {service.title[language]}
                        </h3>
                        <p className="text-gray-600">
                          {service.description[language]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-6 bg-white rounded-lg shadow-md border border-green-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {getText("contactInfoTitle")}
                  </h3>
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
                      minhtq@carboncreditvietnam.vn |
                      phuongmh@carboncreditvietnam.vn
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
                      {getText("address")}
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
            <h2 className="text-3xl font-bold mb-6 text-white">
              {getText("ctaTitle")}
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {getText("ctaSubtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/san-pham/du-an-tin-chi-carbon">
                <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-medium border border-green-600">
                  {getText("learnMoreProject")}
                </Button>
              </Link>
              <Link href="/faq">
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 bg-white hover:bg-green-50 px-8 py-3 text-lg font-medium"
                >
                  {getText("faqButton")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
